import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { AnimatePresence } from 'framer-motion';

const Layout: React.FC = () => {
  const location = useLocation();

  // Scroll to top on route change (client-side only)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Client-only flag to avoid hydration mismatch
  // CRITICAL: Server and client must render IDENTICAL structure initially
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // Only enable animations after hydration is complete
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100); // Small delay to ensure hydration completes
    return () => clearTimeout(timer);
  }, []);

  // CRITICAL: Always render the EXACT same structure on server and client
  // Both render: <div key={path}><div><Outlet /></div></div>
  // The structure must be identical - no conditional wrappers that change DOM
  return (
    <div className="min-h-screen flex flex-col font-sans text-cream-900 bg-cream-50">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* CRITICAL: Always render same structure - server and client must match exactly */}
        {/* This structure is identical on both server and client */}
        <div key={location.pathname}>
          <div>
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
