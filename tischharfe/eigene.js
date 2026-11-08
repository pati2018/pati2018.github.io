/*
 * Eigene Lieder: mit einer Klaviertastatur (g bis g″) einspielen, korrigieren, anhören und speichern.
 * Gespeichert wird im Gerätespeicher (lieder.js lädt sie beim Start in die Gruppe „Eigene Lieder“).
 * Nutzt aus index.html: st, H, ton, initAudio, ctx, ladeLied, liedAuswahl, setzeModus, merke.
 */
const ED = { offen: false, id: null, noten: [], dauer: 1, wahl: -1, spielt: false, timer: [] };
const ED_DAUERN = [[.5, '½'], [1, '1'], [1.5, '1½'], [2, '2'], [3, '3'], [4, '4']];
const ED_LO = 55, ED_HI = 79;   // g bis g″ – wie die 25-saitige Harfe
const ED_NAMEN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const edName = m => ED_NAMEN[m % 12] + (Math.floor(m / 12) - 1);   // Schreibweise von lieder.js (C4 = c′, B4 = h′)
const edFarbe = m => ({ 0: '#ef5350', 2: '#ffa040', 4: '#ffe14d', 5: '#9ccc65', 7: '#4dd0e1', 9: '#b06bd6', 11: '#f06292' })[m % 12];
const $e = id => document.getElementById(id);

function edSymbol(d, gross = 10) {   // gleiches Zeichen wie auf dem Notenblatt
  const z = H.zeichen(d), r = gross * .55 * z.groesse, c = gross + 2;
  return `<svg width="${c * 2 + (z.punkt ? 8 : 0)}" height="${c * 2}" viewBox="0 0 ${c * 2 + (z.punkt ? 8 : 0)} ${c * 2}" aria-hidden="true">` +
    `<circle cx="${c}" cy="${c}" r="${r}" fill="${z.gefuellt ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"/>` +
    (z.punkt ? `<circle cx="${c + r + 4}" cy="${c}" r="2" fill="currentColor"/>` : '') + `</svg>`;
}

function edBauen() {
  const box = document.createElement('div');
  box.id = 'editor'; box.className = 'editor'; box.hidden = true;
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Eigenes Lied');
  box.innerHTML = `
  <div class="edKopf">
    <h2 id="edTitel">Eigenes Lied</h2>
    <button id="edZu" class="quiet" aria-label="Schließen">✕ Schließen</button>
  </div>
  <div class="edZeile">
    <label>Name <input id="edName" type="text" maxlength="60" placeholder="z. B. Mein Lied"></label>
    <label>Takt <select id="edTakt"><option value="4">4/4</option><option value="3">3/4</option></select></label>
    <label>Tempo <input id="edTempo" type="range" min="50" max="160" value="100"> <b id="edTempoVal">100</b></label>
  </div>
  <div class="edZeile">
    <span class="edLabel">Notenwert</span>
    <span id="edDauern" class="edDauern"></span>
    <button id="edPause" class="quiet">Pause</button>
  </div>
  <div class="klavier" id="edKlavier" aria-label="Klaviertastatur – Taste antippen fügt den Ton hinzu"></div>
  <div class="edHinweis" id="edHinweis">Notenwert wählen, dann Taste antippen – der Ton kommt ans Ende des Liedes.</div>
  <div class="edNoten" id="edNoten"></div>
  <div class="edZeile">
    <button id="edPlay">▶ Anhören</button>
    <button id="edWeg" class="quiet">⌫ Löschen</button>
    <button id="edLeer" class="quiet">✕ Alles löschen</button>
  </div>
  <label class="edText">Liedtext (optional) – eine Silbe pro Ton, mit Leerzeichen getrennt, z. B. <i>Al- le mei- ne Ent- chen</i>
    <input id="edText" type="text" placeholder="Al- le mei- ne Ent- chen …"><span id="edSilben" class="edSilben"></span></label>
  <div class="edZeile edUnten">
    <button id="edSpeichern">💾 Speichern und spielen</button>
    <button id="edEntfernen" class="quiet edRot" hidden>🗑 Lied löschen</button>
    <span class="edRechts">
      <button id="edExport" class="quiet">📤 Exportieren</button>
      <label class="quiet edImport">📥 Importieren<input id="edImport" type="file" accept=".json,application/json" hidden></label>
    </span>
  </div>
  <div class="edHinweis">Eigene Lieder sind auf diesem Gerät gespeichert. Mit <b>Exportieren</b> kommen sie als Datei auf ein anderes iPad.</div>`;
  document.body.appendChild(box);

  // Notenwerte
  $e('edDauern').innerHTML = ED_DAUERN.map(([d, t]) => `<button class="edDauer" data-d="${d}" aria-pressed="${d === ED.dauer}" title="${t} Schlag">${edSymbol(d)}<span>${t}</span></button>`).join('');
  $e('edDauern').querySelectorAll('.edDauer').forEach(b => b.onclick = () => {
    const d = +b.dataset.d;
    if (ED.wahl >= 0) { ED.noten[ED.wahl].dur = d; edNotenZeigen(); }
    else { ED.dauer = d; edDauerZeigen(); }
  });
  $e('edPause').onclick = () => {
    if (ED.wahl >= 0) { ED.noten[ED.wahl].midi = null; edNotenZeigen(); return; }
    ED.noten.push({ midi: null, dur: ED.dauer }); edNotenZeigen(true);
  };

  // Klavier
  const kl = $e('edKlavier'), weiss = [];
  for (let m = ED_LO; m <= ED_HI; m++) if (!H.istHalbton(m)) weiss.push(m);
  const bw = 100 / weiss.length;
  let html = '';
  weiss.forEach((m, i) => { html += `<div class="taste weiss" data-m="${m}" style="left:${i * bw}%;width:${bw}%"><span style="border-color:${edFarbe(m)}">${H.tonName(m)}</span></div>`; });
  for (let m = ED_LO; m <= ED_HI; m++) if (H.istHalbton(m)) {
    const i = weiss.indexOf(m - 1);
    html += `<div class="taste schwarz" data-m="${m}" style="left:${(i + 1) * bw - bw * .32}%;width:${bw * .64}%"><span>${H.tonName(m)}</span></div>`;
  }
  kl.innerHTML = html;
  kl.querySelectorAll('.taste').forEach(t => t.addEventListener('pointerdown', e => {
    e.preventDefault(); const m = +t.dataset.m;
    t.classList.add('an'); setTimeout(() => t.classList.remove('an'), 180);
    edTon(m);
    if (ED.wahl >= 0) { ED.noten[ED.wahl].midi = m; edNotenZeigen(); }
    else { ED.noten.push({ midi: m, dur: ED.dauer }); edNotenZeigen(true); }
  }));

  $e('edZu').onclick = edSchliessen;
  $e('edTempo').oninput = e => { $e('edTempoVal').textContent = e.target.value; };
  $e('edPlay').onclick = () => (ED.spielt ? edStopp() : edAnhoeren());
  $e('edWeg').onclick = () => {
    if (!ED.noten.length) return;
    ED.noten.splice(ED.wahl >= 0 ? ED.wahl : ED.noten.length - 1, 1); ED.wahl = -1; edNotenZeigen();
  };
  $e('edLeer').onclick = () => { if (ED.noten.length && confirm('Alle Töne löschen?')) { ED.noten = []; ED.wahl = -1; edNotenZeigen(); } };
  $e('edText').oninput = edSilbenZeigen;
  $e('edSpeichern').onclick = edSpeichern;
  $e('edEntfernen').onclick = edEntfernen;
  $e('edExport').onclick = edExport;
  $e('edImport').onchange = edImport;
  document.addEventListener('keydown', e => { if (ED.offen && e.key === 'Escape') edSchliessen(); });
}

function edTon(m) { initAudio(); if (ctx.state !== 'running') ctx.resume(); ton(m, ctx.currentTime + .005, .8, 0); }
function edDauerZeigen() { document.querySelectorAll('.edDauer').forEach(b => b.setAttribute('aria-pressed', +b.dataset.d === (ED.wahl >= 0 ? ED.noten[ED.wahl].dur : ED.dauer))); }
function edNotenZeigen(ansEnde) {
  const box = $e('edNoten');
  if (!ED.noten.length) box.innerHTML = '<span class="edLeer">Noch keine Töne – Taste antippen.</span>';
  else box.innerHTML = ED.noten.map((n, i) => {
    const name = n.midi == null ? 'Pause' : H.tonName(n.midi), f = n.midi == null ? '#888' : edFarbe(n.midi) || '#bbb';
    return `<button class="edNote${i === ED.wahl ? ' gewaehlt' : ''}${n.midi == null ? ' pause' : ''}" data-i="${i}" style="--f:${f}">${edSymbol(n.dur, 8)}<b>${name}</b></button>`;
  }).join('');
  box.querySelectorAll('.edNote').forEach(b => b.onclick = () => {
    const i = +b.dataset.i; ED.wahl = ED.wahl === i ? -1 : i;
    if (ED.wahl >= 0 && ED.noten[i].midi != null) edTon(ED.noten[i].midi);
    edNotenZeigen();
  });
  $e('edHinweis').innerHTML = ED.wahl >= 0
    ? `<b>Ton ${ED.wahl + 1} gewählt:</b> Taste antippen = Tonhöhe ändern · Notenwert = Länge ändern · Pause = zur Pause machen · ⌫ = löschen · nochmal antippen = fertig.`
    : 'Notenwert wählen, dann Taste antippen – der Ton kommt ans Ende des Liedes. Einen Ton in der Reihe antippen, um ihn zu ändern.';
  edDauerZeigen(); edSilbenZeigen();
  if (ansEnde) box.scrollLeft = box.scrollWidth;
}
function edSilbenZeigen() {
  const t = $e('edText').value.trim(), n = ED.noten.filter(x => x.midi != null).length, s = t ? t.split(/\s+/).length : 0;
  $e('edSilben').textContent = t ? `${s} Silben für ${n} Töne${s === n ? ' ✓' : s < n ? ' – es fehlen noch Silben' : ' – zu viele Silben'}` : '';
  $e('edSilben').className = 'edSilben' + (t && s !== n ? ' warn' : '');
}

function edAnhoeren() {
  if (!ED.noten.length) return;
  edStopp(); initAudio(); ctx.resume();
  const spb = 60 / +$e('edTempo').value, t0 = ctx.currentTime + .1; let b = 0;
  ED.spielt = true; $e('edPlay').textContent = '■ Stopp';
  ED.bus = ctx.createGain(); ED.bus.connect(dry); ED.bus.connect(conv);
  ED.noten.forEach((n, i) => {
    if (n.midi != null) ton(n.midi, t0 + b * spb, .8, 0, ED.bus);
    ED.timer.push(setTimeout(() => { document.querySelectorAll('.edNote').forEach((el, k) => el.classList.toggle('jetzt', k === i)); }, (b * spb + .1) * 1000));
    b += n.dur;
  });
  ED.timer.push(setTimeout(edStopp, (b * spb + .4) * 1000));
}
function edStopp() {
  ED.timer.forEach(clearTimeout); ED.timer = [];
  if (ED.bus) { const bus = ED.bus; ED.bus = null; bus.gain.setTargetAtTime(0, ctx.currentTime, .05); setTimeout(() => bus.disconnect(), 500); }
  ED.spielt = false; const p = $e('edPlay'); if (p) p.textContent = '▶ Anhören';
  document.querySelectorAll('.edNote.jetzt').forEach(el => el.classList.remove('jetzt'));
}

function edOeffnen(lied) {
  if (!$e('editor')) edBauen();
  ED.offen = true; ED.wahl = -1; ED.id = lied ? lied.id : null;
  if (lied) {
    const p = H.parse(lied);
    ED.noten = p.noten.map(n => ({ midi: n.midi, dur: n.dur }));
    $e('edName').value = lied.titel; $e('edTakt').value = String(lied.takt || 4); $e('edTempo').value = lied.tempo || 100;
    $e('edText').value = lied.text || '';
  } else {
    ED.noten = []; $e('edName').value = ''; $e('edTakt').value = '4'; $e('edTempo').value = 100; $e('edText').value = '';
  }
  $e('edTempoVal').textContent = $e('edTempo').value;
  $e('edTitel').textContent = lied ? 'Lied bearbeiten' : 'Eigenes Lied';
  $e('edEntfernen').hidden = !lied;
  edNotenZeigen();
  $e('editor').hidden = false; document.body.classList.add('editorOffen');
  scrollTo(0, 0);
}
function edSchliessen() {
  if (ED.spielt) edStopp();
  ED.offen = false; $e('editor').hidden = true; document.body.classList.remove('editorOffen');
}

function edAlsLied() {
  const titel = $e('edName').value.trim() || 'Mein Lied';
  const noten = ED.noten.map(n => (n.midi == null ? 'r' : edName(n.midi)) + ':' + n.dur).join(' ');
  const text = $e('edText').value.trim();
  const l = { id: ED.id || ('eigen-' + Date.now().toString(36)), titel, takt: +$e('edTakt').value, tempo: +$e('edTempo').value, noten };
  if (text) l.text = text;
  return l;
}
function edAlleEigenen() { return H.LIEDER.filter(l => l.eigen); }
function edUebernehmen(liste) {
  for (let i = H.LIEDER.length - 1; i >= 0; i--) if (H.LIEDER[i].eigen) H.LIEDER.splice(i, 1);
  liste.forEach(l => H.LIEDER.push({ ...l, gruppe: 'Eigene Lieder', eigen: true }));
  H.eigeneSpeichern(liste);
}
function edSpeichern() {
  if (!ED.noten.some(n => n.midi != null)) { alert('Das Lied hat noch keine Töne.'); return; }
  const neu = edAlsLied();
  try { H.parse(neu); } catch (e) { alert('Das Lied konnte nicht gespeichert werden: ' + e.message); return; }
  const liste = edAlleEigenen().filter(l => l.id !== neu.id);
  const alt = edAlleEigenen().findIndex(l => l.id === neu.id);
  if (alt >= 0) liste.splice(alt, 0, neu); else liste.push(neu);
  try { edUebernehmen(liste); } catch (e) { alert('Speichern nicht möglich (Gerätespeicher voll oder privates Surfen?).'); return; }
  edSchliessen();
  st.liedId = neu.id; liedAuswahl(); ladeLied(); merke();
  if (st.modus !== 'ueben') setzeModus('ueben');
  meldung(`„${neu.titel}“ gespeichert – los geht's!`);
}
function edEntfernen() {
  if (!ED.id || !confirm('Dieses Lied wirklich löschen?')) return;
  edUebernehmen(edAlleEigenen().filter(l => l.id !== ED.id));
  edSchliessen(); st.liedId = H.LIEDER[0].id; liedAuswahl(); ladeLied(); merke();
}
async function edExport() {
  const liste = edAlleEigenen().map(({ id, titel, takt, tempo, noten, text }) => ({ id, titel, takt, tempo, noten, text }));
  if (!liste.length) { alert('Es gibt noch keine eigenen Lieder.'); return; }
  const blob = new Blob([JSON.stringify({ tischharfe: 1, lieder: liste }, null, 1)], { type: 'application/json' });
  const name = 'Tischharfe_Eigene_Lieder.json';
  try {
    const files = [new File([blob], name, { type: 'application/json' })];
    if (!window.showDirectoryPicker && navigator.canShare && navigator.canShare({ files })) { await navigator.share({ files }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 60000);
}
async function edImport(e) {
  const f = e.target.files && e.target.files[0]; e.target.value = '';
  if (!f) return;
  let neu = [];
  try { const d = JSON.parse(await f.text()); neu = (d.lieder || (Array.isArray(d) ? d : [])).filter(l => { try { H.parse(l); return l.titel; } catch (x) { return false; } }); }
  catch (x) { alert('Die Datei ist keine Lieder-Datei der Tischharfe.'); return; }
  if (!neu.length) { alert('In der Datei wurden keine Lieder gefunden.'); return; }
  const liste = edAlleEigenen(), ids = new Set(liste.map(l => l.id));
  neu.forEach(l => { const k = { id: l.id, titel: l.titel, takt: +l.takt || 4, tempo: +l.tempo || 100, noten: l.noten, text: l.text };
    if (ids.has(k.id)) k.id = 'eigen-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); liste.push(k); ids.add(k.id); });
  edUebernehmen(liste); liedAuswahl();
  alert(neu.length + (neu.length === 1 ? ' Lied' : ' Lieder') + ' importiert – zu finden unter „Eigene Lieder“.');
}

// Knöpfe neben der Liedauswahl: „＋ Eigenes Lied“ (neu) und „✎ Bearbeiten“ (nur bei eigenen Liedern)
(function () {
  const neu = $e('eigenBtn'), bearb = $e('bearbBtn');
  const zeigen = () => { const l = H.LIEDER.find(x => x.id === st.liedId); bearb.hidden = !(l && l.eigen); };
  neu.onclick = () => edOeffnen(null);
  bearb.onclick = () => { const l = H.LIEDER.find(x => x.id === st.liedId); if (l && l.eigen) edOeffnen(l); };
  $e('lied').addEventListener('change', zeigen);
  const alt = window.liedAuswahl; window.liedAuswahl = function () { alt(); zeigen(); };
  zeigen();
})();
