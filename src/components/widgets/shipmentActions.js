/**
 * Shipment action engine.
 *
 * Deterministic, rules-based "next steps" for a shipment. The assistant/chat bot
 * can simply read these objects out loud — the eligibility windows themselves are
 * computed here so the UI, the notifications and the bot never disagree.
 */

const DELAY_INSURANCE_WINDOW_HOURS = { AIR: 24, OCEAN: 48 };

const MS_HOUR = 1000 * 60 * 60;

/** Parses M/D/YYYY (optionally with " ,h:mm:ss am/pm") into a Date, or null. */
function parseDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const [datePart] = String(value).split(",");
  const parts = datePart.trim().split(/[/-]/).map((p) => parseInt(p, 10));
  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  const [m, d, y] = parts;
  return new Date(y, m - 1, d);
}

const firstDate = (list) =>
  list
    .map(parseDate)
    .filter(Boolean)
    .sort((a, b) => a - b)[0] || null;

const lastDate = (list) => {
  const dates = list.map(parseDate).filter(Boolean);
  return dates.length ? new Date(Math.max(...dates)) : null;
};

const everyContainerHas = (containers, key) =>
  containers.length > 0 && containers.every((c) => Boolean(c[key]));

/** Extracts the milestones the triggers depend on. */
function getMilestones(shipment) {
  const containers = shipment?.details?.containerDetails || [];
  return {
    departed: parseDate(shipment?.details?.atd),
    arrived: firstDate(containers.map((c) => c.arrived)),
    discharged: everyContainerHas(containers, "discharge")
      ? lastDate(containers.map((c) => c.discharge))
      : null,
    collected: everyContainerHas(containers, "gateOut")
      ? lastDate(containers.map((c) => c.gateOut))
      : null,
  };
}

const fmt = (date) =>
  date
    ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

const fmtHours = (hours) => {
  if (hours <= 0) return "now";
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 48) return `${Math.round(hours)} h`;
  return `${Math.round(hours / 24)} days`;
};

/**
 * Returns the four trigger cards for a shipment.
 * state: "action" | "offer" | "waiting" | "expired"
 */
export function getShipmentTriggers(shipment, now = new Date()) {
  const mode = shipment?.mode === "AIR" ? "AIR" : "OCEAN";
  const { departed, arrived, discharged, collected } = getMilestones(shipment);
  const windowHours = DELAY_INSURANCE_WINDOW_HOURS[mode];
  const triggers = [];

  /* ---------------------------------------------------------- Delay insurance */
  if (!departed) {
    triggers.push({
      key: "delay-insurance",
      title: "Delay Insurance",
      icon: "ri-shield-check-line",
      state: "action",
      message:
        "The shipment has not departed yet — this is the best time to add delay insurance.",
      meta: `Cover stays available until ${windowHours}h after departure (${mode.toLowerCase()} freight).`,
      cta: "Get delay insurance",
      action: "insurance",
    });
  } else {
    const elapsed = (now - departed) / MS_HOUR;
    if (elapsed <= windowHours) {
      triggers.push({
        key: "delay-insurance",
        title: "Delay Insurance",
        icon: "ri-shield-check-line",
        state: "action",
        message: `Departed ${fmtHours(elapsed)} ago. You can still buy delay insurance.`,
        meta: `Window closes in ${fmtHours(windowHours - elapsed)} (${windowHours}h after ATD).`,
        cta: "Get delay insurance",
        action: "insurance",
      });
    } else {
      triggers.push({
        key: "delay-insurance",
        title: "Delay Insurance",
        icon: "ri-shield-check-line",
        state: "expired",
        message: "The allowed period for delay insurance has passed.",
        meta: `Eligible bracket: before departure until ${windowHours}h after ATD (${fmt(
          departed,
        )} → ${fmt(new Date(departed.getTime() + windowHours * MS_HOUR))}). Air freight: 24h · Sea freight: 48h.`,
      });
    }
  }

  /* ------------------------------------------------------------------- eC82 XML */
  if (!departed) {
    triggers.push({
      key: "ec82",
      title: "eC82 XML",
      icon: "ri-file-code-line",
      state: "waiting",
      message: "eC82 generation opens once the vessel/aircraft has departed.",
      meta: "Prepare BL, commercial invoice and packing list in the meantime.",
    });
  } else if (!discharged) {
    triggers.push({
      key: "ec82",
      title: "eC82 XML",
      icon: "ri-file-code-line",
      state: "action",
      message:
        "Cargo is in transit — upload the BL, commercial invoice, packing list (or all documents) to generate the eC82 XML template.",
      meta: "Also attach: licences, permits, certificate of origin, preferential rate claims and any Other Governmental Agency documents.",
      cta: "Upload documents",
      action: "ec82",
    });
  } else {
    triggers.push({
      key: "ec82",
      title: "eC82 XML",
      icon: "ri-file-code-line",
      state: "expired",
      message: "The time period for eC82 submission has passed (cargo already discharged).",
      meta: `Eligible bracket: departure (${fmt(departed)}) → discharge (${fmt(discharged)}).`,
    });
  }

  /* --------------------------------------------------------------- Invoice audit */
  if (!arrived) {
    triggers.push({
      key: "invoice-audit",
      title: "Invoice Audit",
      icon: "ri-file-search-line",
      state: "waiting",
      message: "Invoice audit opens when the shipment arrives.",
      meta: "Freight, demurrage and detention invoices will be checked line by line.",
    });
  } else if (!collected) {
    triggers.push({
      key: "invoice-audit",
      title: "Invoice Audit",
      icon: "ri-file-search-line",
      state: "action",
      message:
        "Shipment has arrived but is not collected — upload freight, demurrage and detention invoices for audit and checks.",
      meta: "Recommended: open the D&D management tool to stop free-time charges from accruing.",
      cta: "Upload invoices",
      action: "invoice-audit",
      secondaryCta: "Open D&D tool",
      secondaryAction: "dnd",
    });
  } else {
    triggers.push({
      key: "invoice-audit",
      title: "Invoice Audit",
      icon: "ri-file-search-line",
      state: "expired",
      message: "The time period for invoice audit has passed (cargo already collected).",
      meta: `Eligible bracket: arrival (${fmt(arrived)}) → gate out (${fmt(collected)}).`,
    });
  }

  /* ----------------------------------------------------------------- 3PL services */
  if (!arrived) {
    triggers.push({
      key: "3pl",
      title: "3PL Services",
      icon: "ri-truck-line",
      state: "action",
      message: "The vessel has not arrived yet — request haulage, warehousing or customs brokerage.",
      meta: "Booking before arrival avoids storage and demurrage exposure.",
      cta: "Request services",
      action: "3pl",
    });
  } else if (collected) {
    triggers.push({
      key: "3pl",
      title: "3PL Services",
      icon: "ri-truck-line",
      state: "offer",
      message:
        "Cargo has been collected. Would you like a quotation to budget future shipments on this lane?",
      meta: "We use this shipment's actuals as the baseline.",
      cta: "Generate quotation",
      action: "3pl-quote",
    });
  } else {
    triggers.push({
      key: "3pl",
      title: "3PL Services",
      icon: "ri-truck-line",
      state: "action",
      message: "Cargo has arrived and is awaiting collection — last chance to book delivery services.",
      meta: "Request trucking, devanning or storage now.",
      cta: "Request services",
      action: "3pl",
    });
  }

  return triggers;
}

/* ------------------------------------------------------------------ Tool map ---- */

const TOOL_MAP_ITEMS = [
  { key: "insurance", label: "Insurance", group: "Risk" },
  { key: "bl", label: "Bill of Lading", group: "Documents" },
  { key: "invoice", label: "Caricom / Commercial Invoice", group: "Documents" },
  { key: "packingList", label: "Packing List", group: "Documents" },
  { key: "license", label: "License", group: "Compliance" },
  { key: "permit", label: "Permit", group: "Compliance" },
  { key: "coo", label: "Certificate of Origin", group: "Compliance" },
  { key: "oga", label: "Other Governmental Agencies", group: "Compliance" },
  { key: "ec82", label: "EC82", group: "Customs" },
  { key: "vendor", label: "Vendor Services", group: "Services" },
  { key: "invoiceAudit", label: "Invoice Audit", group: "Services" },
];

export const TOOL_STATUS_META = {
  completed: { label: "Completed", className: "tool-pill tool-pill--completed", icon: "ri-check-line" },
  submitted: { label: "Submitted", className: "tool-pill tool-pill--submitted", icon: "ri-send-plane-line" },
  pending: { label: "Pending", className: "tool-pill tool-pill--pending", icon: "ri-time-line" },
  update: { label: "Update", className: "tool-pill tool-pill--update", icon: "ri-edit-2-line" },
  error: { label: "Error", className: "tool-pill tool-pill--error", icon: "ri-error-warning-line" },
  na: { label: "Not applicable", className: "tool-pill tool-pill--na", icon: "ri-subtract-line" },
  void: { label: "Void", className: "tool-pill tool-pill--void", icon: "ri-close-circle-line" },
};

/** Statuses that require the user to do something. */
const ACTIONABLE_TOOL_STATUSES = ["update", "error"];

export function getToolMap(shipment) {
  const overrides = shipment?.tools || {};
  return TOOL_MAP_ITEMS.map((item) => {
    const value = overrides[item.key];
    const entry = typeof value === "string" ? { status: value } : value || {};
    const status = entry.status && TOOL_STATUS_META[entry.status] ? entry.status : "pending";
    return {
      ...item,
      status,
      note: entry.note || "",
      updated: entry.updated || "—",
      actionable: ACTIONABLE_TOOL_STATUSES.includes(status),
    };
  });
}
