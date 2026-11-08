/*
 * Kopfsteuerung für die Tischharfe – wie das Klang-Pad in MIGA:
 * Die Nasenspitze führt einen Zeiger über die Saiten (MediaPipe-Gesichtserkennung, läuft auf dem Gerät).
 *   verweilen – Zeiger bleibt kurz auf einer Saite → sie wird gezupft
 *   streichen – jede Saite, über die der Zeiger fährt, klingt (Glissando)
 *   nicken    – jedes Nicken spielt den nächsten Ton des Liedes
 * Nutzt aus index.html: st, saiten, geo, zupf, meldung, setzeModus, neustart.
 */
const KOPF = {
  an: false, stream: null, vid: null, face: null, loop: 0, lastT: -1,
  cx: null, cy: null, px: .5, py: .5, gefunden: false, verloren: 0,
  ziel: -1, seit: 0, gezupft: 0,          // verweilen
  altX: null,                              // streichen
  nickUnten: false,                        // nicken
  einst: { art: 'verweilen', dwell: 500, gain: 4.5 },
};
try { Object.assign(KOPF.einst, JSON.parse(localStorage.getItem('tischharfe-kopf') || '{}')) } catch (e) {}
const kopfMerke = () => { try { localStorage.setItem('tischharfe-kopf', JSON.stringify(KOPF.einst)) } catch (e) {} };
const KOPF_BASIS = new URL('kopf/', location.href).href;

function kopfStatus(t) { const el = document.getElementById('kopfStatus'); if (el) el.textContent = t; }

async function kopfStart() {
  if (KOPF.an) return;
  KOPF.an = true; kopfUi();
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('Dieser Browser gibt die Kamera nicht frei');
    kopfStatus('Kamera wird gestartet …');
    initAudio(); ctx.resume();
    // iPad: getUserMedia direkt im Tipp starten; hängt es, nach 10 s eine klare Meldung
    const gum = navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }, audio: false });
    const stream = await Promise.race([gum, new Promise((_, rej) => setTimeout(() => rej(new Error('Kamera antwortet nicht – in den Einstellungen (Safari → Kamera) erlauben und neu laden')), 10000))]);
    if (!KOPF.an) { stream.getTracks().forEach(t => t.stop()); return; }
    KOPF.stream = stream;
    const v = KOPF.vid = document.getElementById('kopfVideo');
    v.srcObject = stream; document.getElementById('kopfVorschau').hidden = false;
    const spiel = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); return p; };
    try { await Promise.race([spiel(), new Promise(r => setTimeout(r, 3000))]); } catch (e) {}
    for (let k = 0; k < 30 && KOPF.an && v.readyState < 2; k++) await new Promise(r => setTimeout(r, 100));
    if (v.readyState < 2) {   // iPad lässt das Video manchmal nicht von selbst laufen: ein Tipp startet es
      kopfStatus('Einmal auf den Bildschirm tippen, um die Kamera zu starten');
      const tipp = () => spiel(); document.addEventListener('pointerdown', tipp, true);
      for (let k = 0; k < 150 && KOPF.an && v.readyState < 2; k++) await new Promise(r => setTimeout(r, 100));
      document.removeEventListener('pointerdown', tipp, true);
      if (v.readyState < 2) throw new Error('Kein Kamerabild – Kopf aus und wieder an tippen');
    }
    if (!KOPF.face) {
      kopfStatus('Gesichtserkennung wird geladen …');
      const vision = await import(KOPF_BASIS + 'vision_bundle.mjs');
      const fs = await vision.FilesetResolver.forVisionTasks(KOPF_BASIS + 'wasm');
      const opts = d => ({ baseOptions: { modelAssetPath: KOPF_BASIS + 'face_landmarker.task', delegate: d }, runningMode: 'VIDEO', numFaces: 1 });
      try { KOPF.face = await vision.FaceLandmarker.createFromOptions(fs, opts('GPU')); }
      catch (e) { KOPF.face = await vision.FaceLandmarker.createFromOptions(fs, opts('CPU')); }
    }
    if (!KOPF.an) return;
    KOPF.cx = null; kopfStatus('Gerade auf den Bildschirm schauen …');
    KOPF.loop = requestAnimationFrame(kopfSchleife);
  } catch (e) {
    const m = { NotAllowedError: 'Kamera nicht erlaubt – in Safari: aA → Website-Einstellungen → Kamera erlauben', NotFoundError: 'Keine Kamera gefunden', NotReadableError: 'Kamera wird von einer anderen App benutzt' };
    kopfStop(); kopfStatus(m[e && e.name] || ('Kopfsteuerung startet nicht: ' + ((e && e.message) || e)));
  }
}
function kopfStop() {
  KOPF.an = false; cancelAnimationFrame(KOPF.loop);
  if (KOPF.stream) { KOPF.stream.getTracks().forEach(t => t.stop()); KOPF.stream = null; }
  if (KOPF.vid) KOPF.vid.srcObject = null;
  document.getElementById('kopfVorschau').hidden = true;
  KOPF.gefunden = false; KOPF.ziel = -1; KOPF.altX = null; kopfUi(); kopfStatus('');
}

// x-Position des Zeigers (0…1) → Pixel über den Saiten
function kopfZeigerX() {
  const a = saiten[0].x - geo.sp * .6, b = saiten[saiten.length - 1].x + geo.sp * .6;
  return a + KOPF.px * (b - a);
}
function kopfSaite(x) { let best = -1, d = 1e9; saiten.forEach((s, i) => { const dd = Math.abs(s.x - x); if (dd < d) { d = dd; best = i } }); return d <= geo.sp * .5 ? best : -1; }

function kopfSchleife() {
  if (!KOPF.an) return;
  KOPF.loop = requestAnimationFrame(kopfSchleife);
  const v = KOPF.vid;
  if (!v || v.readyState < 2 || v.currentTime === KOPF.lastT) return;
  KOPF.lastT = v.currentTime;
  let r; try { r = KOPF.face.detectForVideo(v, performance.now()); } catch (e) { return; }
  const lm = r && r.faceLandmarks && r.faceLandmarks[0], now = performance.now();
  if (!lm) {
    if (!KOPF.verloren) KOPF.verloren = now;
    if (now - KOPF.verloren > 600) { KOPF.gefunden = false; KOPF.ziel = -1; KOPF.altX = null; kopfStatus('Kein Gesicht erkannt'); }
    return;
  }
  KOPF.verloren = 0;
  const nx = lm[1].x, ny = lm[1].y;   // Nasenspitze
  if (KOPF.cx == null) { KOPF.cx = nx; KOPF.cy = ny; KOPF.px = .5; KOPF.py = .5; }
  if (!KOPF.gefunden) kopfStatus(kopfHinweis());
  KOPF.gefunden = true;
  // Kamerabild ist ungespiegelt: Kopf nach rechts = Nase im Bild nach links = Zeiger nach rechts
  const g = KOPF.einst.gain;
  const tx = Math.min(1, Math.max(0, .5 + (KOPF.cx - nx) * g)), ty = Math.min(1, Math.max(0, .5 + (ny - KOPF.cy) * g * 1.4));
  KOPF.px += (tx - KOPF.px) * .35; KOPF.py += (ty - KOPF.py) * .35;   // glätten

  const art = KOPF.einst.art;
  if (art === 'nicken') {
    // Nicken: Kopf deutlich nach unten → Ton; erst wieder oben ist das nächste Nicken bereit
    if (!KOPF.nickUnten && KOPF.py > .5 + .2) { KOPF.nickUnten = true; kopfNaechsterTon(); }
    else if (KOPF.nickUnten && KOPF.py < .5 + .08) KOPF.nickUnten = false;
    return;
  }
  const x = kopfZeigerX();
  if (art === 'streichen') {
    if (KOPF.altX == null) { KOPF.altX = x; return; }
    if (Math.abs(x - KOPF.altX) < 1.5) return;     // kleines Zittern ignorieren
    const a = Math.min(KOPF.altX, x), b = Math.max(KOPF.altX, x), getroffen = [];
    saiten.forEach((s, i) => { if (s.x > a && s.x <= b) getroffen.push(i) });
    if (x < KOPF.altX) getroffen.reverse();
    const vel = Math.max(.45, Math.min(.95, .5 + (b - a) / geo.sp * .08));
    getroffen.forEach(i => zupf(i, vel));
    KOPF.altX = x;
    return;
  }
  // verweilen (wie das Klang-Pad): kurz auf der Saite bleiben → zupfen
  const i = kopfSaite(x);
  if (i !== KOPF.ziel) { KOPF.ziel = i; KOPF.seit = now; KOPF.gezupft = 0; }
  if (i < 0) return;
  const dwell = KOPF.einst.dwell;
  if (!KOPF.gezupft && now - KOPF.seit >= dwell) { zupf(i, .8); KOPF.gezupft = now; return; }
  // Im Übemodus: bleibt der Zeiger auf der richtigen Saite, wird sie wieder gezupft (Tonwiederholungen wie „A A A A“)
  if (KOPF.gezupft && st.modus === 'ueben' && !st.fertig && st.lied) {
    const z = st.lied.noten[st.pos];
    if (z && z.midi === saiten[i].midi && now - KOPF.gezupft >= Math.max(dwell, 650)) { zupf(i, .8); KOPF.gezupft = now; }
  }
}
function kopfNaechsterTon() {
  if (!st.lied) return;
  if (st.modus !== 'ueben') setzeModus('ueben');
  if (st.fertig) neustart();
  const z = st.lied.noten[st.pos];
  if (z) zupf(saiten.findIndex(s => s.midi === z.midi), .85);
}
function kopfHinweis() {
  return { verweilen: 'Kopf nach links/rechts bewegen – kurz auf einer Saite bleiben zupft sie.',
           streichen: 'Mit dem Kopf über die Saiten fahren – jede Saite klingt.',
           nicken: 'Nicken spielt den nächsten Ton des Liedes.' }[KOPF.einst.art];
}

// Zeiger auf die Harfe zeichnen (wird aus zeichne() aufgerufen)
function kopfZeichnen(now) {
  if (!KOPF.an || !KOPF.gefunden || KOPF.einst.art === 'nicken' || !saiten.length) return;
  const x = kopfZeigerX(), y = geo.oben + (geo.unten - geo.oben) * .78, r = Math.max(12, Math.min(22, geo.sp * .7));
  g.save();
  g.strokeStyle = 'rgba(80,140,230,.35)'; g.lineWidth = 2; g.setLineDash([5, 6]);
  g.beginPath(); g.moveTo(x, geo.oben); g.lineTo(x, geo.unten); g.stroke(); g.setLineDash([]);
  let prog = 0;
  if (KOPF.einst.art === 'verweilen' && KOPF.ziel >= 0) prog = KOPF.gezupft ? 1 : KOPF.einst.dwell > 0 ? Math.min(1, (now - KOPF.seit) / KOPF.einst.dwell) : 1;
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.55)'; g.fill();
  g.lineWidth = 3; g.strokeStyle = 'rgba(40,90,180,.9)'; g.stroke();
  if (prog > 0) { g.beginPath(); g.moveTo(x, y); g.arc(x, y, r - 3, -Math.PI / 2, -Math.PI / 2 + prog * Math.PI * 2); g.closePath(); g.fillStyle = 'rgba(224,168,79,.85)'; g.fill(); }
  g.font = `${Math.round(r)}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('👃', x, y + 1);
  g.restore(); g.textBaseline = 'alphabetic';
}

// ---------- Bedienung ----------
function kopfUi() {
  const b = document.getElementById('kopfBtn');
  b.setAttribute('aria-pressed', KOPF.an); b.textContent = KOPF.an ? '😶 Kopf: an' : '😶 Kopf';
  document.getElementById('kopfOpt').hidden = !KOPF.an;
}
(function () {
  const $ = id => document.getElementById(id);
  $('kopfArt').value = KOPF.einst.art; $('kopfDwell').value = String(KOPF.einst.dwell); $('kopfGain').value = String(KOPF.einst.gain);
  $('kopfBtn').onclick = () => (KOPF.an ? kopfStop() : kopfStart());
  $('kopfMitte').onclick = () => { KOPF.cx = null; kopfStatus('Mitte neu gesetzt. ' + kopfHinweis()); };
  $('kopfArt').onchange = e => { KOPF.einst.art = e.target.value; e.target.blur(); kopfMerke(); KOPF.ziel = -1; KOPF.altX = null; $('kopfDwellL').hidden = KOPF.einst.art !== 'verweilen'; if (KOPF.gefunden) kopfStatus(kopfHinweis()); };
  $('kopfDwell').onchange = e => { KOPF.einst.dwell = +e.target.value; e.target.blur(); kopfMerke(); };
  $('kopfGain').onchange = e => { KOPF.einst.gain = +e.target.value; e.target.blur(); kopfMerke(); };
  $('kopfDwellL').hidden = KOPF.einst.art !== 'verweilen';
  document.addEventListener('visibilitychange', () => { if (document.hidden && KOPF.an) kopfStop(); });
  kopfUi();
})();
