import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Search,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  BarChart3,
  Users,
  FileSpreadsheet,
  AlertCircle,
  X,
  PlusCircle,
  CheckCircle2,
  SlidersHorizontal,
  LogOut,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { SurveySubmission, ProfileTier, ChoiceLetter } from '../types/survey.ts';
import { SURVEY_QUESTIONS, PROFILE_DEFINITIONS, POINT_MAP } from '../data/questions.ts';
import {
  verifyAdminPassword,
  fetchAllSubmissions,
  deleteSubmission,
  resetSubmissions,
  submitSurvey,
  logoutAdmin,
  isUserAdminAuthenticated,
} from '../services/api.ts';
import { exportSubmissionsToCsv, calculateDimensions } from '../utils/scoring.ts';

interface AdminPortalProps {
  onBackToSurvey: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToSurvey }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isUserAdminAuthenticated());
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [submissions, setSubmissions] = useState<SurveySubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedSubmission, setSelectedSubmission] = useState<SurveySubmission | null>(null);

  // Filters & sorting
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProfileFilter, setSelectedProfileFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'score-desc' | 'score-asc'>('date-desc');
  const [activeTab, setActiveTab] = useState<'submissions' | 'item-analytics'>('submissions');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    try {
      const ok = await verifyAdminPassword(passwordInput);
      if (ok) {
        setIsAuthenticated(true);
        setPasswordInput('');
      } else {
        setAuthError('Mật khẩu không chính xác. Vui lòng kiểm tra lại mật khẩu quản trị viên.');
      }
    } catch {
      setAuthError('Có lỗi xảy ra khi xác thực mật khẩu.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setSelectedSubmission(null);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Bạn có chắc chắn muốn xóa phản hồi khảo sát này (${id})?`)) return;

    await deleteSubmission(id);
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    if (selectedSubmission?.id === id) {
      setSelectedSubmission(null);
    }
    showToast('Đã xóa dữ liệu thành công.');
  };

  const handleResetData = async () => {
    if (!window.confirm('Khôi phục danh sách dữ liệu khảo sát mẫu mặc định?')) return;
    setIsLoading(true);
    await resetSubmissions();
    await loadData();
    showToast('Đã khôi phục dữ liệu khảo sát mẫu mặc định.');
  };

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleExportCsv = () => {
    const csv = exportSubmissionsToCsv(submissions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sdas18_research_dataset_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã tải xuống file CSV cho nghiên cứu.');
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(submissions, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sdas18_raw_data_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file JSON thành công.');
  };

  const handleAddSampleSubmission = async () => {
    const randomChoices: Record<number, ChoiceLetter> = {};
    const letters: ChoiceLetter[] = ['A', 'B', 'C', 'D'];
    let score = 0;
    const ptsBreakdown: Record<number, number> = {};

    SURVEY_QUESTIONS.forEach((q) => {
      const letter = letters[Math.floor(Math.random() * letters.length)];
      randomChoices[q.id] = letter;
      const pts = POINT_MAP[letter];
      ptsBreakdown[q.id] = pts;
      score += pts;
    });

    let profile: ProfileTier = 'Moderate / Balanced Desire';
    for (const p of PROFILE_DEFINITIONS) {
      if (score >= p.minScore && score <= p.maxScore) {
        profile = p.tier;
        break;
      }
    }

    const newSub: SurveySubmission = {
      id: `sub-${Date.now()}`,
      participantId: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      demographics: {
        ageGroup: ['18-25', '26-35', '36-45', '46-55'][Math.floor(Math.random() * 4)],
        gender: ['Female', 'Male', 'Non-binary'][Math.floor(Math.random() * 3)],
        relationshipStatus: ['In a relationship', 'Married', 'Single'][Math.floor(Math.random() * 3)],
      },
      answers: randomChoices,
      pointsBreakdown: ptsBreakdown,
      totalScore: score,
      profile,
      durationSeconds: Math.floor(180 + Math.random() * 240),
    };

    await submitSurvey(newSub);
    setSubmissions((prev) => [newSub, ...prev]);
    showToast(`Đã thêm phản hồi thử nghiệm mẫu (${newSub.participantId}, ${score} pts)`);
  };

  // Filter & sort submissions
  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter((s) => {
        if (selectedProfileFilter !== 'All' && s.profile !== selectedProfileFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const pId = s.participantId.toLowerCase();
          const id = s.id.toLowerCase();
          const age = (s.demographics?.ageGroup || '').toLowerCase();
          const gender = (s.demographics?.gender || '').toLowerCase();
          const rel = (s.demographics?.relationshipStatus || '').toLowerCase();
          return (
            pId.includes(q) ||
            id.includes(q) ||
            age.includes(q) ||
            gender.includes(q) ||
            rel.includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        }
        if (sortBy === 'score-desc') {
          return b.totalScore - a.totalScore;
        }
        if (sortBy === 'score-asc') {
          return a.totalScore - b.totalScore;
        }
        return 0;
      });
  }, [submissions, searchQuery, selectedProfileFilter, sortBy]);

  // Population metrics
  const totalCount = submissions.length;
  const avgScore = totalCount > 0
    ? (submissions.reduce((acc, s) => acc + s.totalScore, 0) / totalCount).toFixed(1)
    : '0';

  const profileCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'High / Vibrant Desire': 0,
      'Moderate / Balanced Desire': 0,
      'Low-to-Moderate / Context-Sensitive Desire': 0,
      'Low / Dormant Desire': 0,
    };
    submissions.forEach((s) => {
      if (counts[s.profile] !== undefined) {
        counts[s.profile]++;
      }
    });
    return counts;
  }, [submissions]);

  // Question by question item analysis
  const itemAnalytics = useMemo(() => {
    return SURVEY_QUESTIONS.map((q) => {
      const choiceCounts = { A: 0, B: 0, C: 0, D: 0 };
      let sumPoints = 0;
      let totalAnswers = 0;

      submissions.forEach((s) => {
        const letter = s.answers[q.id];
        if (letter && choiceCounts[letter] !== undefined) {
          choiceCounts[letter]++;
          sumPoints += POINT_MAP[letter];
          totalAnswers++;
        }
      });

      const avg = totalAnswers > 0 ? (sumPoints / totalAnswers).toFixed(2) : '0';
      return {
        question: q,
        choiceCounts,
        totalAnswers,
        avgPoints: avg,
      };
    });
  }, [submissions]);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-8 max-w-sm w-full">
          <div className="mb-6 text-center">
            <h2 className="font-editorial text-2xl font-normal text-stone-900 mb-1">
              Admin Access
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              Trang quản trị câu trả lời và điểm số người làm khảo sát.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Mật khẩu (/admin)
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>

            {authError && (
              <div className="p-2.5 rounded bg-stone-100 text-stone-800 text-xs border border-stone-200">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-medium transition-colors shadow-2xs cursor-pointer"
            >
              {isVerifying ? 'Đang xác thực...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 text-center">
            <button
              type="button"
              onClick={onBackToSurvey}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              ← Quay lại trang khảo sát
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Admin Top Ribbon */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold text-stone-900">
              Research Administrator Console
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Authenticated
            </span>
          </div>
          <div className="text-xs text-stone-500 mt-0.5">
            Quản trị viên đang xem toàn bộ câu trả lời, phân tích dữ liệu và điểm số của người làm test.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={loadData}
            title="Làm mới dữ liệu"
            className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleAddSampleSubmission}
            title="Thêm một câu trả lời mẫu để test"
            className="px-3 py-1.5 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Test Sample</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
          <span className="font-medium">{actionSuccessMsg}</span>
          <button onClick={() => setActionSuccessMsg('')} className="cursor-pointer text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs">
          <div className="text-xs uppercase font-mono tracking-wider text-stone-500 mb-1">
            Total Respondents
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-stone-900 font-mono tabular-nums">
              {totalCount}
            </span>
            <span className="text-xs text-stone-500">participants</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs">
          <div className="text-xs uppercase font-mono tracking-wider text-stone-500 mb-1">
            Mean Population Score
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-stone-900 font-mono tabular-nums">
              {avgScore}
            </span>
            <span className="text-xs text-stone-500">/ 90 points</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs">
          <div className="text-xs uppercase font-mono tracking-wider text-stone-500 mb-1">
            Balanced / High Desire
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-800 font-mono tabular-nums">
              {totalCount > 0
                ? Math.round(
                    ((profileCounts['High / Vibrant Desire'] +
                      profileCounts['Moderate / Balanced Desire']) /
                      totalCount) *
                      100
                  )
                : 0}
              %
            </span>
            <span className="text-xs text-stone-500">
              ({profileCounts['High / Vibrant Desire'] + profileCounts['Moderate / Balanced Desire']} cases)
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs">
          <div className="text-xs uppercase font-mono tracking-wider text-stone-500 mb-1">
            Context-Sensitive / Low
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-800 font-mono tabular-nums">
              {totalCount > 0
                ? Math.round(
                    ((profileCounts['Low-to-Moderate / Context-Sensitive Desire'] +
                      profileCounts['Low / Dormant Desire']) /
                      totalCount) *
                      100
                  )
                : 0}
              %
            </span>
            <span className="text-xs text-stone-500">
              ({profileCounts['Low-to-Moderate / Context-Sensitive Desire'] + profileCounts['Low / Dormant Desire']} cases)
            </span>
          </div>
        </div>
      </div>

      {/* Cohort Profile Breakdown Strip */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6 shadow-xs">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-stone-700">
          <span>Cohort Profile Distribution</span>
          <span className="font-mono text-stone-500">{totalCount} total cases</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {PROFILE_DEFINITIONS.map((def) => {
            const count = profileCounts[def.tier] || 0;
            const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            return (
              <div
                key={def.tier}
                onClick={() =>
                  setSelectedProfileFilter(
                    selectedProfileFilter === def.tier ? 'All' : def.tier
                  )
                }
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedProfileFilter === def.tier
                    ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900/10'
                    : 'border-stone-100 hover:border-stone-200 bg-stone-50/50'
                }`}
              >
                <div className="flex items-center justify-between font-mono mb-1">
                  <span className="text-stone-500 text-[11px]">{def.minScore}–{def.maxScore} pts</span>
                  <span className="font-bold text-stone-900">{count} ({pct}%)</span>
                </div>
                <div className="font-medium text-stone-800 truncate" title={def.tier}>
                  {def.shortLabel}
                </div>
                <div className="w-full bg-stone-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: def.colorClass.accent,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 mb-6 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
            activeTab === 'submissions'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Danh sách người làm test ({filteredSubmissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('item-analytics')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
            activeTab === 'item-analytics'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Phân tích từng câu hỏi (18 Items Analytics)</span>
        </button>
      </div>

      {activeTab === 'submissions' ? (
        <>
          {/* Search, Profile Filter, and Sort Controls */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 mb-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm Participant ID, độ tuổi, giới tính, tình trạng..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-600/20 focus:border-rose-600"
              />
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 whitespace-nowrap">Profile:</span>
              <select
                value={selectedProfileFilter}
                onChange={(e) => setSelectedProfileFilter(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-600/20"
              >
                <option value="All">All Profiles ({totalCount})</option>
                <option value="High / Vibrant Desire">High / Vibrant</option>
                <option value="Moderate / Balanced Desire">Moderate / Balanced</option>
                <option value="Low-to-Moderate / Context-Sensitive Desire">Context-Sensitive</option>
                <option value="Low / Dormant Desire">Low / Dormant</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 whitespace-nowrap">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-600/20"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="score-desc">Score: High → Low</option>
                <option value="score-asc">Score: Low → High</option>
              </select>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 font-mono uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Participant ID</th>
                    <th className="py-3 px-4 font-semibold">Timestamp</th>
                    <th className="py-3 px-4 font-semibold">Demographics</th>
                    <th className="py-3 px-4 font-semibold">Total Score</th>
                    <th className="py-3 px-4 font-semibold">Desire Profile</th>
                    <th className="py-3 px-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400">
                        {totalCount === 0
                          ? 'Chưa có dữ liệu khảo sát nào. Bạn có thể nhấn "+ Test Sample" để tạo bài test mẫu.'
                          : 'Không tìm thấy kết quả phù hợp với bộ lọc hiện tại.'}
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub) => {
                      const profileDef =
                        PROFILE_DEFINITIONS.find((p) => p.tier === sub.profile) ||
                        PROFILE_DEFINITIONS[1];

                      return (
                        <tr
                          key={sub.id}
                          onClick={() => setSelectedSubmission(sub)}
                          className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-900 whitespace-nowrap">
                            {sub.participantId}
                          </td>
                          <td className="py-3.5 px-4 text-stone-500 font-mono whitespace-nowrap">
                            {new Date(sub.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-stone-600">
                            {sub.demographics?.ageGroup ? (
                              <span className="inline-flex items-center gap-1.5">
                                <span>{sub.demographics.ageGroup}</span>
                                <span className="text-stone-300">·</span>
                                <span>{sub.demographics.gender}</span>
                              </span>
                            ) : (
                              <span className="text-stone-400 italic">Not provided</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-stone-900 text-sm">
                              {sub.totalScore}
                            </span>
                            <span className="text-stone-400 font-mono text-[11px] ml-1">/ 90</span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold border ${profileDef.colorClass.bg} ${profileDef.colorClass.text} ${profileDef.colorClass.border}`}
                            >
                              {profileDef.shortLabel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSubmission(sub);
                                }}
                                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Xem chi tiết</span>
                              </button>
                              <button
                                onClick={(e) => handleDelete(sub.id, e)}
                                title="Xóa bản ghi"
                                className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* ITEM BY ITEM QUESTION ANALYTICS */
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs mb-4">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Phân tích tỷ lệ chọn từng câu hỏi (Item Frequency Breakdown)
            </h3>
            <p className="text-xs text-stone-500">
              Tổng quan 18 câu hỏi trắc nghiệm, điểm trung bình đạt được (tối đa 5.0 pts) và phân bổ lựa chọn A, B, C, D của toàn bộ tập hợp mẫu nghiên cứu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {itemAnalytics.map(({ question, choiceCounts, totalAnswers, avgPoints }) => (
              <div
                key={question.id}
                className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs"
              >
                <div className="flex items-center justify-between text-xs text-stone-500 font-mono mb-1.5">
                  <span className="font-bold text-stone-900">Question {question.id}</span>
                  <span className="text-rose-700 font-semibold">Mean: {avgPoints} / 5.0 pts</span>
                </div>
                <div className="text-sm font-semibold text-stone-900 mb-4 leading-snug">
                  {question.text}
                </div>

                {/* Choices breakdown bars */}
                <div className="space-y-2">
                  {question.choices.map((choice) => {
                    const count = choiceCounts[choice.letter];
                    const pct = totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0;
                    return (
                      <div key={choice.letter} className="text-xs">
                        <div className="flex items-center justify-between text-stone-700 mb-1">
                          <span className="truncate pr-2 font-medium">
                            <span className="font-bold font-mono mr-1.5 text-stone-900">
                              [{choice.letter}]
                            </span>
                            {choice.text}
                          </span>
                          <span className="font-mono shrink-0 font-semibold text-stone-900">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              choice.letter === 'A'
                                ? 'bg-rose-600'
                                : choice.letter === 'B'
                                ? 'bg-emerald-600'
                                : choice.letter === 'C'
                                ? 'bg-amber-600'
                                : 'bg-stone-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Data Footer utility */}
      <div className="mt-8 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
        <span>SDAS-18 Research Engine · Database: Local JSON Persistent Store</span>
        <button
          onClick={handleResetData}
          className="text-stone-400 hover:text-stone-700 underline cursor-pointer"
        >
          Khôi phục dữ liệu mẫu ban đầu (Reset Data)
        </button>
      </div>

      {/* DETAIL MODAL FOR INDIVIDUAL RESPONDENT */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-stone-900">
                    Chi tiết câu trả lời: {selectedSubmission.participantId}
                  </h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                    {selectedSubmission.totalScore} / 90 điểm
                  </span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {new Date(selectedSubmission.timestamp).toLocaleString()} · {selectedSubmission.profile}
                </div>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Demographics bar */}
            {selectedSubmission.demographics && (
              <div className="px-6 py-2.5 bg-stone-100 border-b border-stone-200 text-xs text-stone-700 flex flex-wrap items-center gap-4">
                <span><strong>Độ tuổi:</strong> {selectedSubmission.demographics.ageGroup || 'N/A'}</span>
                <span><strong>Giới tính:</strong> {selectedSubmission.demographics.gender || 'N/A'}</span>
                <span><strong>Tình trạng:</strong> {selectedSubmission.demographics.relationshipStatus || 'N/A'}</span>
                {selectedSubmission.durationSeconds && (
                  <span><strong>Thời gian hoàn thành:</strong> {Math.round(selectedSubmission.durationSeconds / 60)} phút</span>
                )}
              </div>
            )}

            {/* Sub-scale breakdown strip */}
            <div className="px-6 py-3 border-b border-stone-100 bg-white grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
              {calculateDimensions(selectedSubmission.pointsBreakdown).map((d) => (
                <div key={d.name} className="p-2 rounded bg-stone-50 border border-stone-100">
                  <div className="text-stone-500 truncate" title={d.name}>{d.name}</div>
                  <div className="font-mono font-bold text-stone-900">
                    {d.score}/{d.maxPossible} ({d.percentage}%)
                  </div>
                </div>
              ))}
            </div>

            {/* Questions list */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
                Chi tiết 18 câu trả lời được chọn:
              </h4>

              {SURVEY_QUESTIONS.map((q) => {
                const chosenLetter = selectedSubmission.answers[q.id];
                const chosenOption = q.choices.find((c) => c.letter === chosenLetter);
                const points = selectedSubmission.pointsBreakdown[q.id] ?? (chosenLetter ? POINT_MAP[chosenLetter] : 0);

                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="text-xs font-semibold text-stone-900">
                        <span className="font-mono text-stone-400 mr-1.5">Q{q.id}.</span>
                        {q.text}
                      </div>
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-900 shrink-0">
                        +{points} pts
                      </span>
                    </div>

                    <div className="text-xs text-stone-700 bg-white border border-stone-200/80 rounded-lg p-2.5 flex items-start gap-2">
                      <span className="font-mono font-bold px-1.5 py-0.5 bg-rose-700 text-white rounded text-[10px] shrink-0 mt-0.5">
                        {chosenLetter || 'N/A'}
                      </span>
                      <span className="leading-relaxed">
                        {chosenOption?.text || 'Không có câu trả lời'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <button
                onClick={(e) => handleDelete(selectedSubmission.id, e)}
                className="px-3 py-1.5 text-xs text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa bản ghi này</span>
              </button>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
