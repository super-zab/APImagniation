import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Application, approveApplication } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';

interface Props {
  applications: Application[];
  onApproved: (updated: Application) => void;
}

function StatusBadge({ status }: { status: Application['status'] }) {
  const { t } = useTranslation();
  const variants: Record<Application['status'], 'warning' | 'success' | 'destructive'> = {
    Pending: 'warning',
    Approved: 'success',
    Rejected: 'destructive',
  };
  const labels: Record<Application['status'], string> = {
    Pending: t('status_pending'),
    Approved: t('status_approved'),
    Rejected: t('status_rejected'),
  };
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}

function DocLink({ url, label }: { url: string | null; label: string }) {
  const { t } = useTranslation();
  if (!url) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
    >
      {label} <ExternalLink className="h-3 w-3" />
    </a>
  );
}

export default function ApplicationsTable({ applications, onApproved }: Props) {
  const { t } = useTranslation();
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      const res = await approveApplication(id);
      onApproved(res.data.application);
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">{t('col_name')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('col_email')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('col_phone')}</th>
            <th className="px-4 py-3 text-right font-medium">{t('col_income')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('col_date')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('col_status')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('col_docs')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('col_actions')}</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium">
                {app.first_name} {app.last_name}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{app.email}</td>
              <td className="px-4 py-3 text-muted-foreground">{app.phone}</td>
              <td className="px-4 py-3 text-right">
                {app.income.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(app.created_at).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <DocLink url={app.id_card_url} label="ID" />
                  <DocLink url={app.employment_contract_url} label="Contrat" />
                  <DocLink url={app.payslip1_url} label="Paie 1" />
                  <DocLink url={app.payslip2_url} label="Paie 2" />
                  <DocLink url={app.payslip3_url} label="Paie 3" />
                  <DocLink url={app.tax_return_url} label="Impôts" />
                  {app.lease_pdf_url && (
                    <DocLink url={app.lease_pdf_url} label={t('action_view_lease')} />
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                {app.status === 'Pending' && (
                  <Button
                    size="sm"
                    onClick={() => handleApprove(app.id)}
                    disabled={approvingId === app.id}
                  >
                    {approvingId === app.id ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        {t('action_approving')}
                      </>
                    ) : (
                      t('action_approve')
                    )}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
