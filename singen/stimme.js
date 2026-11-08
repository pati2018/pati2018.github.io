/*
 * Künstliche Singstimme (Formant-Synthese) – singt „la“, „lu“, „li“, „na“ oder „aah“.
 *
 *   Stimmbänder:  obertonreicher Ton mit leichtem Ansingen von unten, Vibrato und etwas Atemhauch
 *   Mund/Rachen:  fünf parallele Formant-Filter; sie gleiten in ~70 ms vom Konsonanten („l“/„n“) zum Vokal
 *
 * Formant-Werte nach den klassischen Tabellen für Sopran- und Bassstimmen (Frequenz, Lautstärke, Bandbreite).
 * Läuft mit jedem AudioContext – auch OfflineAudioContext (für Hörproben).
 */
window.STIMME = (function () {
  // [Frequenz Hz, Pegel dB, Bandbreite Hz] × 5
  const VOKALE = {
    frau: {
      a: [[800, 0, 80], [1150, -6, 90], [2900, -32, 120], [3900, -20, 130], [4950, -50, 140]],
      u: [[350, 0, 50], [600, -20, 60], [2700, -17, 170], [2900, -14, 180], [3300, -26, 200]],
      i: [[270, 0, 60], [2140, -12, 90], [2950, -26, 100], [3900, -26, 120], [4950, -44, 120]],
    },
    mann: {
      a: [[600, 0, 60], [1040, -7, 70], [2250, -9, 110], [2450, -9, 120], [2750, -20, 130]],
      u: [[350, 0, 40], [600, -20, 80], [2400, -32, 100], [2675, -28, 120], [2950, -36, 120]],
      i: [[250, 0, 60], [1750, -30, 90], [2600, -16, 100], [3050, -22, 120], [3340, -28, 120]],
    },
  };
  // Konsonanten als Start-Formanten (weich, stimmhaft)
  const KONS = {
    l: [[360, 0, 80], [1150, -12, 120], [2700, -30, 150], [3600, -36, 200], [4500, -50, 200]],
    n: [[250, 0, 60], [1500, -24, 150], [2600, -34, 200], [3500, -40, 200], [4500, -50, 200]],
  };
  const STIMMEN = {
    kind: { name: 'Kind', typ: 'frau', formant: 1.12, grund: 72, hauch: .05 },
    frau: { name: 'Frau', typ: 'frau', formant: 1.0, grund: 64, hauch: .04 },
    mann: { name: 'Mann', typ: 'mann', formant: 1.0, grund: 52, hauch: .03 },
  };
  const SILBEN = { la: ['l', 'a'], lu: ['l', 'u'], li: ['l', 'i'], na: ['n', 'a'], a: [null, 'a'] };

  const cache = new WeakMap();   // je AudioContext: Wellenform und Rauschen
  function teile(ctx) {
    if (cache.has(ctx)) return cache.get(ctx);
    // Stimmband-Welle: Obertöne fallen mit ~1/n^1,25 (weicher als ein Sägezahn)
    const n = 60, re = new Float32Array(n + 1), im = new Float32Array(n + 1);
    for (let k = 1; k <= n; k++) im[k] = 1 / Math.pow(k, 1.25);
    const welle = ctx.createPeriodicWave(re, im);
    const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = nb.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const t = { welle, rauschen: nb }; cache.set(ctx, t); return t;
  }
  const dbZuGain = db => Math.pow(10, db / 20);

  /*
   * Singt einen Ton. Gibt {stop(zeit)} zurück.
   *   midi: Tonhöhe · t: Startzeit · stimme: 'kind'|'frau'|'mann' · silbe: 'la'|'lu'|'li'|'na'|'a'
   *   pegel: 0…1 · vibrato: 0…1 · ziel: AudioNode
   */
  function singe(ctx, ziel, { midi, t, stimme = 'frau', silbe = 'la', pegel = .8, vibrato = .6 }) {
    const S = STIMMEN[stimme] || STIMMEN.frau, [kons, vok] = SILBEN[silbe] || SILBEN.la;
    const V = VOKALE[S.typ][vok], K = kons ? KONS[kons] : V, T = teile(ctx);
    const f0 = 440 * Math.pow(2, (midi - 69) / 12);

    // Stimmbänder: leicht von unten ansingen, dann Vibrato, dazu ein langsames „Schwanken“ wie bei echten Stimmen
    const osc = ctx.createOscillator(); osc.setPeriodicWave(T.welle);
    osc.frequency.setValueAtTime(f0, t);
    osc.detune.setValueAtTime(-45, t); osc.detune.setTargetAtTime(0, t, .035);
    const vib = ctx.createOscillator(), vibG = ctx.createGain();
    vib.frequency.value = 5.2 + Math.random() * .6;
    vibG.gain.setValueAtTime(0, t); vibG.gain.setTargetAtTime(28 * vibrato, t + .28, .25);
    vib.connect(vibG); vibG.connect(osc.detune);
    const drift = ctx.createOscillator(), driftG = ctx.createGain();
    drift.frequency.value = .35 + Math.random() * .3; driftG.gain.value = 6;
    drift.connect(driftG); driftG.connect(osc.detune);

    // Atemhauch
    const hauch = ctx.createBufferSource(); hauch.buffer = T.rauschen; hauch.loop = true;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 900;
    const hauchG = ctx.createGain(); hauchG.gain.value = S.hauch;
    hauch.connect(hp); hp.connect(hauchG);

    const quelle = ctx.createGain(); quelle.gain.value = 1;
    osc.connect(quelle); hauchG.connect(quelle);

    // Mund und Rachen: fünf Formant-Filter parallel; vom Konsonanten zum Vokal gleiten
    const summe = ctx.createGain(), uebergang = kons ? .028 : .001, vokalAb = t + (kons ? .045 : 0);
    for (let k = 0; k < 5; k++) {
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
      const g = ctx.createGain();
      const [fk, dbk, bwk] = K[k], [fv, dbv, bwv] = V[k], m = S.formant;
      bp.frequency.setValueAtTime(fk * m, t); bp.Q.setValueAtTime(fk / bwk, t);
      bp.frequency.setTargetAtTime(fv * m, vokalAb, uebergang); bp.Q.setTargetAtTime(fv / bwv, vokalAb, uebergang);
      // Bandpass-Filter werden bei schmaler Bandbreite leise – ausgleichen, damit alle Formanten ihren Pegel behalten
      const ausgleich = k === 0 ? 2.2 : 3;
      g.gain.setValueAtTime(dbZuGain(dbk) * ausgleich, t); g.gain.setTargetAtTime(dbZuGain(dbv) * ausgleich, vokalAb, uebergang);
      quelle.connect(bp); bp.connect(g); g.connect(summe);
    }

    // Lautstärke: Konsonant leiser, dann der volle Vokal; Ende weich
    const amp = ctx.createGain(), voll = pegel * .55;
    amp.gain.setValueAtTime(0, t);
    if (kons) { amp.gain.linearRampToValueAtTime(voll * .35, t + .02); amp.gain.setTargetAtTime(voll, vokalAb, .03); }
    else amp.gain.setTargetAtTime(voll, t, .04);
    summe.connect(amp); amp.connect(ziel);

    osc.start(t); vib.start(t); drift.start(t); hauch.start(t);
    let aus = false;
    return {
      stop(t2) {
        if (aus) return; aus = true;
        t2 = Math.max(t2, t + .12);
        amp.gain.cancelScheduledValues(t2); amp.gain.setTargetAtTime(0, t2, .07);
        [osc, vib, drift, hauch].forEach(n => { try { n.stop(t2 + .6); } catch (e) {} });
      },
    };
  }

  return { singe, STIMMEN, SILBEN };
})();
