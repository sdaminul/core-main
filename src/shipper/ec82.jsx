import { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Form, Button, Table } from "react-bootstrap";

/* ---------- static option lists (mirrored from the live eC82 builder) ---------- */

const CUSTOMS_OFFICES = [
  { value: "TTPOS", label: "TTPOS — Port of Spain" },
  { value: "TTPTS", label: "TTPTS — Point Lisas" },
];

const DELIVERY_TERMS = ["FOB", "CIF", "CFR", "EXW", "FCA", "FAS", "CPT", "CIP", "DAP", "DPU", "DDP"];

const CURRENCIES = ["USD", "TTD", "EUR", "GBP", "JPY", "CAD", "CNY"];

const PACKAGE_TYPES = [
  { value: "CT", label: "Carton" },
  { value: "PK", label: "Package" },
  { value: "PL", label: "Pallet" },
  { value: "BX", label: "Box" },
  { value: "BG", label: "Bag" },
  { value: "DR", label: "Drum" },
  { value: "NE", label: "Unpacked" },
];

const CONDITIONS = [
  { value: "NEW", label: "New" },
  { value: "USED", label: "Used" },
];

const OUTCOMES = [
  { value: "CORRECT", label: "Correct: The result matched your review" },
  { value: "MISSED_ISSUE", label: "Missed issue: A known problem was not flagged" },
  { value: "FALSE_POSITIVE", label: "False positive: A flag was incorrect or misleading" },
  { value: "UNABLE_TO_ASSESS", label: "Unable to assess: The file or result could not be verified" },
];

/* ISO-3166 alpha-2 list used by the live builders for country selects */
export const COUNTRIES = [
  ["AF", "Afghanistan"], ["AX", "Åland Islands"], ["AL", "Albania"], ["DZ", "Algeria"],
  ["AS", "American Samoa"], ["AD", "Andorra"], ["AO", "Angola"], ["AI", "Anguilla"],
  ["AQ", "Antarctica"], ["AG", "Antigua & Barbuda"], ["AR", "Argentina"], ["AM", "Armenia"],
  ["AW", "Aruba"], ["AU", "Australia"], ["AT", "Austria"], ["AZ", "Azerbaijan"],
  ["BS", "Bahamas"], ["BH", "Bahrain"], ["BD", "Bangladesh"], ["BB", "Barbados"],
  ["BY", "Belarus"], ["BE", "Belgium"], ["BZ", "Belize"], ["BJ", "Benin"],
  ["BM", "Bermuda"], ["BT", "Bhutan"], ["BO", "Bolivia"], ["BA", "Bosnia & Herzegovina"],
  ["BW", "Botswana"], ["BV", "Bouvet Island"], ["BR", "Brazil"], ["IO", "British Indian Ocean Territory"],
  ["VG", "British Virgin Islands"], ["BN", "Brunei"], ["BG", "Bulgaria"], ["BF", "Burkina Faso"],
  ["BI", "Burundi"], ["KH", "Cambodia"], ["CM", "Cameroon"], ["CA", "Canada"],
  ["CV", "Cape Verde"], ["BQ", "Caribbean Netherlands"], ["KY", "Cayman Islands"], ["CF", "Central African Republic"],
  ["TD", "Chad"], ["CL", "Chile"], ["CN", "China"], ["CX", "Christmas Island"],
  ["CC", "Cocos (Keeling) Islands"], ["CO", "Colombia"], ["KM", "Comoros"], ["CG", "Congo - Brazzaville"],
  ["CD", "Congo - Kinshasa"], ["CK", "Cook Islands"], ["CR", "Costa Rica"], ["CI", "Côte d’Ivoire"],
  ["HR", "Croatia"], ["CU", "Cuba"], ["CW", "Curaçao"], ["CY", "Cyprus"],
  ["CZ", "Czechia"], ["DK", "Denmark"], ["DJ", "Djibouti"], ["DM", "Dominica"],
  ["DO", "Dominican Republic"], ["EC", "Ecuador"], ["EG", "Egypt"], ["SV", "El Salvador"],
  ["GQ", "Equatorial Guinea"], ["ER", "Eritrea"], ["EE", "Estonia"], ["SZ", "Eswatini"],
  ["ET", "Ethiopia"], ["FK", "Falkland Islands (Islas Malvinas)"], ["FO", "Faroe Islands"], ["FJ", "Fiji"],
  ["FI", "Finland"], ["FR", "France"], ["GF", "French Guiana"], ["PF", "French Polynesia"],
  ["TF", "French Southern Territories"], ["GA", "Gabon"], ["GM", "Gambia"], ["GE", "Georgia"],
  ["DE", "Germany"], ["GH", "Ghana"], ["GI", "Gibraltar"], ["GR", "Greece"],
  ["GL", "Greenland"], ["GD", "Grenada"], ["GP", "Guadeloupe"], ["GU", "Guam"],
  ["GT", "Guatemala"], ["GG", "Guernsey"], ["GN", "Guinea"], ["GW", "Guinea-Bissau"],
  ["GY", "Guyana"], ["HT", "Haiti"], ["HM", "Heard & McDonald Islands"], ["HN", "Honduras"],
  ["HK", "Hong Kong"], ["HU", "Hungary"], ["IS", "Iceland"], ["IN", "India"],
  ["ID", "Indonesia"], ["IR", "Iran"], ["IQ", "Iraq"], ["IE", "Ireland"],
  ["IM", "Isle of Man"], ["IL", "Israel"], ["IT", "Italy"], ["JM", "Jamaica"],
  ["JP", "Japan"], ["JE", "Jersey"], ["JO", "Jordan"], ["KZ", "Kazakhstan"],
  ["KE", "Kenya"], ["KI", "Kiribati"], ["KW", "Kuwait"], ["KG", "Kyrgyzstan"],
  ["LA", "Laos"], ["LV", "Latvia"], ["LB", "Lebanon"], ["LS", "Lesotho"],
  ["LR", "Liberia"], ["LY", "Libya"], ["LI", "Liechtenstein"], ["LT", "Lithuania"],
  ["LU", "Luxembourg"], ["MO", "Macao"], ["MG", "Madagascar"], ["MW", "Malawi"],
  ["MY", "Malaysia"], ["MV", "Maldives"], ["ML", "Mali"], ["MT", "Malta"],
  ["MH", "Marshall Islands"], ["MQ", "Martinique"], ["MR", "Mauritania"], ["MU", "Mauritius"],
  ["YT", "Mayotte"], ["MX", "Mexico"], ["FM", "Micronesia"], ["MD", "Moldova"],
  ["MC", "Monaco"], ["MN", "Mongolia"], ["ME", "Montenegro"], ["MS", "Montserrat"],
  ["MA", "Morocco"], ["MZ", "Mozambique"], ["MM", "Myanmar (Burma)"], ["NA", "Namibia"],
  ["NR", "Nauru"], ["NP", "Nepal"], ["NL", "Netherlands"], ["NC", "New Caledonia"],
  ["NZ", "New Zealand"], ["NI", "Nicaragua"], ["NE", "Niger"], ["NG", "Nigeria"],
  ["NU", "Niue"], ["NF", "Norfolk Island"], ["KP", "North Korea"], ["MK", "North Macedonia"],
  ["MP", "Northern Mariana Islands"], ["NO", "Norway"], ["OM", "Oman"], ["PK", "Pakistan"],
  ["PW", "Palau"], ["PS", "Palestine"], ["PA", "Panama"], ["PG", "Papua New Guinea"],
  ["PY", "Paraguay"], ["PE", "Peru"], ["PH", "Philippines"], ["PN", "Pitcairn Islands"],
  ["PL", "Poland"], ["PT", "Portugal"], ["PR", "Puerto Rico"], ["QA", "Qatar"],
  ["RE", "Réunion"], ["RO", "Romania"], ["RU", "Russia"], ["RW", "Rwanda"],
  ["WS", "Samoa"], ["SM", "San Marino"], ["ST", "São Tomé & Príncipe"], ["SA", "Saudi Arabia"],
  ["SN", "Senegal"], ["RS", "Serbia"], ["SC", "Seychelles"], ["SL", "Sierra Leone"],
  ["SG", "Singapore"], ["SX", "Sint Maarten"], ["SK", "Slovakia"], ["SI", "Slovenia"],
  ["SB", "Solomon Islands"], ["SO", "Somalia"], ["ZA", "South Africa"], ["GS", "South Georgia & South Sandwich Islands"],
  ["KR", "South Korea"], ["SS", "South Sudan"], ["ES", "Spain"], ["LK", "Sri Lanka"],
  ["BL", "St. Barthélemy"], ["SH", "St. Helena"], ["KN", "St. Kitts & Nevis"], ["LC", "St. Lucia"],
  ["MF", "St. Martin"], ["PM", "St. Pierre & Miquelon"], ["VC", "St. Vincent & Grenadines"], ["SD", "Sudan"],
  ["SR", "Suriname"], ["SJ", "Svalbard & Jan Mayen"], ["SE", "Sweden"], ["CH", "Switzerland"],
  ["SY", "Syria"], ["TW", "Taiwan"], ["TJ", "Tajikistan"], ["TZ", "Tanzania"],
  ["TH", "Thailand"], ["TL", "Timor-Leste"], ["TG", "Togo"], ["TK", "Tokelau"],
  ["TO", "Tonga"], ["TT", "Trinidad & Tobago"], ["TN", "Tunisia"], ["TR", "Türkiye"],
  ["TM", "Turkmenistan"], ["TC", "Turks & Caicos Islands"], ["TV", "Tuvalu"], ["UM", "U.S. Outlying Islands"],
  ["VI", "U.S. Virgin Islands"], ["UG", "Uganda"], ["UA", "Ukraine"], ["AE", "United Arab Emirates"],
  ["GB", "United Kingdom"], ["US", "United States"], ["UY", "Uruguay"], ["UZ", "Uzbekistan"],
  ["VU", "Vanuatu"], ["VA", "Vatican City"], ["VE", "Venezuela"], ["VN", "Vietnam"],
  ["WF", "Wallis & Futuna"], ["EH", "Western Sahara"], ["YE", "Yemen"], ["ZM", "Zambia"],
  ["ZW", "Zimbabwe"],
];

/* ---------- test checklist (mirrors the live "eC82 prototype — test checklist" panel) ---------- */

const CHECKLIST_ROWS = [
  {
    step: "Document upload & reading",
    passed: "PDF uploads, is typed correctly (B/L / CARICOM / commercial invoice), and fields appear in Section 2.",
    failed: "Upload errors, wrong document type on a clearly-labelled document, or no fields extracted from a digital PDF.",
    manual: "Scanned/photo documents — the tool marks them 'manual entry'; fields must be typed in.",
  },
  {
    step: "Extracted fields",
    passed: "Exporter, consignee, B/L number, currency, invoice total, gross weight and shipped-on-board date match the source documents.",
    failed: "A value contradicts the source document (wrong total, wrong party, wrong port).",
    manual: "Fields the documents genuinely don't contain (consignee code, declarant code) — always typed by the broker.",
  },
  {
    step: "Items",
    passed: "Invoice line items appear with quantity and value; the item sum matches Box 22 total.",
    failed: "Items missing from a digital invoice, or values misread.",
    manual: "Consolidating many receipt lines into fewer declaration items is broker judgement.",
  },
  {
    step: "HS / tariff match",
    passed: "Searching a goods description returns TT tariff lines with duty rate and unit; selecting one fills Box 33.",
    failed: "Tariff service errors on repeated searches, or an obviously wrong chapter is the only suggestion.",
    manual: "Final classification is always the broker's call — search suggests, human selects.",
  },
  {
    step: "Missing docs / licence flags",
    passed: "Missing B/L blocks the draft; motor vehicles and negative-list goods prompt for the import licence.",
    failed: "A mandatory box is empty but no flag appears.",
    manual: "Licence applicability edge cases (exemptions, returning nationals).",
  },
  {
    step: "Taxes (indicative)",
    passed: "ICD = duty rate × CIF, VAT = 12.5% on (CIF + ICD), using the entered exchange rate.",
    failed: "Arithmetic wrong for the given rate/FX inputs.",
    manual: "MVT, exemptions and zero-rating — outside the estimate by design.",
  },
  {
    step: "XML draft export",
    passed: "Downloaded XML opens as valid XML, mirrors the ASYCUDA SAD structure, and carries the entered values.",
    failed: "File invalid or values missing/mangled.",
    manual: "Import into ASYCUDA itself — needs broker credentials; not part of this prototype.",
  },
];

/* ---------- drafts (mirrors the live demo drafts) ---------- */

const DRAFTS = [
  {
    id: "25I17AB126",
    status: "Incomplete",
    statusVariant: "danger",
    summary: "2 documents · 1 item · Demo Shipper",
    borderColor: "red",
    documents: [
      {
        name: "SBT Japan Commercial Invoice.pdf",
        type: "Commercial Invoice",
        size: "312 KB",
        note: "Motor vehicle import — an approved Import Licence is required before the eC82 is submitted.",
      },
      {
        name: "Import License Approved and Signed.pdf",
        type: "Import Licence",
        size: "1.2 MB",
        scanned: true,
        note: "No readable text layer (scanned document) — fields must be entered manually.",
      },
    ],
    details: {
      customsOffice: "TTPOS",
      commercialRef: "25I17AB126",
      blNumber: "",
      exporter: "SBT CO., LTD.\nYokohama, Japan",
      consignee: "JOEL LOPEZ\n47 WALKER STREET, FREDERICK SETTLEMENT . CARONI TRINIDAD AND TOBAGO",
      consigneeCode: "",
      countryExport: "JP",
      vessel: "",
      portLoading: "ALL JAPAN PORT",
      container: "",
      shippedOnBoard: "24 Sep 2025",
      deliveryTerms: "CFR",
      currency: "USD",
      totalInvoice: "25240.00",
      exchangeRate: "6.7800",
      freight: "",
      insurance: "",
      grossMass: "1380",
      totalPackages: "1",
    },
    items: [
      {
        description: "USED NISSAN XTRAIL: CHASSIS NO. SNT33-032396",
        hsCode: "87032290",
        nationalCode: "100",
        origin: "JP",
        price: "25240.00",
        quantity: "1",
        packages: "1",
        packageType: "NE",
        grossKg: "1380",
        netKg: "1242",
        condition: "USED",
        licenceNo: "",
        duty: "Duty 20%",
        tariff: "Tariff: 8703.22.90 — Other (unit: kg&u)",
      },
    ],
    readiness: [
      { level: "danger", icon: "ri-close-line", title: "Bill of Lading missing (code 705)", text: "The transport document (Box 40) is mandatory — upload the Bill of Lading / Airway Bill." },
      { level: "danger", icon: "ri-close-line", title: "Transport document missing (Box 40)", text: "Enter the B/L or AWB number." },
      { level: "warning", icon: "ri-alert-line", title: "CARICOM Invoice missing (code IV02)", text: "Attach the CARICOM Invoice or confirm it is not required for this shipment." },
      { level: "warning", icon: "ri-alert-line", title: "Exchange rate is indicative", text: "ASYCUDA applies the Central Bank rate in force on the day the declaration is accepted — confirm the rate before submission (shipped-on-board date drives it)." },
      { level: "warning", icon: "ri-alert-line", title: "Item 1: Import licence required — motor vehicle", text: "Road motor vehicles are on the import negative list. Attach the approved Import Licence from the Trade Licence Unit plus supporting documents (driver's permit / RHD declaration for personal use; dealer registration for dealers)." },
      { level: "warning", icon: "ri-alert-line", title: "Item 1: declared as USED (Box 39)", text: "Used goods can carry different licence and valuation treatment — confirm supporting documents." },
      { level: "warning", icon: "ri-alert-line", title: "Valuation method code needed (Box 43)", text: "Declared value exceeds TTD 6,000 — a V.M. code must be completed for all items in ASYCUDA." },
      { level: "success", icon: "ri-check-line", title: "Commercial Invoice attached (code IV05)", text: "SBT Japan Commercial Invoice.pdf" },
    ],
    taxes: {
      cif: "171,127.20",
      rows: [
        { item: "Item 1", cif: "171,127.20", tax: "ICD", base: "171,127.20", rate: "20%", amount: "34,225.44" },
        { item: "", cif: "", tax: "VAT", base: "205,352.64", rate: "12.5%", amount: "25,669.08" },
      ],
      total: "59,894.52",
      note: "Motor vehicles attract Motor Vehicle Tax based on engine size/age — not estimated here.",
    },
  },
  {
    id: "TT-O-0625-20-05",
    status: "Needs review",
    statusVariant: "warning",
    summary: "3 documents · 1 item · Demo Shipper",
    borderColor: "amber",
    documents: [
      {
        name: "caricom_invoice_TT-O-0625-20_CZA5.pdf",
        type: "CARICOM Invoice",
        size: "11 KB",
      },
      {
        name: "non_negotiable_bill_of_lading_TT-O-0625-20_CZA5.pdf",
        type: "Bill of Lading",
        size: "44 KB",
      },
      {
        name: "TAX INV CZAR 0625-20-05.pdf",
        type: "Commercial Invoice",
        size: "61 KB",
        scanned: true,
        note: "No readable text layer (scanned document) — fields must be entered manually.",
      },
    ],
    details: {
      customsOffice: "TTPOS",
      commercialRef: "TT-O-0625-20-05",
      blNumber: "TT-O-0625-20-05",
      exporter: "GUITAR CENTER 4005 N NORFLEET RD KANSAS CITY, MO, 64161",
      consignee: "CZAR 5 ENTERPRISES LIMITED # 5 Kingston Avenue, La Canoa Road, Lower Santa Cruz, Trinidad and Tobago",
      consigneeCode: "",
      countryExport: "US",
      vessel: "LILA HAREN",
      portLoading: "PORT EVERGLADES",
      container: "TGHU6297064",
      shippedOnBoard: "06/27/2025",
      deliveryTerms: "FOB",
      currency: "USD",
      totalInvoice: "1082.81",
      exchangeRate: "6.7800",
      freight: "",
      insurance: "",
      grossMass: "99.34",
      totalPackages: "1",
    },
    items: [
      {
        description: "MUSICAL INSTRUMENTS",
        hsCode: "92029000",
        nationalCode: "000",
        origin: "US",
        price: "1082.81",
        quantity: "1",
        packages: "1",
        packageType: "PK",
        grossKg: "99.34",
        netKg: "90.00",
        condition: "NEW",
        licenceNo: "",
        duty: "Duty 10%",
        tariff: "Tariff: 9202.90.00 — Other (guitars) (unit: kg&u)",
      },
    ],
    readiness: [
      { level: "warning", icon: "ri-alert-line", title: "Exchange rate is indicative", text: "ASYCUDA applies the Central Bank rate in force on the day the declaration is accepted — confirm the rate before submission (shipped-on-board date drives it)." },
      { level: "warning", icon: "ri-alert-line", title: "Valuation method code needed (Box 43)", text: "Declared value exceeds TTD 6,000 — a V.M. code must be completed for all items in ASYCUDA." },
      { level: "success", icon: "ri-check-line", title: "Bill of Lading attached (code 705)", text: "non_negotiable_bill_of_lading_TT-O-0625-20_CZA5.pdf" },
      { level: "success", icon: "ri-check-line", title: "CARICOM Invoice attached (code IV02)", text: "caricom_invoice_TT-O-0625-20_CZA5.pdf" },
      { level: "success", icon: "ri-check-line", title: "Commercial Invoice attached (code IV05)", text: "TAX INV CZAR 0625-20-05.pdf" },
    ],
    taxes: {
      cif: "7,341.45",
      rows: [
        { item: "Item 1", cif: "7,341.45", tax: "ICD", base: "7,341.45", rate: "10%", amount: "734.15" },
        { item: "", cif: "", tax: "VAT", base: "8,075.60", rate: "12.5%", amount: "1,009.45" },
      ],
      total: "1,743.59",
      note: null,
    },
  },
];

/* ---------- small presentational helpers ---------- */

function CountrySelect({ value }) {
  return (
    <Form.Select className="ec82-select" defaultValue={value || ""}>
      <option value="">Select...</option>
      {COUNTRIES.map(([code, name]) => (
        <option key={code} value={code}>{code} — {name}</option>
      ))}
    </Form.Select>
  );
}

function SectionCard({ step, title, subtitle, badge, children, headExtra }) {
  return (
    <div className="ec82-card">
      <div className="ec82-card-head">
        <div className="d-flex align-items-center gap-2">
          <span className="ec82-step">{step}</span>
          <div>
            <h2 className="ec82-h2">{title}</h2>
            <p className="ec82-sub">{subtitle}</p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          {badge}
          {headExtra}
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <Form.Label className="ec82-label">{label}</Form.Label>
      {children}
    </div>
  );
}

function DocumentRow({ doc }) {
  return (
    <div className="ec82-doc">
      <div className="d-flex align-items-center gap-2 min-w-0">
        <i className="ri-file-text-line ec82-doc-icon" />
        <div className="min-w-0">
          <p className="ec82-doc-name">{doc.name}</p>
          <p className="ec82-doc-meta">
            {doc.type} · {doc.size}{doc.scanned ? " · scanned — manual entry" : ""}
          </p>
          {doc.note && <p className="ec82-doc-note">{doc.note}</p>}
        </div>
      </div>
      <div className="d-flex align-items-center gap-1">
        <Button variant="light" size="sm" className="ec82-icon-btn" aria-label={`Download ${doc.name}`}>
          <i className="ri-download-line" />
        </Button>
        <Button variant="light" size="sm" className="ec82-icon-btn" aria-label={`Remove ${doc.name}`}>
          <i className="ri-delete-bin-line" />
        </Button>
      </div>
    </div>
  );
}

function ReadinessRow({ r }) {
  return (
    <div className={`ec82-flag ${r.level}`}>
      <i className={`${r.icon}`} />
      <div>
        <p className="ec82-flag-title">{r.title}</p>
        <p className="ec82-flag-text">{r.text}</p>
      </div>
    </div>
  );
}

function DraftEditor({ draft, onBack }) {
  const d = draft.details;
  const [items, setItems] = useState(draft.items);

  // Mirrors the live builder: a new item starts empty apart from
  // national code 000, package type "Package" and condition "New"
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        description: "",
        hsCode: "",
        nationalCode: "000",
        origin: "",
        price: "",
        quantity: "",
        packages: "",
        packageType: "PK",
        grossKg: "",
        netKg: "",
        condition: "NEW",
        licenceNo: "",
      },
    ]);
  };

  const removeItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <>
      {/* Draft header bar */}
      <div className="ec82-draft-bar">
        <div className="d-flex align-items-center gap-3">
          <p className="ec82-draft-ref">{draft.id}</p>
          <span className={`ec82-badge ec82-badge-${draft.statusVariant}`}>{draft.status}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Button variant="light" size="sm" className="ec82-sm-btn" disabled>Saved</Button>
          <Button variant="primary" size="sm" className="ec82-sm-btn">
            <i className="ri-download-line me-1" /> XML draft
          </Button>
        </div>
      </div>

      {/* Section 1: Shipment documents */}
      <SectionCard
        step="1"
        title="Shipment documents"
        subtitle="B/L, invoices, licences — fields are extracted automatically where the document is machine-readable."
      >
        <button type="button" className="ec82-dropzone">
          <i className="ri-upload-cloud-2-line ec82-drop-icon" />
          Drag and drop shipment documents here, or click to browse
        </button>
        <div className="ec82-doc-list">
          {draft.documents.map((doc) => (
            <DocumentRow key={doc.name} doc={doc} />
          ))}
        </div>
      </SectionCard>

      {/* Section 2: Shipment details */}
      <SectionCard
        step="2"
        title="Shipment details"
        subtitle="Extracted values are suggestions — verify each box against the source documents."
      >
        <Row className="g-3">
          <Col lg={4} md={6}>
            <Field label="Customs office (Box A)">
              <Form.Select className="ec82-select" defaultValue={d.customsOffice}>
                {CUSTOMS_OFFICES.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Form.Select>
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Commercial reference (Box 7)">
              <Form.Control className="ec82-input" defaultValue={d.commercialRef} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Transport document — B/L / AWB (Box 40)">
              <Form.Control className="ec82-input" defaultValue={d.blNumber} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Exporter — name & address (Box 2)">
              <Form.Control className="ec82-input" defaultValue={d.exporter} as="textarea" rows={2} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Importer/Consignee (Box 8)">
              <Form.Control className="ec82-input" defaultValue={d.consignee} as="textarea" rows={2} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Consignee code (Box 8)">
              <Form.Control className="ec82-input" placeholder="Customs-assigned code" defaultValue={d.consigneeCode} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Country of export (Box 15)">
              <CountrySelect value={d.countryExport} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Vessel / carrier">
              <Form.Control className="ec82-input" defaultValue={d.vessel} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Port of loading (Box 27)">
              <Form.Control className="ec82-input" defaultValue={d.portLoading} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Container numbers (Box 31)">
              <Form.Control className="ec82-input" defaultValue={d.container} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Shipped on board (drives FX rate)">
              <Form.Control className="ec82-input" placeholder="MM/DD/YYYY" defaultValue={d.shippedOnBoard} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Delivery terms (Box 20)">
              <Form.Select className="ec82-select" defaultValue={d.deliveryTerms}>
                {DELIVERY_TERMS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Form.Select>
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Currency (Box 22)">
              <Form.Select className="ec82-select" defaultValue={d.currency}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Total invoice in USD (Box 22)">
              <Form.Control className="ec82-input" defaultValue={d.totalInvoice} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Exchange rate to TTD (Box 23, indicative)">
              <Form.Control className="ec82-input" defaultValue={d.exchangeRate} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Freight in USD (if not in price)">
              <Form.Control className="ec82-input" defaultValue={d.freight} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Insurance in USD">
              <Form.Control className="ec82-input" defaultValue={d.insurance} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Gross mass kg (Box 35)">
              <Form.Control className="ec82-input" defaultValue={d.grossMass} />
            </Field>
          </Col>
          <Col lg={4} md={6}>
            <Field label="Total packages (Box 6)">
              <Form.Control className="ec82-input" defaultValue={d.totalPackages} />
            </Field>
          </Col>
        </Row>
      </SectionCard>

      {/* Section 3: Items & HS classification */}
      <SectionCard
        step="3"
        title="Items & HS classification"
        subtitle="Match each line to the TT Common External Tariff — duty rates come from the TTBizLink tariff service."
        headExtra={
          <Button variant="light" size="sm" className="ec82-sm-btn" onClick={addItem}>
            <i className="ri-add-line me-1" /> Add item
          </Button>
        }
      >
        {items.length === 0 ? (
          <p className="ec82-empty-items">No items yet — they are pre-filled from invoices, or add one manually.</p>
        ) : (
          <div className="ec82-items">
            {items.map((item, idx) => (
              <div className="ec82-item" key={idx}>
                <div className="ec82-item-head">
                  <p className="ec82-item-title">Item {idx + 1}</p>
                  <div className="d-flex align-items-center gap-2">
                    {item.duty && <span className="ec82-duty">{item.duty}</span>}
                    <Button
                      variant="light"
                      size="sm"
                      className="ec82-icon-btn"
                      aria-label={`Remove item ${idx + 1}`}
                      onClick={() => removeItem(idx)}
                    >
                      <i className="ri-delete-bin-line" />
                    </Button>
                  </div>
                </div>
              <Row className="g-3">
                <Col lg={6} md={6}>
                  <Field label="Commercial description (Box 31)">
                    <Form.Control className="ec82-input" defaultValue={item.description} />
                  </Field>
                </Col>
                <Col lg={3} md={6}>
                  <Field label="HS code (Box 33)">
                    <div className="d-flex gap-2">
                      <Form.Control className="ec82-input" placeholder="8 digits" defaultValue={item.hsCode} />
                      <Button variant="light" className="ec82-icon-btn" aria-label="Search tariff">
                        <i className="ri-search-line" />
                      </Button>
                    </div>
                  </Field>
                </Col>
                <Col lg={3} md={6}>
                  <Field label="National code (Box 33)">
                    <Form.Control className="ec82-input" defaultValue={item.nationalCode} />
                  </Field>
                </Col>
                <Col lg={3} md={6}>
                  <Field label="Origin (Box 34)">
                    <CountrySelect value={item.origin} />
                  </Field>
                </Col>
                <Col lg={3} md={6}>
                  <Field label="Item price USD (Box 42)">
                    <Form.Control className="ec82-input" defaultValue={item.price} />
                  </Field>
                </Col>
                <Col lg={3} md={6}>
                  <Field label="Quantity (Box 41)">
                    <Form.Control className="ec82-input" defaultValue={item.quantity} />
                  </Field>
                </Col>
                <Col lg={3} md={6}>
                  <Field label="Packages (Box 31)">
                    <div className="d-flex gap-2">
                      <Form.Control className="ec82-input ec82-input-sm" defaultValue={item.packages} />
                      <Form.Select className="ec82-select" defaultValue={item.packageType}>
                        {PACKAGE_TYPES.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </Form.Select>
                    </div>
                  </Field>
                </Col>
                <Col lg={3} md={6}>
                  <Field label="Gross kg (Box 35)">
                    <Form.Control className="ec82-input" defaultValue={item.grossKg} />
                  </Field>
                </Col>
                <Col lg={3} md={6}>
                  <Field label="Net kg (Box 38)">
                    <Form.Control className="ec82-input" defaultValue={item.netKg} />
                  </Field>
                </Col>
                <Col lg={3} md={6}>
                  <Field label="Condition (Box 39)">
                    <Form.Select className="ec82-select" defaultValue={item.condition}>
                      {CONDITIONS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </Form.Select>
                  </Field>
                </Col>
                <Col lg={3} md={6}>
                  <Field label="Licence no. (Box 44, if required)">
                    <Form.Control className="ec82-input" defaultValue={item.licenceNo} />
                  </Field>
                </Col>
              </Row>
              {item.tariff && <p className="ec82-tariff">{item.tariff}</p>}
            </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Section 4: Readiness & missing documents */}
      <SectionCard
        step="4"
        title="Readiness & missing documents"
        subtitle="What still blocks this declaration, and what needs a human decision."
        badge={<span className={`ec82-badge ec82-badge-${draft.statusVariant}`}>{draft.status}</span>}
      >
        <div className="ec82-flags">
          {draft.readiness.map((r, i) => (
            <ReadinessRow key={i} r={r} />
          ))}
        </div>
      </SectionCard>

      {/* Section 5: Estimated duties & taxes */}
      <SectionCard
        step="5"
        title="Estimated duties & taxes"
        subtitle="Indicative only — ASYCUDA performs the official assessment with the Central Bank rate on the day of acceptance."
      >
        <div className="ec82-table-wrap">
          <Table className="ec82-tax-table" responsive>
            <thead>
              <tr>
                <th>Item</th>
                <th>CIF (TTD)</th>
                <th>Tax</th>
                <th>Base</th>
                <th>Rate</th>
                <th className="text-end">Amount (TTD)</th>
              </tr>
            </thead>
            <tbody>
              {draft.taxes.rows.map((row, i) => (
                <tr key={i}>
                  <td className="ec82-td-strong">{row.item}</td>
                  <td>{row.cif}</td>
                  <td>{row.tax}</td>
                  <td>{row.base}</td>
                  <td>{row.rate}</td>
                  <td className="text-end">{row.amount}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={5} className="text-end ec82-total-label">Estimated total</td>
                <td className="text-end ec82-total-value">{draft.taxes.total}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        {draft.taxes.note && (
          <p className="ec82-tax-note">
            <i className="ri-information-line" /> {draft.taxes.note}
          </p>
        )}
        <div className="ec82-export-row">
          <Button variant="primary">
            <i className="ri-download-line me-1" /> Download eC82 XML draft
          </Button>
          <Button variant="light" disabled>Save draft</Button>
        </div>
        <p className="ec82-disclaimer">
          This tool prepares a draft eC82/SAD for review by a licensed customs broker — it does not submit to ASYCUDA, and extracted values, HS matches and tax figures are suggestions that remain the declarant's responsibility.
        </p>
      </SectionCard>

      {/* Stakeholder feedback */}
      <section className="ec82-feedback" aria-label="Stakeholder feedback">
        <div className="d-flex align-items-start gap-2">
          <i className="ri-chat-3-line ec82-feedback-icon" />
          <div>
            <h3 className="ec82-h3">Review this result</h3>
            <p className="ec82-sub">Record what was correct, missed, or unclear so the test set improves the tool.</p>
          </div>
        </div>
        <Row className="g-3 align-items-center mb-4 mt-1">
          <Col md={3}>
            <Field label="Outcome">
              <Form.Select className="ec82-select" defaultValue="CORRECT">
                {OUTCOMES.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Form.Select>
            </Field>
          </Col>
          <Col md={7}>
            <Field label="Review notes">
              <Form.Control
                className="ec82-input"
                as="textarea"
                rows={2}
                placeholder="What did the tool get right or miss? Include the expected field or page when possible."
              />
            </Field>
          </Col>
          <Col md="auto">
            <Button variant="primary">
              <i className="ri-send-plane-line me-1" /> Save feedback
            </Button>
          </Col>
        </Row>
      </section>
    </>
  );
}

/* ---------- page ---------- */

function EC82() {
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [activeDraft, setActiveDraft] = useState(null);
  const [blRef, setBlRef] = useState("");

  const draft = DRAFTS.find((d) => d.id === activeDraft);

  return (
    <div className="container ec82-page">
      {/* Page header */}
      <div className="page-title d-block d-md-flex">
        <div>
          <h3 className="d-flex align-items-center gap-2">
            <i className="ri-file-transfer-line text-primary fw-normal" /> eC82 Declaration Builder
          </h3>
          <p className="ec82-intro">
            Upload shipment documents, review extracted fields, match HS codes, and export an ASYCUDA-ready XML draft.
          </p>
        </div>
        <div className="mt-2 mt-md-0">
          <Button
            variant="light"
            size="sm"
            className="ec82-sm-btn"
            onClick={() => setChecklistOpen(!checklistOpen)}
            aria-expanded={checklistOpen}
          >
            Test checklist <i className={`ri-arrow-down-s-line ms-1 ec82-chev ${checklistOpen ? "ec82-chev-open" : ""}`} />
          </Button>
        </div>
      </div>

      {checklistOpen && (
        <div className="ec82-card ec82-checklist">
          <h2 className="ec82-h2">eC82 prototype — test checklist</h2>
          <p className="ec82-sub">
            For each step: what counts as passed, failed, or expected manual work. Test with the sample shipment documents provided.
          </p>
          <div className="ec82-table-wrap">
            <Table className="ec82-check-table" responsive>
              <thead>
                <tr>
                  <th>Step</th>
                  <th className="ec82-th-pass">Passed</th>
                  <th className="ec82-th-fail">Failed</th>
                  <th className="ec82-th-manual">Manual review (expected)</th>
                </tr>
              </thead>
              <tbody>
                {CHECKLIST_ROWS.map((row) => (
                  <tr key={row.step}>
                    <td className="ec82-td-strong">{row.step}</td>
                    <td>{row.passed}</td>
                    <td>{row.failed}</td>
                    <td>{row.manual}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      {draft ? (
        <DraftEditor draft={draft} onBack={() => setActiveDraft(null)} />
      ) : (
        <div className="d-flex flex-column">
          {/* Step 1: Start a declaration draft */}
          <SectionCard
            step="1"
            title="Start a declaration draft"
            subtitle="The B/L reference is extracted after upload; manual entry is an optional fallback."
          >
            <div className="d-flex flex-wrap align-items-end gap-3">
              <div className="flex-grow-1 ec82-ref-field">
                <Field label="Shipment / B/L reference (optional fallback)">
                  <Form.Control
                    className="ec82-input"
                    placeholder="Extracted from a readable B/L"
                    value={blRef}
                    onChange={(e) => setBlRef(e.target.value)}
                  />
                </Field>
              </div>
              <Button variant="primary">
                <i className="ri-add-line me-1" /> New draft
              </Button>
            </div>
          </SectionCard>

          {/* Step 2: Drafts */}
          <SectionCard
            step="2"
            title="Drafts"
            subtitle="Open a draft to continue where you left off."
          >
            <div className="ec82-draft-list">
              {DRAFTS.map((d) => (
                <div
                  key={d.id}
                  className={`ec82-draft ec82-border-${d.borderColor}`}
                  onClick={() => setActiveDraft(d.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setActiveDraft(d.id)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <i className="ri-file-text-line ec82-doc-icon" />
                    <div>
                      <p className="ec82-draft-name">{d.id}</p>
                      <p className="ec82-doc-meta">{d.summary}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`ec82-badge ec82-badge-${d.statusVariant}`}>{d.status}</span>
                    <Button
                      variant="light"
                      size="sm"
                      className="ec82-icon-btn"
                      aria-label="Delete draft"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="ri-delete-bin-line" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}

export default EC82;
