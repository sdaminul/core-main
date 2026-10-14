import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Header from './components/layout/Header';

function Layout() {
  const barRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      // Total scrollable distance
      const scrollable =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      // Avoid divide-by-zero on short pages
      const percent = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
      const clamped = Math.min(100, Math.max(0, percent));
      bar.style.width = clamped + '%';
      bar.setAttribute('aria-valuenow', Math.round(clamped));
    };

    // Throttle with requestAnimationFrame for smooth 60fps updates
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
    };

    // Set initial state (important if the page loads already scrolled)
    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateProgress);
    };
  }, [pathname]);

  return (
    <>
      <div className="scroll-progress-container">
        <div
          ref={barRef}
          className="scroll-progress-bar"
          role="progressbar"
          aria-label="Page scroll progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="0"
        />
      </div>
      <Header />

      <main>
        <Outlet />
      </main>

    </>
  );
}

export default Layout;