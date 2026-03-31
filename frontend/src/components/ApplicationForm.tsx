import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FileUploadField from './FileUploadField';
import { submitApplication } from '@/lib/api';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type FileState = {
  idCard: File | null;
  employmentContract: File | null;
  payslip1: File | null;
  payslip2: File | null;
  payslip3: File | null;
  taxReturn: File | null;
};

export default function ApplicationForm() {
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [income, setIncome] = useState('');
  const [files, setFiles] = useState<FileState>({
    idCard: null,
    employmentContract: null,
    payslip1: null,
    payslip2: null,
    payslip3: null,
    taxReturn: null,
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const setFile = (field: keyof FileState) => (file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('income', income);

      if (files.idCard) formData.append('idCard', files.idCard);
      if (files.employmentContract) formData.append('employmentContract', files.employmentContract);
      if (files.payslip1) formData.append('payslip1', files.payslip1);
      if (files.payslip2) formData.append('payslip2', files.payslip2);
      if (files.payslip3) formData.append('payslip3', files.payslip3);
      if (files.taxReturn) formData.append('taxReturn', files.taxReturn);

      await submitApplication(formData);
      setStatus('success');
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(t('form_error'));
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
          <p className="text-lg font-medium text-green-800">{t('form_success')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="apply">
      <CardHeader>
        <CardTitle>{t('form_title')}</CardTitle>
        <CardDescription>{t('form_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── Personal Info ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">
                {t('form_firstname')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                placeholder="Marie"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">
                {t('form_lastname')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                placeholder="Dupont"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">
                {t('form_email')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="marie@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">
                {t('form_phone')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                placeholder="06 12 34 56 78"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="income">
                {t('form_income')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="income"
                type="number"
                min="0"
                step="0.01"
                value={income}
                onChange={e => setIncome(e.target.value)}
                required
                placeholder={t('form_income_placeholder')}
              />
            </div>
          </div>

          {/* ── Documents ── */}
          <div>
            <h3 className="mb-4 text-base font-semibold">{t('form_docs_title')}</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FileUploadField
                id="idCard"
                label={t('form_idcard')}
                hint={t('form_idcard_hint')}
                required
                onChange={setFile('idCard')}
              />
              <FileUploadField
                id="employmentContract"
                label={t('form_contract')}
                hint={t('form_contract_hint')}
                required
                onChange={setFile('employmentContract')}
              />
              <FileUploadField
                id="payslip1"
                label={t('form_payslip1')}
                hint={t('form_payslip_hint')}
                required
                onChange={setFile('payslip1')}
              />
              <FileUploadField
                id="payslip2"
                label={t('form_payslip2')}
                hint={t('form_payslip_hint')}
                required
                onChange={setFile('payslip2')}
              />
              <FileUploadField
                id="payslip3"
                label={t('form_payslip3')}
                hint={t('form_payslip_hint')}
                required
                onChange={setFile('payslip3')}
              />
              <FileUploadField
                id="taxReturn"
                label={t('form_taxreturn')}
                hint={t('form_taxreturn_hint')}
                required
                onChange={setFile('taxReturn')}
              />
            </div>
          </div>

          {/* ── Error ── */}
          {status === 'error' && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={status === 'submitting'}>
            {status === 'submitting' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('form_submitting')}
              </>
            ) : (
              t('form_submit')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
