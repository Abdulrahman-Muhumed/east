"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Link } from "../../../../../../i18n/navigation";
import { getProductBySlug } from "../../../../data/products";
import { brand } from "../../../../config/brand";
import {
  Download,
  ChevronRight,
  X,
  Mail,
  Globe,
  Package as BoxIcon,
  Timer,
  Star,
  Leaf,
  FlaskConical,
  Droplet,
  Soup,
  PiggyBank,
  Brush,
  Pill,
  HeartHandshake,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/* BRAND */
const PRIMARY = brand?.colors?.primary ?? "#0B2A6B";
const ACCENT = brand?.colors?.accent ?? "#FFD028";

/* MOTION VARIANTS (simple & consistent) */
const fadeUp = {
  hidden: { opacity: 1, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.2, 0.7, 0.2, 1] },
  },
};
const stagger = (staggerChildren = 0.06) => ({
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren, delayChildren: 0.04 } },
});
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

/* Inline starting styles to avoid SSR flash */
const HIDDEN_FADE = { opacity: 1, y: 14 };
const HIDDEN_ITEM = { opacity: 1, y: 10 };

export default function ProductDetailPage() {
  const t = useTranslations("Product");
  const { slug } = useParams();

  const product = useMemo(() => getProductBySlug?.(slug) || null, [slug]);

  const [activeTab, setActiveTab] = useState("specifications");
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);
  const [related, setRelated] = useState([]);
  const carouselRef = useRef(null);

  // Related (data-only, no animation)
  useEffect(() => {
    let mounted = true;
    import("../../../../data/products").then(({ PRODUCTS }) => {
      if (!mounted) return;
      const base = (PRODUCTS || []).filter((p) => p.slug !== slug).slice(0, 12);
      setRelated(base);
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  const MockLink = ({ href, className, children, style }) => (
    <a href={href} className={className} style={style}>
      {children}
    </a>
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-white mt-30">
        <section className="flex items-center justify-center bg-neutral-50 p-4">
          <div className="max-w-xl w-full text-center bg-white p-12 sm:p-16 rounded-3xl shadow-2xl border border-neutral-100 transform transition-all duration-300 hover:scale-[1.01]">
            <div className="mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mx-auto h-16 w-16 mb-4"
                style={{ color: ACCENT }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.295 3.12-1.295 4.291 0l.757.757a4.5 4.5 0 014.508 4.508l.758.758c1.295 1.171 1.295 3.12 0 4.291m-9.879-1.423a2.25 2.25 0 00-2.203 2.203V21h7.5L12 18.75l-4.25-4.25h-2.5zm0-2.5h-2.5V21h2.5v-2.25a2.25 2.25 0 012.203-2.203z"
                />
              </svg>
              <h1
                className="text-4xl sm:text-5xl font-extrabold"
                style={{ color: PRIMARY }}
              >
                {t("notFound.title")}
              </h1>
            </div>
            <p className="mt-4 text-lg text-neutral-500">{t("notFound.desc")}</p>
            <div className="mt-8">
              <MockLink
                href="/products"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: PRIMARY }}
              >
                {t("notFound.backToProducts")}
              </MockLink>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* Key facts (localized labels) */
  const keyFacts = [
    {
      icon: <Globe size={20} />,
      label: t("keyFacts.origin"),
      value: product.originCountries?.join(" • ") || "—",
    },
    {
      icon: <BoxIcon size={20} />,
      label: t("keyFacts.packaging"),
      value: product.packaging || "—",
    },
    {
      icon: <Star size={20} />,
      label: t("keyFacts.moq"),
      value: product.moqKg ? `${product.moqKg} kg` : t("keyFacts.flexible"),
    },
    {
      icon: <Timer size={20} />,
      label: t("keyFacts.leadTime"),
      value: product.leadTimeDays ? `${product.leadTimeDays} days` : t("keyFacts.tbc"),
    },
  ];

  /* Spec icons */
  const specIcons = {
    botanicalSource: <Leaf size={18} />,
    appearance: <Star size={18} />,
    purity: <PiggyBank size={18} />,
    moistureContent: <Droplet size={18} />,
    ashContent: <Soup size={18} />,
    pH_1pct: <FlaskConical size={18} />,
    odor: <Star size={18} />,
    taste: <Star size={18} />,
    solubility: <Soup size={18} />,
  };

  /* Applications (normalized) */
  const DEFAULT_APPS = ["Food & beverage", "Pharmaceuticals", "Cosmetics", "Industrial Use"];
  const rawAreas =
    typeof product?.specs?.applicationAreas === "string"
      ? product.specs.applicationAreas.split(",").map((s) => s.trim()).filter(Boolean)
      : DEFAULT_APPS;

  const normalizeLabel = (s) => {
    const t0 = s.toLowerCase();
    if (t0.includes("food") || t0.includes("beverage") || t0.includes("drink"))
      return "Food & beverage";
    if (t0.includes("pharma")) return "Pharmaceuticals";
    if (t0.includes("cosmetic")) return "Cosmetics";
    if (t0.includes("industrial") || t0.includes("ink") || t0.includes("adhesive"))
      return "Industrial Use";
    return s.replace(/\s+/g, " ").trim().replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  };

  const applicationIcons = {
    "Food & beverage": <Soup size={20} />,
    Pharmaceuticals: <Pill size={20} />,
    Cosmetics: <HeartHandshake size={20} />,
    "Industrial Use": <Brush size={20} />,
  };

  const applications = Array.from(new Set(rawAreas.map(normalizeLabel)));

  /* Carousel controls */
  const onNav = (dir) => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.9;
    el.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
  };

  // drag-to-scroll (interaction only; no animation side effects)
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e) => {
      isDown = true;
      const pageX = e.pageX ?? e.touches?.[0]?.pageX ?? 0;
      startX = pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.classList.add("cursor-grabbing");
    };
    const onLeaveUp = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };
    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const pageX = e.pageX ?? e.touches?.[0]?.pageX ?? 0;
      const x = pageX - el.offsetLeft;
      const walk = (x - startX) * 1;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseleave", onLeaveUp);
    el.addEventListener("mouseup", onLeaveUp);
    el.addEventListener("mousemove", onMove);

    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchend", onLeaveUp);
    el.addEventListener("touchmove", onMove, { passive: false });

    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseleave", onLeaveUp);
      el.removeEventListener("mouseup", onLeaveUp);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchend", onLeaveUp);
      el.removeEventListener("touchmove", onMove);
    };
  }, []);

  return (
    <div className="text-gray-900 md:mt-12 lg:mt-12 mt-8">
      <div className="container mx-auto p-2 sm:p-8 lg:p-12">
        {/* Breadcrumbs: start hidden inline, no flicker */}
        <motion.nav
          className="mb-2 sm:mb-4 text-sm text-gray-500 shadow-xl bg-amber-50 p-4 md:w-1/3 lg:w-1/3 hover:scale-105 duration-200 rounded-full"
          variants={fadeUp}
          style={HIDDEN_FADE}
          initial={false}
          animate="show"
        >
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/products" className="hover:underline">
                {t("breadcrumbs.products")}
              </Link>
            </li>
            <li>›</li>
            <li className="text-gray-900 font-medium line-clamp-1">{product.name}</li>
          </ol>
        </motion.nav>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* LEFT */}
          <div className="lg:top-8 self-start col-span-1">
            <motion.div
              className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 mb-6 ring-1 ring-gray-200"
              variants={fadeUp}
              style={HIDDEN_FADE}
              initial={false}
              animate="show"
            >
              <Image
                src={Array.isArray(product.images) && product.images.length ? product.images[0] : "/products/placeholder.jpg"}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                unoptimized
              />
            </motion.div>

            {/* RFQ */}
            <motion.div
              variants={fadeUp}
              style={HIDDEN_FADE}
              initial={false}
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="p-6 bg-white rounded-3xl shadow-md space-y-4 border border-gray-200"
            >
              <h2 className="text-xl font-bold">{t("rfq.title")}</h2>
              <p className="text-gray-600">{t("rfq.desc")}</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setIsRFQModalOpen(true)}
                className="w-full relative inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-black"
              >
                <span className="relative z-10">{t("rfq.start")}</span>
                <Mail size={18} />
                <span
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT})`,
                    boxShadow: "0 10px 24px -16px rgba(0,0,0,.35)",
                  }}
                />
              </motion.button>

              {product.datasheetUrl && (
                <a
                  href={product.datasheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium hover:border-gray-400 transition-colors"
                >
                  <Download size={18} />
                  {t("rfq.datasheet")}
                </a>
              )}
            </motion.div>
          </div>

          {/* RIGHT */}
          <div>
            <motion.div
              variants={fadeUp}
              style={HIDDEN_FADE}
              initial={false}
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="mb-6"
            >
              <h1
                className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight"
                style={{ color: PRIMARY }}
              >
                {product.name}
              </h1>
              <p className="mt-2 text-xl text-gray-600">{product.summary}</p>
              <motion.div
                variants={stagger(0.06)}
                initial={false}
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="mt-4 flex flex-wrap items-center gap-2"
              >
                {product.category && (
                  <motion.div variants={item} style={HIDDEN_ITEM}>
                    <Badge tone="soft">{product.category}</Badge>
                  </motion.div>
                )}
                {product.hsCode && (
                  <motion.div variants={item} style={HIDDEN_ITEM}>
                    <Badge tone="line">HS {product.hsCode}</Badge>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Key Facts */}
            <motion.div
              variants={stagger(0.08)}
              initial={false}
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
            >
              {keyFacts.map((fact, i) => (
                <motion.div
                  variants={item}
                  style={HIDDEN_ITEM}
                  key={`${fact.label}-${i}`}
                  className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 flex items-center gap-4"
                >
                  <div
                    className="p-3 rounded-full flex items-center justify-center"
                    style={{ background: `${ACCENT}22`, color: "#5b4b00" }}
                  >
                    {fact.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                      {fact.label}
                    </p>
                    <p className="text-md font-semibold">{fact.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <motion.div
          variants={fadeUp}
          style={HIDDEN_FADE}
          initial={false}
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-8"
        >
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-3 font-semibold text-lg ${
                activeTab === "specifications"
                  ? "text-gray-900 border-b-2"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={activeTab === "specifications" ? { borderColor: ACCENT } : {}}
              onClick={() => setActiveTab("specifications")}
              aria-selected={activeTab === "specifications"}
              aria-controls="tab-specs"
              role="tab"
            >
              {t("tabs.specs")}
            </button>
            <button
              className={`px-4 py-3 font-semibold text-lg ${
                activeTab === "applications"
                  ? "text-gray-900 border-b-2"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={activeTab === "applications" ? { borderColor: ACCENT } : {}}
              onClick={() => setActiveTab("applications")}
              aria-selected={activeTab === "applications"}
              aria-controls="tab-apps"
              role="tab"
            >
              {t("tabs.apps")}
            </button>
          </div>

          <div className="mt-6">
            {activeTab === "specifications" && (
              <motion.div
                id="tab-specs"
                role="tabpanel"
                variants={stagger(0.05)}
                initial={false}
                animate="show"
                className="space-y-4"
              >
                {Object.entries(product.specs || {}).length === 0 && (
                  <motion.div variants={item} style={HIDDEN_ITEM} className="text-gray-500">
                    {t("tabs.noSpecs")}
                  </motion.div>
                )}
                {Object.entries(product.specs || {}).map(([key, value]) => (
                  <motion.div
                    variants={item}
                    style={HIDDEN_ITEM}
                    key={key}
                    className="flex justify-between items-center pb-2 border-b border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      {specIcons[key] || <Leaf size={18} />}
                      <span className="text-gray-500 font-medium">{pretty(key)}</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {String(value)}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "applications" && (
              <motion.div
                id="tab-apps"
                role="tabpanel"
                variants={fadeUp}
                style={HIDDEN_FADE}
                initial={false}
                animate="show"
                className="prose text-gray-700 max-w-none"
              >
                <p className="mb-4">
                  {product.specs?.applicationAreas
                    ? t("tabs.appsLeadWithAreas")
                    : t("tabs.appsLeadDefault")}
                </p>
                <motion.ul
                  variants={stagger(0.07)}
                  initial={false}
                  animate="show"
                  className="space-y-4 list-none p-0 mt-0"
                >
                  {applications.map((app) => {
                    const i18nKey = `applications.${app}`;
                    const label = t(i18nKey, { default: app });
                    return (
                      <motion.li
                        variants={item}
                        style={HIDDEN_ITEM}
                        key={app}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-shrink-0" style={{ color: PRIMARY }}>
                          {applicationIcons[app] || <Leaf size={20} />}
                        </div>
                        <span className="font-medium text-lg">{label}</span>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Related */}
        {related.length > 0 && (
          <motion.div
            variants={fadeUp}
            style={HIDDEN_FADE}
            initial={false}
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-16 border-t border-gray-200 pt-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{t("related.title")}</h2>
              <Link href="/products" className="text-sm font-medium hover:underline">
                {t("related.browseAll")}
              </Link>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-gray-50 to-transparent rounded-l-3xl" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-gray-50 to-transparent rounded-r-3xl" />

              <div
                ref={carouselRef}
                className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide select-none cursor-grab"
              >
                {related.map((rp) => (
                  <div
                    key={rp.id || rp.slug}
                    className="snap-start flex-none w-[85%] sm:w-[48%] md:w-[32%]"
                  >
                    <Link
                      href={`/products/${rp.slug}`}
                      className="block bg-white p-4 rounded-3xl shadow-md border border-gray-200 hover:-translate-y-[2px] transition-transform"
                    >
                      <div className="relative aspect-video rounded-2xl overflow-hidden ring-1 ring-gray-200">
                        <Image
                          src={rp.images?.[0] || "/products/placeholder.jpg"}
                          alt={rp.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 90vw, 33vw"
                          unoptimized
                        />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">{rp.name}</h3>
                      <p className="text-gray-500 line-clamp-2">{rp.summary}</p>
                      <div
                        className="mt-2 flex items-center gap-1 font-semibold"
                        style={{ color: PRIMARY }}
                      >
                        <span>{t("related.viewProduct")}</span>
                        <ChevronRight size={16} />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNav(-1)}
                className="absolute z-10 top-1/2 left-0 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors hidden sm:block"
                title="Previous"
                aria-label="Previous"
              >
                <ChevronRight size={22} className="rotate-180" />
              </button>
              <button
                onClick={() => onNav(1)}
                className="absolute z-10 top-1/2 right-0 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors hidden sm:block"
                title="Next"
                aria-label="Next"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* RFQ Modal */}
      {isRFQModalOpen && (
        <RFQModal product={product} onClose={() => setIsRFQModalOpen(false)} />
      )}
    </div>
  );
}

/* MODAL + SMALL COMPONENTS */
function RFQModal({ product, onClose }) {
  const t = useTranslations("Product");
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
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
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
      setSent(true);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-black/40 grid place-items-center">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-gray-200"
        role="dialog"
        aria-modal="true"
        aria-label={t("rfq.title")}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>

        {!sent ? (
          <form onSubmit={submit} className="space-y-6">
            <h2 className="text-2xl font-bold">
              {t("rfq.for", { name: product?.name })}
            </h2>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t("fields.company")}
                value={form.company}
                onChange={(v) => setForm({ ...form, company: v })}
                required
              />
              <Input
                label={t("fields.contactName")}
                value={form.contactName}
                onChange={(v) => setForm({ ...form, contactName: v })}
                required
              />
              <Input
                label={t("fields.email")}
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                required
              />
              <Input
                label={t("fields.destination")}
                value={form.destination}
                onChange={(v) => setForm({ ...form, destination: v })}
              />
              <Input
                label={t("fields.quantity")}
                value={form.quantity}
                onChange={(v) => setForm({ ...form, quantity: v })}
                required
              />
              <Select
                label={t("fields.unit")}
                value={form.unit}
                onChange={(v) => setForm({ ...form, unit: v })}
              >
                <option>kg</option>
                <option>ton</option>
              </Select>
              <Select
                label={t("fields.incoterm")}
                value={form.incoterm}
                onChange={(v) => setForm({ ...form, incoterm: v })}
              >
                {(product?.incoterms || ["FOB", "CFR", "CIF"]).map((t0) => (
                  <option key={t0}>{t0}</option>
                ))}
              </Select>
            </div>
            <Textarea
              label={t("fields.message")}
              rows={4}
              value={form.message}
              onChange={(v) => setForm({ ...form, message: v })}
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-6 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {t("rfq.cancel")}
              </button>
              <button
                type="submit"
                disabled={sending}
                className="py-2 px-6 rounded-full text-gray-900 font-semibold relative"
              >
                <span className="relative z-10">
                  {sending ? t("rfq.sending") : t("rfq.send")}
                </span>
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${PRIMARY} 0%, ${ACCENT} 100%)`,
                    boxShadow: "0 10px 24px -16px rgba(0,0,0,.35)",
                  }}
                />
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="flex items-center justify-center text-green-600 mb-4">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">{t("rfq.sentTitle")}</h3>
            <p className="mt-2 text-gray-600">{t("rfq.sentDesc")}</p>
            <button
              onClick={onClose}
              className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-full text-white"
              style={{ background: PRIMARY }}
            >
              {t("rfq.close")}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* Inputs */
const Input = ({ label, value, onChange, required, type = "text" }) => (
  <label className="grid gap-1 text-sm">
    <span className="text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-yellow-400 focus:border-gray-300 transition"
    />
  </label>
);

const Select = ({ label, value, onChange, children }) => (
  <label className="grid gap-1 text-sm">
    <span className="text-gray-700">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-yellow-400 focus:border-gray-300 transition"
    >
      {children}
    </select>
  </label>
);

const Textarea = ({ label, value, onChange, rows = 4 }) => (
  <label className="grid gap-1 text-sm">
    <span className="text-gray-700">{label}</span>
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-yellow-400 focus:border-gray-300 transition"
    />
  </label>
);

/* Small UI */
const Badge = ({ tone = "soft", children }) => {
  if (tone === "line") {
    return (
      <span className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700">
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {children}
    </span>
  );
};

/* Helpers */
function pretty(k) {
  return String(k)
    .replace(/[_\-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b(\w)/g, (c) => c.toUpperCase());
}
