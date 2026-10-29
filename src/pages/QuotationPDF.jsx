import { generateBookingConfirmationPDF } from './generateQuotationPDF';

const generateQuotationPDF = async (bookingData = {}, userData = {}, addressData = {}) => {
  const mergedData = {
    ...bookingData,
    customerName: userData?.name || bookingData.customerName || "Customer",
    customerEmail: userData?.email || bookingData.customerEmail || "",
    customerPhone: userData?.mobile || userData?.phone || bookingData.customerPhone || "",
    fromAddress: addressData?.fromAddress || addressData?.pickupAddress || bookingData.fromAddress || "",
    toAddress: addressData?.toAddress || addressData?.dropAddress || bookingData.toAddress || "",
    selectedFloor: bookingData.selectedFloor ?? bookingData.pickupFloor ?? addressData?.pickupFloor ?? addressData?.selectedFloor,
    floordrop: bookingData.floordrop ?? bookingData.dropFloor ?? addressData?.dropFloor ?? addressData?.floordrop,
    serviceLift: bookingData.serviceLift ?? addressData?.serviceLift,
    serviceLiftdrop: bookingData.serviceLiftdrop ?? addressData?.serviceLiftdrop,
    pickupFlat: bookingData.pickupFlat || addressData?.pickupFlat || addressData?.pickupUnit || (typeof localStorage !== "undefined" ? localStorage.getItem("pickupFlat") || localStorage.getItem("pickupUnit") : ""),
    dropFlat: bookingData.dropFlat || addressData?.dropFlat || addressData?.destUnit || (typeof localStorage !== "undefined" ? localStorage.getItem("dropFlat") || localStorage.getItem("destUnit") : ""),
  };
  return generateBookingConfirmationPDF(mergedData);
};

export default generateQuotationPDF;