const { safeStorage, app } = require('electron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class AuthVault {
  constructor(filename = 'diaspro_vault.json') {
    const userDataPath = app ? app.getPath('userData') : process.cwd();
    this.vaultPath = path.join(userDataPath, filename);
    this.data = this.loadVault();
  }

  loadVault() {
    try {
      if (fs.existsSync(this.vaultPath)) {
        return JSON.parse(fs.readFileSync(this.vaultPath, 'utf8'));
      }
    } catch (e) {
      console.error('Error loading AuthVault file:', e);
    }
    return {};
  }

  saveVault() {
    try {
      fs.writeFileSync(this.vaultPath, JSON.stringify(this.data, null, 2));
    } catch (e) {
      console.error('Error saving AuthVault file:', e);
    }
  }

  // Hardened AES encryption key derived via PBKDF2 (100,000 iterations) if safeStorage unavailable
  getFallbackKey() {
    const secret = process.env.COMPUTERNAME || process.env.HOSTNAME || 'diaspro-fallback-secret';
    const salt = Buffer.from('diaspro-viboard-machine-salt-v2', 'utf8');
    return crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha256');
  }

  encryptValue(plainText) {
    if (!plainText) return null;
    try {
      if (safeStorage && safeStorage.isEncryptionAvailable()) {
        const encryptedBuffer = safeStorage.encryptString(plainText);
        return {
          method: 'safeStorage',
          content: encryptedBuffer.toString('base64'),
        };
      }
    } catch (e) {
      console.warn('safeStorage encryption failed, using AES-GCM fallback:', e);
    }

    // AES-256-GCM Fallback Encryption
    try {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv('aes-256-gcm', this.getFallbackKey(), iv);
      const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
      const authTag = cipher.getAuthTag();

      return {
        method: 'fallbackAES-GCM',
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        content: encrypted.toString('hex'),
      };
    } catch (e) {
      console.error('AES-GCM encryption fallback failed:', e);
      return null;
    }
  }

  decryptValue(entry) {
    if (!entry || !entry.content) return null;
    try {
      if (entry.method === 'safeStorage' && safeStorage && safeStorage.isEncryptionAvailable()) {
        const buffer = Buffer.from(entry.content, 'base64');
        return safeStorage.decryptString(buffer);
      }
    } catch (e) {
      console.warn('safeStorage decryption failed, checking fallback:', e);
    }

    // AES-256-GCM Fallback Decryption
    if (entry.method === 'fallbackAES-GCM' && entry.authTag) {
      try {
        const iv = Buffer.from(entry.iv, 'hex');
        const authTag = Buffer.from(entry.authTag, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-gcm', this.getFallbackKey(), iv);
        decipher.setAuthTag(authTag);
        const decrypted = Buffer.concat([decipher.update(Buffer.from(entry.content, 'hex')), decipher.final()]);
        return decrypted.toString('utf8');
      } catch (e) {
        console.error('AES-GCM decryption failed:', e);
        return null;
      }
    }

    // Legacy AES-256-CTR Fallback decryption for backward compatibility
    if (entry.method === 'fallbackAES' || entry.iv) {
      try {
        const iv = Buffer.from(entry.iv, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-ctr', this.getFallbackKey(), iv);
        const decrypted = Buffer.concat([decipher.update(Buffer.from(entry.content, 'hex')), decipher.final()]);
        return decrypted.toString('utf8');
      } catch (e) {
        console.error('Legacy AES-CTR decryption failed:', e);
      }
    }
    return null;
  }

  saveToken(service, secretData) {
    if (secretData === undefined || secretData === null) {
      return this.removeToken(service);
    }
    const strToEncrypt = typeof secretData === 'string' ? secretData : JSON.stringify(secretData);
    const encrypted = this.encryptValue(strToEncrypt);
    if (encrypted) {
      this.data[service] = {
        ...encrypted,
        updatedAt: new Date().toISOString(),
      };
      this.saveVault();
      return true;
    }
    return false;
  }

  getToken(service) {
    const entry = this.data[service];
    if (!entry) return null;
    const decryptedStr = this.decryptValue(entry);
    if (!decryptedStr) return null;
    const trimmed = decryptedStr.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        return decryptedStr;
      }
    }
    return decryptedStr;
  }

  removeToken(service) {
    if (this.data[service]) {
      delete this.data[service];
      this.saveVault();
      return true;
    }
    return false;
  }

  hasToken(service) {
    return !!this.data[service];
  }
}

module.exports = AuthVault;
