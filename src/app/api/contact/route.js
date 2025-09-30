// app/api/contact/route.ts
import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        const data = await req.json();

        // Basic anti-bot: honeypot or missing topic
        if (data?.hp) return resp(200, { ok: true }); // silently succeed
        const required = ["name", "email", "message", "topic"];
        const missing = required.filter((k) => !data?.[k]);
        if (missing.length) return resp(400, { error: `Missing fields: ${missing.join(", ")}` });

        // Decide recipient on server (do NOT trust client)
        const recipient =
            data.topic === "sales"
                ? process.env.SALES_INBOX || "sales@east-hides.com"
                : process.env.INFO_INBOX || "info@east-hides.com";

        // SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === "true",
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            tls: {
                rejectUnauthorized: process.env.SMTP_REJECT_UNAUTH === "true",
            },
        });

        const subjectBase =
            data.topic === "sales" ? "Contact — Sales Inquiry" : "Contact — General Inquiry";

        // Email to East team
        await transporter.sendMail({
            from: process.env.SMTP_FROM || `"East Hides — Website" <${process.env.SMTP_USER}>`,
            to: recipient,
            replyTo: `${escapeHtml(data.name)} <${data.email}>`,
            subject: `${subjectBase}: ${data.subject || "(no subject)"}`,
            text: plainTeamText(data),
            html: htmlTeamTemplate(data),
        });

        // Optional auto-acknowledge to sender
        if (process.env.CONTACT_CONFIRM === "true") {
            await transporter.sendMail({
                from: process.env.SMTP_FROM || `"East Hides — No-Reply" <${process.env.SMTP_USER}>`,
                to: data.email,
                subject: "We received your message",
                text: plainAckText(data),
                html: htmlAckTemplate(data),
            });
        }

        return resp(200, { ok: true });
    } catch (e) {
        console.error("CONTACT mail error:", e);
        return resp(500, { error: "Failed to send message" });
    }
}

function resp(status, body) {
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

function plainTeamText(d) {
    return `New contact message

Topic: ${d.topic}
Name: ${d.name}
Company: ${d.company || "-"}
Email: ${d.email}
Phone: ${d.phone || "-"}

Subject: ${d.subject || "-"}
Message:
${d.message}

Time: ${new Date().toISOString()}
`;
}

function plainAckText(d) {
    return `Hi ${d.name},

Thanks for contacting East Hides. We received your message and will get back to you shortly.

Summary:
- Topic: ${d.topic}
- Subject: ${d.subject || "-"}

Best regards,
East Hides Team
`;
}

function htmlTeamTemplate(d) {
    const line = "border-bottom:1px solid #eee;padding:6px 0;";
    const label = "color:#64748b;font-size:12px;text-transform:uppercase;font-weight:800;letter-spacing:.08em;";
    const val = "font-weight:700;color:#0f172a;";
    return `
  <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:640px;margin:auto;padding:20px 16px;">
    <h2 style="margin:0 0 6px;color:#0b2a6b;">New Contact Message</h2>

    <div style="${line}"><div style="${label}">Topic</div><div style="${val}">${escapeHtml(d.topic)}</div></div>
    <div style="${line}"><div style="${label}">Name</div><div style="${val}">${escapeHtml(d.name)}</div></div>
    <div style="${line}"><div style="${label}">Company</div><div style="${val}">${escapeHtml(d.company || "-")}</div></div>
    <div style="${line}"><div style="${label}">Email</div><div style="${val}">${escapeHtml(d.email)}</div></div>
    <div style="${line}"><div style="${label}">Phone</div><div style="${val}">${escapeHtml(d.phone || "-")}</div></div>

    <div style="padding:10px 0 6px;">
      <div style="${label}">Subject</div>
      <div style="color:#0f172a;">${escapeHtml(d.subject || "-")}</div>
    </div>

    <div style="padding:10px 0 6px;">
      <div style="${label}">Message</div>
      <div style="color:#0f172a;white-space:pre-wrap;">${escapeHtml(d.message)}</div>
    </div>

    <div style="margin-top:14px;color:#64748b;font-size:12px;">
      Time: ${new Date().toISOString()}
    </div>
  </div>`;
}

function htmlAckTemplate(d) {
    return `
  <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:640px;margin:auto;padding:20px 16px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;">
    <div style="border-bottom:2px solid #0b2a6b;padding-bottom:12px;margin-bottom:16px;">
      <h1 style="margin:0;color:#0b2a6b;font-size:22px;font-weight:800;">East Hides</h1>
    </div>
    <p style="color:#111827;margin:0 0 10px;font-size:16px;"><strong>We received your message</strong></p>
    <p style="color:#374151;line-height:1.6;margin:0 0 16px;">Hi ${escapeHtml(d.name)}, thanks for reaching out. Our team will follow up shortly.</p>
    <ul style="color:#111827;line-height:1.8;padding-left:18px;margin:0 0 16px;">
      <li><b>Topic:</b> ${escapeHtml(d.topic)}</li>
      <li><b>Subject:</b> ${escapeHtml(d.subject || "-")}</li>
    </ul>
    <div style="margin-top:10px;color:#6b7280;font-size:13px;">This acknowledgement was sent from an unattended address.</div>
  </div>`;
}

function escapeHtml(s = "") {
    return String(s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
