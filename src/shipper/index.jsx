import { useState, useRef } from 'react';
import BreadcrumbTitle from '../components/layout/Breadcrumb';
import KeyCard from '../components/ui/KeyCards';
import ActionsModal from '../components/ui/ActionsModal';
import { Image, Form, Row, Col } from 'react-bootstrap';
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

        <Row>
          {keyData.map((item) => (
            <Col lg={2} md={4} xs={6} key={item.id}>
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

        <div className="card">
          <div className="card-body pb-0">
            <div className="card-title">Quick Actions</div>
            <p className="text-muted-foreground">Start the next operational action directly from this panel.</p>

            <Row className="gap-8">
              <Col lg={2} md={4} xs={4}>
                <div className="card action-card" onClick={() => handleActionClick('track')}>
                  <div className="card-body py-3">
                    <div className="d-flex align-items-center">
                      <div className="action-font">
                        <i className="ri-map-pin-line"></i>
                      </div>
                      <div className="action-desc ms-2">
                        <div className="">Track</div>
                        <p className="mb-0 text-muted-foreground">Track Shipments</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={2} md={4} xs={4}>
                <div className="card action-card" onClick={() => handleActionClick('demdet')}>
                  <div className="card-body py-3">
                    <div className="d-flex align-items-center">
                      <div className="action-font">
                        <i className="ri-calendar-line"></i>
                      </div>
                      <div className="action-desc ms-2">
                        <div className="">DemDet</div>
                        <p className="mb-0 text-muted-foreground">Manage DemDet</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={2} md={4} xs={4}>
                <div className="card action-card" onClick={() => handleActionClick('request')}>
                  <div className="card-body py-3">
                    <div className="d-flex align-items-center">
                      <div className="action-font">
                        <i className="ri-store-line"></i>
                      </div>
                      <div className="action-desc ms-2">
                        <div className="">Request</div>
                        <p className="mb-0 text-muted-foreground">New Request</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={2} md={4} xs={4}>
                <div className="card action-card" onClick={() => handleActionClick('protect')}>
                  <div className="card-body py-3">
                    <div className="d-flex align-items-center">
                      <div className="action-font">
                        <i className="ri-shield-line"></i>
                      </div>
                      <div className="action-desc ms-2">
                        <div className="">Protect</div>
                        <p className="mb-0 text-muted-foreground">Cargo Protect</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={2} md={4} xs={4}>
                <div className="card action-card" onClick={() => handleActionClick('manage')}>
                  <div className="card-body py-3">
                    <div className="d-flex align-items-center">
                      <div className="action-font">
                        <i className="ri-box-3-line"></i>
                      </div>
                      <div className="action-desc ms-2">
                        <div className="">Manage</div>
                        <p className="mb-0 text-muted-foreground">Manage Shipment</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <Image src={BgImg} alt="bg" className="bg-action" />
        </div>

        <ActionsModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          activeTab={activeTab}
        />

        {/* This div will scroll into view when a KeyCard is clicked */}
        <div ref={componentContainerRef}>
          <div className="search-content mb-4">
            <Form.Control type="text" placeholder="Search bids — route, vendor, amount, status…" />
            <i className="ri-search-line"></i>
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