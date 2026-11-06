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
 *  links        – (optional) mehrere „öffnen“-Knöpfe: [{ label, url }, …]
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
    id: "smart-instruments",
    titel: "Smart Instruments",
    kurz: "Gitarre und Smart-Klavier in einer App: frei spielen oder Akkorde und Töne antippen – mit Mustern, Kreis, Säulen, Boomwhacker-Farben, Kopfsteuerung, SoundWhacker und vielen Klängen (Schlagzeug, Flöte, Streicher, verzerrte E-Gitarre …).",
    links: [
      { label: "🎸 Gitarre öffnen", url: "https://pati2018.github.io/Gitarre/?gitarre" },
      { label: "🎹 Klavier öffnen", url: "https://pati2018.github.io/Gitarre/?klavier" }
    ],
    link: "https://pati2018.github.io/Gitarre/?gitarre",
    repo: "https://github.com/pati2018/Gitarre",
    kategorie: "Musik",
    symbol: "🎸🎹",
    datum: "2026-11-06"
  },
  {
    id: "soundwhacker-spielen",
    titel: "SoundWhacker Smart Control",
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
  }
];
