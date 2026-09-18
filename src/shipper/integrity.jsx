import { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Form, Button, Table } from "react-bootstrap";
import { COUNTRIES } from "./ec82";

/* ---------- test checklist (mirrors the live "Document integrity prototype - test checklist") ---------- */

const CHECKLIST_ROWS = [
  {
    step: "Upload and file reading",
    passed: "Supported files upload and appear in the check with the correct type and size.",
    failed: "A supported, readable file is rejected or omitted.",
    manual: "Password-protected, damaged, or unsupported files need separate review.",
  },
  {
    step: "Metadata",
    passed: "Available creation, modification, author, producer, and email-header clues are reported.",
    failed: "Metadata retained in the source file is missing from the result.",
    manual: "Missing metadata is a review flag, not proof of manipulation.",
  },
  {
    step: "Document changes",
    passed: "Detectable PDF revisions, overlapping text, or separate added objects are flagged with a location where possible.",
    failed: "A known detectable change is present but no review flag appears.",
    manual: "A clean re-render can remove edit history; compare with an original or trusted record when available.",
  },
  {
    step: "Origin clues",
    passed: "Declared origin is compared with available timezone, locale, software, or email clues.",
    failed: "A clear retained origin mismatch is not reported.",
    manual: "No location claim should be made when the file contains no usable origin clue.",
  },
  {
    step: "Customs package",
    passed: "The downloaded package contains the uploaded documents and a readable findings summary.",
    failed: "A document or recorded finding is missing from the package.",
    manual: "The reviewer makes the final determination; the tool only identifies review flags.",
  },
];

/* ---------- checks (mirrors the live demo checks) ---------- */

const FLAG_ICONS = {
  high: "ri-shield-cross-line",
  warning: "ri-alert-line",
  info: "ri-information-line",
};

const OUTCOMES = [
  { value: "CORRECT", label: "Correct: The result matched your review" },
  { value: "MISSED_ISSUE", label: "Missed issue: A known problem was not flagged" },
  { value: "FALSE_POSITIVE", label: "False positive: A flag was incorrect or misleading" },
  { value: "UNABLE_TO_ASSESS", label: "Unable to assess: The file or result could not be verified" },
];

const CHECKS = [
  {
    id: "awaiting-bl",
    title: "Awaiting B/L upload",
    risk: "LOW",
    riskVariant: "success",
    border: "green",
    meta: "1 document · declared origin American Samoa",
    date: "08/09/2026",
    documents: [
      {
        tag: "D1",
        name: "2026-09-06_192358.png",
        risk: "LOW",
        riskVariant: "success",
        type: "IMAGE",
        size: "14 KB",
        metadata: null,
        clean: "No review flags raised for this document.",
        originSummary: {
          level: "muted",
          label: "Origin inconclusive:",
          text: "No timezone, locale, or location clues were present in the file — origin cannot be checked.",
        },
        notes: [
          "No usable EXIF/embedded metadata — capture time, device, and location cannot be verified. Messaging apps and most export tools strip this routinely; not suspicious by itself.",
          "Visual compression analysis applies to JPEG only — skipped for this format.",
        ],
      },
    ],
  },
  {
    id: "meduj4571",
    title: "MEDUJ4571-TEST",
    risk: "HIGH",
    riskVariant: "danger",
    border: "red",
    meta: "6 documents · declared origin China",
    date: "07/07/2026",
    documents: [
      {
        tag: "D1",
        name: "clean.pdf",
        risk: "LOW",
        riskVariant: "success",
        type: "PDF",
        size: "1 KB",
        metadata: [
          ["Author", "Guangzhou Trading Co"],
          ["Created", "2026-06-01T09:04:12+08:00"],
          ["Creator", "Microsoft Word"],
          ["Modified", "2026-06-01T09:04:12+08:00"],
          ["Producer", "Microsoft: Print To PDF"],
        ],
        clean: "No review flags raised for this document.",
        originSummary: {
          level: "success",
          label: "Origin match:",
          text: "Timezone/locale clues are consistent with China.",
        },
      },
      {
        tag: "D2",
        name: "edited.pdf",
        risk: "HIGH",
        riskVariant: "danger",
        type: "PDF",
        size: "1 KB",
        metadata: [
          ["Author", "Guangzhou Trading Co"],
          ["Created", "2026-06-01T09:04:12+08:00"],
          ["Creator", "Microsoft Word"],
          ["Modified", "2026-07-05T21:45:30-04:00"],
          ["Producer", "iLovePDF"],
        ],
        flags: [
          { level: "info", title: "Modified after creation", severity: "info · high confidence", text: "Metadata records a modification 35.0 day(s) after creation (2026-06-01T09:04:12+08:00 → 2026-07-05T21:45:30-04:00). Normal for many workflows; review alongside other flags." },
          { level: "warning", title: "Processed by an editing tool", severity: "warning · high confidence", text: "Producer is \"iLovePDF\" — this document passed through ilovepdf, an editing tool. Legitimate uses exist; review what was changed." },
          { level: "warning", title: "1 incremental save generation(s) after the original", severity: "warning · high confidence", text: "The file was saved 1 more time(s) on top of its original content — earlier versions are still embedded. 2 object(s) were rewritten in later revision(s) (ids: 4, 5). Common for signatures/stamps, but also how content edits are appended." },
          { level: "high", title: "Direct text edits recorded (TouchUp_TextEdit)", severity: "high · high confidence", text: "Adobe Acrobat recorded in-place text edits on this PDF. This marker only appears after page text was manually changed." },
          { level: "high", title: "Origin clues do not match declared origin", severity: "high · low confidence", text: "Declared origin is China, but PDF modification date timezone shows UTC-04:00. Timezone/locale clues are approximate — review, do not treat as proof." },
        ],
        originSummary: {
          level: "danger",
          label: "Origin mismatch:",
          text: "Declared origin is China, but PDF modification date timezone shows UTC-04:00. Timezone/locale clues are approximate — review, do not treat as proof.",
        },
      },
      {
        tag: "D3",
        name: "backdated.docx",
        risk: "HIGH",
        riskVariant: "danger",
        type: "DOCX",
        size: "2 KB",
        metadata: [
          ["Author", "Guangzhou Trading Co"],
          ["Created", "2026-06-20T10:00:00Z"],
          ["Modified", "2026-05-01T08:00:00Z"],
          ["Revision", "14"],
          ["Application", "Microsoft Office Word"],
          ["Text language", "en-TT"],
          ["Last modified by", "randy.m"],
          ["Editing sessions (rsid)", "14"],
          ["Total editing time (min)", "340"],
        ],
        flags: [
          { level: "high", title: "Modification date earlier than creation date", severity: "high · high confidence", text: "Modified (2026-05-01T08:00:00Z) is earlier than Created (2026-06-20T10:00:00Z) — timestamps may have been altered manually." },
          { level: "info", title: "Last edited by a different person", severity: "info · high confidence", text: "Created by \"Guangzhou Trading Co\" but last modified by \"randy.m\". Normal in shared workflows; relevant if the document is claimed to be untouched from the issuer." },
          { level: "info", title: "14 save revisions recorded", severity: "info · high confidence", text: "The document was saved multiple times after creation. Purely informational." },
          { level: "warning", title: "Unaccepted tracked changes embedded", severity: "warning · high confidence", text: "1 insertion(s) and 1 deletion(s) are still recorded in the file — the pre-edit wording is recoverable and shows exactly what was changed." },
          { level: "info", title: "14 editing sessions recorded", severity: "info · medium confidence", text: "The document accumulated many distinct editing sessions — inconsistent with a claim of a single-pass generated document." },
          { level: "high", title: "Origin clues do not match declared origin", severity: "high · low confidence", text: "Declared origin is China, but Text proofing language points to Trinidad & Tobago. Timezone/locale clues are approximate — review, do not treat as proof." },
        ],
        originSummary: {
          level: "danger",
          label: "Origin mismatch:",
          text: "Declared origin is China, but Text proofing language points to Trinidad & Tobago. Timezone/locale clues are approximate — review, do not treat as proof.",
        },
      },
      {
        tag: "D4",
        name: "suspicious.eml",
        risk: "HIGH",
        riskVariant: "danger",
        type: "EMAIL",
        size: "3 KB",
        metadata: [
          ["SPF", "fail"],
          ["DKIM", "none"],
          ["Date", "Mon, 6 Jul 2026 08:02:00 -0400"],
          ["From", "\"Guangzhou Trading Co\" <accounts@guangzhou-trading.cn>"],
          ["DMARC", "fail"],
          ["Reply-To", "<payments@fastpay-clearing.net>"],
          ["Relay hops", "2"],
          ["Attachments", "invoice-4571-revised.pdf"],
          ["Mail client", "Microsoft Outlook 16.0"],
          ["Origin relay IP (approximate)", "198.51.100.77"],
        ],
        flags: [
          { level: "warning", title: "Return-Path domain differs from sender", severity: "warning · medium confidence", text: "From is @guangzhou-trading.cn but bounces route to @fastpay-clearing.net. Common with mailing services, but also with spoofed senders." },
          { level: "high", title: "Replies are redirected to a different domain", severity: "high · medium confidence", text: "From is @guangzhou-trading.cn but replies go to @fastpay-clearing.net — a frequent pattern in payment-redirect fraud." },
          { level: "info", title: "Message-ID from an unrelated server", severity: "info · low confidence", text: "Message-ID was generated by smtp-relay.fastpay-clearing.net, not the sender's domain (guangzhou-trading.cn)." },
          { level: "high", title: "SPF authentication failed", severity: "high · high confidence", text: "The receiving server recorded spf=fail — the message failed sender authentication." },
          { level: "high", title: "DMARC authentication failed", severity: "high · high confidence", text: "The receiving server recorded dmarc=fail — the message failed sender authentication." },
          { level: "warning", title: "Relay timestamps run backwards", severity: "warning · medium confidence", text: "Hop 2 is dated after hop 1 by 17 minute(s) — clock skew, or an inserted/edited header.", location: "Location: Received hop 1–2" },
          { level: "warning", title: "Date header disagrees with delivery time", severity: "warning · medium confidence", text: "The Date header differs from the receiving server's timestamp by ~72 minute(s) — the sending clock was wrong or the Date was set manually." },
          { level: "high", title: "Origin clues do not match declared origin", severity: "high · medium confidence", text: "Declared origin is China, but Email Date header timezone shows UTC-04:00; First relay timestamp timezone shows UTC-04:00. Timezone/locale clues are approximate — review, do not treat as proof." },
        ],
        originSummary: {
          level: "danger",
          label: "Origin mismatch:",
          text: "Declared origin is China, but Email Date header timezone shows UTC-04:00; First relay timestamp timezone shows UTC-04:00. Timezone/locale clues are approximate — review, do not treat as proof.",
        },
      },
      {
        tag: "D5",
        name: "suspicious.eml → invoice-4571-revised.pdf",
        risk: "HIGH",
        riskVariant: "danger",
        type: "PDF",
        size: "1 KB",
        metadata: [
          ["Author", "Guangzhou Trading Co"],
          ["Created", "2026-06-01T09:04:12+08:00"],
          ["Creator", "Microsoft Word"],
          ["Modified", "2026-07-05T21:45:30-04:00"],
          ["Producer", "iLovePDF"],
        ],
        flags: [
          { level: "info", title: "Modified after creation", severity: "info · high confidence", text: "Metadata records a modification 35.0 day(s) after creation (2026-06-01T09:04:12+08:00 → 2026-07-05T21:45:30-04:00). Normal for many workflows; review alongside other flags." },
          { level: "warning", title: "Processed by an editing tool", severity: "warning · high confidence", text: "Producer is \"iLovePDF\" — this document passed through ilovepdf, an editing tool. Legitimate uses exist; review what was changed." },
          { level: "warning", title: "1 incremental save generation(s) after the original", severity: "warning · high confidence", text: "The file was saved 1 more time(s) on top of its original content — earlier versions are still embedded. 2 object(s) were rewritten in later revision(s) (ids: 4, 5). Common for signatures/stamps, but also how content edits are appended." },
          { level: "high", title: "Direct text edits recorded (TouchUp_TextEdit)", severity: "high · high confidence", text: "Adobe Acrobat recorded in-place text edits on this PDF. This marker only appears after page text was manually changed." },
          { level: "high", title: "Origin clues do not match declared origin", severity: "high · low confidence", text: "Declared origin is China, but PDF modification date timezone shows UTC-04:00. Timezone/locale clues are approximate — review, do not treat as proof." },
        ],
        originSummary: {
          level: "danger",
          label: "Origin mismatch:",
          text: "Declared origin is China, but PDF modification date timezone shows UTC-04:00. Timezone/locale clues are approximate — review, do not treat as proof.",
        },
      },
      {
        tag: "D6",
        name: "photo.jpg",
        risk: "LOW",
        riskVariant: "success",
        type: "IMAGE",
        size: "26 KB",
        metadata: null,
        clean: "No review flags raised for this document.",
        originSummary: {
          level: "muted",
          label: "Origin inconclusive:",
          text: "No timezone, locale, or location clues were present in the file — origin cannot be checked.",
        },
        notes: [
          "No usable EXIF/embedded metadata — capture time, device, and location cannot be verified. Messaging apps and most export tools strip this routinely; not suspicious by itself.",
        ],
      },
    ],
  },
];

/* ---------- presentational helpers ---------- */

function Field({ label, children }) {
  return (
    <div>
      <Form.Label className="ec82-label">{label}</Form.Label>
      {children}
    </div>
  );
}

function DocCard({ doc }) {
  return (
    <div className="itg-doc">
      <div className="itg-doc-head">
        <span className="itg-doc-tag">{doc.tag}</span>
        <span className="itg-doc-name">{doc.name}</span>
        <span className={`ec82-badge ec82-badge-${doc.riskVariant}`}>{doc.risk}</span>
        <span className="itg-doc-type">{doc.type} · {doc.size}</span>
        <a className="itg-doc-download ms-auto" href="#!" onClick={(e) => e.preventDefault()}>Download</a>
      </div>

      {doc.metadata && (
        <Row className="g-1 itg-meta">
          {doc.metadata.map(([k, v]) => (
            <Col sm={6} key={k} className="d-flex gap-2">
              <span className="itg-meta-k">{k}:</span>
              <span className="itg-meta-v">{v}</span>
            </Col>
          ))}
        </Row>
      )}

      {doc.clean && <p className="itg-clean">{doc.clean}</p>}

      {doc.flags && (
        <ul className="itg-flags">
          {doc.flags.map((f, i) => (
            <li key={i} className={`itg-flag itg-flag-${f.level}`}>
              <i className={FLAG_ICONS[f.level]} />
              <div>
                <p className="itg-flag-title">
                  {f.title} <span className="itg-severity">{f.severity}</span>
                </p>
                <p className="itg-flag-text">{f.text}</p>
                {f.location && <p className="itg-flag-loc">{f.location}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}

      {doc.originSummary && (
        <p className={`itg-origin itg-origin-${doc.originSummary.level}`}>
          <span className="itg-origin-label">{doc.originSummary.label}</span> {doc.originSummary.text}
        </p>
      )}

      {doc.notes && (
        <div className="itg-notes">
          {doc.notes.map((n, i) => (
            <p key={i}><i className="ri-information-line" /> {n}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function CheckCard({ check, open, onToggle }) {
  const isOpen = open === check.id;

  return (
    <div className={`itg-check itg-border-${check.border}`}>
      <button
        type="button"
        className="itg-check-head"
        onClick={() => onToggle(isOpen ? null : check.id)}
        aria-expanded={isOpen}
      >
        <span className="itg-check-title">{check.title}</span>
        <span className={`ec82-badge ec82-badge-${check.riskVariant}`}>{check.risk} risk</span>
        <span className="itg-check-meta">{check.meta}</span>
        <span className="itg-check-date ms-auto">
          {check.date} <i className={`ri-arrow-down-s-line ec82-chev ${isOpen ? "ec82-chev-open" : ""}`} />
        </span>
      </button>

      {isOpen && (
        <div className="itg-check-body">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <Button variant="light" size="sm" className="ec82-sm-btn">
              <i className="ri-download-line me-1" /> Download Customs Package
            </Button>
            <Button variant="light" size="sm" className="ec82-sm-btn itg-delete-btn">
              <i className="ri-delete-bin-line me-1" /> Delete Check
            </Button>
          </div>

          {check.documents.map((doc) => (
            <DocCard key={doc.tag} doc={doc} />
          ))}

          {/* Stakeholder feedback */}
          <section className="ec82-feedback itg-feedback" aria-label="Stakeholder feedback">
            <div className="d-flex align-items-start gap-2">
              <i className="ri-chat-3-line ec82-feedback-icon" />
              <div>
                <h3 className="ec82-h3">Review this result</h3>
                <p className="ec82-sub">Record what was correct, missed, or unclear so the test set improves the tool.</p>
              </div>
            </div>
            <Row className="g-3 align-items-end mt-1">
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
        </div>
      )}
    </div>
  );
}

/* ---------- page ---------- */

function Integrity() {
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [openCheck, setOpenCheck] = useState(null);

  return (
    <div className="container ec82-page">
      {/* Page header */}
      <div className="page-title d-block d-md-flex">
        <div>
          <h3 className="d-flex align-items-center gap-2">
            <i className="ri-file-search-line text-primary fw-normal" /> Document Integrity
          </h3>
          <p className="ec82-intro">
            Flag signs of tampering, backdating, or misrepresented origin across shipment documents.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
          <Button
            variant="light"
            size="sm"
            className="ec82-sm-btn"
            onClick={() => setChecklistOpen(!checklistOpen)}
            aria-expanded={checklistOpen}
          >
            Test checklist <i className={`ri-arrow-down-s-line ms-1 ec82-chev ${checklistOpen ? "ec82-chev-open" : ""}`} />
          </Button>
          <Link to="/dashboard" className="btn btn-light ec82-sm-btn">
            <i className="ri-arrow-left-line"></i> Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Test checklist panel */}
      {checklistOpen && (
        <div className="ec82-card ec82-checklist">
          <h2 className="ec82-h2">Document integrity prototype - test checklist</h2>
          <p className="ec82-sub">
            Use known sample files to record what passed, what was missed, and what needs manual review.
          </p>
          <div className="ec82-table-wrap">
            <Table className="ec82-check-table" responsive>
              <thead>
                <tr>
                  <th>Step</th>
                  <th className="ec82-th-pass">Passed</th>
                  <th className="ec82-th-fail">Failed</th>
                  <th className="ec82-th-manual">Manual review</th>
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

      <div className="itg-form-wrap">
        {/* Step 1: Shipment Details */}
        <div className="ec82-card">
          <div className="d-flex align-items-center gap-3 mb-3">
            <span className="itg-step-solid">1</span>
            <span className="itg-section-title">Shipment Details</span>
          </div>
          <Row className="g-3">
            <Col lg={4} md={6}>
              <Field label="Shipment / B/L reference (optional fallback)">
                <Form.Control className="ec82-input" placeholder="Extracted from a readable B/L" />
              </Field>
            </Col>
            <Col lg={4} md={6}>
              <Field label="Declared Origin (optional)">
                <Form.Select className="ec82-select">
                  <option value="">Select country...</option>
                  {COUNTRIES.map(([, name]) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </Form.Select>
              </Field>
            </Col>
            <Col lg={4} md={6}>
              <Field label="Notes (optional)">
                <Form.Control className="ec82-input" placeholder="Context for the reviewer" />
              </Field>
            </Col>
          </Row>
          <p className="itg-hint">
            A machine-readable B/L reference replaces the fallback when found. Declared origin lets the tool cross-check timezone/locale clues.
          </p>
        </div>

        {/* Step 2: Documents */}
        <div className="ec82-card">
          <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
            <span className="itg-step-solid">2</span>
            <span className="itg-section-title">Documents</span>
            <span className="ms-auto itg-doc-limit">PDF, JPG/PNG, DOCX/XLSX, EML — max 4 MB each</span>
          </div>
          <button type="button" className="ec82-dropzone">
            <i className="ri-upload-cloud-2-line ec82-drop-icon" />
            Drag and drop documents here, or click to browse
          </button>
          <div className="d-flex flex-wrap align-items-center gap-3 mt-3">
            <Button variant="primary">
              <i className="ri-file-search-line me-2" /> Run Integrity Check
            </Button>
          </div>
        </div>

        {/* Checks list */}
        <div>
          <h2 className="itg-checks-title">Checks</h2>
          <div className="d-flex flex-column gap-3">
            {CHECKS.map((check) => (
              <CheckCard key={check.id} check={check} open={openCheck} onToggle={setOpenCheck} />
            ))}
          </div>
        </div>
      </div>

      <p className="itg-disclaimer mb-3">
        This tool identifies review flags; final determination remains with the reviewer. Findings are signals, not verdicts — missing metadata is recorded as “data unavailable” because many legitimate tools strip metadata routinely.
      </p>
    </div>
  );
}

export default Integrity;
