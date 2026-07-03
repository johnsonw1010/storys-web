/**
 * Storys inbound forms — Google Apps Script Web App.
 * Receives POSTs from the site's contact / sponsor / brand-application forms,
 * appends a row to a tab in THIS spreadsheet, and emails a notification.
 *
 * Install (once, ~10 min — see docs/plans/inbound-forms.md):
 *  1. Create a new Google Sheet named "Storys Inbound" (separate from the
 *     Master Sheet — leads stay apart from content).
 *  2. Extensions → Apps Script → paste this file over Code.gs.
 *  3. Fill in CONFIG below (NOTIFY_EMAIL; keep SECRET in sync with
 *     src/lib/inbound.ts INBOUND_SECRET).
 *  4. Deploy → New deployment → type "Web app" → Execute as: Me →
 *     Who has access: Anyone → Deploy → copy the Web app URL.
 *  5. Paste that URL into INBOUND_ENDPOINT in src/lib/inbound.ts, rebuild, deploy.
 */

const CONFIG = {
  // Must match INBOUND_SECRET in src/lib/inbound.ts. Public value — it only
  // filters drive-by POSTs, it is not a security boundary.
  SECRET: "storys-inbound-v1",
  // Where notification emails go. Multiple: "a@x.com,b@y.com".
  NOTIFY_EMAIL: "johnson@yourbizvoice.com",
  // form-name (hidden field on the site) → tab name + column order.
  FORMS: {
    "contact": {
      sheet: "inbound_contact",
      fields: ["name", "email", "message"],
    },
    "sponsor": {
      sheet: "inbound_sponsor",
      fields: ["name", "email", "company", "budget", "window", "message"],
    },
    "brand-application": {
      sheet: "inbound_apply",
      fields: ["brand", "founder", "email", "website", "story", "timing"],
    },
  },
};

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};

    if (p["_secret"] !== CONFIG.SECRET) return respond({ ok: false, error: "bad secret" });

    const formName = p["form-name"];
    const form = CONFIG.FORMS[formName];
    if (!form) return respond({ ok: false, error: "unknown form" });

    // Server-side honeypot backstop (client also filters).
    if (p["bot-field"]) return respond({ ok: true });

    const row = [new Date()].concat(
      form.fields.map(function (f) {
        return String(p[f] || "").slice(0, 5000); // cap runaway payloads
      })
    );

    const sheet = ensureSheet(form.sheet, ["timestamp"].concat(form.fields));
    sheet.appendRow(row);

    MailApp.sendEmail({
      to: CONFIG.NOTIFY_EMAIL,
      subject: "[Storys inbound] " + formName + (p["name"] || p["brand"] ? " — " + (p["name"] || p["brand"]) : ""),
      body:
        form.fields
          .map(function (f) { return f + ": " + (p[f] || ""); })
          .join("\n") +
        "\n\n(row appended to tab '" + form.sheet + "')",
    });

    return respond({ ok: true });
  } catch (err) {
    return respond({ ok: false, error: String(err) });
  }
}

/** Get the tab by name, creating it with a header row if missing. */
function ensureSheet(name, headers) {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function respond(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
