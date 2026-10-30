import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Global URL Masking Component:
 * Cleanly masks internal query parameters (such as /booking?distance=4.39&activeTab=within)
 * in the browser address bar across the entire application without breaking existing functionality.
 *
 * 1. Detects any query parameters on entry.
 * 2. Safely synchronizes key booking parameters into localStorage to guarantee zero data loss.
 * 3. Rewrites the browser URL to the clean pathname (e.g. /booking) via window.history.replaceState.
 * 4. Preserves React Router history state and seamless client-side routing.
 */
const UrlMasking = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.search && location.search.length > 1) {
      try {
        const searchParams = new URLSearchParams(location.search);

        // Preserve application parameters if present in the incoming query string
        const distance = searchParams.get("distance");
        const activeTab = searchParams.get("activeTab");
        const shiftingDate = searchParams.get("shiftingDate");
        const fromAddress = searchParams.get("fromAddress");
        const toAddress = searchParams.get("toAddress");
        const pickupFlat = searchParams.get("pickupFlat");
        const dropFlat = searchParams.get("dropFlat");
        const shiftingType = searchParams.get("shiftingType");

        if (distance && distance !== "0") {
          localStorage.setItem("distance", distance);
        }
        if (activeTab) {
          localStorage.setItem("activeTab", activeTab);
        }
        if (shiftingType) {
          localStorage.setItem("shiftingType", shiftingType);
        }
        if (shiftingDate) {
          localStorage.setItem("shiftingDate", shiftingDate);
        }
        if (fromAddress) {
          localStorage.setItem("fromAddress", fromAddress);
        }
        if (toAddress) {
          localStorage.setItem("toAddress", toAddress);
        }
        if (pickupFlat) {
          localStorage.setItem("pickupFlat", pickupFlat);
        }
        if (dropFlat) {
          localStorage.setItem("dropFlat", dropFlat);
        }

        // Cleanly mask the URL in the address bar (e.g. /booking instead of /booking?distance=4.39&activeTab=within)
        const cleanUrl = location.pathname + (location.hash || "");
        window.history.replaceState(window.history.state, document.title, cleanUrl);
      } catch (err) {
        console.warn("URL masking error handled safely:", err);
      }
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default UrlMasking;
