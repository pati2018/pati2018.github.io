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
 *  ganzUnten    – (optional) true: App steht immer am Ende der Liste
 *
 *  Neueste Apps stehen automatisch oben (sortiert nach Datum).
 * ============================================================
 */
window.APPS = [
  {
    id: "singen",
    titel: "Singen mit SoundWhackern",
    kurz: "Jeder SoundWhacker singt einen Ton auf „la“ – mit der eigenen Stimme (einmal „laaaa“ ins Mikrofon singen) oder einer künstlichen Kinder-, Frauen- oder Männerstimme. Jeder Schlag singt einen Ton, der natürlich ausklingt; mehrere zusammen ergeben einen Chor. Die Töne passen immer zusammen.",
    link: "https://pati2018.github.io/singen/",
    repo: "https://github.com/pati2018/pati2018.github.io/tree/main/singen",
    kategorie: "Musik",
    symbol: "🎤",
    datum: "2026-11-08"
  },
  {
    id: "atemklang",
    titel: "Atemklang",
    kurz: "Ein Blasinstrument fürs iPhone: ins Mikrofon blasen und mit den Fingern die Töne greifen. Zart blasen klingt leise, fest blasen laut. Mit Saxophon, Flöte, Klarinette, Trompete und Panflöte – einfacher Griff oder Flötengriff.",
    link: "https://pati2018.github.io/atemklang/",
    repo: "https://github.com/pati2018/pati2018.github.io/tree/main/atemklang",
    kategorie: "Musik",
    symbol: "🎷",
    datum: "2026-11-08",
    ganzUnten: true
  },
  {
    id: "tischharfe",
    titel: "Tischharfe",
    kurz: "Eine Tischharfe im Browser: Das Notenblatt liegt unter den Saiten, man zupft einfach der Punktlinie nach – ganz ohne Notenkenntnisse. Mit echtem Harfenklang und zehn weiteren Instrumenten (Klavier, E-Piano, Marimba …), Übe- und Vorspielmodus, 18 oder 25 Saiten und Video-Aufnahme – spielbar auch mit den SoundWhackern oder mit dem Kopf.",
    links: [
      { label: "🎼 Tischharfe öffnen", url: "https://pati2018.github.io/tischharfe/" }
    ],
    link: "https://pati2018.github.io/tischharfe/",
    repo: "https://github.com/pati2018/pati2018.github.io/tree/main/tischharfe",
    kategorie: "Musik",
    symbol: "🎼",
    bild: "tischharfe/icons/icon-192.png",
    datum: "2026-11-08"
  },
  {
    id: "smart-instruments",
    titel: "Smart Instruments",
    kurz: "Gitarre und Smart-Klavier in einer App: frei spielen oder Akkorde und Töne antippen – mit Mustern, Kreis, Säulen, Boomwhacker-Farben, Kopfsteuerung, SoundWhacker und vielen Klängen (Schlagzeug, Flöte, Streicher, Chor, verzerrte E-Gitarre …).",
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
