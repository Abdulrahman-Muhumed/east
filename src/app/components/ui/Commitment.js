"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/* ─ Motion */
const rise = {
    hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0)", transition: { duration: .7, ease: [0.2, 0.7, 0.2, 1] } }
};
const scaleIn = {
    hidden: { opacity: 0, scale: 0.94 },
    show: { opacity: 1, scale: 1, transition: { duration: .55, ease: "easeOut" } }
};
const chain = (gap = .08) => ({ hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: gap, delayChildren: .08 } } });

export default function Commitment() {
    const t = useTranslations("home");

    const metrics = [
        { k: t("commitment.metrics.coa.k"), v: t("commitment.metrics.coa.v"), note: t("commitment.metrics.coa.note") },
        { k: t("commitment.metrics.trace.k"), v: t("commitment.metrics.trace.v"), note: t("commitment.metrics.trace.note") },
        { k: t("commitment.metrics.lead.k"), v: t("commitment.metrics.lead.v"), note: t("commitment.metrics.lead.note") }
    ];

    const features = [
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
    ];

    return (
        <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
            {/* subtle grid + brand auras */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:48px_48px]" />
                <div className="absolute inset-0 opacity-35 [background:radial-gradient(900px_550px_at_15%_15%,rgba(36,99,235,.10),transparent_60%),radial-gradient(900px_550px_at_85%_85%,rgba(255,208,40,.12),transparent_60%)]" />
            </div>

            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <motion.header
                    variants={rise}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mx-auto max-w-4xl text-center"
                >
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                        {t("commitment.titleA")}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0b2a6b] via-[#2463eb] to-[#0ea5e9]">
                            {t("commitment.titleB")}
                        </span>
                        {t("commitment.titleC")}
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-slate-600">{t("commitment.desc")}</p>
                    <ul className="mt-6 flex flex-wrap gap-4 text-xs text-white justify-center">
                        <li className="px-3 hover:scale-105 duration-200 py-1 shadow-2xl rounded-full ring-1 ring-white/15 bg-[#0b2a6b]/60">Food & Beverage</li>
                        <li className="px-3 hover:scale-105 duration-200 py-1 rounded-full ring-1 ring-white/15 bg-[#0b2a6b]/60">Pharma</li>
                        <li className="px-3 hover:scale-105 duration-200 py-1 rounded-full ring-1 ring-white/15 bg-[#0b2a6b]/60">Cosmetics</li>
                    </ul>
                </motion.header>

                {/* Fused cards: feature + metrics inside */}
                <motion.ul
                    variants={chain(.1)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {features.map((f, i) => (
                        <motion.li key={i} variants={scaleIn}>
                            <FusionCard feature={f} metrics={metrics} i={i} />
                        </motion.li>
                    ))}
                </motion.ul>
            </div>

            <style jsx>{`
        @keyframes shine { 0% { transform: translateX(-120%) } 100% { transform: translateX(120%) } }
      `}</style>
        </section>
    );
}

/* ────────────────────────────────────────────────────────────
   FusionCard — one professional card combining everything
──────────────────────────────────────────────────────────── */
function FusionCard({ feature, metrics, i }) {
    const Icon = feature.icon ?? (() => null);

    return (
        <div
            className={[
                "group relative rounded-[24px] p-[1px] hover:scale-105 duration-200",
                "bg-[conic-gradient(from_140deg,rgba(111,231,221,.7),rgba(255,208,40,.7),rgba(36,99,235,.65),transparent_40%)]"
            ].join(" ")}
            style={{ boxShadow: "0 18px 48px -22px rgba(0,0,0,.35)" }}
        >
            {/* inner glass panel */}
            <div className="relative rounded-[23px] bg-white/80 backdrop-blur p-6 ring-1 ring-slate-900/10">
                {/* soft highlight sweep on hover */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,.5),transparent)] opacity-0 group-hover:opacity-100"
                    style={{ animation: "shine 1.8s ease-in-out infinite" }}
                />

                {/* icon + title */}
                <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/15 text-amber-600 ring-1 ring-amber-300/40">
                        <Icon />
                    </div>
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-900">{feature.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{feature.body}</p>
                    </div>
                </div>

                {/* metrics ribbon (inside card) */}
                <div className="mt-5 grid grid-cols-3 gap-3">
                   
                </div>

                {/* bullet points */}
                {Array.isArray(feature.points) && feature.points.length > 0 && (
                    <ul className="mt-5 space-y-2">
                        {feature.points.map((p, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                <svg className="mt-[2px] h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                                <span>{p}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

/* ─ Icons (use your own if already defined globally) */
function CheckIcon() {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>;
}
function MicrolabIcon() {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3v6a6 6 0 1 0 6 0V3" /><path d="M9 3h6" /></svg>;
}
function ShieldIcon() {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10z" /></svg>;
}
