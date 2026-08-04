// GitHub API Integration Helper using fetch
class GitHubTools {
  constructor(authVault) {
    this.authVault = authVault;
  }

  getToken() {
    return this.authVault.getToken('github');
  }

  async validateToken(token) {
    const pat = token || this.getToken();
    if (!pat) return { valid: false, error: 'Nessun token GitHub trovato' };

    try {
      const res = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${pat}`,
          'User-Agent': 'epicSnail-Desktop',
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (res.ok) {
        const userData = await res.json();
        return {
          valid: true,
          user: {
            login: userData.login,
            name: userData.name || userData.login,
            avatar_url: userData.avatar_url,
            html_url: userData.html_url,
          },
        };
      } else {
        const err = await res.json();
        return { valid: false, error: err.message || 'Token GitHub non valido' };
      }
    } catch (e) {
      return { valid: false, error: e.message };
    }
  }

  async getRepos(sort = 'updated', limit = 15) {
    const pat = this.getToken();
    if (!pat) return { success: false, error: 'Token non configurato' };

    try {
      const res = await fetch(`https://api.github.com/user/repos?sort=${sort}&per_page=${limit}`, {
        headers: {
          'Authorization': `Bearer ${pat}`,
          'User-Agent': 'epicSnail-Desktop',
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) {
        return { success: false, error: `GitHub API status ${res.status}` };
      }

      const repos = await res.json();
      const mapped = repos.map(r => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        description: r.description,
        html_url: r.html_url,
        stargazers_count: r.stargazers_count,
        open_issues_count: r.open_issues_count,
        language: r.language,
        updated_at: r.updated_at,
        private: r.private,
      }));

      return { success: true, repos: mapped };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async getIssues() {
    const pat = this.getToken();
    if (!pat) return { success: false, error: 'Token non configurato' };

    try {
      const res = await fetch('https://api.github.com/user/issues?state=open&sort=updated&per_page=20', {
        headers: {
          'Authorization': `Bearer ${pat}`,
          'User-Agent': 'epicSnail-Desktop',
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) {
        return { success: false, error: `GitHub API status ${res.status}` };
      }

      const issues = await res.json();
      const mapped = issues.map(i => ({
        id: i.id,
        title: i.title,
        number: i.number,
        html_url: i.html_url,
        repository_name: i.repository ? i.repository.full_name : 'Unknown',
        created_at: i.created_at,
        updated_at: i.updated_at,
        comments: i.comments,
      }));

      return { success: true, issues: mapped };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

module.exports = GitHubTools;
