// src/config/site.js
export function siteNav(t) {
  return [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.products'), href: '/products' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.quality'), href: '/quality' },
    { label: t('nav.contact'), href: '/contact', cta: false }
  ];
}
