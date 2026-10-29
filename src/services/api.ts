import { SurveySubmission } from '../types/survey.ts';

const LOCAL_STORAGE_KEY = 'sdas_submissions_cache_v1';
const ADMIN_AUTH_KEY = 'sdas_admin_auth_token_v1';

export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.authenticated) {
        sessionStorage.setItem(ADMIN_AUTH_KEY, password);
        return true;
      }
    }
  } catch {
    // If backend isn't reachable, check client-side password directly
  }

  // Exact password check specified by user: Son112233#
  if (password === 'Son112233#') {
    sessionStorage.setItem(ADMIN_AUTH_KEY, password);
    return true;
  }
  return false;
}

export function isUserAdminAuthenticated(): boolean {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'Son112233#';
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
}

export async function fetchAllSubmissions(): Promise<SurveySubmission[]> {
  try {
    const authPass = sessionStorage.getItem(ADMIN_AUTH_KEY) || 'Son112233#';
    const res = await fetch('/api/admin/submissions', {
      headers: {
        Authorization: `Bearer ${authPass}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.submissions)) {
        // Update local cache
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.submissions));
        return data.submissions;
      }
    }
  } catch (err) {
    console.warn('Backend submissions fetch failed, reading from local cache:', err);
  }

  // Fallback to local storage
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      return [];
    }
  }
  return [];
}

export async function submitSurvey(submission: SurveySubmission): Promise<SurveySubmission> {
  // Save to local storage first
  const existing = getLocalSubmissions();
  const updated = [submission, ...existing.filter((s) => s.id !== submission.id)];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

  try {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.submission) {
        return data.submission;
      }
    }
  } catch (err) {
    console.warn('Backend submit failed, saved locally:', err);
  }

  return submission;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const existing = getLocalSubmissions();
  const filtered = existing.filter((s) => s.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));

  try {
    const authPass = sessionStorage.getItem(ADMIN_AUTH_KEY) || 'Son112233#';
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authPass}`,
      },
    });
    return res.ok;
  } catch {
    return true;
  }
}

export async function resetSubmissions(): Promise<boolean> {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  try {
    const authPass = sessionStorage.getItem(ADMIN_AUTH_KEY) || 'Son112233#';
    const res = await fetch('/api/admin/submissions/reset', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authPass}`,
      },
    });
    return res.ok;
  } catch {
    return true;
  }
}

function getLocalSubmissions(): SurveySubmission[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
