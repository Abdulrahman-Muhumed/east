"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import Hero from "../../components/blocks/Hero";
import { brand } from "../../config/brand";

/* Brand */
const YELLOW = brand?.colors?.accent ?? "#FFD028";

/* Demo product data (static for homepage card) */
const products = [
  {
    name: "Arabic Gum — Grade 1 (Hashab)",
    tagline: "Clean. Strong. Food-grade.",
    description: "Highest clarity and emulsifying power for F&B and pharma.",
    image: "https://sciencekitstore.com/image/thumbnails/19/04/GUMARAB-102477-1000x1000.png",
    spec: "COA/SDS • Food & Pharma"
  },
  {
    name: "Frankincense Resin",
    tagline: "Bright, citrus-amber.",
    description: "Premium Boswellia for fragrance, wellness, and ritual.",
    image: "https://primary.jwwb.nl/public/s/d/f/temp-ccyjrwfixmgsdsdqmxek/arabic-gum-emulcifier-wholesale-taschemind-gummybear.jpg?enable-io=true&enable=upscale&width=600",
    spec: "Boswellia • High Aroma"
  },
  {
    name: "Myrrh Resin",
    tagline: "Warm, balsamic.",
    description: "Classic depth for skincare, incense, and tinctures.",
    image: "https://sciencekitstore.com/image/thumbnails/19/04/GUMARAB-102477-1000x1000.png",
    spec: "Commiphora • Cosmetic"
  },
  {
    name: "Opoponax Resin",
    tagline: "Sweet myrrh.",
    description: "Smooth resin profile for perfumery and cones.",
    image: "https://loscavazostexas.com/wp-content/uploads/2025/03/Los-Cavazos-Arabic-Gum-Resin-1.jpg",
    spec: "Sweet Myrrh • Perfume"
  },
  {
    name: "Sandalwood Powder",
    tagline: "Creamy, woody.",
    description: "Finely milled powder for incense blends and skincare.",
    image: "https://primary.jwwb.nl/public/s/d/f/temp-ccyjrwfixmgsdsdqmxek/arabic-gum-emulcifier-wholesale-taschemind-gummybear.jpg?enable-io=true&enable=upscale&width=600",
    spec: "Milled • Incense"
  }
];

/* Motion presets */
const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } }
};
const clip = {
  hidden: { opacity: 0.001, clipPath: "inset(14% 12% 14% 12% round 18px)" },
  show: { opacity: 1, clipPath: "inset(0 0 0 0 round 18px)", transition: { duration: 0.7, ease: "easeOut" } }
};
const stagger = (gap = 0.06) => ({
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: gap, delayChildren: 0.04 } }
});
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
};

/* Mouse tilt (subtle) */
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
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("mousemove", move);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("mousemove", move);
    };
  }, [max]);
  return ref;
}

/* Page */
export default function HomePage() {
  const t = useTranslations("home");
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white text-slate-900">
      <Hero />

      <Commitment />

      <FeaturedProducts products={products} />

      <Testimonials />

      <ClosingCTA />

      {/* tiny global helpers */}
      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        .animate-shine { animation: shine 3.2s ease-in-out infinite; }
        .shadow-soft { box-shadow: 0 12px 30px -12px rgba(0,0,0,.35); }
        .ring-soft { box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); }
      `}</style>
    </div>
  );

  /* Sections (use t inside so they re-render in the locale) */
  function Commitment() {
    return (
      <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* soft grid + brand glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="absolute inset-0 opacity-40 [background:radial-gradient(900px_550px_at_15%_15%,rgba(36,99,235,.10),transparent_60%),radial-gradient(900px_550px_at_85%_85%,rgba(255,208,40,.12),transparent_60%)]" />
        </div>

        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.header variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              {t("commitment.titleA")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0b2a6b] via-[#2463eb] to-[#0ea5e9]">
                {t("commitment.titleB")}
              </span>
              {t("commitment.titleC")}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">{t("commitment.desc")}</p>
          </motion.header>

          {/* Metrics */}
          <motion.ul variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Metric k={t("commitment.metrics.coa.k")} v={t("commitment.metrics.coa.v")} note={t("commitment.metrics.coa.note")} />
            <Metric k={t("commitment.metrics.trace.k")} v={t("commitment.metrics.trace.v")} note={t("commitment.metrics.trace.note")} />
            <Metric k={t("commitment.metrics.lead.k")} v={t("commitment.metrics.lead.v")} note={t("commitment.metrics.lead.note")} />
          </motion.ul>

          {/* Feature cards */}
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: t("commitment.features.sourced.title"),
                body: t("commitment.features.sourced.body"),
                points: t.raw("commitment.features.sourced.points"),
                cta: t("commitment.features.sourced.cta"),
                icon: CheckIcon
              },
              {
                title: t("commitment.features.lab.title"),
                body: t("commitment.features.lab.body"),
                points: t.raw("commitment.features.lab.points"),
                cta: t("commitment.features.lab.cta"),
                icon: MicrolabIcon
              },
              {
                title: t("commitment.features.industry.title"),
                body: t("commitment.features.industry.body"),
                points: t.raw("commitment.features.industry.points"),
                cta: t("commitment.features.industry.cta"),
                icon: ShieldIcon
              }
            ].map((f, i) => (
              <li key={i}>
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.12 * i }}>
                  <FeatureCardPro {...f} />
                </motion.div>
              </li>
            ))}
          </ul>
        </div>

        <style jsx>{`
          .card-hover { transition: transform 420ms cubic-bezier(.2,.7,.2,1), box-shadow 420ms, background 420ms; }
          .card-hover:hover { transform: translateY(-6px); box-shadow: 0 18px 36px -18px rgba(2, 8, 23, .30); }
        `}</style>
      </section>
    );
  }

  function Metric({ k, v, note }) {
    return (
      <motion.li variants={item} className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur px-5 py-4 shadow-sm">
        <div className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">{k}</div>
        <div className="mt-1 text-xl font-bold text-slate-900">{v}</div>
        <div className="text-xs text-slate-500">{note}</div>
      </motion.li>
    );
  }

  function FeatureCardPro({ title, body, icon: Icon, points = [], cta }) {
    return (
      <div className="card-hover relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-xl" style={{ background: "conic-gradient(from 140deg, #6fe7dd, #ffd028, transparent 60%)" }} />
        <div className="relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-600 ring-1 ring-yellow-400/30">
            <Icon />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">{body}</p>

          {points?.length > 0 && (
            <ul className="mt-4 space-y-2">
              {points.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <svg className="mt-[2px] h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300">
              {cta}
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function FeaturedProducts({ products }) {
    const tt = useTranslations("home.featured");
    const [active, setActive] = useState(0);
    const p = products[active];

    useEffect(() => {
      const onKey = (e) => {
        if (e.key === "ArrowRight") setActive((i) => (i + 1) % products.length);
        if (e.key === "ArrowLeft") setActive((i) => (i - 1 + products.length) % products.length);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [products.length]);

    const tiltRef = useMouseTilt(10);

    return (
      <section id="products" className="py-14 px-4 sm:px-6 lg:px-8 bg-[#1a2336]">
        <div className="mx-auto max-w-7xl">
          <motion.header variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mb-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {tt("titleA")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-cyan-300 to-white">
                {tt("titleB")}
              </span>
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-slate-300 text-sm sm:text-base">{tt("desc")}</p>
          </motion.header>

          <motion.div variants={clip} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto">
            <div className="mx-auto flex w-full max-w-5xl flex-col md:flex-row items-center justify-between gap-6 rounded-2xl bg-slate-900/60 ring-1 ring-white/10 backdrop-blur shadow-soft">
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
                  {tt.raw("tags").map((tTag, i) => (
                    <span key={i} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-200">
                      {tTag}
                    </span>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {tt.raw("chips").map((c, i) => (
                    <div key={i} className="rounded-md bg-white/5 ring-1 ring-white/10 px-2 py-1.5 text-[11px] text-slate-200 text-center">
                      {c}
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-3 flex flex-wrap items-center gap-2">
                  <Link href="/products" className="relative inline-flex items-center justify-center rounded-md px-3 py-1.5 text-[12px] font-semibold text-slate-900">
                    <span className="relative z-10">{tt("ctaView")}</span>
                    <span className="absolute inset-0 rounded-md bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-200 shadow-[0_10px_24px_-12px_rgba(250,204,21,.6)]" />
                  </Link>

                  <Link href="/contact" className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur transition hover:bg-white/10">
                    {tt("ctaSample")}
                  </Link>

                  <div className="ml-auto flex items-center gap-2">
                    <button onClick={() => setActive((i) => (i - 1 + products.length) % products.length)} className="rounded-md border border-white/10 bg-white/5 p-1.5 text-white hover:bg-white/10" aria-label={tt("ariaPrev")}>
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={() => setActive((i) => (i + 1) % products.length)} className="rounded-md border border-white/10 bg-white/5 p-1.5 text-white hover:bg-white/10" aria-label={tt("ariaNext")}>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT image */}
              <div className="shrink-0 p-3">
                <div
                  ref={useMouseTilt(10)}
                  className="relative overflow-hidden rounded-xl ring-1 ring-white/10 shadow-[0_12px_30px_-12px_rgba(0,0,0,.6)] transition-transform duration-200"
                  style={{ transform: "perspective(900px)" }}
                >
                  <Image key={p.image + active} src={p.image} alt={p.name} width={350} height={200} className="object-contain" unoptimized />
                  <div className="pointer-events-none absolute inset-0 translate-x-[-120%] mix-blend-screen bg-[linear-gradient(100deg,transparent,rgba(255,255,255,.22),transparent)] animate-shine" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  function Testimonials() {
    const tt = useTranslations("home.testimonials");
    const items = t.raw("testimonials.items");
    return (
      <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-[80vw] h-40 blur-[60px] opacity-15" style={{ background: `radial-gradient(600px circle at 50% 0%, ${YELLOW}, transparent 45%)` }} />
        <div className="mx-auto max-w-7xl">
          <motion.header variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="text-center">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-black">{tt("title")}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-slate-500">{tt("desc")}</p>
          </motion.header>

          <motion.ul variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => (
              <motion.li variants={item} key={i}>
                <TestimonialCard quote={it.quote} who={it.who} avatar="https://cdn-icons-png.flaticon.com/512/147/147142.png" />
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>
    );
  }

  function ClosingCTA() {
    const tt = useTranslations("home.cta");
    return (
      <section className="relative overflow-hidden py-20 sm:py-20 mb-5 px-4 sm:px-6 lg:px-8 bg-[#1a2336]">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(600px 400px at 20% 20%, rgba(37,99,235,.25), transparent), radial-gradient(600px 400px at 80% 80%, rgba(252,211,77,.25), transparent)" }} />
        <div className="mx-auto max-w-7xl relative">
          <motion.div variants={clip} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">{tt("title")}</h3>
              <p className="mt-3 text-slate-300">{tt("desc")}</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/contact" className="relative inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold text-slate-900">
                <span className="relative z-10">{tt("btnContact")}</span>
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-200 shadow-[0_10px_30px_-12px_rgba(250,204,21,.6)]" />
              </Link>
              <Link href="/products" className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white backdrop-blur transition hover:bg-white/10">
                {tt("btnBrowse")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }
}

/* Cards */
function TestimonialCard({ quote, who, avatar }) {
  return (
    <div className="relative rounded-3xl p-6 sm:p-8 backdrop-blur-md bg-white/70 ring-1 ring-slate-900/10 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] transition">
      <blockquote className="relative z-10 text-black">
        <p className="font-semibold text-lg sm:text-xl leading-snug tracking-tight">&ldquo;{quote}&rdquo;</p>
        <div className="mt-6 flex items-center gap-4">
          <Image src={avatar} alt={who} width={48} height={48} className="h-12 w-12 rounded-full ring-2 ring-yellow-400" unoptimized />
          <div className="text-sm font-medium text-black/70">{who}</div>
        </div>
      </blockquote>
    </div>
  );
}

/* Icons */
function CheckIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>;
}
function MicrolabIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3v6a6 6 0 1 0 6 0V3" /><path d="M9 3h6" /></svg>;
}
function ShieldIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10z" /></svg>;
}
function ChevronLeft({ className = "h-5 w-5" }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>;
}
function ChevronRight({ className = "h-5 w-5" }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>;
}
