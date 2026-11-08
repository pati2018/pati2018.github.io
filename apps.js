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
 *  bild         – (optional) Bilddatei statt Emoji, z. B. das App-Symbol
 *  datum        – Veröffentlichungsdatum, Format JJJJ-MM-TT
 *
 *  Neueste Apps stehen automatisch oben (sortiert nach Datum).
 * ============================================================
 */
window.APPS = [
  {
    id: "tischharfe",
    titel: "Tischharfe",
    kurz: "Eine Tischharfe im Browser: Das Notenblatt liegt unter den Saiten, man zupft einfach der Punktlinie nach – ganz ohne Notenkenntnisse. Mit echtem Harfenklang, Übe- und Vorspielmodus und Notenblättern zum Ausdrucken für echte Tischharfen (18 und 25 Saiten).",
    links: [
      { label: "🎼 Tischharfe öffnen", url: "https://pati2018.github.io/tischharfe/" },
      { label: "🖨 Notenblätter drucken", url: "https://pati2018.github.io/tischharfe/druck.html" }
    ],
    link: "https://pati2018.github.io/tischharfe/",
    repo: "https://github.com/pati2018/pati2018.github.io/tree/main/tischharfe",
    kategorie: "Musik",
    symbol: "🎼",
    datum: "2026-11-08"
  },
  {
    id: "groove-werkstatt",
    titel: "Groove-Werkstatt",
    kurz: "Beats und Melodien zum Anklicken: Schlagzeug, Melodie und Bass in einem Raster setzen – immer passend in der gewählten Tonart. Mit Swing, Vorlagen, Würfeln, MIDI-Export und direkter Übergabe an den MIDI-Player.",
    links: [
      { label: "🎛 Groove-Werkstatt öffnen", url: "https://pati2018.github.io/groove-werkstatt/" },
      { label: "🎼 MIDI-Player öffnen", url: "https://pati2018.github.io/groove-werkstatt/midi-player.html" }
    ],
    link: "https://pati2018.github.io/groove-werkstatt/",
    repo: "https://github.com/pati2018/midi-player",
    kategorie: "Musik",
    symbol: "🎛",
    datum: "2026-11-08"
  },
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
    bild: "icons/smart-instruments-192.png",
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
