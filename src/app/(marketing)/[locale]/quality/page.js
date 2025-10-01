"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Hero2 from "../../../components/blocks/Hero2";
import { brand } from "../../../config/brand";
import { useTranslations } from "next-intl";
import { Link } from "../../../../../i18n/navigation";

/* ─────────────────────────── BRAND ─────────────────────────── */
const PRIMARY = brand.colors.primary;
const ACCENT = brand.colors.accent;

/* ─────────────────────────── Utils & Anim ─────────────────────────── */
const clamp = (n, a, b) => Math.min(Math.max(n, a), b);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/** Run entrance animations only on the user's first visit this session. */
function useFirstVisitAnimation(key = "quality_page_animated_once") {
    const [enable, setEnable] = useState(true);
    useEffect(() => {
        try {
            const done = sessionStorage.getItem(key);
            if (done === "1") setEnable(false);
            else sessionStorage.setItem(key, "1");
        } catch {
            // sessionStorage may be unavailable; default to enable once.
        }
    }, [key]);
    return enable;
}

/** Lightweight section visibility (5 thresholds) */
function useSectionProgress() {
    const ref = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setProgress(entry.intersectionRatio),
            { threshold: [0, 0.25, 0.5, 0.75, 1] }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return { ref, progress };
}

/** Controlled enter component; respects "animateOnce" flag */
const Enter = ({ progress, children, direction = "up", delay = 0, animate = true }) => {
    if (!animate) return <>{children}</>;
    const t = clamp((progress - delay) / (1 - delay || 1), 0, 1);
    const e = easeOutCubic(t);
    const base = 36;
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
                transition: "transform .42s cubic-bezier(.22,1,.36,1),opacity .42s cubic-bezier(.22,1,.36,1)",
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
    const animateOnce = useFirstVisitAnimation(); // true on first visit, false afterwards

    return (
        <div className="min-h-screen text-neutral-900 overflow-x-clip">
            <Hero2
                variant="image"
                bgImage="/quality/quality1.png"
                primaryColor={PRIMARY}
                accentColor={ACCENT}
                kicker={t("hero.kicker")}
                title={t("hero.title")}
                hasActionbtn="no"
                lastWord={t("hero.lastWord")}
                hasStats=""
                subtitle={t("hero.subtitle")}
                rotatingWords={Array.isArray(rotating) ? rotating : []}
                rotationMode="flip"
            />

            <Standards animateOnce={animateOnce} />
            <Process animateOnce={animateOnce} />
            <Assurance animateOnce={animateOnce} />
            <DocsSampling animateOnce={animateOnce} />
            <CTA animateOnce={animateOnce} />

            <ScrollTopFab />
        </div>
    );
}

/* ─────────────────────────── Sections ─────────────────────────── */
const Standards = React.memo(function Standards({ animateOnce }) {
    const t = useTranslations("quality.standards");
    const { ref, progress } = useSectionProgress();
    const items = t.raw("items");

    return (
        <section ref={ref} className="relative py-18 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6">
                <Enter progress={progress} direction="up" animate={animateOnce}>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center">{t("title")}</h2>
                </Enter>

                {/* Beautiful, professional feature cards */}
                <div className="mt-8 grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.isArray(items) &&
                        items.map((it, i) => (
                            <Enter
                                key={it.title + i}
                                progress={progress}
                                direction={i % 2 ? "left" : "right"}
                                delay={0.05 * (i % 3)}
                                animate={animateOnce}
                            >
                                <FeatureCard title={it.title} desc={it.desc} pill={t("pillLabel")} />
                            </Enter>
                        ))}
                </div>
            </div>
        </section>
    );
});

const Process = React.memo(function Process({ animateOnce }) {
    const t = useTranslations("quality.process");
    const { ref, progress } = useSectionProgress();
    const steps = t.raw("steps");

    return (
        <section ref={ref} className="relative py-24 sm:py-32 bg-neutral-50 text-neutral-900">
            <div className="container mx-auto px-4 sm:px-6">
                <Enter progress={progress} animate={animateOnce}>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center">{t("title")}</h2>
                </Enter>

                <div className="relative mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {Array.isArray(steps) &&
                        steps.map((s, i) => (
                            <Enter key={s.k} progress={progress} delay={0.05 + 0.06 * i} animate={animateOnce}>
                                <StepCard index={i + 1} title={s.t} desc={s.d} />
                            </Enter>
                        ))}
                </div>
            </div>
        </section>
    );
});

const Assurance = React.memo(function Assurance({ animateOnce }) {
    const t = useTranslations("quality.assurance");
    const { ref, progress } = useSectionProgress();
    const metrics = t.raw("metrics");

    return (
        <section ref={ref} className="relative py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <Enter progress={progress} direction="left" animate={animateOnce}>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t("title")}</h2>
                            <p className="mt-2 max-w-lg text-neutral-600">{t("body")}</p>
                        </div>
                    </Enter>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {Array.isArray(metrics) &&
                            metrics.map((m, i) => (
                                <Enter
                                    key={m.label + i}
                                    progress={progress}
                                    direction={i % 2 ? "left" : "right"}
                                    delay={0.04 * (i % 3)}
                                    animate={animateOnce}
                                >
                                    <MetricCard label={m.label} value={m.value} />
                                </Enter>
                            ))}
                    </div>
                </div>
            </div>
        </section>
    );
});

const Certificates = React.memo(function Certificates({ animateOnce }) {
    const t = useTranslations("quality.certs");
    const { ref, progress } = useSectionProgress();
    const certs = t.raw("items");

    return (
        <section ref={ref} className="relative py-18 sm:py-24 bg-neutral-50">
            <div className="container mx-auto px-4 sm:px-6">
                <Enter progress={progress} direction="up" animate={animateOnce}>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center">{t("title")}</h2>
                </Enter>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.isArray(certs) &&
                        certs.map((c, i) => (
                            <Enter
                                key={c.name + i}
                                progress={progress}
                                direction={i % 2 ? "left" : "right"}
                                delay={0.04 * i}
                                animate={animateOnce}
                            >
                                <CertificateCard cert={c} viewText={t("view")} />
                            </Enter>
                        ))}
                </div>
            </div>
        </section>
    );
});

const DocsSampling = React.memo(function DocsSampling({ animateOnce }) {
    const t = useTranslations("quality.docsSampling");
    const { ref, progress } = useSectionProgress();
    const points = t.raw("points");

    return (
        <section ref={ref} className="relative py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 grid gap-8 md:grid-cols-2 items-center">
                <Enter progress={progress} direction="right" animate={animateOnce}>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-neutral-200 shadow-lg group">
                        <Image
                            src="/quality/quality2.png"
                            alt="Sampling and documentation"
                            fill
                            loading="lazy"
                            className="object-cover transition-transform duration-400 group-hover:scale-[1.03]"
                            sizes="(max-width:768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                    </div>
                </Enter>

                <Enter progress={progress} direction="left" delay={0.08} animate={animateOnce}>
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
});

const CTA = React.memo(function CTA({ animateOnce }) {
    const t = useTranslations("quality.cta");
    const { ref, progress } = useSectionProgress();
    return (
        <section ref={ref} className="relative overflow-hidden py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6">
                <Enter progress={progress} direction="up" animate={animateOnce}>
                    <div className="rounded-[2rem] border border-neutral-200 bg-white/70 p-8 sm:p-10 shadow-lg">
                        <div className="grid gap-6 md:grid-cols-2 md:items-center">
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">{t("title")}</h3>
                                <p className="mt-2 text-neutral-600">{t("body")}</p>
                            </div>
                            <div className="flex flex-wrap gap-3 md:justify-end">
                                <CTA_btn href="/contact" primary>
                                    {t("contact")}
                                </CTA_btn>
                            </div>
                        </div>
                    </div>
                </Enter>
            </div>
        </section>
    );
});

/* ─────────────────────────── Card Components (refreshed) ─────────────────────────── */

/** Feature/Standard card */
function FeatureCard({ title, desc, pill }) {
    return (
        <article
            className="
        group relative overflow-hidden rounded-2xl
        border border-neutral-200 bg-white/80 backdrop-blur
        p-6 sm:p-7 shadow-[0_6px_24px_-18px_rgba(0,0,0,.2)]
        transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,.28)]
      "
            style={{ contentVisibility: "auto", containIntrinsicSize: "460px 320px" }}
        >
            <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] text-neutral-600">
                    {pill}
                </span>
            </div>
            <h3 className="mt-3 text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-neutral-600">{desc}</p>

            {/* bottom accent line */}
            <span
                className="absolute left-4 right-4 bottom-4 h-[3px] rounded-full"
                style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}
            />

            {/* subtle light sweep */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute -top-1/2 left-1/2 h-[220%] w-[45%] -translate-x-1/2 rotate-12 bg-white/10" />
            </div>
        </article>
    );
}

/** Process step card */
function StepCard({ index, title, desc }) {
    return (
        <article
            className="
        relative h-full rounded-2xl border border-neutral-200 bg-white p-7
        shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
      "
            style={{ contentVisibility: "auto", containIntrinsicSize: "560px 360px" }}
        >
            <div className="flex items-start justify-between">
                <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-widest pt-1">
                    Step {index}
                </span>
                <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white"
                    style={{ border: `1px solid ${PRIMARY}`, color: PRIMARY }}
                >
                    {index}
                </div>
            </div>

            <h4 className="mt-3 text-lg sm:text-xl font-bold text-neutral-900">{title}</h4>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 leading-relaxed">{desc}</p>

            <span
                className="block mt-6 h-[3px] w-0 rounded-full transition-all duration-400"
                style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}
            />
        </article>
    );
}

/** Metric/stat card */
function MetricCard({ label, value }) {
    return (
        <div
            className="
        group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur
        px-6 py-5 shadow-[0_6px_24px_-18px_rgba(0,0,0,.2)]
        transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,.28)]
      "
            style={{ contentVisibility: "auto", containIntrinsicSize: "320px 160px" }}
        >
            <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: ACCENT }} />
            <div className="text-[11px] uppercase tracking-[0.08em] text-neutral-500">{label}</div>
            <div className="mt-0.5 text-2xl font-bold text-neutral-950">{value}</div>
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute -top-1/2 left-1/2 h-[220%] w-[45%] -translate-x-1/2 rotate-12 bg-white/10" />
            </div>
        </div>
    );
}

/** Certificate/Document card */
function CertificateCard({ cert, viewText }) {
    return (
        <div
            className="
        group relative rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur p-4
        hover:shadow-xl transition-all
      "
            style={{ contentVisibility: "auto", containIntrinsicSize: "420px 300px" }}
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-neutral-200">
                <Image
                    src={cert.img || "/quality/cert-placeholder.png"}
                    alt={cert.name}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width:768px) 100vw, 33vw"
                />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
                <div className="font-medium text-sm min-w-0 truncate">{cert.name}</div>
                {cert.file && (
                    <a
                        href={cert.file}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-neutral-600 underline hover:text-neutral-900 transition-colors"
                    >
                        {viewText}
                    </a>
                )}
            </div>
        </div>
    );
}

/* ─────────────────────────── Small UI Bits ─────────────────────────── */
const Badge = ({ children }) => (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] text-neutral-600">
        {children}
    </span>
);

const CTA_btn = ({ href, children, primary = false }) => {
    const base =
        "relative inline-flex items-center justify-center rounded-2xl px-5 py-2.5 font-semibold transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10";
    const secondary = "border border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300";
    const primaryCls = "text-neutral-950";
    return primary ? (
        <Link href={href} className={`${base} ${primaryCls}`}>
            <span className="relative z-10">{children}</span>
            <span
                className="absolute inset-0 rounded-2xl shadow-[0_10px_30px_-12px_rgba(250,204,21,.55)]"
                style={{ background: `linear-gradient(90deg, ${ACCENT} 0%, #ffe46f 100%)` }}
            />
            <span className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(60%_50%_at_50%_120%,#0000_40%,#000_100%)] bg-white/10" />
        </Link>
    ) : (
        <Link href={href} className={`${base} ${secondary}`}>
            {children}
        </Link>
    );
};

/* ─────────────────────────── Scroll-to-top FAB (safe-area aware) ─────────────────────────── */
function ScrollTopFab() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 360);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const onTop = useCallback(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

    return (
        <button
            onClick={onTop}
            aria-label="Scroll to top"
            className={[
                "fixed z-50 rounded-full border border-neutral-200 bg-white/90 backdrop-blur-sm shadow-lg",
                "h-11 w-11 grid place-items-center text-neutral-800 hover:bg-white transition",
                show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
            ].join(" ")}
            style={{
                right: "max(16px, env(safe-area-inset-right))",
                bottom: "max(16px, env(safe-area-inset-bottom))",
            }}
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 15l-6-6-6 6" />
            </svg>
        </button>
    );
}
