import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMapMarkerAlt, 
  faLocationArrow, 
  faCalendarAlt, 
  faChevronRight, 
  faShieldAlt, 
  faCheckCircle,
  faInfoCircle,
  faBuilding,
  faCity
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Cityddl.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const bangloreImg = "/Images/Banglore.png";

const cities = [
  { name: "Bangalore", img: bangloreImg },
];

const FixedMovingForm = ({
  activeTab,
  setActiveTab,
  fromAddress,
  setFromAddress,
  toAddress,
  setToAddress,
  shiftingDate,
  setShiftingDate,
  selectedCity,
  setSelectedCity,
  error,
  setError,
  shiftFromSuggestion,
  setShiftFromSuggestion,
  shiftingToSuggestion,
  setShiftingToSuggestion,
  fetchAddressSuggestions,
  handleCheckPrices,
  fromCoords,
  setFromCoords,
  toCoords,
  setToCoords,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);
  
  useEffect(() => {
    setToAddress("");
    setShiftingToSuggestion([]);
    setError(""); // Clear error when tab changes
  }, [activeTab]);

  return (
    <aside className="right-section fixed-form">
      <div className="form-container-corporate" style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "26px 24px",
        boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)",
        border: "1px solid #cbd5e1",
        maxWidth: "380px",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        {/* Corporate Trust Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f1f5f9",
          paddingBottom: "12px",
          marginBottom: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#0045e6",
              display: "inline-block"
            }} />
            <span style={{
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              color: "#334155"
            }}>
              Commercial & Domestic Portal
            </span>
          </div>
          <span style={{
            fontSize: "11px",
            color: "#059669",
            fontWeight: "600",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px"
          }}>
            <FontAwesomeIcon icon={faShieldAlt} style={{ fontSize: "11px" }} /> SLA Insured
          </span>
        </div>

        <h2 style={{
          fontSize: "18px",
          fontWeight: "800",
          color: "#0f172a",
          marginBottom: "4px",
          lineHeight: "1.3",
          letterSpacing: "-0.015em"
        }}>
          Calculate Shifting Quote
        </h2>
        
        <p style={{
          fontSize: "12.5px",
          color: "#64748b",
          marginBottom: "18px",
          lineHeight: "1.4"
        }}>
          Live pricing & verified crew allocation across India.
        </p>
        
        {/* Segmented Corporate Tabs */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: "#f1f5f9",
          padding: "4px",
          borderRadius: "10px",
          marginBottom: "18px",
          border: "1px solid #e2e8f0"
        }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab("within");
              setFromAddress("");
              setToAddress("");
              setFromCoords(null);
              setToCoords(null);
              setShiftFromSuggestion([]);
              setShiftingToSuggestion([]);
              setError("");
            }}
            style={{
              border: "none",
              padding: "9px 12px",
              borderRadius: "8px",
              fontSize: "12.5px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: activeTab === "within" ? "#0045e6" : "transparent",
              color: activeTab === "within" ? "#ffffff" : "#475569",
              boxShadow: activeTab === "within" ? "0 2px 8px rgba(0, 69, 230, 0.25)" : "none"
            }}
          >
            Intra-City Shifting
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("between");
              setFromAddress("");
              setToAddress("");
              setFromCoords(null);
              setToCoords(null);
              setShiftFromSuggestion([]);
              setShiftingToSuggestion([]);
              setError("");
            }}
            style={{
              border: "none",
              padding: "9px 12px",
              borderRadius: "8px",
              fontSize: "12.5px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: activeTab === "between" ? "#0045e6" : "transparent",
              color: activeTab === "between" ? "#ffffff" : "#475569",
              boxShadow: activeTab === "between" ? "0 2px 8px rgba(0, 69, 230, 0.25)" : "none"
            }}
          >
            Inter-City Transit
          </button>
        </div>

        {/* City Selector (Intra-city) */}
        {activeTab === "within" && (
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              fontSize: "11px",
              fontWeight: "700",
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              marginBottom: "5px"
            }}>
              Operational City
            </label>
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: "10px",
                border: dropdownOpen ? "1.5px solid #0045e6" : "1.5px solid #cbd5e1",
                background: "#f8fafc",
                cursor: "pointer",
                boxShadow: dropdownOpen ? "0 0 0 3px rgba(0, 69, 230, 0.12)" : "none",
                transition: "all 0.15s ease"
              }}
            >
              {selectedCity ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={cities.find(c => c.name === selectedCity)?.img} alt={selectedCity} style={{ width: "22px", height: "22px" }} />
                  <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#0f172a" }}>{selectedCity}</span>
                </div>
              ) : (
                <span style={{ fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FontAwesomeIcon icon={faCity} style={{ color: "#94a3b8" }} /> Select primary city hub
                </span>
              )}
              <span style={{ fontSize: "10px", color: "#64748b" }}>{dropdownOpen ? "▲" : "▼"}</span>
            </div>

            {dropdownOpen && (
              <div style={{
                marginTop: "6px",
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "6px",
                background: "#ffffff",
                padding: "6px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                boxShadow: "0 10px 20px -5px rgba(0,0,0,0.1)"
              }}>
                {cities.map(city => (
                  <div
                    key={city.name}
                    onClick={() => {
                      setSelectedCity(city.name);
                      setDropdownOpen(false);
                      setError("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: selectedCity === city.name ? "#eff6ff" : "transparent",
                      border: selectedCity === city.name ? "1px solid #bfdbfe" : "1px solid transparent",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <img src={city.img} alt={city.name} style={{ width: "24px", height: "24px" }} />
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>{city.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#fef2f2",
            border: "1px solid #fee2e2",
            borderRadius: "8px",
            padding: "8px 12px",
            marginBottom: "14px"
          }}>
            <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#ef4444", fontSize: "12px" }} />
            <span style={{ color: "#b91c1c", fontSize: "12px", fontWeight: "600" }}>{error}</span>
          </div>
        )}

        {/* Shifting From Input */}
        <div style={{ marginBottom: "14px", position: "relative" }}>
          <label style={{
            display: "block",
            fontSize: "11px",
            fontWeight: "700",
            color: "#475569",
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            marginBottom: "5px"
          }}>
            Origin Location (Pickup)
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#0045e6",
              fontSize: "13px",
              zIndex: 1
            }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </span>
            <input
              type="text"
              placeholder="e.g. Indiranagar, Bengaluru or Street Name"
              value={fromAddress}
              onFocus={() => setFromFocused(true)}
              onBlur={() => setTimeout(() => setFromFocused(false), 200)}
              onChange={(e) => {
                const val = e.target.value;
                setFromAddress(val);
                setFromCoords(null);
                setError("");
                fetchAddressSuggestions(val, setShiftFromSuggestion, selectedCity);
              }}
              style={{
                width: "100%",
                padding: "10px 12px 10px 34px",
                borderRadius: "10px",
                border: fromFocused ? "1.5px solid #0045e6" : "1.5px solid #cbd5e1",
                fontSize: "13px",
                fontWeight: "500",
                color: "#0f172a",
                outline: "none",
                boxSizing: "border-box",
                transition: "all 0.15s ease",
                background: "#ffffff",
                boxShadow: fromFocused ? "0 0 0 3px rgba(0, 69, 230, 0.12)" : "none"
              }}
            />
          </div>
          {shiftFromSuggestion.length > 0 && (
            <div className="suggestions" style={{
              position: "absolute",
              width: "100%",
              background: "#ffffff",
              borderRadius: "10px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)",
              border: "1px solid #cbd5e1",
              marginTop: "4px",
              zIndex: 9999,
              maxHeight: "190px",
              overflowY: "auto"
            }}>
              {shiftFromSuggestion.map((p, i) => (
                <div
                  key={i}
                  className="suggestion-item"
                  onClick={() => {
                    setFromAddress(p.properties?.formatted || "");
                    setFromCoords({ lat: p.properties?.lat, lon: p.properties?.lon });
                    setShiftFromSuggestion([]);
                    setError("");
                  }}
                  style={{
                    padding: "9px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12.5px",
                    color: "#334155",
                    cursor: "pointer",
                    borderBottom: i < shiftFromSuggestion.length - 1 ? "1px solid #f1f5f9" : "none",
                    transition: "background 0.15s ease"
                  }}
                >
                  <FontAwesomeIcon icon={faLocationArrow} style={{ color: "#0045e6", fontSize: "11px" }} />
                  <span style={{ fontWeight: "500" }}>{p.properties?.formatted}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shifting To Input */}
        <div style={{ marginBottom: "14px", position: "relative" }}>
          <label style={{
            display: "block",
            fontSize: "11px",
            fontWeight: "700",
            color: "#475569",
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            marginBottom: "5px"
          }}>
            Destination Location (Delivery)
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#059669",
              fontSize: "13px",
              zIndex: 1
            }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </span>
            <input
              type="text"
              placeholder="e.g. Whitefield, Bengaluru or Destination City"
              value={toAddress}
              onFocus={() => setToFocused(true)}
              onBlur={() => setTimeout(() => setToFocused(false), 200)}
              onChange={(e) => {
                const val = e.target.value;
                setToAddress(val);
                setToCoords(null);
                setError("");
                fetchAddressSuggestions(val, setShiftingToSuggestion, selectedCity);
              }}
              style={{
                width: "100%",
                padding: "10px 12px 10px 34px",
                borderRadius: "10px",
                border: toFocused ? "1.5px solid #0045e6" : "1.5px solid #cbd5e1",
                fontSize: "13px",
                fontWeight: "500",
                color: "#0f172a",
                outline: "none",
                boxSizing: "border-box",
                transition: "all 0.15s ease",
                background: "#ffffff",
                boxShadow: toFocused ? "0 0 0 3px rgba(0, 69, 230, 0.12)" : "none"
              }}
            />
          </div>
          {shiftingToSuggestion.length > 0 && (
            <div className="suggestions" style={{
              position: "absolute",
              width: "100%",
              background: "#ffffff",
              borderRadius: "10px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)",
              border: "1px solid #cbd5e1",
              marginTop: "4px",
              zIndex: 9999,
              maxHeight: "190px",
              overflowY: "auto"
            }}>
              {shiftingToSuggestion.map((p, i) => (
                <div
                  key={i}
                  className="suggestion-item"
                  onClick={() => {
                    setToAddress(p.properties?.formatted || "");
                    setToCoords({ lat: p.properties?.lat, lon: p.properties?.lon });
                    setShiftingToSuggestion([]);
                    setError("");
                  }}
                  style={{
                    padding: "9px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12.5px",
                    color: "#334155",
                    cursor: "pointer",
                    borderBottom: i < shiftingToSuggestion.length - 1 ? "1px solid #f1f5f9" : "none",
                    transition: "background 0.15s ease"
                  }}
                >
                  <FontAwesomeIcon icon={faLocationArrow} style={{ color: "#0045e6", fontSize: "11px" }} />
                  <span style={{ fontWeight: "500" }}>{p.properties?.formatted}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shifting Date Input */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "11px",
            fontWeight: "700",
            color: "#475569",
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            marginBottom: "5px"
          }}>
            Scheduled Move Date
          </label>
          <div style={{ position: "relative" }} className="date-input-wrapper-corporate">
            <span style={{
              position: "absolute",
              left: "13px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
              fontSize: "13px",
              zIndex: 2,
              pointerEvents: "none"
            }}>
              <FontAwesomeIcon icon={faCalendarAlt} />
            </span>
            <DatePicker
              selected={shiftingDate}
              onChange={(date) => setShiftingDate(date)}
              dateFormat="dd-MM-yyyy"
              placeholderText="Select date (DD-MM-YYYY)"
              className="date-input"
              showIcon={false}
              minDate={new Date()}
            />
          </div>
        </div>

        {/* Corporate Primary Action Button in #0045e6 */}
        <button 
          type="button"
          className="submit-btn" 
          onClick={handleCheckPrices}
          style={{
            width: "100%",
            background: "#0045e6",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "13px 18px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 6px 16px rgba(0, 69, 230, 0.35)",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            letterSpacing: "0.2px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0033aa";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 69, 230, 0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0045e6";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 69, 230, 0.35)";
          }}
        >
          <span>Check Prices & Availability</span>
          <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: "11px" }} />
        </button>

        {/* Corporate Assurance Footnote */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "16px",
          paddingTop: "12px",
          borderTop: "1px solid #f1f5f9"
        }}>
          <span style={{ fontSize: "11px", color: "#64748b", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: "600" }}>
            <FontAwesomeIcon icon={faCheckCircle} style={{ color: "#0045e6" }} /> 100% Transparent Price
          </span>
          <span style={{ fontSize: "11px", color: "#64748b", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: "600" }}>
            <FontAwesomeIcon icon={faShieldAlt} style={{ color: "#059669" }} /> Zero Hidden Charges
          </span>
        </div>
      </div>
    </aside>
  );
};

export default FixedMovingForm;
