import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { fetchApplications, Application } from '@/lib/api';
import ApplicationsTable from '@/components/ApplicationsTable';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApplications();
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  // Runs on mount
  useEffect(() => {
    loadApplications();
  }, []);

  const handleApproved = (updated: Application) => {
    setApplications(prev =>
      prev.map(app => (app.id === updated.id ? updated : app))
    );
  };

  const counts = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'Pending').length,
    approved: applications.filter(a => a.status === 'Approved').length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ── Header ── */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard_title')}</h1>
          <p className="text-muted-foreground">{t('dashboard_subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadApplications} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-1.5" />
            {t('dashboard_logout')}
          </Button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: counts.total, color: 'text-foreground' },
          { label: t('status_pending'), value: counts.pending, color: 'text-yellow-600' },
          { label: t('status_approved'), value: counts.approved, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="rounded-lg border bg-card p-4 text-center shadow-sm">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-destructive">{error}</div>
      ) : applications.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">{t('dashboard_empty')}</p>
      ) : (
        <ApplicationsTable applications={applications} onApproved={handleApproved} />
      )}
    </div>
  );
}
