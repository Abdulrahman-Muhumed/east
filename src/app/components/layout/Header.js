"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Link, usePathname, useRouter } from "../../../../i18n/navigation"; // next-intl wrapper
import { siteNav } from "../../config/site";
import { brand } from "../../config/brand";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Home, Boxes, FlaskConical, Info, Phone, Globe, Sparkles, X as Close } from "lucide-react";

/* ────────────────────────────────────────────────────────────
   Header
──────────────────────────────────────────────────────────── */
export default function Header() {
  const t = useTranslations();
  const navItems = siteNav(t);
  const pathname = usePathname(); // locale-invariant
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  const BLUE = brand.colors.primary;
  const YELLOW = brand.colors.accent;

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(y > 12);
      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
      setScrollPct(Math.min(100, Math.max(0, (y / max) * 100)));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // close mobile sheet on route change
  useEffect(() => setOpen(false), [pathname]);

  const NavLink = ({ href, label, cta }) => {
    const isHome = href === "/";
    const isActive = isHome ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

    if (cta) {
      return (
        <Link
          href={href}
          className="rounded-full px-4 py-2 text-sm font-semibold text-blue-900 bg-yellow-400 hover:brightness-95 transition"
        >
          {label}
        </Link>
      );
    }

    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={`group relative text-sm font-medium ${scrolled ? "text-blue-900" : "text-black"} hover:text-black transition`}
      >
        {label}
        <span
          className={`pointer-events-none absolute -bottom-1 left-0 h-[2px] origin-left
            w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300
            bg-gradient-to-r from-yellow-300 to-yellow-500
            ${isActive ? "!scale-x-100" : ""}`}
        />
      </Link>
    );
  };

  return (
    <header className="sticky top-3 z-40">
      {/* centered container; header itself not full width */}
      <div
        className="mx-auto max-w-7xl transition-[transform,box-shadow] duration-300 md:-mt-18"
        style={{ ["--h-blue"]: BLUE, ["--h-yellow"]: YELLOW }}
      >
        {/* glass card */}
        <div
          className={`relative rounded-2xl border backdrop-blur-xl bg-white/40
            border-white/15 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)]
            ${scrolled ? "shadow-[0_14px_42px_-12px_rgba(0,0,0,0.45)] bg-white/70" : ""}`}
        >
          {/* soft inner glow */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
          <div className="h-16 px-4 md:px-6 flex items-center justify-between">
            {/* brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-8 w-8 rounded-xl bg-yellow-400 grid place-items-center shadow-md animate-[pop_900ms_ease-out_1] group">
                <div className="relative h-8 w-8">
                  <Image
                    src="/east_logo2.png"
                    alt="East Logo"
                    fill
                    className="object-contain transition-transform duration-300 ease-out will-change-transform group-hover:scale-110"
                    draggable={false}
                    priority
                  />
                </div>
              </div>

              <span className="hidden sm:inline text-sm font-semibold tracking-wide text-black">
                {brand?.name ?? "East"}
              </span>
              <style jsx>{`
                @keyframes pop {
                  0% { transform: scale(0.85); opacity: 0; }
                  60% { transform: scale(1.06); opacity: 1; }
                  100% { transform: scale(1); }
                }
              `}</style>
            </Link>

            {/* desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              {navItems.map((i) => (
                <NavLink key={i.href} href={i.href} label={i.label} cta={i.cta} />
              ))}
            </nav>

            {/* right cluster: Language + burger */}
            <div className="flex items-center gap-2">
              <LanguagePicker />
              {/* mobile burger */}
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Open menu"
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-black"
              >
                <div className="relative h-4 w-5">
                  <span className={`absolute inset-x-0 top-0 h-[2px] bg-black transition ${open ? "translate-y-2 rotate-45" : ""}`} />
                  <span className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-black transition ${open ? "opacity-0" : "opacity-100"}`} />
                  <span className={`absolute inset-x-0 bottom-0 h-[2px] bg-black transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* scroll progress */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative h-[3px] w-full rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--h-yellow)] via-[var(--h-blue)] to-[var(--h-yellow)] opacity-20" />
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(scrollPct)}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${scrollPct}%`,
              background: `linear-gradient(90deg, ${YELLOW}, ${BLUE})`,
              boxShadow: "0 0 12px rgba(255,208,40,0.35)"
            }}
          />
        </div>
      </div>

      {/* mobile sheet (aligned to container) */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity duration-200`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Backdrop */}
        <button
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />

        <div className="mx-auto max-w-7xl px-4">
          <div
            className={`absolute left-4 right-0 top-10 rounded-2xl border border-white/10 bg-[#10172a] text-white shadow-2xl transition-transform duration-300 ${open ? "translate-y-0" : "-translate-y-3"}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <div className="text-sm font-semibold tracking-wide text-white/80">Menu</div>
              <button
                onClick={() => setOpen(false)}
                className="h-9 w-9 grid place-items-center rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition"
                aria-label="Close"
              >
                <Close size={18} className="opacity-90" />
              </button>
            </div>

            {/* Nav */}
            <nav className="px-3 pb-3">
              <ul className="space-y-2">
                {navItems.map((i) => {
                  const Icon = getIconFor(i);
                  return (
                    <li key={i.href}>
                      {i.cta ? (
                        <Link
                          href={i.href}
                          onClick={() => setOpen(false)}
                          className="block text-center rounded-xl px-4 py-3 font-semibold text-blue-900 bg-yellow-400 hover:brightness-95 shadow-md transition"
                        >
                          {i.label}
                        </Link>
                      ) : (
                        <Link
                          href={i.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 ring-1 ring-white/10 bg-white/0 hover:bg-white/5 transition"
                        >
                          <span className="h-9 w-9 grid place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                            <Icon size={18} className="opacity-90" />
                          </span>
                          <span className="font-medium text-white/95">{i.label}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Language picker (below the links) */}
            <div className="px-4 pt-2 pb-4 border-t border-white/10">
              <LanguagePicker compact />
            </div>

            {/* Footer (optional) */}
            <div className="px-4 pb-4 text-[11px] text-white/60">
              © {new Date().getFullYear()} {brand?.name ?? "East"}
            </div>
          </div>
        </div>
      </div>

      {/* page-top glow accent */}
      <div
        className="pointer-events-none fixed -z-10 top-0 left-1/2 -translate-x-1/2 w-[80vw] h-40 blur-[60px] opacity-25"
        style={{ background: `radial-gradient(600px circle at 50% 0%, ${YELLOW}, transparent 45%)` }}
      />
    </header>
  );
}

/* ────────────────────────────────────────────────────────────
   Language Picker (reliable flags + robust locale switch)
──────────────────────────────────────────────────────────── */
function LanguagePicker({ compact = false }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname(); // locale-invariant (e.g., "/products")
  const locale = useLocale();     // "en" | "so"
  const searchParams = useSearchParams();

  // Prefer local SVG flags; fallback to emoji; fallback to code.
  const LANGS = useMemo(() => ([
    { code: "en", label: "English", emoji: "🇬🇧", flagSrc: "/flags/en.png", fallback: "EN" },
    { code: "so", label: "Somali",  emoji: "🇸🇴", flagSrc: "/flags/so.png", fallback: "SO" }
  ]), []);

  const activeIndex = Math.max(0, LANGS.findIndex((l) => l.code === locale));

  useEffect(() => {
    const onClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function switchTo(nextLocale) {
    if (!nextLocale || nextLocale === locale) return;
    // Preserve current querystring
    const qs = searchParams?.toString() ||
      (typeof window !== "undefined" ? window.location.search.slice(1) : "");
    const href = qs ? `${pathname}?${qs}` : pathname;

    // next-intl navigation router supports locale option
    router.replace(href, { locale: nextLocale });

    setOpen(false);
  }

  const triggerSize = compact ? "h-9 w-9 text-xl" : "h-10 w-10 text-2xl";

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        aria-label="Language"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={[
          "group relative grid place-items-center rounded-xl text-xl",
          "border border-white/15 bg-white/10 text-black/90",
          "backdrop-blur transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/60",
          triggerSize
        ].join(" ")}
      >
        <FlagMark lang={LANGS[activeIndex]} key={LANGS[activeIndex]?.code} />
        <span
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }}
        />
      </button>

      {/* Dropdown */}
      <div
        role="menu"
        aria-label="Select language"
        className={[
          "absolute right-0 mt-2 w-56 origin-top-right",
          "rounded-2xl border border-white/15 bg-white/80 backdrop-blur-xl shadow-[0_18px_40px_-16px_rgba(0,0,0,.35)]",
          "transition-all duration-200",
          open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        ].join(" ")}
      >
        {/* decorative caret */}
        <div className="absolute -top-2 right-4 h-4 w-4 rotate-45 rounded-[6px] bg-white/80 border border-white/20 backdrop-blur-xl" />

        <div className="relative p-3">
          <div className="grid grid-cols-6 gap-2">
            {LANGS.map((l, i) => {
              const isActive = l.code === locale;
              return (
                <button
                  key={l.code}
                  role="menuitem"
                  aria-label={l.label}
                  onClick={() => switchTo(l.code)}
                  className={[
                    "relative aspect-square rounded-xl",
                    "grid place-items-center textsm",
                    "border border-black/5 bg-white/70 hover:bg-white",
                    "shadow-sm hover:shadow-md transition-all",
                    "hover:-translate-y-0.5 active:scale-95",
                    isActive ? "ring-2 ring-yellow-300" : ""
                  ].join(" ")}
                  style={{
                    animation: open ? `flagIn .35s ${50 + i * 25}ms cubic-bezier(.2,.7,.2,1) both` : undefined
                  }}
                  title={l.label}
                >
                  <FlagMark lang={l} />
                </button>
              );
            })}
          </div>

          {/* subtle footer hint */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600">
            <span>Choose language</span>
          </div>
        </div>
      </div>

      {/* local styles for staggered pop-in */}
      <style jsx>{`
        @keyframes flagIn {
          0% { opacity: 0; transform: translateY(6px) scale(0.96); filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}

/* FlagMark — tries SVG, then emoji, then 2-letter code */
function FlagMark({ lang }) {
  const [err, setErr] = useState(false);
  if (!lang) return <span className="text-base">🌐</span>;

  // Prefer SVG if available and not failed
  if (lang.flagSrc && !err) {
    return (
      <Image
        src={lang.flagSrc}
        alt={`${lang.label} flag`}
        width={22}
        height={22}
        className="rounded-[4px] object-contain"
        onError={() => setErr(true)}
        draggable={false}
        priority={false}
      />
    );
  }

  // Fallback to emoji if supported
  if (lang.emoji) {
    return <span className="translate-y-[1px]" aria-hidden>{lang.emoji}</span>;
  }

  // Final fallback: 2-letter code
  return (
    <span className="text-[11px] font-semibold tracking-wide" aria-label={lang.label}>
      {lang.fallback || lang.code?.toUpperCase()}
    </span>
  );
}

/* Icons */
function getIconFor(item) {
  const k = (item.label || item.href || "").toLowerCase();
  if (k.includes("home")) return Home;
  if (k.includes("product")) return Boxes;
  if (k.includes("lab") || k.includes("spec")) return FlaskConical;
  if (k.includes("contact")) return Phone;
  if (k.includes("about")) return Info;
  if (k.includes("lang") || k.includes("globe")) return Globe;
  return Sparkles;
}
