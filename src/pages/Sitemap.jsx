import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileCode2,
  ExternalLink,
  Copy,
  Check,
  Compass,
  Home,
  Calculator,
  CalendarCheck,
  Truck,
  Building2,
  Car,
  Warehouse,
  PawPrint,
  Info,
  HelpCircle,
  PhoneCall,
  FileText,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  Globe
} from "lucide-react";
import "../styles/Sitemap.css";

const SITEMAP_DATA = [
  {
    category: "Main Portals & Shifting Tools",
    icon: Compass,
    colorClass: "blue",
    links: [
      {
        title: "Home & Quick Estimate",
        desc: "Instant relocation quotes, intra-city pricing calculator, and booking gateway.",
        path: "/",
        url: "https://packyatra.com/"
      },
      {
        title: "Calculate Shifting Quote / Price Summary",
        desc: "Transparent price breakdowns, packing grades, and labor estimates.",
        path: "/price-summary",
        url: "https://packyatra.com/price-summary"
      },
      {
        title: "Relocation Booking Flow",
        desc: "Schedule move dates, choose packing materials, and reserve dispatch crews.",
        path: "/booking",
        url: "https://packyatra.com/booking"
      },
      {
        title: "Customer Portal & Active Bookings",
        desc: "Manage confirmed bookings, invoices, and shipment status.",
        path: "/bookings",
        url: "https://packyatra.com/bookings"
      }
    ]
  },
  {
    category: "Relocation Services",
    icon: Truck,
    colorClass: "amber",
    links: [
      {
        title: "Household & Apartment Relocation",
        desc: "Full-service house shifting with multi-layer bubble wrap and furniture assembly.",
        path: "/#services",
        url: "https://packyatra.com/#services"
      },
      {
        title: "Same Apartment & Intra-City Shifting",
        desc: "Affordable within-society and short-haul relocation with labor-first pricing.",
        path: "/#services",
        url: "https://packyatra.com/#services"
      },
      {
        title: "Corporate & Office Relocation",
        desc: "Weekend and overnight IT relocation with server packaging and desk mapping.",
        path: "/#services",
        url: "https://packyatra.com/#services"
      },
      {
        title: "Vehicle & Automobile Transportation",
        desc: "Hydraulic enclosed car carriers and customized bike crating pan-India.",
        path: "/#services",
        url: "https://packyatra.com/#services"
      },
      {
        title: "Pet Relocation Care",
        desc: "Stress-free climate-controlled pet transfer with certified veterinary handlers.",
        path: "/#services",
        url: "https://packyatra.com/#services"
      },
      {
        title: "Warehousing & Secure Storage",
        desc: "24/7 CCTV-monitored climate-controlled storage for short or long-term safety.",
        path: "/#services",
        url: "https://packyatra.com/#services"
      }
    ]
  },
  {
    category: "Company & Customer Support",
    icon: HelpCircle,
    colorClass: "emerald",
    links: [
      {
        title: "About PackYatra",
        desc: "Our story, licensed fleet network, safety standards, and pan-India coverage.",
        path: "/about",
        url: "https://packyatra.com/about"
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        desc: "Answers regarding pricing, insurance riders, packing cartons, and transit times.",
        path: "/faq",
        url: "https://packyatra.com/faq"
      },
      {
        title: "Contact Support & 24/7 Hotline",
        desc: "Connect directly with our central dispatch desk via phone, email, or WhatsApp.",
        path: "/contact",
        url: "https://packyatra.com/contact"
      }
    ]
  },
  {
    category: "Policies & Legal Governance",
    icon: ShieldCheck,
    colorClass: "purple",
    links: [
      {
        title: "Terms & Conditions",
        desc: "Customer service agreement, carrier obligations, liabilities, and transit terms.",
        path: "/terms-and-conditions",
        url: "https://packyatra.com/terms-and-conditions"
      },
      {
        title: "Cancellation & Refund Policy",
        desc: "Transparent advance deposit refund schedules and rescheduling guidelines.",
        path: "/refund-policy",
        url: "https://packyatra.com/refund-policy"
      },
      {
        title: "Privacy & Data Protection Policy",
        desc: "How we collect, safeguard, and handle customer contact and location data.",
        path: "/privacy-policy",
        url: "https://packyatra.com/privacy-policy"
      }
    ]
  }
];

const Sitemap = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = "HTML & XML Sitemap | PackYatra Relocation";
    window.scrollTo(0, 0);

    // Schema.org structured data for SiteNavigationElement
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "sitemap-jsonld";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "PackYatra Sitemap",
      "description": "Comprehensive index of all PackYatra pages, relocation services, price estimators, and legal documents.",
      "url": "https://packyatra.com/sitemap",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://packyatra.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Sitemap",
            "item": "https://packyatra.com/sitemap"
          }
        ]
      }
    });

    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("sitemap-jsonld");
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  const handleCopyXmlUrl = () => {
    const sitemapUrl = `${window.location.origin}/sitemap.xml`;
    navigator.clipboard.writeText(sitemapUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="sitemap-page">
      {/* Hero Header */}
      <header className="sitemap-hero">
        <div className="sitemap-hero-container">
          <div className="sitemap-badge">
            <Globe size={14} />
            <span>Search Engine & User Directory</span>
          </div>
          <h1 className="sitemap-title">Website Sitemap & Navigation</h1>
          <p className="sitemap-subtitle">
            Browse through all sections, moving quote calculators, verified relocation services, 
            customer support hotlines, and regulatory policies across PackYatra.
          </p>
        </div>
      </header>

      {/* XML Sitemap Quick Access Bar */}
      <section className="sitemap-xml-banner" aria-label="Machine Readable Sitemap">
        <div className="sitemap-xml-card">
          <div className="sitemap-xml-left">
            <div className="sitemap-xml-icon">
              <FileCode2 size={24} />
            </div>
            <div className="sitemap-xml-text">
              <h3>Search Engine XML Sitemap</h3>
              <p>Standardized sitemaps.org XML schema for Google, Bing, and web crawlers.</p>
            </div>
          </div>
          <div className="sitemap-xml-actions">
            <a 
              href="/sitemap.xml" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-xml-view"
              title="Open raw sitemap.xml in a new tab"
            >
              <ExternalLink size={16} />
              <span>View sitemap.xml</span>
            </a>
            <button 
              type="button" 
              onClick={handleCopyXmlUrl} 
              className="btn-xml-copy"
              title="Copy public URL of sitemap.xml to clipboard"
            >
              {copied ? <Check size={16} color="#059669" /> : <Copy size={16} />}
              <span>{copied ? "Copied URL!" : "Copy Link"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Directory Grids */}
      <main className="sitemap-container">
        <div className="sitemap-grid">
          {SITEMAP_DATA.map((section, idx) => {
            const SectionIcon = section.icon;
            return (
              <section key={idx} className="sitemap-section-card">
                <div className="sitemap-section-header">
                  <div className={`sitemap-header-icon ${section.colorClass}`}>
                    <SectionIcon size={20} />
                  </div>
                  <h2>{section.category}</h2>
                </div>

                <ul className="sitemap-links-list">
                  {section.links.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link to={item.path} className="sitemap-link-item">
                        <div className="sitemap-link-content">
                          <div className="sitemap-link-title">
                            <span>{item.title}</span>
                          </div>
                          <div className="sitemap-link-desc">{item.desc}</div>
                          <div className="sitemap-link-url">{item.url}</div>
                        </div>
                        <ArrowRight size={16} className="sitemap-link-arrow" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        {/* Footer Meta Box */}
        <div className="sitemap-meta-box">
          <div className="sitemap-meta-col">
            <ShieldCheck size={22} color="#2563eb" />
            <div>
              <div className="sitemap-meta-title">Verified Protocol & Standards</div>
              <div className="sitemap-meta-subtitle">Conforms to Sitemaps XML 0.9 protocol and W3C ISO-8601 timestamps.</div>
            </div>
          </div>
          <div className="sitemap-meta-col">
            <span style={{ fontSize: "13px", color: "#64748b" }}>
              Last Synchronized: <strong>2026-10-29</strong>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sitemap;
