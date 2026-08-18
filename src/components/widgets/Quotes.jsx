import { useState } from "react";
import { Link } from 'react-router-dom';
import { Card, Form } from "react-bootstrap";

const rows = [
  {
    id: 1,
    route: "CN - US",
    period: "6/21/2026 → 6/30/2026",
    service: "Customs",
    status: "ACTIVE",
    created: "6/20/2026",
    bids: 0,
    color: "orange",
    step: 2,
    services: ["CUSTOMS"],
    cargoTitle: "Cargo Line",
    cargo: [
      { type: "FCL (40' High Cube)", qty: 10, weight: "–", unit: "PCS", desc: "id" },
    ],
    vendorBids: [],
    emptyTitle: "No Bids Yet",
    emptyText: "Waiting for vendor responses...",
    emptySub: "Vendors will submit bids anonymously. You'll see them here once submitted.",
  },
  {
    id: 2,
    route: "Shanghai, CN - LS, USA",
    period: "4/15/2026 → 4/17/2026",
    service: "Warehousing",
    status: "CLOSED",
    created: "4/15/2026",
    bids: 1,
    color: "green",
    step: 5,
    services: ["WAREHOUSING", "CUSTOMS", "PACKAGING", "STUFFING"],
    warehouse: "OPEN",
    cargoTitle: "Cargo Line",
    cargo: [
      { type: "Box", qty: 1, weight: 1, unit: "PCS", desc: "–" },
    ],
    vendorBids: [
      {
        name: "swift customs brokerage",
        verified: true,
        amount: "USD 50.00",
        validity: "7 days",
        location: "Port of Spain, TT",
        responseTime: "< 2 hours",
        status: "ACCEPTED",
        coverage: ["Warehousing", "Customs", "Packaging", "Stuffing"],
        comments: "test",
      },
    ],
  },
  {
    id: 3,
    route: "Ningbo, CN - Port of Spain, TT",
    period: "4/18/2026 → 4/25/2026",
    service: "Transport",
    status: "CLOSED",
    created: "4/9/2026",
    bids: 1,
    color: "green",
    step: 5,
    services: ["TRANSPORT"],
    transport: "Port of Ningbo - Port of Spain",
    cargoTitle: "Cargo Line",
    cargo: [
      { type: "FCL", qty: 1, weight: "–", unit: "Containers", desc: "General cargo" },
    ],
    vendorBids: [
      {
        name: "ocean freight co",
        verified: true,
        amount: "USD 1,200.00",
        validity: "14 days",
        location: "Ningbo, CN",
        responseTime: "< 4 hours",
        status: "ACCEPTED",
        coverage: ["Transport"],
        comments: "Door to port service included",
      },
    ],
  },
  {
    id: 4,
    route: "Shanghai, CN - Los Angeles, US",
    period: "4/15/2026 → 5/15/2026",
    service: "Warehousing",
    status: "CANCELLED",
    created: "3/31/2026",
    bids: 1,
    color: "red",
    step: 3,
    services: ["WAREHOUSING", "CUSTOMS", "TRANSPORT"],
    warehouse: "BONDED",
    transport: "Port of Los Angeles - Inland Empire Warehouse",
    cargoTitle: "Cargo Lines",
    cargo: [
      { type: "FCL", qty: 2, weight: "–", unit: "Containers", desc: "Electronics" },
      { type: "Pallet", qty: 10, weight: 500, unit: "PCS", desc: "Auto parts" },
    ],
    notes: "Fragile electronics - require temperature controlled warehouse",
    vendorBids: [
      {
        name: "Vendor 1",
        verified: false,
        amount: "USD 2,500.00",
        validity: "–",
        location: "–",
        responseTime: "–",
        status: "DECLINED",
      },
    ],
    bidsNote: "Vendor identities are hidden until you accept a bid. Accept to reveal full vendor details.",
  },
];

function Progress({ step }) {
  const labels = ["Submitted", "Bids In", "Accepted", "Connected"];
  return (
    <div className="pp">
      {labels.map((l, i) => (
        <div className="st" key={i}>
          <div className={i + 1 < step ? "c done" : i + 1 === step ? "c active" : "c"}>
            {i + 1 < step ? "✓" : i + 1}
          </div>
          {i < 3 && <div className={i + 1 < step ? "ln done" : "ln"} />}
          <small>{l}</small>
        </div>
      ))}
    </div>
  );
}

function Details({ r }) {
  return (
    <div className="details">
      {/* Requested Services */}
      <div className="cusze-box">
      	<div className="box">
	        <div className="box-label">Requested Services</div>
	        <div className="chips">
	          {r.services.map((s) => (
	            <span key={s}>{s}</span>
	          ))}
	        </div>
	      </div>

	      {/* Warehouse */}
	      {r.warehouse && (
	        <div className="box info-line">
	          <i className="ri-building-line" />
	          <span className="info-label">Warehouse:</span>
	          <span className="badge-pill">{r.warehouse}</span>
	        </div>
	      )}

	      {/* Transport */}
	      {r.transport && (
	        <div className="box info-line">
	          <i className="ri-truck-line" />
	          <span className="info-label">Transport:</span>
	          <span className="info-value">{r.transport}</span>
	        </div>
	      )}
      </div>

      {/* Cargo */}
      <div className="box">
        <div className="box-label">
          <i className="ri-box-3-line" /> {r.cargoTitle}
        </div>
        <div className="cargo-table">
          <div className="cargo-head">
            <div>Type</div>
            <div>Qty</div>
            <div>Weight</div>
            <div>Unit</div>
            <div>Description</div>
          </div>
          {r.cargo.map((c, i) => (
            <div className="cargo-row" key={i}>
              <div>{c.type}</div>
              <div>{c.qty}</div>
              <div>{c.weight}</div>
              <div>{c.unit}</div>
              <div>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {r.notes && (
        <div className="box">
          <div className="box-label">Notes</div>
          <p className="notes-text">"{r.notes}"</p>
        </div>
      )}

      {/* Vendor Bids */}
      <div className="bids-section">
        <b className="bids-title">Vendor Bids ({r.vendorBids.length})</b>

        {r.vendorBids.length > 0 ? (
          <>
            <div className="bids-head">
              <div>VENDOR</div>
              <div>QUOTE AMOUNT</div>
              <div>VALIDITY</div>
              <div>LOCATION</div>
              <div>RESPONSE TIME</div>
              <div>STATUS</div>
            </div>
            {r.vendorBids.map((b, i) => (
              <div className={`bid-card ${b.status.toLowerCase()}`} key={i}>
                <div className="bid-row">
                  <div className="bids-flexs">
                    <div className="bids-flex-item">
                      <div>VENDOR</div>
                      <div className="bid-vendor">
                        <div className="d-flex">
                          {b.status === "DECLINED" ? (
                            <i className="ri-close-line decline-x me-1" />
                          ) : (
                            <i className="ri-check-line accept-check me-1" />
                          )}
                          <span>{b.name} {b.verified && <span className="verified"><span>VERIFIED</span><i className="ri-verified-badge-fill"></i></span>}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bids-flex-item">
                      <div>QUOTE AMOUNT</div>
                      <div className="bid-amount">{b.amount}</div>
                    </div>
                  </div>
                  <div className="bids-flexs">
                    <div className="bids-flex-item">
                      <div>VALIDITY</div>
                      <div>{b.validity}</div>
                    </div>
                    <div className="bids-flex-item">
                      <div>LOCATION</div>
                      <div>
                        {b.location !== "–" && <i className="ri-map-pin-line" />} {b.location}
                      </div>
                    </div>
                  </div>
                  <div className="bids-flexs">
                    <div className="bids-flex-item">
                      <div>RESPONSE TIME</div>
                      <div>{b.responseTime}</div>
                    </div>
                    <div className="bids-flex-item">
                      <div>STATUS</div>
                      <div>
                        <span className={`status-pill ${b.status.toLowerCase()}`}>{b.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {b.coverage && (
                  <div className="coverage">
                    <div className="box-label">Service Coverage</div>
                    <div className="coverage-grid">
                      {b.coverage.map((c) => (
                        <div className="coverage-item" key={c}>
                          <i className="ri-check-line" /> {c}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {b.comments && (
                  <div className="comments">
                    <div className="box-label">Vendor Comments</div>
                    <p className="notes-text">"{b.comments}"</p>
                  </div>
                )}
              </div>
            ))}
            {r.bidsNote && (
              <p className="bids-note">
                <span className="dot" /> {r.bidsNote}
              </p>
            )}
          </>
        ) : (
          <div className="no-bids">
            <b>{r.emptyTitle}</b>
            <p className="no-bids-main">{r.emptyText}</p>
            <p className="no-bids-sub">{r.emptySub}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Quotes() {
  const [open, setOpen] = useState(null);
  return (
    <>
      <Card>
        <Card.Body className="pb-0">
          <div className="page-title mt-0">
    		  	<h5 className="mb-0 fw-bold">My Quotes</h5>
            <div className="d-flex">
              <Form.Select className="mb-0" aria-label="Default select example">
                <option>All</option>
                <option value="1">Requested</option>
                <option value="2">Pending</option>
                <option value="3">Confirmed</option>
              </Form.Select>
    		  	  <Link to="/request-quote" className="btn btn-primary px-3 ms-3 mb-0 w-nowrap"><i className="ri-add-line"></i> New Request</Link>
            </div>
    	    </div>
          <div className="quotes-head card text-muted-foreground">
            <div>ROUTE</div>
            <div>BOOKING PERIOD</div>
            <div>SERVICE</div>
            <div>DIRECTION</div>
            <div>BIDS</div>
            <div>STATUS</div>
            <div>CREATED</div>
          </div>
          {rows.map((r) => (
            <div key={r.id} className={`quote-card card ${r.color}`}>
              <div className="quote-row" onClick={() => setOpen(open === r.id ? null : r.id)}>
                <div className="exp-quote">
                  <i className={open === r.id ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line"}></i>
                  <div className="w-100">
                    <div>ROUTE</div>
                    <div>
                      {" "}
                      {r.route}
                    </div>
                  </div>
                </div>
                <div className="ship-scroll">
                <div className="flex-mob">
                  <div className="flex-first">
                    <div>BOOKING PERIOD</div>
                    <div className="no-wrap">{r.period}</div>
                  </div>
                  <div className="flex-last">
                    <div>SERVICE</div>
                    <div>{r.service}</div>
                  </div>
                </div>
                <div className="flex-mob">
                  <div className="flex-first">
                    <div>DIRECTION</div>
                    <div><span className="tag">IMPORT</span></div>
                  </div>
                  <div className="flex-last">
                    <div>BIDS</div>
                    <div>{r.bids}</div>
                  </div>
                </div>
                <div className="flex-mob">
                  <div className="flex-first">
                    <div>STATUS</div>
                    <div><span className={`status ${r.color}`}>{r.status}</span></div>
                  </div>
                  <div className="flex-last">
                    <div>CREATED</div>
                    <div>{r.created}</div>
                  </div>
                </div>
                </div>
              </div>
              <Progress step={r.step} />
              {open === r.id && (
                <>
                  <Details r={r} />
                </>
              )}
            </div>
          ))}
        </Card.Body>
      </Card>
    </>
  );
}
