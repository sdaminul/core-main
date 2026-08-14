import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Row, Col } from 'react-bootstrap';

const serviceOptions = [
  "Warehousing", "Transport", "Handling", "Customs", "Certification", "Inspection",
  "Packaging", "Palletization", "Surveyor", "Stuffing", "Unstuffing", "Other"
];

function RequestQuote() {
  const [services, setServices] = useState([]);
  const [warehouseType, setWarehouseType] = useState("Open");
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [cargoRows, setCargoRows] = useState([
    { id: 1, packageType: "", weight: "", quantity: "", unit: "PCS", description: "" }
  ]);
  const [nextId, setNextId] = useState(2);

  // toggle service checkbox
  const toggleService = (service) => {
    setServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  // add new cargo row
  const addRow = () => {
    setCargoRows(prev => [
      ...prev,
      { id: nextId, packageType: "", weight: "", quantity: "", unit: "PCS", description: "" }
    ]);
    setNextId(prev => prev + 1);
  };

  // remove cargo row by id
  const removeRow = (id) => {
    if (cargoRows.length === 1) return; // keep at least one row
    setCargoRows(prev => prev.filter(row => row.id !== id));
  };

  // update cargo row field
  const updateCargoRow = (id, field, value) => {
    setCargoRows(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const [activeTab, setActiveTab] = useState('IMPORT');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="container">
        {/* Page Title */}
        <div className="page-title">
          <h3>New Request</h3>
          <Link to="/" className="btn btn-primary px-3">
            <i className="ri-arrow-left-line"></i> Dashboard
          </Link>
        </div>

        {/* Step 1: Direction & Route */}
        <div className="rq-card">
          <div className="rq-head">
            <span className="rq-step">1</span>
            <h5>Direction & Route</h5>
            <div className="ms-auto">

  	          <ButtonGroup size="sm" className="border border-primary">
                <Button 
                  variant={activeTab === 'IMPORT' ? 'primary' : 'link'} 
                  className={`px-3 ${activeTab === 'IMPORT' ? '' : 'cus-link-btn'}`}
                  onClick={() => handleTabChange('IMPORT')}
                >
                  IMPORT
                </Button>
                <Button 
                  variant={activeTab === 'EXPORT' ? 'primary' : 'link'} 
                  className={`px-3 ${activeTab === 'EXPORT' ? '' : 'cus-link-btn'}`}
                  onClick={() => handleTabChange('EXPORT')}
                >
                  EXPORT
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {/* Route fields */}
          <div className="row mt-3">
            <div className="col-md-3 mb-3">
              <label className="form-label">Booking Start</label>
              <input type="date" className="form-control py-2" placeholder="mm/dd/yyyy" />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Booking End</label>
              <input type="date" className="form-control py-2" placeholder="mm/dd/yyyy" />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Port of Origin</label>
              <input type="text" className="form-control py-2" placeholder="e.g. Shanghai, CN" />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Port of Discharge</label>
              <input type="text" className="form-control py-2" placeholder="e.g. Los Angeles, US" />
            </div>
          </div>
        </div>

        {/* Step 2: Services */}
        <div className="rq-card mt-3">
          <div className="rq-head mb-4">
            <span className="rq-step">2</span>
            <h5>Services</h5>
          </div>

          {/* Clickable dropdown/select box */}
          <div className="service-dropdown-wrapper">
            <div 
              className="service-select-box"
              onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
            >
              <span className="service-select-text">
                {services.join(", ") || "Select requested services"}
              </span>
              <i className={`ri-arrow-${isServiceDropdownOpen ? 'up' : 'down'}-s-line`}></i>
            </div>

            {/* Dropdown with checkboxes */}
            {isServiceDropdownOpen && (
              <div className="service-dropdown-menu">
                <div className="row">
                  {serviceOptions.map(item => (
                    <div className="col-sm-6 col-md-4 col-lg-2 mb-2" key={item}>
                      <label className="form-check service-checkbox">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={services.includes(item)}
                          onChange={() => toggleService(item)}
                        />
                        <span className="ms-2">{item}</span>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => setIsServiceDropdownOpen(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* conditional subcards: Warehousing and Transport */}
          {(services.includes("Warehousing") || services.includes("Transport")) && (
            <div className="row mt-3">
              {services.includes("Warehousing") && (
                <div className="col-md-6">
                  <div className="rq-subcard">
                    <h6>WAREHOUSE TYPE</h6>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {["Open", "Closed", "Bonded", "Fulfillment", "Refrigerated"].map(type => (
                        <button
                          key={type}
                          className={`btn ${warehouseType === type ? "btn-primary" : "btn-outline-secondary"} btn-sm`}
                          onClick={() => setWarehouseType(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {services.includes("Transport") && (
                <div className="col-md-6">
                  <div className="rq-subcard">
                    <h6>TRANSPORT ROUTE</h6>
                    <Row className="mt-3">
                      <Col lg={6} className="mb-2">
                        <label className="form-label mb-2">Pickup Location</label>
                        <input type="text" className="form-control py-2" placeholder="Pickup address or area" />
                      </Col>
                      <Col lg={6}>
                        <label className="form-label mb-2">Drop-off Location</label>
                        <input type="text" className="form-control py-2" placeholder="Drop-off address or area" />
                      </Col>
                    </Row>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 3: Cargo & Notes */}
        <div className="rq-card mt-3">
          <div className="rq-head mb-2">
            <span className="rq-step">3</span>
            <h5>Cargo & Notes</h5>
            <button className="btn btn-dark ms-auto px-3" onClick={addRow}><i className="ri-add-line"></i> Add Row</button>
          </div>

          {/* cargo rows */}
          {cargoRows.map((row) => (
            <div key={row.id} className="cargo-row-wrapper mt-3 p-3" style={{ background: "var(--cv-hover-bg)", borderRadius: "10px", border: "1px solid var(--cv-border-1)" }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold">Line {cargoRows.indexOf(row) + 1}</span>
                {cargoRows.length > 1 && (
                  <button className="btn btn-sm text-danger bg-danger bg-opacity-10 border border-danger border-opacity-25" onClick={() => removeRow(row.id)}>
                    <i className="ri-close-line"></i> Remove
                  </button>
                )}
              </div>
              <div className="row">
                <div className="col-md-2 mb-2">
                  <label className="form-label">Package Type</label>
                  <select
                    className="form-select py-2"
                    value={row.packageType}
                    onChange={(e) => updateCargoRow(row.id, "packageType", e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="Pallet">Pallet</option>
                    <option value="Box">Box</option>
                    <option value="Crate">Crate</option>
                    <option value="Drum">Drum</option>
                    <option value="Bag">Bag</option>
                    <option value="Roll">Roll</option>
                  </select>
                </div>
                <div className="col-md-2 mb-2">
                  <label className="form-label">Weight (kg)</label>
                  <input
                    type="number"
                    className="form-control py-2"
                    placeholder="0"
                    value={row.weight}
                    onChange={(e) => updateCargoRow(row.id, "weight", e.target.value)}
                  />
                </div>
                <div className="col-md-2 mb-2">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control py-2"
                    placeholder="0"
                    value={row.quantity}
                    onChange={(e) => updateCargoRow(row.id, "quantity", e.target.value)}
                  />
                </div>
                <div className="col-md-2 mb-2">
                  <label className="form-label">Unit</label>
                  <select
                    className="form-select py-2"
                    value={row.unit}
                    onChange={(e) => updateCargoRow(row.id, "unit", e.target.value)}
                  >
                    <option value="PCS">PCS</option>
                    <option value="KG">KG</option>
                    <option value="LBS">LBS</option>
                    <option value="M">M</option>
                    <option value="FT">FT</option>
                    <option value="CBM">CBM</option>
                  </select>
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control py-2"
                    placeholder="Brief description"
                    value={row.description}
                    onChange={(e) => updateCargoRow(row.id, "description", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Notes / Special Instructions */}
          <div className="mt-4">
            <label className="form-label fw-bold">Notes / Special Instructions</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Any additional details vendors should know..."
              style={{ background: "var(--cv-surface-2)", color: "var(--cv-text-1)" }}
            ></textarea>
          </div>
        </div>
        <div className="d-flex align-items-center mt-3 mb-4 pb-2">
          <Button variant="primary px-3 me-3"><i className="ri-send-plane-line align-middle me-1"></i> Submit Request</Button>
          <div className="text-muted-foreground">Your request will be shared anonymously with all matching vendors.</div>
        </div>
      </div>
    </>
  );
}

export default RequestQuote;