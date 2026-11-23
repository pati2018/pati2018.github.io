// Baut aus den Folien-Dateien eine eigenständige Seite für schule/netzwerke-internet/
const fs = require('fs');
const [,, deckDir, outFile] = process.argv;
const j = JSON.parse(fs.readFileSync(deckDir + '/deck.json', 'utf8'));
let css = fs.readFileSync(deckDir + '/deck.css', 'utf8');

// Lokale Schriften statt Google Fonts
css = css.replace(/'Space Grotesk', Arial, sans-serif/g, "'Bricolage Grotesque', 'Segoe UI', Arial, sans-serif")
  .replace(/'Inter', Arial, sans-serif/g, "'Atkinson Hyperlegible', 'Segoe UI', Arial, sans-serif")
  .replace(/'JetBrains Mono', 'Courier New', monospace/g, "ui-monospace, 'SF Mono', Menlo, Consolas, 'Courier New', monospace")
  .replace(/\.pg::after \{ content: counter\(page\); \}/, '');

const I = {
  Users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  Lightbulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>',
  Lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  Globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  Home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  Link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  Warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  Database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  Chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  PaperPlane: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  Play: '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
  CheckCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  Search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  Key: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>'
};

const QUIZ = require('./quiz-daten.js');
const liste = [];
j.order.forEach(id => {
  liste.push({ id });
  QUIZ.forEach((q, qi) => { if (q.nach === id) liste.push({ quiz: qi }); });
});
if (liste.filter(e => 'quiz' in e).length !== QUIZ.length) throw new Error('Quiz-Platz nicht gefunden');
const n = liste.length;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const slides = liste.map((e, k) => {
  if ('quiz' in e) {
    const q = QUIZ[e.quiz];
    return `<section id="folie-${k + 1}" class="quiz" data-quiz="${e.quiz}" data-titel="Quiz: ${esc(q.titel)}" aria-roledescription="Folie" aria-label="Folie ${k + 1} von ${n}: Quiz ${esc(q.titel)}">
<div class="qz-kopf"><p class="eyebrow">Quiz · ${esc(q.titel)}</p><div class="qz-dots"></div></div>
<div class="qz-body"></div>
<div class="foot"><p class="foot-t">Netzwerke &amp; Internet · Dialogmarketing</p><div class="pg">${k + 1} / ${n}</div></div>
</section>`;
  }
  const id = e.id;
  let h = fs.readFileSync(`${deckDir}/slides/${id}.html`, 'utf8');
  if (id === 'agenda') h = h.replace('Zu jeder Frage gibt es ein Beispiel aus dem Dialogmarketing.', 'Nach jedem Block gibt es ein kurzes Quiz zum Mitmachen.');
  h = h.replace(/<aside>[\s\S]*?<\/aside>\s*/, '');
  h = h.replace(/<x-icon name="(\w+)" class="([^"]+)"><\/x-icon>/g, (m, name, cls) => {
    if (!I[name]) throw new Error('Symbol fehlt: ' + name);
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[name]}</svg>`;
  });
  if (/<x-/.test(h)) throw new Error('Unbekanntes Element in ' + id);
  h = h.replace(/<div class="pg"( style="[^"]*")?><\/div>/, (m, st) => `<div class="pg"${st || ''}>${k + 1} / ${n}</div>`);
  h = h.replace(/<a class="lnk" href=/g, '<a class="lnk" target="_blank" rel="noopener" href=');
  h = h.replace(/<section id="([^"]+)"/, `<section id="folie-${k + 1}" data-name="$1" aria-roledescription="Folie" aria-label="Folie ${k + 1} von ${n}"`);
  return h;
}).join('\n');

const tpl = fs.readFileSync(__dirname + '/seite.html', 'utf8');
const quizJs = 'window.QUIZ = ' + JSON.stringify(QUIZ.map(q => ({ titel: q.titel, fragen: q.fragen }))).replace(/</g, '\\u003c') + ';';
fs.writeFileSync(outFile, tpl.replace('/*DECKCSS*/', () => css).replace('<!--FOLIEN-->', () => slides).replace('/*QUIZDATEN*/', () => quizJs));
console.log('Folien:', n);
