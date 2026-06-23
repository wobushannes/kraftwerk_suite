import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { INITIAL_MOCK_DATA } from "./src/mockData";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware with generous limits to support embedded high-fidelity assets (files, images, etc.)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const dataDir = path.join(process.cwd(), "db_store");

  // Synchronous permission helper to recursively set chmod 777 on directories and 666 on files in /data
  function ensureWritePermissions(targetPath: string) {
    try {
      if (fs.existsSync(targetPath)) {
        const stats = fs.statSync(targetPath);
        if (stats.isDirectory()) {
          try {
            fs.chmodSync(targetPath, 0o777);
          } catch (e) {}
          const children = fs.readdirSync(targetPath);
          for (const child of children) {
            ensureWritePermissions(path.join(targetPath, child));
          }
        } else {
          try {
            fs.chmodSync(targetPath, 0o666);
          } catch (e) {}
        }
      }
    } catch (e: any) {
      console.warn(`[PERMISSIONS] Failed to set permissions for ${targetPath}:`, e.message);
    }
  }

  function ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true, mode: 0o777 });
    }
    try {
      fs.chmodSync(dirPath, 0o777);
    } catch (e: any) {
      console.warn(`[PERMISSIONS] Failed to chmod dir ${dirPath}:`, e.message);
    }
  }

  // Helper to safely write sync and chmod 0o666
  function safeWriteFileSync(filePath: string, data: string | NodeJS.ArrayBufferView, options?: fs.WriteFileOptions) {
    fs.writeFileSync(filePath, data, options);
    try {
      fs.chmodSync(filePath, 0o666);
    } catch (e: any) {
      console.warn(`[PERMISSIONS] Failed to chmod file ${filePath}:`, e.message);
    }
  }

  // Helper to safely copy sync and chmod 0o666
  function safeCopyFileSync(src: string, dest: string, flags?: number) {
    fs.copyFileSync(src, dest, flags);
    try {
      fs.chmodSync(dest, 0o666);
    } catch (e: any) {
      console.warn(`[PERMISSIONS] Failed to chmod copy dest ${dest}:`, e.message);
    }
  }

  ensureDir(dataDir);
  ensureDir(path.join(dataDir, "backups"));



  const collections = [
    "customers",
    "files",
    "messages",
    "appointments",
    "botRules",
    "unresolvedQueries",
    "invoices",
    "customTemplates",
    "products",
    "orders",
    "blogPosts",
    "blogPost",
    "auditLogs",
    "settings",
    "suppliers",
    "communicationTemplates"
  ];

  const oldDataFilePath = path.join(process.cwd(), "crm_data.json");
  const unifiedDataPath = path.join(dataDir, "crm_data.json");

  // Load CRM Data Helper
  function loadDataFromFiles() {
    const data: Record<string, any> = {};

    // 1. Initialisiere/Befülle alle leeren oder fehlenden JSON-Dateien direkt aus den INITIAL_MOCK_DATA
    for (const key of collections) {
      const filePath = path.join(dataDir, `${key}.json`);
      let shouldInitialize = false;

      if (!fs.existsSync(filePath)) {
        shouldInitialize = true;
      } else {
        try {
          const content = fs.readFileSync(filePath, "utf-8").trim();
          if (content === "" || content === "[]" || content === "{}" || content === "null") {
            shouldInitialize = true;
          }
        } catch (e) {
          shouldInitialize = true;
        }
      }

      if (shouldInitialize) {
        console.log(`[PERSISTENCE] Initialisiere leere oder fehlende Tabelle '${key}.json' aus Default-Daten...`);
        const fallbackValue = INITIAL_MOCK_DATA[key as keyof typeof INITIAL_MOCK_DATA] !== undefined 
          ? INITIAL_MOCK_DATA[key as keyof typeof INITIAL_MOCK_DATA] 
          : (key === "settings" ? {} : []);
        
        try {
          safeWriteFileSync(filePath, JSON.stringify(fallbackValue, null, 2), "utf-8");
        } catch (e) {
          console.error(`[ERROR] Fehler beim Schreiben der Standarddaten für '${key}.json':`, e);
        }
      }
    }

    // 2. Suche nach alten Migrationsdateien (crm_data.json) und räume diese ggf auf
    try {
      if (fs.existsSync(oldDataFilePath)) {
        fs.unlinkSync(oldDataFilePath);
        console.log("[CLEANUP] Bereinigte veraltete root crm_data.json.");
      }
      if (fs.existsSync(unifiedDataPath)) {
        fs.unlinkSync(unifiedDataPath);
        console.log("[CLEANUP] Bereinigte veraltete data/crm_data.json.");
      }
    } catch (err) {
      console.error("[WARNING] Cleanup-Fehlermeldung:", err);
    }

    // 3. Lade alle Kollektionen aus ihren individuellen persistenten JSON-Dateien
    for (const key of collections) {
      const filePath = path.join(dataDir, `${key}.json`);
      try {
        data[key] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch (e) {
        console.error(`[ERROR] Fehler beim Lesen von '${key}.json':`, e);
        data[key] = key === "settings" ? {} : [];
      }
    }

    return data;
  }

  // Pre-load data and perform any pending migrations on startup
  console.log("Initializing and splitting CRM data on startup...");
  loadDataFromFiles();
  
  // Ensure recursive write permissions on startup for all system directories and files
  ensureWritePermissions(dataDir);

  // API endpoints
  app.get("/api/crm-data", (req, res) => {
    const data = loadDataFromFiles();
    res.json(data);
  });

  app.post("/api/crm-data", (req, res) => {
    try {
      const newData = req.body;
      if (!newData || typeof newData !== "object") {
        return res.status(400).json({ error: "Invalid data format" });
      }

      // Save each collection present in the payload into its own JSON file
      for (const key of collections) {
        if (newData[key] !== undefined) {
          const filePath = path.join(dataDir, `${key}.json`);
          safeWriteFileSync(filePath, JSON.stringify(newData[key], null, 2), "utf-8");
        }
      }

      res.json({ success: true });
    } catch (e) {
      console.error("Error saving CRM data:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Write check endpoint to verify real-world directory & folder write rights
  app.get("/api/system/write-check", (req, res) => {
    try {
      const testFilePath = path.join(dataDir, ".write_test");
      fs.writeFileSync(testFilePath, "write_test_ok", "utf-8");
      try {
        fs.unlinkSync(testFilePath);
      } catch (e) {}

      const backupTestFile = path.join(dataDir, "backups", ".write_test");
      ensureDir(path.join(dataDir, "backups"));
      fs.writeFileSync(backupTestFile, "write_test_ok", "utf-8");
      try {
        fs.unlinkSync(backupTestFile);
      } catch (e) {}

      res.json({ success: true, writable: true, dataDirWritable: true, backupsDirWritable: true });
    } catch (err: any) {
      console.error("[PERMISSIONS] Write-check failed:", err);
      res.json({ success: false, writable: false, error: err.message });
    }
  });

  // Integrity check endpoint
  app.get("/api/integrity-check", (req, res) => {
    try {
      const report = [];
      for (const key of collections) {
        const filePath = path.join(dataDir, `${key}.json`);
        let exists = fs.existsSync(filePath);
        let sha256 = "N/A";
        let size = 0;
        let lastModified = "N/A";
        let valid = false;

        if (exists) {
          try {
            const stats = fs.statSync(filePath);
            size = stats.size;
            lastModified = stats.mtime.toISOString();
            
            const fileContent = fs.readFileSync(filePath, "utf-8");
            // Check parsing
            JSON.parse(fileContent);
            valid = true;
            
            // Calculate sha256
            sha256 = crypto.createHash("sha256").update(fileContent).digest("hex");
          } catch (e) {
            console.error(`Parsing error or read error for ${key}.json:`, e);
          }
        }
        report.push({
          name: `${key}.json`,
          collection: key,
          exists,
          sha256,
          size,
          lastModified,
          valid
        });
      }
      res.json(report);
    } catch (e) {
      console.error("Integrity check failed:", e);
      res.status(500).json({ error: "Failed to perform integrity check" });
    }
  });

  // Backup export endpoint
  app.post("/api/backup/export", (req, res) => {
    try {
      const { passphrase } = req.body;
      if (!passphrase || typeof passphrase !== "string") {
        return res.status(400).json({ error: "Passphrase is required" });
      }

      // Load current clean data
      const currentData = loadDataFromFiles();
      const payloadString = JSON.stringify({
        version: "1.0",
        timestamp: new Date().toISOString(),
        data: currentData
      });

      // Encrypt
      const salt = crypto.randomBytes(16);
      const derivedKey = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', derivedKey, iv);
      let encrypted = cipher.update(payloadString, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      res.json({
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        encrypted
      });
    } catch (e) {
      console.error("Backup export failed:", e);
      res.status(500).json({ error: "Failed to generate encrypted backup" });
    }
  });

  // Backup import endpoint
  app.post("/api/backup/import", (req, res) => {
    try {
      const { encrypted, iv, salt, passphrase } = req.body;
      if (!encrypted || !iv || !salt || !passphrase) {
        return res.status(400).json({ error: "Missing required backup details" });
      }

      const ivBuf = Buffer.from(iv, 'hex');
      const saltBuf = Buffer.from(salt, 'hex');
      const derivedKey = crypto.pbkdf2Sync(passphrase, saltBuf, 100000, 32, 'sha256');
      const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, ivBuf);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      const parsed = JSON.parse(decrypted);
      if (!parsed || parsed.version !== "1.0" || !parsed.data) {
        return res.status(400).json({ error: "Invalid backup structural version" });
      }

      const importedData = parsed.data;
      // Save all collections
      for (const key of collections) {
        if (importedData[key] !== undefined) {
          const filePath = path.join(dataDir, `${key}.json`);
          safeWriteFileSync(filePath, JSON.stringify(importedData[key], null, 2), "utf-8");
        }
      }

      res.json({ success: true, timestamp: parsed.timestamp });
    } catch (e: any) {
      console.error("Backup decryption/parsing failed:", e);
      res.status(400).json({ error: "Decryption failed: Falsches Passwort oder beschädigtes Archiv." });
    }
  });

  // Helper logic to write zip files
  async function runDailyBackupSync(passphrase: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const fileName = `daily_backup_${today}.zip.enc`;
      const backupsDir = path.join(dataDir, "backups");
      ensureDir(backupsDir);

      const destPath = path.join(backupsDir, fileName);
      if (fs.existsSync(destPath)) {
        return { success: true, message: "Backup already exists for today", fileName };
      }

      const JSZipModule = await import("jszip");
      const JSZip = JSZipModule.default;
      const zip = new JSZip();

      for (const key of collections) {
        const filePath = path.join(dataDir, `${key}.json`);
        if (fs.existsSync(filePath)) {
          zip.file(`${key}.json`, fs.readFileSync(filePath, "utf-8"));
        }
      }

      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

      const salt = crypto.randomBytes(16);
      const derivedKey = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, "sha256");
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv("aes-256-cbc", derivedKey, iv);

      const encryptedBody = Buffer.concat([cipher.update(zipBuffer), cipher.final()]);
      const finalBuffer = Buffer.concat([salt, iv, encryptedBody]);

      // SHA-256 Integrity Verification: Write to a temp file, calculate hash, match with memory, then move
      const tempPath = path.join(dataDir, `temp_${fileName}`);
      safeWriteFileSync(tempPath, finalBuffer);

      const hashFromDisk = crypto.createHash("sha256").update(fs.readFileSync(tempPath)).digest("hex");
      const hashFromMem = crypto.createHash("sha256").update(finalBuffer).digest("hex");

      if (hashFromDisk !== hashFromMem) {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        throw new Error("SHA-256 Integritätsprüfung nach dem Komprimieren fehlgeschlagen: Die geschriebene Datei weicht von den Originaldaten ab.");
      }

      // If integrity is validated, safely rename (move) the file to /data/backups/
      fs.renameSync(tempPath, destPath);
      console.log(`[Scheduler] Daily secure zip backup created and verified (SHA-256: ${hashFromDisk}): ${fileName}`);
      return { success: true, message: `Backup created: ${fileName}`, fileName, sha256: hashFromDisk };
    } catch (err: any) {
      console.error("[Scheduler] Daily backup failed:", err);
      return { success: false, error: err.message };
    }
  }

  // List all available backups
  app.get("/api/backups", (req, res) => {
    try {
      const backupsDir = path.join(dataDir, "backups");
      ensureDir(backupsDir);
      const files = fs.readdirSync(backupsDir);
      const backupsList = files
        .filter(f => f.endsWith(".zip.enc") || f.endsWith(".enc"))
        .map(f => {
          const filePath = path.join(backupsDir, f);
          const stats = fs.statSync(filePath);
          return {
            name: f,
            size: stats.size,
            createdAt: stats.birthtime.toISOString(),
            isAuto: f.startsWith("daily_backup_")
          };
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      res.json(backupsList);
    } catch (err: any) {
      console.error("Failed to read backups:", err);
      res.status(500).json({ error: "Backup-Ordner konnte nicht ausgelesen werden." });
    }
  });

  // Trigger manual encrypted ZIP backup saving directly to /data/backups/
  app.post("/api/backups/trigger-manual", async (req, res) => {
    try {
      const { passphrase } = req.body;
      if (!passphrase || typeof passphrase !== "string") {
        return res.status(400).json({ error: "Verschlüsselungs-Passwort ist erforderlich." });
      }

      const JSZipModule = await import("jszip");
      const JSZip = JSZipModule.default;
      const zip = new JSZip();

      for (const key of collections) {
        const filePath = path.join(dataDir, `${key}.json`);
        if (fs.existsSync(filePath)) {
          zip.file(`${key}.json`, fs.readFileSync(filePath, "utf-8"));
        }
      }

      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

      const salt = crypto.randomBytes(16);
      const derivedKey = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, "sha256");
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv("aes-256-cbc", derivedKey, iv);

      const encryptedBody = Buffer.concat([cipher.update(zipBuffer), cipher.final()]);
      const finalBuffer = Buffer.concat([salt, iv, encryptedBody]);

      const timestamp = new Date().toISOString().replace(/:/g, "-").split(".")[0];
      const fileName = `manual_backup_${timestamp}.zip.enc`;
      const backupsDir = path.join(dataDir, "backups");
      ensureDir(backupsDir);

      // SHA-256 Integrity Verification: Write to a temp file, calculate hash, match with memory, then move
      const tempPath = path.join(dataDir, `temp_${fileName}`);
      safeWriteFileSync(tempPath, finalBuffer);

      const hashFromDisk = crypto.createHash("sha256").update(fs.readFileSync(tempPath)).digest("hex");
      const hashFromMem = crypto.createHash("sha256").update(finalBuffer).digest("hex");

      if (hashFromDisk !== hashFromMem) {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        return res.status(500).json({ error: "SHA-256 Integritätsprüfung nach dem Komprimieren fehlgeschlagen: Die geschriebene Datei weicht von den Originaldaten ab." });
      }

      const destPath = path.join(backupsDir, fileName);
      fs.renameSync(tempPath, destPath);

      res.json({ 
        success: true, 
        message: `Sicherung erfolgreich angelegt und verifiziert! Dateiname: ${fileName} (SHA-256: ${hashFromDisk})`, 
        fileName,
        sha256: hashFromDisk 
      });
    } catch (err: any) {
      console.error("Manual backup trigger failed:", err);
      res.status(500).json({ error: "Sicherung konnte nicht erstellt werden: " + err.message });
    }
  });

  // Restore server from pre-existing ZIP backup file on disk
  app.post("/api/backups/restore-file", async (req, res) => {
    try {
      const { name, passphrase } = req.body;
      if (!name || !passphrase) {
        return res.status(400).json({ error: "Name und Kennwort sind erforderlich." });
      }

      const filePath = path.join(dataDir, "backups", name);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Sicherungsdatei wurde nicht gefunden." });
      }

      const fileBuf = fs.readFileSync(filePath);
      if (fileBuf.length < 32) {
        return res.status(400).json({ error: "Sicherungsdatei ist beschädigt oder zu klein." });
      }

      const salt = fileBuf.subarray(0, 16);
      const iv = fileBuf.subarray(16, 32);
      const encryptedData = fileBuf.subarray(32);

      const derivedKey = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, "sha256");
      const decipher = crypto.createDecipheriv("aes-256-cbc", derivedKey, iv);

      let zipBuffer;
      try {
        zipBuffer = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
      } catch (err) {
        return res.status(400).json({ error: "Informationen fehlerhaft: Falsches Passwort oder Datei korrupt." });
      }

      const JSZipModule = await import("jszip");
      const JSZip = JSZipModule.default;
      const zip = await JSZip.loadAsync(zipBuffer);

      for (const key of collections) {
        const zipFile = zip.file(`${key}.json`);
        if (zipFile) {
          const fileContent = await zipFile.async("string");
          // Validate JSON integrity
          JSON.parse(fileContent);
          safeWriteFileSync(path.join(dataDir, `${key}.json`), fileContent, "utf-8");
        }
      }

      res.json({ success: true, message: "System erfolgreich wiederhergestellt!" });
    } catch (err: any) {
      console.error("System restore failed:", err);
      res.status(500).json({ error: "Rekonstruktion fehlgeschlagen: " + err.message });
    }
  });

  // Delete a backup from disk
  app.delete("/api/backups", (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: "Name ist erforderlich" });
      const filePath = path.join(dataDir, "backups", name);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Sicherungsdatei nicht gefunden." });
      }
    } catch (err: any) {
      console.error("Failed to delete backup:", err);
      res.status(500).json({ error: "Sicherungsdatei konnte nicht gelöscht werden." });
    }
  });

  // EMERGENCY RESTORE & BACKUP JSON FILE ENDPOINTS
  app.get("/api/emergency/backups", (req, res) => {
    try {
      const backupsDir = path.join(dataDir, "backups");
      ensureDir(backupsDir);
      const files = fs.readdirSync(backupsDir);
      const jsonFiles = files
        .filter(f => f.endsWith(".json"))
        .map(f => {
          const filePath = path.join(backupsDir, f);
          const stats = fs.statSync(filePath);
          return {
            name: f,
            size: stats.size,
            createdAt: stats.mtime.toISOString(),
          };
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      res.json(jsonFiles);
    } catch (err: any) {
      console.error("Failed to read emergency backups:", err);
      res.status(500).json({ error: "Fehler beim Lesen des Notfall-Backup-Ordners: " + err.message });
    }
  });

  app.post("/api/emergency/create", (req, res) => {
    try {
      const { collectionName, customName } = req.body;
      if (!collectionName || !collections.includes(collectionName)) {
        return res.status(400).json({ error: "Ungültige Quell-Kollektion angegeben." });
      }
      const sourcePath = path.join(dataDir, `${collectionName}.json`);
      if (!fs.existsSync(sourcePath)) {
        return res.status(404).json({ error: "Quell-Datei existiert nicht." });
      }
      const filename = customName ? `${customName}.json` : `${collectionName}_backup_${new Date().toISOString().replace(/:/g, "-").split(".")[0]}.json`;
      const backupsDir = path.join(dataDir, "backups");
      ensureDir(backupsDir);
      safeCopyFileSync(sourcePath, path.join(backupsDir, filename));
      res.json({ success: true, message: `Backup-Datei ${filename} erfolgreich erstellt.` });
    } catch (err: any) {
      console.error("Failed to create emergency backup file:", err);
      res.status(500).json({ error: "Fehler beim Erstellen des Notfall-Backups: " + err.message });
    }
  });

  app.post("/api/emergency/restore", (req, res) => {
    try {
      const { backupFileName, targetCollection } = req.body;
      if (!backupFileName) {
        return res.status(400).json({ error: "Ausgangs-Backup-Datei ist erforderlich." });
      }
      if (!targetCollection || !collections.includes(targetCollection)) {
        return res.status(400).json({ error: "Ungültige Ziel-Kollektion angegeben." });
      }

      const sourcePath = path.join(dataDir, "backups", backupFileName);
      if (!fs.existsSync(sourcePath)) {
        return res.status(404).json({ error: `Notfall-Backup-Datei '${backupFileName}' wurde nicht gefunden.` });
      }

      // Parse file content to ensure it is valid JSON
      const content = fs.readFileSync(sourcePath, "utf-8");
      try {
         JSON.parse(content);
      } catch (parseErr) {
         return res.status(400).json({ error: "Die Backup-Datei enthält kein gültiges JSON." });
      }

      const targetPath = path.join(dataDir, `${targetCollection}.json`);
      safeWriteFileSync(targetPath, content, "utf-8");

      res.json({ success: true, message: `Kollektion ${targetCollection} erfolgreich aus ${backupFileName} wiederhergestellt!` });
    } catch (err: any) {
      console.error("Failed executing emergency restore:", err);
      res.status(500).json({ error: "Fehler bei der Notfall-Wiederherstellung: " + err.message });
    }
  });

  app.delete("/api/emergency/delete", (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: "Dateiname ist erforderlich." });
      const filePath = path.join(dataDir, "backups", name);
      if (fs.existsSync(filePath) && name.endsWith(".json")) {
        fs.unlinkSync(filePath);
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Notfall-Sicherungsdatei nicht gefunden." });
      }
    } catch (err: any) {
      console.error("Failed to delete emergency backup:", err);
      res.status(500).json({ error: "Sicherungsdatei konnte nicht gelöscht werden: " + err.message });
    }
  });

  // Scheduler-Background-Check
  async function checkDailyAutoBackup() {
    try {
      const settingsPath = path.join(dataDir, "settings.json");
      if (!fs.existsSync(settingsPath)) return;
      const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
      
      if (settings.autoBackupsEnabled) {
        const passphrase = settings.autoBackupPassphrase || "AuraProtectCRM123!";
        await runDailyBackupSync(passphrase);
      }
    } catch (err) {
      console.error("[Scheduler] Error in daily auto backup sync run:", err);
    }
  }

  // Trigger check on server startup after 5 seconds
  setTimeout(() => {
    checkDailyAutoBackup();
  }, 5000);

  // Interval check every 30 minutes to make it highly responsive without heavy overhead
  setInterval(() => {
    checkDailyAutoBackup();
  }, 1800000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
