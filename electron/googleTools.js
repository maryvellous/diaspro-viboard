const OAuthManager = require('./oauthManager');

class GoogleTools {
  constructor(authVault) {
    this.authVault = authVault;
  }

  getClientId() {
    return this.authVault.getToken('google_client_id') || process.env.GOOGLE_CLIENT_ID || '';
  }

  getClientSecret() {
    return this.authVault.getToken('google_client_secret') || process.env.GOOGLE_CLIENT_SECRET || '';
  }

  getTokens() {
    return this.authVault.getToken('google_tokens');
  }

  async getValidAccessToken() {
    let tokens = this.getTokens();
    if (!tokens || !tokens.access_token) return null;

    // Check if access_token is expired (with 60-second buffer)
    if (Date.now() >= (tokens.expires_at - 60000)) {
      if (!tokens.refresh_token) return null;
      
      const clientId = this.getClientId();
      const clientSecret = this.getClientSecret();
      const refreshRes = await OAuthManager.refreshGoogleToken({
        refreshToken: tokens.refresh_token,
        clientId,
        clientSecret,
      });

      if (refreshRes.success) {
        tokens.access_token = refreshRes.accessToken;
        tokens.expires_at = refreshRes.expiresAt;
        this.authVault.saveToken('google_tokens', tokens);
      } else {
        console.error('Failed to refresh Google Token:', refreshRes.error);
        return null;
      }
    }

    return tokens.access_token;
  }

  async getConnectionStatus() {
    const tokens = this.getTokens();
    if (!tokens) return { status: 'disconnected', userEmail: '' };

    const validToken = await this.getValidAccessToken();
    if (!validToken) {
      return { status: 'expired', userEmail: tokens.user_email || '' };
    }

    return { status: 'connected', userEmail: tokens.user_email || '' };
  }

  async getCalendarEvents(maxResults = 10) {
    const accessToken = await this.getValidAccessToken();
    if (!accessToken) return { success: false, error: 'Account Google non connesso o token scaduto' };

    try {
      const nowISO = new Date().toISOString();
      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(nowISO)}&singleEvents=true&orderBy=startTime&maxResults=${maxResults}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const errJson = await res.json();
        return { success: false, error: errJson.error?.message || `Google API status ${res.status}` };
      }

      const data = await res.json();
      const events = (data.items || []).map(item => ({
        id: item.id,
        title: item.summary || 'Senza Titolo',
        description: item.description || '',
        location: item.location || '',
        start: item.start?.dateTime || item.start?.date || '',
        end: item.end?.dateTime || item.end?.date || '',
        htmlLink: item.htmlLink,
      }));

      return { success: true, events };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async createCalendarEvent({ summary, startTime, endTime, description }) {
    const accessToken = await this.getValidAccessToken();
    if (!accessToken) return { success: false, error: 'Account Google non connesso' };

    try {
      const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

      // Parse start and end time
      let startDateTime = startTime;
      let endDateTime = endTime;

      // If user inputs simple time like "15:00", construct full ISO date string for today
      if (startTime && !startTime.includes('T')) {
        const today = new Date().toISOString().split('T')[0];
        startDateTime = `${today}T${startTime}:00Z`;
        const endHour = parseInt(startTime.split(':')[0], 10) + 1;
        endDateTime = `${today}T${endHour < 10 ? '0' + endHour : endHour}:00Z`;
      }

      const body = {
        summary: summary,
        description: description || '',
        start: { dateTime: startDateTime || new Date().toISOString() },
        end: { dateTime: endDateTime || new Date(Date.now() + 3600000).toISOString() },
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errJson = await res.json();
        return { success: false, error: errJson.error?.message || 'Errore creazione evento Google' };
      }

      const createdItem = await res.json();
      return { success: true, event: createdItem };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async getGoogleTasks() {
    const accessToken = await this.getValidAccessToken();
    if (!accessToken) return { success: false, error: 'Account Google non connesso' };

    try {
      // 1. Fetch Tasklists
      const listsRes = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!listsRes.ok) return { success: false, error: 'Errore recupero liste Tasks' };

      const listsData = await listsRes.json();
      const primaryList = (listsData.items && listsData.items[0]) ? listsData.items[0] : null;

      if (!primaryList) return { success: true, tasks: [] };

      // 2. Fetch Tasks in Primary List
      const tasksRes = await fetch(`https://www.googleapis.com/tasks/v1/lists/${primaryList.id}/tasks?showCompleted=true`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!tasksRes.ok) return { success: false, error: 'Errore recupero attività Tasks' };

      const tasksData = await tasksRes.json();
      const tasks = (tasksData.items || []).map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        completed: t.status === 'completed',
        due: t.due,
      }));

      return { success: true, tasks };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

module.exports = GoogleTools;
