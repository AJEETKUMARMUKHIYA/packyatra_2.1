import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Stack,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  TextField,
  Snackbar,
  Chip,
  Collapse,
  Avatar,
  Tooltip
} from "@mui/material";
import {
  CheckCircle,
  CalendarToday,
  AccessTime,
  LocationOn,
  LocalShipping,
  Elevator,
  DirectionsCar,
  Receipt,
  CurrencyRupee,
  Email,
  Person,
  Phone,
  Payment,
  Download,
  StairsOutlined,
  DirectionsWalk,
  LockOutlined,
  ShieldOutlined,
  Inventory2Outlined,
  ExpandMore,
  ExpandLess,
  ArrowBack,
  VerifiedUserOutlined
} from "@mui/icons-material";
import AxiosClient from "../AxiosClient";
import { generateBookingConfirmationPDF } from "./generateQuotationPDF";
import { sendBookingConfirmationEmail } from "./EmailService";
import ValidationDialog from "./ValidationDialog";

const Step2_ReviewAndPayment = ({
  bookingData,
  onUpdate,
  onBack,
  distance,
  shiftingDate,
  fromAddress,
  toAddress,
  userId,
  addressId,
  timeSlots = [],
  priceCalculateCitywise,
  loading: parentLoading
}) => {
  const [priceLoading, setPriceLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  // Customer info inputs
  const [customerName, setCustomerName] = useState(bookingData.customerName || "");
  const [customerEmail, setCustomerEmail] = useState(bookingData.customerEmail || "");
  const [customerPhone, setCustomerPhone] = useState(
    bookingData.customerPhone || localStorage.getItem("mobile") || ""
  );
  const [errors, setErrors] = useState({});

  const [validationOpen, setValidationOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const totalCFT = (bookingData.selectedItems || []).reduce(
    (sum, item) => sum + item.quantity * (item.sizeCFT || 0),
    0
  );

  const tokenAmount = Math.round(calculatedPrice * 0.1);
  const balanceAmount = calculatedPrice - tokenAmount;

  const isSameApartment =
    bookingData.shiftingType === "same_apartment" ||
    bookingData.isSameApartment === true ||
    (typeof localStorage !== "undefined" &&
      localStorage.getItem("shiftingType") === "same_apartment");

  useEffect(() => {
    calculatePrice();
  }, [
    distance,
    totalCFT,
    bookingData.serviceLift,
    bookingData.selectedFloor,
    bookingData.serviceLiftdrop,
    bookingData.floordrop,
    bookingData.vanAccessible,
    bookingData.roadDistance,
    priceCalculateCitywise
  ]);

  const calculatePrice = async () => {
    const {
      serviceLift,
      serviceLiftdrop,
      selectedFloor,
      vanAccessible,
      roadDistance
    } = bookingData;

    if (
      !distance ||
      distance <= 0 ||
      totalCFT <= 0 ||
      (bookingData.selectedItems || []).length === 0
    ) {
      setPriceLoading(false);
      setValidationMessage("Please contact support team at +91 90715 35535.");
      setValidationOpen(true);
      return;
    }
    setPriceLoading(true);
    setError(null);

    try {
      const dist = parseInt(distance, 10) || 0;
      const cft = parseInt(totalCFT, 10) || 0;
      const response = await AxiosClient.get(
        `/Price/GetPrice?distance=${dist}&cftTotal=${cft}&activeTab=${priceCalculateCitywise}`
      );

      if (response.status === 200) {
        if (!response.data || !response.data.price || response.data.price <= 0) {
          setPriceLoading(false);
          setValidationMessage("Please contact support team at +91 90715 35535.");
          setValidationOpen(true);
          return;
        }

        let basePrice = response.data.price || 0;
        let floorCharge = selectedFloor === 0 ? selectedFloor * 200 : 0;
        let roadCharge = 0;
        const pickupLiftCharge = serviceLift === "no" ? 500 : 0;
        const dropLiftCharge = serviceLiftdrop === "no" ? 500 : 0;

        const totalPrice =
          basePrice + floorCharge + roadCharge + pickupLiftCharge + dropLiftCharge;

        setCalculatedPrice(totalPrice);
        onUpdate({
          price: totalPrice,
          totalCFT: totalCFT
        });
      }
    } catch (error) {
      console.error("Price calculation error:", error);
      setValidationOpen(true);
      setValidationMessage("Please contact support team at +91 9071535535.");
    } finally {
      setPriceLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!customerName.trim()) {
      newErrors.name = "Full Name is required";
    }
    if (!customerEmail.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!customerPhone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(customerPhone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createBookingIfNeeded = async () => {
    if (bookingData.bookingId && bookingData.quotationNumber) {
      return {
        bookingId: bookingData.bookingId,
        quotationNumber: bookingData.quotationNumber
      };
    }

    const {
      selectedItems,
      selectedTimeSlot,
      serviceLift,
      selectedFloor,
      serviceLiftdrop,
      floordrop,
      vanAccessible,
      roadDistance,
      roadDetails
    } = bookingData;

    const bookingDetails = {
      userID: parseInt(userId, 10),
      ticket_distribution: "test",
      sourceAddressID: addressId,
      destinationAddressID: addressId,
      pickupDate: new Date(shiftingDate).toISOString(),
      pickupTimeSlotID: selectedTimeSlot || 1,
      status: "Pending",
      totalAmount: calculatedPrice,
      bookingAmountPaid: 0.0,
      quotationNumber: "",
      totalVolume: totalCFT,
      bookingItemList: (selectedItems || []).map((item) => ({
        itemID: item.itemID,
        quantity: item.quantity
      })),
      additionalServices: {
        serviceLift: serviceLift === "yes",
        floorNumber: selectedFloor || 0,
        vanAccessible: vanAccessible === "yes",
        roadDistance: roadDistance || "",
        roadDetails: roadDetails || ""
      }
    };

    const response = await AxiosClient.post(
      "/booking/CreateBooking",
      bookingDetails,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.status !== 200) {
      throw new Error("Failed to create booking. Please try again.");
    }

    const createdBookingId = response.data.bookingID;
    const quotationNumber = `PACKY-${createdBookingId}`;

    onUpdate({
      bookingId: createdBookingId,
      quotationNumber,
      customerName,
      customerEmail,
      customerPhone
    });

    return { bookingId: createdBookingId, quotationNumber };
  };

  const handleProceedToPayment = async () => {
    if (!validateForm()) {
      setError("Please fill out all required contact details correctly.");
      setSnackbarOpen(true);
      return;
    }

    if (calculatedPrice <= 0) {
      setError("Please wait for the price calculation to complete.");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { bookingId: createdBookingId, quotationNumber } =
        await createBookingIfNeeded();

      const amountInPaise = Math.round(tokenAmount * 100);
      const payRes = await AxiosClient.post("/phonepe/pay", {
        amount: amountInPaise
      });

      const { merchantOrderId, redirectUrl } = payRes.data;

      localStorage.setItem("merchantTransactionId", merchantOrderId);
      localStorage.setItem(
        "postPaymentPayload",
        JSON.stringify({
          bookingData: {
            ...bookingData,
            bookingId: createdBookingId,
            quotationNumber,
            price: calculatedPrice,
            totalCFT: totalCFT
          },
          customerName,
          customerEmail,
          customerPhone,
          paymentMethod: "UPI",
          tokenAmount,
          balanceAmount,
          timeSlots
        })
      );

      window.location.href = redirectUrl;
    } catch (err) {
      console.error(err);
      setError(
        err.message || "An error occurred. Please contact our support team."
      );
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleDownloadQuotation = async () => {
    if (!customerName.trim() || !customerEmail.trim()) {
      setError("Please fill in your name and email to download the quotation.");
      setSnackbarOpen(true);
      return;
    }

    if (!validateForm()) {
      setError("Please fill out all required contact fields correctly.");
      setSnackbarOpen(true);
      return;
    }

    if (calculatedPrice <= 0) {
      setError("Please wait for the price calculation to complete.");
      setSnackbarOpen(true);
      return;
    }

    setDownloadLoading(true);
    setError(null);

    try {
      const { quotationNumber } = await createBookingIfNeeded();

      const timeSlotName =
        timeSlots.find((s) => s.timeSlotID === bookingData.selectedTimeSlot)
          ?.timeSlotName || "Selected";

      const confirmationPdf = await generateBookingConfirmationPDF({
        ...bookingData,
        price: calculatedPrice,
        quotationNumber,
        transactionId: `EST-${Date.now()}`,
        customerName,
        customerEmail,
        customerPhone,
        shiftingDate,
        selectedTimeSlot: bookingData.selectedTimeSlot,
        timeSlots,
        fromAddress,
        toAddress,
        shiftingType: isSameApartment ? "same_apartment" : "within",
        pickupFlat: isSameApartment
          ? bookingData.pickupFlat ||
            (typeof localStorage !== "undefined"
              ? localStorage.getItem("pickupFlat")
              : "")
          : "",
        dropFlat: isSameApartment
          ? bookingData.dropFlat ||
            (typeof localStorage !== "undefined"
              ? localStorage.getItem("dropFlat")
              : "")
          : "",
        totalCFT,
        serviceLift: bookingData.serviceLift,
        serviceLiftdrop: bookingData.serviceLiftdrop,
        selectedFloor: bookingData.selectedFloor,
        floordrop: bookingData.floordrop
      });

      if (confirmationPdf) {
        const url = URL.createObjectURL(confirmationPdf);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Estimated_Quotation_PACKYATRA.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
      setError(
        error.message || "Failed to generate PDF quotation. Please try again."
      );
      setSnackbarOpen(true);
    } finally {
      setDownloadLoading(false);
    }
  };

  const getTimeSlotName = () => {
    if (!bookingData.selectedTimeSlot) return "Not selected";
    const slot = timeSlots.find(
      (s) => s.timeSlotID === bookingData.selectedTimeSlot
    );
    return slot ? slot.timeSlotName.replace(/\./g, ":") : "Selected Slot";
  };

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* LEFT COLUMN: SHIFTING REVIEW & CONTACT DETAILS */}
        <Grid item xs={12} lg={7}>
          <Stack spacing={3}>
            {/* CARD 1: REVIEW SHIFTING DETAILS */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: 3.5,
                border: "1.5px solid",
                borderColor: "grey.200",
                bgcolor: "white",
                boxShadow: "0 4px 18px rgba(0,0,0,0.04)"
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2.5 }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar
                    sx={{
                      background:
                        "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                      color: "white",
                      width: 40,
                      height: 40,
                      boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
                    }}
                  >
                    <LocalShipping fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      fontSize="17.5px"
                      color="text.primary"
                    >
                      Review Shifting Details
                    </Typography>
                    <Typography fontSize="12.5px" color="text.secondary">
                      Verified relocation manifest & access parameters
                    </Typography>
                  </Box>
                </Stack>

                <Chip
                  label="Step 2 of 2"
                  size="small"
                  sx={{
                    bgcolor: "grey.100",
                    fontWeight: 700,
                    fontSize: "11px",
                    color: "text.secondary"
                  }}
                />
              </Stack>

              {/* DATE & TIME DUAL CARD */}
              <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: 2.5,
                      bgcolor: "rgba(79, 70, 229, 0.04)",
                      border: "1px solid",
                      borderColor: "rgba(79, 70, 229, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        width: 36,
                        height: 36
                      }}
                    >
                      <CalendarToday sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        fontSize="11px"
                        fontWeight={700}
                        color="text.secondary"
                        textTransform="uppercase"
                      >
                        Shifting Date
                      </Typography>
                      <Typography
                        fontSize="13.5px"
                        fontWeight={800}
                        color="text.primary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {shiftingDate
                          ? new Date(shiftingDate).toLocaleDateString("en-IN", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })
                          : "Not Selected"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: 2.5,
                      bgcolor: "rgba(79, 70, 229, 0.04)",
                      border: "1px solid",
                      borderColor: "rgba(79, 70, 229, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        width: 36,
                        height: 36
                      }}
                    >
                      <AccessTime sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        fontSize="11px"
                        fontWeight={700}
                        color="text.secondary"
                        textTransform="uppercase"
                      >
                        Arrival Time Window
                      </Typography>
                      <Typography
                        fontSize="13.5px"
                        fontWeight={800}
                        color="text.primary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {getTimeSlotName()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* ROUTE TIMELINE CARDS */}
              <Box
                sx={{
                  p: 2,
                  mb: 2.5,
                  borderRadius: 3,
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: "grey.200"
                }}
              >
                {/* Pickup Origin */}
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mt: 0.2
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: "rgba(22, 163, 74, 0.15)",
                        color: "#16a34a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <LocationOn sx={{ fontSize: 16 }} />
                    </Box>
                    <Box
                      sx={{
                        width: 2,
                        height: 44,
                        bgcolor: "grey.300",
                        my: 0.5,
                        borderStyle: "dashed"
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      flexWrap="wrap"
                    >
                      <Typography
                        fontSize="11.5px"
                        fontWeight={800}
                        color="#16a34a"
                        textTransform="uppercase"
                      >
                        Origin (Pickup)
                      </Typography>
                      <Chip
                        size="small"
                        label={
                          bookingData.selectedFloor === 0
                            ? "Ground Floor"
                            : `Floor ${bookingData.selectedFloor || 0}`
                        }
                        sx={{ height: 20, fontSize: "10.5px", fontWeight: 700 }}
                      />
                      <Chip
                        size="small"
                        label={
                          bookingData.serviceLift === "yes"
                            ? "Lift Assisted"
                            : "Stairs Only"
                        }
                        sx={{
                          height: 20,
                          fontSize: "10.5px",
                          fontWeight: 700,
                          bgcolor:
                            bookingData.serviceLift === "yes"
                              ? "rgba(22, 163, 74, 0.1)"
                              : "rgba(220, 38, 38, 0.1)",
                          color:
                            bookingData.serviceLift === "yes"
                              ? "#16a34a"
                              : "#dc2626"
                        }}
                      />
                    </Stack>
                    <Typography
                      fontSize="13px"
                      fontWeight={600}
                      color="text.primary"
                      sx={{ mt: 0.3 }}
                    >
                      {fromAddress || "Origin address"}
                    </Typography>
                    {isSameApartment &&
                      (bookingData.pickupFlat ||
                        (typeof localStorage !== "undefined" &&
                          localStorage.getItem("pickupFlat"))) && (
                        <Box
                          sx={{
                            display: "inline-flex",
                            mt: 0.5,
                            px: 1,
                            py: 0.3,
                            bgcolor: "rgba(79, 70, 229, 0.08)",
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: "rgba(79, 70, 229, 0.2)"
                          }}
                        >
                          <Typography
                            fontSize="11.5px"
                            fontWeight={700}
                            color="primary.main"
                          >
                            🏢 Pickup Flat / Tower:{" "}
                            {bookingData.pickupFlat ||
                              localStorage.getItem("pickupFlat")}
                          </Typography>
                        </Box>
                      )}
                  </Box>
                </Box>

                {/* Drop Destination */}
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.2 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: "rgba(220, 38, 38, 0.15)",
                        color: "#dc2626",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <LocationOn sx={{ fontSize: 16 }} />
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      flexWrap="wrap"
                    >
                      <Typography
                        fontSize="11.5px"
                        fontWeight={800}
                        color="#dc2626"
                        textTransform="uppercase"
                      >
                        Destination (Drop-off)
                      </Typography>
                      <Chip
                        size="small"
                        label={
                          bookingData.floordrop === 0
                            ? "Ground Floor"
                            : `Floor ${bookingData.floordrop || 0}`
                        }
                        sx={{ height: 20, fontSize: "10.5px", fontWeight: 700 }}
                      />
                      <Chip
                        size="small"
                        label={
                          bookingData.serviceLiftdrop === "yes"
                            ? "Lift Assisted"
                            : "Stairs Only"
                        }
                        sx={{
                          height: 20,
                          fontSize: "10.5px",
                          fontWeight: 700,
                          bgcolor:
                            bookingData.serviceLiftdrop === "yes"
                              ? "rgba(22, 163, 74, 0.1)"
                              : "rgba(220, 38, 38, 0.1)",
                          color:
                            bookingData.serviceLiftdrop === "yes"
                              ? "#16a34a"
                              : "#dc2626"
                        }}
                      />
                    </Stack>
                    <Typography
                      fontSize="13px"
                      fontWeight={600}
                      color="text.primary"
                      sx={{ mt: 0.3 }}
                    >
                      {toAddress || "Destination address"}
                    </Typography>
                    {isSameApartment &&
                      (bookingData.dropFlat ||
                        (typeof localStorage !== "undefined" &&
                          localStorage.getItem("dropFlat"))) && (
                        <Box
                          sx={{
                            display: "inline-flex",
                            mt: 0.5,
                            px: 1,
                            py: 0.3,
                            bgcolor: "rgba(22, 163, 74, 0.08)",
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: "rgba(22, 163, 74, 0.2)"
                          }}
                        >
                          <Typography
                            fontSize="11.5px"
                            fontWeight={700}
                            color="#16a34a"
                          >
                            🏢 Drop Flat / Tower:{" "}
                            {bookingData.dropFlat ||
                              localStorage.getItem("dropFlat")}
                          </Typography>
                        </Box>
                      )}
                  </Box>
                </Box>
              </Box>

              {/* OPTIONS SUMMARY STRIP */}
              <Box
                sx={{
                  p: 1.5,
                  mb: 2,
                  borderRadius: 2.5,
                  bgcolor: "white",
                  border: "1px solid",
                  borderColor: "grey.200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <DirectionsCar sx={{ color: "primary.main", fontSize: 18 }} />
                  <Typography fontSize="12px" fontWeight={700} color="text.primary">
                    Truck Doorstep Access:
                  </Typography>
                  <Typography fontSize="12px" color="text.secondary">
                    {bookingData.vanAccessible === "yes"
                      ? "Direct Entrance Access"
                      : `Walking carry (${bookingData.roadDistance || "Distance unstated"})`}
                  </Typography>
                </Stack>

                {distance > 0 && (
                  <Chip
                    size="small"
                    label={`${distance} km transit`}
                    sx={{
                      bgcolor: "primary.50",
                      color: "primary.main",
                      fontWeight: 700,
                      fontSize: "11px"
                    }}
                  />
                )}
              </Box>

              {/* COLLAPSIBLE INVENTORY PREVIEW */}
              <Box
                sx={{
                  borderRadius: 2.5,
                  border: "1px solid",
                  borderColor: "grey.200",
                  overflow: "hidden"
                }}
              >
                <Box
                  onClick={() => setShowInventory(!showInventory)}
                  sx={{
                    p: 1.4,
                    bgcolor: "grey.50",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    "&:hover": { bgcolor: "grey.100" }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Inventory2Outlined sx={{ fontSize: 17, color: "primary.main" }} />
                    <Typography fontSize="12.5px" fontWeight={700} color="text.primary">
                      Selected Items Manifest ({(bookingData.selectedItems || []).length} items · {totalCFT.toFixed(1)} CFT)
                    </Typography>
                  </Stack>
                  {showInventory ? <ExpandLess sx={{ fontSize: 20 }} /> : <ExpandMore sx={{ fontSize: 20 }} />}
                </Box>

                <Collapse in={showInventory}>
                  <Box sx={{ p: 1.5, bgcolor: "white", maxHeight: 200, overflowY: "auto" }}>
                    <Grid container spacing={1}>
                      {(bookingData.selectedItems || []).map((item) => (
                        <Grid item xs={12} sm={6} key={item.itemID}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1.5,
                              bgcolor: "grey.50",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between"
                            }}
                          >
                            <Typography fontSize="12px" fontWeight={600} color="text.primary" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", pr: 1 }}>
                              {item.name}
                            </Typography>
                            <Typography fontSize="11px" fontWeight={800} color="primary.main" sx={{ fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                              × {item.quantity}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Collapse>
              </Box>
            </Paper>

            {/* CARD 2: CONTACT DETAILS FORM */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: 3.5,
                border: "1.5px solid",
                borderColor: "grey.200",
                bgcolor: "white",
                boxShadow: "0 4px 18px rgba(0,0,0,0.04)"
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Avatar
                  sx={{
                    background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                    color: "white",
                    width: 40,
                    height: 40,
                    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
                  }}
                >
                  <Person fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={800} fontSize="17.5px" color="text.primary">
                    Contact & Booking Details
                  </Typography>
                  <Typography fontSize="12.5px" color="text.secondary">
                    Your official booking receipt and driver updates will be sent here
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2.5}>
                <TextField
                  label="Full Name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2 }
                  }}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: "primary.main", fontSize: 20 }} />
                  }}
                />

                <TextField
                  label="Email Address"
                  type="email"
                  required
                  placeholder="e.g. rahul.sharma@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={
                    errors.email ||
                    "Tax invoice and booking confirmation PDF will be emailed immediately"
                  }
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2 }
                  }}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: "primary.main", fontSize: 20 }} />
                  }}
                />

                <TextField
                  label="Phone Number"
                  required
                  placeholder="10-digit mobile number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  error={!!errors.phone}
                  helperText={errors.phone || "Crew leader will call you before arrival"}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2 }
                  }}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: "primary.main", fontSize: 20 }} />
                  }}
                />
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 2.5,
                  p: 1.25,
                  borderRadius: 2,
                  bgcolor: "grey.50"
                }}
              >
                <ShieldOutlined sx={{ fontSize: 18, color: "#16a34a" }} />
                <Typography fontSize="11.5px" color="text.secondary">
                  <strong>100% Privacy Protected:</strong> We never share or sell your contact information.
                </Typography>
              </Box>
            </Paper>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN: PRICE SUMMARY & PAYMENT ACTIONS */}
        <Grid item xs={12} lg={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              position: { lg: "sticky", xs: "static" },
              top: 24,
              borderRadius: 3.5,
              border: "1.5px solid",
              borderColor: "grey.200",
              bgcolor: "white",
              boxShadow: "0 10px 30px -10px rgba(15, 23, 42, 0.08)"
            }}
          >
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar
                  sx={{
                    background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                    color: "white",
                    width: 38,
                    height: 38
                  }}
                >
                  <CurrencyRupee fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={800} fontSize="17px" color="text.primary">
                    Price Summary
                  </Typography>
                  <Typography fontSize="12px" color="text.secondary">
                    Transparent relocation pricing
                  </Typography>
                </Box>
              </Stack>

              <Chip
                icon={<VerifiedUserOutlined sx={{ fontSize: 13 }} />}
                label="Guaranteed Rate"
                size="small"
                sx={{
                  bgcolor: "rgba(22, 163, 74, 0.1)",
                  color: "#16a34a",
                  fontWeight: 800,
                  fontSize: "11px",
                  "& .MuiChip-icon": { color: "#16a34a" }
                }}
              />
            </Stack>

            <Divider sx={{ mb: 2.5 }} />

            {priceLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 6,
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <CircularProgress size={36} />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, fontWeight: 600 }}>
                  Calculating best verified relocation rates...
                </Typography>
              </Box>
            ) : (
              <>
                {/* Cost Breakdown */}
                <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography fontSize="13px" color="text.secondary">
                      Base Relocation & Transport
                    </Typography>
                    <Typography fontSize="13.5px" fontWeight={700} color="text.primary" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      ₹{calculatedPrice.toLocaleString("en-IN")}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography fontSize="13px" color="text.secondary">
                      Total Shifting Volume
                    </Typography>
                    <Typography fontSize="13px" fontWeight={600} color="text.primary" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {totalCFT.toFixed(1)} CFT ({(bookingData.selectedItems || []).length} items)
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography fontSize="13px" color="text.secondary">
                      Transit Distance
                    </Typography>
                    <Typography fontSize="13px" fontWeight={600} color="text.primary">
                      {distance > 0 ? `${distance} km` : "Standard City"}
                    </Typography>
                  </Box>

                  <Divider />

                  {/* Total Estimate Highlight Box */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      bgcolor: "rgba(79, 70, 229, 0.06)",
                      border: "1.5px solid",
                      borderColor: "rgba(79, 70, 229, 0.25)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Box>
                      <Typography fontSize="13.5px" fontWeight={700} color="text.primary">
                        Total Relocation Estimate
                      </Typography>
                      <Typography fontSize="11px" color="text.secondary">
                        All labor, loading & transport included
                      </Typography>
                    </Box>
                    <Typography
                      fontSize="24px"
                      fontWeight={900}
                      color="primary.main"
                      sx={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      ₹{calculatedPrice.toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                </Stack>

                {/* 10% TOKEN SPLIT CARD */}
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: "rgba(22, 163, 74, 0.06)",
                    border: "1.5px solid",
                    borderColor: "rgba(22, 163, 74, 0.2)"
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <CheckCircle sx={{ color: "#16a34a", fontSize: 19 }} />
                    <Typography fontSize="13px" fontWeight={800} color="#16a34a">
                      Pay Only 10% Booking Token (₹{tokenAmount.toLocaleString("en-IN")})
                    </Typography>
                  </Stack>

                  <Typography fontSize="11.5px" color="text.secondary" sx={{ lineHeight: 1.45, mb: 1.5 }}>
                    Lock your moving date and crew slot today. The balance amount of <strong>₹{balanceAmount.toLocaleString("en-IN")}</strong> is payable after safe delivery at your new home.
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Box
                      sx={{
                        flex: 1,
                        p: 1,
                        bgcolor: "white",
                        borderRadius: 1.5,
                        textAlign: "center",
                        border: "1px solid",
                        borderColor: "rgba(22, 163, 74, 0.2)"
                      }}
                    >
                      <Typography fontSize="10px" fontWeight={700} color="#16a34a">
                        PAY NOW (10%)
                      </Typography>
                      <Typography fontSize="15px" fontWeight={900} color="#16a34a">
                        ₹{tokenAmount.toLocaleString("en-IN")}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        p: 1,
                        bgcolor: "white",
                        borderRadius: 1.5,
                        textAlign: "center",
                        border: "1px solid",
                        borderColor: "grey.200"
                      }}
                    >
                      <Typography fontSize="10px" fontWeight={700} color="text.secondary">
                        PAY ON DELIVERY (90%)
                      </Typography>
                      <Typography fontSize="15px" fontWeight={900} color="text.primary">
                        ₹{balanceAmount.toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* PRIMARY ACTIONS */}
                <Stack spacing={1.5}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleProceedToPayment}
                    disabled={loading || calculatedPrice === 0}
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <LockOutlined />
                      )
                    }
                    sx={{
                      py: 1.45,
                      borderRadius: 2.5,
                      fontWeight: 800,
                      fontSize: "14.5px",
                      textTransform: "none",
                      boxShadow: "0 6px 20px rgba(79, 70, 229, 0.35)",
                      background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)",
                        boxShadow: "0 8px 24px rgba(79, 70, 229, 0.45)"
                      },
                      "&.Mui-disabled": {
                        bgcolor: "grey.200",
                        color: "grey.400",
                        boxShadow: "none"
                      }
                    }}
                  >
                    {loading
                      ? "Initializing Secure Gateway..."
                      : `Book Now & Pay ₹${tokenAmount.toLocaleString("en-IN")}`}
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleDownloadQuotation}
                    disabled={downloadLoading}
                    startIcon={
                      downloadLoading ? (
                        <CircularProgress size={18} />
                      ) : (
                        <Download />
                      )
                    }
                    sx={{
                      py: 1.1,
                      borderRadius: 2.5,
                      fontWeight: 700,
                      fontSize: "13px",
                      textTransform: "none",
                      borderColor: "grey.300",
                      color: "text.primary",
                      "&:hover": {
                        borderColor: "primary.main",
                        color: "primary.main",
                        bgcolor: "rgba(79, 70, 229, 0.04)"
                      }
                    }}
                  >
                    {downloadLoading
                      ? "Generating Quotation PDF..."
                      : "Download Estimated Quotation (PDF)"}
                  </Button>

                  <Button
                    variant="text"
                    fullWidth
                    onClick={onBack}
                    disabled={loading}
                    startIcon={<ArrowBack sx={{ fontSize: 16 }} />}
                    sx={{
                      textTransform: "none",
                      color: "text.secondary",
                      fontSize: "13px",
                      fontWeight: 600,
                      "&:hover": { color: "primary.main", bgcolor: "transparent" }
                    }}
                  >
                    Modify Items or Services
                  </Button>
                </Stack>

                {/* TRUST FOOTER */}
                <Box
                  sx={{
                    mt: 2.5,
                    pt: 2,
                    borderTop: "1px dashed",
                    borderColor: "grey.200",
                    textAlign: "center"
                  }}
                >
                  <Typography fontSize="11px" color="text.secondary">
                    🔒 <strong>Bank-grade 256-bit SSL Security</strong> via PhonePe
                  </Typography>
                  <Typography fontSize="10.5px" color="text.disabled" sx={{ mt: 0.2 }}>
                    Instant confirmation · Flexible reschedule up to 24 hrs before shift
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      <ValidationDialog
        open={validationOpen}
        message={validationMessage}
        onClose={() => setValidationOpen(false)}
      />
    </>
  );
};

export default Step2_ReviewAndPayment;
