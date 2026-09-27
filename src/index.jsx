import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Form, Image } from "react-bootstrap";
import {
  Ship, Plane, FileText, BarChart3, Bell, Users, ArrowRight,
  Check, Package, MapPin, Globe, Sparkles, ChevronDown,
} from "lucide-react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Quotes from './assets/images/quotes.png';
import Detail from './assets/images/detail.png';
import "./Index.css";

// ─── Animated counter ────────────────────────
function AnimatedCounter({ target, suffix = "", duration = 2 }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, target, { duration, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [count, target, duration, rounded]);

  return <span>{display}{suffix}</span>;
}

// ─── Animation variants ───
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── The 8 pillars at the CORE of every shipment ───
const PILLARS = [
  {
    id: "intel",
    name: "coreINTEL",
    icon: "ri-radar-line",
    desc: "Container visibility & port analytics",
    quote: "Real-time visibility across containers, ports, and critical shipment milestones.",
  },
  {
    id: "bid",
    name: "coreBID",
    icon: "ri-auction-line",
    desc: "Structured freight and services bidding",
    quote: "Objective freight procurement and vendor services through transparent, competitive bidding.",
  },
  {
    id: "shield",
    name: "coreCover",
    icon: "ri-shield-check-line",
    desc: "Port to Door insurance coverage",
    quote: "Mitigate financial exposure from cargo risk, delays, and ancillary costs, with real time assessment and payout.",
  },
  {
    id: "split",
    name: "coreIndex",
    icon: "ri-split-cells-horizontal",
    desc: "Master BL & inventory consolidation",
    quote: "Transform master bills of lading into shipment-level inventory intelligence and reporting.",
  },
  {
    id: "clear",
    name: "coreCLEAR",
    icon: "ri-file-check-line",
    desc: "Asycuda workflow & preparation ",
    quote: "Prepare, validate, streamline and management of customs documentation before submission.",
  },
  {
    id: "sync",
    name: "coreSYNC",
    icon: "ri-team-line",
    desc: "Collaborate across teams & stakeholders",
    quote: "Connect every stakeholder, document, and action across the shipment lifecycle.",
  },
  {
    id: "audit",
    name: "coreAUDIT",
    icon: "ri-file-search-line",
    desc: "Manage rates, charges & contracts",
    quote: "Compare and validate rates, charges, and contractual terms against the shipment record.",
  },
  {
    id: "trust",
    name: "coreTRUST",
    icon: "ri-fingerprint-line",
    desc: "Document integrity & data verification",
    quote: "Detect document inconsistencies and strengthen data integrity across every shipment.",
  },
];

const FEATURES = [
  { Icon: Ship, title: "Ocean Freight", desc: "FCL, LCL & multimodal in a unified booking flow." },
  { Icon: Plane, title: "Air Cargo", desc: "AWB tracking with real-time carrier visibility." },
  { Icon: FileText, title: "Documentation", desc: "BLs, invoices, and permits stored & versioned." },
  { Icon: BarChart3, title: "Rate Comparison", desc: "Compare live rates across every carrier instantly." },
  { Icon: Bell, title: "Smart Alerts", desc: "Proactive notifications for delays and milestones." },
  { Icon: Users, title: "Team Collaboration", desc: "Shared workspaces with per-shipment threads." },
];

const CHECKS_QUOTE = [
  "Side-by-side carrier comparisons",
  "Detailed breakdowns of surcharges & fees",
  "Currency-normalized totals",
  "Share quotes with your team in one click",
];

const CHECKS_TRACK = [
  "Container milestone tracking",
  "Proactive delay notifications",
  "Live vessel & flight tracking",
  "Delayed-shipment AI insights",
];

// ─── Traditional vs CARGOVIS CORE — one row per pillar ───
const COMPARISON = [
  {
    pillar: "coreINTEL",
    traditional: "Tracking? Call your rep",
    core: "Real-time visibility across containers, ports, and critical shipment milestones.",
  },
  {
    pillar: "coreBID",
    traditional: "Quotes via email, days to respond",
    core: "Objective freight procurement and vendor services through transparent, competitive bidding.",
  },
  {
    pillar: "coreCover",
    traditional: "Coverage sorted out after a loss",
    core: "Mitigate financial exposure from cargo risk, delays, and ancillary costs, with real time assessment and payout.",
  },
  {
    pillar: "coreIndex",
    traditional: "Master BLs split by hand",
    core: "Transform master bills of lading into shipment-level inventory intelligence and reporting.",
  },
  {
    pillar: "coreCLEAR",
    traditional: "Customs paperwork redone every time",
    core: "Prepare, validate, streamline and management of customs documentation before submission.",
  },
  {
    pillar: "coreSYNC",
    traditional: "Your team left in the dark",
    core: "Connect every stakeholder, document, and action across the shipment lifecycle.",
  },
  {
    pillar: "coreAUDIT",
    traditional: "Invoice surprises at the end",
    core: "Compare and validate rates, charges, and contractual terms against the shipment record.",
  },
  {
    pillar: "coreTRUST",
    traditional: "Documents scattered in inboxes",
    core: "Detect document inconsistencies and strengthen data integrity across every shipment.",
  },
];

const pillarIcon = (name) =>
  PILLARS.find((p) => p.name === name)?.icon ?? "ri-checkbox-circle-line";

// Ocean Carriers data
const OCEAN_CARRIERS = [
  { code: "ACLU", name: "ACL", mode: "ocean" },
  { code: "ADMU", name: "ADMIRAL LINE", mode: "ocean" },
  { code: "AELL", name: "AFRICA EXPRESS LINE", mode: "ocean" },
  { code: "SG_AKKN", name: "AKKON LINES", mode: "ocean" },
  { code: "ANNU", name: "ANL", mode: "ocean" },
  { code: "APLU", name: "APL", mode: "ocean" },
  { code: "AMXL", name: "AMAZON LOGISTICS", mode: "ocean" },
  { code: "AROU", name: "AROUND THE WORLD", mode: "ocean" },
  { code: "BMLU", name: "BERMUDA LINES", mode: "ocean" },
  { code: "CMDU", name: "CMA CGM", mode: "ocean" },
  { code: "COSU", name: "COSCO", mode: "ocean" },
  { code: "EISU", name: "EVERGREEN", mode: "ocean" },
  { code: "HLCU", name: "HAPAG-LLOYD", mode: "ocean" },
  { code: "MSCU", name: "MSC", mode: "ocean" },
  { code: "MSKU", name: "MAERSK", mode: "ocean" },
  { code: "ONEU", name: "ONE", mode: "ocean" },
  { code: "OOLU", name: "OOCL", mode: "ocean" },
  { code: "PILU", name: "PIL", mode: "ocean" },
  { code: "SMCU", name: "SM LINE", mode: "ocean" },
  { code: "WHLU", name: "WAN HAI", mode: "ocean" },
  { code: "YMJU", name: "YANG MING", mode: "ocean" },
  { code: "ZIMU", name: "ZIM", mode: "ocean" },
];

// Service tabs data
const SERVICE_TABS = [
  { 
    id: "allservices", 
    label: "All Services"
  },
  { 
    id: "customs", 
    label: "Customs Broker"
  },
  { 
    id: "trucking", 
    label: "Trucking"
  },
  { 
    id: "warehouse", 
    label: "Warehouse"
  },
  { 
    id: "forwarder", 
    label: "Freight Forwarder"
  },
  { 
    id: "insurance", 
    label: "Insurance"
  },
];

// Searchable Select Component
const SearchableSelect = ({ options, placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.code === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option.code);
    setSearchTerm(option.name);
    setIsOpen(false);
  };

  return (
    <div className="searchable-select" ref={dropdownRef}>
      <div 
        className="searchable-select-control"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          className="searchable-select-input"
          placeholder={placeholder}
          value={searchTerm || (selectedOption ? selectedOption.name : "")}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (!e.target.value) onChange("");
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <ChevronDown size={16} className={`searchable-select-arrow ${isOpen ? "open" : ""}`} />
      </div>
      
      {isOpen && (
        <div className="searchable-select-dropdown">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt.code}
                className={`searchable-select-item ${value === opt.code ? "selected" : ""}`}
                onClick={() => handleSelect(opt)}
              >
                <div className="carrier-info">
                  <span className="carrier-name">{opt.name}</span>
                  <span className="carrier-code">{opt.code} · {opt.mode}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="searchable-select-empty">No carriers found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Track");
  const [activeServiceTab, setActiveServiceTab] = useState("allservices");
  const [email, setEmail] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [activePillar, setActivePillar] = useState(PILLARS[0].id);
  const [pillarAutoPlay, setPillarAutoPlay] = useState(true);

  const pillarIndex = Math.max(0, PILLARS.findIndex((p) => p.id === activePillar));
  const pillar = PILLARS[pillarIndex];

  const pickPillar = (id) => {
    setPillarAutoPlay(false);
    setActivePillar(id);
  };

  const tabs = [
    { name: "Track", icon: "ri-map-pin-line" },
    { name: "DemDet", icon: "ri-calendar-line" },
    { name: "Request", icon: "ri-store-line" },
    { name: "Compare", icon: "ri-scales-3-line" },
    { name: "Protect", icon: "ri-shield-line" },
    { name: "Manage", icon: "ri-box-3-line" },
  ];

  const handleNotify = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`You'll be notified at ${email} when this feature launches!`);
      setEmail("");
    }
  };

  useEffect(() => {
    document.body.classList.add('home');
    return () => {
      document.body.classList.remove('home');
    };
  }, []);

  // Auto-rotate the pillar spotlight until the visitor takes over
  useEffect(() => {
    if (!pillarAutoPlay) return;
    const id = setInterval(() => {
      setActivePillar((current) => {
        const i = PILLARS.findIndex((p) => p.id === current);
        return PILLARS[(i + 1) % PILLARS.length].id;
      });
    }, 4200);
    return () => clearInterval(id);
  }, [pillarAutoPlay]);

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Track":
        return (
          <motion.div
            key="track"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h5 className="fw-bold mb-1">Track Your Shipment</h5>
            <p className="text-muted-c mb-3 try-subtitle">
              Real time notifications with predictive analysis.
            </p>
            <div className="d-flex align-items-center">
              <Form.Control
              className="try-input mb-0"
              placeholder="Enter Container #, Booking #, or AWB #"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" className="w-nowrap ms-2 py-2 px-4 gap-2">
                <i className="ri-route-line"></i> Track
              </Button>
            </div>

              <small className="text-muted-c try-alert-note d-block mt-4 pb-1">* Alerts are only available based on what the carriers/airlines provide.</small>
              <div className="mt-3">
                <label className="text-muted-c carrier-label">
                  Carrier (optional)
                </label>
                <SearchableSelect
                  options={OCEAN_CARRIERS}
                  placeholder="Ocean or Air – type to search"
                  value={selectedCarrier}
                  onChange={setSelectedCarrier}
                />
              </div>
          </motion.div>
        );

      case "DemDet":
        return (
          <motion.div
            key="demdet"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h5 className="fw-bold mb-1">Demurrage & Detention</h5>
            <p className="text-muted-c mb-3 try-subtitle">
              Automated cost savings and intelligent reporting
            </p>
             <div className="d-flex align-items-center">
              <Form.Control
                className="try-input mb-0"
                placeholder="Enter Container # to check D&D status"
              />
              <Button className="w-nowrap ms-2 py-2 px-3 gap-2">
                <i className="ri-calendar-line"></i> Check Status
              </Button>
            </div>
            <div className="text-center mt-4">
              <p className="text-muted-c mt-2 mb-0 dnd-note">
                D&D tracking available after container discharge at destination port.
              </p>
            </div>
          </motion.div>
        );

      case "Request":
        return (
          <motion.div
            key="request"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h5 className="fw-bold mb-1">Request Services</h5>
            <p className="text-muted-c mb-4 try-subtitle">
              Search our vendor network for port to door services.
            </p>
            
            <Button variant="primary" className="py-2 px-4">
              Get Quote <i className="ri-arrow-right-long-line ms-1"></i>
            </Button> 

            <div className="service-tabs-container mb-3 pt-1 mt-4">
              {SERVICE_TABS.map(({ id, label }) => (
                <button
                  key={id}
                  className={`service-tab ${activeServiceTab === id ? "active" : ""}`}
                  onClick={() => setActiveServiceTab(id)}
                >
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="p-3 mt-4 blind-bidding-box">
              <div className="d-flex align-items-center gap-2">
                <div className="blind-bidding-icon">
                  <i className="ri-lock-line"></i>
                </div>
                <div>
                  <strong className="blind-bidding-title">Blind Bidding System</strong>
                  <p className="text-muted-c blind-bidding-desc">
                    Your identity stays hidden until you accept a quote. Compare offers without obligation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "Compare":
        return (
          <motion.div
            key="compare"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="text-center py-1 coming-soon-container">
              <div className="comming-ifont">
                <i className="ri-lock-line"></i>
              </div>
              <h4 className="coming-soon-title">Freight Rates</h4>
              <p className="cv-kicker coming-soon-badge">Coming Soon</p>
              <p className="text-muted-c coming-soon-desc">
                Compare freight rates from multiple carriers instantly
              </p>
              <div className="text-center mt-4">Get notified when this feature launches</div>
              <Form onSubmit={handleNotify} className="mt-3 d-flex gap-2 justify-content-center flex-wrap">
                <Form.Control
                  className="coming-soon-email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" className="px-4 py-2">Notify Me</Button>
              </Form>
            </div>
          </motion.div>
        );

      case "Protect":
        return (
          <motion.div
            key="protect"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="text-center py-1 coming-soon-container">
              <div className="comming-ifont">
                <i className="ri-lock-line"></i>
              </div>
              <h4 className="coming-soon-title">Insure Assist</h4>
              <p className="cv-kicker coming-soon-badge">Coming Soon</p>
              <p className="text-muted-c coming-soon-desc">
                Instant insurance certificate for all shipments.
              </p>              
              <div className="text-center mt-4">Get notified when this feature launches</div>
              <Form onSubmit={handleNotify} className="mt-3 d-flex gap-2 justify-content-center flex-wrap">
                <Form.Control
                  className="coming-soon-email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" className="px-4 py-2">Notify Me</Button>
              </Form>
            </div>
          </motion.div>
        );

      case "Manage":
        return (
          <motion.div
            key="manage"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="text-center py-1 coming-soon-container">
              <div className="comming-ifont">
                <i className="ri-lock-line"></i>
              </div>
              <h4 className="coming-soon-title">Stock Wizard</h4>
              <p className="cv-kicker coming-soon-badge">Coming Soon</p>
              <p className="text-muted-c coming-soon-desc">
                Track inventory in transit and manage packing lists. Connect shipments to your stock levels.
              </p>
              <div className="text-center mt-4">Get notified when this feature launches</div>
              <Form onSubmit={handleNotify} className="mt-3 d-flex gap-2 justify-content-center flex-wrap">
                <Form.Control
                  className="coming-soon-email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" className="px-4 py-2">Notify Me</Button>
              </Form>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="cv-app">

      {/* ═══ HERO ═══ */}
      <section className="cv-hero">
        <div className="cv-hero-grid" />
        <div className="cv-orb o1 glass"><Globe size={22} /></div>
        <div className="cv-orb o2 glass"><Ship size={22} /></div>
        <div className="cv-orb o3 glass"><Package size={20} /></div>

        <Container className="text-center position-relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} 
            className="cv-badge glass"
          >
            <Sparkles size={14} color="#f97b3d" /> Modern freight, redefined
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            8 pillars at the <span className="text-gradient">CORE</span> of every shipment
          </motion.h1>

          <motion.div 
            className="cv-hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a className="btn btn-primary py-2 px-4" href="signup">
              Get Started <i className="ri-arrow-right-long-line"></i>
            </a>
            <a href="#try" className="btn-ghost btn-outline-primary">Try Now</a>
            <Button className="btn-ghost">Watch demo</Button>
          </motion.div>

          {/* ── 8 PILLARS: console (icon nav + spotlight stage) ── */}
          <motion.div
            className="core-console glass"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="core-console-bar">
              <span className="core-console-dots" aria-hidden="true">
                <div style={{ width: "30px" }}></div>
              </span>
              <span className="core-console-label">
                <span className="core-live" /> Unified Management — 8 pillars
              </span>
              <span className="core-console-count">
                {String(pillarIndex + 1).padStart(2, "0")}<em>/08</em>
              </span>
            </div>

            <div className="core-nav" role="tablist" aria-label="The 8 CORE pillars">
              {PILLARS.map((p, i) => (
                <motion.button
                  key={p.id}
                  role="tab"
                  aria-selected={activePillar === p.id}
                  title={p.name}
                  className={`core-nav-item ${activePillar === p.id ? "active" : ""}`}
                  onClick={() => pickPillar(p.id)}
                  onMouseEnter={() => pickPillar(p.id)}
                  onFocus={() => pickPillar(p.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.5 + i * 0.05 }}
                >
                  <span className="core-nav-ic"><i className={p.icon}></i></span>
                  <span className="core-nav-name">{p.name.replace("core", "")}</span>
                </motion.button>
              ))}
            </div>

            <div className="core-stage">
              <motion.div
                key={pillar.id}
                className="core-stage-inner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="core-stage-ic"><i className={pillar.icon}></i></div>
                <div className="core-stage-copy">
                  <h3 className="core-stage-title">
                    <span className="pillar-core">core</span>{pillar.name.replace("core", "")}
                  </h3>
                  <p className="core-stage-desc">{pillar.desc}</p>
                  <p className="core-stage-quote">“{pillar.quote}”</p>
                </div>
              </motion.div>
            </div>

            <div className="pillar-rail" aria-hidden="true">
              {PILLARS.map((p, i) => (
                <span key={p.id} className={`pillar-rail-dot ${i === pillarIndex ? "on" : ""}`} />
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Row className="cv-stats justify-content-center">
              {[
                { v: 50, l: "Carriers integrated", suffix: "+" },
                { v: 99, l: "Uptime SLA", suffix: "%" },
                { v: 24, l: "Live tracking", suffix: "/7" },
              ].map((s) => (
                <Col xs={4} md={3} key={s.l} className="text-center">
                  <div className="cv-stat-val text-gradient">
                    <AnimatedCounter target={s.v} suffix={s.suffix} duration={2} />
                  </div>
                  <div className="cv-stat-label">{s.l}</div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* ═══ QUOTE ═══ */}
      <section id="features" className="cv-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <span className="cv-badge glass"><BarChart3 size={14} color="#f97b3d" /> coreBID</span>
                <h2 className="cv-h2">Compare quotes<br /><span className="text-gradient">in one place.</span></h2>
                <p className="cv-sublead" style={{ maxWidth: 480 }}>
                  Request a quote and quickly see rates across ocean, air, and land — all in one view.
                  Our platform shows you the full landed cost before you book.
                </p>
                <motion.ul 
                  className="list-unstyled mt-4"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {CHECKS_QUOTE.map((item, i) => (
                    <motion.li key={item} custom={i} variants={fadeUp} className="cv-check">
                      <span className="cv-check-mark"><Check size={12} /></span>{item}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div 
                className="position-relative"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="mock-glow" />
                <div className="position-relative">
                  <Image src={Quotes} alt="" className="sec-img" />
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ═══ TRY IT ═══ */}
      <section id="try" className="cv-section">
        <Container style={{ maxWidth: 900 }}>
          <motion.div 
            className="text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="cv-kicker">LIVE DEMO</div>
            <h2 className="cv-h2">Try It Now</h2>
            <p className="cv-sublead">Search a container, booking, or AWB number to see live tracking in action.</p>
          </motion.div>
          
          <motion.div 
            className="mock-panel trybox"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="try-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`try-tab ${activeTab === tab.name ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.name)}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
            <div className="try-content">
              {renderTabContent()}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section id="compare" className="cv-section">
        <Container>
          <motion.div 
            className="text-center mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="cv-kicker">The comparison</div>
            <h2 className="cv-h2">Why teams pick CORE</h2>
          </motion.div>

          <div className="compare-two">
            <motion.div className="compare-items start"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center fw-semibold mb-4">TRADITIONAL</div>
              {COMPARISON.map((row, i) => (
                <motion.div
                    key={row.pillar}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20px" }}
                    variants={fadeUp}
                  >
                  <div className="compare-item"><span><i className="ri-close-circle-line"></i></span> {row.traditional}</div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div className="compare-items end"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center fw-semibold text-primary mb-4">CORE</div>
              {COMPARISON.map((row, i) => (
                <motion.div
                    key={row.pillar}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20px" }}
                    variants={fadeUp}
                  >
                  <div className="compare-item">
                    <span><i className={pillarIcon(row.pillar)}></i></span>{" "}
                    {row.core}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
        </Container>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="cv-footer">
        <Container className="d-flex flex-wrap justify-content-center align-items-center gap-3">
          <div>© {new Date().getFullYear()} 3pl3sixty LLC, Wyoming, 82801. All rights reserved.</div>
        </Container>
      </footer>
    </div>
  );
}