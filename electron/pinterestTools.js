const http = require('http');
const crypto = require('crypto');
const { shell } = require('electron');

class PinterestTools {
  constructor(authVault) {
    this.authVault = authVault;
  }

  static base64UrlEncode(buffer) {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  static generatePKCE() {
    const verifier = this.base64UrlEncode(crypto.randomBytes(32));
    const challenge = this.base64UrlEncode(
      crypto.createHash('sha256').update(verifier).digest()
    );
    return { verifier, challenge };
  }

  getClientId() {
    return (
      this.authVault.getToken('pinterest_client_id') ||
      process.env.PINTEREST_CLIENT_ID ||
      '1508219' // Default fallback Client ID for dev/demo
    );
  }

  getClientSecret() {
    return (
      this.authVault.getToken('pinterest_client_secret') ||
      process.env.PINTEREST_CLIENT_SECRET ||
      ''
    );
  }

  getTokens() {
    return this.authVault.getToken('pinterest_tokens');
  }

  async startPinterestOAuth() {
    const clientId = this.getClientId();
    if (!clientId) {
      return { success: false, error: 'Pinterest App/Client ID non configurato. Inseriscilo nelle Impostazioni.' };
    }

    const { verifier, challenge } = PinterestTools.generatePKCE();
    const scopes = ['boards:read', 'pins:read', 'user_accounts:read'];

    return new Promise((resolve) => {
      const server = http.createServer(async (req, res) => {
        try {
          const reqUrl = new URL(req.url, `http://127.0.0.1`);
          const code = reqUrl.searchParams.get('code');
          const errorParam = reqUrl.searchParams.get('error');

          if (errorParam) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h2>Autenticazione Pinterest annullata. Puoi chiudere questa pagina.</h2>');
            server.close();
            return resolve({ success: false, error: `Pinterest OAuth error: ${errorParam}` });
          }

          if (code) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
              <!DOCTYPE html>
              <html>
              <head><title>epicSnail - Pinterest Connesso</title></head>
              <body style="font-family: sans-serif; background: #1e1333; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
                <div style="text-align: center; background: #2b1c47; padding: 40px; border-radius: 24px; border: 1px solid #BC957D;">
                  <h1 style="color: #E8D19E;">📌 Pinterest collegato!</h1>
                  <p style="color: #A5C4DC;">Puoi chiudere questa finestra e tornare ad epicSnail.</p>
                </div>
              </body>
              </html>
            `);
            server.close();

            const port = server.address().port;
            const redirectUri = `http://localhost:${port}`;
            const tokenRes = await this.exchangeCodeForToken(code, verifier, redirectUri);
            return resolve(tokenRes);
          }
        } catch (err) {
          server.close();
          return resolve({ success: false, error: err.message });
        }
      });

      server.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        const redirectUri = `http://localhost:${port}`;
        const state = crypto.randomBytes(16).toString('hex');

        const authUrl = `https://www.pinterest.com/oauth/?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes.join(','))}&state=${state}&code_challenge=${challenge}&code_challenge_method=S256`;

        shell.openExternal(authUrl);
      });
    });
  }

  async exchangeCodeForToken(code, verifier, redirectUri) {
    const clientId = this.getClientId();
    const clientSecret = this.getClientSecret();

    try {
      const bodyParams = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: verifier,
      });

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      if (clientId && clientSecret) {
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        headers['Authorization'] = `Basic ${credentials}`;
      } else if (clientId) {
        bodyParams.append('client_id', clientId);
      }

      const response = await fetch('https://api.pinterest.com/v5/oauth/token', {
        method: 'POST',
        headers,
        body: bodyParams.toString(),
      });

      const data = await response.json();
      if (data.access_token) {
        const tokens = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: Date.now() + (data.expires_in || 2592000) * 1000,
        };
        this.authVault.saveToken('pinterest_tokens', tokens);
        return { success: true, tokens };
      } else {
        return { success: false, error: data.message || 'Errore riscatto token Pinterest' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async getAccessToken() {
    const tokens = this.getTokens();
    if (!tokens || !tokens.accessToken) return null;

    if (tokens.expiresAt && Date.now() >= tokens.expiresAt - 60000) {
      if (tokens.refreshToken) {
        const refreshRes = await this.refreshAccessToken(tokens.refreshToken);
        if (refreshRes.success) return refreshRes.accessToken;
      }
    }
    return tokens.accessToken;
  }

  async refreshAccessToken(refreshToken) {
    const clientId = this.getClientId();
    const clientSecret = this.getClientSecret();

    try {
      const bodyParams = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      });

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      if (clientId && clientSecret) {
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        headers['Authorization'] = `Basic ${credentials}`;
      }

      const response = await fetch('https://api.pinterest.com/v5/oauth/token', {
        method: 'POST',
        headers,
        body: bodyParams.toString(),
      });

      const data = await response.json();
      if (data.access_token) {
        const updated = {
          ...this.getTokens(),
          accessToken: data.access_token,
          expiresAt: Date.now() + (data.expires_in || 2592000) * 1000,
        };
        if (data.refresh_token) updated.refreshToken = data.refresh_token;
        this.authVault.saveToken('pinterest_tokens', updated);
        return { success: true, accessToken: data.access_token };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async getConnectionStatus() {
    const token = await this.getAccessToken();
    if (!token) return { status: 'disconnected', userName: '' };

    try {
      const res = await fetch('https://api.pinterest.com/v5/user_account', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const user = await res.json();
        return {
          status: 'connected',
          userName: user.username || user.account_type || 'Account Pinterest',
          profileImage: user.profile_image || '',
        };
      } else if (res.status === 401) {
        return { status: 'expired', userName: '' };
      }
      return { status: 'connected', userName: 'Account Attivo' };
    } catch (err) {
      return { status: 'connected', userName: 'Account Attivo' };
    }
  }

  async getPinterestBoards() {
    const token = await this.getAccessToken();
    if (!token) return { success: false, error: 'Account Pinterest non connesso' };

    try {
      const res = await fetch('https://api.pinterest.com/v5/boards?page_size=50', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.items) {
        const boards = data.items.map((b) => ({
          id: b.id,
          name: b.name,
          description: b.description || '',
          pinCount: b.pin_count || 0,
          coverImage: b.media?.image_cover_url || b.media?.pin_thumbnail_urls?.[0] || '',
        }));
        return { success: true, boards };
      }
      return { success: false, error: data.message || 'Impossibile recuperare le bacheche' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async getPinterestPins(boardId) {
    const token = await this.getAccessToken();
    if (!token) return { success: false, error: 'Account Pinterest non connesso' };

    try {
      const url = boardId
        ? `https://api.pinterest.com/v5/boards/${boardId}/pins?page_size=50`
        : `https://api.pinterest.com/v5/pins?page_size=50`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.items) {
        const pins = data.items.map((p) => ({
          id: p.id,
          title: p.title || p.grid_title || 'Senza Titolo',
          description: p.description || '',
          link: p.link || `https://www.pinterest.com/pin/${p.id}/`,
          imageUrl: p.media?.images?.['600x']?.url || p.media?.images?.originals?.url || p.media?.images?.['400x300']?.url || '',
          boardId: p.board_id || boardId || '',
        }));
        return { success: true, pins };
      }
      return { success: false, error: data.message || 'Impossibile recuperare i Pin' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

module.exports = PinterestTools;
