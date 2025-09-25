// src/i18n/request.js
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const locale = routing.locales.includes(requestLocale)
    ? requestLocale
    : routing.defaultLocale;

  return {
    locale,
    // Place your messages at /messages/{locale}.json
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
