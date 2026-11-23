/*
 * ============================================================
 *  HIER NEUE SCHUL-APPS UND LERNSEITEN EINTRAGEN
 * ============================================================
 *  Gleicher Aufbau wie ../apps.js (Musik-Apps). Für jede Seite
 *  einen Block { ... } in die Liste kopieren.
 *
 *  id           – kurzer Name ohne Leerzeichen. Die Anleitung
 *                 liegt dann in  anleitungen/<id>.md
 *  titel        – Name der Seite
 *  kurz         – ein bis zwei Sätze für die Karte
 *  link         – Adresse, meist https://pati2018.github.io/schule/<ordner>/
 *  links        – (optional) mehrere „öffnen“-Knöpfe: [{ label, url }, …]
 *  repo         – (optional) Link zum Quellcode auf GitHub (wird nicht mehr angezeigt)
 *  kategorie    – z. B. "Datenschutz", "Abrechnung", "Tastschreiben"
 *  symbol       – ein Emoji als Bild für die Karte
 *  datum        – Veröffentlichungsdatum, Format JJJJ-MM-TT
 *  ganzOben / ganzUnten – (optional) feste Position, wie bei ../apps.js
 *
 *  Neue Artefakte: Ordner  schule/<ordner>/index.html  anlegen,
 *  hier eintragen und  anleitungen/<id>.md  schreiben.
 * ============================================================
 */
window.APPS = [
  {
    id: "netzwerke-internet",
    titel: "Netzwerke & Internet",
    kurz: "Präsentation für Kaufleute im Dialogmarketing: 18 Fragen und Antworten zu Netzwerken, Internet, Protokollen, Webadressen, VPN und Extranet – mit Skizzen und Beispielen aus dem Kundenservice. Antworten erscheinen erst auf Klick.",
    link: "https://pati2018.github.io/schule/netzwerke-internet/",
    repo: "https://github.com/pati2018/pati2018.github.io/tree/main/schule/netzwerke-internet",
    kategorie: "Dialogmarketing",
    symbol: "🌐",
    datum: "2026-11-23"
  },
  {
    id: "audioguide",
    titel: "OMIVARO Audioguide",
    kurz: "Audioguide fürs Handy für Tourist-Informationen, Tourismuszentralen und Gemeinden – und deren Gäste: Stadtführungen mit Karte und Hörstücken, die per GPS von selbst starten. In fünf Sprachen, ohne App-Store. Mit Werbevideo zum Anschauen und Herunterladen.",
    link: "https://guide.gueck.eu/login.html?community=saarbruecken&code=123456",
    links: [
      { label: "Stadtführung Saarbrücken", url: "https://guide.gueck.eu/login.html?community=saarbruecken&code=123456" },
      { label: "Platja d'Aro (Spanien)", url: "https://guide.gueck.eu/login.html?community=castell-platja-daro&code=123456" }
    ],
    kategorie: "Tourismus",
    symbol: "🎧",
    datum: "2026-11-22",
    video: [
      { src: "../videos/audioguide.mp4", bild: "../videos/audioguide.jpg", titel: "Werbevideo für Gäste (1:51)", datei: "OMIVARO-Audioguide-Werbevideo-Gaeste.mp4" },
      { src: "../videos/audioguide-anbieter.mp4", bild: "../videos/audioguide-anbieter.jpg", titel: "Werbevideo für Städte, Gemeinden und Tourist-Informationen (1:54)", datei: "OMIVARO-Audioguide-Werbevideo-Anbieter.mp4" }
    ]
  },
  {
    id: "ki-agent-quiz",
    titel: "KI-Agent zuordnen",
    kurz: "Zuordnungsquiz: Ein KI-Agent ist gebaut wie ein Mensch. Acht Fachbegriffe wie Sprachmodell, Harness, Prompt, Skills, Connectors und Routinen den passenden Körperteilen zuordnen – mit Erklärung bei jeder richtigen Antwort.",
    link: "https://pati2018.github.io/schule/ki-agent-quiz/",
    repo: "https://github.com/pati2018/pati2018.github.io/tree/main/schule/ki-agent-quiz",
    kategorie: "Künstliche Intelligenz",
    symbol: "🤖",
    datum: "2026-11-19"
  },
  {
    id: "herzlich-willkommen",
    titel: "Herzlich willkommen im Reisebüro",
    kurz: "Lesetext im Lesemodus: Wie man Kundinnen und Kunden begrüßt und in den ersten Minuten Vertrauen aufbaut. Wichtige Stellen lassen sich farbig markieren, dazu Fragen zum Text mit Lösungshinweisen.",
    link: "https://pati2018.github.io/schule/herzlich-willkommen/",
    repo: "https://github.com/pati2018/pati2018.github.io/tree/main/schule/herzlich-willkommen",
    kategorie: "Kundenkommunikation",
    symbol: "👋",
    datum: "2026-11-19"
  },
  {
    id: "serienbrief",
    titel: "Serienbrief in 8 Schritten",
    kurz: "Animierte Erklärung des Serienbriefs in Word am Beispiel einer Einladung zur Grippeschutzimpfung: Hauptdokument + Datenquelle = 120 Briefe. Mit Sprachausgabe und automatischem Ablauf für den Beamer.",
    link: "https://pati2018.github.io/schule/serienbrief/",
    repo: "https://github.com/pati2018/pati2018.github.io/tree/main/schule/serienbrief",
    kategorie: "Textverarbeitung",
    symbol: "✉️",
    datum: "2026-11-19"
  },
  {
    id: "datenschutz-tom",
    titel: "TOM-Rundgang Datenschutz",
    kurz: "Die 14 technischen und organisatorischen Maßnahmen (TOM) im Datenschutz, erklärt an Beispielen aus Arzt- und Tierarztpraxis. Mit Präsentationsmodus für den Beamer, Übersicht und Quiz für MFA- und TFA-Azubis.",
    link: "https://pati2018.github.io/schule/datenschutz-tom/",
    links: [
      { label: "Öffnen", url: "https://pati2018.github.io/schule/datenschutz-tom/" },
      { label: "Quiz", url: "https://pati2018.github.io/schule/datenschutz-tom/#quiz" }
    ],
    repo: "https://github.com/pati2018/pati2018.github.io/tree/main/schule/datenschutz-tom",
    kategorie: "Datenschutz",
    symbol: "🛡️",
    datum: "2026-11-19"
  }
];
