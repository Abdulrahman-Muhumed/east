/** @type {import('next-intl').NextIntlConfig} */
const config = {
  locales: ['en', 'so'],
  defaultLocale: 'en',
  // With app/[locale], this avoids ambiguous root paths
  localePrefix: 'always'
};
export default config;



