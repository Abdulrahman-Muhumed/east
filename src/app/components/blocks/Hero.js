// components/Hero.js
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Hero with full-bleed video background (fixed under header),
 * low-opacity video + black overlay, and your existing content/animations.
 */

const BRAND_ACCENT = "#ffd028";
const ACCENT_ORANGE = "#ff7e5f";
const ACCENT_CYAN = "#6fe7dd";

const images = ["/gum_img2.png", "/gum_img3.png", "/gum_img5.png"];
const WORDS = ["Pure", "Trusted", "Traceable", "Halal", "Premium"];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const btnRefs = useRef({});

  // Word cycle
  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 3000);
    return () => clearInterval(id);
  }, []);

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
      aria-label="Hero"
      className="
        relative isolate
        grid place-items-center
        min-h-full-screen
        pt-16 md:pt-40
      "
    >
      
      <VideoBackdrop />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
          {/* LEFT: Copy */}
          <div>
            <TitleCycler word={WORDS[wordIndex]} />
            <p className="mt-4 max-w-xl text-white/85 text-base leading-relaxed">
              Arabic Gum, redefined: clean sourcing, tight specs, and a finish your
              customers can trust.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                onMouseMove={onMagnet("primary")}
                onMouseLeave={offMagnet("primary")}
                className="relative inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 will-change-transform"
              >
                <span ref={(r) => (btnRefs.current["primary"] = r)} className="relative z-10">
                  Request a Sample
                </span>
                <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.25),transparent_40%),linear-gradient(90deg,#0b2a6b,#2463eb)] ring-1 ring-black/20" />
              </Link>

              <Link
                href="/products"
                onMouseMove={onMagnet("ghost")}
                onMouseLeave={offMagnet("ghost")}
                className="relative inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold text-white ring-1 ring-white/20 bg-white/10 backdrop-blur transition-all duration-200 will-change-transform"
              >
                <span ref={(r) => (btnRefs.current["ghost"] = r)} className="relative z-10">
                  View Grades
                </span>
                <span className="pointer-events-none absolute inset-0 rounded-2xl [mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] [mask-composite:exclude] p-[1px] bg-[conic-gradient(from_0deg,rgba(255,255,255,0.22),rgba(255,255,255,0)_30%,rgba(255,255,255,0.22)_60%,rgba(255,255,255,0)_100%)]" />
              </Link>
            </div>

            <ul className="mt-6 flex flex-wrap gap-4 text-xs text-white/70">
              <li className="px-3 py-1 rounded-full ring-1 ring-white/15 bg-white/5">Food & Beverage</li>
              <li className="px-3 py-1 rounded-full ring-1 ring-white/15 bg-white/5">Pharma</li>
              <li className="px-3 py-1 rounded-full ring-1 ring-white/15 bg-white/5">Cosmetics</li>
              <li className="px-3 py-1 rounded-full ring-1 ring-white/15 bg-white/5">Confectionery</li>
            </ul>
          </div>

          {/* RIGHT: Abstract Liquid Ring + Image Carousel */}
          <div className="relative">
            <div className="relative mx-auto aspect-square w-[88%] max-w-[520px] grid place-items-center">
              {/* Gooey background blobs (visual depth) */}
              <div className="absolute inset-[-6%]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: `${(i * 203) % 100}%`,
                      top: `${(i * 137) % 100}%`,
                      width: `${120 + (i % 3) * 46}px`,
                      height: `${120 + (i % 3) * 46}px`,
                      background:
                        i % 2
                          ? `radial-gradient(circle at 30% 30%, ${ACCENT_CYAN}, transparent 60%)`
                          : `radial-gradient(circle at 70% 70%, ${BRAND_ACCENT}, transparent 60%)`,
                      transform: `translate(-50%, -50%)`,
                      animation: `blob-${(i % 3) + 1} ${9 + i}s ease-in-out infinite`,
                      opacity: 0.18,
                    }}
                  />
                ))}
              </div>

              {/* Carousel image */}
              <div className="relative z-10 w-[95%] aspect-square overflow-hidden will-change-transform hover:scale-[1.02] transition-transform duration-1000 rounded-2xl ring-1 ring-white/10">
                <Image
                  key={imgIndex}
                  src={images[imgIndex]}
                  alt="Arabic Gum showcase"
                  fill
                  sizes="(max-width: 1024px) 80vw, 520px"
                  priority
                  className="object-cover animate-fade-in"
                />
                {/* Shine sweep */}
                <span className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)] bg-[linear-gradient(90deg,rgba(255,255,255,.0),rgba(255,255,255,.28),rgba(255,255,255,.0))] animate-shine" />
              </div>
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
        top: `-${headerH}px}`,                 // extend up behind header
        height: `calc(100% + ${headerH}px)`,   // keep full cover
      }}
    >
      <video
        className="h-full w-full object-cover"
        src="/vid1.mp4"
        playsInline
        autoPlay
        muted
        loop
        preload="metadata"
      />
      {/* optional darkener for readability */}
      <div className="absolute inset-0 bg-black/45" />
    </div>
  );
}


/* ——— Subcomponents ——— */
function TitleCycler({ word }) {
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
              animation: "word-flip-in 600ms ease",
            }}
          >
            Arabic&nbsp;Gum
          </span>
        </h1>
      </div>
      <div className="mt-3 h-[10px] w-44 rounded-full bg-gradient-to-r from-white/60 via-white/30 to-transparent blur-[6px]" />
    </div>
  );
}
