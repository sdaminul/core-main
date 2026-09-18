import { Link } from "react-router-dom";
import BreadcrumbTitle from "../components/layout/Breadcrumb";
import Dnd from "../components/widgets/Dnd";

function DndPage() {
  return (
    <div className="container">
      <BreadcrumbTitle pageTitle="Dashboard" currentPage="Demurrage & Detention" />

      <Dnd />
      
    </div>
  );
}

export default DndPage;
