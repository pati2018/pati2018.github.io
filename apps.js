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
    id: "klavier",
    titel: "Smart-Klavier",
    kurz: "Klavier, Schlagzeug, Flöte, Streicher und mehr im Browser: frei auf der Tastatur spielen oder Akkorde und Töne antippen – mit Rhythmus, Arpeggio, Akkordkreis und Kopfsteuerung.",
    link: "https://pati2018.github.io/Gitarre/?klavier",
    repo: "https://github.com/pati2018/Gitarre",
    kategorie: "Musik",
    symbol: "🎹",
    datum: "2026-11-06"
  },
  {
    id: "soundwhacker-spielen",
    titel: "SoundWhacker Steuerung",
    kurz: "Mit den SoundWhackern (oder den Tasten 1–5) Akkorde, Töne, Melodien und Arpeggios spielen, improvisieren und Loops steuern – mit eingebauten Instrumenten.",
    link: "https://pati2018.github.io/soundwhacker-looper/SoundWhacker_Spielen.html",
    repo: "https://github.com/pati2018/soundwhacker-looper",
    kategorie: "Musik",
    symbol: "🥁",
    datum: "2026-11-05"
  },
  {
    id: "miga",
    titel: "MIGA – Mimik, Gestik, Augensteuerung",
    kurz: "Musik machen mit Mimik, Gesten und Augen: Die Kamera erkennt Hände, Kopf, Gesicht, Augen oder den ganzen Körper und spielt dazu Akkorde, Töne oder Loops.",
    link: "https://pati2018.github.io/soundwhacker-looper/SoundWhacker_Kamera.html",
    repo: "https://github.com/pati2018/soundwhacker-looper",
    kategorie: "Musik",
    symbol: "📷",
    datum: "2026-11-05"
  },
  {
    id: "gitarre",
    titel: "Gitarre",
    kurz: "Eine Gitarre im Browser: frei auf dem Griffbrett spielen oder Akkorde mit automatischen Schlag- und Zupfmustern begleiten lassen.",
    link: "https://pati2018.github.io/Gitarre/?gitarre",
    repo: "https://github.com/pati2018/Gitarre",
    kategorie: "Musik",
    symbol: "🎸",
    datum: "2026-11-05"
  }
];
