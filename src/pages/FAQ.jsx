import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ChevronDown,
  HelpCircle,
  Phone,
  MessageSquare,
  ShieldCheck,
  Calculator,
  Package,
  Building2,
  ArrowRight,
  Truck,
  CheckCircle2
} from "lucide-react";
import "../styles/FAQ.css";

const FAQ_DATA = [
  {
    category: "Pricing & Booking",
    q: "How much does packing and moving cost?",
    a: "Pricing depends on distance, volume, inventory specifics, and selected services. Intra-city moves start from ₹1,000 for studio apartments, with fully itemized quotes provided upfront with zero hidden fees.",
  },
  {
    category: "Pricing & Booking",
    q: "How does Same Apartment Shifting pricing work?",
    a: "Same Apartment or intra-society moves utilize our Intra-City base pricing with a standardized minimum distance calculation. You only pay for crew labor, elevator/stair handling, and required protective packing—avoiding heavy line-haul transport tariffs.",
  },
  {
    category: "Safety & Insurance",
    q: "Is transit insurance included in the shifting contract?",
    a: "Yes, comprehensive transit damage protection is included with every quote. High-value equipment, luxury furnishings, and electronics can be covered with specialized indemnity riders for total peace of mind.",
  },
  {
    category: "Our Process",
    q: "How long does the relocation process take?",
    a: "Local metropolitan moves are completed same-day within 4 to 8 hours. Inter-city moves operate on strict line-haul schedules based on road transit distances (typically 24 to 72 hours for major freight corridors).",
  },
  {
    category: "Our Process",
    q: "Do you provide industrial-grade packing materials?",
    a: "Yes, we deploy 5-ply corrugated cartons, heavy-duty air bubble wraps, anti-static IT protection, foam wraps, edge corner guards, and water-resistant stretch films to guarantee damage-free transit.",
  },
  {
    category: "Safety & Insurance",
    q: "Can corporate clients track shipment transit live?",
    a: "Yes, dedicated move coordinators provide satellite GPS status reports and milestone updates via WhatsApp, SMS, and our live online tracking portal throughout the entire journey.",
  },
  {
    category: "General",
    q: "What areas and cities do you serve across India?",
    a: "PackYatra operates across 50+ major metropolitan hubs and tier-2 cities—including Bangalore, Mumbai, Pune, Hyderabad, Chennai, Delhi NCR, and Kolkata—with direct daily line-haul logistics routes.",
  },
  {
    category: "Pricing & Booking",
    q: "How do I request an official corporate or residential quote?",
    a: "You can configure your move online using our instant calculator, book via the web form, or contact our dedicated enterprise accounts desk (+91 90715 35535) for a complimentary on-site or virtual video survey.",
  },
  {
    category: "Pricing & Booking",
    q: "What corporate payment methods do you accept?",
    a: "We accept corporate purchase orders, NEFT/RTGS bank transfers, UPI, credit/debit cards, and corporate invoicing with full tax-deductible GST compliance.",
  },
  {
    category: "Pricing & Booking",
    q: "What is your reschedule or cancellation policy?",
    a: "Commercial and residential moves can be rescheduled up to 24 hours prior to the dispatch window with zero penalty fees. You can adjust your moving date directly through your coordinator.",
  },
  {
    category: "Our Process",
    q: "Are there any restricted or hazardous items you do not transport?",
    a: "For regulatory compliance and public safety, we do not transport flammable chemicals, explosives, compressed gases, perishable foodstuffs, ammunition, or contraband items.",
  },
  {
    category: "General",
    q: "What certifications and vetting do your handling crews have?",
    a: "Our logistics professionals have 16+ years of operational experience, complete background verification, and formal training in heavy equipment maneuvering, fragile handling, and workplace safety protocols.",
  },
  {
    category: "Our Process",
    q: "Do you offer full post-move setup and unpacking?",
    a: "Yes, our team unpacks all items at your destination, re-assembles modular furniture and appliances, arranges rooms according to your layout plan, and disposes of all packaging debris responsibly.",
  },
  {
    category: "General",
    q: "Do you offer climate-controlled storage solutions?",
    a: "Yes, we operate 24/7 CCTV-monitored, pest-controlled, climate-regulated warehouse facilities with flexible short-term storage and enterprise long-term warehousing agreements.",
  },
  {
    category: "General",
    q: "How should our facility or household prepare for moving day?",
    a: "We provide an interactive 4-Week Milestone Checklist Planner on our platform to help organize decluttering, utility transfers, society gate passes, and moving-day essentials.",
  },
  {
    category: "Safety & Insurance",
    q: "What is the claim process in the unlikely event of transit damage?",
    a: "Our dedicated claims desk registers formal inspection reports within 24 hours of delivery and expedites reimbursement or repair under our underwritten transit insurance policy.",
  },
  {
    category: "General",
    q: "Do you provide specialized pet relocation services?",
    a: "Yes! PackYatra offers safe, veterinary-assisted pet relocation featuring IATA-compliant ventilated travel crates, scheduled hydration/feeding stops, certified handlers, and live photo check-ins.",
  },
  {
    category: "General",
    q: "What sets PackYatra apart from standard packers and movers?",
    a: "We provide enterprise SLAs, transparent upfront billing with zero surprises, dedicated single-point move coordinators, background-verified crews, and round-the-clock customer assistance.",
  }
];

const CATEGORIES = ["All", "Pricing & Booking", "Safety & Insurance", "Our Process", "General"];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openQuestion, setOpenQuestion] = useState(FAQ_DATA[0].q);

  const toggleAccordion = (question) => {
    setOpenQuestion((prev) => (prev === question ? null : question));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory =
        selectedCategory === "All" || faq.category === selectedCategory;
      const qLower = faq.q.toLowerCase();
      const aLower = faq.a.toLowerCase();
      const searchLower = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !searchLower ||
        qLower.includes(searchLower) ||
        aLower.includes(searchLower) ||
        faq.category.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts = { All: FAQ_DATA.length };
    FAQ_DATA.forEach((faq) => {
      counts[faq.category] = (counts[faq.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="faq-page">
      {/* 1. HERO SECTION */}
      <section className="faq-hero-section">
        <div className="faq-hero-overlay" />
        <div className="faq-hero-container">
          <nav className="faq-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="faq-breadcrumbs-divider">/</span>
            <span className="faq-breadcrumbs-current">FAQ</span>
          </nav>

          <div className="faq-badge">
            <span className="faq-badge-dot" />
            <span>Help Center & Knowledge Base</span>
          </div>

          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-subtitle">
            Everything you need to know about transparent pricing, corporate SLA contracts,
            comprehensive transit insurance, specialized packing standards, and tracking.
          </p>
        </div>
      </section>

      {/* 2. MAIN FAQ CONTENT */}
      <main className="faq-main-wrapper">
        {/* QUICK TOPIC SHORTCUT CARDS */}
        <div className="faq-quick-topics">
          <button
            type="button"
            className="faq-topic-card"
            onClick={() => {
              setSelectedCategory("Pricing & Booking");
              setSearchQuery("");
            }}
          >
            <div className="faq-topic-icon">
              <Calculator size={20} />
            </div>
            <h3 className="faq-topic-title">Pricing & Quotes</h3>
            <p className="faq-topic-desc">
              Understand base fares, intra-city shifting, and transparent billing.
            </p>
          </button>

          <button
            type="button"
            className="faq-topic-card"
            onClick={() => {
              setSelectedCategory("Safety & Insurance");
              setSearchQuery("");
            }}
          >
            <div className="faq-topic-icon">
              <ShieldCheck size={20} />
            </div>
            <h3 className="faq-topic-title">Safety & Insurance</h3>
            <p className="faq-topic-desc">
              Underwritten transit protection, claims desk, and GPS monitoring.
            </p>
          </button>

          <button
            type="button"
            className="faq-topic-card"
            onClick={() => {
              setSelectedCategory("Our Process");
              setSearchQuery("");
            }}
          >
            <div className="faq-topic-icon">
              <Package size={20} />
            </div>
            <h3 className="faq-topic-title">Packing & Moving</h3>
            <p className="faq-topic-desc">
              5-ply cartons, unpacking services, and moving day workflows.
            </p>
          </button>

          <button
            type="button"
            className="faq-topic-card"
            onClick={() => {
              setSelectedCategory("General");
              setSearchQuery("");
            }}
          >
            <div className="faq-topic-icon">
              <Building2 size={20} />
            </div>
            <h3 className="faq-topic-title">Corporate & Fleet</h3>
            <p className="faq-topic-desc">
              Multi-city line haul routes, certified crews, and secure storage.
            </p>
          </button>
        </div>

        {/* SEARCH & CATEGORY FILTER */}
        <div className="faq-filter-card">
          <div className="faq-search-wrapper">
            <Search size={18} className="faq-search-icon" />
            <input
              type="text"
              className="faq-search-input"
              placeholder="Search questions by topic (e.g., insurance, cost, same apartment, packing, pet)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search frequently asked questions"
            />
            {searchQuery && (
              <button
                type="button"
                className="faq-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="faq-category-pills" role="tablist">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`faq-category-pill ${isActive ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span>{cat}</span>
                  <span className="faq-category-count">{categoryCounts[cat] || 0}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ ACCORDION LIST */}
        <div className="faq-list-header">
          <span className="faq-list-count">
            Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? "question" : "questions"}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
        </div>

        <div className="faq-accordion-group">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openQuestion === faq.q;
                return (
                  <div
                    key={faq.q}
                    className={`faq-item-card ${isOpen ? "open" : ""}`}
                  >
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggleAccordion(faq.q)}
                      aria-expanded={isOpen}
                    >
                      <div className="faq-question-left">
                        <span className="faq-q-indicator">
                          <HelpCircle size={15} />
                        </span>
                        <div className="faq-question-content">
                          <span className="faq-category-tag">{faq.category}</span>
                          <span className="faq-question-text">{faq.q}</span>
                        </div>
                      </div>

                      <div className="faq-toggle-icon">
                        <ChevronDown size={16} />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="faq-answer-container">
                            <p>{faq.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <div className="faq-empty-state">
                <HelpCircle size={36} color="#94a3b8" />
                <h3 className="faq-empty-title">No matching answers found</h3>
                <p className="faq-empty-desc">
                  We couldn't locate any questions matching "{searchQuery}". Try adjusting your keywords or clearing the filter.
                </p>
                <button
                  type="button"
                  className="faq-reset-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  Reset Search Filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. BOTTOM HELP DESK CARD */}
        <div className="faq-support-card">
          <div className="faq-support-info">
            <div className="faq-support-tag">24/7 Dedicated Support Desk</div>
            <h3 className="faq-support-title">Still have unanswered questions?</h3>
            <p className="faq-support-desc">
              Our relocation specialists and move coordinators are on standby to provide tailored quotes, address custom logistics inquiries, or guide you through commercial transit requirements.
            </p>
          </div>

          <div className="faq-support-actions">
            <a href="tel:+919071535535" className="faq-btn-primary">
              <Phone size={16} />
              <span>Call +91 90715 35535</span>
            </a>
            <a
              href="https://wa.me/9071535535"
              target="_blank"
              rel="noreferrer"
              className="faq-btn-secondary"
            >
              <MessageSquare size={16} />
              <span>Chat on WhatsApp</span>
            </a>
            <Link to="/#estimator" className="faq-btn-secondary">
              <Truck size={16} />
              <span>Instant Cost Estimate</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
