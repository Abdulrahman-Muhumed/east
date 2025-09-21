// app/page.js (or pages/index.js)
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ✅ Your existing hero block at the very top
import Hero from "../components/blocks/Hero";

/* ────────────────────────────────────────────────────────────
   Brand tokens
──────────────────────────────────────────────────────────── */
const BLUE = "#1a2336";
const YELLOW = "#ffd028";

const BRAND_ACCENT = "#ffd028";
const ACCENT_ORANGE = "#ff7e5f";
const ACCENT_CYAN = "#6fe7dd";

/* ────────────────────────────────────────────────────────────
   Data
──────────────────────────────────────────────────────────── */
const products = [
    {
        name: "Arabic Gum — Grade 1 (Hashab)",
        tagline: "Clean. Strong. Food-grade.",
        description: "Highest clarity and emulsifying power for F&B and pharma.",
        image:
            "https://sciencekitstore.com/image/thumbnails/19/04/GUMARAB-102477-1000x1000.png",
        spec: "COA/SDS • Food & Pharma",
    },
    {
        name: "Frankincense Resin",
        tagline: "Bright, citrus-amber.",
        description: "Premium Boswellia for fragrance, wellness, and ritual.",
        image:
            "https://primary.jwwb.nl/public/s/d/f/temp-ccyjrwfixmgsdsdqmxek/arabic-gum-emulcifier-wholesale-taschemind-gummybear.jpg?enable-io=true&enable=upscale&width=600",
        spec: "Boswellia • High Aroma",
    },
    {
        name: "Myrrh Resin",
        tagline: "Warm, balsamic.",
        description: "Classic depth for skincare, incense, and tinctures.",
        image:
            "https://sciencekitstore.com/image/thumbnails/19/04/GUMARAB-102477-1000x1000.png",
        spec: "Commiphora • Cosmetic",
    },
    {
        name: "Opoponax Resin",
        tagline: "Sweet myrrh.",
        description: "Smooth resin profile for perfumery and cones.",
        image:
            "https://loscavazostexas.com/wp-content/uploads/2025/03/Los-Cavazos-Arabic-Gum-Resin-1.jpg",
        spec: "Sweet Myrrh • Perfume",
    },
    {
        name: "Sandalwood Powder",
        tagline: "Creamy, woody.",
        description: "Finely milled powder for incense blends and skincare.",
        image:
            "https://primary.jwwb.nl/public/s/d/f/temp-ccyjrwfixmgsdsdqmxek/arabic-gum-emulcifier-wholesale-taschemind-gummybear.jpg?enable-io=true&enable=upscale&width=600",
        spec: "Milled • Incense",
    },
];

/* ────────────────────────────────────────────────────────────
   Tiny animation hook (no libs)
──────────────────────────────────────────────────────────── */
function useReveal({ once = true, threshold = 0.12 } = {}) {
    const ref = useRef(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const io = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setShown(true);
                    if (once) io.disconnect();
                } else if (!once) {
                    setShown(false);
                }
            },
            { threshold }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [once, threshold]);

    return { ref, shown };
}

/* Reusable reveal wrapper */
function Reveal({ children, variant = "fade-up", delay = 0, className = "" }) {
    const { ref, shown } = useReveal();
    const styles = useMemo(() => {
        const base = {
            transition:
                "transform 800ms cubic-bezier(.2,.7,.2,1), opacity 800ms, filter 800ms, clip-path 900ms",
            transitionDelay: `${delay}ms`,
            willChange: "transform, opacity, filter, clip-path",
        };

        const variants = {
            "fade-up": {
                from: { opacity: 0, transform: "translateY(18px) scale(.98)", filter: "blur(4px)" },
                to: { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
            },
            "fade-in": {
                from: { opacity: 0, transform: "scale(.98)", filter: "blur(4px)" },
                to: { opacity: 1, transform: "scale(1)", filter: "blur(0)" },
            },
            "slide-left": {
                from: { opacity: 0, transform: "translateX(24px)", filter: "blur(2px)" },
                to: { opacity: 1, transform: "translateX(0)", filter: "blur(0)" },
            },
            "slide-right": {
                from: { opacity: 0, transform: "translateX(-24px)", filter: "blur(2px)" },
                to: { opacity: 1, transform: "translateX(0)", filter: "blur(0)" },
            },
            "tilt-rise": {
                from: { opacity: 0, transform: "translateY(20px) rotateX(8deg) scale(.98)", transformOrigin: "50% 100%" },
                to: { opacity: 1, transform: "translateY(0) rotateX(0deg) scale(1)" },
            },
            "clip-reveal": {
                from: {
                    opacity: 0.001,
                    clipPath: "inset(16% 14% 16% 14% round 16px)",
                    transform: "translateY(10px)",
                },
                to: { opacity: 1, clipPath: "inset(0 0 0 0 round 16px)", transform: "translateY(0)" },
            },
            "zoom-glow": {
                from: { opacity: 0, transform: "scale(.96)", filter: "brightness(.9) blur(2px)" },
                to: { opacity: 1, transform: "scale(1)", filter: "brightness(1) blur(0)" },
            },
        };

        const v = variants[variant] || variants["fade-up"];
        return shown ? { ...base, ...v.to } : { ...base, ...v.from };
    }, [shown, variant, delay]);

    return (
        <div ref={ref} className={className} style={styles}>
            {children}
        </div>
    );
}

/* Subtle mouse tilt (for cards/images) */
function useMouseTilt(max = 8) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let hover = false;
        const enter = () => (hover = true);
        const leave = () => {
            hover = false;
            el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
        };
        const move = (e) => {
            if (!hover) return;
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

/* ────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────── */
export default function HomePage() {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-white text-slate-900">
            <Hero />

            {/* Commitment: header fades up, cards tilt-rise with stagger */}
            <Commitment />

            {/* Products: whole card clip-reveals; image has mouse tilt */}
            <FeaturedProducts products={products} />

            {/* Testimonials: alternating slide-in left/right */}
            <Testimonials />

            {/* Closing CTA: zoom-glow */}
            <ClosingCTA />

            {/* global keyframes (safe & minimal) */}
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
}

/* ────────────────────────────────────────────────────────────
   Sections
──────────────────────────────────────────────────────────── */
function Commitment() {
    return (
        <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
            {/* soft brand glows + faint grid */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10"
            >
                <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:48px_48px]" />
                <div className="absolute inset-0 opacity-40 [background:radial-gradient(900px_550px_at_15%_15%,rgba(36,99,235,.10),transparent_60%),radial-gradient(900px_550px_at_85%_85%,rgba(255,208,40,.12),transparent_60%)]" />
            </div>

            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <Reveal variant="fade-up">
                    <header className="mx-auto max-w-4xl text-center">
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                            Built on{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0b2a6b] via-[#2463eb] to-[#0ea5e9]">
                                Proof
                            </span>
                            , not promises
                        </h2>
                        <p className="mt-4 text-base sm:text-lg text-slate-600">
                            Direct origin, lab-verified, globally compliant. Short supply chain, long-term trust.
                        </p>
                    </header>
                </Reveal>

                {/* Trust metrics */}
                <Reveal variant="fade-in" delay={100}>
                    <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <Metric k="COA / Shipment" v="100%" note="Every lot documented" />
                        <Metric k="Traceability" v="End-to-end" note="Origin → Delivery" />
                        <Metric k="Lead Time" v="7–12 days" note="Predictable logistics" />
                    </ul>
                </Reveal>

                {/* Feature cards */}
                <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            title: "Sourced at Origin",
                            body: "Direct relationships with producers ensure authenticity and consistency.",
                            icon: CheckIcon,
                            points: ["Single-origin lots", "Lot-level traceability"],
                        },
                        {
                            title: "Lab Verified",
                            body: "COAs match independent labs; specs hold under scrutiny.",
                            icon: MicrolabIcon,
                            points: ["Micro & heavy metals", "Emulsification power"],
                        },
                        {
                            title: "Industry Ready",
                            body: "Aligned to ISO/GMP workflows with documentation on tap.",
                            icon: ShieldIcon,
                            points: ["COA / SDS ready", "Regulatory alignment"],
                        },
                    ].map((f, i) => (
                        <li key={i}>
                            <Reveal variant="tilt-rise" delay={150 + i * 120}>
                                <FeatureCardPro {...f} />
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </div>

            {/* local styles */}
            <style jsx>{`
        .card-hover {
          transition: transform 420ms cubic-bezier(.2,.7,.2,1), box-shadow 420ms, background 420ms;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 36px -18px rgba(2, 8, 23, .30);
        }
      `}</style>
        </section>
    );
}

function Metric({ k, v, note }) {
    return (
        <li className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur px-5 py-4 shadow-sm">
            <div className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">{k}</div>
            <div className="mt-1 text-xl font-bold text-slate-900">{v}</div>
            <div className="text-xs text-slate-500">{note}</div>
        </li>
    );
}

function FeatureCardPro({ title, body, icon: Icon, points = [] }) {
    return (
        <div className="card-hover relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* subtle corner accent */}
            <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-xl"
                style={{ background: "conic-gradient(from 140deg, #6fe7dd, #ffd028, transparent 60%)" }}
            />
            <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-600 ring-1 ring-yellow-400/30">
                    <Icon />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{body}</p>

                {points.length > 0 && (
                    <ul className="mt-4 space-y-2">
                        {points.map((p, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                <svg
                                    className="mt-[2px] h-4 w-4 text-emerald-600"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                                <span>{p}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-5">
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300"
                    >
                        Learn more
                        <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M5 12h14" />
                            <path d="M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────
   ✅ Featured Products (single card) + animations
──────────────────────────────────────────────────────────── */
function FeaturedProducts({ products }) {
    const [active, setActive] = useState(0);
    const p = products[active];

    // Keyboard support (does NOT scroll page)
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
                <Reveal variant="fade-up">
                    <header className="mb-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                            Featured{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-cyan-300 to-white">
                                Resins
                            </span>
                        </h2>
                        <p className="mx-auto mt-2 max-w-2xl text-slate-300 text-sm sm:text-base">
                            Tight specs. Clean aroma. Documentation ready.
                        </p>
                    </header>
                </Reveal>

                {/* Card: clip reveal */}
                <Reveal variant="clip-reveal" className="mx-auto">
                    <div className="mx-auto flex w-full max-w-5xl flex-col md:flex-row items-center justify-between gap-6 rounded-2xl bg-slate-900/60 ring-1 ring-white/10 backdrop-blur shadow-soft">
                        {/* LEFT: content */}
                        <div className="min-w-0 flex-1 p-4 md:p-8 flex flex-col">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="truncate text-white text-lg sm:text-xl font-bold leading-tight">
                                        {p.name}
                                    </h3>
                                    <p className="text-slate-300 text-xs sm:text-sm mt-0.5">{p.tagline}</p>
                                </div>
                                <span className="shrink-0 rounded-md bg-white/5 px-2 py-1 text-[10px] font-medium text-slate-200 ring-1 ring-white/10">
                                    {p.spec}
                                </span>
                            </div>

                            <p className="mt-2 line-clamp-3 text-slate-300/90 text-xs sm:text-sm">{p.description}</p>

                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {["Food & Beverage", "Pharma", "Cosmetics", "Incense/Perfume"].map((t) => (
                                    <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-200">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2">
                                <div className="rounded-md bg-white/5 ring-1 ring-white/10 px-2 py-1.5 text-[11px] text-slate-200 text-center">25kg bags</div>
                                <div className="rounded-md bg-white/5 ring-1 ring-white/10 px-2 py-1.5 text-[11px] text-slate-200 text-center">MOQ 500kg</div>
                                <div className="rounded-md bg-white/5 ring-1 ring-white/10 px-2 py-1.5 text-[11px] text-slate-200 text-center">Lead 7–12d</div>
                            </div>

                            <div className="mt-auto pt-3 flex flex-wrap items-center gap-2">
                                <Link
                                    href="/products"
                                    className="relative inline-flex items-center justify-center rounded-md px-3 py-1.5 text-[12px] font-semibold text-slate-900"
                                >
                                    <span className="relative z-10">View Details</span>
                                    <span className="absolute inset-0 rounded-md bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-200 shadow-[0_10px_24px_-12px_rgba(250,204,21,.6)]" />
                                </Link>

                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur transition hover:bg-white/10"
                                >
                                    Request Sample
                                </Link>

                                <div className="ml-auto flex items-center gap-2">
                                    <button
                                        onClick={() => setActive((i) => (i - 1 + products.length) % products.length)}
                                        className="rounded-md border border-white/10 bg-white/5 p-1.5 text-white hover:bg-white/10"
                                        aria-label="Previous product"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setActive((i) => (i + 1) % products.length)}
                                        className="rounded-md border border-white/10 bg-white/5 p-1.5 text-white hover:bg-white/10"
                                        aria-label="Next product"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: image with mouse tilt */}
                        <div className="shrink-0 p-3">
                            <div
                                ref={tiltRef}
                                className="relative overflow-hidden rounded-xl ring-1 ring-white/10 shadow-[0_12px_30px_-12px_rgba(0,0,0,.6)] transition-transform duration-200"
                                style={{ transform: "perspective(900px)" }}
                            >
                                <Image
                                    key={p.image + active}
                                    src={p.image}
                                    alt={p.name}
                                    width={350}
                                    height={200}
                                    className="object-contain"
                                    unoptimized
                                />
                                <div className="pointer-events-none absolute inset-0 translate-x-[-120%] mix-blend-screen bg-[linear-gradient(100deg,transparent,rgba(255,255,255,.22),transparent)] animate-shine" />
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ────────────────────────────────────────────────────────────
   Other sections + animations
──────────────────────────────────────────────────────────── */
function Testimonials() {
    return (
        <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
            <div
                className="pointer-events-none absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-[80vw] h-40 blur-[60px] opacity-15"
                style={{ background: `radial-gradient(600px circle at 50% 0%, ${YELLOW}, transparent 45%)` }}
            />
            <div className="mx-auto max-w-7xl">
                <Reveal variant="fade-up">
                    <header className="text-center">
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-black">Clients, on the record</h2>
                        <p className="mx-auto mt-4 max-w-3xl text-slate-500">
                            Quiet consistency wins. A few words from teams who ship with us.
                        </p>
                    </header>
                </Reveal>

                <ul className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((t, i) => (
                        <li key={i}>
                            <Reveal variant={i % 2 === 0 ? "slide-right" : "slide-left"} delay={i * 80}>
                                <TestimonialCard {...t} />
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function ClosingCTA() {
    return (
        <section className="relative overflow-hidden py-20 sm:py-20 mb-5 px-4 sm:px-6 lg:px-8 bg-[#1a2336]">
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage:
                        "radial-gradient(600px 400px at 20% 20%, rgba(37,99,235,.25), transparent), radial-gradient(600px 400px at 80% 80%, rgba(252,211,77,.25), transparent)",
                }}
            />
            <div className="mx-auto max-w-7xl relative">
                <Reveal variant="zoom-glow">
                    <div className="grid gap-8 md:grid-cols-2 items-center">
                        <div>
                            <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                                Need consistent, certified Arabic Gum & resins?
                            </h3>
                            <p className="mt-3 text-slate-300">
                                Ask for grade sheets, COA/SDS, and sample kits. We’ll match specs to your process.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 md:justify-end">
                            <Link
                                href="/contact"
                                className="relative inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold text-slate-900"
                            >
                                <span className="relative z-10">Contact Sales</span>
                                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-200 shadow-[0_10px_30px_-12px_rgba(250,204,21,.6)]" />
                            </Link>
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white backdrop-blur transition hover:bg-white/10"
                            >
                                Browse Products
                            </Link>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ────────────────────────────────────────────────────────────
   UI Bits
──────────────────────────────────────────────────────────── */
function FeatureCard({ title, body, icon: Icon }) {
    return (
        <div className="group relative overflow-hidden rounded-3xl bg-slate-50 p-6 shadow-xl ring-1 ring-slate-200 transition-all duration-300 hover:shadow-2xl">
            <div
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-20 blur-xl transition-transform duration-300 group-hover:translate-x-4 group-hover:-translate-y-2"
                style={{
                    background: `conic-gradient(from 140deg, ${ACCENT_CYAN}, ${BRAND_ACCENT}, transparent 60%)`,
                }}
            />
            <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-500 ring-1 ring-yellow-400/30">
                    <Icon />
                </div>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-slate-600 text-sm">{body}</p>
            </div>
        </div>
    );
}

const testimonials = [
    {
        quote:
            "Arabic Gum quality is relentlessly stable. COAs match our lab, batch after batch.",
        who: "Head of QA, Food Ingredients Inc.",
        avatar: "https://cdn-icons-png.flaticon.com/512/147/147142.png",
    },
    {
        quote: "Documentation is tight; logistics were spot-on. Zero drama. Ideal vendor.",
        who: "Ops Lead, Pharma Solutions",
        avatar: "https://cdn-icons-png.flaticon.com/512/147/147142.png",
    },
    {
        quote:
            "Frankincense & Myrrh quality elevated our line. Customers noticed—so did sales.",
        who: "Founder, Artisan Cosmetics",
        avatar: "https://cdn-icons-png.flaticon.com/512/147/147142.png",
    },
];

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

/* ────────────────────────────────────────────────────────────
   Icons
──────────────────────────────────────────────────────────── */
function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}
function MicrolabIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 3v6a6 6 0 1 0 6 0V3" />
            <path d="M9 3h6" />
        </svg>
    );
}
function ShieldIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10z" />
        </svg>
    );
}
function ChevronLeft({ className = "h-5 w-5" }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
        </svg>
    );
}
function ChevronRight({ className = "h-5 w-5" }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5l7 7-7 7" />
        </svg>
    );
}
