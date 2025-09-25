// app/(marketing)/[locale]/layout.js
import { NextIntlClientProvider } from 'next-intl';
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../globals.css';
import { routing } from '../../../../i18n/routing';
import ScrollTopButton from "../../components/ui/ScrollTopButton";
import { notFound } from 'next/navigation';

// NEW: client-side route loader wrapper
import ClientRouteLoader from '../../components/blocks/ClientRouteLoader';

export const dynamic = 'force-dynamic';

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params || {};

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
        <Navbar />
        {children}
        <Footer />
        <ScrollTopButton />
      </ClientRouteLoader>
    </NextIntlClientProvider>
  );
}
