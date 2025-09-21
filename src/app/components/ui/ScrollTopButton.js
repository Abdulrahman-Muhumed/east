// app/components/ScrollTopButton.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollTopButton() {
    const [show, setShow] = useState(false);
    const [progress, setProgress] = useState(0); // 0..1
    const rafRef = useRef(null);

    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                const doc = document.documentElement;
                const winH = window.innerHeight;
                const max = Math.max(doc.scrollHeight - winH, 1);
                const y = window.scrollY || doc.scrollTop || 0;
                setShow(y > winH * 0.8);               // show after ~1 viewport
                setProgress(Math.min(1, Math.max(0, y / max)));
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    const circumference = 2 * Math.PI * 18; // r=18, viewBox 48x48
    const dash = circumference * progress;

    return (
        <div
            className={[
                "fixed z-50 right-4 md:right-6",
                "bottom-[calc(24px+env(safe-area-inset-bottom))]",
                "transition-all duration-300",
                show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
            ].join(" ")}
        >
            {/* subtle rotating glow behind the button */}
            <div className="absolute inset-0 -z-10 rounded-full blur-xl opacity-50 w-14 h-14 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 animate-spin-slow"
                style={{ background: "radial-gradient(40% 40% at 50% 50%, rgba(255,208,40,.35), transparent 70%)" }} />

            <button
                aria-label="Scroll to top"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={[
                    "group relative h-12 w-12 rounded-full",
                    "bg-slate-900/80 text-white backdrop-blur-md",
                    "border border-white/10 shadow-[0_10px_30px_-12px_rgba(0,0,0,.6)]",
                    "transition-transform duration-200",
                    "hover:-translate-y-0.5 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/60",
                ].join(" ")}
            >
                {/* progress ring (SVG) */}
                <svg className="absolute inset-0 m-auto" width="48" height="48" viewBox="0 0 48 48">
                    {/* track */}
                    <circle cx="24" cy="24" r="18" stroke="rgba(255,255,255,.18)" strokeWidth="3" fill="none" />
                    {/* progress */}
                    <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke="url(#grad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - dash}
                        transform="rotate(-90 24 24)"
                        className="transition-[stroke-dashoffset] duration-200 ease-out"
                    />
                    <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#ffd028" />
                            <stop offset="100%" stopColor="#6fe7dd" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* arrow */}
                <span
                    className="relative z-10 inline-flex items-center justify-center h-full w-full"
                    aria-hidden
                >
                    <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M12 19V5" />
                        <path d="M5 12l7-7 7 7" />
                    </svg>
                </span>

                {/* soft highlight on hover */}
                <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "radial-gradient(60% 60% at 50% 25%, rgba(255,255,255,.14), transparent 70%)" }} />
            </button>
        </div>
    );
}

/* slow spin utility (Tailwind-safe) */
// Add to globals.css if you don't already have it:
// .animate-spin-slow { animation: spin 6s linear infinite; }
