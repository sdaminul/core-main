import { Routes, Route } from 'react-router-dom';
import Layout from '../layout';
import Shipper from '../shipper';
import Index from '../index';
import RequestQuote from '../shipper/requestQuote';
import EC82 from '../shipper/ec82';
import Integrity from '../shipper/integrity';
import DndPage from '../shipper/dnd';
import Login from '../auth/login';
import SignUp from '../auth/signup';
import ForgotPassword from '../auth/forgotPassword';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
      	<Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Shipper />} />
        <Route path="/request-quote" element={<RequestQuote />} />
        <Route path="/dashboard/ec82" element={<EC82 />} />
        <Route path="/dashboard/integrity" element={<Integrity />} />
        <Route path="/dashboard/demdet" element={<DndPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
