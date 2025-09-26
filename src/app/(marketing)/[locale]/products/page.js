"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "../../../../../i18n/navigation"; // Hoggaan-style wrapper
import { motion, AnimatePresence } from "framer-motion";
import Hero from "../../../components/blocks/Hero2";
import { listProducts } from "../../../data/products";
import { brand } from "../../../config/brand";
import { useTranslations } from "next-intl";
// ───────────────────────────────────────────────────────────────
// Brand
// ───────────────────────────────────────────────────────────────
const PRIMARY = brand.colors.primary; // EAST navy
const ACCENT = brand.colors.accent; // EAST yellow

// ───────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────
export default function ProductsPage() {
    const allProducts = useMemo(() => {
        try {
            const arr = listProducts?.() || [];
            return Array.isArray(arr) ? arr : [];
        } catch {
            return [];
        }
    }, []);

    // Loading indicator for list (skeletons)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const id = setTimeout(() => setLoading(false), 450);
        return () => clearTimeout(id);
    }, []);

    // Filters (controlled)
    const [q, setQ] = useState("");
    const [category, setCategory] = useState("All");
    const [originsOpen, setOriginsOpen] = useState(false);
    const [originFilters, setOriginFilters] = useState([]);
    const [sort, setSort] = useState("alpha");
    const [view, setView] = useState("grid"); // "grid" | "table"

    // Other UI state (kept as-is)
    const [quickProduct, setQuickProduct] = useState(null);
    const [rfqProduct, setRfqProduct] = useState(null);
    const [compare, setCompare] = useState([]); // array of product ids

    const categories = useMemo(
        () => ["All", ...uniq(allProducts.map((p) => p.category))],
        [allProducts]
    );
    const origins = useMemo(
        () => uniq(allProducts.flatMap((p) => p.originCountries || [])),
        [allProducts]
    );

    const filtered = useMemo(() => {
        let list = [...allProducts];

        // search
        const needle = q.trim().toLowerCase();
        if (needle) {
            list = list.filter((p) =>
                [p.name, p.summary, p.hsCode, p.slug]
                    .filter(Boolean)
                    .some((txt) => String(txt).toLowerCase().includes(needle))
            );
        }

        // category
        if (category !== "All") {
            list = list.filter((p) => p.category === category);
        }

        // origins
        if (originFilters.length > 0) {
            const set = new Set(originFilters);
            list = list.filter((p) => (p.originCountries || []).some((c) => set.has(c)));
        }

        // sort
        list.sort((a, b) => {
            if (sort === "alpha") return (a.name ?? "").localeCompare(b.name ?? "");
            if (sort === "moq") return (a.moqKg ?? Number.MAX_SAFE_INTEGER) - (b.moqKg ?? Number.MAX_SAFE_INTEGER);
            if (sort === "lead") return (a.leadTimeDays ?? Number.MAX_SAFE_INTEGER) - (b.leadTimeDays ?? Number.MAX_SAFE_INTEGER);
            return 0;
        });

        return list;
    }, [allProducts, q, category, originFilters, sort]);

    const toggleCompare = (id) => {
        setCompare((prev) => {
            if (prev.includes(id)) return prev.filter((x) => x !== id);
            if (prev.length >= 3) return prev; // cap 3
            return [...prev, id];
        });
    };

    const clearAll = () => {
        setQ("");
        setCategory("All");
        setOriginFilters([]);
        setSort("alpha");
    };

    const t = useTranslations("Product.hero");

    return (
        <div className="min-h-screen bg-white text-neutral-900">
            <Hero
                variant="image"
                bgImage="/product_bg.png"
                kicker={t("kicker")}
                title={t("titleA")}
                lastWord={t("titleB")}
                hasActionbtn="no"
                hasStats=""
                subtitle={t("subtitle")}
                rotatingWords={t.raw("rotating")} // array
            />

            <FilterBar
                q={q}
                setQ={setQ}
                categories={categories}
                category={category}
                setCategory={(val) => {
                    // Selecting any category clears to that category; selecting "All" resets
                    setCategory(val || "All");
                }}
                origins={origins}
                originFilters={originFilters}
                setOriginFilters={(updater) => {
                    // Ensure dedup & stable reference
                    setOriginFilters((prev) => {
                        const next = typeof updater === "function" ? updater(prev) : updater || [];
                        return Array.from(new Set(next));
                    });
                }}
                originsOpen={originsOpen}
                setOriginsOpen={setOriginsOpen}
                sort={sort}
                setSort={setSort}
                view={view}
                setView={setView}
                onClearAll={clearAll}
            />

            <div className="container mx-auto px-4 sm:px-6 py-8">
                {loading ? (
                    view === "grid" ? <SkeletonGrid /> : <SkeletonTable />
                ) : filtered.length === 0 ? (
                    <h1 className="text-center text-neutral-500 py-12">Nothing</h1>
                ) : view === "grid" ? (
                    <GridList
                        items={filtered}
                        onQuickView={setQuickProduct}
                        onRFQ={setRfqProduct}
                        compare={compare}
                        toggleCompare={toggleCompare}
                    />
                ) : (
                    <TableList
                        items={filtered}
                        onQuickView={setQuickProduct}
                        onRFQ={setRfqProduct}
                        compare={compare}
                        toggleCompare={toggleCompare}
                    />
                )}
            </div>

            {/* Compare Drawer */}
            <CompareDrawer
                products={allProducts}
                compare={compare}
                onCloseItem={(id) => setCompare((prev) => prev.filter((x) => x !== id))}
                onClear={() => setCompare([])}
            />

            {/* Quick View Modal */}
            <AnimatePresence>
                {!!quickProduct && (
                    <QuickViewModal2
                        product={quickProduct}
                        onClose={() => setQuickProduct(null)}
                        onRFQ={() => {
                            setRfqProduct(quickProduct);
                            setQuickProduct(null);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* RFQ Modal */}
            <AnimatePresence>
                {!!rfqProduct && (
                    <RFQModal product={rfqProduct} onClose={() => setRfqProduct(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}

/* ───────────────────────────────────────────────────────────────
   Filter Bar (sticky)
─────────────────────────────────────────────────────────────── */
function FilterBar({
    q,
    setQ,
    categories,
    category,
    setCategory,
    origins,
    originFilters,
    setOriginFilters,
    originsOpen,
    setOriginsOpen,
    sort,
    setSort,
    view,
    setView,
    onClearAll,
}) {
    // Close origin popover on outside click
    const popRef = useRef(null);
    useEffect(() => {
        const onClick = (e) => {
            if (!popRef.current) return;
            if (!popRef.current.contains(e.target)) setOriginsOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [setOriginsOpen]);

    const anyActive =
        q.trim().length > 0 ||
        category !== "All" ||
        (originFilters && originFilters.length > 0) ||
        sort !== "alpha";

    return (
        <div className="lg:sticky md:lg:sticky relative lg:top-20 md:lg:top-20 top-0 z-30">
            <div className="container mx-auto px-4 sm:px-6 bg-[#ffd028]/60 rounded-3xl py-4">
                <div className="flex flex-col gap-3 py-3">
                    {/* Row 1: Search & Sort */}
                    <div className="flex flex-wrap items-center gap-3">
                        <SearchBox
                            value={q}
                            onChange={(val) => setQ(val)}
                            placeholder="Search by name, HS code, spec…"
                        />
                        <div className="ml-auto flex items-center gap-2">
                            <SortSelect value={sort} onChange={setSort} />
                            <ViewToggle view={view} setView={setView} />
                            {anyActive && (
                                <button
                                    onClick={onClearAll}
                                    className="rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50"
                                    title="Clear all filters"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Categories & Origins */}
                    <div className="flex flex-wrap items-center gap-2">
                        <ChipGroup
                            options={categories}
                            value={category}
                            onChange={(val) => setCategory(val)}
                        />

                        <div className="relative" ref={popRef}>
                            <button
                                onClick={() => setOriginsOpen((v) => !v)}
                                className="inline-flex items-center gap-2 lg:rounded-2xl md:rounded-2xl border border-neutral-200 bg-white px-3 py-1.5 text-sm hover:border-neutral-300"
                            >
                                <GlobeIcon className="h-4 w-4" />
                                Origin
                                {originFilters.length > 0 && (
                                    <span className="ml-1 rounded-full bg-neutral-100 px-2 py-[2px] text-[11px]">
                                        {originFilters.length}
                                    </span>
                                )}
                                <ChevronDown className="h-4 w-4 opacity-60" />
                            </button>

                            <AnimatePresence>
                                {originsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.18 }}
                                        className="absolute left-0 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg"
                                    >
                                        <div className="max-h-64 overflow-auto pr-1">
                                            {origins.map((o) => {
                                                const active = originFilters.includes(o);
                                                return (
                                                    <label
                                                        key={o}
                                                        className={`flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-sm cursor-pointer hover:bg-neutral-50 ${active ? "bg-neutral-50" : ""
                                                            }`}
                                                    >
                                                        <span>{o}</span>
                                                        <input
                                                            type="checkbox"
                                                            className="accent-black"
                                                            checked={active}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                setOriginFilters((prev) =>
                                                                    checked
                                                                        ? [...prev, o]
                                                                        : prev.filter((x) => x !== o)
                                                                );
                                                            }}
                                                        />
                                                    </label>
                                                );
                                            })}
                                        </div>

                                        {originFilters.length > 0 && (
                                            <button
                                                onClick={() => setOriginFilters([])}
                                                className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-2 py-1.5 text-xs hover:border-neutral-300"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Active filters */}
                        <div className="flex flex-wrap items-center gap-1">
                            {category !== "All" && (
                                <ActivePill onClear={() => setCategory("All")}>
                                    {category}
                                </ActivePill>
                            )}
                            {originFilters.map((o) => (
                                <ActivePill
                                    key={o}
                                    onClear={() =>
                                        setOriginFilters((prev) => prev.filter((x) => x !== o))
                                    }
                                >
                                    {o}
                                </ActivePill>
                            ))}
                            {q.trim() && (
                                <ActivePill onClear={() => setQ("")}>“{q.trim()}”</ActivePill>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


// ───────────────────────────────────────────────────────────────
// Product Lists (+ animations)
// ───────────────────────────────────────────────────────────────
const gridParent = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
};
const fadeChild = {
    hidden: { opacity: 0, y: 14, scale: 0.99 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

const GridList = ({ items, onQuickView, onRFQ, compare, toggleCompare }) => {
    return (
        <motion.div
            variants={gridParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3"
        >
            {items.map((p) => (
                <motion.div key={p.id} variants={fadeChild}>
                    <ProductCard
                        product={p}
                        onQuickView={() => onQuickView(p)}
                        onRFQ={() => onRFQ(p)}
                        onToggleCompare={() => toggleCompare(p.id)}
                        isCompared={compare.includes(p.id)}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};

const TableList = ({ items, onQuickView, onRFQ, compare, toggleCompare }) => {
    return (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200">
            <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-600">
                    <tr>
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-left">HS Code</th>
                        <th className="px-4 py-3 text-left">Origin</th>
                        <th className="px-4 py-3 text-left">MOQ</th>
                        <th className="px-4 py-3 text-left">Lead Time</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((p, i) => (
                        <motion.tr
                            key={p.id || p.slug || i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                            transition={{ duration: 0.35 }}
                            className="border-t border-neutral-200"
                        >
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-10 w-10 overflow-hidden rounded-lg ring-1 ring-neutral-200 flex-none">
                                        <Image
                                            src={p.images?.[0] || "/products/placeholder.jpg"}
                                            alt={p.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <Link
                                            href={`/products/${p.slug}`}
                                            className="font-semibold hover:underline"
                                        >
                                            {p.name}
                                        </Link>
                                        <div className="text-xs text-neutral-500 line-clamp-1">
                                            {p.summary}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">{p.hsCode || "-"}</td>
                            <td className="px-4 py-3">
                                {(p.originCountries || []).join(" • ")}
                            </td>
                            <td className="px-4 py-3">{p.moqKg ? `${p.moqKg} kg` : "-"}</td>
                            <td className="px-4 py-3">
                                {p.leadTimeDays ? `${p.leadTimeDays} d` : "-"}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <IconButton title="Quick view" onClick={() => onQuickView(p)}>
                                        <EyeIcon />
                                    </IconButton>
                                    <IconButton title="Request a quote" onClick={() => onRFQ(p)}>
                                        <MailIcon />
                                    </IconButton>
                                    <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="accent-black"
                                            checked={compare.includes(p.id)}
                                            onChange={() => toggleCompare(p.id)}
                                        />
                                        Compare
                                    </label>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ProductCard = ({
    product,
    onQuickView,
    onRFQ,
    onToggleCompare,
    isCompared,
}) => {
    const ACCENT2 = "#ffd028";
    const hasImages = product.images && product.images.length > 0;

    return (
        <div className="group relative rounded-[2rem] border border-transparent bg-neutral-50 p-6 sm:p-7 [transform-style:preserve-3d] transition-all duration-700 hover:-translate-y-4 hover:shadow-2xl hover:border-orange-500/50">
            {/* Inner glow */}
            <div
                className="pointer-events-none absolute -inset-20 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-60"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${ACCENT2}88 0%, transparent 70%)`,
                }}
            />

            <div className="relative z-10 flex items-center justify-between mb-5">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-200 px-4 py-1.5 text-xs font-semibold text-black shadow-md">
                    {product.category || "Gum Resins"}
                </span>

                <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer select-none text-neutral-500">
                    <input
                        type="checkbox"
                        className="peer hidden"
                        checked={isCompared}
                        onChange={(e) => {
                            e.stopPropagation();
                            onToggleCompare();
                        }}
                    />
                    <div className="relative w-8 h-4 rounded-full bg-neutral-300 peer-checked:bg-yellow-500 transition-colors duration-200">
                        <span className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-4"></span>
                    </div>
                    Compare
                </label>
            </div>

            {/* Image (clickable) */}
            {hasImages ? (
                <ImageSlider images={product.images} name={product.name} />
            ) : (
                <div className="w-full h-48 flex items-center justify-center bg-neutral-200 rounded-3xl">
                    <span className="text-neutral-500 text-sm">No Image</span>
                </div>
            )}

            {/* Content */}
            <div className="mt-6 space-y-3">
                <Link
                    href={`/products/${product.slug}`}
                    className="text-xl sm:text-2xl font-bold leading-snug text-neutral-950 hover:underline"
                >
                    {product.name}
                </Link>
                <p className="text-sm text-neutral-600 line-clamp-2">{product.summary}</p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-between gap-3">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRFQ();
                    }}
                    className="relative flex-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/40"
                    style={{
                        background: "linear-gradient(90deg, #0b2a6b 0%, #ffd028 100%)",
                    }}
                >
                    <MailIcon className="w-4 h-4" />
                    <span className="relative z-10">Request</span>
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onQuickView();
                    }}
                    className="relative flex-none inline-flex items-center justify-center gap-2 rounded-full w-12 h-12 border-2 border-neutral-200 bg-neutral-100 text-neutral-700 transition-all duration-300 hover:scale-110 hover:border-yellow-500 hover:text-black"
                >
                    <EyeIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

function ImageSlider({
    images = [],
    name,
    className = "h-48",
    auto = true,
    intervalMs = 3500,
    pauseOnHover = true,
}) {
    const safe = images?.length ? images : ["/products/placeholder.jpg"];
    const [idx, setIdx] = useState(0);
    const [hover, setHover] = useState(false);
    const startX = useRef(null);

    // auto-advance (respect props)
    useEffect(() => {
        if (!auto || safe.length <= 1) return;
        if (pauseOnHover && hover) return;
        const id = setInterval(
            () => setIdx((i) => (i + 1) % safe.length),
            Math.max(800, intervalMs)
        );
        return () => clearInterval(id);
    }, [auto, pauseOnHover, hover, safe.length, intervalMs]);

    const prev = () => setIdx((i) => (i - 1 + safe.length) % safe.length);
    const next = () => setIdx((i) => (i + 1) % safe.length);

    // touch swipe
    const onTouchStart = (e) => (startX.current = e.touches[0].clientX);
    const onTouchEnd = (e) => {
        if (startX.current == null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 30) (dx > 0 ? prev() : next());
        startX.current = null;
    };

    return (
        <div
            className={`relative w-full overflow-hidden rounded-2xl ring-1 ring-neutral-200 ${className}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {/* slides */}
            {safe.map((src, i) => (
                <div
                    key={`${src}-${i}`}
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: i === idx ? 1 : 0 }}
                    aria-hidden={i !== idx}
                >
                    <Image
                        src={src}
                        alt={name || "Product image"}
                        fill
                        className="object-cover"
                        priority={false}
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
            ))}

            {/* subtle gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/5 to-transparent" />

            {/* arrows (hidden if only 1) */}
            {safe.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center h-8 w-8 rounded-full bg-white/80 backdrop-blur border border-neutral-200 shadow hover:bg-white transition"
                        aria-label="Previous image"
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center h-8 w-8 rounded-full bg-white/80 backdrop-blur border border-neutral-200 shadow hover:bg-white transition"
                        aria-label="Next image"
                    >
                        <ChevronRight />
                    </button>
                </>
            )}

            {/* dots */}
            {safe.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                    {safe.map((_, i) => (
                        <button
                            key={`dot-${i}`}
                            onClick={() => setIdx(i)}
                            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-4 bg-neutral-900" : "w-1.5 bg-white/70 border border-neutral-300"
                                }`}
                            aria-label={`Go to image ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

const ChevronLeft = (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" {...props}>
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);
const ChevronRight = (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" {...props}>
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

function QuickViewModal2({ product, onClose, onRFQ }) {
    if (!product) return null;

    // Essentials (limit to 4)
    const highlights = [
        product.hsCode ? ["HS Code", product.hsCode] : null,
        product.moqKg ? ["MOQ", `${product.moqKg} kg`] : null,
        product.leadTimeDays ? ["Lead Time", `${product.leadTimeDays} days`] : null,
        product.packaging ? ["Packaging", product.packaging] : null,
        product.incoterms?.length ? ["Incoterms", product.incoterms.join(" / ")] : null,
        product.originCountries?.length ? ["Origin", product.originCountries.join(" • ")] : null,
    ]
        .filter(Boolean)
        .slice(0, 4);

    return (
        <Modal onClose={onClose} title="Quick View" right={product?.name}>
            <div className="grid gap-6 md:grid-cols-2">
                {/* Left: media card */}
                <Gallery images={product.images} name={product.name} />

                {/* Right: info */}
                <div className="animate-slide-up">
                    <h3 className="text-xl sm:text-2xl font-extrabold" style={{ color: PRIMARY }}>
                        {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600">{product.summary}</p>

                    {/* Highlights (cards) */}
                    {highlights.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {highlights.map(([k, v]) => (
                                <div key={k} className="HighlightCard group">
                                    <div className="HighlightCard__bar" />
                                    <div className="HighlightCard__glow" />
                                    <div className="flex items-start gap-3">
                                        <div className="IconDot">
                                            {/* simple icon dot */}
                                            <span className="w-2 h-2 rounded-full bg-white block" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="Label">{k}</div>
                                            <div className="Value">{v}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button onClick={onRFQ} className="BtnPrimary inline-flex items-center gap-2 text-white">
                            <MailIcon />
                            Request a quote
                        </button>

                        <Link href={`/products/${product.slug}`} className="BtnSoft inline-flex items-center gap-2">
                            View more →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scoped styles */}
            <style jsx>{`
        /* Entrances */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slideUp .5s ease-out both; }

        /* Highlight cards */
        .HighlightCard {
          position: relative;
          border: 1px solid #eeeeee;
          border-radius: 1rem;
          background: #fff;
          padding: .9rem .95rem;
          transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
          box-shadow: 0 12px 36px -22px rgba(0,0,0,.2);
        }
        .HighlightCard:hover { transform: translateY(-2px); border-color: #e3e3e3; box-shadow: 0 20px 56px -26px rgba(0,0,0,.26); }
        .HighlightCard__bar {
          content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-top-left-radius: 1rem; border-bottom-left-radius: 1rem;
          background: linear-gradient(90deg, ${PRIMARY} 0%, ${ACCENT} 100%);
          opacity: .95;
        }
        .HighlightCard__glow {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0;
          background: radial-gradient(240px 120px at 20% 0%, rgba(255,255,255,.12), transparent 60%);
          transition: opacity .35s ease;
        }
        .HighlightCard:hover .HighlightCard__glow { opacity: 1; }

        .IconDot {
          display: grid; place-items: center;
          width: 28px; height: 28px; border-radius: .65rem; color: #fff;
          background: linear-gradient(90deg, ${PRIMARY} 0%, ${ACCENT} 100%);
          box-shadow: 0 10px 26px -20px rgba(0,0,0,.35);
          flex-shrink: 0;
        }
        .Label { font-size: .72rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #6b7280; }
        .Value { font-size: .96rem; font-weight: 700; color: #0f172a; }

        /* Buttons */
        .BtnGhost { border: 1px solid #e5e5e5; padding: .6rem .95rem; border-radius: .9rem; background: #fff; font-weight: 600; transition: transform .15s, box-shadow .15s, border-color .15s; }
        .BtnGhost:hover { transform: translateY(-1px); border-color: #dcdcdc; box-shadow: 0 10px 20px -14px rgba(0,0,0,.22); }
        .BtnPrimary { position: relative; padding: .65rem 1rem; border-radius: .9rem; font-weight: 800; color: #ffffff; background: linear-gradient(90deg, ${PRIMARY} 0%, ${PRIMARY} 100%); box-shadow: 0 12px 28px -18px rgba(0,0,0,.35); transition: transform .15s, filter .15s; }
        .BtnPrimary:hover { transform: translateY(-1px); filter: brightness(1.03); }
        .BtnSoft { border: 1px solid #eaeaea; background: #fbfbfb; padding: .6rem .95rem; border-radius: .9rem; font-weight: 700; transition: transform .15s, box-shadow .15s, border-color .15s, background .15s; }
        .BtnSoft:hover { transform: translateY(-1px); border-color: #dedede; background: #fff; box-shadow: 0 10px 20px -14px rgba(0,0,0,.18); }
      `}</style>
        </Modal>
    );
}

// ───────────────────────────────────────────────────────────────
// RFQ Modal (POST /api/rfq) with gradient header
// ───────────────────────────────────────────────────────────────
const RFQModal = ({ product, onClose }) => {

    const [loading, setLoading] = useState(false);
    const [ok, setOk] = useState(false);
    const [err, setErr] = useState("");
    const [form, setForm] = useState({
        company: "",
        contactName: "",
        email: "",
        quantity: "",
        unit: product?.rfqDefaults?.unit || "kg",
        incoterm: product?.incoterms?.[0] || "FOB",
        destination: "",
        message: "",
    });

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErr("");
        try {
            const res = await fetch("/api/rfq", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product: product?.slug,
                    productName: product?.name,
                    ...form,
                }),
            });
            if (!res.ok) throw new Error("Failed to send request");
            setOk(true);
        } catch (error) {
            setErr(error?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal onClose={onClose} title="Request a Quote" right={product?.name}>
            {!ok ? (
                <form onSubmit={submit} className="grid gap-4">
                    {err && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {err}
                        </div>
                    )}

                    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-md">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Company" required>
                                <input
                                    value={form.company}
                                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                                    className="Input"
                                />
                            </Field>
                            <Field label="Contact name" required>
                                <input
                                    value={form.contactName}
                                    onChange={(e) =>
                                        setForm({ ...form, contactName: e.target.value })
                                    }
                                    className="Input"
                                />
                            </Field>
                            <Field label="Email" required>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="Input"
                                />
                            </Field>
                            <Field label="Destination port/city">
                                <input
                                    value={form.destination}
                                    onChange={(e) =>
                                        setForm({ ...form, destination: e.target.value })
                                    }
                                    className="Input"
                                />
                            </Field>
                            <Field label="Quantity" required>
                                <input
                                    value={form.quantity}
                                    onChange={(e) =>
                                        setForm({ ...form, quantity: e.target.value })
                                    }
                                    className="Input"
                                />
                            </Field>
                            <Field label="Unit">
                                <Select
                                    value={form.unit}
                                    onChange={(e) =>
                                        setForm({ ...form, unit: e.target.value })
                                    }
                                    options={["kg", "ton"]}
                                />
                            </Field>
                            <Field label="Incoterm">
                                <Select
                                    value={form.incoterm}
                                    onChange={(e) =>
                                        setForm({ ...form, incoterm: e.target.value })
                                    }
                                    options={["FOB", "CFR", "CIF", "EXW"]}
                                />
                            </Field>
                            <div className="sm:col-span-2">
                                <Field label="Message (optional)">
                                    <textarea
                                        rows={4}
                                        value={form.message}
                                        onChange={(e) =>
                                            setForm({ ...form, message: e.target.value })
                                        }
                                        className="Input"
                                    />
                                </Field>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="BtnSecondary w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button disabled={loading} className="BtnPrimary w-full sm:w-auto">
                                {loading ? "Sending…" : "Send request"}
                            </button>
                        </div>
                    </div>

                    <style jsx>{`
            .Input {
              width: 100%;
              border-radius: 0.75rem;
              border: 1px solid #e5e5e5;
              background: white;
              padding: 0.6rem 0.8rem;
              transition: box-shadow 0.15s ease, border-color 0.15s ease;
            }
            .Input:focus {
              outline: none;
              border-color: ${ACCENT};
              box-shadow: 0 0 0 3px rgba(255, 208, 40, 0.25);
            }
            .BtnSecondary {
              border: 1px solid #e5e5e5;
              padding: 0.5rem 0.9rem;
              border-radius: 0.75rem;
              background: white;
            }
            .BtnPrimary {
              position: relative;
              padding: 0.5rem 0.9rem;
              border-radius: 0.75rem;
              font-weight: 600;
              color: #111;
              transition: transform 0.15s ease;
              overflow: hidden;
              isolation: isolate;
            }
            .BtnPrimary::before {
              content: "";
              position: absolute;
              inset: 0;
              border-radius: 0.75rem;
              background: linear-gradient(90deg, ${ACCENT} 0%, #ffe88b 100%);
              box-shadow: 0 10px 24px -16px rgba(0, 0, 0, 0.35);
              z-index: -1;
            }
          `}</style>
                </form>
            ) : (
                <div className="grid place-items-center gap-2 py-8">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                    <div className="text-lg font-semibold">Request sent</div>
                    <div className="text-sm text-neutral-600">We’ll get back to you shortly.</div>
                    <button onClick={onClose} className="mt-2 BtnSecondary">
                        Close
                    </button>
                </div>
            )}
        </Modal>
    );
};

// ───────────────────────────────────────────────────────────────
// Compare Drawer (Open link kept; matches requirement)
// ───────────────────────────────────────────────────────────────
const CompareDrawer22 = ({ products, compare, onCloseItem, onClear }) => {
    const items = compare
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean);

    return (
        <div
            className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-400 ${items.length ? "translate-y-0" : "translate-y-full"
                }`}
        >
            <div className="mx-auto max-w-6xl rounded-t-3xl border border-neutral-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between px-4 sm:px-6 py-3">
                    <div className="font-semibold">Compare ({items.length}/3)</div>
                    <div className="flex items-center gap-2">
                        <button onClick={onClear} className="text-sm underline">
                            Clear
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-4 py-3 text-left">Product</th>
                                <th className="px-4 py-3 text-left">HS</th>
                                <th className="px-4 py-3 text-left">Origin</th>
                                <th className="px-4 py-3 text-left">MOQ</th>
                                <th className="px-4 py-3 text-left">Lead</th>
                                <th className="px-4 py-3 text-left">Key Spec</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((p) => (
                                <tr key={p.id} className="border-t border-neutral-200">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/products/${p.slug}`}
                                                className="relative h-10 w-10 overflow-hidden rounded-lg ring-1 ring-neutral-200"
                                            >
                                                <Image
                                                    src={p.images?.[0] || "/products/placeholder.jpg"}
                                                    alt={p.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </Link>
                                            <div className="min-w-0">
                                                <Link href={`/products/${p.slug}`} className="font-medium hover:underline">
                                                    {p.name}
                                                </Link>
                                                <button
                                                    onClick={() => onCloseItem(p.id)}
                                                    className="text-xs text-neutral-500 underline"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{p.hsCode || "-"}</td>
                                    <td className="px-4 py-3">
                                        {(p.originCountries || []).join(" • ")}
                                    </td>
                                    <td className="px-4 py-3">
                                        {p.moqKg ? `${p.moqKg} kg` : "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {p.leadTimeDays ? `${p.leadTimeDays} d` : "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {p.specs ? `${Object.keys(p.specs)[0]}: ${Object.values(p.specs)[0]}` : "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={`/products/${p.slug}`} className="text-xs underline">
                                            Open
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {!items.length && (
                                <tr>
                                    <td className="px-4 py-6 text-center text-neutral-500" colSpan={7}>
                                        Select up to 3 products to compare
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const CompareDrawer = ({ products, compare, onCloseItem, onClear }) => {
    const items = compare
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean);

    const open = items.length > 0;
    const progress = Math.min(items.length / 3, 1) * 100;

    return (
        <div
            className={[
                "fixed inset-x-0 bottom-0 z-40 transition-all duration-300",
                open ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-full opacity-0 pointer-events-none",
            ].join(" ")}
            aria-hidden={!open}
        >
            <div className="mx-auto max-w-6xl rounded-t-3xl border border-neutral-200 bg-white/80 backdrop-blur-md shadow-[0_-12px_40px_-12px_rgba(0,0,0,.25)]">
                {/* Header */}
                <div className="px-4 sm:px-6 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold ring-1 ring-neutral-200 shadow-sm">
                                <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ background: ACCENT }} />
                                Compare
                                <span className="text-neutral-500">({items.length}/3)</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onClear}
                                className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                                title="Clear all"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-3 h-1.5 w-full rounded-full bg-neutral-200/70 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${progress}%`, background: ACCENT }}
                        />
                    </div>
                </div>

                {/* Cards rail */}
                <div className="px-3 sm:px-5 pb-4 pt-3">
                    <div className="grid grid-flow-col auto-cols-[82%] sm:auto-cols-[48%] md:auto-cols-[32%] gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                        {items.map((p) => (
                            <article
                                key={p.id}
                                className="group relative snap-start rounded-2xl bg-white ring-1 ring-neutral-200 shadow-md hover:shadow-lg transition"
                            >
                                {/* remove */}
                                <button
                                    onClick={() => onCloseItem(p.id)}
                                    className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-600 ring-1 ring-neutral-200 hover:bg-white"
                                    title="Remove"
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>


                                {/* body */}
                                <div className="p-3 sm:p-4">
                                    <Link href={`/products/${p.slug}`} className="block font-semibold leading-tight line-clamp-2 hover:underline">
                                        {p.name}
                                    </Link>

                                    {/* chips row */}
                                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                        <Chip label={p.hsCode ? `HS ${p.hsCode}` : "—"} />
                                        <Chip label={p.moqKg ? `${p.moqKg} kg` : "—"} />
                                        <Chip label={p.leadTimeDays ? `${p.leadTimeDays} d` : "—"} />
                                        {!!(p.originCountries?.length) && <Chip label={p.originCountries[0]} />}
                                    </div>

                                    {/* footer actions */}
                                    <div className="mt-3 flex items-center justify-between">
                                        <Link
                                            href={`/products/${p.slug}`}
                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900"
                                        >
                                            Open <ArrowRight className="h-4 w-4" />
                                        </Link>
                                        <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
                                            {firstKeySpec(p)}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Empty (rarely seen because drawer is hidden when empty) */}
                    {!items.length && (
                        <div className="py-10 text-center text-neutral-500 text-sm">Select up to 3 products to compare</div>
                    )}
                </div>
            </div>
        </div>
    );
};

function firstKeySpec(p) {
    if (!p?.specs) return "—";
    const k = Object.keys(p.specs)[0];
    if (!k) return "—";
    return `${pretty(k)}: ${String((p.specs)[k])}`;
}
function pretty(k) {
    return k.replace(/[_\-]/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b(\w)/g, (c) => c.toUpperCase());
}
const ArrowRight = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
);

const Chip = ({ label }) => (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-700 shadow-[0_2px_10px_-8px_rgba(0,0,0,.4)]">
        {label}
    </span>
);

// ───────────────────────────────────────────────────────────────
// Shared UI bits
// ───────────────────────────────────────────────────────────────
const SearchBox = ({ value, onChange, placeholder }) => (
    <div className="relative flex-1 min-w-[240px] max-w-xl">
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none ring-0 transition focus:border-neutral-300"
        />
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            <SearchIcon />
        </div>
    </div>
);

const ChipGroup = ({ options, value, onChange, accent }) => (
    <div className="flex flex-wrap items-center gap-1.5">
        {options.map((opt) => {
            const active = opt === value;
            return (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`rounded-2xl border px-3 py-1.5 text-sm transition ${active ? "text-neutral-900" : "text-neutral-700 hover:border-neutral-300"
                        }`}
                    style={{
                        borderColor: "#e5e5e5",
                        background: active
                            ? `linear-gradient(90deg, ${ACCENT} 0%, #ffe88b 100%)`
                            : "white",
                    }}
                >
                    {opt}
                </button>
            );
        })}
    </div>
);

const SortSelect = ({ value, onChange }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none rounded-2xl border border-neutral-200 bg-white py-2 pl-3 pr-7 text-sm"
        >
            <option value="alpha">Alphabetical</option>
            <option value="moq">MOQ (low → high)</option>
            <option value="lead">Lead time (fastest)</option>
        </select>
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
    </div>
);

const ViewToggle = ({ view, setView }) => (
    <div className="inline-flex items-center gap-1 rounded-2xl border border-neutral-200 bg-white p-1">
        <button
            onClick={() => setView("grid")}
            className={`rounded-xl px-2.5 py-1.5 text-sm ${view === "grid" ? "bg-neutral-100" : ""
                }`}
            title="Grid view"
        >
            <GridIcon />
        </button>
        <button
            onClick={() => setView("table")}
            className={`rounded-xl px-2.5 py-1.5 text-sm ${view === "table" ? "bg-neutral-100" : ""
                }`}
            title="Table view"
        >
            <RowsIcon />
        </button>
    </div>
);

const ActivePill = ({ children, onClear }) => (
    <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs">
        {children}
        <button
            onClick={onClear}
            className="ml-1 rounded-full p-1 hover:bg-neutral-200/60"
            title="Remove"
        >
            <XIcon className="h-3.5 w-3.5" />
        </button>
    </span>
);

const IconButton = ({ children, title, onClick }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        title={title}
        className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white p-2 hover:border-neutral-300"
    >
        {children}
    </button>
);

// ───────────────────────────────────────────────────────────────
// Modal (base) — responsive + gradient header + animation
// ───────────────────────────────────────────────────────────────
const Modal = ({ children, onClose, title, right }) => {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50">
            <motion.div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />
            <div className="absolute inset-0 grid place-items-center p-3 sm:p-4">
                <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.985 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-3xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl"
                    role="dialog"
                    aria-modal="true"
                    aria-label={title || "Dialog"}
                >
                    {/* Header bar with gradient covering full width and top edge */}
                    <div
                        className="flex items-center justify-between px-3 sm:px-5 py-3"
                        style={{
                            background: `linear-gradient(135deg, ${PRIMARY} 0%, rgba(11,42,107,0.85) 35%, ${ACCENT} 100%)`,
                            color: "#fff",
                        }}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm sm:text-base font-extrabold tracking-tight whitespace-nowrap">
                                {title}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                            {right && (
                                <span className="max-w-[55vw] sm:max-w-[28rem] truncate rounded-md border border-white/20 bg-white/10 px-2 py-1 text-xs sm:text-sm font-semibold backdrop-blur">
                                    {right}
                                </span>
                            )}
                            <button
                                onClick={onClose}
                                className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 border border-white/25"
                                title="Close"
                            >
                                <XIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Body — scrollable on small screens */}
                    <div className="max-h-[85vh] overflow-y-auto p-4 sm:p-6">
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// ───────────────────────────────────────────────────────────────
// Gallery
// ───────────────────────────────────────────────────────────────
const Gallery = ({ images = [], name }) => {
    const [idx, setIdx] = useState(0);
    const shown = images[idx] || "/products/placeholder.jpg";
    return (
        <div>
            <div className="relative h-full w-full overflow-hidden rounded-2xl ring-1 ring-neutral-200">
                <Image src={shown} alt={name} fill className="object-cover" />
            </div>
            {images.length > 1 && (
                <div className="mt-3 flex items-center gap-2">
                    {images.map((src, i) => (
                        <button
                            key={src + i}
                            onClick={() => setIdx(i)}
                            className={`relative h-14 w-14 overflow-hidden rounded-xl ring-1 ring-neutral-200 ${i === idx ? "outline outline-neutral-900" : ""
                                }`}
                        >
                            <Image src={src} alt={`${name} ${i + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ───────────────────────────────────────────────────────────────
// Form bits
// ───────────────────────────────────────────────────────────────
const Field = ({ label, children, required }) => (
    <label className="grid gap-1 text-sm">
        <span className="text-neutral-700">
            {label}
            {required && <span className="text-red-500">*</span>}
        </span>
        {children}
    </label>
);

const Select = ({ value, onChange, options = [] }) => (
    <select value={value} onChange={onChange} className="Input">
        {options.map((o) => (
            <option key={o} value={o}>
                {o}
            </option>
        ))}
    </select>
);

// ───────────────────────────────────────────────────────────────
// Icons (inline SVG; no external deps)
// ───────────────────────────────────────────────────────────────
const SearchIcon = (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" {...props}>
        <circle cx="11" cy="11" r="7"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);
const ChevronDown = (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" {...props}>
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);
const GridIcon = (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" {...props}>
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);
const RowsIcon = (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" {...props}>
        <rect x="3" y="5" width="18" height="4"></rect>
        <rect x="3" y="15" width="18" height="4"></rect>
    </svg>
);
const EyeIcon = (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" {...props}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);
const MailIcon = (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" {...props}>
        <path d="M4 4h16v16H4z"></path>
        <path d="M22 6l-9.5 7L3 6"></path>
    </svg>
);
const XIcon = (props) => (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" {...props}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);
const DownloadIcon = (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <path d="M7 10l5 5 5-5"></path>
        <path d="M12 15V3"></path>
    </svg>
);
const CheckCircle = (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2" {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);
const GlobeIcon = (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 0 20"></path>
        <path d="M12 2a15.3 15.3 0 0 0 0 20"></path>
    </svg>
);

// ───────────────────────────────────────────────────────────────
// Skeletons (loading indicator)
// ───────────────────────────────────────────────────────────────
const SkeletonGrid = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-7">
                <div className="h-6 w-28 rounded-lg bg-neutral-100 animate-pulse" />
                <div className="mt-4 h-48 w-full rounded-2xl bg-neutral-100 animate-pulse" />
                <div className="mt-5 h-5 w-2/3 rounded bg-neutral-100 animate-pulse" />
                <div className="mt-2 h-4 w-1/2 rounded bg-neutral-100 animate-pulse" />
                <div className="mt-6 flex gap-3">
                    <div className="h-12 w-full rounded-full bg-neutral-100 animate-pulse" />
                    <div className="h-12 w-12 rounded-full bg-neutral-100 animate-pulse" />
                </div>
            </div>
        ))}
    </div>
);

const SkeletonTable = () => (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200">
        <table className="min-w-full text-sm">
            <thead className="bg-neutral-50">
                <tr>
                    {["Product", "HS Code", "Origin", "MOQ", "Lead Time", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-t border-neutral-200">
                        {Array.from({ length: 6 }).map((__, j) => (
                            <td key={j} className="px-4 py-3">
                                <div className="h-5 w-full max-w-[260px] rounded bg-neutral-100 animate-pulse" />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// ───────────────────────────────────────────────────────────────
// Utils
// ───────────────────────────────────────────────────────────────
function uniq(arr) {
    return Array.from(new Set(arr.filter(Boolean)));
}
