// Quiz-Runden: werden beim Bauen hinter die genannte Folie gesetzt.
// typ: mc = Multiple Choice, wf = wahr/falsch, zu = zuordnen, rf = Reihenfolge
module.exports = [
  {
    titel: 'Netzwerke', nach: 'ablauf',
    fragen: [
      { typ: 'mc', frage: 'Was ist ein Rechner-Netzwerk?',
        opts: ['Ein einzelner, besonders schneller Computer', 'Ein Verbund von Rechnern, die miteinander kommunizieren', 'Ein Programm zum Schreiben von E-Mails', 'Ein Drucker mit WLAN'], richtig: 1,
        erkl: 'Rechner werden verbunden, damit sie Daten austauschen und Geräte gemeinsam nutzen können.' },
      { typ: 'zu', frage: 'Welches Netz ist das? Ordnen Sie zu.', kat: ['LAN', 'WLAN', 'WAN', 'GAN'],
        items: [['Kabel-Netz in einem Callcenter-Gebäude', 'LAN'], ['Laptop im Homeoffice, per Funk am Router', 'WLAN'], ['Filialen in Saarbrücken, Trier und Mainz sind verbunden', 'WAN'], ['Eine Kundin in Spanien besucht den Online-Shop', 'GAN']],
        erkl: 'L = lokal, W = weit, G = global. WLAN ist ein LAN über Funk.' },
      { typ: 'wf', frage: 'Im Intranet eines Unternehmens kann jeder Mensch auf der Welt die Daten sehen.', richtig: false,
        erkl: 'Falsch: Das Intranet ist geschlossen – nur für Mitarbeitende.' },
      { typ: 'mc', frage: 'Was gilt für ein Peer-to-Peer-Netzwerk?',
        opts: ['Es gibt einen zentralen Server', 'Jeder Rechner ist gleichberechtigt – Client und Server zugleich', 'Es besteht immer nur aus zwei Rechnern', 'Es funktioniert nur ohne Kabel'], richtig: 1,
        erkl: '„Peer“ heißt „der Gleichgestellte“ – es gibt keinen zentralen Server.' },
      { typ: 'zu', frage: 'Client oder Server? Ordnen Sie zu.', kat: ['Client', 'Server'],
        items: [['Browser am Arbeitsplatz', 'Client'], ['Kundendatenbank, die Anfragen beantwortet', 'Server'], ['CRM-Programm, das Kundendaten anfordert', 'Client'], ['Webserver mit dem Online-Shop', 'Server']],
        erkl: 'Der Client fordert an, der Server bedient (to serve = bedienen).' },
      { typ: 'rf', frage: 'Aufruf einer Website: Tippen Sie die Schritte in der richtigen Reihenfolge an.',
        items: ['Browser fordert die Seite an', 'Verbindung zum Webserver', 'Server sucht die HTML-Datei', 'Datei wird zum Browser gesendet', 'Browser zeigt die Seite an'],
        erkl: 'Anfordern – Verbinden – Suchen – Senden – Anzeigen.' }
    ]
  },
  {
    titel: 'Internet', nach: 'q09',
    fragen: [
      { typ: 'wf', frage: 'Internet und World Wide Web sind dasselbe.', richtig: false,
        erkl: 'Falsch: Das Internet ist das Netz der Netze, das WWW nur ein Dienst darin.' },
      { typ: 'mc', frage: 'Welcher ist KEIN Internetdienst?',
        opts: ['WWW', 'E-Mail', 'VoIP', 'Tabellenkalkulation'], richtig: 3,
        erkl: 'Eine Tabellenkalkulation ist ein Programm, kein Dienst im Internet.' },
      { typ: 'zu', frage: 'Welcher Internetdienst wird genutzt?', kat: ['WWW', 'E-Mail', 'VoIP'],
        items: [['Newsletter an 5.000 Kundinnen und Kunden', 'E-Mail'], ['Eine Kundin öffnet die Landingpage der Kampagne', 'WWW'], ['Ein Agent telefoniert über das Headset am PC', 'VoIP']],
        erkl: 'Im Dialogmarketing laufen alle drei Dienste zusammen.' },
      { typ: 'mc', frage: 'Wo liegen die Wurzeln des Internets?',
        opts: ['In einem Forschungsprojekt des US-Verteidigungsministeriums', 'Bei einer Suchmaschinen-Firma', 'Bei der Deutschen Post', 'Bei einem Telefonanbieter in Japan'], richtig: 0,
        erkl: 'Das ARPANET (1969) war ein Forschungsprojekt des US-Verteidigungsministeriums.' },
      { typ: 'rf', frage: 'Zeitstrahl: Tippen Sie die Ereignisse vom ältesten zum neuesten an.',
        items: ['ARPANET verbindet vier Rechner (1969)', 'Die erste E-Mail (1971)', 'TCP/IP wird Standard (1983)', 'Das WWW wird öffentlich (1991)'],
        erkl: '1969 – 1971 – 1983 – 1991.' }
    ]
  },
  {
    titel: 'Protokolle', nach: 'q13',
    fragen: [
      { typ: 'mc', frage: 'Was ist ein Protokoll in der Computertechnik?',
        opts: ['Die Mitschrift einer Besprechung', 'Regeln, wie Computer Daten austauschen', 'Ein Virenschutz-Programm', 'Ein besonderes Netzwerkkabel'], richtig: 1,
        erkl: 'Protokolle sind Kommunikationsregeln – wie DIN 5008 für Geschäftsbriefe.' },
      { typ: 'zu', frage: 'Welches Protokoll kommt zum Einsatz?', kat: ['SMTP', 'IMAP / POP3', 'FTP', 'HTTPS'],
        items: [['Ein Mailing an Kunden verschicken', 'SMTP'], ['Neue E-Mails im Postfach abrufen', 'IMAP / POP3'], ['Die neue Landingpage auf den Webserver hochladen', 'FTP'], ['Eine Kundin bezahlt im Online-Shop', 'HTTPS']],
        erkl: 'Senden = SMTP, Abrufen = IMAP/POP3, Hochladen = FTP, sicher surfen = HTTPS.' },
      { typ: 'wf', frage: 'Für Online-Banking reicht HTTP ohne S völlig aus.', richtig: false,
        erkl: 'Falsch: Bei Bank, Bestellung und Login muss HTTPS laufen – erkennbar am Schloss.' },
      { typ: 'mc', frage: 'Wofür steht das „S“ in HTTPS?',
        opts: ['Schnell', 'Server', 'Secure – sicher', 'Standard'], richtig: 2,
        erkl: 'Secure: Die Daten werden verschlüsselt übertragen.' },
      { typ: 'mc', frage: 'Was erledigt TCP?',
        opts: ['Es zerlegt Daten in nummerierte Pakete und prüft, ob alles ankommt', 'Es zeigt Webseiten auf dem Bildschirm an', 'Es legt die Endung .de fest', 'Es schützt vor Viren'], richtig: 0,
        erkl: 'TCP zerlegt und prüft – IP adressiert die Pakete.' }
    ]
  },
  {
    titel: 'Adressen & Zugang', nach: 'q18',
    fragen: [
      { typ: 'zu', frage: 'Welche Top Level Domain passt?', kat: ['.at', '.it', '.org', '.com'],
        items: [['Ein Reisebüro in Österreich', '.at'], ['Ein Hotel in Italien', '.it'], ['Ein gemeinnütziger Verein', '.org'], ['Ein weltweit tätiger Online-Händler', '.com']],
        erkl: 'Die TLD zeigt das Land oder die Art des Angebots.' },
      { typ: 'mc', frage: 'Welcher Teil von „https://www.reise-service.de/angebote“ ist die Top Level Domain?',
        opts: ['https', 'reise-service', '.de', '/angebote'], richtig: 2,
        erkl: 'Die TLD ist die Endung des Domain-Namens: .de' },
      { typ: 'mc', frage: 'Eine Agentin im Homeoffice braucht sicheren Zugriff auf das CRM der Firma. Was nutzt sie?',
        opts: ['VPN', 'WLAN', 'FTP', 'POP3'], richtig: 0,
        erkl: 'VPN baut einen verschlüsselten Tunnel durch das Internet ins Firmennetz.' },
      { typ: 'zu', frage: 'Intranet, Extranet oder Internet?', kat: ['Intranet', 'Extranet', 'Internet'],
        items: [['Schichtplan nur für Beschäftigte', 'Intranet'], ['Der Lettershop holt Adresslisten mit Passwort ab', 'Extranet'], ['Kontaktformular für alle Kunden', 'Internet']],
        erkl: 'Innen nur Mitarbeitende, dazwischen Partner mit Zugang, außen alle.' },
      { typ: 'wf', frage: '„URL“ ist eine andere Bezeichnung für die Webadresse.', richtig: true,
        erkl: 'Richtig: URL = Uniform Resource Locator.' }
    ]
  }
];
