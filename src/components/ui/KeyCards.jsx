import { Card } from 'react-bootstrap';

function KeyCard({ icon, value, title, color = "acent" }) {
  return (
    <Card className={`key-card card-${color}`}>
      <Card.Body>
        <div className={`icofont box-${color}`}>
          <i className={`ri-${icon} icon-${color}`}></i>
        </div>
        <div className="card-text">
          <h3 className="mb-1 fw-bold">{value}</h3>
          <p className="mb-0 text-muted-foreground">{title}</p>
        </div>
      </Card.Body>
    </Card>
  );
}

export default KeyCard;