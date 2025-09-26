"use client";

import { useTranslations } from "next-intl";
import { Link } from "../../../../i18n/navigation";
import { brand } from "../../config/brand";
import { siteNav } from "../../config/site";
import Image from "next/image";

export default function Footer() {
    const tFooter = useTranslations("Footer");     // footer-only strings
    const tRoot = useTranslations();               // root translator for siteNav(t)

    const year = new Date().getFullYear();

    // Build Quick Links from config/site with i18n labels
    let quickLinks;
    try {
        quickLinks = siteNav?.(tRoot);
    } catch {
        quickLinks = [
            { label: tRoot("nav.home"), href: "/" },
            { label: tRoot("nav.products"), href: "/products" },
            { label: tRoot("nav.about"), href: "/about" },
            { label: tRoot("nav.quality"), href: "/quality" },
            { label: tRoot("nav.contact"), href: "/contact" }
        ];
    }

    // You can wire product links from config too if you expose them there.
    const productLinks = [
        { label: "Arabic Gum — Grade 1", href: "/products/arabic-gum-grade-one" },
        { label: "Arabic Gum — Grade 2", href: "/products/arabic-gum-grade-2" },
        { label: "View All", href: "/products" }
    ];

    const socials = [
        { label: "WhatsApp", href: "#", icon: WhatsAppIcon },
        { label: "LinkedIn", href: "#", icon: LinkedInIcon },
        { label: "X", href: "#", icon: XIcon }
    ];

    return (
        <footer
            className="relative text-white overflow-hidden"
            style={{ backgroundColor: brand.colors.primary }}
        >
            {/* Background radial gradient with animation */}
            <div
                className="absolute inset-0 z-0 opacity-40 animate-[pulse_6s_ease-in-out_infinite]"
                style={{
                    background:
                        "radial-gradient(circle at 50% 120%, rgba(255,208,40,0.2), rgba(26,35,54,0.1) 40%)"
                }}
            />

            {/* Gradient hairline */}
            <div
                className="h-[3px] w-full"
                style={{
                    background: `linear-gradient(90deg, ${brand.colors.accent}, ${brand.colors.primary}, ${brand.colors.accent})`,
                    opacity: 0.9
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main grid */}
                <div className="py-16">
                    <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-16">
                        {/* About */}
                        <div className="col-span-1 sm:col-span-2 md:col-span-1">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-yellow-400 grid place-items-center shadow-md animate-[pop_900ms_ease-out_1] group">
                                    <div className="relative h-8 w-8">
                                        <Image
                                            src="/east_logo2.png"            // use "/east_logo.png" if that's your file
                                            alt="East Logo"
                                            fill
                                            className="object-contain transition-transform duration-300 ease-out will-change-transform group-hover:scale-110"
                                            draggable={false}
                                            priority
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-base font-extrabold tracking-wide">
                                        {brand.name}
                                    </div>
                                    <div className="text-xs text-white/60">{brand.slogan}</div>
                                </div>
                            </div>
                            <p className="mt-4 max-w-sm text-sm text-white/70 text-justify">
                                {brand.des}
                            </p>

                            {/* Socials */}
                            <div className="mt-5 flex items-center gap-3">
                                {socials.map(({ label, href, icon: Icon }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        aria-label={label}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/90 transition hover:bg-white/10 hover:scale-110"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Icon />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold tracking-wide">
                                {tFooter("quickLinks")}
                            </h4>
                            <ul className="mt-4 space-y-2 text-sm">
                                {quickLinks?.map((l) => (
                                    <li key={l.href}>
                                        <FooterSmartLink href={l.href}>{l.label}</FooterSmartLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Products */}
                        <div>
                            <h4 className="text-sm font-semibold tracking-wide">
                                {tFooter("products")}
                            </h4>
                            <ul className="mt-4 space-y-2 text-sm">
                                {productLinks.map((p) => (
                                    <li key={`${p.href}-${p.label}`}>
                                        <FooterSmartLink href={p.href}>{p.label}</FooterSmartLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-sm font-semibold tracking-wide">
                                {tFooter("contact")}
                            </h4>
                            <address className="mt-4 space-y-3 not-italic text-sm text-white/80">
                                <div>
                                    <div className="font-semibold">{tFooter("headquarters")}</div>
                                    <div>{brand?.hq ?? "Nairobi, Kenya"}</div>
                                </div>
                                <div className="pt-2">
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
                                    >
                                        {tFooter("getInTouch")}
                                        <ArrowRight />
                                    </Link>
                                </div>
                            </address>
                        </div>
                    </div>
                </div>

                {/* Legal */}
                <div className="border-t border-white/10 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-white/60">
                        © {year} {brand.name} — {brand.slogan}. {tFooter("rights")}
                    </p>
                    <div className="flex gap-4 text-sm">
                        <FooterSmartLink href={'#'}>{tFooter("legalPrivacy")}</FooterSmartLink>
                        <FooterSmartLink href={'/contact'}>{tFooter("legalContact")}</FooterSmartLink>
                    </div>
                </div>

                <div className="text-center">
                    <a
                        href="https://aimmj.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-1 text-xs pt-3 pb-2 
               text-white/60 transition-all duration-300 hover:text-white 
               hover:-translate-y-0.5 transform-gpu"
                    >
                        <span>Powered by</span>
                        <span className="font-semibold">Aimmj</span>

                        {/* subtle arrow appears on hover */}
                        <svg
                            viewBox="0 0 24 24"
                            className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 
                 group-hover:translate-x-0 transition-all duration-300"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <path d="M7 17L17 7" />
                            <path d="M10 7h7v7" />
                        </svg>

                        {/* gradient underline grows on hover */}
                        <span
                            aria-hidden
                            className="pointer-events-none absolute left-1/2 bottom-1 h-px w-0 -translate-x-1/2 
                 bg-gradient-to-r from-yellow-300 via-white to-yellow-300 
                 transition-all duration-300 group-hover:w-24"
                        />
                    </a>
                </div>


            </div>
        </footer>
    );
}


function FooterSmartLink({ href, children }) {
    const isExternal = /^https?:\/\//i.test(href || "");
    const cls =
        "group relative inline-flex items-center gap-1 text-sm text-white/70 " +
        "transition-all duration-300 hover:text-white hover:-translate-y-0.5 transform-gpu";

    const content = (
        <>
            <span>{children}</span>
            {/* subtle arrow reveal */}
            <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
                <path d="M7 17L17 7" />
                <path d="M10 7h7v7" />
            </svg>
            {/* gradient underline */}
            <span
                aria-hidden
                className="pointer-events-none absolute left-0 -bottom-1 h-px w-0 
                   bg-gradient-to-r from-yellow-300 via-white to-yellow-300 
                   transition-all duration-300 group-hover:w-full"
            />
        </>
    );

    return isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
            {content}
        </a>
    ) : (
        <Link href={href} className={cls}>
            {content}
        </Link>
    );
}


/* --- Icons --- */
function ArrowRight() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
        </svg>
    );
}

function WhatsAppIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M20.5 3.5A11.9 11.9 0 0 0 12.1 0C5.5 0 .2 5.3.2 11.9c0 2.1.6 4.2 1.6 6.1L0 24l6.2-1.6c1.8 1 3.9 1.6 6 1.6 6.6 0 12-5.3 12-11.9 0-3.2-1.3-6.2-3.5-8.6ZM12.1 21.2A9.3 9.3 0 0 1 7.3 19l-.3-.2-3.7 1 .9-3.6-.2-.4c-.9-1.5-1.4-3.2-1.4-5 0-5.2 4.2-9.4 9.5-9.4 2.5 0 4.9 1 6.6 2.8 1.8 1.7 2.8 4.2 2.8 6.6 0 5.2-4.3 9.4-9.4 9.4Zm5.4-6.9c-.3-.1-1.8-.9-2-.9-.3-.1-.5-.1-.7.2l-1 1.1c-.2.2-.3.2-.6.1-1.6-.8-2.8-2-3.3-3.3-.1-.2 0-.4.1-.6l.4-.5c.2-.2.2-.4.1-.6-.2-.6-.6-1.4-.9-2.1-.2-.6-.5-.5-.7-.6H8c-.3 0-.8.1-1.1.4-.3.3-1.1 1.1-1.1 2.5 0 1.5 1.1 3 1.2 3.2.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.3.2 1.9.1.6-.1 1.7-.7 2-1.4.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.3Z" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.86-3.04-1.87 0-2.16 1.46-2.16 2.96v5.65H9.32V9h3.41v1.56h.05c.48-.91 1.65-1.86 3.39-1.86 3.62 0 4.29 2.38 4.29 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2H21.5l-7.59 8.67L22.5 22h-6.73l-5.27-6.4L4.4 22H1.14l8.11-9.27L1 2h6.85l4.76 5.78L18.24 2zm-2.36 18h1.96L8.2 4H6.18l9.706 16z" />
        </svg>
    );
}
