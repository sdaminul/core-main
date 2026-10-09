import { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ActionsModal({ activeTab = 'track', shipment = null, ...rest }) {
  const key = activeTab;

  const titles = {
    track: 'Create a Shipment',
    demdet: 'D&D',
    request: 'Request for Services',
    protect: 'Protect',
    manage: 'Manage',
  };

  const [direction, setDirection] = useState('IMPORT');

  const handleTabChange = (tab) => {
    setDirection(tab);
  };

  const [selected, setSelected] = useState([]);

  const services = [
    "Warehousing",
    "Stuffing",
    "Palletization",
    "Inspection",

    "Customs",
    "Transport",
    "Unstuffing",
    "Surveyor",

    "Packaging",
    "Certification",
    "Handling",
    "Other",
  ];

  const handleChange = (service) => {
    setSelected((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service]
    );
  };

  return (
    <Modal
      {...rest}
      size="lg"
      scrollable
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="fw-bold">
          <i className={`ri-${key === 'track' ? 'radar' : key === 'demdet' ? 'calendar' : key === 'request' ? 'store' : key === 'protect' ? 'shield' : 'box-3'}-line fw-medium me-1`}></i> {titles[key] || (key.charAt(0).toUpperCase() + key.slice(1))}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {key === 'track' && (
          <div className="tab-content-wrapper">
            <div className="modal-card">
              <div className="mb-3">Search by Container, BL/Booking, or AWB.</div>
              <div className="d-flex">
                <Form.Control className="py-2" type="text" placeholder="Enter reference number...." />
                <button className="btn btn-primary w-nowrap ms-2 py-2 px-4">Create</button>
              </div>
              <div className="text-danger fw-bold mt-3">Previously checked — subscribe for live tracking + alerts</div>
            </div>
          </div>
        )}
        {key === 'demdet' && (
          <div className="tab-content-wrapper">
            <div className="modal-card">
              <div className="mb-2">Create or update a D&D record for a shipment.</div>
              <Row>
                <Col lg={6}>
                  <Form.Label className="text-muted-foreground">Shipment <span className="text-danger">*</span></Form.Label>
                  <Form.Select className="py-2" defaultValue={shipment ? shipment.reference : ''} key={shipment ? shipment.reference : 'none'}>
                    {shipment ? (
                      <option value={shipment.reference}>{shipment.reference} — {shipment.carrier}</option>
                    ) : (
                      <>
                        <option>Select Shipment</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </>
                    )}
                  </Form.Select>
                </Col>
                <Col lg={6}>
                  <Form.Label className="text-muted-foreground">Terminal</Form.Label>
                  <Form.Control className="py-2" type="text" placeholder="e.g. APM Terminals" />
                </Col>
              </Row>

              <div className="mb-0 mt-4 pt-2 text-uppercase">Key Dates</div>
              <Row>
                <Col lg={6}>
                  <Form.Label className="text-muted-foreground mt-3">Discharge Date</Form.Label>
                  <Form.Control className="py-2" type="date" />
                </Col>
                <Col lg={6}>
                  <Form.Label className="text-muted-foreground mt-3">Release Date</Form.Label>
                  <Form.Control className="py-2" type="date" />
                </Col>
                <Col lg={6}>
                  <Form.Label className="text-muted-foreground mt-3">Gate Out Date</Form.Label>
                  <Form.Control className="py-2" type="date" />
                </Col>
                <Col lg={6}>
                  <Form.Label className="text-muted-foreground mt-3">Empty Returned</Form.Label>
                  <Form.Control className="py-2" type="date" />
                </Col>
              </Row>

              <Row className="gx-4">
                <Col lg={6}>
                  <div className="mb-0 mt-4 pt-2 text-uppercase">Demurrage</div>

                  <div className="mt-3">
                    <Form.Label className="text-muted-foreground">Free Days</Form.Label>
                    <Form.Control className="py-2" type="number"/>
                  </div>
                  <div className="mt-3">
                    <Form.Label className="text-muted-foreground">Daily Rate (USD)</Form.Label>
                    <Form.Control className="py-2" type="number"/>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-0 mt-4 pt-2 text-uppercase">Detention</div>

                  <div className="mt-3">
                    <Form.Label className="text-muted-foreground">Free Days</Form.Label>
                    <Form.Control className="py-2" type="number"/>
                  </div>
                  <div className="mt-3">
                    <Form.Label className="text-muted-foreground">Daily Rate (USD)</Form.Label>
                    <Form.Control className="py-2" type="number"/>
                  </div>
                </Col>
              </Row>

              <div className="text-end mt-3">
                <Button variant="primary px-4 py-2 me-2">Save Record</Button>
                <Button variant="dark px-4 py-2" as={Link} to="/dashboard/demdet">Full D&D Page</Button>
              </div>
            </div>
          </div>
        )}
        {key === 'request' && (
          <div className="tab-content-wrapper">
            <Alert className="d-flex mb-3">
              <i className="ri-information-2-line me-2 fs-5 text-info"></i>
              <div><span className="text-white">Submit basic details now</span> — add cargo items, warehouse type, and transport details on the full form after submitting. Vendors receive your request immediately.</div>
            </Alert>

            <div className="modal-card mb-2">
              <div className="d-flex justify-content-between align-items-center">
                <div className="req-title">
                  <div className="num">1</div>
                  <div className="title">Direction & Route</div>
                </div>
                <div className="d-flex">
                  <ButtonGroup size="sm" className="border border-primary">
                    <Button 
                      variant={direction === 'IMPORT' ? 'primary' : 'link'} 
                      className={`px-3 ${direction === 'IMPORT' ? '' : 'cus-link-btn'}`}
                      onClick={() => handleTabChange('IMPORT')}
                    >
                      IMPORT
                    </Button>
                    <Button 
                      variant={direction === 'EXPORT' ? 'primary' : 'link'} 
                      className={`px-3 ${direction === 'EXPORT' ? '' : 'cus-link-btn'}`}
                      onClick={() => handleTabChange('EXPORT')}
                    >
                      EXPORT
                    </Button>
                  </ButtonGroup>
                </div>
              </div>

              <Row>
                <Col lg={6}>
                  <Form.Label className="text-muted-foreground mt-3">Booking Start <span className="text-danger">*</span></Form.Label>
                  <Form.Control className="py-2" type="date" />
                </Col>
                <Col lg={6}>
                  <Form.Label className="text-muted-foreground mt-3">Booking End <span className="text-danger">*</span></Form.Label>
                  <Form.Control className="py-2" type="date" />
                </Col>
                <Col lg={6}>
                  <Form.Label className="text-muted-foreground mt-3">Port of Origin <span className="text-danger">*</span></Form.Label>
                  <Form.Control className="py-2" type="text" placeholder="e.g. Shanghai, CN"/>
                </Col>
                <Col lg={6}>
                  <Form.Label className="text-muted-foreground mt-3">Port of Discharge <span className="text-danger">*</span></Form.Label>
                  <Form.Control className="py-2" type="text" placeholder="e.g. Los Angeles, US"/>
                </Col>
              </Row>
            </div>

            <div className="modal-card">
              <div className="d-flex justify-content-between align-items-center">
                <div className="req-title mb-3">
                  <div className="num">2</div>
                  <div className="title">Services & Notes</div>
                </div>
              </div>

              <Row>
                {services.map((service) => (
                  <Col md={4} key={service} className="mb-1">
                    <label
                      className={`service-item ${
                        selected.includes(service) ? "active" : ""
                      }`}
                    >
                      <Form.Check
                        type="checkbox"
                        checked={selected.includes(service)}
                        onChange={() => handleChange(service)}
                        className="service-checkbox"
                      />
                      <span>{service}</span>
                    </label>
                  </Col>
                ))}
              </Row>

              <Form.Label className="text-muted-foreground mt-2">Note (Optional) <span className="text-danger">*</span></Form.Label>
                <Form.Control as="textarea" rows={2} className="py-2" placeholder="Special instructions, cargo details, etc."/>
            </div>

            <div className="d-flex align-items-center mt-3">
              <Button variant="primary px-3"><i className="ri-send-plane-line align-middle me-1"></i> Submit Quick Request</Button>
              <div className="px-3 text-muted-foreground">or</div>
              <Link to="/request-quote" className="text-primary">Online Form →</Link>
            </div>
            <div className="text-muted-foreground mt-2"><small>Full form lets you add cargo details, warehouse type, and transport routes.</small></div>
          </div>
        )}
        {key === 'protect' && (
          <div className="tab-content-wrapper">
            <div className="modal-card text-center py-5">
              <div className="coming-icobox">
                <i className="ri-shield-line"></i>
              </div>
              <h5 className="my-3">Cargo Insurance & Protection</h5>
              <p className="text-muted-foreground mb-0">This feature is coming soon. We'll notify you when it's available.</p>
            </div>
          </div>
        )}
        {key === 'manage' && (
          <div className="tab-content-wrapper">
            <div className="modal-card text-center py-5">
              <div className="coming-icobox">
                <i className="ri-box-3-line"></i>
              </div>
              <h5 className="my-3">Inventory & Shipment Management</h5>
              <p className="text-muted-foreground mb-0">This feature is coming soon. We'll notify you when it's available.</p>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ActionsModal;