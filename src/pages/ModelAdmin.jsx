import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Modal.css";
import OtpLoginAdmin from "../components/OtpLoginAdmin.jsx";
import { isOtpValid } from "../utils/auth.js";

const moviingTeam = "/Images/moving-team.webp";

const ModalAdmin = ({ isOpen, closeModal, distance, activeTab, shiftingDate, fromAddress, toAddress, selectedCity }) => {
  const navigate = useNavigate();

  const continueBooking = () => {
    closeModal();
    const storedShiftingType = localStorage.getItem("shiftingType") || activeTab;
    const isSameApartment = activeTab === "same_apartment" || storedShiftingType === "same_apartment";
    const pickupFlat = isSameApartment ? (localStorage.getItem("pickupFlat") || "") : "";
    const dropFlat = isSameApartment ? (localStorage.getItem("dropFlat") || "") : "";
    navigate(`/booking?distance=${distance}&activeTab=${activeTab}`, {
      state: {
        distance,
        activeTab,
        shiftingDate,
        fromAddress,
        toAddress,
        selectedCity,
        shiftingType: isSameApartment ? "same_apartment" : activeTab,
        pickupFlat,
        dropFlat
      }
    });
  };

  useEffect(() => {
    if (isOpen && isOtpValid()) {
      continueBooking();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Already logged in (within 30 minutes)
  if (isOtpValid()) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <button className="modal-close-btn" onClick={closeModal}>×</button>
        <div className="modal-image">
          <img src={moviingTeam} alt="Delivery" />
        </div>
        <div className="modal-content">
          <OtpLoginAdmin 
            onSuccess={continueBooking}
            userData={{
              address: { fromAddress, toAddress }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalAdmin;