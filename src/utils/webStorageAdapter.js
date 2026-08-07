// Web Standalone Storage & Mock Bridge for Browser Mode
export const initWebStorageAdapter = () => {
  if (typeof window !== 'undefined' && !window.electronAPI) {
    console.info('[Diaspro Viboard] Mode: Standalone Web App (Browser Fallback Active)');

    window.electronAPI = {
      scanRepos: async () => [],
      getGitDetails: async () => null,
      executeGitAction: async () => ({ error: 'Git non disponibile in modalità web' }),

      openTerminal: async () => {},
      openVSCode: async () => {},
      openAndroidStudio: async () => {},
      openAntigravityIDE: async () => {},
      openInExplorer: async () => {},
      openExternal: async (url) => window.open(url, '_blank'),
      runSandbox: async (code) => {
        try {
          const res = eval(code);
          return { success: true, result: String(res) };
        } catch (e) {
          return { success: false, error: e.message };
        }
      },

      getStoreData: async () => {
        try {
          const raw = localStorage.getItem('diaspro_web_store');
          return raw ? JSON.parse(raw) : {};
        } catch {
          return {};
        }
      },
      setStoreData: async (key, val) => {
        try {
          const store = JSON.parse(localStorage.getItem('diaspro_web_store') || '{}');
          store[key] = val;
          localStorage.setItem('diaspro_web_store', JSON.stringify(store));
          return true;
        } catch {
          return false;
        }
      },

      saveToken: async (service, token) => {
        localStorage.setItem(`diaspro_token_${service}`, typeof token === 'string' ? token : JSON.stringify(token));
        return true;
      },
      getToken: async (service) => {
        const item = localStorage.getItem(`diaspro_token_${service}`);
        try {
          return item ? JSON.parse(item) : item;
        } catch {
          return item;
        }
      },
      hasToken: async (service) => !!localStorage.getItem(`diaspro_token_${service}`),
      removeToken: async (service) => {
        localStorage.removeItem(`diaspro_token_${service}`);
        return true;
      },

      validateGitHubToken: async () => ({ success: false, error: 'Demo Web' }),
      getGitHubRepos: async () => ({ success: true, repos: [] }),
      getGitHubIssues: async () => ({ success: true, issues: [] }),

      testAiKey: async () => ({ success: true }),

      startGoogleOAuth: async () => ({ success: false, error: 'OAuth Google non disponibile in demo web' }),
      getGoogleStatus: async () => ({ status: 'disconnected', userEmail: '' }),
      disconnectGoogle: async () => {},
      getGoogleCalendarEvents: async () => ({ success: true, events: [] }),
      createGoogleCalendarEvent: async () => ({ success: false }),
      deleteGoogleCalendarEvent: async () => ({ success: false }),
      getGoogleTasks: async () => ({ success: true, tasks: [] }),
      toggleGoogleTask: async () => ({ success: false }),
      createGoogleTask: async () => ({ success: false }),
      postponeGoogleTask: async () => ({ success: false }),
      getGoogleDriveFiles: async () => ({ success: true, files: [] }),

      startSpotifyOAuth: async () => ({ success: false, error: 'OAuth Spotify non disponibile in demo web' }),
      getSpotifyStatus: async () => ({ status: 'disconnected', userName: '' }),
      disconnectSpotify: async () => {},
      getSpotifyPlayback: async () => ({ success: true, isPlaying: false }),
      spotifyPlay: async () => ({ success: false }),
      spotifyPause: async () => ({ success: false }),
      spotifyNext: async () => ({ success: false }),
      spotifyPrevious: async () => ({ success: false }),
      spotifySeek: async () => ({ success: false }),

      startPinterestOAuth: async () => ({ success: false, error: 'OAuth Pinterest non disponibile in demo web' }),
      getPinterestStatus: async () => ({ status: 'disconnected', userName: '' }),
      disconnectPinterest: async () => {},
      getPinterestBoards: async () => ({ success: true, boards: [] }),
      getPinterestPins: async () => ({ success: true, pins: [] }),

      sendChatMessage: async ({ messages }) => {
        const last = messages[messages.length - 1]?.content || '';
        return {
          success: true,
          content: `[Modalità Standalone Web]\nRisposta a: "${last}". Per risposte complete collega la chiave API nelle Impostazioni.`,
        };
      },
      executeTool: async () => ({ success: false }),
      getContextHeader: async () => '',
      saveContextHeader: async () => {},
    };
  }
};
