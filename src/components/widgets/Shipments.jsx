import { useState, useMemo } from "react";
import { Button, ProgressBar, Row, Col, Card, Modal, Table, Tabs, Tab, Badge, Collapse, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  getShipmentTriggers,
  getToolMap,
  TOOL_STATUS_META,
} from "./shipmentActions";

function Shipments({ initialFilter = "ALL" }) {
  const [show, setShow] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const mapModalClose = () => {
    setShow(false);
    setSelectedShipment(null);
  };
  const mapModalShow = (shipment) => {
    setSelectedShipment(shipment);
    setShow(true);
  };

  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [prevInitialFilter, setPrevInitialFilter] = useState(initialFilter);
  const [searchTerm] = useState("");
  const [expandedShipment, setExpandedShipment] = useState(null);
  const [, setActionModal] = useState(null); // set by openAction when a next-step CTA is clicked
  const [openToolMaps, setOpenToolMaps] = useState({}); // shipmentId -> bool
  const [toolStatusFilter, setToolStatusFilter] = useState({}); // shipmentId -> status | null

  const toggleToolMap = (id) =>
    setOpenToolMaps((prev) => ({ ...prev, [id]: !prev[id] }));
  const setToolFilter = (id, status) =>
    setToolStatusFilter((prev) => ({ ...prev, [id]: prev[id] === status ? null : status }));

  // Keep the internal filter in sync when the parent changes initialFilter.
  if (prevInitialFilter !== initialFilter) {
    setPrevInitialFilter(initialFilter);
    setActiveFilter(initialFilter);
  }

  // "Now" is captured once per mount so trigger windows stay stable while rendering.
  const now = useMemo(() => new Date(), []);

  // Sample shipment data with multiple statuses per location and container numbers
  const shipmentsData = [
    {
      id: 1,
      reference: "MSCU1234567",
      carrier: "MSC",
      mode: "OCEAN",
      shipName: "MSC OSCAR",
      route: "Shanghai, CN - Los Angeles, US",
      status: "DELIVERED",
      eta: "1/15/2026",
      progress: 100,
      lastUpdated: "29/04/2026,5:04:07 pm",
      containers: 3,
      tools: {
        insurance: { status: "completed", updated: "12/19/2025" },
        bl: { status: "completed", updated: "12/21/2025" },
        invoice: { status: "completed", updated: "12/21/2025" },
        packingList: { status: "completed", updated: "12/21/2025" },
        license: { status: "na", note: "No controlled goods" },
        permit: { status: "na" },
        coo: { status: "completed", updated: "12/22/2025" },
        oga: { status: "void", note: "Withdrawn — cargo re-classified" },
        ec82: { status: "completed", updated: "1/2/2026" },
        vendor: { status: "completed", updated: "1/17/2026" },
        invoiceAudit: { status: "completed", note: "USD 480 recovered", updated: "1/22/2026" },
      },
      details: {
        vessel: "MSC",
        atd: "12/20/2025",
        isActual: "YES",
        containerDetails: [
          {
            containerNumber: "MSCU1234567",
            emptyShipper: "12/18/2025",
            gateIn: "12/22/2025",
            loaded: "12/24/2025",
            arrived: "1/15/2026",
            departed: "12/26/2025",
            discharge: "1/16/2026",
            gateOut: "1/17/2026",
            emptyReturned: "1/18/2026"
          },
          {
            containerNumber: "MSCU1234568",
            emptyShipper: "12/19/2025",
            gateIn: "12/23/2025",
            loaded: "12/25/2025",
            arrived: "1/16/2026",
            departed: "12/27/2025",
            discharge: "1/17/2026",
            gateOut: "1/18/2026",
            emptyReturned: "1/19/2026"
          },
          {
            containerNumber: "MSCU1234569",
            emptyShipper: "12/20/2025",
            gateIn: "12/24/2025",
            loaded: "12/26/2025",
            arrived: "1/17/2026",
            departed: "12/28/2025",
            discharge: "1/18/2026",
            gateOut: "1/19/2026",
            emptyReturned: "1/20/2026"
          }
        ],
        tracking: [
          { 
            location: "Shanghai, CN", 
            statuses: [
              { status: "EMPTY TO SHIPPER", container: "MSCU1234567", date: "Dec 18, 2025" },
              { status: "GATE IN", container: "MSCU1234567", date: "Dec 22, 2025" },
              { status: "GATE IN", container: "MSCU1234568", date: "Dec 22, 2025" },
              { status: "GATE IN", container: "MSCU1234569", date: "Dec 22, 2025" }
            ]
          },
          { 
            location: "Yangshan Terminal, Shanghai", 
            statuses: [
              { status: "LOADED ON VESSEL", container: "MSCU1234567", date: "Dec 24, 2025" },
              { status: "LOADED ON VESSEL", container: "MSCU1234568", date: "Dec 24, 2025" },
              { status: "LOADED ON VESSEL", container: "MSCU1234569", date: "Dec 24, 2025" }
            ]
          },
          { 
            location: "Shanghai, CN", 
            statuses: [
              { status: "VESSEL DEPARTED", container: "—", date: "Dec 26, 2025" }
            ]
          },
          { 
            location: "Pacific Ocean", 
            statuses: [
              { status: "IN TRANSIT", container: "—", date: "Dec 27, 2025" }
            ]
          },
          { 
            location: "Los Angeles, US", 
            statuses: [
              { status: "VESSEL ARRIVED", container: "—", date: "Jan 15, 2026" },
              { status: "DISCHARGED", container: "MSCU1234567", date: "Jan 16, 2026" },
              { status: "DISCHARGED", container: "MSCU1234568", date: "Jan 16, 2026" },
              { status: "DISCHARGED", container: "MSCU1234569", date: "Jan 16, 2026" },
              { status: "GATE OUT", container: "MSCU1234567", date: "Jan 17, 2026" },
              { status: "GATE OUT", container: "MSCU1234568", date: "Jan 17, 2026" },
              { status: "GATE OUT", container: "MSCU1234569", date: "Jan 17, 2026" }
            ]
          }
        ]
      }
    },
    {
      id: 2,
      reference: "HLBU9876543",
      carrier: "Hapag-Lloyd",
      mode: "OCEAN",
      shipName: "BERLIN EXPRESS",
      route: "Shenzhen, CN - Long Beach, US",
      status: "DELIVERED",
      eta: "1/8/2026",
      progress: 100,
      lastUpdated: "04/03/2026,5:16:43 am",
      containers: 2,
      tools: {
        insurance: { status: "completed", updated: "12/09/2025" },
        bl: { status: "completed", updated: "12/11/2025" },
        invoice: { status: "completed", updated: "12/11/2025" },
        packingList: { status: "completed", updated: "12/11/2025" },
        license: { status: "completed", updated: "12/14/2025" },
        permit: { status: "na" },
        coo: { status: "na" },
        oga: { status: "completed", updated: "12/15/2025" },
        ec82: { status: "completed", updated: "12/20/2025" },
        vendor: { status: "completed", updated: "1/12/2026" },
        invoiceAudit: { status: "completed", note: "No discrepancies found", updated: "1/15/2026" },
      },
      details: {
        vessel: "BERLIN EXPRESS",
        atd: "12/10/2025",
        isActual: "YES",
        containerDetails: [
          {
            containerNumber: "HLBU9876543",
            emptyShipper: "12/08/2025",
            gateIn: "12/12/2025",
            loaded: "12/12/2025",
            arrived: "1/8/2026",
            departed: "12/14/2025",
            discharge: "1/9/2026",
            gateOut: "1/10/2026",
            emptyReturned: "1/11/2026"
          },
          {
            containerNumber: "HLBU9876544",
            emptyShipper: "12/09/2025",
            gateIn: "12/13/2025",
            loaded: "12/13/2025",
            arrived: "1/9/2026",
            departed: "12/15/2025",
            discharge: "1/10/2026",
            gateOut: "1/11/2026",
            emptyReturned: "1/12/2026"
          }
        ],
        tracking: [
          { 
            location: "Shenzhen, CN", 
            statuses: [
              { status: "EMPTY TO SHIPPER", container: "HLBU9876543", date: "Dec 08, 2025" },
              { status: "EMPTY TO SHIPPER", container: "HLBU9876544", date: "Dec 09, 2025" },
              { status: "GATE IN", container: "HLBU9876543", date: "Dec 12, 2025" },
              { status: "GATE IN", container: "HLBU9876544", date: "Dec 13, 2025" }
            ]
          },
          { 
            location: "Shenzhen Terminal", 
            statuses: [
              { status: "LOADED ON VESSEL", container: "HLBU9876543", date: "Dec 12, 2025" },
              { status: "LOADED ON VESSEL", container: "HLBU9876544", date: "Dec 13, 2025" }
            ]
          },
          { 
            location: "Shenzhen, CN", 
            statuses: [
              { status: "VESSEL DEPARTED", container: "—", date: "Dec 14, 2025" }
            ]
          },
          { 
            location: "Pacific Ocean", 
            statuses: [
              { status: "IN TRANSIT", container: "—", date: "Dec 16, 2025" }
            ]
          },
          { 
            location: "Long Beach, US", 
            statuses: [
              { status: "VESSEL ARRIVED", container: "—", date: "Jan 8, 2026" },
              { status: "DISCHARGED", container: "HLBU9876543", date: "Jan 9, 2026" },
              { status: "DISCHARGED", container: "HLBU9876544", date: "Jan 10, 2026" },
              { status: "GATE OUT", container: "HLBU9876543", date: "Jan 10, 2026" },
              { status: "GATE OUT", container: "HLBU9876544", date: "Jan 11, 2026" }
            ]
          }
        ]
      }
    },
    {
      id: 3,
      reference: "CMA CGMANT0NE",
      carrier: "CMA",
      mode: "OCEAN",
      shipName: "CMA CGM ANT0NE",
      route: "Busan, KR - Seattle, US",
      status: "DELIVERED",
      eta: "1/5/2026",
      progress: 100,
      lastUpdated: "04/03/2026,5:16:17 am",
      containers: 3,
      tools: {
        insurance: { status: "completed", updated: "12/14/2025" },
        bl: { status: "completed", updated: "12/16/2025" },
        invoice: { status: "completed", updated: "12/17/2025" },
        packingList: { status: "completed", updated: "12/17/2025" },
        license: { status: "na" },
        permit: { status: "na" },
        coo: { status: "completed", updated: "12/19/2025" },
        oga: { status: "void", note: "Not required for this lane" },
        ec82: { status: "completed", updated: "12/28/2025" },
        vendor: { status: "completed", updated: "1/9/2026" },
        invoiceAudit: { status: "completed", note: "USD 210 recovered", updated: "1/12/2026" },
      },
      details: {
        vessel: "CMA CGM ANT0NE",
        atd: "12/15/2025",
        isActual: "YES",
        containerDetails: [
          {
            containerNumber: "CMA1234567",
            emptyShipper: "12/12/2025",
            gateIn: "12/16/2025",
            loaded: "12/18/2025",
            arrived: "1/5/2026",
            departed: "12/20/2025",
            discharge: "1/6/2026",
            gateOut: "1/7/2026",
            emptyReturned: "1/8/2026"
          },
          {
            containerNumber: "CMA1234568",
            emptyShipper: "12/13/2025",
            gateIn: "12/17/2025",
            loaded: "12/18/2025",
            arrived: "1/5/2026",
            departed: "12/20/2025",
            discharge: "1/6/2026",
            gateOut: "1/7/2026",
            emptyReturned: "1/8/2026"
          },
          {
            containerNumber: "CMA1234569",
            emptyShipper: "12/14/2025",
            gateIn: "12/18/2025",
            loaded: "12/19/2025",
            arrived: "1/6/2026",
            departed: "12/21/2025",
            discharge: "1/7/2026",
            gateOut: "1/8/2026",
            emptyReturned: "1/9/2026"
          }
        ],
        tracking: [
          { 
            location: "Busan, KR", 
            statuses: [
              { status: "EMPTY TO SHIPPER", container: "CMA1234567", date: "Dec 12, 2025" },
              { status: "EMPTY TO SHIPPER", container: "CMA1234568", date: "Dec 13, 2025" },
              { status: "EMPTY TO SHIPPER", container: "CMA1234569", date: "Dec 14, 2025" },
              { status: "GATE IN", container: "CMA1234567", date: "Dec 16, 2025" },
              { status: "GATE IN", container: "CMA1234568", date: "Dec 17, 2025" },
              { status: "GATE IN", container: "CMA1234569", date: "Dec 18, 2025" }
            ]
          },
          { 
            location: "Busan Port", 
            statuses: [
              { status: "LOADED ON VESSEL", container: "CMA1234567", date: "Dec 18, 2025" },
              { status: "LOADED ON VESSEL", container: "CMA1234568", date: "Dec 18, 2025" },
              { status: "LOADED ON VESSEL", container: "CMA1234569", date: "Dec 19, 2025" }
            ]
          },
          { 
            location: "Busan, KR", 
            statuses: [
              { status: "VESSEL DEPARTED", container: "—", date: "Dec 20, 2025" }
            ]
          },
          { 
            location: "Pacific Ocean", 
            statuses: [
              { status: "IN TRANSIT", container: "—", date: "Dec 22, 2025" }
            ]
          },
          { 
            location: "Seattle, US", 
            statuses: [
              { status: "VESSEL ARRIVED", container: "—", date: "Jan 5, 2026" },
              { status: "DISCHARGED", container: "CMA1234567", date: "Jan 6, 2026" },
              { status: "DISCHARGED", container: "CMA1234568", date: "Jan 6, 2026" },
              { status: "DISCHARGED", container: "CMA1234569", date: "Jan 7, 2026" },
              { status: "GATE OUT", container: "CMA1234567", date: "Jan 7, 2026" },
              { status: "GATE OUT", container: "CMA1234568", date: "Jan 7, 2026" },
              { status: "GATE OUT", container: "CMA1234569", date: "Jan 8, 2026" }
            ]
          }
        ]
      }
    },
    {
      id: 4,
      reference: "EGLV1122334",
      carrier: "Evergreen",
      mode: "OCEAN",
      shipName: "EVER GIVEN",
      route: "Singapore, SG - Oakland, US",
      status: "DELIVERED",
      eta: "12/28/2025",
      progress: 100,
      lastUpdated: "08/01/2026,11:34:07 am",
      containers: 1,
      tools: {
        insurance: { status: "completed", updated: "12/04/2025" },
        bl: { status: "completed", updated: "12/06/2025" },
        invoice: { status: "completed", updated: "12/06/2025" },
        packingList: { status: "completed", updated: "12/07/2025" },
        license: { status: "na" },
        permit: { status: "completed", updated: "12/09/2025" },
        coo: { status: "na" },
        oga: { status: "completed", updated: "12/18/2025" },
        ec82: { status: "completed", updated: "12/22/2025" },
        vendor: { status: "completed", updated: "12/31/2025" },
        invoiceAudit: { status: "completed", note: "All invoices reconciled", updated: "1/5/2026" },
      },
      details: {
        vessel: "EVER GIVEN",
        atd: "12/05/2025",
        isActual: "YES",
        containerDetails: [
          {
            containerNumber: "EGLV1122334",
            emptyShipper: "12/02/2025",
            gateIn: "12/06/2025",
            loaded: "12/08/2025",
            arrived: "12/28/2025",
            departed: "12/10/2025",
            discharge: "12/29/2025",
            gateOut: "12/30/2025",
            emptyReturned: "12/31/2025"
          }
        ],
        tracking: [
          { 
            location: "Singapore, SG", 
            statuses: [
              { status: "EMPTY TO SHIPPER", container: "EGLV1122334", date: "Dec 02, 2025" },
              { status: "GATE IN", container: "EGLV1122334", date: "Dec 06, 2025" }
            ]
          },
          { 
            location: "Singapore Port", 
            statuses: [
              { status: "LOADED ON VESSEL", container: "EGLV1122334", date: "Dec 08, 2025" }
            ]
          },
          { 
            location: "Singapore, SG", 
            statuses: [
              { status: "VESSEL DEPARTED", container: "—", date: "Dec 10, 2025" }
            ]
          },
          { 
            location: "Indian Ocean", 
            statuses: [
              { status: "IN TRANSIT", container: "—", date: "Dec 12, 2025" }
            ]
          },
          { 
            location: "Oakland, US", 
            statuses: [
              { status: "VESSEL ARRIVED", container: "—", date: "Dec 28, 2025" },
              { status: "DISCHARGED", container: "EGLV1122334", date: "Dec 29, 2025" },
              { status: "GATE OUT", container: "EGLV1122334", date: "Dec 30, 2025" },
              { status: "EMPTY RETURNED", container: "EGLV1122334", date: "Dec 31, 2025" }
            ]
          }
        ]
      }
    }
  ];

  // Filter shipments based on active filter and search
  const filteredShipments = shipmentsData.filter(shipment => {
    // Filter by type
    if (activeFilter === "OCEAN" && shipment.carrier !== "MSC" && shipment.carrier !== "Hapag-Lloyd" && shipment.carrier !== "CMA" && shipment.carrier !== "Evergreen") return false;
    if (activeFilter === "AIR") return false;
    if (activeFilter === "PENDING") return false;
    if (activeFilter === "DELIVERED") {
      // All are delivered in demo
    }

    // Search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        shipment.reference.toLowerCase().includes(search) ||
        shipment.route.toLowerCase().includes(search) ||
        shipment.carrier.toLowerCase().includes(search) ||
        shipment.status.toLowerCase().includes(search) ||
        shipment.shipName.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedShipment(expandedShipment === id ? null : id);
  };

  const getStatusTextColor = (status) => {
    switch(status) {
      case "DELIVERED": return "border-success text-success";
      case "IN TRANSIT": return "border-warning text-warning";
      case "PENDING": return "border-danger text-danger";
      default: return "border-danger text-danger";
    }
  };

  const getStatusBorderColor = (status) => {
    switch(status) {
      case "DELIVERED": return "border-success";
      case "IN TRANSIT": return "border-warning";
      case "PENDING": return "border-danger";
      default: return "border-warning";
    }
  };

  const openAction = (shipment, action, title) => setActionModal({ shipment, action, title });

  return (
    <>
      <Card>
        <Card.Body className="pb-3">
          <div className="page-title d-block d-lg-flex mt-0">
            <h5 className="mb-0 fw-bold">Shipments</h5>
            <div className="shipment-filters mb-lg-0 mt-ms-0 mt-3">
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${activeFilter === "ALL" ? "active" : ""}`}
                  onClick={() => setActiveFilter("ALL")}
                >
                  All Shipments
                </button>
                <button 
                  className={`filter-tab ${activeFilter === "OCEAN" ? "active" : ""}`}
                  onClick={() => setActiveFilter("OCEAN")}
                >
                  Ocean Shipments
                </button>
                <button 
                  className={`filter-tab ${activeFilter === "AIR" ? "active" : ""}`}
                  onClick={() => setActiveFilter("AIR")}
                >
                  Air Shipments
                </button>
                <button 
                  className={`filter-tab ${activeFilter === "PENDING" ? "active" : ""}`}
                  onClick={() => setActiveFilter("PENDING")}
                >
                  Pending Actions
                </button>
                <button 
                  className={`filter-tab ${activeFilter === "DELIVERED" ? "active" : ""}`}
                  onClick={() => setActiveFilter("DELIVERED")}
                >
                  Delivered (30D)
                </button>
              </div>
            </div>
          </div>

          {/* Shipments List */}
          <div className="shipments-list">
            {/* Header */}
            <div className="shipments-header card">
              <span className="col-actions">ACTIONS</span>
              <span className="col-reference">REFERENCE</span>
              <span className="col-carrier">CARRIER</span>
              <span className="col-ship">SHIP NAME</span>
              <span className="col-route">ROUTE</span>
              <span className="col-vissel">VESSEL DEPARTED</span>
              <span className="col-eta">ETA</span>
              <span className="col-arrived">ARRIVED</span>
              <span className="col-isactual">IS ACTUAL</span>
              <span className="col-status">STATUS</span>
            </div>

            {/* Shipment Rows */}
            {filteredShipments.map((shipment) => {
              const triggers = getShipmentTriggers(shipment, now);
              const tools = getToolMap(shipment);
              const toolAlerts = tools.filter((t) => t.actionable).length;
              return (
              <div key={shipment.id} className={`shipment-item-wrapper ${getStatusBorderColor(shipment.status)}`}>
                <div className={`shipment-item ${expandedShipment === shipment.id ? "expanded" : ""}`}>
                  <div className="shipment-row">
                    <div className="ship-flexs">
                      <div className="col-actions">
                        <Button 
                          variant="dark" 
                          size="sm" 
                          className="expand-btn"
                          onClick={() => toggleExpand(shipment.id)}
                        >
                          <i className={`ri-arrow-${expandedShipment === shipment.id ? 'up' : 'down'}-s-line`}></i>
                        </Button>
                        <Button 
                          variant="dark" 
                          size="sm" 
                          className="expand-btn" 
                          onClick={() => mapModalShow(shipment)}
                        >
                          <i className="ri-map-2-line"></i>
                        </Button>
                        <Button 
                          variant="dark" 
                          size="sm" 
                          className="expand-btn position-relative"
                        >
                          <i className="ri-check-double-line"></i>
                          <span className="incom-task">3</span>
                        </Button>
                      </div>
                    </div>
                    <div className="ship-scroll">
                    <div className="ship-flexs">
                      <div className="ship-flex-item">
                        <span className="col-reference">REFERENCE</span>
                        <span className="col-reference"><i className="ri-ship-line text-muted-foreground me-1"></i> {shipment.reference}</span>
                      </div>
                    </div>
                    <div className="ship-flexs">
                      <div className="ship-flex-item">
                        <span className="col-carrier">CARRIER</span>
                        <span className="col-carrier">{shipment.carrier}</span>
                      </div>
                      <div className="ship-flex-item">
                        <span className="col-ship">SHIP NAME</span>
                        <span className="col-ship">{shipment.shipName}</span>
                      </div>
                    </div>
                    <div className="ship-flexs">
                      <div className="ship-flex-item">
                        <span className="col-route">ROUTE</span>
                        <span className="col-route">{shipment.route}</span>
                      </div>
                      <div className="ship-flex-item">
                        <span className="col-vissel">VESSEL DEPARTED</span>
                        <span className="col-vissel">-</span>
                      </div>
                    </div>
                    <div className="ship-flexs">
                      <div className="ship-flex-item">
                        <span className="col-eta">ETA</span>
                        <span className="col-eta">{shipment.eta}</span>
                      </div>
                      <div className="ship-flex-item">
                        <span className="col-arrived">ARRIVED</span>
                        <span className="col-arrived">{shipment.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="ship-flexs">
                      <div className="ship-flex-item">
                        <span className="col-isactual">IS ACTUAL</span>
                        <span className="col-isactual">-</span>
                      </div>
                      <div className="ship-flex-item">
                        <span className="col-status">STATUS</span>
                        <span className={`col-status status ${getStatusTextColor(shipment.status)}`}>
                          {shipment.status}
                        </span>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedShipment === shipment.id && (
                  <div className="shipment-details pb-0">
                    <Card className="mb-3">
                      <Card.Body>
                        {/* Header with Reference and Container Info */}
                        <div className="details-header align-items-start">
                          <div>
                            <div className="d-flex">
                              <h4>{shipment.reference}</h4>
                              <div className="d-flex">
                                <div className="tracking-status-name my-0 mx-2">{shipment.mode}</div>
                                <div className="tracking-status-name my-0">{shipment.status}</div>
                              </div>
                            </div>
                            <span className="container-info">{shipment.containers} container{shipment.containers > 1 ? 's' : ''} in this shipment</span>
                          </div>
                          <Button
                            variant="outline-light"
                            size="sm"
                            onClick={() => openAction(shipment, "assistant", "Ask the assistant")}
                          >
                            <i className="ri-robot-2-line me-1"></i> Ask the assistant
                          </Button>
                        </div>

                        {/* Location and ATD */}
                        <div className="location-atd">
                          <div className="location-info">
                            <i className="ri-map-pin-line"></i>
                            <span className="location-name">{shipment.details.tracking[0]?.location}</span>
                          </div>
                          <div className="location-info">
                            <span className="location-name">
                              {shipment.details.tracking[shipment.details.tracking.length - 1]?.location || "Destination"}
                            </span>
                            <i className="ri-map-pin-line"></i>
                          </div>
                        </div>
                        <ProgressBar animated now={shipment.progress ?? 70} className="track-progress" />
                        <div className="d-flex justify-content-between mt-2">
                          <div className="container-info">ATD: {shipment.details.atd || "—"}</div>
                          <div className="container-info">ETA: {shipment.eta}</div>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* Container Details Grid */}
                    <Card className="mb-3">
                      <Card.Body>
                        <Table responsive className="mb-0 ship-contanier tool-map-table">
                          <thead>
                            <tr>
                              <th>CONTAINER #</th>
                              <th>EMPTY TO SHIPPER</th>
                              <th>GATE IN</th>
                              <th>LOADED ON VESSEL</th>
                              <th>ARRIVED AT T/S PORT</th>
                              <th>DEPARTED FROM T/S PORT</th>
                              <th>DISCHARGE</th>
                              <th>GATE OUT</th>
                              <th>EMPTY RETURNED</th>
                            </tr>
                          </thead>
                          <tbody>
                            {shipment.details.containerDetails && shipment.details.containerDetails.length > 0 ? (
                              shipment.details.containerDetails.map((container, index) => (
                                <tr key={index}>
                                  <td className="text-primary fw-bold">{container.containerNumber}</td>
                                  <td>{container.emptyShipper}</td>
                                  <td>{container.gateIn}</td>
                                  <td>{container.loaded}</td>
                                  <td>{container.arrived}</td>
                                  <td>{container.departed}</td>
                                  <td>{container.discharge}</td>
                                  <td>{container.gateOut}</td>
                                  <td>{container.emptyReturned}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td>{shipment.reference}</td>
                                <td>{shipment.details.emptyShipper || '—'}</td>
                                <td>{shipment.details.gateIn || '—'}</td>
                                <td>{shipment.details.loaded || '—'}</td>
                                <td>{shipment.details.arrived || '—'}</td>
                                <td>{shipment.details.departed || '—'}</td>
                                <td>{shipment.details.discharge || '—'}</td>
                                <td>{shipment.details.gateOut || '—'}</td>
                                <td>{shipment.details.emptyReturned || '—'}</td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>

                    {/* ---------------- PART 1: trigger-driven next steps ---------------- */}
                    <Card className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                          <div>
                            <h5 className="mb-0 fw-bold">Next Steps for this shipment</h5>
                            <span className="container-info">
                              Automatically triggered from the shipment milestones — the assistant reads the same rules.
                            </span>
                          </div>
                        </div>

                        <div className="next-steps-grid">
                          {triggers.map((trigger) => (
                            <div key={trigger.key} className={`next-step-card state-${trigger.state}`}>
<div className="next-step-title">
                                <i className={trigger.icon}></i>
                                  <span>{trigger.title}</span>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip id={`tooltip-${trigger.key}`} className="next-step-tooltip">
                                        <div className="next-step-msg">{trigger.message}</div>
                                        <div className="next-step-meta">{trigger.meta}</div>
                                      </Tooltip>
                                    }
                                  >
                                    <div className="next-step-info"><i className="ri-information-2-fill"></i></div>
                                  </OverlayTrigger>
                                  <span className={`ms-auto ${STATE_PILL[trigger.state]}`}>
                                    {STATE_LABEL[trigger.state]}
                                  </span>
                                </div>
                              {(trigger.cta || trigger.secondaryCta) && (
                                <div className="next-step-actions">
                                  {trigger.cta && (
                                    <Button
                                      size="sm"
                                      variant={trigger.state === "offer" ? "outline-primary" : "primary"}
                                      onClick={() => openAction(shipment, trigger.action, trigger.cta)}
                                    >
                                      {trigger.cta}
                                    </Button>
                                  )}
                                  {trigger.secondaryCta && (
                                    <Button
                                      size="sm"
                                      variant="outline-light"
                                      onClick={() => openAction(shipment, trigger.secondaryAction, trigger.secondaryCta)}
                                    >
                                      {trigger.secondaryCta}
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>

                    <Row>
                      <Col lg={12}>
                        {/* ---------------- PART 2: tool & status map (collapsible) --- */}
                        <Card className="mb-3">
                          <Card.Body>
                            <ToolMapCard
                              shipment={shipment}
                              tools={tools}
                              toolAlerts={toolAlerts}
                              openToolMaps={openToolMaps}
                              toolStatusFilter={toolStatusFilter}
                              setOpenToolMaps={setOpenToolMaps}
                              toggleToolMap={toggleToolMap}
                              setToolFilter={setToolFilter}
                              openAction={openAction}
                            />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            )})}

            {filteredShipments.length === 0 && (
              <div className="no-results">
                <i className="ri-inbox-line"></i>
                <p>No shipments found matching your criteria</p>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Live Map & Tracking Modal */}
      <Modal 
        show={show} 
        onHide={mapModalClose}
        scrollable={true}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Live Map & Tracking - {selectedShipment?.reference || ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedShipment && (
            <Tabs
              defaultActiveKey="tracking"
              id="shipment-tabs"
              className="mb-3 gap-2 ship-details-modal"
            >
              <Tab eventKey="tracking" title="Tracking Timeline">
                <Card className="mb-0">
                  <Card.Body className="pb-3 poueds">
                    <div className="page-title mt-0">
                      <h5 className="mb-0 fw-bold">Tracking Timeline</h5>
                    </div>
                    {/* Tracking Timeline - Updated to show container names with status */}
                    <div className="tracking-timeline-detailed">
                      {selectedShipment.details.tracking.map((track, index) => (
                        <div key={index} className="tracking-item">
                          <div className="tracking-dot"><i className="ri-map-pin-line"></i></div>
                          <div className="tracking-content-detailed">
                            <div className="tracking-location-name">{track.location}</div>
                            {/* Display multiple statuses with container names for this location */}
                            {track.statuses.map((statusItem, statusIndex) => (
                              <div key={statusIndex} className="d-flex justify-content-between align-items-center mt-1">
                                <div className="d-flex align-items-center">
                                  <div class="adj-staus-box"><div className="tracking-status-name">{statusItem.status}</div></div>
                                  <div className="tracking-container-name text-muted-foreground ms-2">
                                    {statusItem.container !== "—" ? `Container: ${statusItem.container}` : ''}
                                  </div>
                                </div>
                                <div className="tracking-date-name toadj">{statusItem.date}</div>
                              </div>
                            ))}
                          </div>
                          {index < selectedShipment.details.tracking.length - 1 && (
                            <div className="tracking-line-detailed"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Tab>
              <Tab eventKey="map" title="Live Map">
                <Card className="mb-0">
                  <Card.Body>
                    <div className="page-title mt-0">
                      <h5 className="mb-0 fw-bold">Live Map</h5>
                    </div>
                    <div className="border border-light border-opacity-10 rounded d-flex align-items-center justify-content-center text-muted-foreground" style={{ height: 500 }}>Add Live Map Here</div>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

const STATE_LABEL = {
  action: "Action needed",
  offer: "Optional",
  waiting: "Not yet open",
  expired: "Window closed",
};

const STATE_PILL = {
  action: "tool-pill tool-pill--update",
  offer: "tool-pill tool-pill--submitted",
  waiting: "tool-pill tool-pill--pending",
  expired: "tool-pill tool-pill--void",
};

function ToolMapCard({
  shipment,
  tools,
  toolAlerts,
  openToolMaps,
  toolStatusFilter,
  setOpenToolMaps,
  toggleToolMap,
  setToolFilter,
  openAction,
}) {
  const isOpen = Boolean(openToolMaps[shipment.id]);
  const activeStatus = toolStatusFilter[shipment.id] || null;
  const counts = tools.reduce((acc, tool) => {
    acc[tool.status] = (acc[tool.status] || 0) + 1;
    return acc;
  }, {});
  const rows = activeStatus ? tools.filter((tool) => tool.status === activeStatus) : tools;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div
          className="tool-map-toggle d-flex align-items-center gap-2"
          onClick={() => toggleToolMap(shipment.id)}
        >
          <i className={`ri-arrow-${isOpen ? "up" : "down"}-s-line`}></i>
          <div>
            <h5 className="mb-0 fw-bold">
              Status
              {toolAlerts > 0 && (
                <Badge bg="warning" text="dark" className="ms-2 rounded-pill">
                  {toolAlerts} to address
                </Badge>
              )}
            </h5>
            <span className="container-info">
              {tools.length} tools for {shipment.reference} — vessel:{" "}
              <strong>{shipment.details.vessel}</strong>
            </span>
          </div>
        </div>

        {/* Counters double as status filters */}
        <div className="tool-legend">
          {Object.entries(TOOL_STATUS_META).map(([key, meta]) => {
            const count = counts[key] || 0;
            return (
              <button
                key={key}
                type="button"
                disabled={count === 0}
                className={`tool-counter ${activeStatus === key ? "is-active" : ""}`}
                onClick={() => {
                  if (!count) return;
                  setToolFilter(shipment.id, key);
                  setOpenToolMaps((prev) => ({ ...prev, [shipment.id]: true }));
                }}
              >
                <span className={meta.className}>
                  <i className={meta.icon}></i> {meta.label} {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Collapse in={isOpen}>
        <div>
          <Table responsive className="mb-0 mt-3 ship-contanier tool-map-table">
            <thead>
              <tr>
                <th>TOOL</th>
                <th>CATEGORY</th>
                <th>STATUS</th>
                <th>NOTE</th>
                <th>LAST UPDATED</th>
                <th className="text-end">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((tool) => {
                const meta = TOOL_STATUS_META[tool.status];
                return (
                  <tr key={tool.key}>
                    <td className="fw-bold">{tool.label}</td>
                    <td className="tool-group-label">{tool.group}</td>
                    <td>
                      <span className={meta.className}>
                        <i className={meta.icon}></i> {meta.label}
                      </span>
                    </td>
                    <td className="text-muted-foreground">{tool.note || "—"}</td>
                    <td>{tool.updated}</td>
                    <td className="text-end">
                      {tool.status === "error" && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => openAction(shipment, `tool:${tool.key}`, `Resolve error — ${tool.label}`)}
                        >
                          <i className="ri-error-warning-line me-1"></i> Resolve
                        </Button>
                      )}
                      {tool.status === "update" && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => openAction(shipment, `tool:${tool.key}`, `Update — ${tool.label}`)}
                        >
                          <i className="ri-upload-2-line me-1"></i> Update
                        </Button>
                      )}
                      {!tool.actionable && <span className="text-muted-foreground">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {activeStatus && (
            <Button
              size="sm"
              variant="outline-light"
              className="mt-2"
              onClick={() => setToolFilter(shipment.id, activeStatus)}
            >
              Clear filter
            </Button>
          )}
        </div>
      </Collapse>
    </>
  );
}

export default Shipments;