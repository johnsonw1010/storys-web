// Inbound form delivery config (see docs/plans/inbound-forms.md).
//
// INBOUND_ENDPOINT: the Google Apps Script Web App URL — filled in by Johnson
// after deploying scripts/apps-script/inbound-forms.gs (Deploy → Web app →
// "Anyone"). While empty, forms show an honest error instead of a fake success.
//
// INBOUND_SECRET must match CONFIG.SECRET in the deployed Apps Script. The site
// is static so this value is public — it only gates drive-by POSTs to the
// script URL, it is not a security boundary.
export const INBOUND_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzO11yNqVHDLV3ai2xgltMGvTwTMG-fxkSB-OAJ9gfVidVk1CNIEk5Jflz4BLG9p8ud/exec";
export const INBOUND_SECRET = "storys-inbound-v1";

// Shown as a fallback when submission fails (or the endpoint isn't wired yet).
// Leave empty to omit the mailto link — Johnson to decide the public address.
export const CONTACT_EMAIL = "";
