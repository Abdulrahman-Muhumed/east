"use client";

import React, { useEffect, useRef, useState } from "react";
import { brand } from "../../config/brand";

/**
 * HERO CINEMATIC (FIXED & UPGRADED)
 * - CSS animations moved to a standard <style> tag for universal compatibility
 * - Added functionality for rotating words in the title
 * - Maintains original props and features
 */
export default function HeroCinematic({
    title = "A legacy of",
    lastWord = "excellence.",
    subtitle = "Premium natural gum resins from East Africa — direct from origin, audit-ready quality, and precision logistics.",
    kicker = "EAST Hides & Investment Co, Ltd",
    hasActionbtn,
    ctas = [
        { label: "Browse Products", href: "/products", primary: true },
        { label: "Contact Sales", href: "/contact", primary: false },
    ],
    hasStats ,
    stats = [
        { label: "Years in Market", value: "10+" },
        { label: "Clients Served", value: "500+" },
        { label: "MT Traded", value: "3,000+" },
    ],
    primary = brand.colors.primary,
    accent = brand.colors.accent,
    bgImage, // optional; pass a path
    align = "center", // "center" | "left"
    className = "",
    rotatingWords = [],
}) {
    const alignCls = align === "left" ? "text-left items-start" : "text-center items-center";
    const reduced = usePrefersReducedMotion();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        if (reduced) return;
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [reduced]);

    const bgParallaxStyle = bgImage && !reduced ? { transform: `translate3d(0, ${scrollY * 0.5}px, 0)` } : {};
    return (
        <section
            className={`relative overflow-hidden bg-white text-neutral-900 ${className}`}
            aria-label="Hero"
        >
            {/* Background with parallax effect */}
            {bgImage && (
                <div
                    className="absolute inset-0 -z-20 transition-transform duration-100 ease-out"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        ...bgParallaxStyle,
                    }}
                />
            )}

            {/* CONTENT */}
            <div className={`relative container mx-auto px-4 sm:px-6 flex py-5 lg:pt-24 lg:pb-10 md:pt-24 md:pb-10 flex-col ${alignCls}`}>
                {/* Eyebrow */}
                {kicker ? (
                    <Reveal as="span" className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-widest uppercase text-neutral-700 border border-neutral-300 bg-white/70 backdrop-blur-sm" delay={0}>
                        {kicker}
                    </Reveal>
                ) : null}

                {/* Title */}
                <Reveal as="h1" delay={80} className="mt-6 leading-[1.04] font-black tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                    <span style={{ color: primary }}>{title}</span>{" "}
                    <span className="relative inline-block align-top">
                       <StaticWord word={lastWord} primary={primary} accent={accent} />
                    </span>
                </Reveal>

                {/* Subtitle */}
                {subtitle && (
                    <Reveal as="p" delay={140} className={`mt-5 max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} ${hasActionbtn ? "text-neutral-700" : "text-neutral-600"} text-base sm:text-lg`}>
                        {subtitle}
                    </Reveal>
                )}

                {/* CTAs */}
                {!hasActionbtn  ? (
                    <Reveal delay={200}>
                        <div className={`mt-9 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>
                            {ctas.map((c) => (
                                <a
                                    key={c.label}
                                    href={c.href || "#"}
                                    className={c.primary ? "BtnPrimaryClean" : "BtnGhostClean"}
                                    aria-label={c.label}
                                    style={{
                                        color: "#fff",
                                        background: c.primary
                                            ? `linear-gradient(90deg, ${primary} 0%, ${accent} 130%)`
                                            : `${primary}`,
                                    }}
                                >
                                    {c.label}
                                </a>
                            ))}
                        </div>
                    </Reveal>
                ) : null}

                {/* Glass stat cards */}
                {hasStats && stats?.length ? (
                    <Reveal delay={260}>
                        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full">
                            {stats.map((s, i) => (
                                <Reveal key={s.label} delay={280 + i * 60} variant="up">
                                    <GlassCard label={s.label} value={s.value} />
                                </Reveal>
                            ))}
                        </div>
                    </Reveal>
                ) : null}
                
            </div>

            {/* Styles */}
            <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(300%); }
        }
        .animate-shimmer { animation: shimmer 2.1s ease-in-out infinite; }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translate3d(0, 48px, 0) scale(0.95); }
          100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        .reveal { opacity: 0; will-change: transform, opacity; }
        .reveal.visible.fadeUp { animation: fadeUp 1.2s cubic-bezier(.2, .7, .2, 1) forwards; }
        .reveal.visible.fadeIn { animation: fadeIn 1s ease-out forwards; }
        
        .BtnPrimaryClean,
        .BtnGhostClean {
          padding: 0.8rem 1.2rem;
          border-radius: 1rem;
          font-weight: 700;
          transition: transform .18s ease, filter .18s ease, background .25s ease, box-shadow .25s ease;
          box-shadow: 0 12px 26px -22px rgba(0,0,0,.4);
          border: 1px solid rgba(255,255,255,0.22);
        }
        .BtnPrimaryClean:hover,
        .BtnGhostClean:hover {
          transform: translateY(-1px) scale(1.02);
          filter: brightness(1.05);
          box-shadow: 0 18px 44px -26px rgba(0,0,0,.45);
        }

        .fade-in-out-animation {
          animation: fadeInOut 3s linear infinite;
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateY(10px); }
          50% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
}


function Reveal({ as = "div", children, className = "", delay = 0, variant = "up" }) {
    const Tag = as;
    const ref = useRef(null);
    const [vis, setVis] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVis(true);
                    io.disconnect();
                }
            },
            { threshold: 0.12 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`reveal ${vis ? `visible ${variant === "up" ? "fadeUp" : "fadeIn"}` : ""} ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </Tag>
    );
}

/* ──────────────────────────────────────────────── */
/* Static Word Component                          */
/* ──────────────────────────────────────────────── */
function StaticWord({ word, primary, accent }) {
    return (
        <>
            <span
                className="inline-block text-transparent bg-clip-text"
                style={{
                    backgroundImage: `linear-gradient(90deg, ${primary}, ${accent})`,
                    WebkitTextStroke: "1px rgba(0,0,0,0.06)",
                }}
            >
                {word}
            </span>
            <span
                className="block h-[3px] mt-2 rounded-full overflow-hidden"
                style={{ background: `linear-gradient(90deg, ${primary}, ${accent})` }}
            >
                <span className="block h-full w-1/3 bg-white/55 animate-shimmer" />
            </span>
        </>
    );
}

/* ──────────────────────────────────────────────── */
/* Glass stat card                                 */
/* ──────────────────────────────────────────────── */
function GlassCard({ label, value }) {
    return (
        <div
            className="
        relative overflow-hidden rounded-3xl
        border border-white/40
        bg-white/35 backdrop-blur-md
        shadow-[0_20px_60px_-28px_rgba(0,0,0,0.35)]
        transition-transform duration-300
        hover:-translate-y-0.5
      "
        >
            <div className="px-6 py-6">
                <div className="text-3xl font-extrabold text-neutral-900">{value}</div>
                <div className="mt-1 text-[12px] font-medium uppercase tracking-[0.18em] text-neutral-600">{label}</div>
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
                <div className="absolute -top-1/2 left-1/2 h-[220%] w-[45%] -translate-x-1/2 -rotate-12 bg-white/10" />
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────── */
/* Reduced motion hook                              */
/* ──────────────────────────────────────────────── */
function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        const onChange = (e) => setReduced(e.matches);
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);
    return reduced;
}
