"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Hero2 from "../../../components/blocks/Hero2";
import { brand } from "../../../config/brand";
import { useTranslations } from "next-intl";

/* ─────────────────────────── BRAND ─────────────────────────── */
const ACCENT = brand.colors.accent; // no double semicolon

/* ─────────────────────────── Utils & Anim ─────────────────────────── */
const clamp = (n, a, b) => Math.min(Math.max(n, a), b);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function useSectionProgress(threshold = 0.14) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const calc = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw =
        1 - clamp((r.top + r.height * (1 - threshold)) / (vh + r.height * (1 - threshold)), 0, 1);
      setProgress(easeOutCubic(clamp(raw, 0, 1)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [threshold]);
  return { ref, progress };
}

const Enter = ({ progress, children, direction = "up", delay = 0 }) => {
  const t = clamp((progress - delay) / (1 - delay || 1), 0, 1);
  const e = easeOutCubic(t);
  const base = 44;
  const tr =
    direction === "up"
      ? `translate3d(0, ${base * (1 - e)}px, 0)`
      : direction === "down"
      ? `translate3d(0, ${-base * (1 - e)}px, 0)`
      : direction === "left"
      ? `translate3d(${base * (1 - e)}px, 0, 0)`
      : `translate3d(${-base * (1 - e)}px, 0, 0)`;
  return (
    <div
      style={{
        transform: tr,
        opacity: e,
        transition: "transform .6s cubic-bezier(.2,.7,.2,1),opacity .6s cubic-bezier(.2,.7,.2,1)",
        willChange: "transform,opacity",
      }}
    >
      {children}
    </div>
  );
};



/* ─────────────────────────── Page ─────────────────────────── */
export default function QualityPage() {
  const t = useTranslations("quality");
  const rotating = t.raw("hero.rotating");

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
      <Hero2
        variant="image"
        bgImage="/quality/quality1.png"
        primaryColor="#0b2a6b"
        accentColor="#ffd028"
        kicker={t("hero.kicker")}
        title={t("hero.title")}
        lastWord={t("hero.lastWord")}
        hasStats=""
        subtitle={t("hero.subtitle")}
        rotatingWords={Array.isArray(rotating) ? rotating : []}
        rotationMode="flip"
      />
      <Standards />
      <Process />
      <Assurance />
     
      <DocsSampling />
      <CTA />
    </div>
  );
}

const Standards = () => {
  const t = useTranslations("quality.standards");
  const { ref, progress } = useSectionProgress();
  const items = t.raw("items");

  return (
    <section ref={ref} className="relative py-18 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <Enter progress={progress} direction="up">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center">
            {t("title")}
          </h2>
        </Enter>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(items) &&
            items.map((it, i) => (
              <Enter
                key={it.title + i}
                progress={progress}
                direction={i % 2 ? "left" : "right"}
                delay={0.05 * (i % 3)}
              >
                <Tile it={it} pillLabel={t("pillLabel")} />
              </Enter>
            ))}
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const t = useTranslations("quality.process");
  const { ref, progress } = useSectionProgress();
  const steps = t.raw("steps");

  return (
    <section ref={ref} className="relative py-18 sm:py-24 bg-neutral-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <Enter progress={progress} direction="up">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center">
            {t("title")}
          </h2>
        </Enter>

        <div className="relative mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(steps) &&
            steps.map((s, i) => (
              <div
                key={s.k}
                className="p-1.5 rounded-[2rem] from-transparent to-transparent hover:from-white/50 hover:to-white/50 bg-gradient-to-br transition-all duration-500 overflow-hidden"
              >
                <Enter progress={progress} direction={i % 2 === 0 ? "left" : "right"} delay={0.05 * i}>
                  <div className="relative rounded-[1.75rem] border border-neutral-200 bg-white p-6 transition-all h-full hover:shadow-xl group">
                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: "radial-gradient(circle at 100% 0%, #ffd028 0%, transparent 50%)" }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <AnimatedNumber value={i + 1} progress={progress} delay={0.1 * i} />
                      <span className="text-sm font-semibold text-neutral-500">{t("stepLabel")} {i + 1}</span>
                    </div>
                    <h4 className="text-base font-semibold mt-4">{s.t}</h4>
                    <p className="mt-1 text-sm text-neutral-600">{s.d}</p>
                  </div>
                </Enter>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

const Assurance = () => {
  const t = useTranslations("quality.assurance");
  const { ref, progress } = useSectionProgress();
  const metrics = t.raw("metrics");

  return (
    <section ref={ref} className="relative py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Enter progress={progress} direction="left">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t("title")}</h2>
              <p className="mt-2 max-w-lg text-neutral-600">{t("body")}</p>
            </div>
          </Enter>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {Array.isArray(metrics) &&
              metrics.map((m, i) => (
                <Enter
                  key={m.label + i}
                  progress={progress}
                  direction={i % 2 ? "left" : "right"}
                  delay={0.05 * (i % 3)}
                >
                  <StatCard label={m.label} value={m.value} />
                </Enter>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Certificates = () => {
    
  const t = useTranslations("quality.certs");
  const { ref, progress } = useSectionProgress();
  const certs = t.raw("items");

  return (
    <section ref={ref} className="relative py-18 sm:py-24 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6">
        <Enter progress={progress} direction="up">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center">{t("title")}</h2>
        </Enter>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(certs) &&
            certs.map((c, i) => (
              <Enter key={c.name + i} progress={progress} direction={i % 2 ? "left" : "right"} delay={0.04 * i}>
                <CertCard cert={c} viewText={t("view")} />
              </Enter>
            ))}
        </div>
      </div>
    </section>
  );
};

const DocsSampling = () => {
  const t = useTranslations("quality.docsSampling");
  const { ref, progress } = useSectionProgress();
  const points = t.raw("points");

  return (
    <section ref={ref} className="relative py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 grid gap-8 md:grid-cols-2 items-center">
        <Enter progress={progress} direction="right">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-neutral-200 shadow-xl group">
            <Image
              src="/quality/quality2.png"
              alt="Sampling and documentation"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width:768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
          </div>
        </Enter>
        <Enter progress={progress} direction="left" delay={0.08}>
          <div>
            <Badge>{t("badge")}</Badge>
            <h3 className="mt-3 text-2xl sm:text-3xl font-bold">{t("title")}</h3>
            <ul className="mt-3 space-y-2 text-neutral-700 text-sm">
              {Array.isArray(points) &&
                points.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
            </ul>
          </div>
        </Enter>
      </div>
    </section>
  );
};

const CTA = () => {
  const t = useTranslations("quality.cta");
  const { ref, progress } = useSectionProgress();
  return (
    <section ref={ref} className="relative overflow-hidden py-16 sm:py-20">
      <div className="relative container mx-auto px-4 sm:px-6">
        <Enter progress={progress} direction="up">
          <div className="rounded-[2rem] border border-neutral-200 bg-white/70 backdrop-blur-lg p-8 sm:p-10 shadow-lg">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
                  {t("title")}
                </h3>
                <p className="mt-2 text-neutral-600">{t("body")}</p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <a href="/products" className="BtnGhost">
                  {t("browse")}
                </a>
                <a href="/contact" className="BtnPrimary">
                  {t("contact")}
                </a>
              </div>
            </div>
          </div>
        </Enter>
      </div>
    </section>
  );
};

/* ─────────────────────────── UI Bits ─────────────────────────── */
const Tile = ({ it, pillLabel }) => {
  return (
    <div className="group relative rounded-3xl border border-neutral-200 bg-white p-6 sm:p-7 [transform-style:preserve-3d] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl overflow-hidden">
      <div
        className="pointer-events-none absolute -inset-20 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-40"
        style={{ background: `radial-gradient(circle at 50% 50%, ${ACCENT} 0%, transparent 70%)` }}
      />
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] text-neutral-600">
          {pillLabel}
        </div>
        <h3 className="mt-3 text-lg font-semibold">{it.title}</h3>
        <p className="mt-1 text-sm text-neutral-600">{it.desc}</p>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -top-1/2 left-1/2 h-[220%] w-[45%] -translate-x-1/2 rotate-12 bg-white/6" />
      </div>
    </div>
  );
};

const AnimatedNumber = ({ value, progress, delay }) => {
  const [currentValue, setCurrentValue] = useState(0);
  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      const p = clamp((progress - delay) / (1 - delay || 1), 0, 1);
      const eased = easeOutCubic(p);
      const next = Math.floor(eased * value);
      setCurrentValue(next);
      if (p < 1) animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [progress, value, delay]);
  return (
    <div className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 shadow-lg">
      <span className="font-mono">{currentValue}</span>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div
    className="group relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-white/70 backdrop-blur-sm
               px-6 py-5 shadow-[0_6px_24px_-18px_rgba(0,0,0,0.25)]
               transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
  >
    <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: ACCENT }} />
    <div className="text-[11px] uppercase tracking-[0.08em] text-neutral-500">{label}</div>
    <div className="mt-0.5 text-2xl font-bold text-neutral-950">{value}</div>
    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute -top-1/2 left-1/2 h-[220%] w-[45%] -translate-x-1/2 rotate-12 bg-white/6" />
    </div>
  </div>
);

const CertCard = ({ cert, viewText }) => (
  <div className="group relative rounded-[2rem] border border-neutral-200 bg-white p-4 hover:shadow-2xl transition-all">
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-neutral-200">
      <Image
        src={cert.img || "/quality/cert-placeholder.png"}
        alt={cert.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        sizes="(max-width:768px) 100vw, 33vw"
      />
    </div>
    <div className="mt-3 flex items-center justify-between">
      <div className="font-medium text-sm">{cert.name}</div>
      {cert.file && (
        <a
          href={cert.file}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-neutral-500 underline hover:text-neutral-900 transition-colors"
        >
          {viewText}
        </a>
      )}
    </div>
  </div>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] text-neutral-600">
    {children}
  </span>
);
