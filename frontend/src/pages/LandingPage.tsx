import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ApplicationForm from '@/components/ApplicationForm';
import { MapPin, Maximize2, DoorOpen, Layers, Euro, ParkingCircle, Wind, ArrowDown } from 'lucide-react';

export default function LandingPage() {
  const { t } = useTranslation();

  const stats = [
    { icon: <Maximize2 className="h-5 w-5" />, value: t('hero_surface') },
    { icon: <DoorOpen className="h-5 w-5" />, value: t('hero_rooms') },
    { icon: <Layers className="h-5 w-5" />, value: t('hero_floor') },
    { icon: <Euro className="h-5 w-5" />, value: t('hero_rent') },
  ];

  const features = [
    { icon: <ParkingCircle />, label: t('feature_parking') },
    { icon: <Wind />, label: t('feature_balcony') },
    { icon: <Layers />, label: t('feature_elevator') },
    { icon: <DoorOpen />, label: t('feature_cellar') },
  ];

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-24 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-green-500 text-white hover:bg-green-500">
              {t('hero_badge')}
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight mb-2">{t('hero_title')}</h1>
            <div className="flex items-center gap-1.5 text-blue-300 mb-6">
              <MapPin className="h-4 w-4" />
              <span>{t('hero_subtitle')}</span>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              {t('hero_description')}
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur">
                  <span className="text-blue-300">{s.icon}</span>
                  <span className="font-semibold text-sm">{s.value}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#apply"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-white shadow transition hover:bg-primary/90"
            >
              {t('form_title')} <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="border-b bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-xl font-semibold">{t('features_title')}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {features.map((f, i) => (
              <Card key={i} className="text-center">
                <CardContent className="flex flex-col items-center gap-2 pt-6">
                  <span className="text-primary">{f.icon}</span>
                  <span className="text-sm font-medium">{f.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application Form ─────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <ApplicationForm />
        </div>
      </section>
    </main>
  );
}
