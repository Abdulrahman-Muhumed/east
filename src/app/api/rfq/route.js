// app/api/rfq/route.js
import nodemailer from "nodemailer";

export async function POST(req) {
  try 
  {
    const data = await req.json();

    // Basic validation
    const required = ["product", "productName", "company", "contactName", "email", "quantity", "unit", "incoterm"];
    const missing = required.filter((k) => !data?.[k]);
    if (missing.length) {
      return new Response(JSON.stringify({ error: `Missing fields: ${missing.join(", ")}` }), { status: 400 });
    }

    // Build transporter (SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587/25
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        // If your server uses self-signed certs, you can allow it:
        rejectUnauthorized: process.env.SMTP_REJECT_UNAUTH === "true" ? true : false,
      },
    });

    // Compose email to EAST (sales)
    const toSales = {
      from: `"EAST RFQ Bot" <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO || "aim552355@gmail.com", // set in env
      subject: `RFQ — ${data.productName} (${data.product})`,
      text: plainRFQText(data),
      html: htmlRFQTemplate(data),
    };

    await transporter.sendMail(toSales);

    // Optional: confirmation to requester (toggle via env)
    if (process.env.MAIL_CONFIRM === "true") {
      await transporter.sendMail({
        from: `"EAST Sales" <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
        to: data.email,
        subject: `We received your RFQ — ${data.productName}`,
        text: plainConfirmText(data),
        html: htmlConfirmTemplate(data),
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("RFQ mail error:", err);
    return new Response(JSON.stringify({ error: "Failed to send request" }), { status: 500 });
  }
}

/* ── Plain text fallbacks ───────────────────────────────────── */
function plainRFQText(d) {
  return `New RFQ received

Product: ${d.productName} (${d.product})
Company: ${d.company}
Contact: ${d.contactName}
Email: ${d.email}
Destination: ${d.destination || "-"}
Quantity: ${d.quantity} ${d.unit}
Incoterm: ${d.incoterm}

Message:
${d.message || "-"}

Origin URL: ${d.originUrl || "-"}
Time: ${new Date().toISOString()}
`;
}

function plainConfirmText(d) {
  return `Hi ${d.contactName},

Thanks for your request for ${d.productName}. Our sales team has received your RFQ and will follow up shortly.

Summary
- Company: ${d.company}
- Quantity: ${d.quantity} ${d.unit}
- Incoterm: ${d.incoterm}
- Destination: ${d.destination || "-"}

Best regards,
EAST Sales
`;
}

/* ── HTML templates (simple, clean) ─────────────────────────── */
function htmlRFQTemplate(d) {
  const line = "border-bottom:1px solid #eee;padding:6px 0;";
  const label = "color:#64748b;font-size:12px;text-transform:uppercase;font-weight:800;letter-spacing:.08em;";
  const val = "font-weight:700;color:#0f172a;";
  return `
  <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:640px;margin:auto;padding:20px 16px;">
    <h2 style="margin:0 0 6px;color:#0b2a6b;">New RFQ</h2>
    <div style="color:#475569;margin-bottom:16px;">A user submitted a quote request on the website.</div>

    <div style="${line}"><div style="${label}">Product</div><div style="${val}">${escapeHtml(d.productName)} <span style="color:#64748b;font-weight:600;">(${escapeHtml(d.product)})</span></div></div>
    <div style="${line}"><div style="${label}">Company</div><div style="${val}">${escapeHtml(d.company)}</div></div>
    <div style="${line}"><div style="${label}">Contact</div><div style="${val}">${escapeHtml(d.contactName)}</div></div>
    <div style="${line}"><div style="${label}">Email</div><div style="${val}">${escapeHtml(d.email)}</div></div>
    <div style="${line}"><div style="${label}">Destination</div><div style="${val}">${escapeHtml(d.destination || "-")}</div></div>
    <div style="${line}"><div style="${label}">Quantity</div><div style="${val}">${escapeHtml(d.quantity)} ${escapeHtml(d.unit)}</div></div>
    <div style="${line}"><div style="${label}">Incoterm</div><div style="${val}">${escapeHtml(d.incoterm)}</div></div>

    <div style="padding:10px 0 6px;">
      <div style="${label}">Message</div>
      <div style="color:#0f172a;white-space:pre-wrap;">${escapeHtml(d.message || "-")}</div>
    </div>

    <div style="margin-top:14px;color:#64748b;font-size:12px;">
      Origin URL: ${escapeHtml(d.originUrl || "-")}<br/>
      Time: ${new Date().toISOString()}
    </div>

    <div style="margin-top:18px;border-radius:12px;padding:10px 12px;background:linear-gradient(90deg,#0b2a6b 0%,#ffd028 100%);color:#0f172a;font-weight:800;display:inline-block;">
      EAST — RFQ
    </div>
  </div>`;
}

function htmlConfirmTemplate(d) {
  return `
  <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:640px;margin:auto;padding:20px 16px;">
    <h2 style="margin:0 0 6px;color:#0b2a6b;">We received your RFQ</h2>
    <div style="color:#475569;margin-bottom:16px;">Hi ${escapeHtml(d.contactName)}, thanks for your interest. We’ll follow up shortly.</div>
    <ul style="color:#0f172a;line-height:1.7;padding-left:18px;margin:0;">
      <li><b>Product:</b> ${escapeHtml(d.productName)}</li>
      <li><b>Quantity:</b> ${escapeHtml(d.quantity)} ${escapeHtml(d.unit)}</li>
      <li><b>Incoterm:</b> ${escapeHtml(d.incoterm)}</li>
      <li><b>Destination:</b> ${escapeHtml(d.destination || "-")}</li>
    </ul>
    <div style="margin-top:18px;border-radius:12px;padding:10px 12px;background:linear-gradient(90deg,#0b2a6b 0%,#ffd028 100%);color:#0f172a;font-weight:800;display:inline-block;">
      EAST — Sales Team
    </div>
  </div>`;
}

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#39;");
}
