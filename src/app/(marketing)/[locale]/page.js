"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

// Locale-aware Link
import { Link } from "../../../../i18n/navigation";

// Existing blocks (Hero unchanged)
import Hero from "../../components/blocks/Hero";
import Commitment from "../../components/ui/Commitment";

// Brand + data
import { brand } from "../../config/brand";
import { listProducts } from "../../data/products";

/* Brand */
const YELLOW = brand?.colors?.accent ?? "#FFD028";

/* Motion presets (respect reduced motion) */
const ease = [0.22, 1, 0.36, 1];
const fadeUp = (disabled) =>
  disabled
    ? {}
    : {
        hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease } },
      };
const clip = (disabled) =>
  disabled
    ? {}
    : {
        hidden: { opacity: 0.001, clipPath: "inset(14% 12% 14% 12% round 18px)" },
        show: { opacity: 1, clipPath: "inset(0 0 0 0 round 18px)", transition: { duration: 0.5, ease } },
      };
const stagger = (gap = 0.06, disabled = false) =>
  disabled
    ? {}
    : { hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: gap, delayChildren: 0.04 } } };
const item = (disabled) =>
  disabled ? {} : { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } } };

/* Subtle mouse-tilt (low-cost) */
function useMouseTilt(max = 8) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let hovering = false;
    const enter = () => (hovering = true);
    const leave = () => {
      hovering = false;
      el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
    };
    const move = (e) => {
      if (!hovering) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const ry = (x - 0.5) * max;
      const rx = (0.5 - y) * max;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    el.addEventListener("mouseenter", enter, { passive: true });
    el.addEventListener("mouseleave", leave, { passive: true });
    el.addEventListener("mousemove", move, { passive: true });
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("mousemove", move);
    };
  }, [max]);
  return ref;
}

/* Map real products -> featured card shape */
function mapFeatured(products) {
  return (products || []).map((p) => ({
    name: p?.name ?? "Unnamed product",
    tagline: p?.tagline || p?.category || "Premium quality from East Africa",
    description: p?.summary || p?.description || "Consistent grade and traceable sourcing.",
    image: (Array.isArray(p?.images) && p.images[0]) || "/products/placeholder.jpg",
    spec: p?.hsCode ? `HS ${p.hsCode}` : p?.category || "Gum Resins",
  }));
}

/* Page */
export default function HomePage() {
  const featured = useMemo(() => {
    try {
      return mapFeatured(listProducts()).slice(0, 5);
    } catch {
      return [];
    }
  }, []);

  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-white text-slate-900">
      {/* Keep hero unchanged */}
      <Hero />

      <Commitment />

      <FeaturedProducts products={featured} prefersReducedMotion={prefersReducedMotion} />

      <Testimonials prefersReducedMotion={prefersReducedMotion} />

      <ClosingCTA prefersReducedMotion={prefersReducedMotion} />

      {/* Global helpers (smooth scroll + tiny utilities) */}
      <style jsx global>{`
        html:focus-within { scroll-behavior: smooth; }
        @supports (scroll-behavior: smooth) { html { scroll-behavior: smooth; } }
        @keyframes shine { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
        .animate-shine { animation: shine 3s ease-in-out infinite; }
        .shadow-soft { box-shadow: 0 12px 30px -12px rgba(0, 0, 0, 0.28); }
      `}</style>
    </div>
  );
}

/* Featured Products (lighter carousel card) */
function FeaturedProducts({ products, prefersReducedMotion }) {
  const tt = useTranslations("home.featured");
  const [active, setActive] = useState(0);

  if (!Array.isArray(products) || products.length === 0) return null;
  const p = products[active];
  const tiltRef = useMouseTilt(10);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % products.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + products.length) % products.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [products.length]);

  const tags = Array.isArray(tt.raw("tags")) ? tt.raw("tags") : [];
  const chips = Array.isArray(tt.raw("chips")) ? tt.raw("chips") : [];

  return (
    <section id="products" className="py-14 px-4 sm:px-6 lg:px-8 bg-[#1a2336]">
      <div className="mx-auto max-w-7xl">
        <motion.header
          variants={fadeUp(prefersReducedMotion)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {tt("titleA")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-cyan-300 to-white">
              {tt("titleB")}
            </span>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-slate-300 text-sm sm:text-base">{tt("desc")}</p>
        </motion.header>

        <motion.div
          variants={clip(prefersReducedMotion)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto"
        >
          <div
            className="
              mx-auto flex w-full max-w-5xl flex-col md:flex-row items-center justify-between gap-6
              rounded-2xl bg-slate-900/50 ring-1 ring-white/10 backdrop-blur-sm shadow-soft
            "
          >
            {/* LEFT copy */}
            <div className="min-w-0 flex-1 p-4 md:p-8 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-white text-lg sm:text-xl font-bold leading-tight">{p.name}</h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-0.5">{p.tagline}</p>
                </div>
                <span className="shrink-0 rounded-md bg-white/5 px-2 py-1 text-[10px] font-medium text-slate-200 ring-1 ring-white/10">
                  {p.spec}
                </span>
              </div>

              <p className="mt-2 line-clamp-3 text-slate-300/90 text-xs sm:text-sm">{p.description}</p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((t, i) => (
                  <span key={i} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-200">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {chips.map((c, i) => (
                  <div key={i} className="rounded-md bg-white/5 ring-1 ring-white/10 px-2 py-1.5 text-[11px] text-slate-200 text-center">
                    {c}
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-3 flex flex-wrap items-center gap-2">
                <Link
                  href="/products"
                  className="relative inline-flex items-center justify-center rounded-md px-3 py-1.5 text-[12px] font-semibold text-slate-900"
                  aria-label={tt("ctaView")}
                >
                  <span className="relative z-10">{tt("ctaView")}</span>
                  <span className="absolute inset-0 rounded-md bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-200 shadow-[0_10px_24px_-12px_rgba(250,204,21,.6)]" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  {tt("ctaSample")}
                </Link>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => setActive((i) => (i - 1 + products.length) % products.length)}
                    className="rounded-md border border-white/10 bg-white/5 p-1.5 text-white hover:bg-white/10"
                    aria-label={tt("ariaPrev")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActive((i) => (i + 1) % products.length)}
                    className="rounded-md border border-white/10 bg-white/5 p-1.5 text-white hover:bg-white/10"
                    aria-label={tt("ariaNext")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT image */}
            <div className="shrink-0 p-3">
              <div ref={tiltRef} className="relative overflow-hidden rounded-xl shadow-2xl" style={{ transform: "perspective(900px)" }}>
                <Image
                  key={p.image + active}
                  src={p.image}
                  alt={p.name}
                  width={360}
                  height={260}
                  className="object-contain"
                  loading="lazy"
                  sizes="(max-width: 768px) 70vw, 360px"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* Testimonials */
function Testimonials({ prefersReducedMotion }) {
  const tt = useTranslations("home.testimonials");
  const items = Array.isArray(tt.raw("items")) ? tt.raw("items") : [];
  if (items.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-[80vw] h-40 blur-[50px] opacity-15"
        style={{ background: `radial-gradient(600px circle at 50% 0%, ${YELLOW}, transparent 45%)` }}
      />
      <div className="mx-auto max-w-7xl">
        <motion.header
          variants={fadeUp(prefersReducedMotion)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-black">{tt("title")}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-slate-500">{tt("desc")}</p>
        </motion.header>

        <motion.ul
          variants={stagger(0.08, prefersReducedMotion)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((it, i) => (
            <motion.li variants={item(prefersReducedMotion)} key={i}>
              <TestimonialCard
                quote={it.quote}
                who={it.who}
                avatar="/east_logo.png"
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* Closing CTA */
function ClosingCTA({ prefersReducedMotion }) {
  const tt = useTranslations("home.cta");
  return (
    <section className="relative overflow-hidden py-20 sm:py-20 mb-5 px-4 sm:px-6 lg:px-8 bg-[#1a2336]">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(600px 400px at 20% 20%, rgba(37,99,235,.22), transparent), radial-gradient(600px 400px at 80% 80%, rgba(252,211,77,.22), transparent)",
        }}
      />
      <div className="mx-auto max-w-7xl relative">
        <motion.div
          variants={clip(prefersReducedMotion)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid gap-8 md:grid-cols-2 items-center"
        >
          <div>
            <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">{tt("title")}</h3>
            <p className="mt-3 text-slate-300">{tt("desc")}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href="/contact"
              className="relative inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold text-slate-900"
            >
              <span className="relative z-10">{tt("btnContact")}</span>
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-200 shadow-[0_10px_30px_-12px_rgba(250,204,21,.6)]" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              {tt("btnBrowse")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* Cards */
function TestimonialCard({ quote, who, avatar }) {
  return (
    <div
      className="relative rounded-3xl h-full p-6 sm:p-8 bg-white/85 ring-1 ring-slate-900/10 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_28px_-8px_rgba(0,0,0,0.3)] transition"
      style={{ contentVisibility: "auto", containIntrinsicSize: "420px 280px" }}
    >
      <blockquote className="relative z-10 text-black">
        <p className="font-semibold text-lg sm:text-xl leading-snug tracking-tight">&ldquo;{quote}&rdquo;</p>
        <div className="mt-6 flex items-center gap-4">
          <Image
            src={avatar}
            alt={who}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full ring-2 ring-yellow-400"
            loading="lazy"
          />
          <div className="text-sm font-medium text-black/70">{who}</div>
        </div>
      </blockquote>
    </div>
  );
}

/* Icons */
function ChevronLeft({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M15 19l-7-7 7-7" />
    </svg>
  );
}
function ChevronRight({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
