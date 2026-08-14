import { Routes, Route } from 'react-router-dom';
import Layout from '../layout';
import Shipper from '../shipper';
import Index from '../index';
import RequestQuote from '../shipper/requestQuote';
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
