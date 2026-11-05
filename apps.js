/*
 * ============================================================
 *  HIER NEUE APPS EINTRAGEN
 * ============================================================
 *  Für jede App einen Block { ... } in die Liste kopieren.
 *
 *  id           – kurzer Name ohne Leerzeichen. Die lange Anleitung
 *                 liegt dann in  anleitungen/<id>.md
 *  titel        – Name der App
 *  kurz         – ein bis zwei Sätze für die Karte auf der Startseite
 *  link         – Adresse der fertigen App (GitHub Pages)
 *  repo         – (optional) Link zum Quellcode auf GitHub
 *  kategorie    – z. B. "Musik", "Schule", "Werkzeug"
 *  symbol       – ein Emoji als Bild für die Karte
 *  datum        – Veröffentlichungsdatum, Format JJJJ-MM-TT
 *
 *  Neueste Apps stehen automatisch oben (sortiert nach Datum).
 * ============================================================
 */
window.APPS = [
  {
    id: "midi-player",
    titel: "MIDI-Player",
    kurz: "Spielt MIDI-Dateien direkt im Browser ab – mit echten Instrumenten, Notenrolle, Mixer und Raumklang.",
    link: "https://pati2018.github.io/midi-player/",
    repo: "https://github.com/pati2018/midi-player",
    kategorie: "Musik",
    symbol: "🎹",
    datum: "2026-09-27"
  }
];
