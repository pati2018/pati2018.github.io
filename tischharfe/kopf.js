/*
 * Kopfsteuerung für die Tischharfe (Gesichtserkennung wie in MIGA, läuft auf dem Gerät):
 * Jede Kopfbewegung nach links, rechts, oben oder unten (Nicken) spielt den nächsten Ton des Liedes –
 * wie ein Tippen. Danach erst zurück zur Mitte, dann zählt die nächste Bewegung.
 * Richtung: 'alle' | 'seite' (nur links/rechts) | 'nicken' (nur hoch/runter)
 * Nutzt aus index.html: st, saiten, geo, g, zupf, setzeModus, neustart, initAudio, ctx.
 */
const KOPF = {
  an: false, stream: null, vid: null, face: null, loop: 0, lastT: -1,
  cx: null, cy: null, px: .5, py: .5, gefunden: false, verloren: 0,
  bereit: true, seite: 0, zuletzt: 0, blitz: 0,
  einst: { gain: 9, nick: 2.5, richtung: 'alle' },   // gain: Stufe links/rechts · nick: Nickwinkel in Grad
  verlauf: [],                             // letzte Rohwerte für den Median (gegen Zittern)
};
try { const e = JSON.parse(localStorage.getItem('tischharfe-kopf') || '{}'); if (e.gain) KOPF.einst.gain = e.gain; if (e.nick) KOPF.einst.nick = e.nick; if (['alle', 'seite', 'nicken'].includes(e.richtung)) KOPF.einst.richtung = e.richtung; } catch (e) {}
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

const KOPF_AUS = .2, KOPF_MITTE = .08;   // Auslöseschwelle und Rückkehrzone (Abstand von der Mitte, 0…0,5)

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
  const nx = lm[1].x, ny = lm[1].y;   // Nasenspitze
  const neig = kopfNeigung(lm, v);     // Nicken als Winkel (Grad), unabhängig davon, wo der Kopf im Bild ist
  if (KOPF.cx == null) { KOPF.cx = nx; KOPF.cy = ny; KOPF.n0 = neig; KOPF.px = .5; KOPF.py = .5; KOPF.bereit = true; KOPF.verlauf = []; }
  if (KOPF.n0 == null && neig != null) KOPF.n0 = neig;
  if (!KOPF.gefunden) kopfStatus(kopfHinweis());
  KOPF.gefunden = true;
  // Links/rechts: Nasenspitze (Kamerabild ungespiegelt: Kopf nach rechts = Nase im Bild nach links).
  // Hoch/runter: Neigungswinkel – Auslösen bei „nick“ Grad (eigene Auswahl, 6° bis 0,7°).
  // Ohne Tiefeninformation ersatzweise die Nasenspitze (empfindlicher als links/rechts, weil Nicken sie weniger bewegt).
  const gain = KOPF.einst.gain, nick = KOPF.einst.nick;   // Nicken löst bei „nick“ Grad aus (eigene Einstellung)
  const dy = neig != null && KOPF.n0 != null ? kopfWinkelDiff(neig, KOPF.n0) * KOPF_AUS / nick : (ny - KOPF.cy) * (60 / nick) * 2.2;
  const tx = Math.min(1, Math.max(0, .5 + (KOPF.cx - nx) * gain)), ty = Math.min(1, Math.max(0, .5 + dy));
  // Glätten: Median der letzten 5 Bilder, dann gleitender Mittelwert – je feiner die Stufe, desto stärker,
  // damit das natürliche Zittern der Erkennung bei kleinen Bewegungen keine Töne auslöst
  KOPF.verlauf.push([tx, ty]); if (KOPF.verlauf.length > 5) KOPF.verlauf.shift();
  const med = i => { const a = KOPF.verlauf.map(v => v[i]).sort((x, y) => x - y); return a[a.length >> 1]; };
  const glattX = Math.min(.5, 8 / gain), glattY = Math.min(.5, nick * .16);
  KOPF.px += (med(0) - KOPF.px) * glattX; KOPF.py += (med(1) - KOPF.py) * glattY;
  const ri = KOPF.einst.richtung;
  const ax = ri === 'nicken' ? 0 : Math.abs(KOPF.px - .5), ay = ri === 'seite' ? 0 : Math.abs(KOPF.py - .5);
  const weg = Math.max(ax, ay), inMitte = ax < KOPF_MITTE && ay < KOPF_MITTE;
  if (KOPF.bereit && weg > KOPF_AUS && now - KOPF.zuletzt > 150) {
    KOPF.bereit = false; KOPF.zuletzt = now; KOPF.blitz = now;
    kopfNaechsterTon();
  } else if (!KOPF.bereit && inMitte) {
    KOPF.bereit = true;
  }
  // In Ruhe die Mitte langsam nachführen, falls man sich mit der Zeit etwas verschiebt
  if (KOPF.bereit && inMitte) { KOPF.cx += (nx - KOPF.cx) * .01; KOPF.cy += (ny - KOPF.cy) * .01; if (neig != null && KOPF.n0 != null) KOPF.n0 += kopfWinkelDiff(neig, KOPF.n0) * .01; }
}
// Neigung (Nicken) aus Stirn (10) und Kinn (152) in 3D: Winkel der Linie Stirn→Kinn zur Bildebene
function kopfNeigung(lm, v) {
  const a = lm[10], b = lm[152];
  if (!a || !b || typeof a.z !== 'number' || typeof b.z !== 'number') return null;
  const s = (v.videoHeight || 480) / (v.videoWidth || 640);   // y ist auf die Bildhöhe bezogen, z (wie x) auf die Breite
  return Math.atan2(b.z - a.z, (b.y - a.y) * s) * 180 / Math.PI;
}
const kopfWinkelDiff = (a, b) => ((a - b + 540) % 360) - 180;
function kopfNaechsterTon() {
  if (!st.lied) return;
  if (st.modus !== 'ueben') setzeModus('ueben');
  if (st.fertig) neustart();
  const z = st.lied.noten[st.pos];
  if (z) zupf(saiten.findIndex(s => s.midi === z.midi), .85);
}
function kopfHinweis() {
  return { alle: 'Kopf nach links, rechts, hoch oder runter = nächster Ton. Danach kurz zurück zur Mitte.',
           seite: 'Kopf nach links oder rechts drehen = nächster Ton. Danach kurz zurück zur Mitte.',
           nicken: 'Nicken (Kopf hoch oder runter) = nächster Ton. Danach kurz zurück zur Mitte.' }[KOPF.einst.richtung];
}

// Kleines Feld unter dem Kamerabild: wo steht der Kopf, ab wo löst es aus (wird aus zeichne() aufgerufen)
function kopfZeichnen(now) {
  if (!KOPF.an || !KOPF.gefunden || !saiten.length) return;
  const vb = document.getElementById('kopfVorschau'), w = vb.offsetWidth, hh = Math.round(w * .55);
  const x0 = vb.offsetLeft, y0 = vb.offsetTop + vb.offsetHeight + 8, r = KOPF.einst.richtung;
  const X = f => x0 + f * w, Y = f => y0 + f * hh;
  g.save();
  g.fillStyle = 'rgba(232,150,40,.85)'; rundRect(x0, y0, w, hh, 10); g.fill();            // außen: hier löst es aus
  // innen: ruhig (Richtungen, die nicht zählen, gehen bis zum Rand)
  const ix = r === 'nicken' ? 0 : .5 - KOPF_AUS, iy = r === 'seite' ? 0 : .5 - KOPF_AUS;
  g.fillStyle = 'rgba(250,245,235,.92)'; rundRect(X(ix), Y(iy), w * (1 - 2 * ix), hh * (1 - 2 * iy), 8); g.fill();
  const mx = r === 'nicken' ? 0 : .5 - KOPF_MITTE, my = r === 'seite' ? 0 : .5 - KOPF_MITTE;
  g.fillStyle = 'rgba(120,190,110,.6)'; rundRect(X(mx), Y(my), w * (1 - 2 * mx), hh * (1 - 2 * my), 5); g.fill();   // Mitte
  g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,.7)'; rundRect(x0, y0, w, hh, 10); g.stroke();
  const blitz = Math.max(0, 1 - (now - KOPF.blitz) / 350), px = X(KOPF.px), py = Y(KOPF.py), rr = 9 + blitz * 6;
  g.beginPath(); g.arc(px, py, rr, 0, Math.PI * 2);
  g.fillStyle = KOPF.bereit ? '#3f6fd0' : '#b0611a'; g.fill(); g.strokeStyle = '#fff'; g.stroke();
  g.font = '11px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('👃', px, py + 1);
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
  const stufen = [...$('kopfGain').options].map(o => +o.value);
  if (!stufen.includes(KOPF.einst.gain)) KOPF.einst.gain = stufen.reduce((a, b) => Math.abs(b - KOPF.einst.gain) < Math.abs(a - KOPF.einst.gain) ? b : a);
  const nicks = [...$('kopfNick').options].map(o => +o.value);
  if (!nicks.includes(KOPF.einst.nick)) KOPF.einst.nick = 2.5;
  $('kopfGain').value = String(KOPF.einst.gain); $('kopfNick').value = String(KOPF.einst.nick); $('kopfRichtung').value = KOPF.einst.richtung;
  const sichtbar = () => { $('kopfGainL').hidden = KOPF.einst.richtung === 'nicken'; $('kopfNickL').hidden = KOPF.einst.richtung === 'seite'; };
  sichtbar();
  $('kopfBtn').onclick = () => (KOPF.an ? kopfStop() : kopfStart());
  $('kopfMitte').onclick = () => { KOPF.cx = null; kopfStatus('Mitte neu gesetzt. ' + kopfHinweis()); };
  $('kopfGain').onchange = e => { KOPF.einst.gain = +e.target.value; e.target.blur(); kopfMerke(); };
  $('kopfNick').onchange = e => { KOPF.einst.nick = +e.target.value; e.target.blur(); kopfMerke(); };
  $('kopfRichtung').onchange = e => { KOPF.einst.richtung = e.target.value; e.target.blur(); kopfMerke(); sichtbar(); KOPF.bereit = true; if (KOPF.gefunden) kopfStatus(kopfHinweis()); };
  document.addEventListener('visibilitychange', () => { if (document.hidden && KOPF.an) kopfStop(); });
  kopfUi();
})();
