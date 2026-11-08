/*
 * Video-Aufnahme für die Tischharfe – wie die Video-Aufnahme in MIGA:
 * Harfe (Canvas) + Kamerabild als Bild-im-Bild, dazu der Harfenklang direkt aus der App
 * und auf Wunsch das Mikrofon (geht nur ins Video, nicht auf die Lautsprecher – keine Rückkopplung).
 * Möglichst als MP4 (iPad/iPhone können das), sonst WebM. Höchstens 5 Minuten.
 * Nutzt aus index.html: cv (Harfen-Canvas), ctx, initAudio, recDest; aus kopf.js: KOPF.
 */
const AUF = { rec: null, start: 0, timer: 0, n: 0, loop: 0, cv: null, g: null, stream: null, vid: null, mic: null };
const AUF_MAX = 300;   // Sekunden
const istIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const aufZeit = t => { document.getElementById('aufZeit').textContent = t; };
const aufHinweis = t => { document.getElementById('aufHinweis').textContent = t || ''; };

function aufMime() {
  const liste = ['video/mp4;codecs=avc1.64001F,mp4a.40.2', 'video/mp4;codecs=avc1.4D401F,mp4a.40.2', 'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4;codecs=avc1.42E01E,opus', 'video/mp4;codecs=avc1', 'video/mp4',
    'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  return liste.find(m => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || '';
}

// Welches Kamerabild? Läuft die Kopfsteuerung, deren Bild – sonst eine eigene Kamera nur für die Aufnahme
function aufKameraVideo() {
  if (typeof KOPF !== 'undefined' && KOPF.an && KOPF.vid && KOPF.vid.readyState >= 2) return KOPF.vid;
  if (AUF.vid && AUF.vid.readyState >= 2) return AUF.vid;
  return null;
}
async function aufKameraStart() {
  if (typeof KOPF !== 'undefined' && KOPF.an && KOPF.stream) return;      // Kopfsteuerung liefert das Bild schon
  const s = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }, audio: false });
  AUF.stream = s;
  const v = AUF.vid = document.getElementById('aufVideo');
  v.srcObject = s; document.getElementById('aufVorschau').hidden = false;
  try { await Promise.race([v.play(), new Promise(r => setTimeout(r, 3000))]); } catch (e) {}
}
function aufKameraStop() {
  if (AUF.stream) { AUF.stream.getTracks().forEach(t => t.stop()); AUF.stream = null; }
  if (AUF.vid) AUF.vid.srcObject = null;
  document.getElementById('aufVorschau').hidden = true;
}

// Mikrofon: nur ins Video (recDest), mit Kompressor und Begrenzer wie in MIGA
async function aufMikroStart() {
  try { if (navigator.audioSession) navigator.audioSession.type = 'play-and-record'; } catch (e) {}
  const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: !istIOS, autoGainControl: true } });
  const src = ctx.createMediaStreamSource(s), comp = ctx.createDynamicsCompressor(), auf = ctx.createGain(), lim = ctx.createDynamicsCompressor();
  comp.threshold.value = -30; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = .005; comp.release.value = .25;
  auf.gain.value = 4;
  lim.threshold.value = -2; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = .001; lim.release.value = .1;
  src.connect(comp); comp.connect(auf); auf.connect(lim); lim.connect(recDest);
  AUF.mic = { s, lim };
}
function aufMikroStop() {
  if (!AUF.mic) return;
  try { AUF.mic.lim.disconnect(); } catch (e) {}
  AUF.mic.s.getTracks().forEach(t => t.stop()); AUF.mic = null;
  try { if (navigator.audioSession) navigator.audioSession.type = 'auto'; } catch (e) {}   // iPad: wieder volle Lautstärke
}

// Jedes Bild: Harfe + Kamerabild oben rechts (an derselben Stelle wie die Vorschau auf dem Bildschirm)
function aufZeichne() {
  if (!AUF.rec) return;
  AUF.loop = requestAnimationFrame(aufZeichne);
  const W = AUF.cv.width, H = AUF.cv.height, g2 = AUF.g;
  g2.fillStyle = '#231c17'; g2.fillRect(0, 0, W, H);
  g2.drawImage(cv, 0, 0, W, H);
  const v = aufKameraVideo();
  if (!v || !document.getElementById('aufKamera').checked) return;
  const k = W / cv.clientWidth;
  const box = (typeof KOPF !== 'undefined' && KOPF.an) ? document.getElementById('kopfVorschau') : document.getElementById('aufVorschau');
  let bx, by, bw, bh;
  if (box && !box.hidden && box.offsetWidth) { bx = box.offsetLeft * k; by = box.offsetTop * k; bw = box.offsetWidth * k; bh = box.offsetHeight * k; }
  else { bw = W * .24; bh = bw * .75; bx = W - bw - 10 * k; by = 10 * k; }
  // Ausschnitt 4:3 aus dem Kamerabild (wie object-fit: cover), gespiegelt wie ein Spiegel
  const vw = v.videoWidth || 640, vh = v.videoHeight || 480, za = bw / bh;
  let sw = vw, sh = vw / za; if (sh > vh) { sh = vh; sw = vh * za; }
  const sx = (vw - sw) / 2, sy = (vh - sh) / 2, r = 10 * k;
  g2.save();
  g2.beginPath(); g2.moveTo(bx + r, by); g2.arcTo(bx + bw, by, bx + bw, by + bh, r); g2.arcTo(bx + bw, by + bh, bx, by + bh, r); g2.arcTo(bx, by + bh, bx, by, r); g2.arcTo(bx, by, bx + bw, by, r); g2.closePath();
  g2.save(); g2.clip(); g2.translate(bx + bw, by); g2.scale(-1, 1); g2.drawImage(v, sx, sy, sw, sh, 0, 0, bw, bh); g2.restore();
  g2.lineWidth = 2 * k; g2.strokeStyle = 'rgba(255,255,255,.75)'; g2.stroke();
  g2.restore();
}

async function aufStart() {
  if (AUF.rec) return;
  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) { aufZeit('Aufnahme wird von diesem Browser nicht unterstützt.'); return; }
  initAudio(); ctx.resume();
  aufHinweis('');
  if (document.getElementById('aufKamera').checked) {
    try { await aufKameraStart(); }
    catch (e) { aufHinweis(e && e.name === 'NotAllowedError' ? 'Kamera nicht erlaubt – die Aufnahme läuft ohne Kamerabild. (Safari: aA → Website-Einstellungen → Kamera)' : 'Kamera nicht verfügbar – die Aufnahme läuft ohne Kamerabild.'); }
  }
  if (document.getElementById('aufMikro').checked) {
    if (!recDest) aufHinweis('Dieser Browser kann den Ton nicht mit aufnehmen.');
    else try { await aufMikroStart(); }
    catch (e) { aufHinweis(e && e.name === 'NotAllowedError' ? 'Mikrofon nicht erlaubt – die Aufnahme läuft ohne Mikrofon.' : 'Mikrofon nicht verfügbar – die Aufnahme läuft ohne Mikrofon.'); }
  }
  // Aufnahme-Leinwand in fester Größe (iPad etwas kleiner: weniger Speicher)
  const W = istIOS ? 960 : 1280, H = Math.round(W * cv.height / cv.width / 2) * 2;
  AUF.cv = document.createElement('canvas'); AUF.cv.width = W; AUF.cv.height = H; AUF.g = AUF.cv.getContext('2d');
  const stream = AUF.cv.captureStream(30);
  if (recDest) recDest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
  const mime = aufMime(), opts = mime ? { mimeType: mime } : {};
  opts.videoBitsPerSecond = istIOS ? 2500000 : 5000000; opts.audioBitsPerSecond = 192000;
  let r;
  try { r = new MediaRecorder(stream, opts); }
  catch (e) { try { r = new MediaRecorder(stream); } catch (e2) { aufZeit('Aufnahme konnte nicht starten: ' + e2.message); aufKameraStop(); aufMikroStop(); return; } }
  const typ = r.mimeType || mime || 'video/webm', teile = [];
  r.ondataavailable = e => { if (e.data && e.data.size) teile.push(e.data); };
  r.onstop = () => { if (teile.length) aufNeueAufnahme(new Blob(teile, { type: typ })); else aufZeit('Die Aufnahme ist leer. Bitte noch einmal versuchen.'); };
  r.onerror = e => aufZeit('Fehler bei der Aufnahme: ' + (e.error ? e.error.message : 'unbekannt'));
  AUF.rec = r; aufZeichne();
  r.start(500); AUF.start = Date.now();
  const b = document.getElementById('aufBtn'); b.classList.add('stop'); b.textContent = '■ Aufnahme beenden';
  const max = Math.floor(AUF_MAX / 60) + ':' + String(AUF_MAX % 60).padStart(2, '0');
  AUF.timer = setInterval(() => {
    const s = Math.floor((Date.now() - AUF.start) / 1000);
    aufZeit('● ' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + ' / ' + max);
    if (s >= AUF_MAX) aufStop();
  }, 250);
}
function aufStop() {
  const r = AUF.rec; if (!r) return;
  AUF.rec = null; clearInterval(AUF.timer); cancelAnimationFrame(AUF.loop);
  try { r.stop(); } catch (e) {}
  setTimeout(() => { if (!AUF.rec) { aufKameraStop(); aufMikroStop(); } }, 600);
  const b = document.getElementById('aufBtn'); b.classList.remove('stop'); b.textContent = '● Video aufnehmen';
  aufZeit('max. ' + Math.floor(AUF_MAX / 60) + ':' + String(AUF_MAX % 60).padStart(2, '0'));
}

// Speichern: iPad/iPhone über das Teilen-Menü („In Dateien sichern“ / „Video sichern“), sonst als Download
async function aufTeilen(blob, name) {
  try {
    if (!navigator.canShare || !navigator.share) return false;
    const files = [new File([blob], name, { type: blob.type })];
    if (!navigator.canShare({ files })) return false;
    await navigator.share({ files });
    return true;
  } catch (e) { return !!(e && e.name === 'AbortError'); }
}
function aufDownload(blob, name) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 60000);
}
function aufNeueAufnahme(blob) {
  const n = ++AUF.n, url = URL.createObjectURL(blob), ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
  const d = new Date(), p = x => String(x).padStart(2, '0');
  const name = 'Tischharfe_' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()) + '.' + ext;
  const box = document.createElement('div'); box.className = 'take';
  const vid = document.createElement('video'); vid.src = url; vid.controls = true; vid.playsInline = true;
  const zeile = document.createElement('div'); zeile.className = 'takeKn';
  const speichern = document.createElement('button'); speichern.textContent = '💾 Speichern (.' + ext + ')';
  const loeschen = document.createElement('button'); loeschen.className = 'quiet'; loeschen.textContent = 'Löschen';
  const info = document.createElement('div'); info.className = 'takeInfo';
  info.textContent = 'Aufnahme ' + n + ' · ' + (blob.size / 1048576).toFixed(1) + ' MB' + (ext === 'webm' ? ' · dieser Browser kann kein MP4 aufnehmen, daher .webm' : '') + ' · geht beim Neuladen verloren, wenn nicht gespeichert';
  speichern.onclick = async () => { if (!window.showDirectoryPicker && await aufTeilen(blob, name)) return; aufDownload(blob, name); };
  loeschen.onclick = () => { if (!confirm('Aufnahme ' + n + ' löschen?')) return; vid.pause(); vid.removeAttribute('src'); vid.load(); URL.revokeObjectURL(url); box.remove(); };
  zeile.append(speichern, loeschen); box.append(vid, zeile, info);
  document.getElementById('takes').prepend(box);
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });   // Aufnahmen liegen unter der Harfe – gleich hinscrollen
}

(function () {
  document.getElementById('aufBtn').onclick = () => (AUF.rec ? aufStop() : aufStart());
  try { const e = JSON.parse(localStorage.getItem('tischharfe-aufnahme') || '{}');
    if (e.kamera === false) document.getElementById('aufKamera').checked = false;
    if (e.mikro) document.getElementById('aufMikro').checked = true; } catch (e) {}
  const merke = () => { try { localStorage.setItem('tischharfe-aufnahme', JSON.stringify({ kamera: document.getElementById('aufKamera').checked, mikro: document.getElementById('aufMikro').checked })); } catch (e) {} };
  document.getElementById('aufKamera').onchange = merke;
  document.getElementById('aufMikro').onchange = merke;
  aufZeit('max. ' + Math.floor(AUF_MAX / 60) + ':' + String(AUF_MAX % 60).padStart(2, '0'));
  document.addEventListener('visibilitychange', () => { if (document.hidden && AUF.rec) aufStop(); });
})();
