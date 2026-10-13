import React from "react";
import PackYatraLogo from "../components/PackYatraLogo.jsx";
import packyatraLuxuryRelocationImg from "../assets/images/packyatra_luxury_relocation_1791910596759.jpg";

const BannerSection = () => (
  <section className="banner-section" style={{
    background: "linear-gradient(180deg, #070d18 0%, #0c1527 50%, #070c17 100%)",
    padding: "3rem 1.5rem",
    position: "relative",
    overflow: "hidden",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
  }}>
    <div className="template-container" style={{
      maxWidth: "1280px",
      margin: "0 auto",
      position: "relative",
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.6)",
      minHeight: "360px",
      display: "flex",
      alignItems: "center"
    }}>
      <img 
        src={packyatraLuxuryRelocationImg} 
        alt="PackYatra Luxury Relocation Logistics" 
        className="template-image" 
        referrerPolicy="no-referrer"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center"
        }}
      />
      {/* Contrast Overlay Scrim */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, rgba(7, 13, 24, 0.94) 0%, rgba(7, 13, 24, 0.75) 50%, rgba(7, 13, 24, 0.4) 100%)"
      }} />

      <div className="overlay-text" style={{
        position: "relative",
        zIndex: 2,
        padding: "40px 48px",
        maxWidth: "680px"
      }}>
        {/* Brand Emblem */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          padding: "6px 14px",
          borderRadius: "10px",
          marginBottom: "18px"
        }}>
          <PackYatraLogo height={32} isDark={true} showSubtitle={false} />
          <span style={{
            fontSize: "11px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#93c5fd"
          }}>
            India's Premier Relocation Network
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
          fontWeight: "800",
          color: "#ffffff",
          lineHeight: "1.2",
          marginBottom: "14px",
          letterSpacing: "-0.02em"
        }}>
          Managed Relocation Infrastructure Across India
        </h1>

        <p style={{
          fontSize: "15px",
          color: "#cbd5e1",
          lineHeight: "1.65",
          marginBottom: "24px"
        }}>
          Zero subcontracting, 100% bonded staff, GPS-tracked enclosed carriers, and multi-layer asset protection.
        </p>

        {/* Action Buttons with actual phone number */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <a 
            href="tel:+919071535535" 
            className="cta-button"
            style={{
              background: "#0045e6",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "14px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(0, 69, 230, 0.4)"
            }}
          >
            Call: +91 90715 35535
          </a>
          <a 
            href="https://wa.me/9071535535" 
            target="_blank" 
            rel="noreferrer"
            style={{
              background: "#25d366",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "14px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            WhatsApp Booking
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default BannerSection;
