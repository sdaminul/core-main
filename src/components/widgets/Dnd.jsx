import { Card, Row, Col, Form, Button, Table, Badge } from "react-bootstrap";

function Dnd() {
  const records = [
    ["PO-2024-001", "Shanghai, CN → Los Angeles, US", "2033-02-04"],
    ["PO-2024-002", "Shenzhen, CN → Long Beach, US", "-"],
    ["PO-2024-003", "Busan, KR → Seattle, US", "-"],
    ["PO-2024-004", "Singapore, SG → Oakland, US", "-"],
  ];

  return (
    <>
    	<Card>
    		<Card.Body>
		    	<div className="page-title mt-0">
				  	<h5 className="mb-0 fw-bold">Demurrage & Detention</h5>
			    </div>
		      <Row className="cus-key-card">
            <Col md={2} xs={4}>
            	<div className="cus-key-card card border-left-4 border-success p-2 p-md-3 mb-2 mb-md-3 bg-success bg-opacity-10"><small className="text-muted-foreground">Safe</small><h4 className="text-success mb-0 fw-bold">4</h4></div>
            </Col>
            <Col md={2} xs={4}>
            	<div className="cus-key-card card border-left-4 border-warning p-2 p-md-3 mb-2 mb-md-3 bg-warning bg-opacity-10"><small className="text-muted-foreground">At Risk</small><h4 className="text-warning mb-0 fw-bold">0</h4></div>
        	</Col>
            <Col md={2} xs={4}>
            	<div className="cus-key-card card border-left-4 border-danger p-2 p-md-3 mb-2 mb-md-3 bg-danger bg-opacity-10"><small className="text-muted-foreground">Demurrage</small><h4 className="text-danger mb-0 fw-bold">0</h4></div>
            </Col>
            <Col md={2} xs={4}>
            	<div className="cus-key-card card border-left-4 border-danger p-2 p-md-3 mb-2 mb-md-3 bg-danger bg-opacity-10"><small className="text-muted-foreground">Detention</small><h4 className="text-danger mb-0 fw-bold">0</h4></div>
            </Col>
            <Col md={2} xs={4}>
            	<div className="cus-key-card card border-left-4 border-info p-2 p-md-3 mb-2 mb-md-3 bg-info bg-opacity-10"><small className="text-muted-foreground">Returned</small><h4 className="text-info mb-0 fw-bold">0</h4></div>
            </Col>
            <Col md={2} xs={4}>
            	<div className="cus-key-card card border-left-4 border-primary p-2 p-md-3 mb-2 mb-md-3 bg-primary bg-opacity-10"><small className="text-muted-foreground">Total Exposure</small><h4 className="text-primary mb-0 fw-bold">$ 0.00</h4></div>
            </Col>
          </Row>

          <hr className="mt-0 mb-4"/>

          <h6 className="mb-3 fw-bold">Create / Update D&amp;D Record</h6>
          <Row className="g-3">
            <Col md={4}>
              <Form.Label className="text-muted-foreground">Shipment <span className="text-danger">*</span></Form.Label>
              <Form.Select className="py-2"><option>Select shipment</option></Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label className="text-muted-foreground">Terminal</Form.Label>
              <Form.Control className="py-2" placeholder="e.g. APM Terminals" />
            </Col>
            <Col md={4}>
              <Form.Label className="text-muted-foreground">Container Size</Form.Label>
              <Form.Control className="py-2" placeholder="e.g. 40' HC" />
            </Col>
          </Row>

          <h6 className="mt-4 pt-1 mb-2">Key Dates</h6>
          <Row className="g-3">
            <Col md={3}><Form.Label className="text-muted-foreground">Discharge Date</Form.Label><Form.Control type="date" /></Col>
            <Col md={3}><Form.Label className="text-muted-foreground">Release Date</Form.Label><Form.Control type="date" /></Col>
            <Col md={3}><Form.Label className="text-muted-foreground">Gate Out Date</Form.Label><Form.Control type="date" /></Col>
            <Col md={3}><Form.Label className="text-muted-foreground">Empty Returned</Form.Label><Form.Control type="date" /></Col>
          </Row>

          <Row className="g-4 mt-1">
            <Col md={6}>
            	<h6 className="mb-2">Demurrage</h6>
            	<Row className="g-3">
            		<Col md={6}>
		              <Form.Label className="text-muted-foreground">Free Days</Form.Label>
		              <Form.Control defaultValue="4" />
		            </Col>
		            <Col md={6}>
		              <Form.Label className="text-muted-foreground">Daily Rate (USD)</Form.Label>
		              <Form.Control defaultValue="150" />
		            </Col>
	            </Row>
            </Col>

            <Col md={6}>
            	<h6 className="mb-2">Detention</h6>
            	<Row className="g-3">
            		<Col md={6}>
		              <Form.Label className="text-muted-foreground">Free Days</Form.Label>
              		<Form.Control defaultValue="5" />
		            </Col>
		            <Col md={6}>
		              <Form.Label className="text-muted-foreground">Daily Rate (USD)</Form.Label>
              		<Form.Control defaultValue="125" />
		            </Col>
	            </Row>
            </Col>
          </Row>

          <div className="mt-4 d-flex gap-2">
            <Button className="px-4">Save Record</Button>
            <Button variant="dark" className="px-4">Reset</Button>
            <Button variant="dark" className="px-4">Refresh</Button>
          </div>

          <hr className="mt-4 mb-4"/>

          <h6 className="mb-3 fw-bold">D&amp;D Records</h6>

          <Table responsive bordered className="mb-0 ship-contanier tool-map-table table no-wrap">
            <thead>
              <tr>
                <th>Shipment</th>
                <th>Status</th>
                <th>Demurrage</th>
                <th>Detention</th>
                <th>Total</th>
                <th>Last Free Day</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row) => (
                <tr key={row[0]}>
                  <td>
                    <strong>{row[0]}</strong><br />
                    <small className="text-muted-foreground">{row[1]}</small>
                  </td>
                  <td><Badge bg="success">SAFE</Badge></td>
                  <td>0 day(s) - USD 0.00</td>
                  <td>0 day(s) - USD 0.00</td>
                  <td>USD 0.00</td>
                  <td>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
	     	</Card.Body>
		  </Card>
    </>
  );
}

export default Dnd;
