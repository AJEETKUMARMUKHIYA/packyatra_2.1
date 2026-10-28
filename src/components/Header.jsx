import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent } from "@mui/material";
import { 
  Phone, 
  Mail, 
  LogIn, 
  Truck, 
  MessageSquare, 
  ChevronDown, 
  Building2, 
  Home as HomeIcon, 
  Car, 
  Warehouse, 
  Calculator, 
  ClipboardList, 
  Star, 
  HelpCircle, 
  ArrowRight, 
  X,
  Menu,
  Clock,
  Sparkles,
  PawPrint
} from "lucide-react";
import TrackShipment from "../pages/TrackShipment.jsx";
import OtpLogin from "../components/OtpLogin.jsx";
import UserDropdown from "./UserDropdown.jsx";
import PackYatraLogo from "./PackYatraLogo.jsx";
import { getUserInfo, isOtpValid, clearLoginData } from "../utils/auth";
import "../styles/Header.css";

const Header = ({ onLoginStatusChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  /* ======================
     SCROLL EFFECT
  ====================== */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ======================
     AUTO CLOSE ON ROUTE CHANGE
  ====================== */
  const closeMenu = (e) => {
    if (e) {
      if (typeof e.preventDefault === "function") e.preventDefault();
      if (typeof e.stopPropagation === "function") e.stopPropagation();
    }
    setMenuOpen(false);
    setMobileServicesOpen(false);
    const nav = document.querySelector(".nav-container");
    if (nav) nav.classList.remove("active");
    const overlay = document.querySelector(".menu-overlay");
    if (overlay) overlay.classList.remove("active");
    const btn = document.querySelector(".mobile-menu-btn");
    if (btn) btn.classList.remove("open", "active");
    document.body.style.overflow = "auto";
  };

  const toggleMenu = (e) => {
    if (e) {
      if (typeof e.preventDefault === "function") e.preventDefault();
      if (typeof e.stopPropagation === "function") e.stopPropagation();
    }
    if (menuOpen) {
      closeMenu();
    } else {
      setMenuOpen(true);
    }
  };

  useEffect(() => {
    closeMenu();
    document.body.style.overflow = "auto";
  }, [location.pathname]);

  /* ======================
     BODY SCROLL LOCK FOR MOBILE MENU
  ====================== */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  /* ======================
     ESC KEY CLOSE
  ====================== */
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  /* ======================
     CLICK OUTSIDE SERVICES DROPDOWN
  ====================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ======================
     DESKTOP RESIZE FIX
  ====================== */
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ======================
     LOAD USER
  ====================== */
  useEffect(() => {
    const loadUser = () => {
      const userInfo = getUserInfo();
      if (userInfo) {
        setUser(userInfo);
        onLoginStatusChange?.(true);
      } else {
        setUser(null);
        onLoginStatusChange?.(false);
      }
    };

    loadUser();
    window.addEventListener("user-login", loadUser);
    window.addEventListener("user-logout", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("user-login", loadUser);
      window.removeEventListener("user-logout", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, [onLoginStatusChange]);

  /* ======================
     HANDLERS
  ====================== */
  const openLogin = () => {
    setMenuOpen(false);
    if (isOtpValid()) {
      const userInfo = getUserInfo();
      if (userInfo && !user) {
        setUser(userInfo);
        onLoginStatusChange?.(true);
      }
      return;
    }
    setIsLoginModalOpen(true);
  };

  const openTrackShipment = () => {
    setMenuOpen(false);
    setIsTrackModalOpen(true);
  };

  const handleLogoutFromDropdown = () => {
    setUser(null);
    onLoginStatusChange?.(false);
  };

  const scrollToSection = (sectionId) => {
    setMenuOpen(false);
    setServicesDropdownOpen(false);
    
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 180);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleQuoteClick = () => {
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/#home");
      setTimeout(() => {
        const formEl = document.querySelector(".fixed-form") || document.getElementById("home");
        if (formEl) {
          formEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 180);
    } else {
      const formEl = document.querySelector(".fixed-form") || document.getElementById("home");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const servicesList = [
    {
      id: "commercial",
      title: "Corporate Office Relocation",
      desc: "Zero-downtime workstation de-racking, server moving, and full IT relocation.",
      tag: "Enterprise SLA",
      icon: Building2,
      color: "#2563eb"
    },
    {
      id: "shifting",
      title: "Executive Household Shifting",
      desc: "White-glove multi-layer packing, modular furniture assembly, and art care.",
      tag: "White-Glove",
      icon: HomeIcon,
      color: "#0284c7"
    },
    {
      id: "pet-relocation",
      title: "Safe Pet Relocation",
      desc: "Veterinary-assisted, climate-controlled, stress-free domestic pet transit.",
      tag: "Vet-Certified",
      icon: PawPrint,
      color: "#ea580c"
    },
    {
      id: "vehicles",
      title: "Executive Vehicle Transport",
      desc: "Hydraulic enclosed car carriers and scratch-proof multi-tier bike transport.",
      tag: "Hydraulic Fleet",
      icon: Car,
      color: "#0d9488"
    },
    {
      id: "storage",
      title: "Commercial Warehousing",
      desc: "Climate-controlled 24/7 CCTV surveillance storage vaults & digital inventory.",
      tag: "24/7 Monitored",
      icon: Warehouse,
      color: "#4f46e5"
    },
    {
      id: "intracity",
      title: "Same-Day Intra-City Transit",
      desc: "Dedicated container trucks for fast-track metropolitan house and item shifting.",
      tag: "Same-Day",
      icon: Truck,
      color: "#059669"
    }
  ];

  return (
    <header className="site-header">
      {/* ========================================================
          ZONE 1: TOP CORPORATE ANNOUNCEMENT & CONTACT BAR
         ======================================================== */}
      <div className="top-bar">
        <div className="top-bar-container">
          {/* Left: Contact Info */}
          <div className="contact-top">
            <span className="contact-item">
              <Phone size={12} className="contact-icon" />
              <a href="tel:+919071535535" title="Click to call PackYatra 24/7 Hotline">+91 90715 35535</a>
            </span>
            <span className="contact-divider">/</span>
            <span className="contact-item">
              <Mail size={12} className="contact-icon" />
              <a href="mailto:info@packyatra.com" title="Email PackYatra team">info@packyatra.com</a>
            </span>
          </div>

          {/* Right: Operational Status & User Dropdown */}
          <div className="top-bar-right">
            <div className="hotline-badge">
              <Clock size={11} className="clock-icon" />
              <span>24/7 Dispatch Desk</span>
            </div>
            <a 
              href="https://wa.me/9071535535" 
              target="_blank" 
              rel="noreferrer" 
              className="topbar-wa-link"
              title="Message PackYatra on WhatsApp"
            >
              <MessageSquare size={11} />
              <span>WhatsApp</span>
            </a>
            <UserDropdown onLogout={handleLogoutFromDropdown} />
          </div>
        </div>
      </div>

      {/* ========================================================
          ZONE 2: MAIN FLOATING / GLASS HEADER (ATTRACTIVE HOME MENU)
         ======================================================== */}
      <div className={`header ${scrolled ? "header-scrolled" : ""}`}>
        <div className="header-container">
          
          {/* LOGO */}
          <div 
            className="logo-container" 
            onClick={() => navigate("/")} 
            title="PackYatra Relocation"
          >
            <PackYatraLogo height={44} />
          </div>

          {/* DESKTOP NAVIGATION MENU */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            {/* Home Link */}
            <NavLink 
              to="/" 
              end 
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <span>Home</span>
            </NavLink>

            {/* Services Dropdown */}
            <div 
              className="nav-item-dropdown" 
              ref={dropdownRef}
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button 
                type="button"
                className={`nav-link dropdown-trigger ${servicesDropdownOpen ? "open" : ""}`}
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                aria-expanded={servicesDropdownOpen}
              >
                <span>Services</span>
                <ChevronDown size={14} className={`dropdown-chevron ${servicesDropdownOpen ? "rotate" : ""}`} />
              </button>

              {/* Mega Dropdown Panel */}
              {servicesDropdownOpen && (
                <div className="services-mega-menu">
                  <div className="mega-menu-header">
                    <div className="mega-title">Our Relocation Services</div>
                    <span className="mega-sub">Safe · On-Time · Insured Pan-India Shifting</span>
                  </div>

                  <div className="mega-grid">
                    {servicesList.map((srv) => {
                      const Icon = srv.icon;
                      return (
                        <div 
                          key={srv.id} 
                          className="mega-card"
                          onClick={() => scrollToSection("services")}
                        >
                          <div className="mega-icon-box" style={{ color: srv.color, background: `${srv.color}14` }}>
                            <Icon size={18} />
                          </div>
                          <div className="mega-card-content">
                            <div className="mega-card-title-row">
                              <span className="mega-card-title">{srv.title}</span>
                              <span className="mega-tag">{srv.tag}</span>
                            </div>
                            <p className="mega-card-desc">{srv.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mega-menu-footer">
                    <div className="mega-footer-text">
                      <strong>Need tailored corporate moving?</strong> Speak to our relocation specialists.
                    </div>
                    <button 
                      className="mega-cta-btn"
                      onClick={() => scrollToSection("services")}
                    >
                      <span>Explore All Solutions</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cost Estimator */}
            <button 
              type="button"
              className="nav-link nav-btn-link"
              onClick={() => scrollToSection("estimator")}
              title="Instant Moving Cost Calculator"
            >
              <Calculator size={14} className="nav-icon-subtle" />
              <span>Cost Estimator</span>
            </button>

            {/* Moving Planner */}
            <button 
              type="button"
              className="nav-link nav-btn-link"
              onClick={() => scrollToSection("planner")}
              title="Interactive 4-Week Moving Checklist"
            >
              <ClipboardList size={14} className="nav-icon-subtle" />
              <span>Moving Checklist</span>
            </button>

            {/* FAQ */}
            <NavLink 
              to="/faq" 
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              title="Frequently Asked Questions & Moving Guide"
            >
              <HelpCircle size={14} className="nav-icon-subtle" />
              <span>FAQ</span>
            </NavLink>

            {/* About */}
            <NavLink 
              to="/about" 
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <span>About</span>
            </NavLink>

            {/* Contact */}
            <NavLink 
              to="/contact" 
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <span>Contact</span>
            </NavLink>
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="header-actions">
            {/* Track Shipment Pill Button */}
            <button 
              className="header-track-btn" 
              onClick={openTrackShipment} 
              title="Track your active consignment status"
            >
              <Truck size={14} />
              <span>Track Move</span>
            </button>

            {/* Primary Instant Quote CTA */}
            <button 
              className="header-quote-btn"
              onClick={handleQuoteClick}
              title="Get instant transparent moving quote"
            >
              <Sparkles size={13} className="sparkle-icon" />
              <span>Get Free Quote</span>
            </button>

            {/* Login / Profile State */}
            {!user ? (
              <button className="header-login-btn" onClick={openLogin} title="User Account Login">
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
            ) : null}
          </div>

          {/* HAMBURGER BUTTON (MOBILE) */}
          <button
            type="button"
            className={`mobile-menu-btn ${menuOpen ? "open active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* OVERLAY FOR MOBILE DRAWER */}
        {menuOpen && (
          <div 
            className="menu-overlay" 
            onClick={closeMenu} 
            onTouchEnd={closeMenu}
            role="button"
            aria-label="Close menu"
            tabIndex={0}
          />
        )}

        {/* MOBILE NAVIGATION DRAWER */}
        <nav className={`nav-container ${menuOpen ? "active" : ""}`} aria-label="Mobile Navigation">
          <div className="mobile-menu-header">
            <div 
              className="logo-container" 
              onClick={() => { closeMenu(); navigate("/"); }} 
              style={{ cursor: "pointer" }}
            >
              <PackYatraLogo height={38} />
            </div>
            <button 
              type="button"
              className="mobile-close-btn" 
              onClick={closeMenu}
              onTouchEnd={closeMenu}
              aria-label="Close menu"
              title="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Quick Action Strip */}
          <div className="mobile-quick-strip">
            <a href="tel:+919071535535" className="quick-action-pill call" onClick={closeMenu}>
              <Phone size={13} />
              <span>Call Hotline</span>
            </a>
            <a 
              href="https://wa.me/9071535535" 
              target="_blank" 
              rel="noreferrer" 
              className="quick-action-pill whatsapp"
              onClick={closeMenu}
            >
              <MessageSquare size={13} />
              <span>WhatsApp</span>
            </a>
            <button onClick={() => { closeMenu(); openTrackShipment(); }} className="quick-action-pill track" type="button">
              <Truck size={13} />
              <span>Track</span>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="mobile-nav-scroll">
            <ul className="mobile-nav-links">
              <li>
                <NavLink 
                  to="/" 
                  end
                  onClick={closeMenu} 
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <HomeIcon size={16} />
                  <span>Home</span>
                </NavLink>
              </li>

              {/* Expandable Services Accordion */}
              <li className="mobile-accordion-item">
                <button 
                  type="button"
                  className="mobile-accordion-toggle"
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                >
                  <div className="accordion-label">
                    <Building2 size={16} />
                    <span>Relocation Services</span>
                  </div>
                  <ChevronDown size={15} className={`chevron ${mobileServicesOpen ? "rotate" : ""}`} />
                </button>

                {mobileServicesOpen && (
                  <div className="mobile-services-list">
                    {servicesList.map((srv) => {
                      const Icon = srv.icon;
                      return (
                        <div 
                          key={srv.id}
                          className="mobile-service-subitem"
                          onClick={() => { closeMenu(); scrollToSection("services"); }}
                        >
                          <div className="subitem-icon" style={{ color: srv.color }}>
                            <Icon size={14} />
                          </div>
                          <div className="subitem-info">
                            <span className="subitem-title">{srv.title}</span>
                            <span className="subitem-tag">{srv.tag}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </li>

              <li>
                <button 
                  type="button" 
                  className="mobile-link-btn"
                  onClick={() => { closeMenu(); scrollToSection("estimator"); }}
                >
                  <Calculator size={16} />
                  <span>Instant Cost Estimator</span>
                </button>
              </li>

              <li>
                <button 
                  type="button" 
                  className="mobile-link-btn"
                  onClick={() => { closeMenu(); scrollToSection("planner"); }}
                >
                  <ClipboardList size={16} />
                  <span>Moving Checklist Planner</span>
                </button>
              </li>

              <li>
                <NavLink 
                  to="/faq" 
                  onClick={closeMenu} 
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <HelpCircle size={16} />
                  <span>Frequently Asked Questions</span>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to="/about" 
                  onClick={closeMenu} 
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <Building2 size={16} />
                  <span>About Us</span>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to="/contact" 
                  onClick={closeMenu} 
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <Phone size={16} />
                  <span>Contact Support</span>
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Bottom Actions */}
          <div className="mobile-actions">
            <button type="button" className="mobile-quote-btn" onClick={() => { closeMenu(); handleQuoteClick(); }}>
              <Sparkles size={15} />
              <span>Get Free Instant Quote</span>
            </button>

            {!user ? (
              <button type="button" className="mobile-login-btn" onClick={() => { closeMenu(); openLogin(); }}>
                <LogIn size={15} />
                <span>Login / Register</span>
              </button>
            ) : null}
          </div>
        </nav>
      </div>

      {/* LOGIN MODAL */}
      <Dialog
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <OtpLogin 
            onSuccess={() => {
              setIsLoginModalOpen(false);
            }}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* TRACK SHIPMENT MODAL */}
      <Dialog
        open={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <TrackShipment onClose={() => setIsTrackModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;