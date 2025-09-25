// src/i18n/navigation.js
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

export const {
  Link,        // locale-aware <Link>
  redirect,
  usePathname,
  useRouter,
  getPathname
} = createNavigation(routing);
