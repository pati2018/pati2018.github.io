/*
 * Kopfsteuerung für die Tischharfe (Gesichtserkennung wie in MIGA, läuft auf dem Gerät):
 * Jede Kopfbewegung nach links oder rechts spielt den nächsten Ton des Liedes – wie ein Tippen.
 * Danach erst zurück zur Mitte, dann zählt die nächste Bewegung.
 * Nutzt aus index.html: st, saiten, geo, g, zupf, setzeModus, neustart, initAudio, ctx.
 */
const KOPF = {
  an: false, stream: null, vid: null, face: null, loop: 0, lastT: -1,
  cx: null, cy: null, px: .5, py: .5, gefunden: false, verloren: 0,
  bereit: true, seite: 0, zuletzt: 0, blitz: 0,
  einst: { gain: 4.5 },
};
try { const e = JSON.parse(localStorage.getItem('tischharfe-kopf') || '{}'); if (e.gain) KOPF.einst.gain = e.gain; } catch (e) {}
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
  KOPF.gefunden = false; KOPF.bereit = true; kopfUi(); kopfStatus('');
}

const KOPF_AUS = .2, KOPF_MITTE = .08;   // Auslöseschwelle und Rückkehrzone (Anteil der halben Bildbreite)

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
    if (now - KOPF.verloren > 600) { KOPF.gefunden = false; kopfStatus('Kein Gesicht erkannt'); }
    return;
  }
  KOPF.verloren = 0;
  const nx = lm[1].x;   // Nasenspitze
  if (KOPF.cx == null) { KOPF.cx = nx; KOPF.px = .5; KOPF.bereit = true; }
  if (!KOPF.gefunden) kopfStatus(kopfHinweis());
  KOPF.gefunden = true;
  // Kamerabild ist ungespiegelt: Kopf nach rechts = Nase im Bild nach links
  const tx = Math.min(1, Math.max(0, .5 + (KOPF.cx - nx) * KOPF.einst.gain));
  KOPF.px += (tx - KOPF.px) * .5;
  const aus = KOPF.px - .5;
  if (KOPF.bereit && Math.abs(aus) > KOPF_AUS && now - KOPF.zuletzt > 150) {
    KOPF.bereit = false; KOPF.seite = Math.sign(aus); KOPF.zuletzt = now; KOPF.blitz = now;
    kopfNaechsterTon();
  } else if (!KOPF.bereit && Math.abs(aus) < KOPF_MITTE) {
    KOPF.bereit = true; KOPF.seite = 0;
  }
  // In Ruhe die Mitte langsam nachführen, falls man sich mit der Zeit etwas verschiebt
  if (KOPF.bereit && Math.abs(aus) < KOPF_MITTE) KOPF.cx += (nx - KOPF.cx) * .01;
}
function kopfNaechsterTon() {
  if (!st.lied) return;
  if (st.modus !== 'ueben') setzeModus('ueben');
  if (st.fertig) neustart();
  const z = st.lied.noten[st.pos];
  if (z) zupf(saiten.findIndex(s => s.midi === z.midi), .85);
}
function kopfHinweis() { return 'Kopf nach links oder rechts drehen = nächster Ton. Danach kurz zurück zur Mitte.'; }

// Anzeige unten auf der Harfe: wo steht der Kopf, ab wo löst es aus (wird aus zeichne() aufgerufen)
function kopfZeichnen(now) {
  if (!KOPF.an || !KOPF.gefunden || !saiten.length) return;
  // direkt unter dem Kamerabild oben rechts
  const vb = document.getElementById('kopfVorschau'), w = vb.offsetWidth, cx = vb.offsetLeft + w / 2, y = vb.offsetTop + vb.offsetHeight + 16, h = 12;
  const xv = f => cx + (f - .5) * w;
  g.save();
  g.fillStyle = 'rgba(40,30,20,.18)'; rundRect(cx - w / 2, y - h / 2, w, h, h / 2); g.fill();
  g.fillStyle = 'rgba(224,168,79,.35)';                       // Auslösebereiche links und rechts
  rundRect(cx - w / 2, y - h / 2, w * (.5 - KOPF_AUS), h, h / 2); g.fill();
  rundRect(xv(.5 + KOPF_AUS), y - h / 2, w * (.5 - KOPF_AUS), h, h / 2); g.fill();
  g.fillStyle = 'rgba(120,190,110,.45)'; g.fillRect(xv(.5 - KOPF_MITTE), y - h / 2, w * KOPF_MITTE * 2, h);   // Mitte
  const blitz = Math.max(0, 1 - (now - KOPF.blitz) / 350);
  g.beginPath(); g.arc(xv(KOPF.px), y, h * .9 + blitz * 6, 0, Math.PI * 2);
  g.fillStyle = KOPF.bereit ? '#3f6fd0' : '#b0611a'; g.fill(); g.lineWidth = 2; g.strokeStyle = '#fff'; g.stroke();
  g.font = `${Math.round(h * 1.1)}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('👃', xv(KOPF.px), y + 1);
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
  $('kopfGain').value = String(KOPF.einst.gain);
  $('kopfBtn').onclick = () => (KOPF.an ? kopfStop() : kopfStart());
  $('kopfMitte').onclick = () => { KOPF.cx = null; kopfStatus('Mitte neu gesetzt. ' + kopfHinweis()); };
  $('kopfGain').onchange = e => { KOPF.einst.gain = +e.target.value; e.target.blur(); kopfMerke(); };
  document.addEventListener('visibilitychange', () => { if (document.hidden && KOPF.an) kopfStop(); });
  kopfUi();
})();
