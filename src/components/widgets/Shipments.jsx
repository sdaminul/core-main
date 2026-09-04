import { useState, useMemo } from "react";
import { Button, ProgressBar, Row, Col, Card, Modal, Table, Tabs, Tab, Badge, Collapse, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import {
  getShipmentTriggers,
  getToolMap,
  TOOL_STATUS_META,
} from "./shipmentActions";
import ActionsModal from "../ui/ActionsModal";

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

  // Add these states at the top of your Shipments component
  const [collaborationShow, setCollaborationShow] = useState(false);
  const collaborationModalShow = () => {
    setCollaborationShow(true);
  };
  const collaborationModalClose = () => {
    setCollaborationShow(false);
  };

  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [prevInitialFilter, setPrevInitialFilter] = useState(initialFilter);
  const [searchTerm] = useState("");
  const [expandedShipment, setExpandedShipment] = useState(null);
  const [, setActionModal] = useState(null); // set by openAction when a next-step CTA is clicked
  const [openToolMaps, setOpenToolMaps] = useState({}); // shipmentId -> bool
  const [toolStatusFilter, setToolStatusFilter] = useState({}); // shipmentId -> status | null

  // Quick-action modal (DemDet, etc.) opened from a shipment row's action buttons
  const [actionModalShow, setActionModalShow] = useState(false);
  const [actionTab, setActionTab] = useState("demdet");
  const [actionShipment, setActionShipment] = useState(null);

  const handleActionClick = (tabKey, shipment = null) => {
    setActionTab(tabKey);
    setActionShipment(shipment);
    setActionModalShow(true);
  };

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
              <Form.Select
                className="filter-select mb-0"
                aria-label="Filter shipments"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
              >
                <option value="ALL">All Shipments</option>
                <option value="OCEAN">Ocean Shipments</option>
                <option value="AIR">Air Shipments</option>
                <option value="PENDING">Pending Actions</option>
                <option value="DELIVERED">Delivered (30D)</option>
              </Form.Select>
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
                          className="expand-btn position-relative"
                          onClick={() => toggleExpand(shipment.id)}
                        >
                          <i className={`ri-arrow-${expandedShipment === shipment.id ? 'up' : 'down'}-s-line`}></i>
                          
                          <span className="incom-task">3</span>
                        </Button>
                        <Button 
                          variant="dark" 
                          size="sm" 
                          className="expand-btn"
                        >
                          <i className="ri-check-double-line"></i>
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
                          <div className="d-flex">
                            <Button
                              variant="dark"
                              size="sm"
                              className="expand-btn me-1 ico-cont"
                              onClick={() => handleActionClick('demdet', shipment)}
                            >
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                                <path d="M3 19H21M3 5H21M4 5V19M20 5V19M8 8.5V15.5M16 8.5V15.5M12 8.5V15.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </Button>
                            <Button 
                              variant="dark" 
                              size="sm" 
                              className="expand-btn me-1" 
                              onClick={() => mapModalShow(shipment)}
                            >
                              <i className="ri-map-2-line"></i>
                            </Button>
                            <Button 
                              variant="dark" 
                              size="sm" 
                              className="expand-btn me-1"
                              onClick={() => collaborationModalShow()}
                            >
                              <i className="ri-user-add-line"></i>
                            </Button>
                            <Button 
                              variant="dark" 
                              size="sm" 
                              className="expand-btn me-1"
                              onClick={() => collaborationModalShow()}
                            >
                              <i className="ri-share-line"></i>
                            </Button>
                            <Button 
                              variant="dark" 
                              size="sm" 
                              className="expand-btn me-1"
                            >
                              <i className="ri-notification-3-line"></i>
                            </Button>
                            <Button 
                              variant="dark" 
                              size="sm" 
                              className="expand-btn me-1"
                            >
                              <i className="ri-refresh-line"></i>
                            </Button>
                            <Button
                                className="ask-ai"
                                variant="outline-light"
                                size="sm"
                                onClick={() => openAction(shipment, "assistant", "Ask the assistant")}
                              >
                                <i className="ri-robot-2-line me-1"></i> <span>Ask the assistant</span>
                            </Button>
                          </div>
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
                          {triggers.map((trigger) => {
                            // Triggers that carry a modalTab open the matching tool
                            // modal (e.g. D&D); the rest go through openAction.
                            const runTrigger = (action, tab, label) =>
                              tab
                                ? handleActionClick(tab, shipment)
                                : openAction(shipment, action, label);
                            return (
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
                                      onClick={() => runTrigger(trigger.action, trigger.modalTab, trigger.cta)}
                                    >
                                      {trigger.cta}
                                    </Button>
                                  )}
                                  {trigger.secondaryCta && (
                                    <Button
                                      size="sm"
                                      variant="outline-light"
                                      onClick={() =>
                                        runTrigger(
                                          trigger.secondaryAction,
                                          trigger.secondaryModalTab,
                                          trigger.secondaryCta,
                                        )
                                      }
                                    >
                                      {trigger.secondaryCta}
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                            );
                          })}
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
                                  <div className="adj-staus-box"><div className="tracking-status-name">{statusItem.status}</div></div>
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
              <Tab eventKey="comments" title="Comments">
                <Card className="mb-0">
                  <Card.Body>
                    <div className="page-title mt-0">
                      <h5 className="mb-0 fw-bold">Comments</h5>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex flex-wrap align-items-center gap-2" style={{ fontSize: '0.75rem' }}>
                        <i className="ri-group-line"></i>
                        <span>Collaborators:</span>
                        <span className="border rounded px-2 py-0-5">
                          <span className="text-muted-foreground">Demo Shipper (you)</span> · Owner
                        </span>
                        <span className="border rounded px-2 py-0-5">
                          <span className="text-muted-foreground">abrar</span> · Can comment
                        </span>
                        <span className="border rounded px-2 py-0-5">
                          <span className="text-muted-foreground">Saif</span> · Can edit
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="border rounded p-3 mb-2">
                        <div className="d-flex align-items-start justify-content-between">
                          <div className="flex-grow-1">
                            <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>
                              <span className="fw-medium text-muted-foreground">Demo Shipper</span> · 8/20/2026, 7:49:01 PM
                            </p>
                            <p className="mb-0 text-wrap" style={{ fontSize: '0.875rem' }}>
                              <span className="text-primary fw-medium">@abrar</span>
                              <span> can you confirm the new mention emails land correctly?</span>
                            </p>
                          </div>
                          <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0 ms-3">Delete</button>
                        </div>
                      </div>
                      <div className="border rounded p-3 mb-2">
                        <div className="d-flex align-items-start justify-content-between">
                          <div className="flex-grow-1">
                            <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>
                              <span className="fw-medium text-muted-foreground">Saif</span> · 8/20/2026, 10:30:36 PM
                            </p>
                            <p className="mb-0 text-wrap" style={{ fontSize: '0.875rem' }}>
                              <span className="text-primary fw-medium">@abrar</span>
                              <span> looks good.</span>
                            </p>
                          </div>
                          <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0 ms-3">Delete</button>
                        </div>
                      </div>
                      <div className="border rounded p-3 mb-2">
                        <div className="d-flex align-items-start justify-content-between">
                          <div className="flex-grow-1">
                            <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>
                              <span className="fw-medium text-muted-foreground">Demo Shipper</span> · 8/20/2026, 10:31:31 PM
                            </p>
                            <p className="mb-0 text-wrap" style={{ fontSize: '0.875rem' }}>
                              <span className="text-primary fw-medium">@Saif</span>
                              <span> test email template</span>
                            </p>
                          </div>
                          <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0 ms-3">Delete</button>
                        </div>
                      </div>
                      <div className="border rounded p-2">
                        <div className="d-flex align-items-start justify-content-between">
                          <div className="flex-grow-1">
                            <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>
                              <span className="fw-medium text-muted-foreground">Demo Shipper</span> · 8/24/2026, 8:01:28 AM
                            </p>
                            <p className="mb-0 text-wrap" style={{ fontSize: '0.875rem' }}>
                              <span className="text-primary fw-medium">@abrar</span>
                              <span> dark mode test - this mention email should now be readable in dark and light mode, with the Go to conversation button</span>
                            </p>
                          </div>
                          <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0 ms-3">Delete</button>
                        </div>
                      </div>
                    </div>
                    <form>
                      <div className="mb-2">
                        <textarea className="form-control" rows="3" placeholder="Write a comment..." maxLength="2000"></textarea>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="mb-0" style={{ fontSize: '0.75rem' }}>Type @ to mention a collaborator — they'll get an email.</p>
                        <button type="submit" className="btn btn-sm btn-primary px-4">Post comment</button>
                      </div>
                    </form>
                  </Card.Body>
                </Card>
              </Tab>
              <Tab eventKey="documents" title="Documents">
                <Card className="mb-0">
                  <Card.Body>
                    <div className="page-title mt-0">
                      <h5 className="mb-0 fw-bold">Documents</h5>
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2 border rounded p-3 mb-2 flex-wrap">
                        <div className="d-flex align-items-center gap-2 flex-grow-1 min-w-0">
                          <i className="ri-file-excel-2-line flex-shrink-0 text-primary" style={{ fontSize: '1.25rem' }}></i>
                          <div className="flex-grow-1 min-w-0">
                            <p className="text-truncate mb-0" style={{ fontSize: '0.875rem' }}>
                              <span className="fw-medium text-muted-foreground">packing-list-demo.csv</span>
                              <span class="tool-pill tool-pill-now ms-2">Packing List</span>
                            </p>
                            <p className="mb-0" style={{ fontSize: '0.75rem' }}>310 B · Demo Shipper · 9/2/2026, 8:48:28 AM</p>
                          </div>
                        </div>
                        <a href="#" className="btn btn-sm btn-dark flex-shrink-0" title="Download"><i className="ri-download-2-line"></i></a>
                        <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0">Delete</button>
                      </div>
                      <div className="d-flex align-items-center gap-2 border rounded p-3 mb-2 flex-wrap">
                        <div className="d-flex align-items-center gap-2 flex-grow-1 min-w-0">
                          <i className="ri-file-word-2-line flex-shrink-0 text-primary" style={{ fontSize: '1.25rem' }}></i>
                          <div className="flex-grow-1 min-w-0">
                            <p className="text-truncate mb-0" style={{ fontSize: '0.875rem' }}>
                              <span className="fw-medium text-muted-foreground">CORE_one-pager.docx</span>
                              <span class="tool-pill tool-pill-now ms-2">Certificate of Origin</span>
                            </p>
                            <p className="mb-0" style={{ fontSize: '0.75rem' }}>9 KB · Demo Shipper · 8/25/2026, 3:43:24 PM</p>
                          </div>
                        </div>
                        <a href="#" className="btn btn-sm btn-dark flex-shrink-0" title="Download"><i className="ri-download-2-line"></i></a>
                        <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0">Delete</button>
                      </div>
                      <div className="d-flex align-items-center gap-2 border rounded p-3 mb-2 flex-wrap">
                        <div className="d-flex align-items-center gap-2 flex-grow-1 min-w-0">
                          <i className="ri-file-word-2-line flex-shrink-0 text-primary" style={{ fontSize: '1.25rem' }}></i>
                          <div className="flex-grow-1 min-w-0">
                            <p className="text-truncate mb-0" style={{ fontSize: '0.875rem' }}>
                              <span className="fw-medium text-muted-foreground">CORE_one-pager.docx</span>
                            </p>
                            <p className="mb-0" style={{ fontSize: '0.75rem' }}>9 KB · Demo Shipper · 8/25/2026, 3:43:02 PM</p>
                          </div>
                        </div>
                        <a href="#" className="btn btn-sm btn-dark flex-shrink-0" title="Download"><i className="ri-download-2-line"></i></a>
                        <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0">Delete</button>
                      </div>
                      <div className="d-flex align-items-center gap-2 border rounded p-3 mb-2 flex-wrap">
                        <div className="d-flex align-items-center gap-2 flex-grow-1 min-w-0">
                          <i className="ri-file-pdf-2-line flex-shrink-0 text-primary" style={{ fontSize: '1.25rem' }}></i>
                          <div className="flex-grow-1 min-w-0">
                            <p className="text-truncate mb-0" style={{ fontSize: '0.875rem' }}>
                              <span className="fw-medium text-muted-foreground">packing-list-sample.pdf</span>
                              <span class="tool-pill tool-pill-now ms-2">Packing List</span>
                            </p>
                            <p className="mb-0" style={{ fontSize: '0.75rem' }}>439 B · Demo Shipper · 8/25/2026, 8:34:48 AM</p>
                          </div>
                        </div>
                        <button type="button" className="btn btn-sm btn-dark flex-shrink-0" title="View"><i className="ri-eye-line"></i></button>
                        <a href="#" className="btn btn-sm btn-dark flex-shrink-0" title="Download"><i className="ri-download-2-line"></i></a>
                        <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0">Delete</button>
                      </div>
                      <div className="d-flex align-items-center gap-2 border rounded p-3 flex-wrap">
                        <div className="d-flex align-items-center gap-2 flex-grow-1 min-w-0">
                          <i className="ri-file-pdf-2-line flex-shrink-0 text-primary" style={{ fontSize: '1.25rem' }}></i>
                          <div className="flex-grow-1 min-w-0">
                            <p className="text-truncate mb-0" style={{ fontSize: '0.875rem' }}>
                              <span className="fw-medium text-muted-foreground">sample-invoice.pdf</span>
                            </p>
                            <p className="mb-0" style={{ fontSize: '0.75rem' }}>209 B · Demo Shipper · 8/24/2026, 5:18:50 PM</p>
                          </div>
                        </div>
                        <button type="button" className="btn btn-sm btn-dark flex-shrink-0" title="View"><i className="ri-eye-line"></i></button>
                        <a href="#" className="btn btn-sm btn-dark flex-shrink-0" title="Download"><i className="ri-download-2-line"></i></a>
                        <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0">Delete</button>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
                        <p className="text-muted-foreground mb-0" style={{ fontSize: '0.75rem' }}>Up to 20 files, 4 MB each.</p>
                        <div class="d-flex no-wrap">
                          <select className="form-select me-2">
                            <option>No tag</option>
                            <option>Bill of Lading</option>
                          </select>
                          <button type="button" className="btn btn-primary"><i className="ri-upload-2-line"></i> Upload Document</button>
                        </div>
                      </div>
                  </Card.Body>
                </Card>
              </Tab>
              <Tab eventKey="inventory" title="Inventory">
                <Card className="mb-0">
                  <Card.Body>
                    <div className="page-title mt-0">
                      <h5 className="mb-0 fw-bold">Inventory</h5>
                    </div>
                    <div>
                      <div className="row g-2 mb-4">
                        <div className="col-6 col-sm-3">
                          <div className="border rounded px-3 py-2">
                            <p className="text-uppercase text-muted-foreground mb-0" style={{ fontSize: '0.6875rem', letterSpacing: '0.05em' }}>Items</p>
                            <p className="fw-semibold fs-6 mb-0" style={{ fontSize: '1rem' }}>3</p>
                          </div>
                        </div>
                        <div className="col-6 col-sm-3">
                          <div className="border rounded px-3 py-2">
                            <p className="text-uppercase text-muted-foreground mb-0" style={{ fontSize: '0.6875rem', letterSpacing: '0.05em' }}>Quantity</p>
                            <p className="fw-semibold fs-6 mb-0" style={{ fontSize: '1rem' }}>6,800</p>
                          </div>
                        </div>
                        <div className="col-6 col-sm-3">
                          <div className="border rounded px-3 py-2">
                            <p className="text-uppercase text-muted-foreground mb-0" style={{ fontSize: '0.6875rem', letterSpacing: '0.05em' }}>Gross kg</p>
                            <p className="fw-semibold fs-6 mb-0" style={{ fontSize: '1rem' }}>846.5</p>
                          </div>
                        </div>
                        <div className="col-6 col-sm-3">
                          <div className="border rounded px-3 py-2">
                            <p className="text-uppercase text-muted-foreground mb-0" style={{ fontSize: '0.6875rem', letterSpacing: '0.05em' }}>Value</p>
                            <p className="fw-semibold fs-6 mb-0" style={{ fontSize: '1rem' }}>USD 5,050.00</p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                        <p className="text-muted-foreground mb-0" style={{ fontSize: '0.75rem' }}>Packing-list lines for this shipment. Rows read from a file are suggestions — check them against the document.</p>
                        <div className="d-flex flex-wrap align-items-center gap-2">
                          <a href="#" className="btn btn-sm btn-dark" download><i className="ri-download-2-line me-1 align-middle"></i>Export CSV</a>
                          <button type="button" className="btn btn-sm btn-dark"><i className="ri-add-line me-1 align-middle"></i>Add item</button>
                          <button type="button" className="btn btn-sm btn-primary"><i className="ri-file-list-3-line me-1 align-middle"></i>Import from document</button>
                        </div>
                      </div>
                      <div className="table-responsive border rounded">
                        <table className="table table-sm no-wrap mb-0" style={{ minWidth: '720px' }}>
                          <thead>
                            <tr className="text-uppercase text-muted" style={{ fontSize: '0.6875rem', letterSpacing: '0.05em' }}>
                              <th className="fw-medium px-3 py-2">#</th>
                              <th className="fw-medium px-3 py-2">Description</th>
                              <th className="fw-medium px-3 py-2">Qty</th>
                              <th className="fw-medium px-3 py-2">Pkgs</th>
                              <th className="fw-medium px-3 py-2">Net kg</th>
                              <th className="fw-medium px-3 py-2">Gross kg</th>
                              <th className="fw-medium px-3 py-2">Value</th>
                              <th className="fw-medium px-3 py-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-3 py-2 align-top text-muted-foreground">1</td>
                              <td className="px-3 py-2 align-top">
                                <p className="fw-medium mb-0" style={{ fontSize: '0.875rem' }}>Cotton bath towels 70x140cm</p>
                                <p className="text-muted-foreground mb-0" style={{ fontSize: '0.75rem' }}>
                                  <span class="tool-pill tool-pill-now me-1">HS 63026000</span>
                                  From packing-list-demo.csv · Demo Shipper
                                </p>
                              </td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>1,200<span className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>PCS</span></td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>40</td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>480</td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>512.5</td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>USD 2,400.00</td>
                              <td className="px-2 py-2 text-end align-top">
                                <div className="d-flex justify-content-end gap-1">
                                  <button type="button" className="btn btn-sm btn-dark" title="Edit"><i className="ri-pencil-line"></i></button>
                                  <button type="button" className="btn btn-sm btn-outline-danger" title="Remove"><i className="ri-delete-bin-line"></i></button>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 align-top text-muted-foreground">2</td>
                              <td className="px-3 py-2 align-top">
                                <p className="fw-medium mb-0" style={{ fontSize: '0.875rem' }}>Microfibre cleaning cloths</p>
                                <p className="text-muted-foreground mb-0" style={{ fontSize: '0.75rem' }}>
                                  <span class="tool-pill tool-pill-now me-1">HS 63026000</span>
                                  From packing-list-demo.csv · Demo Shipper
                                </p>
                              </td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>5,000<span className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>PCS</span></td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>25</td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>210.5</td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>230</td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>USD 1,750.00</td>
                              <td className="px-2 py-2 text-end align-top">
                                <div className="d-flex justify-content-end gap-1">
                                  <button type="button" className="btn btn-sm btn-dark" title="Edit"><i className="ri-pencil-line"></i></button>
                                  <button type="button" className="btn btn-sm btn-outline-danger" title="Remove"><i className="ri-delete-bin-line"></i></button>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 align-top text-muted-foreground">3</td>
                              <td className="px-3 py-2 align-top">
                                <p className="fw-medium mb-0" style={{ fontSize: '0.875rem' }}>Kitchen aprons, printed</p>
                                <p className="text-muted-foreground mb-0" style={{ fontSize: '0.75rem' }}>
                                  <span class="tool-pill tool-pill-now me-1">HS 63026000</span>
                                  From packing-list-demo.csv · Demo Shipper
                                </p>
                              </td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>600<span className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>PCS</span></td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>12</td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>96</td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>104</td>
                              <td className="px-3 py-2 text-end align-top text-muted-foreground" style={{ fontSize: '0.875rem' }}>USD 900.00</td>
                              <td className="px-2 py-2 text-end align-top">
                                <div className="d-flex justify-content-end gap-1">
                                  <button type="button" className="btn btn-sm btn-dark" title="Edit"><i className="ri-pencil-line"></i></button>
                                  <button type="button" className="btn btn-sm btn-outline-danger" title="Remove"><i className="ri-delete-bin-line"></i></button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
                        <p className="text-muted-foreground mb-0" style={{ fontSize: '0.75rem' }}>3 of 500 items.</p>
                        <button type="button" className="btn btn-sm btn-dark">Clear list</button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>
              <Tab eventKey="activity" title="Activity">
                <Card className="mb-0">
                  <Card.Body>
                    <div className="page-title mt-0">
                      <h5 className="mb-0 fw-bold">Activity</h5>
                    </div>
                    <div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper removed "Marker row zzz" from the inventory</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 9:48:26 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper imported 1 inventory item from cv_marker.xlsx</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 9:48:24 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper removed "Marker row zzz" from the inventory</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 9:48:02 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper imported 1 inventory item from cv_marker.xlsx</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 9:48:01 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper removed "Marker row zzz" from the inventory</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 9:47:40 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper imported 1 inventory item from cv_marker.xlsx</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 9:47:38 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper removed "Xlsx test towels" from the inventory</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 9:21:16 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper imported 1 inventory item from cv_test.xlsx</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 9:21:14 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper removed "Cap test row" from the inventory</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 9:20:48 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper imported 1 inventory item from cv_42.csv</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 9:20:45 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper changed saifali33@hotmail.com from comment to edit access</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 9:17:22 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper imported 3 inventory items from packing-list-demo.csv</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 9:14:17 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper imported 2 inventory items from cv_big.csv</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 9:14:07 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper imported 3 inventory items from packing-list-demo.csv</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 8:48:32 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper uploaded packing-list-demo.csv</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 8:48:29 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper deleted cv_pl.csv</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 8:48:27 AM</span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <span className="min-w-0 text-break">Demo Shipper deleted Bossen invoice.pdf</span>
                        <span className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>9/2/2026, 8:48:24 AM</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          )}
        </Modal.Body>
      </Modal>

      {/* Static Collaboration Modal */}
      <Modal 
        show={collaborationShow} 
        onHide={collaborationModalClose}
        scrollable={true}
        size="md"
        aria-labelledby="collaboration-modal-title"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="collaboration-modal-title">
            Share shipment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Invite Form */}
          <form className="mb-4">
            <label className="mb-1 d-block text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              Invite by email. View-only by default; new visitors may be asked for the site access password.
            </label>
            <div className="d-flex flex-column flex-sm-row gap-2">
              <input 
                className="form-control flex-grow-1" 
                placeholder="name@company.com" 
                required 
                type="email" 
                autoComplete="off" 
              />
              <select className="form-select" style={{ width: '160px' }}>
                <option value="VIEWER">Can view</option>
                <option value="COMMENTER">Can comment</option>
                <option value="EDITOR">Can edit</option>
              </select>
              <button type="submit" className="btn btn-primary px-4">
                Invite
              </button>
            </div>
            <p className="mt-2 mb-0 text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              Can view — live tracking, comments & activity (read-only) · Can comment — also posts comments · Can edit — also refreshes tracking and marks the shipment finished
            </p>
          </form>

          {/* People with access */}
          <div className="mb-4">
            <p className="mb-2 fw-semibold" style={{ fontSize: '0.875rem' }}>People with access</p>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex flex-column flex-sm-row gap-2 border p-3 rounded align-items-sm-center justify-content-sm-between">
                <div className="min-w-0">
                  <p className="fw-medium mb-0" style={{ fontSize: '0.875rem' }}>abrar</p>
                  <p className="text-muted-foreground mb-0" style={{ fontSize: '0.75rem' }}>abrarul.hoque.toha@gmail.com · since Aug 16, 2026</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <select className="form-select" style={{ width: '144px' }}>
                    <option value="VIEWER">Can view</option>
                    <option value="COMMENTER">Can comment</option>
                    <option value="EDITOR">Can edit</option>
                  </select>
                  <button type="button" className="btn btn-sm btn-outline-danger">
                    Revoke
                  </button>
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2 border p-3 rounded align-items-sm-center justify-content-sm-between">
                <div className="min-w-0">
                  <p className="fw-medium mb-0" style={{ fontSize: '0.875rem' }}>Saif</p>
                  <p className="text-muted-foreground mb-0" style={{ fontSize: '0.75rem' }}>saifali33@hotmail.com · since Aug 20, 2026</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <select className="form-select" style={{ width: '144px' }}>
                    <option value="VIEWER">Can view</option>
                    <option value="COMMENTER">Can comment</option>
                    <option value="EDITOR">Can edit</option>
                  </select>
                  <button type="button" className="btn btn-sm btn-outline-danger">
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pending invitations */}
          <div>
            <p className="mb-2 fw-semibold" style={{ fontSize: '0.875rem' }}>Pending invitations</p>
            <p className="text-muted-foreground mb-0" style={{ fontSize: '0.875rem' }}>No pending invitations.</p>
          </div>
        </Modal.Body>
      </Modal>

      <ActionsModal
        show={actionModalShow}
        onHide={() => setActionModalShow(false)}
        activeTab={actionTab}
        shipment={actionShipment}
      />
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
          <span className="tool-counter">
            <button
              type="button"
              className="tool-pill tool-pill-aldoc"
            >
              <span>
                <i className="ri-file-pdf-line"></i> All Documents
              </span>
            </button>
          </span>
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