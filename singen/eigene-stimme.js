/*
 * Eigene Stimme als Instrument: einmal „laaa“ singen, dann singt jeder SoundWhacker in dieser Stimme.
 *
 *   aufnehmen()    – Mikrofon, 3-2-1, ca. 2,5 s aufnehmen (ohne Kompression/Filter des Browsers)
 *   aufbereiten()  – Stille abschneiden, Tonhöhe erkennen (Autokorrelation), Pegel angleichen,
 *                    Schleife im gehaltenen Vokal suchen und weich überblenden (gehaltene Töne brechen nicht ab)
 *   spiele()       – Ton in jeder Höhe, mit TD-PSOLA verschoben: die einzelnen Stimmband-Schwingungen werden enger
 *                    bzw. weiter aneinandergereiht. So ändert sich nur die Tonhöhe, nicht die Klangfarbe
 *                    (kein „Micky-Maus“-Effekt wie beim schnelleren Abspielen). Jede Note wird einmal berechnet.
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

  // ---------- TD-PSOLA: Tonhöhe ändern, Klangfarbe behalten ----------
  const psolaCache = new WeakMap();   // Aufnahme → Map(Note → {pcm, ls, le})
  function perioden(D) {   // örtliche Periodenlänge (in Samples) alle 256 Samples – nur um die bekannte Tonhöhe herum gesucht
    const x = D.pcm, sr = D.sr, hop = 256, P0 = sr / D.f0, P = [], lo = Math.floor(P0 * .75), hi = Math.ceil(P0 * 1.33), N = Math.round(P0 * 3);
    for (let i = 0; i + N + hi < x.length; i += hop) {
      let best = -1, bl = 0;
      for (let L = lo; L <= hi; L++) { let s = 0, e1 = 0, e2 = 0; for (let k = 0; k < N; k++) { const a = x[i + k], b = x[i + k + L]; s += a * b; e1 += a * a; e2 += b * b; } const r = s / Math.sqrt(e1 * e2 + 1e-12); if (r > best) { best = r; bl = L; } }
      P.push(best > .5 ? bl : P0);
    }
    if (!P.length) P.push(P0);
    const g = P.map((_, i) => { const w = P.slice(Math.max(0, i - 2), i + 3).sort((a, b) => a - b); return w[w.length >> 1]; });   // Median glätten
    return i => g[Math.min(g.length - 1, Math.max(0, Math.floor(i / hop)))];
  }
  function marken(D, Pv) {   // eine Marke pro Stimmband-Schwingung (auf der Schwingungsspitze)
    const x = D.pcm, m = []; let p = Math.round(Pv(0)), best = 0;
    for (let i = 0; i < p && i < x.length; i++) if (x[i] > x[best]) best = i;
    for (let k = best; k < x.length;) {
      m.push(k); const per = Pv(k), mitte = k + per, r = Math.round(per * .2);
      let n = Math.round(mitte); for (let i = Math.round(mitte - r); i <= mitte + r && i < x.length; i++) if (x[i] > x[n]) n = i;
      if (n <= k) n = Math.round(k + per); k = n;
    }
    return m;
  }
  function psola(D, zielF) {
    if (!D._ana) { const Pv = perioden(D); D._ana = { Pv, M: marken(D, Pv) }; }   // einmal pro Aufnahme
    const x = D.pcm, sr = D.sr, len = x.length, { Pv, M } = D._ana, faktor = D.f0 / zielF;
    const y = new Float32Array(len);
    let j = 0;
    for (let t = M[0]; t < len;) {
      while (j < M.length - 1 && Math.abs(M[j + 1] - t) <= Math.abs(M[j] - t)) j++;   // nächste Analyse-Marke
      const Pa = Math.round(Pv(M[j])), m = M[j];
      for (let i = -Pa; i <= Pa; i++) {
        const q = m + i, z = Math.round(t) + i; if (q < 0 || q >= len || z < 0 || z >= len) continue;
        y[z] += x[q] * (.5 + .5 * Math.cos(Math.PI * i / Pa));   // Hann-Fenster über zwei Schwingungen
      }
      t += Pv(m) * faktor;   // neue Periodenlänge: natürliche Schwankungen bleiben, nur verschoben
    }
    // Lautstärke wie im Original (im gehaltenen Teil gemessen)
    let ex = 0, ey = 0; for (let i = D.ls; i < D.le; i++) { ex += x[i] * x[i]; ey += y[i] * y[i]; }
    const g = Math.sqrt(ex / (ey || 1)); for (let i = 0; i < len; i++) y[i] *= g;
    // Schleife neu: ganze Schwingungen der neuen Tonhöhe, weich überblenden
    const per = sr / zielF, ls = D.ls, n = Math.max(4, Math.floor((D.le - D.ls) / per)), le = Math.min(len - 1, ls + Math.round(n * per));
    const xf = Math.min(Math.round(per * 6), Math.floor((le - ls) / 3));
    for (let i = 0; i < xf; i++) { const w = i / xf, k = le - xf + i; y[k] = y[k] * (1 - w) + y[ls - xf + i] * w; }
    return { pcm: y, ls, le };
  }
  function fuerNote(D, midi) {
    let c = psolaCache.get(D); if (!c) { c = new Map(); psolaCache.set(D, c); }
    const key = Math.round(midi * 100) / 100;
    if (!c.has(key)) c.set(key, psola(D, 440 * Math.pow(2, (key - 69) / 12)));
    return c.get(key);
  }

  // ---------- Abspielen ----------
  const pufferCache = new WeakMap();   // berechneter Ton → AudioBuffer je AudioContext
  function spiele(ctx, ziel, { midi, t, pegel = .8, d }) {
    const D = d || daten; if (!D) return { stop() {} };
    const N = fuerNote(D, midi);
    let b = pufferCache.get(N); if (!b || b.ctx !== ctx) { const ab = ctx.createBuffer(1, N.pcm.length, D.sr); ab.getChannelData(0).set(N.pcm); b = { ctx, ab }; pufferCache.set(N, b); }
    const src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = b.ab; src.loop = true; src.loopStart = N.ls / D.sr; src.loopEnd = N.le / D.sr;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(pegel, t + .012);
    src.connect(g); g.connect(ziel); src.start(t);
    let aus = false;
    return { stop(t2) { if (aus) return; aus = true; t2 = Math.max(t2, t + .1); g.gain.cancelScheduledValues(t2); g.gain.setValueAtTime(g.gain.value, t2); g.gain.setTargetAtTime(0, t2, .06); try { src.stop(t2 + .5); } catch (e) {} } };
  }

  // alle Töne schon im Voraus berechnen, damit der erste Schlag sofort klingt
  function vorbereiten(midis, d) { const D = d || daten; if (D) midis.forEach(m => fuerNote(D, m)); }

  return { laden, loeschen, aufnehmen, aufbereiten, uebernehmen, spiele, vorbereiten, midiVon, get daten() { return daten; } };
})();
