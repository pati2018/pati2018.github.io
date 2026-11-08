/*
 * Eigene Lieder einspielen – im echten Rhythmus, ohne Bearbeiten:
 * ● Aufnahme → Melodie auf der Klaviertastatur spielen → ■ Fertig.
 * Die App misst die Abstände zwischen den Tönen, erkennt daraus das Tempo und rundet auf
 * Notenwerte (½, 1, 1½, 2, 3, 4 Schläge). Gespeichert wird im Gerätespeicher (Gruppe „Eigene Lieder“).
 * Nutzt aus index.html: st, H, ton, initAudio, ctx, dry, conv, ladeLied, liedAuswahl, setzeModus, merke, meldung.
 */
const ED = { offen: false, rec: false, an: [], noten: null, tempo: 100, spielt: false, timer: [], bus: null };
const ED_LO = 55, ED_HI = 79;   // g bis g″ – wie die 25-saitige Harfe
const ED_NAMEN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const edName = m => ED_NAMEN[m % 12] + (Math.floor(m / 12) - 1);   // Schreibweise von lieder.js
const edFarbe = m => ({ 0: '#ef5350', 2: '#ffa040', 4: '#ffe14d', 5: '#9ccc65', 7: '#4dd0e1', 9: '#b06bd6', 11: '#f06292' })[m % 12];
const $e = id => document.getElementById(id);

function edBauen() {
  const box = document.createElement('div');
  box.id = 'editor'; box.className = 'editor'; box.hidden = true;
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Lied einspielen');
  box.innerHTML = `
  <div class="edKopf">
    <h2>Lied einspielen</h2>
    <button id="edZu" class="quiet">✕ Schließen</button>
  </div>
  <div class="edZeile">
    <label>Name <input id="edName" type="text" maxlength="60"></label>
    <button id="edRec" class="edRec">● Aufnahme</button>
    <button id="edLetzten" class="quiet" disabled>⌫ Letzten Ton löschen</button>
    <span id="edStatus" class="edStatus"></span>
  </div>
  <div class="klavier" id="edKlavier" aria-label="Klaviertastatur"></div>
  <div class="edZeile" id="edErgebnis" hidden>
    <button id="edPlay">▶ Anhören</button>
    <button id="edSpeichern">💾 Speichern</button>
    <button id="edNochmal" class="quiet">↺ Nochmal</button>
  </div>
  <div class="edHinweis">Auf <b>● Aufnahme</b> tippen und die Melodie einfach spielen – so, wie sie klingen soll. Die Aufnahme beginnt mit dem ersten Ton. Dann <b>■ Fertig</b>: die App macht daraus das Lied.</div>
  <div class="edMeine" id="edMeine"></div>`;
  document.body.appendChild(box);

  // Klavier g … g″
  const kl = $e('edKlavier'), weiss = [];
  for (let m = ED_LO; m <= ED_HI; m++) if (!H.istHalbton(m)) weiss.push(m);
  const bw = 100 / weiss.length; let html = '';
  weiss.forEach((m, i) => { html += `<div class="taste weiss" data-m="${m}" style="left:${i * bw}%;width:${bw}%"><span style="border-color:${edFarbe(m)}">${H.tonName(m)}</span></div>`; });
  for (let m = ED_LO; m <= ED_HI; m++) if (H.istHalbton(m)) {
    const i = weiss.indexOf(m - 1);
    html += `<div class="taste schwarz" data-m="${m}" style="left:${(i + 1) * bw - bw * .32}%;width:${bw * .64}%"><span>${H.tonName(m)}</span></div>`;
  }
  kl.innerHTML = html;
  kl.querySelectorAll('.taste').forEach(t => {
    t.addEventListener('pointerdown', e => {
      e.preventDefault(); t.setPointerCapture(e.pointerId);
      const m = +t.dataset.m, jetzt = performance.now();
      t.classList.add('an'); edTon(m);
      if (ED.rec) {
        // Nach „Letzten Ton löschen“ rückt der nächste Ton auf den Platz des gelöschten – die Zeit fürs Korrigieren zählt nicht
        if (ED.luecke != null) { ED.versatz += (jetzt - ED.versatz) - ED.luecke; ED.luecke = null; }
        ED.an.push({ m, t: jetzt - ED.versatz, los: null }); t._idx = ED.an.length - 1; edStatus(); edLetztenKnopf();
      }
    });
    const los = () => { t.classList.remove('an'); if (ED.rec && t._idx != null && ED.an[t._idx]) ED.an[t._idx].los = performance.now() - ED.versatz; t._idx = null; };
    t.addEventListener('pointerup', los); t.addEventListener('pointercancel', los);
  });

  $e('edZu').onclick = edSchliessen;
  $e('edRec').onclick = () => (ED.rec ? edFertig() : edAufnahme());
  $e('edPlay').onclick = () => (ED.spielt ? edStopp() : edAnhoeren());
  $e('edSpeichern').onclick = edSpeichern;
  $e('edNochmal').onclick = edAufnahme;
  $e('edLetzten').onclick = () => {   // letzten Ton entfernen – während der Aufnahme oder danach
    if (ED.rec) {
      if (!ED.an.length) return;
      ED.luecke = ED.an.pop().t;   // hier geht es gleich weiter
      edStatus(); edLetztenKnopf();
      $e('edStatus').textContent += ' (letzter gelöscht – weiterspielen)';
      return;
    }
    if (!ED.noten) return;
    edStopp();
    ED.noten.pop(); while (ED.noten.length && ED.noten[ED.noten.length - 1].midi == null) ED.noten.pop();
    if (!ED.noten.some(n => n.midi != null)) { ED.noten = null; $e('edErgebnis').hidden = true; $e('edStatus').textContent = 'Keine Töne mehr – bitte neu aufnehmen.'; return; }
    edStatus(); edLetztenKnopf();
  };
  document.addEventListener('keydown', e => { if (ED.offen && e.key === 'Escape') edSchliessen(); });
}

function edTon(m) { initAudio(); if (ctx.state !== 'running') ctx.resume(); ton(m, ctx.currentTime + .005, .8, 0); }
function edLetztenKnopf() { const b = $e('edLetzten'); if (b) b.disabled = ED.rec ? !ED.an.length : (!ED.noten || ED.noten.filter(n => n.midi != null).length < 2); }
function edStatus() {
  const s = $e('edStatus');
  if (ED.rec) s.textContent = ED.an.length ? `● ${ED.an.length} ${ED.an.length === 1 ? 'Ton' : 'Töne'} …` : '● Bereit – spiel los!';
  else if (ED.noten) s.textContent = `${ED.noten.filter(n => n.midi != null).length} Töne · Tempo ${ED.tempo}`;
  else s.textContent = '';
}

function edAufnahme() {
  edStopp(); initAudio(); ctx.resume();
  ED.rec = true; ED.an = []; ED.noten = null; ED.versatz = 0; ED.luecke = null;
  const b = $e('edRec'); b.textContent = '■ Fertig'; b.classList.add('laeuft');
  $e('edErgebnis').hidden = true; edStatus(); edLetztenKnopf();
}
function edFertig() {
  ED.rec = false;
  const b = $e('edRec'); b.textContent = '● Aufnahme'; b.classList.remove('laeuft');
  if (ED.an.length < 2) { ED.noten = null; $e('edStatus').textContent = 'Zu wenige Töne – bitte noch einmal.'; edLetztenKnopf(); return; }
  const r = edRhythmus(ED.an); ED.noten = r.noten; ED.tempo = r.tempo;
  $e('edErgebnis').hidden = false; edStatus(); edLetztenKnopf();
  edAnhoeren();   // gleich vorspielen, damit man hört, ob es passt
}

// Rhythmus erkennen (wie „Quantisieren“ in Musikprogrammen):
// Der häufigste Abstand zwischen zwei Tönen ist ein Schlag. Jeder Ton wird auf ein Raster aus halben Schlägen gelegt –
// so macht ein zu früh oder zu spät gespielter Ton nicht gleich zwei Notenwerte falsch. Das Tempo wird laufend
// nachgeführt, falls man beim Spielen schneller oder langsamer wird.
// Wer überwiegend Achtel spielt, bekommt die Achtel als Schlag – der Rhythmus bleibt gleich, nur doppelt so lang notiert.
const ED_WERTE = [.5, 1, 1.5, 2, 3, 4, 6, 8];
function edRhythmus(an) {
  const ioi = []; for (let i = 0; i < an.length - 1; i++) ioi.push(an[i + 1].t - an[i].t);
  const sort = ioi.filter(x => x > 120).sort((a, b) => a - b);   // Doppelanschläge nicht mitzählen
  let schlag = Math.min(1500, Math.max(180, sort.length ? sort[Math.floor(sort.length / 2)] : 500));
  const start = schlag;
  // Rasterplätze der Töne
  // Gemessen wird vom IDEALEN Zeitpunkt des vorigen Tons aus (nicht vom tatsächlich gespielten),
  // damit sich kleine Ungenauigkeiten nicht weitertragen; der ideale Takt folgt dem Spiel nur langsam.
  // Ist der Schlag kurz (ein Achtel), nur auf ganze Schläge einrasten – sonst wäre das Raster ein Sechzehntel und zu fein
  const fein = start >= 330 ? .5 : 1, rasten = x => Math.max(fein, Math.round(x / fein) * fein);
  const pos = [0]; let ideal = an[0].t;
  for (let i = 1; i < an.length; i++) {
    const schritt = rasten((an[i].t - ideal) / schlag);
    pos.push(pos[i - 1] + schritt);
    const erwartet = ideal + schritt * schlag, abw = an[i].t - erwartet;   // zu früh (−) oder zu spät (+)
    schlag = Math.min(start * 1.5, Math.max(start / 1.5, schlag + abw / schritt * .15));   // Tempo langsam nachführen
    ideal = erwartet + abw * .3;
  }
  const noten = [];
  an.forEach((n, i) => {
    if (i === an.length - 1) {   // letzter Ton: so lange wie gehalten (man lässt meist etwas früh los), mindestens 1 Schlag
      const halten = ((n.los || n.t + schlag) - n.t) / schlag;
      noten.push({ midi: n.m, dur: Math.max(1, ED_WERTE.reduce((a, b) => Math.abs(b - halten * 1.35) < Math.abs(a - halten * 1.35) ? b : a)) }); return;
    }
    const d = pos[i + 1] - pos[i];
    // Pause nur bei deutlichem Loslassen: Ton kürzer als die Hälfte des Abstands und mindestens 1 Schlag Lücke
    if (n.los && n.los - n.t < ioi[i] * .5) {
      const halten = rasten((n.los - n.t) / ioi[i] * d), rest = d - halten;
      if (rest >= 1) { noten.push({ midi: n.m, dur: halten }); noten.push({ midi: null, dur: rest }); return; }
    }
    noten.push({ midi: n.m, dur: d });
  });
  return { noten, tempo: Math.round(Math.min(240, Math.max(40, 60000 / start))) };
}

function edAnhoeren() {
  if (!ED.noten) return;
  edStopp(); initAudio(); ctx.resume();
  const spb = 60 / ED.tempo, t0 = ctx.currentTime + .1; let b = 0;
  ED.spielt = true; $e('edPlay').textContent = '■ Stopp';
  ED.bus = ctx.createGain(); ED.bus.connect(dry); ED.bus.connect(conv);
  ED.noten.forEach(n => {
    if (n.midi != null) {
      ton(n.midi, t0 + b * spb, .8, 0, ED.bus);
      const m = n.midi; ED.timer.push(setTimeout(() => { const t = document.querySelector(`.klavier .taste[data-m="${m}"]`); if (t) { t.classList.add('an'); setTimeout(() => t.classList.remove('an'), 200); } }, (b * spb + .1) * 1000));
    }
    b += n.dur;
  });
  ED.timer.push(setTimeout(edStopp, (b * spb + .5) * 1000));
}
function edStopp() {
  ED.timer.forEach(clearTimeout); ED.timer = [];
  if (ED.bus) { const bus = ED.bus; ED.bus = null; bus.gain.setTargetAtTime(0, ctx.currentTime, .05); setTimeout(() => bus.disconnect(), 500); }
  ED.spielt = false; const p = $e('edPlay'); if (p) p.textContent = '▶ Anhören';
}

function edAlleEigenen() { return H.LIEDER.filter(l => l.eigen); }
function edUebernehmen(liste) {
  for (let i = H.LIEDER.length - 1; i >= 0; i--) if (H.LIEDER[i].eigen) H.LIEDER.splice(i, 1);
  liste.forEach(l => H.LIEDER.push({ ...l, gruppe: 'Eigene Lieder', eigen: true }));
  H.eigeneSpeichern(liste);
}
function edNeuerName() { let n = 1; const namen = new Set(edAlleEigenen().map(l => l.titel)); while (namen.has('Mein Lied ' + n)) n++; return 'Mein Lied ' + n; }
function edSpeichern() {
  if (!ED.noten) return;
  const l = { id: 'eigen-' + Date.now().toString(36), titel: $e('edName').value.trim() || edNeuerName(), takt: 4, tempo: ED.tempo,
    noten: ED.noten.map(n => (n.midi == null ? 'r' : edName(n.midi)) + ':' + n.dur).join(' ') };
  try { H.parse(l); edUebernehmen([...edAlleEigenen(), l]); }
  catch (e) { alert('Speichern nicht möglich (Gerätespeicher voll oder privates Surfen?).'); return; }
  edSchliessen();
  st.liedId = l.id; liedAuswahl(); ladeLied(); merke();
  if (st.modus !== 'ueben') setzeModus('ueben');
  meldung(`„${l.titel}“ gespeichert – los geht's!`);
}

// Liste „Meine Lieder“ zum Löschen (und Mitnehmen auf ein anderes Gerät)
function edMeineZeigen() {
  const ls = edAlleEigenen(), box = $e('edMeine');
  box.innerHTML = ls.length ? `<h3>Meine Lieder</h3>` + ls.map(l => `<div class="edMein"><span>${l.titel.replace(/[<>&]/g, '')}</span><button class="quiet" data-id="${l.id}">🗑 Löschen</button></div>`).join('') +
    `<div class="edZeile"><button id="edExport" class="quiet">📤 Exportieren</button><label class="quiet edImport">📥 Importieren<input id="edImport" type="file" accept=".json,application/json" hidden></label></div>`
    : `<div class="edZeile"><label class="quiet edImport">📥 Lieder importieren<input id="edImport" type="file" accept=".json,application/json" hidden></label></div>`;
  box.querySelectorAll('[data-id]').forEach(b => b.onclick = () => {
    const l = ls.find(x => x.id === b.dataset.id); if (!l || !confirm(`„${l.titel}“ löschen?`)) return;
    edUebernehmen(edAlleEigenen().filter(x => x.id !== l.id));
    if (st.liedId === l.id) { st.liedId = H.LIEDER[0].id; ladeLied(); merke(); }
    liedAuswahl(); edMeineZeigen();
  });
  if ($e('edExport')) $e('edExport').onclick = edExport;
  $e('edImport').onchange = edImport;
}
async function edExport() {
  const liste = edAlleEigenen().map(({ id, titel, takt, tempo, noten, text }) => ({ id, titel, takt, tempo, noten, text }));
  const blob = new Blob([JSON.stringify({ tischharfe: 1, lieder: liste }, null, 1)], { type: 'application/json' }), name = 'Tischharfe_Eigene_Lieder.json';
  try { const files = [new File([blob], name, { type: 'application/json' })];
    if (!window.showDirectoryPicker && navigator.canShare && navigator.canShare({ files })) { await navigator.share({ files }); return; } }
  catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 60000);
}
async function edImport(e) {
  const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return;
  let neu = [];
  try { const d = JSON.parse(await f.text()); neu = (d.lieder || (Array.isArray(d) ? d : [])).filter(l => { try { H.parse(l); return l.titel; } catch (x) { return false; } }); }
  catch (x) { alert('Die Datei ist keine Lieder-Datei der Tischharfe.'); return; }
  if (!neu.length) { alert('In der Datei wurden keine Lieder gefunden.'); return; }
  const liste = edAlleEigenen(), ids = new Set(liste.map(l => l.id));
  neu.forEach(l => { const k = { id: l.id, titel: l.titel, takt: +l.takt || 4, tempo: +l.tempo || 100, noten: l.noten, text: l.text };
    if (ids.has(k.id)) k.id = 'eigen-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); liste.push(k); ids.add(k.id); });
  edUebernehmen(liste); liedAuswahl(); edMeineZeigen();
}

function edOeffnen() {
  if (!$e('editor')) edBauen();
  ED.offen = true; ED.rec = false; ED.an = []; ED.noten = null;
  $e('edName').value = edNeuerName(); $e('edErgebnis').hidden = true;
  const b = $e('edRec'); b.textContent = '● Aufnahme'; b.classList.remove('laeuft');
  edStatus(); edMeineZeigen();
  $e('editor').hidden = false; document.body.classList.add('editorOffen'); scrollTo(0, 0);
}
function edSchliessen() {
  edStopp(); ED.rec = false; ED.offen = false;
  $e('editor').hidden = true; document.body.classList.remove('editorOffen');
}

$e('eigenBtn').onclick = edOeffnen;
