"use client";

import React, { useEffect, useRef, useState } from "react";
import { Link } from "../../../../../i18n/navigation";
import Image from "next/image";
import { Building, Briefcase, DollarSign, MapPin, EyeIcon, StarIcon, TargetIcon, Dna } from "lucide-react";
import HeroCinematic from "../../../components/blocks/Hero2";
import { brand } from "../../../config/brand";
import { useTranslations } from "next-intl";

/**
 * EAST palette
 */
const BLUE = brand.colors.primary;
const YELLOW = brand.colors.accent;

/**
 * UTIL: clamp
 */
const clamp = (n, a, b) => Math.min(Math.max(n, a), b);

/**
 * Hook: section progress (0 → 1)
 */

function useSectionProgress(threshold = 0.15) {
    const ref = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const ratio = entry.intersectionRatio;
                setProgress(ratio);
            },
            { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, progress };
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

const Plane = ({ className = "", style = {}, children }) => (
    <div className={`absolute ${className}`} style={style}>
        {children}
    </div>
);

/**
 * Directional entrance container
 */
const Enter = ({ progress, children, direction = "up", delay = 0 }) => {
    const t = clamp((progress - delay) / (1 - delay || 1), 0, 1);
    const ease = easeOutCubic(t);
    const base = 40;
    const translate =
        direction === "up"
            ? `translate3d(0, ${base * (1 - ease)}px, 0)`
            : direction === "down"
                ? `translate3d(0, ${-base * (1 - ease)}px, 0)`
                : direction === "left"
                    ? `translate3d(${base * (1 - ease)}px, 0, 0)`
                    : `translate3d(${-base * (1 - ease)}px, 0, 0)`;

    const style = {
        transform: translate,
        opacity: ease,
        transition: "transform 0.6s cubic-bezier(.2,.7,.2,1), opacity 0.6s cubic-bezier(.2,.7,.2,1)",
        willChange: "transform, opacity",
    };

    return <div style={style}>{children}</div>;
};

/**
 * Magnetic / glossy CTA
 */
const CTA = ({ href, children, primary = false }) => {
    const base =
        "relative inline-flex items-center justify-center rounded-2xl px-5 py-2.5 font-semibold transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10";
    const secondary =
        "border border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300";
    const primaryCls = "text-neutral-950";
    return primary ? (
        <Link href={href} className={`${base} ${primaryCls}`}>
            <span className="relative z-10">{children}</span>
            <span
                className="absolute inset-0 rounded-2xl shadow-[0_10px_30px_-12px_rgba(250,204,21,.55)]"
                style={{
                    background:
                        "linear-gradient(90deg, rgba(255,208,40,1) 0%, rgba(255,228,110,1) 100%)",
                }}
            />
            <span className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(60%_50%_at_50%_120%,#0000_40%,#000_100%)] bg-white/10" />
        </Link>
    ) : (
        <Link href={href} className={`${base} ${secondary}`}>
            {children}
        </Link>
    );
};

/**
 * 3D Tile
 */
const Tile3D = ({ icon, title, children, hue = 48 }) => {
    return (
        <div className="group relative rounded-3xl border border-neutral-200 bg-white p-8 [transform-style:preserve-3d] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl overflow-hidden">
            <div
                className="pointer-events-none absolute -inset-20 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-40"
                style={{
                    background: `radial-gradient(circle at 50% 50%, hsl(${hue} 100% 85%) 0%, transparent 70%)`,
                }}
            />
            <div className="relative z-10">
                <div
                    className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full text-neutral-900 ring-4 ring-neutral-100/60"
                    style={{ backgroundColor: `hsl(${hue} 100% 85%)` }}
                >
                    {icon}
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">{title}</h3>
                <div className="text-sm text-neutral-600">{children}</div>
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute -top-1/2 left-1/2 h-[200%] w-[40%] -translate-x-1/2 rotate-12 bg-white/5" />
            </div>
        </div>
    );
};

const Badge = ({ text }) => (
    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ring-1 ring-inset bg-yellow-50 ring-yellow-100 text-neutral-900">
        {text}
    </span>
);

/**
 * ABOUT PAGE — translated
 */
export default function About2050() {
    const t = useTranslations("about");

    return (
        <div className="min-h-screen font-sans text-slate-900 relative antialiased">
            {/* HERO */}
            <HeroCinematic
                bgImage="/hero2_img1.png"
                kicker={t("hero.kicker")}
                title={t("hero.title")}
                lastWord={t("hero.lastWord")}
                hasStats={true}
                subtitle={t("hero.subtitle")}
            />

            {/* ORIGIN */}
            <SectionOrigin />

            {/* QUALITY */}
            <SectionQuality />

            {/* LOGISTICS */}
            <SectionLogistics />

            {/* PRINCIPLES */}
            <SectionPrinciples />

            {/* COMPANY SNAPSHOT */}
            <SectionCompany />

            {/* CTA */}
            <SectionCTA />
        </div>
    );
}

/* ----------------------------- SECTIONS ----------------------------- */

const SectionOrigin = () => {
    const t = useTranslations("about.origin");
    const { ref, progress } = useSectionProgress();
    return (
        <section ref={ref} className="relative py-24 sm:py-32 bg-neutral-50 overflow-hidden">
            <div className="pointer-events-none absolute inset-0">

                <Plane depth={-2} className="left-[5%] top-[10%] w-24 h-24 opacity-30">
                    <Image src="/east_image2.png" alt="" loading="lazy" fill className="w-full h-full object-contain" />
                </Plane>

            </div>

            <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
                <Enter progress={progress} direction="right">
                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-neutral-200">
                        <Image src="/about/about1.png" alt="East African origin landscapes" loading="lazy" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                    </div>
                </Enter>

                <Enter progress={progress} direction="left" delay={0.12}>
                    <div>
                        <Badge text={t("badge")} />
                        <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">{t("title")}</h2>
                        <p className="mt-4 text-neutral-600">{t("body")}</p>
                    </div>
                </Enter>
            </div>
        </section>
    );
};

const SectionQuality = () => {
    const t = useTranslations("about.quality");
    const { ref, progress } = useSectionProgress();
    return (
        <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
            <div className="pointer-events-none absolute inset-0">

                <Plane depth={-2} className="right-0 top-0 w-64 h-64 opacity-30">
                    <img src="/about/about5.png" alt="" className="w-full h-full object-contain" />
                </Plane>

            </div>

            <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
                <Enter progress={progress} direction="right">
                    <div>
                        <Badge text={t("badge")} />
                        <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">{t("title")}</h2>
                        <p className="mt-4 text-neutral-600">{t("body")}</p>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Tile3D hue={210} icon={<Dna />} title={t("tiles.labChecks.title")}>
                                {t("tiles.labChecks.body")}
                            </Tile3D>
                            <Tile3D hue={160} icon={<EyeIcon />} title={t("tiles.traceability.title")}>
                                {t("tiles.traceability.body")}
                            </Tile3D>
                            <Tile3D hue={48} icon={<TargetIcon />} title={t("tiles.consistency.title")}>
                                {t("tiles.consistency.body")}
                            </Tile3D>
                        </div>
                    </div>
                </Enter>

                <Enter progress={progress} direction="left" delay={0.12}>
                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-neutral-200">
                        <Image src="/about/about2.png" alt="Quality control and lab verification" loading="lazy" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                    </div>
                </Enter>
            </div>
        </section>
    );
};

const SectionLogistics = () => {
    const t = useTranslations("about.logistics");
    const { ref, progress } = useSectionProgress();
    return (
        <section ref={ref} className="relative py-24 sm:py-32 bg-neutral-50 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
                <Enter progress={progress} direction="right">
                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-neutral-200">
                        <Image src="/about/about3.png" alt="Warehouse and export operations" loading="lazy" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/15 to-transparent" />
                    </div>
                </Enter>

                <Enter progress={progress} direction="left" delay={0.12}>
                    <div>
                        <Badge text={t("badge")} />
                        <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">{t("title")}</h2>
                        <p className="mt-4 text-neutral-600">{t("body")}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-neutral-700 mt-5">
                            <LogiItem icon="file" text={t("items.packingSpecSheets")} />
                            <LogiItem icon="truck" text={t("items.incoterms")} />
                            <LogiItem icon="ship" text={t("items.freightCoordination")} />
                        </div>
                    </div>
                </Enter>
            </div>
        </section>
    );
};

const LogiItem = ({ icon, text }) => {
    const iconMap = {
        file: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
            </svg>
        ),
        truck: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck">
                <path d="M14 18v-6h-4" />
                <path d="M22 12V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z" />
                <path d="M16 18H8a2 2 0 0 0-2 2v2" />
                <circle cx="7" cy="18" r="2" />
                <circle cx="17" cy="18" r="2" />
            </svg>
        ),
        ship: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ship">
                <path d="M2 20a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2" />
                <path d="M12 10a6 6 0 0 0-6 6" />
                <path d="M12 10a6 6 0 0 1 6 6" />
                <path d="M12 10V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7" />
                <path d="M12 10V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7" />
            </svg>
        ),
    };

    const colorMap = {
        file: "text-blue-500/80 group-hover:text-blue-500",
        truck: "text-green-500/80 group-hover:text-green-500",
        ship: "text-purple-500/80 group-hover:text-purple-500",
    };

    return (
        <div
            className="group rounded-2xl border border-neutral-200/50 bg-white/50 p-4 
                 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.1)] transition-all duration-300
                 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)] hover:bg-white
                 flex items-center gap-3"
        >
            <span className={`${colorMap[icon]} transition-colors duration-300`}>{iconMap[icon]}</span>
            <span className="font-medium text-neutral-800">{text}</span>
        </div>
    );
};

const SectionPrinciples = () => {
    const t = useTranslations("about.principles");
    const { ref, progress } = useSectionProgress();
    const values = t.raw("values.list");
    return (
        <section ref={ref} className="relative py-20 sm:py-24 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6">
                <Enter progress={progress} direction="up">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center">
                        {t("title")}
                    </h2>
                </Enter>

                <div className="mt-10 grid gap-6 md:grid-cols-3 items-stretch">
                    <Enter progress={progress} direction="right" delay={0.05}>
                        <Tile3D hue={48} icon={<TargetIcon />} title={t("mission.title")}>
                            {t("mission.body")}
                        </Tile3D>
                    </Enter>
                    <Enter progress={progress} direction="up" delay={0.12}>
                        <Tile3D hue={210} icon={<EyeIcon />} title={t("vision.title")}>
                            {t("vision.body")}
                        </Tile3D>
                    </Enter>
                    <Enter progress={progress} direction="left" delay={0.18}>
                        <Tile3D hue={160} icon={<StarIcon />} title={t("values.title")}>
                            <ul className="list-disc pl-4 space-y-1.5 text-neutral-600 text-left">
                                {Array.isArray(values) &&
                                    values.map((v, i) => (
                                        <li key={i}>{v}</li>
                                    ))}
                            </ul>
                        </Tile3D>
                    </Enter>
                </div>
            </div>
        </section>
    );
};

const SectionCompany = () => {
    const t = useTranslations("about.company");
    const { ref, progress } = useSectionProgress();
    return (
        <div
            ref={ref}
            className="relative  min-h-screen flex items-center justify-center font-sans p-4"
        >

            <Image
                src="/about/about_bg.jpg"        // use WebP/AVIF if possible
                alt=""                             // decorative
                fill
                priority={false}
                fetchPriority="low"
                quality={60}
                placeholder="blur"
                blurDataURL="/about/about_bg_blur.jpg" // tiny blur thumb (<=1–2KB)
                sizes="100vw"
                className="pointer-events-none select-none object-cover will-change-transform [transform:translateZ(0)] opacity-60"
            />
            <section className="relative py-20 sm:py-24 bg-white/70 overflow-hidden rounded-3xl p-8 shadow-xl max-w-7xl mx-auto">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
                        {/* Left: Description */}
                        <div className="md:w-1/2 text-left">
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800">
                                {t("title")}
                            </h2>
                            <p className="mt-4 text-lg text-neutral-600 leading-relaxed">
                                {t("body")}
                            </p>
                        </div>

                        {/* Right: Info Cards */}
                        <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InfoCard
                                label={t("cards.ceo.label")}
                                value={t("cards.ceo.value")}
                                icon={<Briefcase size={24} />}
                                accent="#3b82f6"
                            />
                            <InfoCard
                                label={t("cards.business.label")}
                                value={t("cards.business.value")}
                                icon={<DollarSign size={24} />}
                                accent="#22c55e"
                            />
                            <InfoCard
                                label={t("cards.established.label")}
                                value={t("cards.established.value")}
                                icon={<Building size={24} />}
                                accent="#ef4444"
                            />
                            <InfoCard
                                label={t("cards.hq.label")}
                                value={t("cards.hq.value")}
                                icon={<MapPin size={24} />}
                                accent="#f59e0b"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const SectionCTA = () => {
    const t = useTranslations("about");
    const { ref, progress } = useSectionProgress();
    return (
        <section ref={ref} className="relative overflow-hidden py-16 sm:py-20">
            <div className="relative container mx-auto px-4 sm:px-6">
                <Enter progress={progress} direction="up">
                    <div className="rounded-3xl border border-neutral-200 bg-white/70 p-8 sm:p-10 shadow-lg">
                        <div className="grid gap-6 md:grid-cols-2 md:items-center">
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: BLUE }}>
                                    {t("cta.title")}
                                </h3>
                                <p className="mt-2 text-neutral-600">{t("cta.body")}</p>
                            </div>
                            <div className="flex flex-wrap gap-3 md:justify-end">
                                <CTA href="/contact" primary>
                                    {t("buttons.contactSales")}
                                </CTA>
                                <CTA href="/products">{t("buttons.browseProducts")}</CTA>
                            </div>
                        </div>
                    </div>
                </Enter>
            </div>
        </section>
    );
};

/* ----------------------------- BITS ----------------------------- */

const InfoCard = ({ icon, label, value, accent }) => (
    <div
        className="group relative overflow-hidden rounded-2xl border border-neutral-200/50 bg-white/30 
               p-5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-0.5
               hover:shadow-[0_12px_36px_-18px_rgba(0,0,0,0.2)] flex flex-col items-start"
    >
        <div
            className="pointer-events-none absolute -inset-24 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
            style={{ background: `radial-gradient(600px 200px at 20% 0%, ${accent}66 0%, transparent 60%)` }}
        />
        <div
            className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl ring-1 ring-white/50
                 transition-all duration-300 group-hover:scale-105"
            style={{
                background: accent,
                boxShadow: `0 10px 20px -8px ${accent}88`,
                color: "white",
            }}
        >
            {icon}
        </div>
        <div className="mt-4 min-w-0">
            <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-600">{label}</div>
            <div className="mt-1 text-base font-semibold text-neutral-900">{value}</div>
        </div>
    </div>
);
