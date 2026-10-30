import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FixedMovingForm from "../sections/FixedMovingForm";
import Modal from "../pages/Model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBuilding,
  faBoxOpen,
  faCheck,
  faShieldAlt,
  faTruck,
  faHandshake,
  faUsers,
  faChevronDown,
  faCar,
  faTruckMoving,
  faPeopleCarry,
  faSearch,
  faTimes,
  faQuestionCircle,
  faStar,
  faPlus,
  faTrashAlt,
  faUndo,
  faCalculator,
  faLock,
  faCheckCircle,
  faWarehouse,
  faClock,
  faFileContract,
  faAward,
  faArrowRight,
  faPaw
} from "@fortawesome/free-solid-svg-icons";
import PackYatraLogo from "../components/PackYatraLogo.jsx";
import packyatraLuxuryRelocationImg from "../assets/images/packyatra_luxury_relocation_1791910596759.jpg";
import packyatraCityExpressImg from "../assets/images/packyatra_express_city_1791910627301.jpg";
import packyatraTerminalFleetImg from "../assets/images/packyatra_fleet_corporate_1791709011422.jpg";
import packyatraCrewImg from "../assets/images/packyatra_crew_packing_1790740227823.jpg";
import WhyChoosePackYatra from "../components/WhyChoosePackYatra.jsx";
import "../styles/app-styles.css";

const HomeSelection = ({ onLoginStatusChange }) => {
  const navigate = useNavigate();
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [shiftingDate, setShiftingDate] = useState("");
  const [activeTab, setActiveTab] = useState("within");
  const [selectedCity, setSelectedCity] = useState("");
  const [error, setError] = useState("");
  const [shiftFromSuggestion, setShiftFromSuggestion] = useState([]);
  const [shiftingToSuggestion, setShiftingToSuggestion] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [distance, setDistance] = useState(0);

  // --- INTERACTIVE MOVING CHECKLIST PLANNERS STATES ---
  const defaultChecklist = [
    { id: "4w-1", category: "4 Weeks Before", text: "Sort through household items and declutter", checked: false },
    { id: "4w-2", category: "4 Weeks Before", text: "Create an inventory of items to be moved", checked: false },
    { id: "4w-3", category: "4 Weeks Before", text: "Get an initial quote on PackYatra for booking planning", checked: false },
    { id: "2w-1", category: "2 Weeks Before", text: "Notify utility providers (electricity, internet, water) of disconnection date", checked: false },
    { id: "2w-2", category: "2 Weeks Before", text: "Confirm building management/society permission for truck entry", checked: false },
    { id: "2w-3", category: "2 Weeks Before", text: "Pack non-essential items and valuables separately", checked: false },
    { id: "mw-1", category: "Moving Week", text: "Defrost and clean the refrigerator 24 hours prior", checked: false },
    { id: "mw-2", category: "Moving Week", text: "Prepare an 'Essentials Box' for the first night (keys, chargers, documents)", checked: false },
    { id: "mw-3", category: "Moving Week", text: "Confirm the exact reporting time with PackYatra coordinators", checked: false },
    { id: "md-1", category: "Moving Day", text: "Keep valuables and crucial files in your personal baggage", checked: false },
    { id: "md-2", category: "Moving Day", text: "Supervise packing of fragile items by the PackYatra crew", checked: false },
    { id: "md-3", category: "Moving Day", text: "Double-check all drawers, closets, and cupboards before loading", checked: false }
  ];

  const [checklistTasks, setChecklistTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("packyatra_moving_checklist");
      return saved ? JSON.parse(saved) : defaultChecklist;
    } catch (e) {
      return defaultChecklist;
    }
  });

  const [activeChecklistTab, setActiveChecklistTab] = useState("4 Weeks Before");
  const [newChecklistText, setNewChecklistText] = useState("");

  const updateChecklist = (newTasks) => {
    setChecklistTasks(newTasks);
    try {
      localStorage.setItem("packyatra_moving_checklist", JSON.stringify(newTasks));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleChecklistTask = (id) => {
    const updated = checklistTasks.map(task => 
      task.id === id ? { ...task, checked: !task.checked } : task
    );
    updateChecklist(updated);
  };

  const handleAddChecklistTask = (e) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const newTask = {
      id: "custom-" + Date.now(),
      category: activeChecklistTab,
      text: newChecklistText.trim(),
      checked: false
    };
    updateChecklist([...checklistTasks, newTask]);
    setNewChecklistText("");
  };

  const handleResetChecklist = () => {
    if (window.confirm("Are you sure you want to reset your moving checklist? This will also remove any custom tasks.")) {
      updateChecklist(defaultChecklist);
    }
  };

  const handleRemoveChecklistTask = (id) => {
    const updated = checklistTasks.filter(task => task.id !== id);
    updateChecklist(updated);
  };

  // --- INTERACTIVE COST ESTIMATOR STATES ---
  const [estBhkSize, setEstBhkSize] = useState("2 BHK");
  const [estDistance, setEstDistance] = useState(25);
  const [estFloor, setEstFloor] = useState(2);
  const [estHasLift, setEstHasLift] = useState(true);
  const [estPackingType, setEstPackingType] = useState("Standard");
  const [estIncludeInsurance, setEstIncludeInsurance] = useState(true);

  // Live Auto-Calculation Logic
  const getEstimationBreakdown = () => {
    let baseRent = 1800;
    let perKmRate = 35;
    let basePacking = 2600;

    if (estBhkSize === "1 BHK") {
      baseRent = 1000;
      perKmRate = 25;
      if (estPackingType === "Economy") basePacking = 800;
      else if (estPackingType === "Standard") basePacking = 1500;
      else basePacking = 2500;
    } else if (estBhkSize === "2 BHK") {
      baseRent = 1800;
      perKmRate = 35;
      if (estPackingType === "Economy") basePacking = 1400;
      else if (estPackingType === "Standard") basePacking = 2600;
      else basePacking = 4200;
    } else if (estBhkSize === "3 BHK") {
      baseRent = 2800;
      perKmRate = 45;
      if (estPackingType === "Economy") basePacking = 2000;
      else if (estPackingType === "Standard") basePacking = 3800;
      else basePacking = 5900;
    } else { // 4 BHK / Villa
      baseRent = 4000;
      perKmRate = 55;
      if (estPackingType === "Economy") basePacking = 3000;
      else if (estPackingType === "Standard") basePacking = 5200;
      else basePacking = 8000;
    }

    const transportCost = baseRent + (estDistance * perKmRate);
    
    let floorSurcharge = 0;
    if (estFloor > 0) {
      if (estHasLift) {
        floorSurcharge = estFloor * 100;
      } else {
        floorSurcharge = estFloor * 250;
      }
    }

    const subtotal = transportCost + basePacking + floorSurcharge;
    const gst = Math.round(subtotal * 0.18);
    const insurance = estIncludeInsurance ? 500 : 0;
    const total = subtotal + gst + insurance;

    return {
      transport: transportCost,
      packing: basePacking,
      floorSurcharge,
      subtotal,
      gst,
      insurance,
      total
    };
  };

  const estBreakdown = getEstimationBreakdown();

  const BANGALORE_COORDS = { lat: 12.9716, lon: 77.5946 };
  const CITY_RADIUS_KM = 30;
  const BETWEEN_RADIUS_KM = 200;

  const fetchAddressSuggestions = async (query, setSuggestions, city = "") => {
    if (query.length < 2) return;

    const searchQuery = city ? `${query}, ${city}` : query;

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      searchQuery
    )}&limit=10&apiKey=6c4609acb64b46699389f4929be8af24`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      let results = data.features || [];

      results = results.filter((f) => {
        if (!f.properties?.lat || !f.properties?.lon) return false;

        const point = {
          lat: f.properties.lat,
          lon: f.properties.lon,
        };

        const dist = calculateDistance(BANGALORE_COORDS, point);

        if (activeTab === "within" || activeTab === "same_apartment") {
          return true;
        }

        if (activeTab === "between") {
          if (setSuggestions === setShiftFromSuggestion) {
            return dist <= BETWEEN_RADIUS_KM;
          }
          if (setSuggestions === setShiftingToSuggestion) {
            return dist > CITY_RADIUS_KM;
          }
        }

        return true;
      });

      setSuggestions(results);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  const calculateDistance = (coord1, coord2) => {
    if (!coord1 || !coord2) return 0;

    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km

    const dLat = toRad(coord2.lat - coord1.lat);
    const dLon = toRad(coord2.lon - coord1.lon);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCheckPrices = (overrideFrom, overrideTo, overridePickupFlat, overrideDropFlat) => {
    // Same Apartment Shifting Price Logic (uses Intra-City base pricing)
    if (activeTab === "same_apartment") {
      const baseAddr = overrideFrom || fromAddress;
      if (!baseAddr) {
        setError("Please enter and select your Apartment / Society complex address.");
        return;
      }
      if (!fromCoords) {
        setError("Please select the Apartment / Society from verified suggestions.");
        return;
      }

      setError("");
      const pFlat = overridePickupFlat || localStorage.getItem("pickupFlat") || "";
      const dFlat = overrideDropFlat || localStorage.getItem("dropFlat") || "";

      let finalFrom = baseAddr;
      let finalTo = overrideTo || toAddress || baseAddr;

      if (pFlat && !finalFrom.includes(`(Pickup: ${pFlat})`)) {
        finalFrom = `${finalFrom.replace(/ \(Pickup: .*\)/, "")} (Pickup: ${pFlat})`;
      }
      if (dFlat && !finalTo.includes(`(Drop: ${dFlat})`)) {
        finalTo = `${finalTo.replace(/ \(Drop: .*\)/, "")} (Drop: ${dFlat})`;
      }

      setFromAddress(finalFrom);
      setToAddress(finalTo);

      // Intra-City shifting base pricing with minimum distance for same apartment move
      const dist = "1.00";
      setDistance(dist);
      localStorage.setItem("distance", dist);
      localStorage.setItem("fromAddress", finalFrom);
      localStorage.setItem("toAddress", finalTo);
      localStorage.setItem("pickupFlat", pFlat);
      localStorage.setItem("dropFlat", dFlat);
      localStorage.setItem("shiftingDate", shiftingDate);
      localStorage.setItem("fromCoords", JSON.stringify(fromCoords));
      localStorage.setItem("toCoords", JSON.stringify(toCoords || fromCoords));
      localStorage.setItem("activeTab", "within"); // Use Intra-City shifting logic
      localStorage.setItem("shiftingType", "same_apartment");
      openModal();
      return;
    }

    if (!fromAddress || !toAddress) {
      setError("Please fill both Origin and Destination addresses.");
      return;
    }

    if (!fromCoords) {
      setError("Please select 'Origin' address from the verified suggestions list.");
      return;
    }

    if (!toCoords) {
      setError("Please select 'Destination' address from the verified suggestions list.");
      return;
    }

    setError("");

    const dist = calculateDistance(fromCoords, toCoords);
    const formattedDist = dist.toFixed(2);
    setDistance(formattedDist);
    localStorage.setItem("distance", formattedDist);
    localStorage.setItem("fromAddress", fromAddress);
    localStorage.setItem("toAddress", toAddress);
    localStorage.setItem("shiftingDate", shiftingDate);
    localStorage.setItem("fromCoords", JSON.stringify(fromCoords));
    localStorage.setItem("toCoords", JSON.stringify(toCoords));
    localStorage.setItem("activeTab", activeTab);
    localStorage.setItem("shiftingType", activeTab);
    localStorage.removeItem("pickupFlat");
    localStorage.removeItem("dropFlat");
    localStorage.removeItem("pickupUnit");
    localStorage.removeItem("destUnit");
    openModal();
  };

  const [activeServiceTab, setActiveServiceTab] = useState("all");

  const handleServiceSelect = (serviceTitle) => {
    const element = document.querySelector(".fixed-form") || document.getElementById("home");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (serviceTitle.toLowerCase().includes("local") || serviceTitle.toLowerCase().includes("household")) {
      setActiveTab("within");
    } else {
      setActiveTab("between");
    }
  };

  const servicesData = [
    {
      icon: faBuilding,
      title: "Corporate Office Relocation",
      desc: "Zero-downtime office migration engineered for enterprise tech workstations, meeting facilities, and mission-critical hardware.",
      category: "commercial",
      badge: "Zero Business Downtime",
      accentColor: "navy",
      features: [
        "Specialized IT workstation de-racking & re-setup",
        "Document indexing & physical chain of custody",
        "Weekend & overnight execution schedules",
        "Dedicated corporate project coordinator"
      ]
    },
    {
      icon: faHome,
      title: "Executive Household Relocation",
      desc: "White-glove residential moving solutions including multi-layer protective packaging, unpacking, and luxury furniture handling.",
      category: "shifting",
      badge: "White-Glove Standard",
      accentColor: "blue",
      features: [
        "Precision multi-layer box packaging & custom crating",
        "Modular furniture dismantling & certified re-assembly",
        "High-value fragile & art handling protocols",
        "Complete door-to-door transit insurance"
      ]
    },
    {
      icon: faPaw,
      title: "Compassionate Pet Relocation",
      desc: "Stress-free, climate-controlled, veterinary-assisted pet moving solutions designed for dogs, cats, and companion animals.",
      category: "shifting",
      badge: "Vet-Certified Transit",
      accentColor: "blue",
      features: [
        "IATA-compliant, well-ventilated travel crates & sanitized bedding",
        "Veterinary health check & vaccination compliance assistance",
        "Dedicated pet handler with scheduled hydration, food & walks",
        "Real-time GPS transit monitoring with live photo check-ins"
      ]
    },
    {
      icon: faWarehouse,
      title: "Commercial Warehousing & Storage",
      desc: "High-security, climate-controlled warehousing facilities with 24/7 CCTV surveillance and digital inventory logging.",
      category: "storage",
      badge: "24/7 Monitored Facility",
      accentColor: "teal",
      features: [
        "Climate-regulated pest-proof storage chambers",
        "Biometric security & continuous CCTV telemetry",
        "Barcoded inventory tracking & instant dispatch",
        "Flexible short-term and enterprise annual lease terms"
      ]
    },
    {
      icon: faTruckMoving,
      title: "Metropolitan Intra-City Transit",
      desc: "Fast-track urban shifting with dedicated vehicle fleets, real-time route optimization, and vetted crew members.",
      category: "shifting",
      badge: "Same-Day Handover",
      accentColor: "navy",
      features: [
        "Guaranteed same-day delivery across metropolitan areas",
        "Dedicated closed-body container fleet",
        "Uniformed, background-verified logistics crews",
        "Direct point-to-point transit with zero consolidation"
      ]
    },
    {
      icon: faPeopleCarry,
      title: "Modular Dismantling & Industrial Care",
      desc: "Certified carpentry and engineering specialists for sophisticated modular desks, conference hubs, and luxury home joinery.",
      category: "storage",
      badge: "Certified Technicians",
      accentColor: "blue",
      features: [
        "Ergonomic workstation and partition dismantling",
        "Modular kitchen and wardrobe specialist handling",
        "Precision re-leveling and anchoring at destination",
        "Hardware cataloging with zero loss guarantee"
      ]
    },
    {
      icon: faCar,
      title: "Executive Vehicle Transport Fleet",
      desc: "Hydraulic-lift enclosed car carriers and multi-tier bike transport containers engineered for zero-damage interstate relocation.",
      category: "commercial",
      badge: "Hydraulic Enclosed Carriers",
      accentColor: "teal",
      features: [
        "Fully enclosed multi-car hydraulic transport trailers",
        "Wheel-lock safety harness and scratch-prevention wrapping",
        "GPS satellite transit tracking with ETA reports",
        "Comprehensive pre-transit and post-delivery inspection"
      ]
    }
  ];

  const filteredServices = servicesData.filter(service => {
    if (activeServiceTab === "all") return true;
    return service.category === activeServiceTab;
  });


  return (
    <div className="content-wrapper" style={{ background: "#f8fafc", color: "#0f172a" }}>
      <div className="main-content">
        <div id="home" className="page-section active">

          {/* =========================================================
              EXECUTIVE CORPORATE HERO SECTION - FORMAL PALETTE
             ========================================================= */}
          <section style={{
            background: "linear-gradient(180deg, #070d18 0%, #0c1527 50%, #070c17 100%)",
            color: "#ffffff",
            padding: "4.5rem 24px 5rem",
            position: "relative",
            overflow: "hidden",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
          }}>
            {/* Subtle Corporate Grid Lines */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              pointerEvents: "none"
            }} />

            <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: "1280px", margin: "0 auto" }}>
              <div className="hero-grid-container">
                
                {/* Left Column: Corporate Value Proposition */}
                <div style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%" }}>
                  <div style={{ maxWidth: "680px" }}>
                    
                    {/* Eyebrow Label */}
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                      background: "rgba(30, 58, 138, 0.35)",
                      border: "1px solid rgba(96, 165, 250, 0.35)",
                      padding: "5px 12px",
                      borderRadius: "20px"
                    }}>
                      <span style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "#38bdf8",
                        display: "inline-block",
                        boxShadow: "0 0 10px #38bdf8"
                      }} />
                      <span style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: "#bfdbfe"
                      }}>
                        Commercial Mobility & Enterprise Relocation
                      </span>
                    </div>

                    {/* Headline */}
                    <h1 style={{
                      fontSize: "clamp(2.4rem, 4.2vw, 3.6rem)",
                      fontWeight: "800",
                      lineHeight: "1.12",
                      color: "#ffffff",
                      marginBottom: "16px",
                      letterSpacing: "-0.03em"
                    }}>
                      Precision Corporate & <br />
                      <span style={{ color: "#3b82f6" }}>
                        Residential Relocation
                      </span>
                    </h1>

                    {/* Sub-headline */}
                    <p style={{
                      fontSize: "clamp(15px, 1.4vw, 17px)",
                      color: "#94a3b8",
                      lineHeight: "1.65",
                      marginBottom: "28px",
                      maxWidth: "600px"
                    }}>
                      PackYatra delivers managed relocation infrastructure for modern corporations, technology enterprises, and executive residences across India. Backed by GPS-monitored carrier fleets, insured asset handling, and dedicated move coordinators.
                    </p>

                    {/* Corporate SLA / Trust Metrics */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                      gap: "16px",
                      paddingTop: "20px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.1)"
                    }}>
                      <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                        <div style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.02em" }}>
                          10K+
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500", marginTop: "2px" }}>
                          Corporate & Domestic Moves
                        </div>
                      </div>

                      <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                        <div style={{ fontSize: "24px", fontWeight: "800", color: "#38bdf8", letterSpacing: "-0.02em" }}>
                          99.8%
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500", marginTop: "2px" }}>
                          On-Time Delivery SLA
                        </div>
                      </div>

                      <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                        <div style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.02em" }}>
                          ₹10 Cr+
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500", marginTop: "2px" }}>
                          Insured Asset Transit
                        </div>
                      </div>

                      <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                        <div style={{ fontSize: "24px", fontWeight: "800", color: "#facc15", letterSpacing: "-0.02em" }}>
                          4.9 ★
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500", marginTop: "2px" }}>
                          Verified Google Rating
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* PackYatra Fleet & Crew Operations Showcase Card */}
                  <div style={{
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.16)",
                    boxShadow: "0 24px 50px -10px rgba(0, 0, 0, 0.65)",
                    minHeight: "330px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "#070d18"
                  }}>
                    {/* Background Luxury Household & Relocation Moving Scene */}
                    <img 
                      src={packyatraLuxuryRelocationImg} 
                      alt="PackYatra Luxury Relocation Household Shifting with Professional Movers"
                      referrerPolicy="no-referrer"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center 50%"
                      }}
                    />

                    {/* Gradient Contrast Scrim - Allows movers and luxury villa to pop while keeping UI text crystal clear */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(7, 13, 24, 0.78) 0%, rgba(7, 13, 24, 0.15) 45%, rgba(7, 13, 24, 0.94) 100%)",
                      pointerEvents: "none"
                    }} />

                    {/* Top Row: Official PackYatra Logo Plaque & Verified Hotline Badge */}
                    <div style={{
                      position: "relative",
                      zIndex: 2,
                      padding: "16px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "10px"
                    }}>
                      {/* Official Website Logo Emblem (Frosted Glass Badge) */}
                      <div style={{
                        background: "rgba(7, 13, 24, 0.88)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        border: "1px solid rgba(255, 255, 255, 0.18)",
                        borderRadius: "12px",
                        padding: "7px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.45)"
                      }}>
                        <PackYatraLogo height={32} isDark={true} showSubtitle={false} />
                        <span style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "#93c5fd",
                          borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
                          paddingLeft: "10px"
                        }}>
                          Official Carrier
                        </span>
                      </div>

                      {/* Actual Verified Mobile Number Hotline Badge */}
                      <a 
                        href="tel:+919071535535"
                        title="Click to call PackYatra Direct Move Hotline"
                        style={{
                          background: "rgba(7, 13, 24, 0.92)",
                          backdropFilter: "blur(14px)",
                          WebkitBackdropFilter: "blur(14px)",
                          border: "1px solid rgba(59, 130, 246, 0.45)",
                          borderRadius: "12px",
                          padding: "8px 16px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "10px",
                          textDecoration: "none",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.45)",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <span style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#22c55e",
                          boxShadow: "0 0 10px #22c55e",
                          display: "inline-block"
                        }} />
                        <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                          <span style={{ fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", fontWeight: "600", lineHeight: "1" }}>
                            24/7 Move Hotline
                          </span>
                          <span style={{ fontSize: "13.5px", fontWeight: "800", color: "#ffffff", letterSpacing: "0.02em", marginTop: "2px", lineHeight: "1.2" }}>
                            +91 90715 35535
                          </span>
                        </div>
                      </a>
                    </div>

                    {/* Mid-Plaque: Official Brand Hallmark on Moving Fleet */}
                    <div style={{
                      position: "relative",
                      zIndex: 2,
                      margin: "10px 18px",
                      alignSelf: "flex-start",
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      borderRadius: "12px",
                      padding: "8px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      maxWidth: "460px",
                      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.5)",
                      border: "1.5px solid rgba(23, 56, 120, 0.18)"
                    }}>
                      <div style={{ flexShrink: 0 }}>
                        <PackYatraLogo height={34} isDark={false} showSubtitle={true} />
                      </div>
                      <div style={{ borderLeft: "1px solid #cbd5e1", paddingLeft: "12px" }}>
                        <div style={{ fontSize: "12px", fontWeight: "800", color: "#173878", letterSpacing: "0.04em" }}>
                          PREMIUM DOOR-TO-DOOR RELOCATION
                        </div>
                        <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                          <span style={{ color: "#2F74EE", fontWeight: "700" }}>White-Glove Packing</span>
                          <span>·</span>
                          <span style={{ color: "#EF2329", fontWeight: "700" }}>Zero Damage Guarantee</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Telemetry Banner at Bottom */}
                    <div style={{
                      position: "relative",
                      zIndex: 2,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                      background: "linear-gradient(180deg, rgba(7, 13, 24, 0.85) 0%, rgba(7, 13, 24, 0.98) 100%)",
                      borderTop: "1px solid rgba(255, 255, 255, 0.1)"
                    }}>
                      <div>
                        <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                          PackYatra Professional Moving Crew & GPS Fleet
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                          Sealed Container Trucks · Bonded Movers · Direct Hotline: <strong style={{ color: "#ffffff" }}>+91 90715 35535</strong>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <a 
                          href="https://wa.me/9071535535" 
                          target="_blank" 
                          rel="noreferrer"
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#ffffff",
                            background: "#25d366",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 2px 8px rgba(37, 211, 102, 0.3)"
                          }}
                        >
                          WhatsApp
                        </a>
                        <span style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#93c5fd",
                          background: "rgba(0, 69, 230, 0.35)",
                          border: "1px solid rgba(147, 197, 253, 0.3)",
                          padding: "5px 10px",
                          borderRadius: "6px"
                        }}>
                          PackYatra Verified
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Corporate Booking Form Widget */}
                <div style={{ display: "flex", justifyContent: "center", width: "100%", position: "relative" }}>
                  {!isModalOpen && (
                    <FixedMovingForm
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      fromAddress={fromAddress}
                      setFromAddress={setFromAddress}
                      toAddress={toAddress}
                      setToAddress={setToAddress}
                      shiftingDate={shiftingDate}
                      setShiftingDate={setShiftingDate}
                      selectedCity={selectedCity}
                      setSelectedCity={setSelectedCity}
                      error={error}
                      setError={setError}
                      shiftFromSuggestion={shiftFromSuggestion}
                      setShiftFromSuggestion={setShiftFromSuggestion}
                      shiftingToSuggestion={shiftingToSuggestion}
                      setShiftingToSuggestion={setShiftingToSuggestion}
                      fetchAddressSuggestions={fetchAddressSuggestions}
                      handleCheckPrices={handleCheckPrices}
                      fromCoords={fromCoords}
                      setFromCoords={setFromCoords}
                      toCoords={toCoords}
                      setToCoords={setToCoords}
                    />
                  )}
                </div>

              </div>
            </div>
          </section>

          {/* =========================================================
              ENTERPRISE CLIENT & TRUST STRIP
             ========================================================= */}
          <section style={{
            background: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            padding: "24px 24px"
          }}>
            <div className="container" style={{ maxWidth: "1280px", margin: "0 auto" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "24px"
              }}>
                <div style={{ fontSize: "11.5px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#64748b" }}>
                  Enterprise Relocation Standards For Leaders:
                </div>
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "32px",
                  flexWrap: "wrap"
                }}>
                  {[
                    "Technology Hub Migrations",
                    "Executive Domestic Mobility",
                    "Heavy Asset Logistics",
                    "Climate-Controlled Vaults",
                    "Pan-India SLA Transit"
                  ].map((label, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", fontWeight: "600", color: "#334155" }}>
                      <FontAwesomeIcon icon={faCheck} style={{ color: "#0045e6", fontSize: "11px" }} />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <Modal
            isOpen={isModalOpen}
            closeModal={closeModal}
            distance={distance}
            activeTab={activeTab === "same_apartment" ? "within" : activeTab}
            shiftingDate={shiftingDate}
            fromAddress={fromAddress}
            toAddress={toAddress}
            onLoginStatusChange={onLoginStatusChange}
          />

          {/* =========================================================
              ATTRACTIVE IN-PAGE HOME QUICK MENU / NAVIGATION STRIP
             ========================================================= */}
          <nav 
            className="home-quick-nav-strip"
            style={{
              position: "sticky",
              top: "110px",
              zIndex: 990,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderBottom: "1.5px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
              padding: "8px 24px"
            }}
            aria-label="Home page quick navigation"
          >
            <div className="container" style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
              {/* Quick links scrollable container */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                overflowX: "auto",
                padding: "2px 0",
                scrollbarWidth: "none",
                msOverflowStyle: "none"
              }} className="hide-scrollbar">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.querySelector(".fixed-form") || document.getElementById("home");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "12.5px",
                    fontWeight: "700",
                    background: "rgba(0, 69, 230, 0.08)",
                    color: "#0045e6",
                    border: "1px solid rgba(0, 69, 230, 0.2)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease"
                  }}
                >
                  <FontAwesomeIcon icon={faTruck} style={{ fontSize: "11px" }} />
                  <span>Instant Quote</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("why-choose-packyatra");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    background: "#f8fafc",
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0045e6"; e.currentTarget.style.color = "#0045e6"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#334155"; }}
                >
                  <FontAwesomeIcon icon={faShieldAlt} style={{ fontSize: "11px", color: "#0045e6" }} />
                  <span>Why PackYatra</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("services");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    background: "#f8fafc",
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0045e6"; e.currentTarget.style.color = "#0045e6"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#334155"; }}
                >
                  <FontAwesomeIcon icon={faBuilding} style={{ fontSize: "11px", color: "#64748b" }} />
                  <span>Our Services</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("estimator");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    background: "#f8fafc",
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0045e6"; e.currentTarget.style.color = "#0045e6"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#334155"; }}
                >
                  <FontAwesomeIcon icon={faCalculator} style={{ fontSize: "11px", color: "#64748b" }} />
                  <span>Cost Calculator</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("planner");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    background: "#f8fafc",
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0045e6"; e.currentTarget.style.color = "#0045e6"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#334155"; }}
                >
                  <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: "11px", color: "#64748b" }} />
                  <span>Moving Checklist</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/faq")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    background: "#f8fafc",
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0045e6"; e.currentTarget.style.color = "#0045e6"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#334155"; }}
                  title="View Dedicated FAQ Page"
                >
                  <FontAwesomeIcon icon={faQuestionCircle} style={{ fontSize: "11px", color: "#64748b" }} />
                  <span>FAQ Page</span>
                </button>
              </div>

              {/* Right: Quick Call CTA */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                <a 
                  href="tel:+919071535535"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#0f172a",
                    textDecoration: "none",
                    padding: "5px 12px",
                    borderRadius: "6px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1"
                  }}
                >
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e" }} />
                  <span>Direct Move Line: <strong>+91 90715 35535</strong></span>
                </a>
              </div>
            </div>
          </nav>

          {/* =========================================================
              WHY CHOOSE PACKYATRA - BENTO GRID GUARANTEES & PERKS
             ========================================================= */}
          <WhyChoosePackYatra />

          {/* =========================================================
              EXECUTIVE SERVICES SECTION
             ========================================================= */}
          <section id="services" style={{ padding: "5rem 24px", background: "#f8fafc" }}>
            <div className="container" style={{ maxWidth: "1280px", margin: "0 auto" }}>
              
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#0045e6",
                  marginBottom: "8px"
                }}>
                  Capabilities & Specialized Services
                </div>
                <h2 style={{
                  fontSize: "clamp(2rem, 3.2vw, 2.6rem)",
                  fontWeight: "800",
                  color: "#0f172a",
                  marginBottom: "12px",
                  letterSpacing: "-0.025em"
                }}>
                  Comprehensive Relocation Solutions
                </h2>
                <p style={{
                  fontSize: "15.5px",
                  color: "#64748b",
                  maxWidth: "640px",
                  margin: "0 auto",
                  lineHeight: "1.6"
                }}>
                  Engineered end-to-end relocation management for enterprise facilities, corporate executives, and residential moves across 50+ cities.
                </p>

                {/* Segmented Corporate Tabs */}
                <div style={{
                  display: "inline-flex",
                  backgroundColor: "#e2e8f0",
                  padding: "4px",
                  borderRadius: "10px",
                  gap: "4px",
                  marginTop: "24px",
                  flexWrap: "wrap",
                  justifyContent: "center"
                }}>
                  {[
                    { id: "all", label: "All Relocation Solutions" },
                    { id: "commercial", label: "Corporate & Enterprise" },
                    { id: "shifting", label: "Domestic Shifting" },
                    { id: "storage", label: "Warehousing & Technical" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveServiceTab(tab.id)}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        border: "none",
                        backgroundColor: activeServiceTab === tab.id ? "#ffffff" : "transparent",
                        color: activeServiceTab === tab.id ? "#0f172a" : "#64748b",
                        boxShadow: activeServiceTab === tab.id ? "0 2px 6px rgba(15, 23, 42, 0.08)" : "none",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Cards Grid */}
              <motion.div 
                layout 
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "28px"
                }}
              >
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.title}
                    icon={service.icon}
                    title={service.title}
                    desc={service.desc}
                    features={service.features}
                    badge={service.badge}
                    accentColor={service.accentColor}
                    onSelect={() => handleServiceSelect(service.title)}
                  />
                ))}
              </motion.div>

            </div>
          </section>

          {/* =========================================================
              ENTERPRISE CASE STUDY & SHOWCASE SPOTLIGHT
             ========================================================= */}
          <section style={{
            padding: "5rem 24px",
            background: "#ffffff",
            borderTop: "1px solid #e2e8f0",
            borderBottom: "1px solid #e2e8f0"
          }}>
            <div className="container" style={{ maxWidth: "1280px", margin: "0 auto" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "48px",
                alignItems: "center"
              }}>
                
                {/* Left: PackYatra in action image */}
                <div style={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid #cbd5e1",
                  boxShadow: "0 20px 35px -10px rgba(15, 23, 42, 0.12)",
                  height: "360px"
                }}>
                  <img 
                    src={packyatraCrewImg} 
                    alt="PackYatra Certified Relocation Specialists" 
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    right: "16px",
                    background: "rgba(15, 23, 42, 0.88)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "10px",
                    padding: "14px 18px",
                    color: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.15)"
                  }}>
                    <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#93c5fd", fontWeight: "700" }}>
                      PackYatra In-Action Standard
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "700", marginTop: "2px" }}>
                      Multi-Layer Cushioning & Industrial Asset Protection
                    </div>
                  </div>
                </div>

                {/* Right: Case study details */}
                <div>
                  <div style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "#0045e6",
                    marginBottom: "8px"
                  }}>
                    Proven Enterprise Delivery
                  </div>

                  <h3 style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "#0f172a",
                    lineHeight: "1.25",
                    marginBottom: "16px",
                    letterSpacing: "-0.02em"
                  }}>
                    Completed Over 48 Hours with Zero Disruption to Operations
                  </h3>

                  <p style={{ fontSize: "15px", color: "#475569", lineHeight: "1.65", marginBottom: "24px" }}>
                    When a leading technology firm needed to relocate 450 corporate workstations, sensitive server racks, and executive boardrooms across Bangalore, Packyatra mobilized a coordinated fleet of 18 closed-body carriers and 45 certified technicians from Friday evening to Sunday midnight.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
                    <div style={{ borderLeft: "3px solid #0045e6", paddingLeft: "12px" }}>
                      <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>48 Hrs</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Execution SLA</div>
                    </div>
                    <div style={{ borderLeft: "3px solid #059669", paddingLeft: "12px" }}>
                      <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>0 Hrs</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Workplace Downtime</div>
                    </div>
                    <div style={{ borderLeft: "3px solid #0045e6", paddingLeft: "12px" }}>
                      <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>100%</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>IT Asset Integrity</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const element = document.querySelector(".fixed-form") || document.getElementById("home");
                      if (element) element.scrollIntoView({ behavior: "smooth" });
                    }}
                    style={{
                      background: "#0045e6",
                      color: "#ffffff",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 4px 14px rgba(0, 69, 230, 0.3)",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#0033aa"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#0045e6"}
                  >
                    <span>Request Corporate Moving Consultation</span>
                    <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "12px" }} />
                  </button>
                </div>

              </div>
            </div>
          </section>

          {/* =========================================================
              ENTERPRISE ASSURANCE & OPERATIONAL GOVERNANCE
             ========================================================= */}
          <section className="features-section" style={{ background: "#f8fafc", padding: "80px 24px", color: "#0f172a" }}>
            <div className="container" style={{ maxWidth: "1280px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <span style={{
                  background: "#eff6ff",
                  color: "#0045e6",
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  padding: "5px 14px",
                  borderRadius: "6px",
                  border: "1px solid #bfdbfe",
                  display: "inline-block",
                  marginBottom: "12px"
                }}>
                  Operational Governance
                </span>
                <h2 style={{
                  fontSize: "34px",
                  fontWeight: "800",
                  color: "#0f172a",
                  marginBottom: "12px",
                  letterSpacing: "-0.025em"
                }}>
                  Enterprise Relocation Standards
                </h2>
                <p style={{
                  fontSize: "15.5px",
                  color: "#64748b",
                  maxWidth: "580px",
                  margin: "0 auto",
                  lineHeight: "1.6"
                }}>
                  Trusted by corporations, government facilities, and residential homeowners across India for rigorous compliance and risk mitigation.
                </p>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "24px"
              }}>
                <Feature 
                  number="01"
                  icon={faShieldAlt} 
                  title="Full Transit Risk Mitigation" 
                  desc="Comprehensive, underwritten insurance policies covering transit damage, water protection, and accidental impact up to full invoice valuation." 
                />
                <Feature 
                  number="02"
                  icon={faFileContract} 
                  title="Transparent Commercial Quotations" 
                  desc="Strict fixed-quote agreements with zero surprise fuel surcharges or delivery day escalation. Fully itemized commercial invoicing with GST." 
                />
                <Feature 
                  number="03"
                  icon={faUsers} 
                  title="Bonded & Verified Specialists" 
                  desc="All handling personnel undergo mandatory background checks, specialized safety training, and protective gear certification." 
                />
                <Feature 
                  number="04"
                  icon={faTruck} 
                  title="Nationwide Hub Network" 
                  desc="Direct logistics routes connecting 50+ major metropolitan cities with GPS satellite telemetry and scheduled line-haul departures." 
                />
                <Feature 
                  number="05"
                  icon={faClock} 
                  title="Strict Delivery SLA Compliance" 
                  desc="Contractually bound arrival windows with active monitoring, continuous supervisor updates, and verified milestone handovers." 
                />
                <Feature 
                  number="06"
                  icon={faBoxOpen} 
                  title="Multi-Layer Industrial Packaging" 
                  desc="Heavy-duty 5-ply corrugated sheets, anti-static foam wraps, reinforced corner guards, and custom wooden crating for delicate items." 
                />
              </div>

              {/* Official PackYatra In-House Relocation Team Showcase */}
              <div style={{
                marginTop: "44px",
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #cbd5e1",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                alignItems: "center",
                boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.05)"
              }}>
                <div style={{ padding: "36px 32px" }}>
                  <div style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "#0045e6",
                    marginBottom: "8px"
                  }}>
                    PackYatra Verified Moving Team
                  </div>
                  <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "12px", letterSpacing: "-0.02em" }}>
                    Trained, Uniformed & Police-Verified Relocation Crews
                  </h3>
                  <p style={{ fontSize: "14.5px", color: "#475569", lineHeight: "1.65", marginBottom: "24px" }}>
                    Every PackYatra shifting is executed exclusively by our verified in-house crew — zero third-party labor or unvetted contractors. Our team arrives equipped with professional moving straps, heavy-duty floor runners, and shock-absorbent wrapping.
                  </p>
                  <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: "18px", fontWeight: "800", color: "#0045e6" }}>Zero Subcontracting</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>100% In-House PackYatra Crew</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "18px", fontWeight: "800", color: "#059669" }}>100% Police Verified</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Safety & Identity Audited</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "18px", fontWeight: "800", color: "#0045e6" }}>Dedicated Captain</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Single Point Move Manager</div>
                    </div>
                  </div>
                </div>

                <div style={{ height: "100%", minHeight: "280px", position: "relative", overflow: "hidden", borderRadius: "14px" }}>
                  <img 
                    src={packyatraTerminalFleetImg} 
                    alt="Official PackYatra Relocation Logistics Terminal & Fleet Hub" 
                    referrerPolicy="no-referrer"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                  {/* Subtle Contrast Scrim */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(7, 13, 24, 0.4) 0%, rgba(7, 13, 24, 0.85) 100%)",
                    pointerEvents: "none"
                  }} />

                  {/* PackYatra Terminal Brand Overlay */}
                  <div style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    right: "16px",
                    zIndex: 2,
                    background: "rgba(7, 13, 24, 0.88)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <PackYatraLogo height={30} isDark={true} showSubtitle={false} />
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: "#ffffff" }}>
                          PackYatra Logistics Hub & Dispatch Terminal
                        </div>
                        <div style={{ fontSize: "11px", color: "#93c5fd" }}>
                          National Relocation Network · In-House Operations
                        </div>
                      </div>
                    </div>
                    <a 
                      href="tel:+919071535535"
                      style={{
                        fontSize: "12px",
                        fontWeight: "800",
                        color: "#ffffff",
                        background: "rgba(37, 99, 235, 0.4)",
                        border: "1px solid rgba(59, 130, 246, 0.4)",
                        padding: "5px 12px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      📞 +91 90715 35535
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              VERIFIED CLIENT REVIEWS (GOOGLE 4.9 RATING)
             ========================================================= */}
          <section id="reviews" style={{ padding: "80px 24px", background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
            <div className="container" style={{ maxWidth: "1280px", margin: "0 auto" }}>
              
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#0045e6",
                  marginBottom: "8px"
                }}>
                  Client Satisfaction
                </div>
                <h2 style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)",
                  fontWeight: "800",
                  color: "#0f172a",
                  marginBottom: "12px",
                  letterSpacing: "-0.025em"
                }}>
                  Audited Client Reviews · 4.9 Rating on Google
                </h2>
                <p style={{
                  fontSize: "15.5px",
                  color: "#64748b",
                  maxWidth: "600px",
                  margin: "0 auto",
                  lineHeight: "1.6"
                }}>
                  Reflecting our uncompromising commitment to zero damage, transparent pricing, and punctual delivery.
                </p>
              </div>

              {/* Two Column Layout */}
              <div className="reviews-two-col">
                
                {/* Left Column: Rating Box */}
                <div style={{
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "16px",
                  padding: "36px 28px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <svg viewBox="0 0 24 24" width="30" height="30" style={{ display: "block" }}>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>Google Reviews</span>
                  </div>

                  <div style={{ fontSize: "64px", fontWeight: "900", color: "#0f172a", lineHeight: "1", letterSpacing: "-0.03em" }}>
                    4.9
                  </div>
                  
                  <div style={{ display: "flex", gap: "4px", color: "#fbc02d", fontSize: "20px", margin: "14px 0 8px" }}>
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                  </div>

                  <p style={{ fontSize: "13.5px", fontWeight: "700", color: "#334155", marginBottom: "2px" }}>
                    Consistently Rated Excellent
                  </p>
                  <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "28px" }}>
                    Over 1,250+ audited client ratings
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                    <a 
                      href="https://www.google.com/search?q=PackYatra+Packers+and+Movers+Reviews" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{
                        background: "#0045e6",
                        color: "#ffffff",
                        padding: "12px 18px",
                        borderRadius: "8px",
                        fontSize: "13.5px",
                        fontWeight: "700",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#0033aa"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#0045e6"}
                    >
                      Write a Google Review
                    </a>

                    <a 
                      href="https://www.google.com/search?q=PackYatra+Packers+and+Movers+Reviews" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{
                        background: "#ffffff",
                        color: "#334155",
                        border: "1px solid #cbd5e1",
                        padding: "12px 18px",
                        borderRadius: "8px",
                        fontSize: "13.5px",
                        fontWeight: "700",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#ffffff"}
                    >
                      Read All 1,250+ Reviews
                    </a>
                  </div>
                </div>

                {/* Right Column: Review Cards */}
                <div className="reviews-grid-responsive">
                  {[
                    {
                      name: "Vikram Malhotra",
                      role: "Facilities Director, Tech Campus",
                      meta: "Commercial Relocation, Bangalore",
                      date: "Verified Corporate Move",
                      initial: "V",
                      text: "Extremely professional movers. We shifted our entire tech infrastructure over the weekend. They indexed all files perfectly and set up the new office space with zero business downtime."
                    },
                    {
                      name: "Anjali Mehta",
                      role: "Senior Consultant",
                      meta: "Intercity Transit (Mumbai to Pune)",
                      date: "Verified Move",
                      initial: "A",
                      text: "Packyatra made our interstate relocation completely stress-free. The packing crew arrived on time and wrapped every delicate glass item with triple-layer protection. Reached safely ahead of schedule."
                    },
                    {
                      name: "Karan Johar",
                      role: "Managing Director",
                      meta: "Household Relocation, Delhi NCR",
                      date: "Verified Move",
                      initial: "K",
                      text: "Best shifting experience! Their quote was completely transparent. No sudden extra charges on delivery day. The loading staff was incredibly hardworking, punctual, and respectful."
                    },
                    {
                      name: "Sneha Reddy",
                      role: "Operations Lead",
                      meta: "Enclosed Vehicle Transport (Bangalore to Chennai)",
                      date: "Verified Vehicle Move",
                      initial: "S",
                      text: "I was super nervous about transport of my car, but they transported it in an enclosed carrier and provided WhatsApp status checks. Delivered in absolute perfect condition with zero scuffs."
                    }
                  ].map((rev, rIdx) => (
                    <div
                      key={rIdx}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                          <div style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "8px",
                            background: "#eff6ff",
                            color: "#0045e6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: "800"
                          }}>
                            {rev.initial}
                          </div>
                          <div>
                            <div style={{ fontSize: "14.5px", fontWeight: "700", color: "#0f172a" }}>{rev.name}</div>
                            <div style={{ fontSize: "11.5px", color: "#64748b" }}>{rev.role} · {rev.meta}</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                          <div style={{ display: "flex", gap: "2px", color: "#fbc02d", fontSize: "12px" }}>
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                          </div>
                          <span style={{ fontSize: "11px", color: "#94a3b8" }}>· {rev.date}</span>
                        </div>

                        <p style={{ fontSize: "13.5px", color: "#334155", lineHeight: "1.6", margin: 0 }}>
                          "{rev.text}"
                        </p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "16px", fontSize: "11.5px", color: "#16a34a", fontWeight: "600" }}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Verified Google Customer
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </section>

          {/* =========================================================
              INTERACTIVE RELOCATION COST ESTIMATOR
             ========================================================= */}
          <section id="estimator" style={{ padding: "80px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
            <div className="container" style={{ maxWidth: "1280px", margin: "0 auto" }}>
              
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#0045e6",
                  marginBottom: "8px"
                }}>
                  Financial Planning & Estimator
                </div>
                <h2 style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)",
                  fontWeight: "800",
                  color: "#0f172a",
                  marginBottom: "12px",
                  letterSpacing: "-0.025em"
                }}>
                  Live Relocation Cost Calculator
                </h2>
                <p style={{
                  fontSize: "15.5px",
                  color: "#64748b",
                  maxWidth: "600px",
                  margin: "0 auto",
                  lineHeight: "1.6"
                }}>
                  Accurate, itemized quotation generator. Adjust property size, distance, floor access, and packing grade to evaluate real-time costs.
                </p>
              </div>

              {/* Two Column Estimator */}
              <div className="reviews-two-col">
                
                {/* Left: Configuration Controls */}
                <div style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "16px",
                  padding: "32px",
                  boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.04)"
                }}>
                  <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "22px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FontAwesomeIcon icon={faCalculator} style={{ color: "#0045e6" }} />
                    Configure Relocation Parameters
                  </h3>

                  {/* 1. BHK / Volume */}
                  <div style={{ marginBottom: "22px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "#475569", marginBottom: "8px" }}>
                      Volume / Configuration
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                      {["1 BHK", "2 BHK", "3 BHK", "4 BHK / Villa"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setEstBhkSize(size)}
                          style={{
                            padding: "9px 4px",
                            borderRadius: "8px",
                            border: estBhkSize === size ? "2px solid #0045e6" : "1px solid #cbd5e1",
                            background: estBhkSize === size ? "#eff6ff" : "#ffffff",
                            color: estBhkSize === size ? "#0045e6" : "#334155",
                            fontSize: "12.5px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.15s"
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Distance */}
                  <div style={{ marginBottom: "22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "#475569" }}>
                        Transit Distance
                      </label>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#0045e6" }}>
                        {estDistance} km
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="500"
                      step="5"
                      value={estDistance}
                      onChange={(e) => setEstDistance(Number(e.target.value))}
                      style={{
                        width: "100%",
                        height: "6px",
                        borderRadius: "3px",
                        accentColor: "#0045e6",
                        background: "#e2e8f0",
                        cursor: "pointer"
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                      <span>Metropolitan (5 km)</span>
                      <span>150 km</span>
                      <span>300 km</span>
                      <span>Inter-State (500 km+)</span>
                    </div>
                  </div>

                  {/* 3. Floor Level */}
                  <div style={{ marginBottom: "22px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "#475569", marginBottom: "8px" }}>
                      Floor Level (Origin / Destination)
                    </label>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {[0, 1, 2, 3, 4, 5, 6].map((fl) => (
                        <button
                          key={fl}
                          onClick={() => setEstFloor(fl)}
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "8px",
                            border: estFloor === fl ? "2px solid #0045e6" : "1px solid #cbd5e1",
                            background: estFloor === fl ? "#eff6ff" : "#ffffff",
                            color: estFloor === fl ? "#0045e6" : "#334155",
                            fontSize: "13px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.15s"
                          }}
                        >
                          {fl === 0 ? "G" : fl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Service Lift Toggle */}
                  {estFloor > 0 && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      marginBottom: "22px"
                    }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>Service Lift Available</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>Reduces manual staircase labor surcharge</div>
                      </div>
                      <button
                        onClick={() => setEstHasLift(!estHasLift)}
                        style={{
                          width: "44px",
                          height: "24px",
                          borderRadius: "12px",
                          background: estHasLift ? "#059669" : "#cbd5e1",
                          border: "none",
                          position: "relative",
                          cursor: "pointer",
                          transition: "background-color 0.2s"
                        }}
                      >
                        <span style={{
                          position: "absolute",
                          top: "2px",
                          left: estHasLift ? "22px" : "2px",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "#ffffff",
                          transition: "left 0.2s"
                        }} />
                      </button>
                    </div>
                  )}

                  {/* 5. Packaging Quality */}
                  <div style={{ marginBottom: "22px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "#475569", marginBottom: "8px" }}>
                      Industrial Packaging Grade
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                      {[
                        { name: "Economy", desc: "Basic carton pack" },
                        { name: "Standard", desc: "Corrugated layers" },
                        { name: "Premium", desc: "Triple bubble wrap" }
                      ].map((type) => (
                        <button
                          key={type.name}
                          onClick={() => setEstPackingType(type.name)}
                          style={{
                            padding: "10px 6px",
                            borderRadius: "8px",
                            border: estPackingType === type.name ? "2px solid #0045e6" : "1px solid #cbd5e1",
                            background: estPackingType === type.name ? "#eff6ff" : "#ffffff",
                            color: estPackingType === type.name ? "#0045e6" : "#334155",
                            cursor: "pointer",
                            transition: "all 0.15s",
                            textAlign: "center"
                          }}
                        >
                          <div style={{ fontSize: "12.5px", fontWeight: "700" }}>{type.name}</div>
                          <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 6. Transit Insurance Policy */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: estIncludeInsurance ? "#f0fdf4" : "#f8fafc",
                    borderRadius: "10px",
                    border: estIncludeInsurance ? "1px solid #bbf7d0" : "1px solid #e2e8f0"
                  }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FontAwesomeIcon icon={faShieldAlt} style={{ color: "#059669" }} />
                        Transit Risk & Damage Indemnity Policy
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Flat coverage premium covers goods up to ₹50,000</div>
                    </div>
                    <button
                      onClick={() => setEstIncludeInsurance(!estIncludeInsurance)}
                      style={{
                        width: "44px",
                        height: "24px",
                        borderRadius: "12px",
                        background: estIncludeInsurance ? "#059669" : "#cbd5e1",
                        border: "none",
                        position: "relative",
                        cursor: "pointer",
                        transition: "background-color 0.2s"
                      }}
                    >
                      <span style={{
                        position: "absolute",
                        top: "2px",
                        left: estIncludeInsurance ? "22px" : "2px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#ffffff",
                        transition: "left 0.2s"
                      }} />
                    </button>
                  </div>

                </div>

                {/* Right: Itemized Quotation Slip */}
                <div style={{
                  background: "#090e1a",
                  borderRadius: "16px",
                  padding: "36px 30px",
                  color: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: "1px solid #1e293b",
                  boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)"
                }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", background: "rgba(255,255,255,0.08)", padding: "4px 10px", borderRadius: "6px", color: "#94a3b8" }}>
                        Commercial Quotation Slip
                      </span>
                      <span style={{ fontSize: "11.5px", color: "#38bdf8", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FontAwesomeIcon icon={faLock} /> Verified SLA Rates
                      </span>
                    </div>

                    <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
                      Itemized Relocation Breakdown for {estBhkSize}:
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderBottom: "1px dashed rgba(255,255,255,0.15)", paddingBottom: "20px", marginBottom: "20px" }}>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
                        <span style={{ color: "#94a3b8" }}>Fleet Base + Distance ({estDistance} km):</span>
                        <span style={{ fontWeight: "700", fontFamily: "monospace" }}>₹{estBreakdown.transport.toLocaleString()}</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
                        <span style={{ color: "#94a3b8" }}>Packaging & Labor ({estPackingType}):</span>
                        <span style={{ fontWeight: "700", fontFamily: "monospace" }}>₹{estBreakdown.packing.toLocaleString()}</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
                        <span style={{ color: "#94a3b8" }}>Floor Handling (Floor {estFloor}{estFloor > 0 && (estHasLift ? " w/ lift" : " stairs")}):</span>
                        <span style={{ fontWeight: "700", fontFamily: "monospace" }}>₹{estBreakdown.floorSurcharge.toLocaleString()}</span>
                      </div>

                      {estIncludeInsurance && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
                          <span style={{ color: "#94a3b8" }}>Transit Risk Indemnity (₹50k coverage):</span>
                          <span style={{ fontWeight: "700", fontFamily: "monospace" }}>₹{estBreakdown.insurance.toLocaleString()}</span>
                        </div>
                      )}

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
                        <span style={{ color: "#94a3b8" }}>Integrated GST Surcharge (18%):</span>
                        <span style={{ fontWeight: "700", fontFamily: "monospace" }}>₹{estBreakdown.gst.toLocaleString()}</span>
                      </div>

                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "700", color: "#94a3b8" }}>Estimated Total:</span>
                      <div style={{ fontSize: "32px", fontWeight: "900", color: "#38bdf8", fontFamily: "monospace" }}>
                        ₹{estBreakdown.total.toLocaleString()}*
                      </div>
                    </div>
                    <div style={{ fontSize: "10.5px", color: "#64748b", fontStyle: "italic", textAlign: "right" }}>
                      *Excludes state border tolls or commercial crane charges if required.
                    </div>
                  </div>

                  {/* Primary Action Button in #0045e6 */}
                  <div style={{ marginTop: "32px" }}>
                    <button
                      onClick={() => {
                        const heroElement = document.getElementById("home") || document.querySelector(".fixed-form");
                        if (heroElement) heroElement.scrollIntoView({ behavior: "smooth" });
                      }}
                      style={{
                        width: "100%",
                        background: "#0045e6",
                        color: "#ffffff",
                        padding: "14px 20px",
                        borderRadius: "8px",
                        fontSize: "14.5px",
                        fontWeight: "700",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: "0 4px 16px rgba(0, 69, 230, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#0033aa"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#0045e6"}
                    >
                      <FontAwesomeIcon icon={faTruckMoving} />
                      Proceed to Lock Special Price
                    </button>
                    <p style={{ textAlign: "center", fontSize: "11px", color: "#64748b", marginTop: "10px" }}>
                      Locks rate for 14 days with zero upfront commitment. Full cancellation support.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* =========================================================
              INTERACTIVE PERSONAL & CORPORATE MOVING CHECKLIST PLANNER
             ========================================================= */}
          <section id="planner" style={{ padding: "80px 24px", background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
            <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
              
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#0045e6",
                  marginBottom: "8px"
                }}>
                  Project Management & Milestones
                </div>
                <h2 style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)",
                  fontWeight: "800",
                  color: "#0f172a",
                  marginBottom: "12px",
                  letterSpacing: "-0.025em"
                }}>
                  Relocation Milestone & Project Tracker
                </h2>
                <p style={{
                  fontSize: "15.5px",
                  color: "#64748b",
                  maxWidth: "600px",
                  margin: "0 auto",
                  lineHeight: "1.6"
                }}>
                  Keep all stakeholders aligned. Track preparation tasks by phase, add custom milestones, and preserve progress live in your browser.
                </p>
              </div>

              {/* Progress Panel */}
              {(() => {
                const totalTasks = checklistTasks.length;
                const completedTasks = checklistTasks.filter(t => t.checked).length;
                const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                
                return (
                  <div style={{
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: "14px",
                    padding: "20px 24px",
                    marginBottom: "28px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap"
                  }}>
                    <div style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "10px",
                      background: percent === 100 ? "#059669" : "#0045e6",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "17px",
                      fontWeight: "900",
                      fontFamily: "monospace"
                    }}>
                      {percent}%
                    </div>
                    <div style={{ flex: 1, minWidth: "240px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13.5px", fontWeight: "700", color: "#334155" }}>
                        <span>Relocation Preparation Progress</span>
                        <span>{completedTasks} of {totalTasks} Tasks Completed</span>
                      </div>
                      <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ width: `${percent}%`, height: "100%", background: percent === 100 ? "#059669" : "#0045e6", borderRadius: "4px", transition: "width 0.3s" }} />
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={handleResetChecklist}
                        style={{
                          background: "transparent",
                          color: "#dc2626",
                          border: "1px solid #fca5a5",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "12.5px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <FontAwesomeIcon icon={faUndo} /> Reset Milestone List
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Checklist Board Layout */}
              <div style={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "16px",
                boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.04)",
                overflow: "hidden"
              }}>
                
                {/* Timeline Tab Buttons */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  borderBottom: "1px solid #e2e8f0",
                  background: "#f8fafc"
                }}>
                  {["4 Weeks Before", "2 Weeks Before", "Moving Week", "Moving Day"].map((cat) => {
                    const isActive = activeChecklistTab === cat;
                    const catCount = checklistTasks.filter(t => t.category === cat).length;
                    const checkedCount = checklistTasks.filter(t => t.category === cat && t.checked).length;

                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveChecklistTab(cat)}
                        style={{
                          padding: "16px 8px",
                          border: "none",
                          borderBottom: isActive ? "3px solid #0045e6" : "3px solid transparent",
                          background: isActive ? "#ffffff" : "transparent",
                          color: isActive ? "#0045e6" : "#64748b",
                          fontSize: "13px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <span>{cat}</span>
                        <span style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          background: isActive ? "#eff6ff" : "#e2e8f0",
                          color: isActive ? "#0045e6" : "#475569",
                          padding: "1px 8px",
                          borderRadius: "4px",
                          fontFamily: "monospace"
                        }}>
                          {checkedCount}/{catCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Tasks List */}
                <div style={{ padding: "28px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", minHeight: "200px", marginBottom: "20px" }}>
                    {checklistTasks.filter(t => t.category === activeChecklistTab).length === 0 ? (
                      <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
                        <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: "28px", marginBottom: "10px", opacity: 0.5 }} />
                        <p style={{ fontSize: "13.5px", margin: 0 }}>No items in this milestone phase yet. Add a custom task below.</p>
                      </div>
                    ) : (
                      checklistTasks.filter(t => t.category === activeChecklistTab).map((task) => (
                        <div
                          key={task.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            background: task.checked ? "#f8fafc" : "#ffffff",
                            border: task.checked ? "1px solid #e2e8f0" : "1px solid #cbd5e1",
                            borderRadius: "10px",
                            transition: "all 0.15s"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                            <button
                              onClick={() => handleToggleChecklistTask(task.id)}
                              style={{
                                width: "22px",
                                height: "22px",
                                borderRadius: "6px",
                                border: task.checked ? "none" : "2px solid #cbd5e1",
                                background: task.checked ? "#0045e6" : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                cursor: "pointer",
                                fontSize: "10px",
                                transition: "all 0.15s"
                              }}
                            >
                              {task.checked && <FontAwesomeIcon icon={faCheck} />}
                            </button>

                            <span style={{
                              fontSize: "14px",
                              color: task.checked ? "#94a3b8" : "#1e293b",
                              fontWeight: "500",
                              textDecoration: task.checked ? "line-through" : "none"
                            }}>
                              {task.text}
                            </span>
                          </div>

                          {task.id.startsWith("custom-") && (
                            <button
                              onClick={() => handleRemoveChecklistTask(task.id)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#cbd5e1",
                                cursor: "pointer",
                                padding: "4px"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = "#dc2626"}
                              onMouseLeave={(e) => e.currentTarget.style.color = "#cbd5e1"}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Custom Chore Form - Button in #0045e6 */}
                  <form onSubmit={handleAddChecklistTask} style={{
                    display: "flex",
                    gap: "10px",
                    background: "#f8fafc",
                    border: "1px dashed #cbd5e1",
                    borderRadius: "12px",
                    padding: "14px"
                  }}>
                    <input
                      type="text"
                      placeholder={`Add custom milestone for "${activeChecklistTab}"...`}
                      value={newChecklistText}
                      onChange={(e) => setNewChecklistText(e.target.value)}
                      style={{
                        flex: 1,
                        border: "1px solid #cbd5e1",
                        background: "#ffffff",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        fontSize: "13.5px",
                        color: "#1e293b",
                        outline: "none"
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: "#0045e6",
                        color: "#ffffff",
                        border: "none",
                        padding: "0 20px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "background-color 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#0033aa"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#0045e6"}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add Milestone
                    </button>
                  </form>

                </div>

              </div>

            </div>
          </section>



        </div>
      </div>
    </div>
  );
};

// =========================================================
// SERVICE CARD COMPONENT (Executive styling with #0045e6 CTA)
// =========================================================
const ServiceCard = ({ icon, title, desc, features, badge, accentColor, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "28px 24px",
        boxShadow: isHovered 
          ? "0 14px 28px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(0, 69, 230, 0.4)" 
          : "0 2px 4px rgba(15, 23, 42, 0.04)",
        border: isHovered ? "1px solid #0045e6" : "1px solid #cbd5e1",
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        boxSizing: "border-box"
      }}
    >
      <div>
        {/* Top Icon & Badge Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "10px",
            background: "#eff6ff",
            color: "#0045e6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            border: "1px solid #bfdbfe"
          }}>
            <FontAwesomeIcon icon={icon} />
          </div>

          {badge && (
            <span style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#0045e6",
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              padding: "4px 10px",
              borderRadius: "4px"
            }}>
              {badge}
            </span>
          )}
        </div>

        {/* Title and Description */}
        <h3 style={{
          fontSize: "18px",
          fontWeight: "800",
          color: "#0f172a",
          marginBottom: "8px",
          letterSpacing: "-0.015em"
        }}>
          {title}
        </h3>
        
        <p style={{
          fontSize: "13.5px",
          color: "#475569",
          lineHeight: "1.6",
          marginBottom: "18px",
          minHeight: "42px"
        }}>
          {desc}
        </p>

        <div style={{ height: "1px", backgroundColor: "#f1f5f9", margin: "14px 0", width: "100%" }} />

        {/* Features Checklist */}
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", display: "flex", flexDirection: "column", gap: "9px" }}>
          {features.map((f, i) => (
            <li
              key={i}
              style={{
                fontSize: "13px",
                color: "#334155",
                display: "flex",
                alignItems: "flex-start",
                gap: "9px",
                fontWeight: "500",
                lineHeight: "1.4"
              }}
            >
              <div style={{
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "2px"
              }}>
                <FontAwesomeIcon icon={faCheck} style={{ color: "#16a34a", fontSize: "9px" }} />
              </div>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Corporate Action Button in #0045e6 */}
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          style={{
            width: "100%",
            padding: "11px 16px",
            borderRadius: "8px",
            background: "#0045e6",
            color: "#ffffff",
            border: "none",
            fontSize: "13.5px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(0, 69, 230, 0.25)",
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#0033aa"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#0045e6"}
        >
          <span>Calculate Shifting Cost</span>
          <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "11px" }} />
        </button>
      </div>
    </div>
  );
};

// =========================================================
// FEATURE CARD COMPONENT (Operational Governance)
// =========================================================
const Feature = ({ number, icon, title, desc }) => (
  <div style={{
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "14px",
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  }}>
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{
          width: "44px",
          height: "44px",
          borderRadius: "10px",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#0045e6",
          fontSize: "18px"
        }}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <span style={{ fontSize: "16px", fontWeight: "900", color: "#cbd5e1", fontFamily: "monospace" }}>
          {number}
        </span>
      </div>

      <h3 style={{
        fontSize: "16.5px",
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: "8px",
        letterSpacing: "-0.015em"
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: "13.5px",
        color: "#475569",
        lineHeight: "1.6",
        margin: 0
      }}>
        {desc}
      </p>
    </div>
  </div>
);

export default HomeSelection;
