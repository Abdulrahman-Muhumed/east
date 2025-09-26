"use client";

import React, { useState } from "react";
import Hero2 from "../../../components/blocks/Hero2";
import { useTranslations } from "next-intl";

/* Inline SVG Icons */
const MailIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.916a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const PhoneIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.35-1.005-.98-1.15l-4.322-1.08a1.125 1.125 0 00-1.285.484l-2.427 3.64c-1.424-.52-2.885-1.34-4.25-2.704a14.244 14.244 0 01-2.704-4.25l3.64-2.427a1.125 1.125 0 00.484-1.285l-1.08-4.322a1.125 1.125 0 00-1.15-.98H3.75A2.25 2.25 0 001.5 4.5v2.25z" />
    </svg>
);

const MapPinIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5a3 3 0 110 6 3 3 0 010-6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 4.232-4.232 8.464-8.732 10.568-1.63.483-3.37-.433-3.37-2.182V10.5h12v-2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.232 0-7.7-1.748-9.456-4.996a7.5 7.5 0 01-1.3-4.348c0-.756.09-1.5.257-2.227L2 9.5l.4-.4c.3-.3.7-.45 1.1-.45H21.5c.4 0 .8.15 1.1.45l.4.4.457-1.134c.167.727.257 1.47.257 2.227A7.5 7.5 0 0121 16.004C19.248 19.252 15.77 21 12 21z" />
    </svg>
);

const CheckCircleIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

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
    const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", subject: "", message: "" });
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);

    const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

    const onSubmit = (email) => {
        e.preventDefault();
        setLoading(true);
        // TODO: replace with real POST if desired
        setTimeout(() => {
            setLoading(false);
            setOk(true);
            setForm({ name: "", company: "", email: "", phone: "", subject: "", message: "" });
        }, 1200);
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

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            aria-busy={loading}
                            className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="relative z-10 flex flex-col items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-8rem)]">
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
                    {/* Left: Contact Info with background */}
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

                    {/* Right: Contact Form */}
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
