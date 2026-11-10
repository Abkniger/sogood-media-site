functions/api/devis.js
// Configure RESEND_API_KEY and FROM_EMAIL in Cloudflare Pages > Settings > Variables and Secrets.
const DESTINATION = "issoufoutanda@gmail.com";

function clean(value, max = 3000) {
  return String(value == null ? "" : value).trim().slice(0, max);
}

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot anti-spam: silently accept automated submissions without sending mail.
  if (clean(data.honeypot, 200)) {
    return Response.json({ ok: true });
  }

  const nom = clean(data.nom, 160);
  if (!nom) return Response.json({ ok: false, error: "missing_name" }, { status: 400 });

  if (!env.RESEND_API_KEY || !env.FROM_EMAIL) {
    return Response.json({ ok: false, error: "email_service_not_configured" }, { status: 503 });
  }

  const fields = [
    ["Nom", nom],
    ["Événement", clean(data.evenement, 160) || "Non précisé"],
    ["Date", clean(data.date, 80) || "À définir"],
    ["Lieu", clean(data.lieu, 300) || "À définir"],
    ["Besoins", clean(data.besoins, 1500) || "À préciser"],
    ["Précisions", clean(data.precisions, 3000) || "Aucune"]
  ];
  const plainText = "Nouvelle demande de devis – So’Good Media\n\n" +
    fields.map(([label, value]) => `${label} : ${value}`).join("\n");

  let response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: [DESTINATION],
        subject: `Nouvelle demande de devis – ${nom}`,
        text: plainText
      })
    });
  } catch {
    return Response.json({ ok: false, error: "email_provider_unreachable" }, { status: 502 });
  }

  if (!response.ok) {
    return Response.json({ ok: false, error: "email_provider_error" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
