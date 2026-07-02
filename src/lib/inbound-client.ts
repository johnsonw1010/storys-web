// Client-side submit wiring for the inbound forms on /contact and /apply.
// POSTs as application/x-www-form-urlencoded — a "simple" CORS request, so the
// Apps Script endpoint needs no preflight handling (it can't answer OPTIONS).
import { INBOUND_ENDPOINT, INBOUND_SECRET, CONTACT_EMAIL } from "./inbound";

const ERROR_ZH = "送出失敗，請稍後再試。";
const ERROR_EN = "Something went wrong — please try again later.";

function errorNote(): HTMLElement {
  const note = document.createElement("p");
  note.className = "form__error";
  note.setAttribute("role", "alert");
  const text = `${ERROR_ZH} ${ERROR_EN}`;
  if (CONTACT_EMAIL) {
    note.append(`${text} `);
    const a = document.createElement("a");
    a.href = `mailto:${CONTACT_EMAIL}`;
    a.textContent = CONTACT_EMAIL;
    note.append(a);
  } else {
    note.textContent = text;
  }
  return note;
}

export function wireInboundForms() {
  document.querySelectorAll<HTMLFormElement>("form[data-inbound]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      form.querySelector(".form__error")?.remove();

      // Honeypot: pretend success so bots don't retry.
      const hp = form.querySelector<HTMLInputElement>('input[name="bot-field"]');
      const successUrl = form.getAttribute("action") ?? window.location.pathname + "?sent=1";
      if (hp && hp.value) {
        window.location.assign(successUrl);
        return;
      }

      const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const btnLabel = btn?.textContent ?? "";
      if (btn) {
        btn.disabled = true;
        btn.textContent = "送出中…";
      }

      try {
        if (!INBOUND_ENDPOINT) throw new Error("inbound endpoint not configured");

        const body = new URLSearchParams();
        body.set("_secret", INBOUND_SECRET);
        for (const [key, value] of new FormData(form).entries()) {
          if (typeof value === "string" && key !== "bot-field") body.set(key, value);
        }

        const res = await fetch(INBOUND_ENDPOINT, { method: "POST", body });
        const out = await res.json();
        if (!res.ok || !out.ok) throw new Error(out.error ?? `HTTP ${res.status}`);

        window.location.assign(successUrl);
      } catch (err) {
        console.error("[inbound]", err);
        form.append(errorNote());
        if (btn) {
          btn.disabled = false;
          btn.textContent = btnLabel;
        }
      }
    });
  });
}
