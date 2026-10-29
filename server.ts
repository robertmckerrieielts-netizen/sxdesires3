import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const ADMIN_PASSWORD = 'Son112233#';

app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initialSeed = [
      {
        id: 'sub-sample-01',
        participantId: 'P-9482',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        demographics: {
          ageGroup: '26-35',
          gender: 'Female',
          relationshipStatus: 'In a relationship (2+ years)',
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
          relationshipStatus: 'Married (5+ years)',
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
          relationshipStatus: 'In a relationship (6-12 months)',
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
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
  }
}

function readSubmissions(): any[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) || [];
  } catch (err) {
    console.error('Error reading submissions file:', err);
    return [];
  }
}

function writeSubmissions(data: any[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Authentication middleware for Admin API
function requireAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, '') || req.headers['x-admin-key'];
  if (token === ADMIN_PASSWORD) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Invalid administrative credentials.' });
}

// Verify password endpoint
app.post('/api/admin/verify', (req: Request, res: Response) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASSWORD) {
    return res.json({ authenticated: true, message: 'Administrative access verified.' });
  }
  return res.status(401).json({ authenticated: false, message: 'Invalid administrative password.' });
});

// Submit a survey response
app.post('/api/submissions', (req: Request, res: Response) => {
  try {
    const submission = req.body;
    if (!submission || !submission.answers || !submission.totalScore) {
      return res.status(400).json({ error: 'Incomplete survey submission data.' });
    }

    const currentData = readSubmissions();
    const updated = [submission, ...currentData.filter((s: any) => s.id !== submission.id)];
    writeSubmissions(updated);

    return res.status(201).json({ success: true, submission });
  } catch (err: any) {
    console.error('Failed to save submission:', err);
    return res.status(500).json({ error: 'Failed to record survey submission.' });
  }
});

// Admin: Get all submissions
app.get('/api/admin/submissions', requireAdmin, (_req: Request, res: Response) => {
  const data = readSubmissions();
  return res.json({ submissions: data, count: data.length });
});

// Admin: Delete a submission by ID
app.delete('/api/admin/submissions/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const currentData = readSubmissions();
  const filtered = currentData.filter((s: any) => s.id !== id);
  writeSubmissions(filtered);
  return res.json({ success: true, deletedId: id, remaining: filtered.length });
});

// Admin: Reset submissions to default sample set
app.post('/api/admin/submissions/reset', requireAdmin, (_req: Request, res: Response) => {
  if (fs.existsSync(DATA_FILE)) {
    fs.unlinkSync(DATA_FILE);
  }
  ensureDataFile();
  const resetData = readSubmissions();
  return res.json({ success: true, count: resetData.length, submissions: resetData });
});

async function main() {
  ensureDataFile();

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SDAS-18 Server running at http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
