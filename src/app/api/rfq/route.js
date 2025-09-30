// app/api/rfq/route.js
import nodemailer from "nodemailer";


function makeRef(id2) {
  const ts = Date.now().toString(36).toUpperCase().slice(-5); // short time chunk
  const rx = Math.random().toString(36).toUpperCase().slice(2, 6); // 4-char random
  return `${id2}-${ts}${rx}`; // e.g. EPRD-100500-K9X3Z
}

export async function POST(req) {
  try {
    const d = await req.json();

    // required fields
    const required = ["product", "productName", "company", "contactName", "email", "quantity", "unit", "incoterm"];
    const missing = required.filter((k) => !d?.[k]);
    if (missing.length) {
      return new Response(JSON.stringify({ error: `Missing fields: ${missing.join(", ")}` }), { status: 400 });
    }

    const referenceId = makeRef(d.productId2); // <-- use the passed id2

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true", // false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // comment this out unless you truly need to accept self-signed certs
      // tls: { rejectUnauthorized: process.env.SMTP_REJECT_UNAUTH === "true" }
    });

    const fromAddr = process.env.SMTP_FROM || process.env.SMTP_USER;
    const salesInbox = 'sales@east-hides.com'; // e.g. sales@east-hides.com
    if (!salesInbox) {
      return new Response(JSON.stringify({ error: "Missing SALES_INBOX env" }), { status: 500 });
    }

    // --- Email to Sales ---
    await transporter.sendMail({
      from: `"EAST Hides RFQ Bot" <${fromAddr}>`,
      to: salesInbox,
      subject: `RFQ — ${d.productName} (${d.product}) [${referenceId}]`,
      text: plainRFQText(d, referenceId),
      html: htmlRFQTemplate(d, referenceId),
    });

    // --- Optional confirmation to requester ---
    if (process.env.MAIL_CONFIRM === "true") {
      await transporter.sendMail({
        from: `"EAST Hides Sales" <${fromAddr}>`,
        to: d.email,
        subject: `We received your RFQ — ${d.productName} [${referenceId}]`,
        text: plainConfirmText(d, referenceId),
        html: htmlConfirmTemplate(d, referenceId),
      });
    }

    return new Response(JSON.stringify({ ok: true, referenceId }), { status: 200 });
  } catch (err) {
    console.error("RFQ mail error:", err);
    return new Response(JSON.stringify({ error: "Failed to send request" }), { status: 500 });
  }
}

/* ---------------- helpers ---------------- */
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanitize(d = {}) {
  const s = (v) => (typeof v === "string" ? v.trim() : v);
  return {
    product: s(d.product),
    productName: s(d.productName),
    productId2:productId2,
    company: s(d.company),
    contactName: s(d.contactName),
    email: s(d.email),
    destination: s(d.destination) || "",
    quantity: s(d.quantity),
    unit: s(d.unit),
    incoterm: s(d.incoterm),
    message: s(d.message) || "",
    originUrl: s(d.originUrl) || "",
  };
}

/* ── Plain text fallbacks ───────────────── */
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

/* ── HTML templates ─────────────────────── */
function htmlRFQTemplate2(d, refid) {
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
    <div style="${line}"><div style="${label}">Product Ref</div><div style="${val}">${refid}</div></div>

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

function htmlRFQTemplate(d,refid) {
  const ACCENT = "#0b2a6b";
  const SOFT = "#eef2f7";

  const row = "padding:10px 0;border-bottom:1px solid #e5e7eb;";
  const k = "display:inline-block;width:140px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.06em;font-weight:700;";
  const v = "color:#0f172a;font-weight:600;";


  const mailtoCustomer = `mailto:${escapeHtml(d.email)}?subject=${encodeURIComponent(
    "Re: RFQ " + escapeHtml(d.productName)
  )}`;
  const mailtoSales = `mailto:sales@east-hides.com?subject=${encodeURIComponent(
    "Quote: " + escapeHtml(d.productName) + " — " + refid
  )}&body=${encodeURIComponent(
    `RFQ Ref: ${refid}\nProduct: ${d.productName}\nQty: ${d.quantity} ${d.unit}\nIncoterm: ${d.incoterm}\nDestination: ${d.destination || "-"}\nCompany: ${d.company}\nContact: ${d.contactName} <${d.email}>\n\nMessage:\n${d.message || "-"}`
  )}`;

  return `
  <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:720px;margin:auto;padding:20px 18px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;">
    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid ${ACCENT};padding-bottom:10px;margin-bottom:18px;">
      <div>
        <div style="font-size:22px;font-weight:800;color:${ACCENT};margin:0;">New RFQ</div>
        <div style="font-size:12px;color:#64748b;margin-top:4px;">Submitted via website · ${new Date().toISOString()}</div>
      </div>
      <div style="background:${SOFT};padding:8px 10px;border-radius:8px;font-weight:800;color:${ACCENT};font-size:12px;white-space:nowrap;">
        Ref: ${refid}
      </div>
    </div>

    <!-- Summary -->
    <div style="background:${SOFT};border:1px solid #dde3ee;border-radius:10px;padding:14px 12px;margin-bottom:14px;">
      <div style="display:flex;flex-wrap:wrap;gap:12px;">
        <div style="min-width:220px;">
          <div style="${k}">Product</div>
          <div style="${v}">${escapeHtml(d.productName)} <span style="color:#6b7280;font-weight:600;">(${escapeHtml(d.product)})</span></div>
        </div>
        <div style="min-width:160px;">
          <div style="${k}">Quantity</div>
          <div style="${v}">${escapeHtml(d.quantity)} ${escapeHtml(d.unit)}</div>
        </div>
        <div style="min-width:140px;">
          <div style="${k}">Incoterm</div>
          <div style="${v}">${escapeHtml(d.incoterm)}</div>
        </div>
        <div style="min-width:200px;">
          <div style="${k}">Destination</div>
          <div style="${v}">${escapeHtml(d.destination || "-")}</div>
        </div>
      </div>
    </div>

    <!-- Customer -->
    <div style="${row}">
      <span style="${k}">Company</span>
      <span style="${v}">${escapeHtml(d.company)}</span>
    </div>
    <div style="${row}">
      <span style="${k}">Contact</span>
      <span style="${v}">${escapeHtml(d.contactName)}</span>
    </div>
    <div style="${row}">
      <span style="${k}">Email</span>
      <a href="${mailtoCustomer}" style="${v};text-decoration:none;color:${ACCENT};">${escapeHtml(d.email)}</a>
    </div>

    <!-- Message -->
    <div style="padding:12px 0;">
      <div style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.06em;font-weight:800;margin-bottom:6px;">Message</div>
      <div style="color:#0f172a;line-height:1.6;white-space:pre-wrap;border:1px solid #e5e7eb;border-radius:8px;padding:12px;background:#fafafa;">
        ${escapeHtml(d.message || "-")}
      </div>
    </div>

    <!-- Meta -->
    <div style="margin-top:8px;color:#6b7280;font-size:12px;line-height:1.6;">
      Product Ref: ${escapeHtml(d.id2 || "-")}
    </div>

    <!-- Actions -->
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;">
      <a href="${mailtoCustomer}" style="display:inline-block;background:${ACCENT};color:#fff;text-decoration:none;font-weight:800;font-size:13px;padding:10px 14px;border-radius:10px;">Reply to customer</a>
    </div>

    <!-- Footer / Brand Mark -->
    <div style="margin-top:18px;padding-top:12px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;text-align:center;">
      <div style="margin-top:14px;">
        <div style="margin-top:6px;color:#9ca3af;">© ${new Date().getFullYear()} East Hides & investment company LTD</div>
      </div>
    </div>
  </div>`;
}

function htmlConfirmTemplate(d, refid) {
  const brandPrimary = "#0B2A6B"; // EAST blue
  const brandAccent = "#FFD028"; // EAST yellow
  const line = "border-bottom:1px solid #e5e7eb;padding:10px 0;";
  const label = "display:inline-block;width:130px;color:#6b7280;font-size:12px;letter-spacing:.02em;text-transform:uppercase;";
  const val = "font-weight:700;color:#111827;";

  return `
  <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:640px;margin:auto;padding:0;background:#f8fafc;">
    <!-- Brand Bar -->
    <div style="background:linear-gradient(90deg, ${brandPrimary} 0%, ${brandAccent} 100%);padding:16px 18px;border-top-left-radius:12px;border-top-right-radius:12px;color:#0f172a;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="color:white;font-weight:700;opacity:.95">Request Confirmation Message</div>
      </div>
    </div>

    <!-- Card -->
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;border-bottom-left-radius:12px;border-bottom-right-radius:12px;padding:20px 18px;">
      <!-- Header -->
      <h2 style="margin:2px 0 8px;color:#111827;font-size:20px;letter-spacing:-.01em;">We’ve received your Request for Quote</h2>
      <div style="color:#6b7280;font-size:14px;margin-bottom:14px;">
        Thank you, <span style="font-weight:600;color:#111827;">${escapeHtml(d.contactName)}</span>. Your inquiry is now in our queue.
      </div>

      <!-- Reference -->
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;margin-bottom:18px;">
        <div style="font-size:12px;color:#6b7280;letter-spacing:.02em;text-transform:uppercase;margin-bottom:6px;">RFQ Reference ID</div>
        <div style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;font-weight:700;color:${brandPrimary};">
          ${refid}
        </div>
      </div>

      <!-- Summary -->
      <div style="${line}">
        <span style="${label}">Product</span>
        <span style="${val}">${escapeHtml(d.productName)}</span>
      </div>
      <div style="${line}">
        <span style="${label}">Quantity</span>
        <span style="${val}">${escapeHtml(d.quantity)} ${escapeHtml(d.unit)}</span>
      </div>
      <div style="${line}">
        <span style="${label}">Incoterm</span>
        <span style="${val}">${escapeHtml(d.incoterm)}</span>
      </div>
      <div style="${line}">
        <span style="${label}">Destination</span>
        <span style="${val}">${escapeHtml(d.destination || "Not specified")}</span>
      </div>

      <!-- Next steps -->
      <div style="margin-top:14px;color:#374151;line-height:1.6;">
        We’ll prepare pricing and logistics and reply with a formal quotation
        <strong>within 1–2 business days</strong>.
      </div>

      <!-- Contact block -->
      <div style="margin-top:18px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px;">
        <div style="font-size:12px;color:#6b7280;letter-spacing:.02em;text-transform:uppercase;margin-bottom:6px;">Contact</div>
        <div style="font-weight:700;color:#111827;">EAST Hides Sales Team — </div>
        <div style="margin-top:4px;">
          <a href="mailto:sales@east-hides.com" style="color:${brandPrimary};text-decoration:none;">sales@east-hides.com</a>
          <span style="color:#9ca3af"> · </span>
        </div>
      </div>

      <!-- Trust / Security -->
      <div style="margin-top:16px;color:#6b7280;font-size:12px;line-height:1.55;">
        This message was sent by <strong>east-hides.com</strong>.
        If you did not submit this request, please ignore this email or contact
        <a href="mailto:sales@east-hides.com" style="color:${brandPrimary};text-decoration:none;">sales@east-hides.com</a>.
      </div>

      <div style="margin-top:18px;padding-top:12px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;text-align:center;">
      <div style="margin-top:14px;">
        <div style="margin-top:6px;color:#9ca3af;">© ${new Date().getFullYear()} EAST Hides & investment company LTD</div>
      </div>
    </div>

    </div>
  </div>`;
}

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
