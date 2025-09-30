// src/data/products.js

// ───────────────────────────────────────────────────────────────
// EAST product catalog (file-based source of truth)
// Fields used by UI:
// id, slug, name, category, summary, hsCode, originCountries,
// specs{}, packaging, moqKg, incoterms[], leadTimeDays,
// images[], datasheetUrl, rfqDefaults{unit}
// ───────────────────────────────────────────────────────────────

export const PRODUCTS = [
  // ————————————————— Arabic Gum —————————————————
  {
    id: "arabic-gum-grade-1",
    id2: "EPRD-100500",
    slug: "arabic-gum-grade-one",
    name: "Arabic Gum — Grade One",
    category: "Gum Resins",
    summary:
      "Premium Hashab selection (primarily Acacia senegal); clean, uniform nodules; clear solution on dissolution.",
    hsCode: "130120",
    originCountries: ["Sudan", "Somalia", "Ethiopia"],
    specs: {
      productName: "Arabic Gum Grade One",
      botanicalSource: "Acacia senegal (primarily)",
      appearance: "Pale yellow to white nodules, clean and uniform",
      purity: "Min. 95% soluble gum",
      moistureContent: "Max 10%",
      ashContent: "Max 3%",
      pH_1pct: "4.5–5.5",
      odor: "Odorless or slightly characteristic",
      taste: "Mild, slightly sweet",
      solubility: "Fully soluble in water, forms a clear solution",
      applicationAreas: "Food & beverage, pharmaceuticals, cosmetics, printing inks",
    },
    packaging: "25 kg multi-wall bags (jumbo on request)",
    moqKg: 1000,
    incoterms: ["FOB", "CFR", "CIF"],
    leadTimeDays: 14,
    images: [
      "/product/gum_grade1.png",
    ],
    datasheetUrl: null,
    rfqDefaults: { unit: "kg" },
  },

  {
    id: "arabic-gum-grade-2",
    id2: "EPRD-100501",
    slug: "arabic-gum-grade-2",
    name: "Arabic Gum — Grade 2",
    category: "Gum Resins",
    summary:
      "Industrial/technical grade (Acacia senegal or seyal); consistent solubility for confectionery, beverages, pharma, textiles.",
    hsCode: "130120",
    originCountries: ["Sudan", "Somalia", "Ethiopia"],
    specs: {
      productName: "Arabic Gum Grade 2",
      botanicalSource: "Acacia senegal or Acacia seyal",
      appearance: "Light brown to reddish-brown granules or powder",
      purity: "Minimum 85% soluble gum",
      moistureContent: "Max 12%",
      ashContent: "Max 4%",
      pH_1pct: "4.0–5.5",
      odor: "Odorless or slight characteristic odor",
      taste: "Bland, slightly sweet",
      solubility: "Fully soluble in water, insoluble in alcohol",
      usageApplications: "Confectionery, beverages, pharmaceuticals, textiles",
    },
    packaging: "25 kg bags",
    moqKg: 1500,
    incoterms: ["FOB", "CIF"],
    leadTimeDays: 16,
    images: [
      "/product/arabic_gum_g2.png",
    ],
    datasheetUrl: null,
    rfqDefaults: { unit: "kg" },
  },

  // ————————————————— Myrrh —————————————————
  {
    id: "myrrh-gum-grade-one",
    id2: "EPRD-100502",
    slug: "myrrah-gum-grade-one",
    name: "Myrrh Gum — Grade One",
    category: "Gum Resins",
    summary:
      "Clean reddish- to yellow-brown resin exudate; suitable for perfumery, incense, oral care and traditional applications.",
    hsCode: "130190",
    originCountries: ["Somalia", "Ethiopia"],
    specs: {
      source: "Commiphora myrrha",
      appearance: "Reddish-brown to yellow-brown resin lumps",
      odor: "Warm, aromatic, slightly bitter",
      taste: "Bitter and aromatic",
      solubility: "Partially soluble in alcohol, insoluble in water",
      resinContent: "30–60%",
      gumContent: "25–40%",
      essentialOil: "5–10%",
      use: "Perfumery, incense, oral care, traditional medicine",
      form: "Natural dried exudate",
    },
    packaging: "25 kg bags",
    moqKg: 500,
    incoterms: ["FOB", "CIF"],
    leadTimeDays: 12,
    images: [
      "/product/product_myrrah1.png",
    ],
    datasheetUrl: null,
    rfqDefaults: { unit: "kg" },
  },

  {
    id: "myrrh-gum-grade-two",
     id2: "EPRD-100503",
    slug: "myrrah-gum-grade-two",
    name: "Myrrh Gum — Grade Two",
    category: "Gum Resins",
    summary:
      "Commercial grade myrrh; same compositional ranges with wider visual variance; suited to incense/perfumery bases.",
    hsCode: "130190",
    originCountries: ["Somalia", "Ethiopia"],
    specs: {
      source: "Commiphora myrrha",
      appearance: "Reddish-brown to yellow-brown resin lumps",
      odor: "Warm, aromatic, slightly bitter",
      taste: "Bitter and aromatic",
      solubility: "Partially soluble in alcohol, insoluble in water",
      resinContent: "30–60%",
      gumContent: "25–40%",
      essentialOil: "5–10%",
      use: "Perfumery, incense, oral care, traditional medicine",
      form: "Natural dried exudate",
    },
    packaging: "25 kg bags",
    moqKg: 500,
    incoterms: ["FOB", "CIF"],
    leadTimeDays: 12,
    images: [
      "/product/product_myrrah2.png",
    ],
    datasheetUrl: null,
    rfqDefaults: { unit: "kg" },
  },

  // ————————————————— Opoponax —————————————————
  {
    id: "opoponax-gum",
    id2: "EPRD-100504",
    slug: "oppoponax-gum",
    name: "Opoponax Gum",
    category: "Gum Resins",
    summary:
      "Warm balsamic, myrrh-like aroma; traditional perfumery and incense resin with defined resin/gum/oil ranges.",
    hsCode: "130190",
    originCountries: ["Somalia", "Ethiopia"],
    specs: {
      productName: "Opoponax Gum",
      botanicalSource: "Commiphora erythraea or Commiphora guidottii",
      appearance: "Reddish-brown to dark brown lumps or tears",
      odor: "Warm, sweet, balsamic, myrrh-like aroma",
      taste: "Bitter and aromatic",
      solubility: "Partially soluble in alcohol, poorly soluble in water",
      meltingPoint: "Softens around 85–95°C",
      resinContent: "60–70%",
      essentialOilContent: "5–10%",
      gumContent: "20–30%",
      applicationAreas: "Perfumery, incense, traditional medicine, aromatherapy",
    },
    packaging: "25 kg bags",
    moqKg: 600,
    incoterms: ["FOB", "CFR"],
    leadTimeDays: 15,
    images: [
      // site page doesn't show a file name, keep local/placeholder if you have assets
      "/product/product_oppoponax.png",
    ],
    datasheetUrl: null,
    rfqDefaults: { unit: "kg" },
  },

  // ————————————————— Frankincense —————————————————
  {
    id: "frankincense-resin",
     id2: "EPRD-100505",
    slug: "frankincense-rasin",
    name: "Frankincense — Resin",
    category: "Gum Resins",
    summary:
      "Pale-to-golden tears with fresh woody/citrus-balsamic aroma; used in incense, aromatherapy, skincare.",
    hsCode: "130190",
    originCountries: ["Somalia", "Ethiopia"],
    specs: {
      source: "Boswellia species (e.g., Boswellia sacra, Boswellia serrata)",
      appearance: "Pale yellow to golden or amber resin tears",
      odor: "Fresh, woody, citrus-balsamic aroma",
      taste: "Slightly bitter, aromatic",
      solubility: "Partially soluble in alcohol, insoluble in water",
      resinContent: "60–85%",
      gumContent: "6–16%",
      essentialOil: "5–10%",
      use: "Incense, aromatherapy, skincare, traditional medicine",
      form: "Natural hardened resin (granules or tears)",
    },
    packaging: "25 kg bags",
    moqKg: 400,
    incoterms: ["FOB", "CIF"],
    leadTimeDays: 10,
    images: [
      "/product/product_frankinecense.png",
    ],
    datasheetUrl: null,
    rfqDefaults: { unit: "kg" },
  },
];

// ───────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────
export const listProducts = () => PRODUCTS;
export const getProductBySlug = (slug) => PRODUCTS.find((p) => p.slug === slug) || null;

export default PRODUCTS;
