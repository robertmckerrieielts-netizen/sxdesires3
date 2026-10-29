import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { SurveySubmission } from '../types/survey.ts';

const LOCAL_STORAGE_KEY = 'sdas_submissions_cache_v1';
const ADMIN_AUTH_KEY = 'sdas_admin_auth_token_v1';

const DEFAULT_SAMPLE_DATA: SurveySubmission[] = [
  {
    id: 'sub-sample-01',
    participantId: 'P-9482',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    demographics: {
      ageGroup: '26-35',
      gender: 'Female',
      relationshipStatus: 'In a relationship',
    },
    answers: {
      1: 'B', 2: 'A', 3: 'B', 4: 'B', 5: 'A', 6: 'B', 7: 'A', 8: 'B', 9: 'A',
      10: 'A', 11: 'A', 12: 'B', 13: 'A', 14: 'B', 15: 'B', 16: 'A', 17: 'A', 18: 'B'
    },
    pointsBreakdown: {
      1: 4, 2: 5, 3: 4, 4: 4, 5: 5, 6: 4, 7: 5, 8: 4, 9: 5,
      10: 5, 11: 5, 12: 4, 13: 5, 14: 4, 15: 4, 16: 5, 17: 5, 18: 4
    },
    totalScore: 81,
    profile: 'High / Vibrant Desire',
    durationSeconds: 245
  },
  {
    id: 'sub-sample-02',
    participantId: 'P-8310',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    demographics: {
      ageGroup: '36-45',
      gender: 'Male',
      relationshipStatus: 'Married / Cohabiting',
    },
    answers: {
      1: 'B', 2: 'B', 3: 'B', 4: 'C', 5: 'B', 6: 'B', 7: 'B', 8: 'C', 9: 'B',
      10: 'B', 11: 'B', 12: 'B', 13: 'B', 14: 'B', 15: 'B', 16: 'B', 17: 'B', 18: 'B'
    },
    pointsBreakdown: {
      1: 4, 2: 4, 3: 4, 4: 2, 5: 4, 6: 4, 7: 4, 8: 2, 9: 4,
      10: 4, 11: 4, 12: 4, 13: 4, 14: 4, 15: 4, 16: 4, 17: 4, 18: 4
    },
    totalScore: 68,
    profile: 'Moderate / Balanced Desire',
    durationSeconds: 310
  },
  {
    id: 'sub-sample-03',
    participantId: 'P-5192',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    demographics: {
      ageGroup: '26-35',
      gender: 'Non-binary',
      relationshipStatus: 'In a relationship',
    },
    answers: {
      1: 'C', 2: 'C', 3: 'C', 4: 'D', 5: 'C', 6: 'C', 7: 'C', 8: 'D', 9: 'C',
      10: 'C', 11: 'C', 12: 'C', 13: 'C', 14: 'C', 15: 'C', 16: 'A', 17: 'B', 18: 'C'
    },
    pointsBreakdown: {
      1: 2, 2: 2, 3: 2, 4: 1, 5: 2, 6: 2, 7: 2, 8: 1, 9: 2,
      10: 2, 11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 16: 5, 17: 4, 18: 2
    },
    totalScore: 37,
    profile: 'Low-to-Moderate / Context-Sensitive Desire',
    durationSeconds: 280
  },
  {
    id: 'sub-sample-04',
    participantId: 'P-3741',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    demographics: {
      ageGroup: '46-55',
      gender: 'Female',
      relationshipStatus: 'Single',
    },
    answers: {
      1: 'D', 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D', 9: 'D',
      10: 'D', 11: 'C', 12: 'D', 13: 'D', 14: 'C', 15: 'D', 16: 'D', 17: 'C', 18: 'D'
    },
    pointsBreakdown: {
      1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1,
      10: 1, 11: 2, 12: 1, 13: 1, 14: 2, 15: 1, 16: 1, 17: 2, 18: 1
    },
    totalScore: 21,
    profile: 'Low / Dormant Desire',
    durationSeconds: 195
  }
];

export async function verifyAdminPassword(password: string): Promise<boolean> {
  // Check exact password Son112233#
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

/**
 * Fetch all survey submissions from Firebase Cloud Firestore.
 * This aggregates responses submitted from ANY browser or device in the world.
 */
export async function fetchAllSubmissions(): Promise<SurveySubmission[]> {
  try {
    const submissionsRef = collection(db, 'submissions');
    const q = query(submissionsRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const liveData: SurveySubmission[] = [];
      snapshot.forEach((docSnap) => {
        liveData.push(docSnap.data() as SurveySubmission);
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(liveData));
      return liveData;
    }

    // If Firestore collection is empty, seed with initial sample data so admin can test
    for (const sample of DEFAULT_SAMPLE_DATA) {
      await setDoc(doc(db, 'submissions', sample.id), sample).catch(() => {});
    }
    return DEFAULT_SAMPLE_DATA;
  } catch (err) {
    console.warn('Firestore fetch failed, reading from local fallback:', err);
    return getLocalSubmissions();
  }
}

/**
 * Submits survey to Cloud Firestore so the Admin can see it in real-time from any device.
 */
export async function submitSurvey(submission: SurveySubmission): Promise<SurveySubmission> {
  // 1. Save to local storage for instant offline resilience
  const existing = getLocalSubmissions();
  const updated = [submission, ...existing.filter((s) => s.id !== submission.id)];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

  // 2. Upload to Cloud Firestore
  try {
    const docRef = doc(db, 'submissions', submission.id);
    await setDoc(docRef, submission);
  } catch (err) {
    console.warn('Cloud Firestore sync warning (saved locally):', err);
  }

  // 3. Also ping backend if running
  try {
    fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    }).catch(() => {});
  } catch {
    // Ignore
  }

  return submission;
}

/**
 * Deletes a submission from Cloud Firestore and local store.
 */
export async function deleteSubmission(id: string): Promise<boolean> {
  const existing = getLocalSubmissions();
  const filtered = existing.filter((s) => s.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));

  try {
    const docRef = doc(db, 'submissions', id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('Firestore delete failed:', err);
    return true;
  }
}

/**
 * Resets sample data in Firestore and local store.
 */
export async function resetSubmissions(): Promise<boolean> {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_DATA));
  try {
    for (const sample of DEFAULT_SAMPLE_DATA) {
      await setDoc(doc(db, 'submissions', sample.id), sample);
    }
    return true;
  } catch {
    return true;
  }
}

function getLocalSubmissions(): SurveySubmission[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    return DEFAULT_SAMPLE_DATA;
  } catch {
    return DEFAULT_SAMPLE_DATA;
  }
}
