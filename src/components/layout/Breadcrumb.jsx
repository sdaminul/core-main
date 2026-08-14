import { Breadcrumb } from 'react-bootstrap';

function BreadcrumbTitle({ pageTitle = "Dashboard", currentPage = "Dashboard" }) {
  return (
    <div className="page-title">
      <h3>{currentPage}</h3>
      <Breadcrumb>
        <Breadcrumb.Item href="/">{pageTitle}</Breadcrumb.Item>
        <Breadcrumb.Item active>{currentPage}</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
}

export default BreadcrumbTitle;
