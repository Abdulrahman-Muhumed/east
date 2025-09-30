"use client";

import React, { useState } from "react";
import Hero2 from "../../../components/blocks/Hero2";
import { useTranslations } from "next-intl";
import { MailIcon, PhoneIcon, MapPinIcon, CheckCircleIcon } from "lucide-react";

/* Small UI */
const ContactInfoCard = ({ icon, title, value }) => (
  <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm border border-white/30 transition-all hover:scale-105 duration-300 hover:shadow-lg">
    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-white/30">
      {React.cloneElement(icon, { className: "w-5 h-5 text-black", "aria-hidden": true })}
    </div>
    <div>
      <h3 className="text-black font-semibold text-lg">{title}</h3>
      <p className="text-black text-sm">{value}</p>
    </div>
  </div>
);

/* Form */
const ContactForm = () => {
  const t = useTranslations("Contact.form");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    topic: "",          // NEW: “sales” or “other” (required)
    hp: ""              // honeypot (anti-bot)
  });
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to send message");
      }
      setOk(true);
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        topic: "",
        hp: ""
      });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-white shadow-xl border border-slate-200">
      {ok ? (
        <div className="text-center py-20" aria-live="polite">
          <div className="flex justify-center mb-4">
            <CheckCircleIcon className="w-16 h-16 text-green-500" aria-hidden />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{t("sentTitle")}</h3>
          <p className="text-slate-600">{t("sentDesc")}</p>
          <button
            onClick={() => setOk(false)}
            className="mt-6 px-6 py-2 rounded-full text-sm font-medium transition-colors bg-slate-100 text-slate-800 hover:bg-slate-200"
          >
            {t("sendAnother")}
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {/* Honeypot */}
          <input
            type="text"
            name="company-website"
            tabIndex={-1}
            autoComplete="off"
            value={form.hp}
            onChange={(e) => onChange("hp", e.target.value)}
            className="hidden"
            aria-hidden="true"
          />

          {/* Reason (required) */}
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-600 mb-2">
              {t("topicLabel")}
            </label>
            <select
              id="topic"
              required
              value={form.topic}
              onChange={(e) => onChange("topic", e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <option value="">{t("topicLabel")}</option>
              <option value="sales">{t("topics.sales")}</option>
              <option value="other">{t("topics.other")}</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-2">{t("name")}</label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
                required
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-600 mb-2">{t("company")}</label>
              <input
                id="company"
                type="text"
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={form.company}
                onChange={(e) => onChange("company", e.target.value)}
                autoComplete="organization"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-2">{t("email")}</label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-600 mb-2">{t("phone")}</label>
              <input
                id="phone"
                type="tel"
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={form.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                autoComplete="tel"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-600 mb-2">{t("subject")}</label>
            <input
              id="subject"
              type="text"
              className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              value={form.subject}
              onChange={(e) => onChange("subject", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-600 mb-2">{t("message")}</label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              value={form.message}
              onChange={(e) => onChange("message", e.target.value)}
              required
            />
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="relative flex-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/40 disabled:opacity-60"
              style={{ background: "linear-gradient(90deg, #0b2a6b 0%, #ffd028 100%)" }}
            >
              {loading ? t("sending") : t("send")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

/* Page */
export default function ContactPage() {
  const t = useTranslations("Contact");

  return (
    <div className="min-h-screen font-sans text-slate-900 relative antialiased">
      <div className="relative z-10 flex flex-col items-center justify-center">
        <Hero2
          variant="image"
          bgImage="/product_bg.png"
          kicker={t("hero.kicker")}
          title={t("hero.title")}
          lastWord={t("hero.lastWord")}
          hasActionbtn="no"
          hasStats=""
          subtitle={t("hero.subtitle")}
          rotatingWords={t.raw("hero.rotating")}
        />

        {/* Contact Grid */}
        <div className="grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-xl border border-slate-200 w-full max-w-6xl">
          {/* Left */}
          <div
            className="p-8 sm:p-16 text-white space-y-8 bg-cover bg-center"
            style={{ backgroundImage: "url('/contact/contact_2.png')", backgroundColor: "black" }}
          >
            <h2 className="text-2xl font-bold text-white">{t("info.title")}</h2>
            <p className="text-white/80">{t("info.desc")}</p>
            <div className="grid gap-6 mt-6">
              <ContactInfoCard icon={<MailIcon />} title={t("info.emailTitle")} value={t("info.emailValue")} />
              <ContactInfoCard icon={<PhoneIcon />} title={t("info.phoneTitle")} value={t("info.phoneValue")} />
              <ContactInfoCard icon={<MapPinIcon />} title={t("info.locationTitle")} value={t("info.locationValue")} />
            </div>
          </div>

          {/* Right */}
          <ContactForm />
        </div>
      </div>

      {/* Map */}
      <div className="py-14 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-200">
          <div className="w-full h-96">
            <iframe
              title={t("map.title")}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.228581728283!2d36.81882068412803!3d-1.2920653556950295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf0cf2d24240952cb!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1684999999999!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
