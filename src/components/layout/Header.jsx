import Container from 'react-bootstrap/Container';
import { Navbar, Nav, Image, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../../assets/images/logo.png';
import logoBlack from '../../assets/images/logo-black.png';
import userImg from '../../assets/images/user.png';

function Header() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('cv-theme') !== 'light';
    } catch {
      // storage unavailable, keep dark default
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', !isDark);
    try {
      localStorage.setItem('cv-theme', isDark ? 'dark' : 'light');
    } catch {
      // storage unavailable
    }
  }, [isDark]);

  return (
    <Navbar>
      <Container>
        <div className="d-flex align-items-center justify-content-between w-100">
          <Link to="/" className="band-logo">
            <Image src={logo} alt="Logo" className="logo" />
            <Image src={logoBlack} alt="Logo" className="logo logo-black" />
          </Link>
          <Nav className="ms-auto d-flex align-items-center">
            <div className="nav-link d-flex align-items-center">
              <button className="btn-bell btn btn-dark mode-toggle-btn" onClick={() => setIsDark(!isDark)} title="Toggle dark / light mode">
                <i className={isDark ? "ri-sun-line" : "ri-moon-line"}></i>
              </button>
              <div className="nav-link-divi"></div>
              <Dropdown data-bs-theme="dark" className="noti-drop">
                <Dropdown.Toggle as="span" className="btn-bell btn btn-dark dropdown-toggle-no-caret">
                  <i className="ri-notification-3-line"></i> <span>3</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end">
                  <div className="all-noti">
                    <div className="noti-item">
                      <div className="noti-title">
                        <div className="noti-name"><i className="ri-hourglass-2-fill"></i><span>Action Pending</span></div>
                        <div className="noti-for">CGVS2026001</div>
                      </div>
                      <div className="noti-desc">There are <span class="text-primary fw-bold">3</span> actions pending. Please check and complete them.</div>
                      <button className="btn btn-primary btn-sm me-2 px-3">Check now</button>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>

              <div className="nav-link-divi"></div>

              <Dropdown data-bs-theme="dark">
                <Dropdown.Toggle as="span" className="dropdown-toggle-no-caret user-drop">
                  <div className="user-info">
                    <div className="d-flex align-items-center">
                      <Image src={userImg} alt="User" className="user-img" />
                      <div className="user-desc">
                        <h5 className="mb-0">Demo Shipper</h5>
                        <p className="mb-0">shipper@demo.com</p>
                      </div>
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="user-menus dropdown-menu-end">
                  <Dropdown.Item disabled className="pb-3">
                    <div className="user-info">
                      <div className="d-flex align-items-center">
                        <Image src={userImg} alt="User" className="user-img" />
                        <div className="user-desc">
                          <h5 className="mb-0 text-white">Demo Shipper</h5>
                          <p className="mb-0">shipper</p>
                        </div>
                      </div>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item href="/dashboard"><i className="ri-user-3-line"></i> Dashboard</Dropdown.Item>
                  <Dropdown.Item href="/pricng"><i className="ri-money-dollar-circle-line"></i> Pricing</Dropdown.Item>
                  <Dropdown.Item href="/" className="text-danger"><i className="ri-logout-box-r-line"></i> Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;