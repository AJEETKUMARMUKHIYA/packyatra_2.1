import React from "react";
import {
  BadgePercent,
  CheckCircle2,
  CalendarSync,
  Wrench,
  PackageCheck,
  MapPin,
  Headset,
  FilePenLine,
  Puzzle,
  ArrowUpToLine,
  RotateCcw,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import "../styles/WhyChoosePackYatra.css";

const WhyChoosePackYatra = () => {
  const scrollToQuote = () => {
    const el = document.querySelector(".fixed-form") || document.getElementById("home");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section id="why-choose-packyatra" className="why-choose-section" aria-label="Why Choose PackYatra">
      <div className="why-choose-container">
        
        {/* Section Header */}
        <div className="why-choose-header">
          <div className="why-choose-badge">
            <span className="why-choose-badge-dot" />
            <span>The PackYatra Assurance</span>
          </div>
          <h2 className="why-choose-title">
            Built for Stress-Free, Reliable Relocation
          </h2>
          <p className="why-choose-subtitle">
            Every household, apartment, and enterprise shifting is backed by transparent pricing, bonded crews, and customer-first flexibility.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="why-choose-grid">

          {/* 1. Economical prices */}
          <div className="why-card why-col-economical">
            <div className="why-icon-box" style={{ background: "#ecfdf5", color: "#059669" }}>
              <BadgePercent size={24} strokeWidth={2.2} />
            </div>
            <h3 className="why-card-title">Economical prices</h3>
            <p className="why-card-desc">
              Transparent upfront pricing with zero hidden surcharges or surprise fees.
            </p>
            <span className="why-pill-tag" style={{ background: "#ecfdf5", color: "#059669" }}>
              Best Rates
            </span>
          </div>

          {/* 2. On time shifting */}
          <div className="why-card why-col-ontime">
            <div className="why-icon-box" style={{ background: "#f0fdf4", color: "#16a34a" }}>
              <CheckCircle2 size={24} strokeWidth={2.2} />
            </div>
            <h3 className="why-card-title">On time shifting</h3>
            <p className="why-card-desc">
              Punctual arrival windows and GPS-monitored routes for on-schedule delivery.
            </p>
            <span className="why-pill-tag" style={{ background: "#f0fdf4", color: "#16a34a" }}>
              99.8% SLA
            </span>
          </div>

          {/* 3. Free reschedule at any time */}
          <div className="why-card why-col-reschedule">
            <div className="why-icon-box" style={{ background: "#eff6ff", color: "#2563eb" }}>
              <CalendarSync size={24} strokeWidth={2.2} />
            </div>
            <h3 className="why-card-title">Free reschedule at any time</h3>
            <p className="why-card-desc">
              Change your moving date whenever your plans adjust with zero penalty fees.
            </p>
            <span className="why-pill-tag" style={{ background: "#eff6ff", color: "#2563eb" }}>
              Zero Penalty
            </span>
          </div>

          {/* 4. Uninstallation & installation of electrical items */}
          <div className="why-card why-col-electrical">
            <div className="why-icon-box" style={{ background: "#fffbeb", color: "#d97706" }}>
              <Wrench size={24} strokeWidth={2.2} />
            </div>
            <h3 className="why-card-title">
              Uninstallation & installation of electrical items by professionals
            </h3>
            <p className="why-card-desc">
              Certified technicians handle split AC unmounting, TV wall bracket mounts, geysers, and modular fixtures safely.
            </p>
            <span className="why-pill-tag" style={{ background: "#fffbeb", color: "#b45309" }}>
              Certified Technicians
            </span>
          </div>

          {/* 5. Damage proof packaging */}
          <div className="why-card why-col-damageproof">
            <div className="why-icon-box" style={{ background: "#ecfeff", color: "#0891b2" }}>
              <PackageCheck size={24} strokeWidth={2.2} />
            </div>
            <h3 className="why-card-title">Damage proof packaging</h3>
            <p className="why-card-desc">
              Industrial 5-ply cartons, multi-layer bubble wrap, foam corner guards, and sealed stretch wrap.
            </p>
            <span className="why-pill-tag" style={{ background: "#ecfeff", color: "#0e7490" }}>
              Multi-Layer Defense
            </span>
          </div>

          {/* 6. CENTER HIGHLIGHT CARD: Why choose PackYatra */}
          <div className="why-card why-card-center why-col-center">
            <div className="why-icon-box" style={{ background: "#0045e6", color: "#ffffff", boxShadow: "0 6px 16px rgba(0, 69, 230, 0.35)" }}>
              <MapPin size={26} strokeWidth={2.4} />
            </div>
            <h3 className="why-card-title">Why choose PackYatra</h3>
            <p className="why-card-desc">
              India's premium tech-enabled relocation fleet. Verified in-house crew, insured transit, and 4.9★ Google satisfaction.
            </p>
            <button
              type="button"
              onClick={scrollToQuote}
              className="why-card-center-cta"
              title="Get an instant transparent price quote"
            >
              <span>Get Instant Quote</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 7. 24/7 support */}
          <div className="why-card why-col-support">
            <div className="why-icon-box" style={{ background: "#fef2f2", color: "#dc2626" }}>
              <Headset size={24} strokeWidth={2.2} />
            </div>
            <h3 className="why-card-title">24/7 support</h3>
            <p className="why-card-desc">
              Dedicated move captain on direct hotline and live WhatsApp support.
            </p>
            <span className="why-pill-tag" style={{ background: "#fef2f2", color: "#dc2626" }}>
              Live Help
            </span>
          </div>

          {/* 8. Edit booking any time */}
          <div className="why-card why-col-editbooking">
            <div className="why-icon-box" style={{ background: "#eef2ff", color: "#4f46e5" }}>
              <FilePenLine size={24} strokeWidth={2.2} />
            </div>
            <h3 className="why-card-title">Edit booking any time</h3>
            <p className="why-card-desc">
              Modify inventory items or update addresses anytime before transit.
            </p>
            <span className="why-pill-tag" style={{ background: "#eef2ff", color: "#4f46e5" }}>
              Self-Serve
            </span>
          </div>

          {/* 9. Add ons for extra ease */}
          <div className="why-card why-col-addons">
            <div className="why-icon-box" style={{ background: "#ecfdf5", color: "#059669" }}>
              <Puzzle size={24} strokeWidth={2.2} />
            </div>
            <h3 className="why-card-title">Add ons for extra ease</h3>
            <p className="why-card-desc">
              Custom wooden crating for art & marble, premium unpacking, and comprehensive insurance riders.
            </p>
            <span className="why-pill-tag" style={{ background: "#ecfdf5", color: "#059669" }}>
              Flexible Services
            </span>
          </div>

          {/* 10. Rope pulling services */}
          <div className="why-card why-col-ropepulling">
            <div className="why-icon-box" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
              <ArrowUpToLine size={24} strokeWidth={2.2} />
            </div>
            <h3 className="why-card-title">Rope pulling services</h3>
            <p className="why-card-desc">
              Specialized balcony and high-rise pulley hoisting for oversized sofas, king mattresses & bulky furniture.
            </p>
            <span className="why-pill-tag" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
              Balcony Hoisting
            </span>
          </div>

          {/* 11. Free cancellation till 24 hours */}
          <div className="why-card why-col-cancellation">
            <div className="why-icon-box" style={{ background: "#f0f9ff", color: "#0284c7" }}>
              <RotateCcw size={24} strokeWidth={2.2} />
            </div>
            <h3 className="why-card-title">
              Free cancellation till 24 hours before shifting date
            </h3>
            <p className="why-card-desc">
              Plans changed? Enjoy a 100% instant full refund with zero questions asked and zero cancellation fees.
            </p>
            <span className="why-pill-tag" style={{ background: "#f0f9ff", color: "#0284c7" }}>
              100% Full Refund
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChoosePackYatra;
