# ⚡ ENTERPRISE CUSTOMER RELATIONSHIP MANAGEMENT PORTAL (JSON-FS-EMBEDDED) ⚡

Dieses hochgradig optimierte, autarke Enterprise-CRM-Portal wurde speziell als **Zero-Cloud-Lösung** konzipiert, um maximale Datensouveränität, Offline-Fähigkeit und absolute Unabhängigkeit von externen Plattform-Abonnements zu gewährleisten. Sämtliche Kern-Entitäten, Datenströme und Chatverläufe des Systems werden strukturiert, relational verknüpft und atomar in einzelnen, dedizierten JSON-Dateien im Verzeichnis `db_store/` direkt im Projektstamm abgelegt. This ensures complete lokal custody without third-party databases, making it private-by-design and resilient against distributed service outages.

---

## ⚖️ RECHTLICHER HAFTUNGSAUSSCHLUSS, RISIKOHINWEIS & SCHUTZKLAUSELN (WATERTIGHT DISCLAIMER)

**BITTE VOR INBETRIEBNAHME UND NUTZUNG SORGFÄLTIG LESEN!**

Durch die Verwendung, den Download, das Klonen oder die Bereitstellung dieser Software (nachfolgend „CRM-Portal“) erklären Sie sich rechtswirksam mit den folgenden Haftungs- und Nutzungsbedingungen einverstanden. Sollten Sie diesen Bedingungen nicht zustimmen, sind Sie nicht berechtigt, diese Software in irgendeiner Weise zu nutzen, zu vervielfältigen oder zu betreiben.

### §1 Gewährleistungsausschluss (As-Is Bereitstellung)
Diese Software wird von den Entwicklern und Urhebern im vorliegenden Zustand (**„wie besehen“ bzw. „as-is“** sowie **„wie verfügbar“ bzw. „as-available“**) bereitgestellt. Jegliche ausdrückliche, stillschweigende oder gesetzliche Gewährleistung ist vollumfänglich ausgeschlossen. Dies umfasst insbesondere, aber nicht abschließend:
1. Die stillschweigende Gewährleistung der Marktübereinstimmung (Merchantability), der Eignung für einen bestimmten Zweck (Fitness for a particular purpose) sowie der Nichtverletzung von Rechten Dritter.
2. Keine Zusicherung bezüglich der Fehlerfreiheit, Ausfallsicherheit, Virenfreiheit, Verfügbarkeit oder der kontinuierlichen Betriebsbereitschaft des CRM-Portals.
3. Keine Garantie, dass die durch das System erfassten Daten, Berechnungen (z.B. Umsatzberichte, Mehrwertsteuer-Sollwerte von 19%, Rechnungsbeträge oder steuerliche Abrechnungsdaten) oder Protokolle im Sinne lokaler Finanz- oder Datenschutzbehörden gesetzeskonform, fehlerfrei oder auditsicher sind.

### §2 Umfassende Haftungsbegrenzung (Schadensersatzausschluss)
Soweit gesetzlich zulässig, haften die Entwickler, Contributoren oder Distributoren in keinem Fall für Schäden jeglicher Art, die direkt oder indirekt aus der Installation, dem Betrieb, der Nutzung, der Nichtnutzbarkeit oder dem Fehlverhalten des CRM-Portals resultieren. Der Ausschluss erstreckt sich insbesondere auf:
* **Datenverlust und Datenkorruption:** Unabhängig davon, ob durch fehlerhafte Lese- oder Schreibvorgänge im lokalen `/db_store`-Verzeichnis, SHA-256 Signalabweichungen, fehlerhafte Backup-Rekonstruktionen oder Schadsoftware-Einfluss.
* **Finanzielle Einbußen und Betriebsunterbrechung:** Einschließlich entgangener Gewinne (Loss of profits), Verlust von Geschäftsgeheimnissen (Loss of business data), Image-Schäden oder technischer Totalausfälle von Servern.
* **Sicherheitsverletzungen:** Jeglicher unbefugte Zugriff Dritter auf unverschlüsselte oder verschlüsselte lokale JSON-Speicherdateien, Man-in-the-Middle-Angriffe auf den Express-Server oder unberechtigte Entschlüsselung von Belegen wird dem Betreiber als eigenes Risiko zugerechnet.
* Die Haftungsbeschränkung gilt unabhängig von der Rechtsgrundlage (Vertrag, unerlaubte Handlung, verschuldensunabhängige Haftung oder sonstige Rechtsverletzung) und selbst dann, wenn auf die Möglichkeit solcher Schäden hingewiesen wurde.

### §3 Eigenverantwortung bezüglich Datenschutz (DSGVO / GDPR) und IT-Sicherheit
Da dieses System vollständig lokal und ohne Cloud-Anbindung gehostet werden kann, obliegt die Einhaltung aller anwendbaren rechtlichen Bestimmungen ausschließlich dem Betreiber:
1. **DSGVO-Konformität:** Der Betreiber ist allein dafür verantwortlich, dsgvo-konforme Datenschutzerklärungen, Cookie- und Consent-Banner (z.B. das integrierte WCAG-konforme Consent-Tool) ordnungsgemäß zu konfigurieren und die Einwilligungshistorien auditsicher zu archivieren.
2. **Backup & Systemhärtung:** Die Generierung verschlüsselter ZIP-Mastersicherungen über das Admin-Panel muss regelmäßig manuell oder per Cron-Job initiiert werden. Für die systemseitige Absicherung (Feuerwände, SSL/TLS-Zertifikate über Nginx Reverse Proxy, SSH-Key-Authentifizierung via PuTTY) ist ausschließlich der jeweilige Administrator des Zielsystems verantwortlich.

### §4 Kein Anspruch auf Support, Wartung oder Updates
Dieses Projekt ist ein autarkes, abgeschlossenes Funktions-Template. 
* Es besteht **keinerlei Anspruch** auf technischen Support, Bugfixes, telefonische Beratung, Code-Anpassungen, Schulungen oder kontinuierliche Updates des CRM-Portals.
* Jegliche Kontaktaufnahme oder Hilfestellung durch Entwickler erfolgt auf reiner Kulanzbasis und begründet keine vertraglichen Pflichten oder zukünftigen Serviceansprüche.

### §5 Drittanbieter-Schnittstellen und Hardware-Token
Die Erwähnung, Schnittstellenkonfiguration oder Bereitstellung von Adaptern für Drittprodukte und Dienstleistungen (wie z.B. **YubiKeys von Yubico, DATEV-Exportmodule, Lexoffice-Schnittstellen, DeepL-Übersetzungs-Engines, DHL-Sendungsverfolgungen, Deutsche Telekom Business-Verbindungen oder PayPal**) erfolgt ohne Lizenzpartnerschaft. Der Betreiber muss eigene Accounts und Lizenzvereinbarungen mit diesen Drittanbietern abschließen und haftet separat für deren Integration und Datenaustausch-Sicherheit.

### §6 Salvatorische Klausel
Sollten einzelne Bestimmungen dieses Haftungsausschlusses nach geltendem Recht unwirksam, ungültig oder undurchsetzbar sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt. Anstelle der unwirksamen Bestimmung gilt eine solche wirksame Bestimmung als vereinbart, die dem wirtschaftlichen und rechtlichen Zweck der ursprünglichen Bestimmung am nächsten kommt.

---

## 🛠️ Systemarchitektur & Datensicherheits-Konzept

Das CRM-Portal nutzt ein innovatives, kombiniertes Backend-Frontend-Muster (Express-Server gepaart mit einem reaktiven, modernen React-Client mittels Vite):

```
+---------------------------------------------------------------------------------+
|                                 WEB-BROWSER (CLIENT)                            |
|  [React-Frontend] <--> [AES-256 Kryptographie] <--> [Data Visualizer (D3/Recharts)]|
+---------------------------------------------------------------------------------+
                                         ^
                                         |  HTTPS / REST-API
                                         v
+---------------------------------------------------------------------------------+
|                               PM2 NODEJS SERVER                                 |
|  [Express-API Gateway] <--> [SHA-256 Integrity Monitor] <--> [Backup/Restore Engine]|
+---------------------------------------------------------------------------------+
                                         ^
                                         |  Local Filesystem I/O
                                         v
+---------------------------------------------------------------------------------+
|                             JSON SECURE DATABASE STACK                          |
|  /db_store/  -->  [customers] [appointments] [orders] [invoices] [suppliers]     |
|                   [unresolvedQueries] [messages] [settings] [templates]         |
+---------------------------------------------------------------------------------+
```

### Die 8 Säulen der integrierten Datensicherheit:
1. **Dateisystem-Persistenz im Verzeichnis `db_store/`**: Keine flüchtigen Browser-Speicher! Ihre Daten verbleiben physisch auf Ihrem Server. Der Server trennt CRM-Entitäten in standardisierte, lesbare JSON-Schemata.
2. **Kryptographische Datenkonsistenzprüfung (SHA-256)**: Bei jeder Transaktion und jedem Serverstart führt der Server einen automatischen Integritäts-Check durch. Bit-Korruptionen auf der Festplatte oder unbefugte manuelle Manipulationen an den JSON-Dateien werden sofort detektiert und im Dashboard gemeldet.
3. **E2EE (Ende-zu-Ende-Verschlüsselung)**: Hochgeladene, vertrauliche Belege, Verträge oder Ausweise werden clientseitig im Browser mittels AES-256 signiert und verschlüsselt. Der Host-Server speichert nur verschlüsselte Blobs.
4. **Vollverschlüsseltes Backup- & Datensicherungs-Tool**: Über den Administrationsbereich können hochsichere Master-Sicherungen des gesamten `/db_store`-Datenbestands generiert und heruntergeladen werden. Die Backups sind mittels PBKDF2-Verschlüsselungs-Passwörtern und einer massiven AES-256-CBC-Chiffre geschützt.
5. **Echtzeit-Integritätsprüfung nach Komprimierung**: Bei der Backup-Erstellung schreibt der Server eine temporäre ZIP-Archivdatei, berechnet deren physischen SHA-256 Hashwert und gleicht diesen bitgenau mit dem In-Memory-Vorbereitungspuffer ab. Erst bei 100% Bit-Exaktheit wird das Backup freigegeben.
6. **Notfall-Wiederherstellungs-Zentrale (Emergency Restore)**: Ein dediziertes Wiederherstellungs-Dashboard ermöglicht das Hochladen und atomare Einlesen von Backup-Dateien (sowohl serverinterne, automatische Backups aus `/db_store/backups/` als auch externe Sicherungsdateien). Das Dateisystem kalibriert sich in Millisekunden neu.
7. **White-Labeling & Custom Branding**: Flexibel konfigurierbare Portalstrukturen sorgen dafür, dass Partner-Brandings im Kundenbereich vollständig deaktiviert oder durch eigene Unternehmensidentitäten ersetzt werden können.
8. **Intelligente Kommunikations-Vorlagen (communicationTemplates.json)**: Ein hocheffizienter Vorlagen-Manager erlaubt das systemweite Definieren von Textbausteinen für Direct-Messages, E-Mail-Templates und Support-Antworten mit dynamischen Platzhaltern.

---

## ✨ LETZTE UPDATES & ERREICHTE MEILENSTEINE (RELEASE NOTES)

In den jüngsten Entwicklungszyklen wurden signifikante Funktionserweiterungen, Stabilitätsupgrades und echte relationale Ergänzungen vorgenommen, um das Portal auf ein professionelles Enterprise-Level anzuheben:

### 📅 1. Termin- & Einsatzplanung (`appointments.json`)
* **Meilenstein:** Vollständige Integration eines intelligenten Terminkalenders zur Koordination von Kundenbesprechungen, Serviceeinsätzen und technischen Onboardings.
* **Details:** Jedes Kalenderelement ist über eine eindeutige ID (`customerId`) relational mit dem Hauptkundenstamm verknüpft. Ermöglicht detaillierte Agenda-Ansichten, Zeit- und Datumsfilter sowie die Vorbereitung für Google-Calendar API-Brücken.

### 📦 2. Bestellwesen, Logistik & Versandlabel (`orders.json`)
* **Meilenstein:** Implementierung einer vollwertigen E-Commerce Bestellabwicklungsdatenbank.
* **Details:** Speicherung detaillierter Warenkörbe (`items`, `priceAtPurchase`, `totalAmount`), automatisierte Zuweisung von Versanddienstleistern (DHL Express, UPS, etc.), Echtzeit-Einbindung von Trackingnummern (`trackingNumber`) zur direkten Sendungsverfolgung im Kundeninterface und digitale Bestätigung des DSGVO-Einwilligungsbanners je Bestellung.

### 🧾 3. Finanzbuchhaltungs- & Rechnungswesen (`invoices.json`)
* **Meilenstein:** Einführung eines revisionsfähigen internen ERP-Rechnungsmoduls.
* **Details:** Jedes Rechnungsdokument (`invoiceNumber`) berechnet vollautomatisch Netto-Beträge, Steueranteile (exakt basierend auf dem 19%-Mehrwertsteuersatz in Deutschland) und Brutto-Endbeträge. Es beinhaltet Status-Tracking (Bezahlt, Offen, Überfällig, Storniert, Rückerstattet), Fälligkeitsdaten (`dueDate`), Zahlungsmethoden und detaillierte Einzelposten (`invoiceItems`).

### 🤝 4. Globales B2B-Lieferantenverzeichnis (`suppliers.json`)
* **Meilenstein:** Etablierung eines zentralen Lieferantenstamms zur Optimierung von Lieferketten und API-Partnern.
* **Details:** Vordefinierte, lebensechte Profile marktführender Partner (z.B. Yubico Europe für Hardware-Token, DATEV eG für FiBu-Export, Haufe-Lexware für Buchhaltungsbridges, DeepL SE für Übersetzungsschnittstellen sowie Transportlogistiker). Jeder Eintrag enthält feste Ansprechpartner, E-Mail-Adressen und physische Standorte zur direkten Kontaktaufnahme.

### 💬 5. Interaktiver Multi-User Chatverlauf (`messages.json`)
* **Meilenstein:** Entwicklung einer nahtlos geführten Kommunikationszentrale im Kundenfrontend.
* **Details:** Pre-populated, immersive Chatverläufe zwischen Administratoren (`admin`) und diversen Mandanten (z.B. Max Mustermann, Tom Weber, Julia Kaiser). Unterstützt Echtzeit-Statusänderungen (`isRead`), präzise UTC-Zeitstempel und die direkte Kopplung an das Textbaustein-Dropdown für blitzschnellen Support.

### ❓ 6. Ticket- & Supportanfragen-Tracker (`unresolvedQueries.json`)
* **Meilenstein:** Systematische Erfassung offener Kundenanfragen und ungeklärter technischer Fragen.
* **Details:** Speichert Detailfragen zu komplexen Themen wie WCAG 2.1 Barrierefreiheit, Offline-Tauglichkeit auf Kreuzfahrtschiffen, SMTP-Mailserverporten und YubiKey-Anlernung. Ermöglicht Admins, gezielte Rückrufe oder Chatantworten zu initiieren und erhöht die Kundenzufriedenheit drastisch.

---

## 🚀 Schnellstart-Anleitung für lokale Rechner

Sollten Sie beim Starten des Systems die Fehlermeldung erhalten, dass das Werkzeug `"vite"` oder `"tsx"` nicht gefunden werden kann, wurden die Pakete noch nicht installiert. Führen Sie folgendes in Ihrer Konsole aus:

### Schritt 1: Projekt-Verzeichnis im Terminal öffnen
Navigieren Sie in den Ordner, in dem sich diese `package.json` und `README.md` befinden:
```bash
cd /pfad/zu/ihrem/crm-portal
```

### Schritt 2: npm install (Einmalige Initialisierung)
Laden Sie alle Kernkomponenten und Entwicklerwerkzeuge sicher auf Ihre Festplatte herunter:
```bash
npm install
```

### Schritt 3: Entwickler-Server booten
Starten Sie den reaktiven Node/Express/Vite-Server:
```bash
npm run dev
```

### Schritt 4: Portal im Browser aufrufen
Öffnen Sie Ihren gewohnten Internet-Browser und tippen Sie folgende Addresse ein:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Demo-Zugangsdaten (Sofort loslegen)

Sie können sich direkt mit folgenden Offline-Accounts im Webportal anmelden:

* **🔐 System-Administrator (Vollzugriff):**
  * **Benutzername:** `admin`
  * **Passwort:** `admin123`
  
* **👤 Mandant / Kunde (Max Mustermann):**
  * **Benutzername:** `max.muster`
  * **Passwort:** `kunde123`

---

## 🖥️ Server-Installation & Deployment (via PuTTY & Linux-Terminal)

Das CRM-Portal lässt sich extrem ressourcensparend auf jedem gängigen Linux-vServer (z.B. Debian, Ubuntu, CentOS) deployen:

### 1. Node.js & Essentials einrichten
Verbinden Sie sich via SSH (z.B. mit PuTTY) mit Ihrem Server und installieren Sie Node.js:
```bash
sudo apt update && sudo apt upgrade -y
sudo curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git build-essential
```

### 2. Projekt klonen & Kompilieren (Production Build)
```bash
# 1. In das Projektverzeichnis wechseln
npm install

# 2. Den optimierten Produktions-Server generieren
npm run build
```
Das Build-System bündelt sämtliche Backend-Eigenschaften in eine hochperformante, robuste JavaScript-Datei namens `dist/server.cjs` und legt das static UI im Ordner `dist/` nieder.

### 3. Ausfallsicherer Hintergrundbetrieb mit PM2
Damit Ihr JSON-Dateisystem-Server auch nach dem Schließen des SSH-Terminals und bei Systemneustarts dauerhaft erreichbar bleibt, nutzen wir den Prozess-Manager **PM2**:
```bash
# PM2 global installieren
sudo npm install -y pm2 -g

# CRM Server im Hintergrund starten und taufen
pm2 start dist/server.cjs --name "enterprise-crm"

# Automatischen Neustart bei Server-Reboots einrichten
pm2 save
pm2 startup
```

### 4. Nginx als sicheren SSL Reverse Proxy konfigurieren
Erstellen Sie eine Nginx-Konfiguration, um den Port `3000` via HTTPS (Port `443`) sicher ins World Wide Web zu routen:
```nginx
server {
    listen 80;
    server_name crm.ihre-domain.de;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name crm.ihre-domain.de;

    ssl_certificate /etc/letsencrypt/live/crm.ihre-domain.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/crm.ihre-domain.de/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📂 Live-Dateisystem Überwachung (Safety Monitor)

Im **Admin-Bereich -> Sicherheits-Dashboard** der Webansicht stehen mächtige Überwachungswerkzeuge zur Verfügung:
* **Live-Schreib-Logbuch:** Sofortige, visuelle Protokollierung inklusive Millisekunden-Zeitstempel bei jedem physischen Scheibprozedere im Verzeichnis `/db_store`.
* **Dateisystem-Analyse:** Direkte Inspektion aller geladenen JSON-Dateien inklusive Dateigrößen, letztem Bearbeitungszeitpunkt und dem kryptographischen SHA-256 Integritätshash.

---
*Entwickelt für höchste Datensouveränität und anspruchsvolle B2B-Prozesse. Systemstatus: 🟢 Autark & Betriebsbereit.*
