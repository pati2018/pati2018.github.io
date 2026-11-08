/*
 * Chor „Aah“ (Concert Choir aus GeneralUser GS) – echte Chor-Aufnahmen, 16 Töne im Abstand einer kleinen Terz;
 * dazwischen wird der nächste Ton leicht umgestimmt (höchstens ±1 Halbton).
 */
window.CHOR = (function () {
  const TOENE = []; for (let m = 48; m <= 93; m += 3) TOENE.push(m);
  const puffer = new Map();   // midi → AudioBuffer
  let laden = null;
  function vorbereiten(ctx) {
    if (laden) return laden;
    laden = Promise.all(TOENE.map(m => fetch(`chor/${m}.mp3`).then(r => r.arrayBuffer())
      .then(a => new Promise((ok, nein) => ctx.decodeAudioData(a, ok, nein))).then(b => puffer.set(m, b)).catch(() => {})));
    return laden;
  }
  const bereit = () => puffer.size > 0;
  function naechster(midi) {
    let best = null; for (const m of puffer.keys()) if (best === null || Math.abs(m - midi) < Math.abs(best - midi)) best = m;
    return best;
  }
  function spiele(ctx, ziel, { midi, t, pegel = .8 }) {
    const m = naechster(midi); if (m === null) return { stop() {} };
    const src = ctx.createBufferSource(); src.buffer = puffer.get(m);
    src.playbackRate.value = Math.pow(2, (midi - m) / 12);
    const g = ctx.createGain(); g.gain.value = pegel;
    src.connect(g); g.connect(ziel); src.start(t);
    let aus = false;
    return { stop(t2) { if (aus) return; aus = true; t2 = Math.max(t2, t + .15);
      g.gain.cancelScheduledValues(t2); g.gain.setValueAtTime(pegel, t2); g.gain.setTargetAtTime(0, t2, .12); try { src.stop(t2 + .8); } catch (e) {} } };
  }
  return { vorbereiten, bereit, spiele, TOENE };
})();
