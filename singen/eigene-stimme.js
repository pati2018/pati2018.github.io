/*
 * Eigene Stimme als Instrument: einmal „laaa“ singen, dann singt jeder SoundWhacker in dieser Stimme.
 *
 *   aufnehmen()    – Mikrofon, 3-2-1, ca. 2,5 s aufnehmen (ohne Kompression/Filter des Browsers)
 *   aufbereiten()  – Stille abschneiden, Tonhöhe erkennen (Autokorrelation), Pegel angleichen,
 *                    Schleife im gehaltenen Vokal suchen und weich überblenden (gehaltene Töne brechen nicht ab)
 *   spiele()       – Ton in jeder Höhe: Abspielgeschwindigkeit = genau die gewünschte Note (stimmt automatisch)
 *
 * Gespeichert wird die aufbereitete Aufnahme im Gerätespeicher (16 Bit, Base64).
 */
window.EIGENE = (function () {
  const KEY = 'singen-eigene-stimme';
  let daten = null;   // {sr, f0, ls, le, pcm: Float32Array}
  const puffer = new WeakMap();

  // ---------- Speichern / Laden ----------
  function laden() {
    try {
      const o = JSON.parse(localStorage.getItem(KEY) || 'null'); if (!o) return null;
      const bin = atob(o.b64), i16 = new Int16Array(bin.length / 2);
      for (let i = 0; i < i16.length; i++) i16[i] = (bin.charCodeAt(2 * i) | (bin.charCodeAt(2 * i + 1) << 8)) << 16 >> 16;
      const pcm = new Float32Array(i16.length); for (let i = 0; i < pcm.length; i++) pcm[i] = i16[i] / 32767;
      daten = { sr: o.sr, f0: o.f0, ls: o.ls, le: o.le, pcm };
      return daten;
    } catch (e) { return null; }
  }
  function speichern(d) {
    const i16 = new Int16Array(d.pcm.length); for (let i = 0; i < i16.length; i++) i16[i] = Math.max(-32767, Math.min(32767, Math.round(d.pcm[i] * 32767)));
    const u8 = new Uint8Array(i16.buffer); let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    localStorage.setItem(KEY, JSON.stringify({ sr: d.sr, f0: d.f0, ls: d.ls, le: d.le, b64: btoa(s) }));
  }
  function loeschen() { daten = null; try { localStorage.removeItem(KEY); } catch (e) {} }

  // ---------- Aufnahme ----------
  async function aufnehmen(ctx, sek, pegelFn) {
    try { if (navigator.audioSession) navigator.audioSession.type = 'play-and-record'; } catch (e) {}
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true } });
    const src = ctx.createMediaStreamSource(stream), proz = ctx.createScriptProcessor(4096, 1, 1), stumm = ctx.createGain();
    stumm.gain.value = 0; const teile = [];
    proz.onaudioprocess = e => { const x = e.inputBuffer.getChannelData(0); teile.push(new Float32Array(x)); let p = 0; for (let i = 0; i < x.length; i++) p = Math.max(p, Math.abs(x[i])); if (pegelFn) pegelFn(p); };
    src.connect(proz); proz.connect(stumm); stumm.connect(ctx.destination);
    await new Promise(r => setTimeout(r, sek * 1000));
    proz.disconnect(); src.disconnect(); stream.getTracks().forEach(t => t.stop());
    try { if (navigator.audioSession) navigator.audioSession.type = 'auto'; } catch (e) {}
    const n = teile.reduce((a, t) => a + t.length, 0), pcm = new Float32Array(n); let o = 0;
    teile.forEach(t => { pcm.set(t, o); o += t.length; });
    return { pcm, sr: ctx.sampleRate };
  }

  // ---------- Tonhöhe (normierte Autokorrelation, 80–900 Hz) ----------
  function tonhoehe(x, sr) {
    const minL = Math.floor(sr / 900), maxL = Math.floor(sr / 80), N = Math.min(x.length - maxL, 2048);
    if (N < 512) return 0;
    let best = 0, bestL = 0; const r = new Float32Array(maxL + 1);
    for (let L = minL; L <= maxL; L++) {
      let s = 0, e1 = 0, e2 = 0;
      for (let i = 0; i < N; i++) { s += x[i] * x[i + L]; e1 += x[i] * x[i]; e2 += x[i + L] * x[i + L]; }
      r[L] = s / Math.sqrt(e1 * e2 + 1e-12);
    }
    // erste deutliche Spitze nehmen (vermeidet Oktavfehler nach unten)
    let gMax = 0; for (let L = minL; L <= maxL; L++) gMax = Math.max(gMax, r[L]);
    for (let L = minL + 1; L < maxL; L++) if (r[L] > .9 * gMax && r[L] >= r[L - 1] && r[L] >= r[L + 1]) { best = r[L]; bestL = L; break; }
    if (!bestL || best < .6) return 0;
    const a = r[bestL - 1], b = r[bestL], c = r[bestL + 1], fein = bestL + .5 * (a - c) / (a - 2 * b + c || 1);
    return sr / fein;
  }

  // ---------- Aufbereiten ----------
  function aufbereiten({ pcm, sr }) {
    // Lautstärke-Verlauf in 10-ms-Schritten
    const hop = Math.round(sr * .01), env = [];
    for (let i = 0; i + hop <= pcm.length; i += hop) { let s = 0; for (let j = i; j < i + hop; j++) s += pcm[j] * pcm[j]; env.push(Math.sqrt(s / hop)); }
    const max = Math.max(...env); if (max < .01) return { fehler: 'Zu leise – bitte näher ans Mikrofon und lauter singen.' };
    const schw = max * .12; let a = env.findIndex(v => v > schw), e = env.length - 1 - [...env].reverse().findIndex(v => v > schw);
    if ((e - a) * .01 < .5) return { fehler: 'Zu kurz – bitte ein langes „laaaa“ singen (ca. 2 Sekunden).' };
    const start = Math.max(0, a * hop - Math.round(sr * .015)), ende = Math.min(pcm.length, e * hop + Math.round(sr * .04));
    let x = pcm.slice(start, ende);
    // Tonhöhe im ruhigen Mittelteil (mehrere Messungen, Median)
    const fs = []; for (let p = .25; p <= .75; p += .05) { const i = Math.floor(x.length * p); const f = tonhoehe(x.subarray(i, i + 4096), sr); if (f) fs.push(f); }
    if (fs.length < 3) return { fehler: 'Keine klare Tonhöhe gefunden – bitte gleichmäßig auf einem Ton „laaaa“ singen.' };
    fs.sort((p, q) => p - q); const f0 = fs[Math.floor(fs.length / 2)];
    // Pegel angleichen, Anfang/Ende weich
    let pk = 0; for (const v of x) pk = Math.max(pk, Math.abs(v)); const g = .7 / pk;
    const ein = Math.round(sr * .006), aus = Math.round(sr * .05);
    for (let i = 0; i < x.length; i++) { x[i] *= g; if (i < ein) x[i] *= i / ein; if (i > x.length - aus) x[i] *= (x.length - i) / aus; }
    // Schleife im gehaltenen Vokal: von 40 % bis 75 %, Länge = ganze Schwingungen, Übergang weich überblenden
    const per = sr / f0, ls = Math.floor(x.length * .4), roh = Math.floor(x.length * .75) - ls;
    const le = ls + Math.max(Math.round(per * 4), Math.round(Math.floor(roh / per) * per));
    const xf = Math.min(Math.round(per * 6), Math.floor((le - ls) / 3));
    for (let i = 0; i < xf; i++) { const w = i / xf, k = le - xf + i; x[k] = x[k] * (1 - w) + x[ls - xf + i] * w; }
    return { sr, f0, ls, le, pcm: x };
  }

  function uebernehmen(d) { daten = d; speichern(d); }
  const midiVon = f => 69 + 12 * Math.log2(f / 440);

  // ---------- Abspielen ----------
  function pufferFuer(ctx, D) {
    if (!D) return null;
    let p = puffer.get(ctx); if (p && p.d === D) return p.b;
    const b = ctx.createBuffer(1, D.pcm.length, D.sr); b.getChannelData(0).set(D.pcm);
    puffer.set(ctx, { d: D, b }); return b;
  }
  // d: (optional) eine noch nicht übernommene Aufnahme – zum Probehören
  function spiele(ctx, ziel, { midi, t, pegel = .8, d }) {
    const D = d || daten, b = pufferFuer(ctx, D); if (!b) return { stop() {} };
    const src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = b; src.loop = true; src.loopStart = D.ls / D.sr; src.loopEnd = D.le / D.sr;
    src.playbackRate.value = Math.pow(2, (midi - midiVon(D.f0)) / 12);   // genau auf die Note gestimmt
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(pegel, t + .012);
    src.connect(g); g.connect(ziel); src.start(t);
    let aus = false;
    return { stop(t2) { if (aus) return; aus = true; t2 = Math.max(t2, t + .1); g.gain.cancelScheduledValues(t2); g.gain.setValueAtTime(g.gain.value, t2); g.gain.setTargetAtTime(0, t2, .06); try { src.stop(t2 + .5); } catch (e) {} } };
  }

  return { laden, loeschen, aufnehmen, aufbereiten, uebernehmen, spiele, midiVon, get daten() { return daten; } };
})();
