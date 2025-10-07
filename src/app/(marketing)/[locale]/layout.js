// app/(marketing)/[locale]/layout.js
import { NextIntlClientProvider } from 'next-intl';
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../globals.css';
import { routing } from '../../../../i18n/routing';
import ScrollTopButton from "../../components/ui/ScrollTopButton";
import { notFound } from 'next/navigation';
import { brand } from '../../config/brand';

// NEW: client-side route loader wrapper
import ClientRouteLoader from '../../components/blocks/ClientRouteLoader';

export const dynamic = 'force-dynamic';

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params || {};


  notFound();

  if (!locale || !routing.locales.includes(locale)) notFound();
  

  let messages;
  try {
    messages = (await import(`../../../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone="Africa/Mogadishu">
      <ClientRouteLoader locale={locale}>
        <div
          aria-hidden
          className="fixed inset-0  pointer-events-none"
          style={{
            // soft brand glow + clean base
            background: `
            radial-gradient(900px circle at 10% -120px, ${brand?.colors?.accent ?? "#FFD028"}33, transparent 45%),
            radial-gradient(1100px circle at 10% 120%, ${brand?.colors?.primary ?? "#0B2A6B"}2b, transparent 50%),
            linear-gradient(180deg, #ffffff 0%, #ffffff 100%)
          `
          }}
        />
        <Navbar />
        {children}
        <Footer />
        <ScrollTopButton />
      </ClientRouteLoader>
    </NextIntlClientProvider>
  );
}
