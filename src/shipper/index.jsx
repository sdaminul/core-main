import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import BreadcrumbTitle from '../components/layout/Breadcrumb';
import KeyCard from '../components/ui/KeyCards';
import ActionsModal from '../components/ui/ActionsModal';
import { Image, Form, Row, Col, Dropdown } from 'react-bootstrap';
import BgImg from '../assets/images/bg-action.png';
import Shipments from '../components/widgets/Shipments';
import Dnd from '../components/widgets/Dnd';
import Quotes from '../components/widgets/Quotes';

function Shipper() {
  const [modalShow, setModalShow] = useState(false);
  const [activeTab, setActiveTab] = useState('track');
  
  // State to control which component to show
  // Default: 'shipments' is visible
  const [visibleComponent, setVisibleComponent] = useState('shipments'); 
  const [shipmentFilter, setShipmentFilter] = useState('ALL');

  // Create a ref for the component container
  const componentContainerRef = useRef(null);

  const keyData = [
    { id: 1, icon: 'ship-2-line', value: '44', title: 'Ocean Shipments', color: 'purple', action: 'ocean' },
    { id: 2, icon: 'plane-line', value: '22', title: 'Air Shipments', color: 'blue', action: 'air' },
    { id: 3, icon: 'money-dollar-box-line', value: '12', title: 'Quotes', color: 'acent', action: 'quotes' },
    { id: 4, icon: 'shield-check-line', value: '05', title: 'Delivered (30D)', color: 'green', action: 'delivered' },
    { id: 5, icon: 'alarm-warning-line', value: '75', title: 'D&D At Risk', color: 'warning', action: 'dnd' },
    { id: 6, icon: 'alert-line', value: '35', title: 'Pending Actions', color: 'red', action: 'pending' },
  ];

  const handleKeyCardClick = (action) => {
    switch(action) {
      case 'ocean':
        setVisibleComponent('shipments');
        setShipmentFilter('OCEAN');
        break;
      case 'air':
        setVisibleComponent('shipments');
        setShipmentFilter('AIR');
        break;
      case 'pending':
        setVisibleComponent('shipments');
        setShipmentFilter('PENDING');
        break;
      case 'delivered':
        setVisibleComponent('shipments');
        setShipmentFilter('DELIVERED');
        break;
      case 'dnd':
        setVisibleComponent('dnd');
        break;
      case 'quotes':
        setVisibleComponent('quotes');
        break;
      default:
        setVisibleComponent('shipments');
    }

    // Scroll to the component container after state update
    // setTimeout ensures the DOM has updated before scrolling
    setTimeout(() => {
      if (componentContainerRef.current) {
        componentContainerRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  // Determine which components to show
  const showShipments = visibleComponent === 'shipments';
  const showDnd = visibleComponent === 'dnd';
  const showQuotes = visibleComponent === 'quotes';

  const handleActionClick = (tabKey) => {
    setActiveTab(tabKey);
    setModalShow(true);
  };

  return (
    <>
      <div className="container">
        <BreadcrumbTitle pageTitle="Dashboard" currentPage="Dashboard" />

        <Row className="cus-key-card">
          {keyData.map((item) => (
            <Col lg={2} md={4} xs={4} key={item.id}>
              <div onClick={() => handleKeyCardClick(item.action)} style={{ cursor: 'pointer' }}>
                <KeyCard 
                  icon={item.icon}
                  value={item.value}
                  title={item.title}
                  color={item.color}
                />
              </div>
            </Col>
          ))}
        </Row>

        <ActionsModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          activeTab={activeTab}
        />

        {/* This div will scroll into view when a KeyCard is clicked */}
        <div ref={componentContainerRef}>
          <div className="d-flex mb-2 mb-lg-4 pb-1 pb-lg-0">
            <div className="search-content flex-grow-1">
              <Form.Control type="text" placeholder="Search bids — route, vendor, amount, status…" />
              <i className="ri-search-line"></i>
            </div>
            <Dropdown drop="end">
              <Dropdown.Toggle variant="primary" id="dropdown-basic" className="actdrop-btn">
                <i className="ri-function-line me-1"></i> <span className="oebsw">Tools <i className="ri-arrow-down-s-line"></i></span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="action-drops">
                <Dropdown.Item className="acd-item" onClick={() => handleActionClick('track')}><span className="acd-lft"><i className="ri-map-pin-line"></i> <span>Track</span></span><span className="acd-lst text-secondary">Track Shipments</span></Dropdown.Item>
                <Dropdown.Item className="acd-item" onClick={() => handleActionClick('request')}><span className="acd-lft"><i className="ri-store-line"></i> <span>Request</span></span><span className="acd-lst text-secondary">New Request</span></Dropdown.Item>
                <Dropdown.Item className="acd-item" onClick={() => handleActionClick('protect')}><span className="acd-lft"><i className="ri-shield-line"></i> <span>Protect</span></span><span className="acd-lst text-secondary">Cargo Protect</span></Dropdown.Item>
                <Dropdown.Item className="acd-item" onClick={() => handleActionClick('manage')}><span className="acd-lft"><i className="ri-box-3-line"></i> <span>Manage</span></span><span className="acd-lst text-secondary">Manage Shipment</span></Dropdown.Item>
                <Dropdown.Item className="acd-item" as={Link} to="/dashboard/integrity"><span className="acd-lft"><i className="ri-file-search-line"></i> <span>Verify</span></span><span className="acd-lst text-secondary">Document Integrity</span></Dropdown.Item>
                <Dropdown.Item className="acd-item" as={Link} to="/dashboard/ec82"><span className="acd-lft"><i className="ri-file-text-line"></i> <span>eC82</span></span><span className="acd-lst text-secondary">Declaration Builder</span></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {showShipments && <Shipments initialFilter={shipmentFilter} />}
          
          {showDnd && <Dnd />}
          
          {showQuotes && <Quotes />}
        </div>
      </div>
    </>
  );
}

export default Shipper;