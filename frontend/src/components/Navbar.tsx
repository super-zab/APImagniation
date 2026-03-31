import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Home, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline">183 rue du Rouet</span>
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            {t('nav_admin')}
          </Link>
        </div>

        <Button variant="outline" size="sm" onClick={toggleLang}>
          {t('lang_toggle')}
        </Button>
      </div>
    </nav>
  );
}
