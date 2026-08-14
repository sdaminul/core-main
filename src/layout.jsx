import { Outlet } from 'react-router-dom';

import Header from './components/layout/Header';

function Layout() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

    </>
  );
}

export default Layout;