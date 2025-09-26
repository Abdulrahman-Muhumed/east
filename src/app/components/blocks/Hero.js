// components/Hero.js
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

/**
 * Hero with full-bleed video background (fixed under header),
 * low-opacity video + black overlay, and your existing content/animations.
 */

const BRAND_ACCENT = "#1a2336";
const ACCENT_ORANGE = "#ffd028";
const ACCENT_CYAN = "#6fe7dd";

const images = ["/hero_bg4.png", "/hero_bg4.png", "/hero_bg4.png"];

export default function Hero() {
    const t = useTranslations("home.hero");

    const words = t.raw("words") || ["Pure", "Trusted", "Traceable", "Halal", "Premium"];
    const industries = t.raw("industries") || ["Food & Beverage", "Pharma", "Cosmetics", "Confectionery"];
    const trailing = t("titleTrailing");
    const subtitle = t("subtitle");
    const cta = t("cta");
    const imageAlt = t("imageAlt");
    const aria = t("aria");

    const [wordIndex, setWordIndex] = useState(0);
    const [imgIndex, setImgIndex] = useState(0);
    const btnRefs = useRef({});

    // Word cycle
    useEffect(() => {
        const id = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 3000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [words.length]);

    // Image carousel
    useEffect(() => {
        const id = setInterval(() => setImgIndex((i) => (i + 1) % images.length), 3500);
        return () => clearInterval(id);
    }, []);

    // Magnetic buttons
    const onMagnet = (key) => (e) => {
        const btn = btnRefs.current[key];
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    };
    const offMagnet = (key) => () => {
        const btn = btnRefs.current[key];
        if (btn) btn.style.transform = "translate(0,0)";
    };

    return (
        <section
            aria-label={aria}
            className="
                relative isolate
                grid place-items-center
                lg:min-h-[100dvh] md:min-h-screen
                pt-16 md:pt-20
            "
        >
            <VideoBackdrop />

            {/* CONTENT */}
            <div className="relative z-10 max-w-7xl w-full px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
                    {/* LEFT: Copy */}
                    <div>
                        <TitleCycler word={words[wordIndex]} trailing={trailing} />
                        <p className="mt-4 max-w-xl text-white/85 text-base leading-relaxed">
                            {subtitle}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link
                                href="/contact"
                                onMouseMove={onMagnet("primary")}
                                onMouseLeave={offMagnet("primary")}
                                className="relative inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 will-change-transform"
                            >
                                <span
                                    ref={(r) => (btnRefs.current["primary"] = r)}
                                    className="relative z-10"
                                >
                                    {cta}
                                </span>
                                <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.25),transparent_40%),linear-gradient(90deg,#0b2a6b,#2463eb)] ring-1 ring-black/20" />
                            </Link>
                        </div>

                        <ul className="mt-6 flex flex-wrap gap-4 text-xs text-black">
                            {industries.map((label) => (
                                <li
                                    key={label}
                                    className="px-3 hover:scale-105 duration-200 py-1 shadow-2xl rounded-full ring-1 ring-white/15 bg-white/60"
                                >
                                    {label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* RIGHT: Abstract Liquid Ring + Image Carousel */}
                    <div className="relative">
                        {/* Carousel image */}
                        <div className="relative z-10 w-[80%] aspect-square overflow-hidden hover:scale-[1.02] transition-transform duration-1000">
                            <Image
                                key={imgIndex}
                                src={images[imgIndex]}
                                alt={imageAlt}
                                fill
                                sizes="(max-width: 1024px) 80vw, 520px"
                                priority
                                className="object-fill animate-fade-in"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ── Fixed video background (full page top, behind header) ───────────── */
function VideoBackdrop() {
    const ref = useRef(null);
    const [headerH, setHeaderH] = useState(72); // fallback if not found

    useEffect(() => {
        // finds your <header class="sticky top-0 ...">
        const sticky = document.querySelector("header.sticky");
        if (sticky) {
            const h = sticky.getBoundingClientRect().height || 72;
            setHeaderH(h);
        }
    }, []);

    return (
        <div
            ref={ref}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -z-10 overflow-visible"
            style={{
                top: `-${headerH}px`,
                height: `calc(100% + ${headerH}px)`
            }}
        >
            <video
                className="h-full w-full object-fill"
                src="/vid1.mp4"
                playsInline
                autoPlay
                muted
                loop
                preload="metadata"
            />
            {/* optional darkener for readability */}
            <div className="absolute inset-0 bg-black/60" />
        </div>
    );
}

/* ——— Subcomponents ——— */
function TitleCycler({ word, trailing }) {
    return (
        <div className="relative">
            <div className="inline-flex items-baseline gap-3">
                <h1
                    className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight text-white"
                    style={{ textWrap: "balance" }}
                >
                    {word}{" "}
                    <span
                        className="inline-block align-top text-transparent bg-clip-text"
                        style={{
                            backgroundImage: `linear-gradient(90deg, ${ACCENT_ORANGE}, ${BRAND_ACCENT}, ${ACCENT_CYAN})`,
                            animation: "word-flip-in 600ms ease"
                        }}
                    >
                        {trailing}
                    </span>
                </h1>
            </div>
            <div className="mt-3 h-[10px] w-44 rounded-full bg-gradient-to-r from-white/60 via-white/30 to-transparent blur-[6px]" />
        </div>
    );
}
