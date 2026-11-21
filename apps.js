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
 *  repo         – (optional) Link zum Quellcode auf GitHub (wird nicht mehr angezeigt)
 *  kategorie    – z. B. "Musik", "Schule", "Werkzeug"
 *  symbol       – ein Emoji als Bild für die Karte
 *  bild         – (optional) Bilddatei statt Emoji, z. B. das App-Symbol
 *  datum        – Veröffentlichungsdatum, Format JJJJ-MM-TT
 *  zaehler      – (optional) Pfad, unter dem GoatCounter die Aufrufe der App zählt (wird auf der Karte angezeigt)
 *  ganzOben     – (optional) Zahl: feste Position oben, 1 = ganz oben, 2 = danach …
 *  ganzUnten    – (optional) Zahl: App steht am Ende der Liste, größere Zahl = weiter unten (1 = vorletzter Block, 2 = ganz unten)
 *
 *  Erst kommen die Apps mit ganzOben, dann die übrigen (neueste zuerst),
 *  am Ende die Apps mit ganzUnten.
 * ============================================================
 */
window.APPS = [
  {
    id: "whacker-band",
    zaehler: "/whacker-band/",
    titel: "SoundWhacker Band",
    kurz: "Fünf animierte Figuren spielen mit SoundWhackern ein Lied vor – danach spielen die Teilnehmer live mit (Tasten 1–5). Eigene Lieder einspielen, speichern und als Datei weitergeben. Für den Beamer im Workshop.",
    link: "https://pati2018.github.io/whacker-band/",
    repo: "https://github.com/pati2018/pati2018.github.io/tree/main/whacker-band",
    kategorie: "Musik",
    symbol: "🎶",
    bild: "whacker-band/icons/icon-192.png",
    video: { src: "videos/soundwhacker-band.mp4", bild: "videos/soundwhacker-band.jpg", titel: "Die SoundWhacker Band im Video", datei: "SoundWhacker-Band.mp4" },
    datum: "2026-11-20"
  },
  {
    id: "fagott",
    zaehler: "/fagott/",
    titel: "Fagott",
    kurz: "Ein echtes Fagott zum Antippen: frei spielen in jeder Tonart (Dur/Moll, tief/mittel/hoch) – der Ton klingt, solange man hält. Oder Lieder Ton für Ton: jeder Schlag spielt den nächsten Ton. Auch mit den SoundWhackern 1–5.",
    link: "https://pati2018.github.io/fagott/",
    repo: "https://github.com/pati2018/pati2018.github.io/tree/main/fagott",
    kategorie: "Musik",
    symbol: "🎶",
    bild: "fagott/icons/icon-192.png",
    datum: "2026-11-18"
  },
  {
    id: "singen",
    zaehler: "/singen/",
    titel: "Singen mit SoundWhackern",
    kurz: "Jeder SoundWhacker singt einen Ton auf „la“ – mit der eigenen Stimme (einmal „laaaa“ ins Mikrofon singen), einem echten Chor „Aah“ oder einer künstlichen Frauen- oder Männerstimme. Jeder Schlag singt einen Ton, der natürlich ausklingt. Die Töne passen immer zusammen.",
    link: "https://pati2018.github.io/singen/",
    repo: "https://github.com/pati2018/pati2018.github.io/tree/main/singen",
    kategorie: "Musik",
    symbol: "🎤",
    bild: "singen/icons/icon-192.png",
    datum: "2026-11-08",
    ganzUnten: 1
  },
  {
    id: "atemklang",
    zaehler: "/atemklang/",
    titel: "Atemklang",
    kurz: "Ein Blasinstrument fürs iPhone: ins Mikrofon blasen und mit den Fingern die Töne greifen. Zart blasen klingt leise, fest blasen laut. Mit Saxophon, Flöte, Klarinette, Trompete und Panflöte – einfacher Griff oder Flötengriff.",
    link: "https://pati2018.github.io/atemklang/",
    repo: "https://github.com/pati2018/pati2018.github.io/tree/main/atemklang",
    kategorie: "Musik",
    symbol: "🎷",
    datum: "2026-11-08",
    ganzUnten: 2
  },
  {
    id: "tischharfe",
    zaehler: "/tischharfe/",
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
    datum: "2026-11-08",
    ganzOben: 3
  },
  {
    id: "smart-instruments",
    zaehler: "/Gitarre/",
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
    video: [
      { src: "videos/soundwhacker-smart-control.mp4", bild: "videos/soundwhacker-smart-control.jpg", titel: "Die App: SoundWhacker Smart Control", datei: "SoundWhacker-Smart-Control.mp4" },
      { src: "videos/soundwhacker.mp4", bild: "videos/soundwhacker.jpg", titel: "Der SoundWhacker: berühren, verbinden, Musik machen", datei: "SoundWhacker.mp4" },
      { src: "videos/soundwhacker-en.mp4", bild: "videos/soundwhacker-en.jpg", titel: "The SoundWhacker (English version)", datei: "SoundWhacker-English.mp4" },
      { src: "videos/soundwhacker-zh.mp4", bild: "videos/soundwhacker-zh.jpg", titel: "SoundWhacker（中文版 · chinesische Fassung）", datei: "SoundWhacker-Chinesisch.mp4" }
    ],
    zaehler: "/soundwhacker-looper/SoundWhacker_Spielen.html",
    titel: "SoundWhacker Smart Control",
    kurz: "Mit den SoundWhackern (oder den Tasten 1–5) Akkorde, Töne, Melodien und Arpeggios spielen, improvisieren und Loops steuern – mit eingebauten Instrumenten.",
    link: "https://pati2018.github.io/soundwhacker-looper/SoundWhacker_Spielen.html",
    repo: "https://github.com/pati2018/soundwhacker-looper",
    kategorie: "Musik",
    symbol: "🎚️",
    bild: "icons/smart-control-192.png",
    datum: "2026-11-05",
    ganzOben: 1
  },
  {
    id: "miga",
    video: { src: "videos/miga.mp4", bild: "videos/miga.jpg", titel: "MIGA im Video", datei: "MIGA-Mimik-Gestik-Augensteuerung.mp4" },
    zaehler: "/soundwhacker-looper/SoundWhacker_Kamera.html",
    titel: "MIGA – Mimik, Gestik, Augensteuerung",
    kurz: "Musik machen mit Mimik, Gesten und Augen: Die Kamera erkennt Hände, Kopf, Gesicht, Augen oder den ganzen Körper und spielt dazu Akkorde, Töne oder Loops.",
    link: "https://pati2018.github.io/soundwhacker-looper/SoundWhacker_Kamera.html",
    repo: "https://github.com/pati2018/soundwhacker-looper",
    kategorie: "Musik",
    symbol: "📷",
    bild: "icons/miga-192.png",
    datum: "2026-11-05",
    ganzOben: 2
  }
];
