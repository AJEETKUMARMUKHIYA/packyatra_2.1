import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  TextField,
  Box,
  Stack,
  Paper,
  Fade,
  Divider,
  Avatar,
  Chip,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import {
  Elevator,
  AccessTime,
  LocationOn,
  CheckCircle,
  ApartmentOutlined,
  LocalShippingOutlined,
  DirectionsWalk,
  StairsOutlined,
  ArrowForward,
  ArrowBack,
  InfoOutlined,
  WbSunnyOutlined,
  NightsStayOutlined,
  Check
} from "@mui/icons-material";

const Step2_ServiceOptions = ({
  bookingData,
  onUpdate,
  onNext,
  onBack,
  distance,
  timeSlots = [],
  loading = false
}) => {
  const {
    serviceLift,
    selectedFloor,
    serviceLiftdrop,
    floordrop,
    vanAccessible,
    roadDistance,
    roadDetails,
    selectedTimeSlot,
    fromAddress,
    toAddress,
    isSameApartment,
    pickupFlat,
    dropFlat
  } = bookingData;

  const [customFloorMode, setCustomFloorMode] = useState(false);

  /* ======================
     PRICE CONFIG
  ====================== */
  const FLOOR_PRICE = 200;
  const LIFT_NOT_AVAILABLE_PRICE = 500;

  /* ======================
     PRICE CALCULATION
  ====================== */
  const calculateExtraCharge = (dist) => {
    if (!dist) return 0;
    if (typeof dist === "number") return (dist / 50) * 200;
    const match = String(dist).match(/(\d+)\s*m?$/);
    const num = match ? parseInt(match[1], 10) : parseInt(dist, 10);
    if (isNaN(num)) return 0;
    return (num / 50) * 200;
  };

  // Calculate total CFT from selected items
  const totalCFT = (bookingData.selectedItems || []).reduce(
    (sum, item) => sum + item.quantity * (item.sizeCFT || 0),
    0
  );

  // Floor charge when lift NOT available
  function getFloorCharge(cft, floor) {
    if (!floor || floor <= 0) return 0;

    const priceTable = {
      2: { small: 1500, medium: 2000, large: 3000 },
      3: { small: 2500, medium: 3500, large: 4000 },
      4: { small: 3000, medium: 4000, large: 4500 },
      5: { small: 4000, medium: 5000, large: 5500 }
    };

    let slab = "small";
    if (cft <= 300) slab = "small";
    else if (cft <= 800) slab = "medium";
    else slab = "large";

    if (floor >= 2 && floor <= 5) {
      return priceTable[floor]?.[slab] || 0;
    }

    if (floor > 5) {
      const basePrice = priceTable[5][slab];
      const extraFloors = floor - 5;
      return basePrice + extraFloors * 1000;
    }

    return 0;
  }

  const pickupFloorCharge =
    serviceLift === "yes"
      ? selectedFloor
        ? selectedFloor * FLOOR_PRICE
        : 0
      : getFloorCharge(totalCFT, selectedFloor);

  const dropFloorCharge =
    serviceLiftdrop === "yes"
      ? floordrop
        ? floordrop * FLOOR_PRICE
        : 0
      : getFloorCharge(totalCFT, floordrop);

  const pickupLiftCharge = serviceLift === "no" ? LIFT_NOT_AVAILABLE_PRICE : 0;
  const dropLiftCharge = serviceLiftdrop === "no" ? LIFT_NOT_AVAILABLE_PRICE : 0;
  const VanAccessCharge =
    vanAccessible === "no" ? calculateExtraCharge(roadDistance) : 0;

  const totalExtraCharge =
    pickupFloorCharge +
    dropFloorCharge +
    pickupLiftCharge +
    dropLiftCharge +
    VanAccessCharge;

  /* ======================
     HANDLERS
  ====================== */
  const handlePickupLiftChange = (value) => {
    if (value !== null) {
      onUpdate({ serviceLift: value });
    }
  };

  const handleDropLiftChange = (value) => {
    if (value !== null) {
      onUpdate({ serviceLiftdrop: value });
    }
  };

  const handlePickupFloorSelect = (floor) => onUpdate({ selectedFloor: Number(floor) });
  const handleDropFloorSelect = (floor) => onUpdate({ floordrop: Number(floor) });
  const handleTimeSlotChange = (id) => onUpdate({ selectedTimeSlot: id });

  const handleVanAccessChange = (value) => {
    if (value !== null) {
      onUpdate({ vanAccessible: value });
      if (value === "yes") {
        onUpdate({ roadDistance: null, roadDetails: "" });
      }
    }
  };

  const handleRoadDistanceSelect = (dist) => onUpdate({ roadDistance: dist });
  const handleRoadDetailsChange = (e) => onUpdate({ roadDetails: e.target.value });

  const isNextDisabled = !selectedTimeSlot || !vanAccessible;

  // Selected time slot object & display name
  const selectedSlotObj = (timeSlots || []).find((s) => s.timeSlotID === selectedTimeSlot);
  const selectedTimeSlotLabel = selectedSlotObj?.timeSlotName?.replace(/\./g, ":") || "Not selected";

  // Common quick floors list (0 = Ground, 1 = 1st, etc.)
  const quickFloors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <Grid container spacing={3}>
      {/* LEFT COLUMN: SERVICE SELECTIONS */}
      <Grid item xs={12} lg={8}>
        <Stack spacing={3}>
          {/* SECTION 1: PICKUP TIME SLOT */}
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
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar
                  sx={{
                    background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                    color: "white",
                    width: 40,
                    height: 40,
                    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
                  }}
                >
                  <AccessTime fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={800} fontSize="17px" color="text.primary">
                    Select Pickup Time Slot
                  </Typography>
                  <Typography fontSize="12.5px" color="text.secondary">
                    Choose an arrival window for our moving & packing crew
                  </Typography>
                </Box>
              </Stack>

              {selectedTimeSlot && (
                <Chip
                  icon={<Check sx={{ fontSize: 14 }} />}
                  label={selectedTimeSlotLabel}
                  size="small"
                  sx={{
                    bgcolor: "rgba(79, 70, 229, 0.1)",
                    color: "primary.main",
                    fontWeight: 700,
                    fontSize: "12px",
                    "& .MuiChip-icon": { color: "primary.main" }
                  }}
                />
              )}
            </Box>

            {/* Morning Slots */}
            <Box sx={{ mb: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <WbSunnyOutlined sx={{ fontSize: 18, color: "#f59e0b" }} />
                <Typography fontWeight={700} fontSize="13.5px" color="text.primary">
                  Morning Slots
                </Typography>
                <Typography fontSize="12px" color="text.secondary">
                  (8:00 AM – 11:30 AM)
                </Typography>
              </Stack>

              <Grid container spacing={1.5}>
                {timeSlots
                  ?.filter((slot) => slot.timeSlotName.includes("AM"))
                  .map((slot) => {
                    const isSelected = selectedTimeSlot === slot.timeSlotID;
                    const cleanLabel = slot.timeSlotName.replace(/\./g, ":");

                    return (
                      <Grid item xs={6} sm={3} key={slot.timeSlotID}>
                        <Paper
                          onClick={() => handleTimeSlotChange(slot.timeSlotID)}
                          elevation={0}
                          sx={{
                            p: 1.6,
                            borderRadius: 2.5,
                            cursor: "pointer",
                            textAlign: "center",
                            border: "1.5px solid",
                            borderColor: isSelected ? "primary.main" : "grey.200",
                            bgcolor: isSelected ? "rgba(79, 70, 229, 0.05)" : "white",
                            boxShadow: isSelected
                              ? "0 4px 14px rgba(79, 70, 229, 0.2)"
                              : "0 1px 3px rgba(0,0,0,0.02)",
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                            "&:hover": {
                              borderColor: "primary.main",
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)"
                            }
                          }}
                        >
                          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.6}>
                            <AccessTime sx={{ fontSize: 16, color: isSelected ? "primary.main" : "text.secondary" }} />
                            <Typography
                              fontWeight={800}
                              fontSize="13.5px"
                              color={isSelected ? "primary.main" : "text.primary"}
                              sx={{ fontVariantNumeric: "tabular-nums" }}
                            >
                              {cleanLabel}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    );
                  })}
              </Grid>
            </Box>

            {/* Afternoon Slots */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <NightsStayOutlined sx={{ fontSize: 18, color: "#6366f1" }} />
                <Typography fontWeight={700} fontSize="13.5px" color="text.primary">
                  Afternoon & Evening Slots
                </Typography>
                <Typography fontSize="12px" color="text.secondary">
                  (12:00 PM – 5:30 PM)
                </Typography>
              </Stack>

              <Grid container spacing={1.5}>
                {timeSlots
                  ?.filter((slot) => slot.timeSlotName.includes("PM"))
                  .map((slot) => {
                    const isSelected = selectedTimeSlot === slot.timeSlotID;
                    const cleanLabel = slot.timeSlotName.replace(/\./g, ":");

                    return (
                      <Grid item xs={6} sm={3} key={slot.timeSlotID}>
                        <Paper
                          onClick={() => handleTimeSlotChange(slot.timeSlotID)}
                          elevation={0}
                          sx={{
                            p: 1.6,
                            borderRadius: 2.5,
                            cursor: "pointer",
                            textAlign: "center",
                            border: "1.5px solid",
                            borderColor: isSelected ? "primary.main" : "grey.200",
                            bgcolor: isSelected ? "rgba(79, 70, 229, 0.05)" : "white",
                            boxShadow: isSelected
                              ? "0 4px 14px rgba(79, 70, 229, 0.2)"
                              : "0 1px 3px rgba(0,0,0,0.02)",
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                            "&:hover": {
                              borderColor: "primary.main",
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)"
                            }
                          }}
                        >
                          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.6}>
                            <AccessTime sx={{ fontSize: 16, color: isSelected ? "primary.main" : "text.secondary" }} />
                            <Typography
                              fontWeight={800}
                              fontSize="13.5px"
                              color={isSelected ? "primary.main" : "text.primary"}
                              sx={{ fontVariantNumeric: "tabular-nums" }}
                            >
                              {cleanLabel}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    );
                  })}
              </Grid>
            </Box>
          </Paper>

          {/* SECTION 2: PICKUP ORIGIN LOCATION & ELEVATOR */}
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
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(22, 163, 74, 0.12)",
                  color: "#16a34a",
                  width: 40,
                  height: 40,
                  fontWeight: 800
                }}
              >
                <LocationOn fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={800} fontSize="17px" color="text.primary">
                  Pickup Location & Access
                </Typography>
                <Typography fontSize="12.5px" color="text.secondary">
                  Specify elevator availability and floor height at origin
                </Typography>
              </Box>
            </Stack>

            {/* Address Info Chip */}
            <Box
              sx={{
                p: 1.5,
                mb: 2.5,
                borderRadius: 2.5,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200"
              }}
            >
              <Typography fontSize="11px" fontWeight={700} color="text.secondary" textTransform="uppercase">
                Pickup Address
              </Typography>
              <Typography fontSize="13px" fontWeight={600} color="text.primary" sx={{ mt: 0.2 }}>
                {fromAddress || "Origin address"}
              </Typography>
              {isSameApartment && (pickupFlat || localStorage.getItem("pickupFlat")) && (
                <Typography fontSize="12px" fontWeight={700} color="primary.main" sx={{ mt: 0.4 }}>
                  🏢 Pickup Flat / Tower: {pickupFlat || localStorage.getItem("pickupFlat")}
                </Typography>
              )}
            </Box>

            {/* Lift Question Cards */}
            <Typography fontWeight={700} fontSize="13.5px" color="text.primary" sx={{ mb: 1.25 }}>
              Is a service elevator / lift available at pickup?
            </Typography>

            <Grid container spacing={1.5} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Paper
                  onClick={() => handlePickupLiftChange("yes")}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    cursor: "pointer",
                    border: "1.5px solid",
                    borderColor: serviceLift === "yes" ? "#16a34a" : "grey.200",
                    bgcolor: serviceLift === "yes" ? "rgba(22, 163, 74, 0.05)" : "white",
                    boxShadow: serviceLift === "yes" ? "0 4px 14px rgba(22, 163, 74, 0.15)" : "none",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    "&:hover": { borderColor: "#16a34a" }
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: serviceLift === "yes" ? "#16a34a" : "grey.100",
                      color: serviceLift === "yes" ? "white" : "grey.600",
                      width: 38,
                      height: 38
                    }}
                  >
                    <Elevator fontSize="small" />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} fontSize="14px" color="text.primary">
                      Yes, Lift Available
                    </Typography>
                    <Typography fontSize="11.5px" color="text.secondary">
                      Elevator is accessible for shifting crew
                    </Typography>
                  </Box>
                  {serviceLift === "yes" && <CheckCircle sx={{ color: "#16a34a", fontSize: 20 }} />}
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper
                  onClick={() => handlePickupLiftChange("no")}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    cursor: "pointer",
                    border: "1.5px solid",
                    borderColor: serviceLift === "no" ? "#dc2626" : "grey.200",
                    bgcolor: serviceLift === "no" ? "rgba(220, 38, 38, 0.04)" : "white",
                    boxShadow: serviceLift === "no" ? "0 4px 14px rgba(220, 38, 38, 0.15)" : "none",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    "&:hover": { borderColor: "#dc2626" }
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: serviceLift === "no" ? "#dc2626" : "grey.100",
                      color: serviceLift === "no" ? "white" : "grey.600",
                      width: 38,
                      height: 38
                    }}
                  >
                    <StairsOutlined fontSize="small" />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} fontSize="14px" color="text.primary">
                      No Lift (Stairs Only)
                    </Typography>
                    <Typography fontSize="11.5px" color="text.secondary">
                      Manual staircase carry required
                    </Typography>
                  </Box>
                  {serviceLift === "no" && <CheckCircle sx={{ color: "#dc2626", fontSize: 20 }} />}
                </Paper>
              </Grid>
            </Grid>

            {/* Floor Selection */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
                <Typography fontWeight={700} fontSize="13.5px" color="text.primary">
                  Select Pickup Floor:
                </Typography>
                <Typography fontSize="12px" fontWeight={700} color="primary.main">
                  {selectedFloor === 0
                    ? "Ground Floor"
                    : selectedFloor
                    ? `Floor ${selectedFloor}`
                    : "None selected"}
                </Typography>
              </Box>

              {/* Quick Floor Chips */}
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  overflowX: "auto",
                  pb: 1,
                  mb: 1.5,
                  "&::-webkit-scrollbar": { height: 5 },
                  "&::-webkit-scrollbar-thumb": { bgcolor: "grey.300", borderRadius: 3 }
                }}
              >
                {quickFloors.map((fl) => {
                  const isSelected = selectedFloor === fl;
                  return (
                    <Chip
                      key={fl}
                      label={fl === 0 ? "Ground" : `Floor ${fl}`}
                      onClick={() => handlePickupFloorSelect(fl)}
                      sx={{
                        fontWeight: 700,
                        fontSize: "12px",
                        px: 0.5,
                        py: 2,
                        borderRadius: 2,
                        cursor: "pointer",
                        border: "1.5px solid",
                        borderColor: isSelected ? "primary.main" : "grey.200",
                        bgcolor: isSelected ? "primary.main" : "white",
                        color: isSelected ? "white" : "text.primary",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: isSelected ? "primary.dark" : "rgba(79, 70, 229, 0.05)"
                        }
                      }}
                    />
                  );
                })}
              </Stack>

              {/* Higher Floor Dropdown (Floors 11 to 50) */}
              <Box sx={{ maxWidth: 260 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="pickup-higher-floor-label" sx={{ fontSize: "12.5px" }}>
                    Higher Floor (11 to 50)
                  </InputLabel>
                  <Select
                    labelId="pickup-higher-floor-label"
                    label="Higher Floor (11 to 50)"
                    value={selectedFloor > 10 ? selectedFloor : ""}
                    onChange={(e) => handlePickupFloorSelect(e.target.value)}
                    sx={{ borderRadius: 2, fontSize: "13px" }}
                  >
                    {[...Array(40)].map((_, i) => {
                      const fl = i + 11;
                      return (
                        <MenuItem key={fl} value={fl} sx={{ fontSize: "13px" }}>
                          Floor {fl}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>

          {/* SECTION 3: DROP DESTINATION LOCATION & ELEVATOR */}
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
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(220, 38, 38, 0.12)",
                  color: "#dc2626",
                  width: 40,
                  height: 40,
                  fontWeight: 800
                }}
              >
                <LocationOn fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={800} fontSize="17px" color="text.primary">
                  Drop-off Location & Access
                </Typography>
                <Typography fontSize="12.5px" color="text.secondary">
                  Specify elevator availability and floor height at destination
                </Typography>
              </Box>
            </Stack>

            {/* Address Info Chip */}
            <Box
              sx={{
                p: 1.5,
                mb: 2.5,
                borderRadius: 2.5,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200"
              }}
            >
              <Typography fontSize="11px" fontWeight={700} color="text.secondary" textTransform="uppercase">
                Drop-off Address
              </Typography>
              <Typography fontSize="13px" fontWeight={600} color="text.primary" sx={{ mt: 0.2 }}>
                {toAddress || "Destination address"}
              </Typography>
              {isSameApartment && (dropFlat || localStorage.getItem("dropFlat")) && (
                <Typography fontSize="12px" fontWeight={700} color="primary.main" sx={{ mt: 0.4 }}>
                  🏢 Drop Flat / Tower: {dropFlat || localStorage.getItem("dropFlat")}
                </Typography>
              )}
            </Box>

            {/* Lift Question Cards */}
            <Typography fontWeight={700} fontSize="13.5px" color="text.primary" sx={{ mb: 1.25 }}>
              Is a service elevator / lift available at drop-off?
            </Typography>

            <Grid container spacing={1.5} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Paper
                  onClick={() => handleDropLiftChange("yes")}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    cursor: "pointer",
                    border: "1.5px solid",
                    borderColor: serviceLiftdrop === "yes" ? "#16a34a" : "grey.200",
                    bgcolor: serviceLiftdrop === "yes" ? "rgba(22, 163, 74, 0.05)" : "white",
                    boxShadow: serviceLiftdrop === "yes" ? "0 4px 14px rgba(22, 163, 74, 0.15)" : "none",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    "&:hover": { borderColor: "#16a34a" }
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: serviceLiftdrop === "yes" ? "#16a34a" : "grey.100",
                      color: serviceLiftdrop === "yes" ? "white" : "grey.600",
                      width: 38,
                      height: 38
                    }}
                  >
                    <Elevator fontSize="small" />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} fontSize="14px" color="text.primary">
                      Yes, Lift Available
                    </Typography>
                    <Typography fontSize="11.5px" color="text.secondary">
                      Elevator is accessible for shifting crew
                    </Typography>
                  </Box>
                  {serviceLiftdrop === "yes" && <CheckCircle sx={{ color: "#16a34a", fontSize: 20 }} />}
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper
                  onClick={() => handleDropLiftChange("no")}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    cursor: "pointer",
                    border: "1.5px solid",
                    borderColor: serviceLiftdrop === "no" ? "#dc2626" : "grey.200",
                    bgcolor: serviceLiftdrop === "no" ? "rgba(220, 38, 38, 0.04)" : "white",
                    boxShadow: serviceLiftdrop === "no" ? "0 4px 14px rgba(220, 38, 38, 0.15)" : "none",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    "&:hover": { borderColor: "#dc2626" }
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: serviceLiftdrop === "no" ? "#dc2626" : "grey.100",
                      color: serviceLiftdrop === "no" ? "white" : "grey.600",
                      width: 38,
                      height: 38
                    }}
                  >
                    <StairsOutlined fontSize="small" />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} fontSize="14px" color="text.primary">
                      No Lift (Stairs Only)
                    </Typography>
                    <Typography fontSize="11.5px" color="text.secondary">
                      Manual staircase carry required
                    </Typography>
                  </Box>
                  {serviceLiftdrop === "no" && <CheckCircle sx={{ color: "#dc2626", fontSize: 20 }} />}
                </Paper>
              </Grid>
            </Grid>

            {/* Floor Selection */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
                <Typography fontWeight={700} fontSize="13.5px" color="text.primary">
                  Select Drop-off Floor:
                </Typography>
                <Typography fontSize="12px" fontWeight={700} color="primary.main">
                  {floordrop === 0
                    ? "Ground Floor"
                    : floordrop
                    ? `Floor ${floordrop}`
                    : "None selected"}
                </Typography>
              </Box>

              {/* Quick Floor Chips */}
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  overflowX: "auto",
                  pb: 1,
                  mb: 1.5,
                  "&::-webkit-scrollbar": { height: 5 },
                  "&::-webkit-scrollbar-thumb": { bgcolor: "grey.300", borderRadius: 3 }
                }}
              >
                {quickFloors.map((fl) => {
                  const isSelected = floordrop === fl;
                  return (
                    <Chip
                      key={fl}
                      label={fl === 0 ? "Ground" : `Floor ${fl}`}
                      onClick={() => handleDropFloorSelect(fl)}
                      sx={{
                        fontWeight: 700,
                        fontSize: "12px",
                        px: 0.5,
                        py: 2,
                        borderRadius: 2,
                        cursor: "pointer",
                        border: "1.5px solid",
                        borderColor: isSelected ? "primary.main" : "grey.200",
                        bgcolor: isSelected ? "primary.main" : "white",
                        color: isSelected ? "white" : "text.primary",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: isSelected ? "primary.dark" : "rgba(79, 70, 229, 0.05)"
                        }
                      }}
                    />
                  );
                })}
              </Stack>

              {/* Higher Floor Dropdown (Floors 11 to 50) */}
              <Box sx={{ maxWidth: 260 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="drop-higher-floor-label" sx={{ fontSize: "12.5px" }}>
                    Higher Floor (11 to 50)
                  </InputLabel>
                  <Select
                    labelId="drop-higher-floor-label"
                    label="Higher Floor (11 to 50)"
                    value={floordrop > 10 ? floordrop : ""}
                    onChange={(e) => handleDropFloorSelect(e.target.value)}
                    sx={{ borderRadius: 2, fontSize: "13px" }}
                  >
                    {[...Array(40)].map((_, i) => {
                      const fl = i + 11;
                      return (
                        <MenuItem key={fl} value={fl} sx={{ fontSize: "13px" }}>
                          Floor {fl}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>

          {/* SECTION 4: VEHICLE & DOORSTEP ACCESSIBILITY */}
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
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(245, 158, 11, 0.12)",
                  color: "#d97706",
                  width: 40,
                  height: 40,
                  fontWeight: 800
                }}
              >
                <LocalShippingOutlined fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={800} fontSize="17px" color="text.primary">
                  Moving Truck Doorstep Accessibility
                </Typography>
                <Typography fontSize="12.5px" color="text.secondary">
                  Can our vehicle park directly near the building entrance or gate?
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Paper
                  onClick={() => handleVanAccessChange("yes")}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    cursor: "pointer",
                    border: "1.5px solid",
                    borderColor: vanAccessible === "yes" ? "primary.main" : "grey.200",
                    bgcolor: vanAccessible === "yes" ? "rgba(79, 70, 229, 0.05)" : "white",
                    boxShadow: vanAccessible === "yes" ? "0 4px 14px rgba(79, 70, 229, 0.18)" : "none",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    "&:hover": { borderColor: "primary.main" }
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: vanAccessible === "yes" ? "primary.main" : "grey.100",
                      color: vanAccessible === "yes" ? "white" : "grey.600",
                      width: 38,
                      height: 38
                    }}
                  >
                    <LocalShippingOutlined fontSize="small" />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} fontSize="14px" color="text.primary">
                      Yes, Direct Access
                    </Typography>
                    <Typography fontSize="11.5px" color="text.secondary">
                      Truck parks directly outside entrance
                    </Typography>
                  </Box>
                  {vanAccessible === "yes" && <CheckCircle sx={{ color: "primary.main", fontSize: 20 }} />}
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper
                  onClick={() => handleVanAccessChange("no")}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    cursor: "pointer",
                    border: "1.5px solid",
                    borderColor: vanAccessible === "no" ? "#d97706" : "grey.200",
                    bgcolor: vanAccessible === "no" ? "rgba(245, 158, 11, 0.05)" : "white",
                    boxShadow: vanAccessible === "no" ? "0 4px 14px rgba(245, 158, 11, 0.18)" : "none",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    "&:hover": { borderColor: "#d97706" }
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: vanAccessible === "no" ? "#d97706" : "grey.100",
                      color: vanAccessible === "no" ? "white" : "grey.600",
                      width: 38,
                      height: 38
                    }}
                  >
                    <DirectionsWalk fontSize="small" />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} fontSize="14px" color="text.primary">
                      No (Walk Distance)
                    </Typography>
                    <Typography fontSize="11.5px" color="text.secondary">
                      Truck parked away (narrow lane/gate)
                    </Typography>
                  </Box>
                  {vanAccessible === "no" && <CheckCircle sx={{ color: "#d97706", fontSize: 20 }} />}
                </Paper>
              </Grid>
            </Grid>

            {/* If vehicle cannot park near entrance, show distance options */}
            {vanAccessible === "no" && (
              <Fade in>
                <Box
                  sx={{
                    mt: 2.5,
                    p: 2.2,
                    borderRadius: 3,
                    bgcolor: "grey.50",
                    border: "1px dashed",
                    borderColor: "grey.300"
                  }}
                >
                  <Typography fontWeight={700} fontSize="13px" color="text.primary" sx={{ mb: 1.25 }}>
                    Approximate walking carry distance from road/truck to door:
                  </Typography>

                  <Grid container spacing={1.25}>
                    {["0-50m", "0-100m", "0-150m", "0-200m"].map((distOption) => {
                      const isDistSelected = roadDistance === distOption;
                      return (
                        <Grid item xs={6} sm={3} key={distOption}>
                          <Paper
                            onClick={() => handleRoadDistanceSelect(distOption)}
                            elevation={0}
                            sx={{
                              p: 1.2,
                              borderRadius: 2,
                              textAlign: "center",
                              cursor: "pointer",
                              border: "1.5px solid",
                              borderColor: isDistSelected ? "#d97706" : "grey.200",
                              bgcolor: isDistSelected ? "rgba(245, 158, 11, 0.1)" : "white",
                              color: isDistSelected ? "#d97706" : "text.primary",
                              fontWeight: 700,
                              fontSize: "13px",
                              transition: "all 0.15s ease",
                              "&:hover": { borderColor: "#d97706" }
                            }}
                          >
                            {distOption}
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>

                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Provide additional access instructions (e.g., basement clearance height, parking restriction, gate security procedure)..."
                    value={roadDetails || ""}
                    onChange={handleRoadDetailsChange}
                    sx={{
                      mt: 2,
                      bgcolor: "white",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2.5,
                        fontSize: "13px"
                      }
                    }}
                  />
                </Box>
              </Fade>
            )}
          </Paper>
        </Stack>
      </Grid>

      {/* RIGHT COLUMN: SERVICE SUMMARY SIDEBAR */}
      <Grid item xs={12} lg={4}>
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
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Avatar
              sx={{
                background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                color: "white",
                width: 38,
                height: 38
              }}
            >
              <ApartmentOutlined fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={800} fontSize="16.5px" color="text.primary">
                Service Summary
              </Typography>
              <Typography fontSize="12px" color="text.secondary">
                Configuration for move confirmation
              </Typography>
            </Box>
          </Stack>

          {/* Quick Metrics (CFT & Items from Step 1) */}
          <Box
            sx={{
              p: 1.5,
              mb: 2.5,
              borderRadius: 2.5,
              bgcolor: "rgba(79, 70, 229, 0.04)",
              border: "1px solid",
              borderColor: "rgba(79, 70, 229, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Box>
              <Typography fontSize="10.5px" fontWeight={700} color="text.secondary">
                SELECTED INVENTORY
              </Typography>
              <Typography fontSize="14px" fontWeight={800} color="primary.main">
                {(bookingData.selectedItems || []).length} Items ({totalCFT.toFixed(1)} CFT)
              </Typography>
            </Box>
            <Chip
              label="Ready"
              size="small"
              sx={{
                bgcolor: "rgba(22, 163, 74, 0.1)",
                color: "#16a34a",
                fontWeight: 800,
                fontSize: "11px"
              }}
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* ROUTE SUMMARY */}
          <Stack spacing={1.8} sx={{ mb: 2.5 }}>
            {/* Origin */}
            <Box sx={{ display: "flex", gap: 1.25 }}>
              <LocationOn sx={{ fontSize: 20, color: "#16a34a", mt: 0.2 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography fontSize="11px" fontWeight={800} color="#16a34a" textTransform="uppercase">
                  Origin (Pickup)
                </Typography>
                <Typography fontSize="12.5px" fontWeight={600} color="text.primary" sx={{ lineHeight: 1.3, mt: 0.2 }}>
                  {fromAddress || "Not specified"}
                </Typography>
                {isSameApartment && (pickupFlat || localStorage.getItem("pickupFlat")) && (
                  <Typography fontSize="11.5px" fontWeight={700} color="primary.main" sx={{ mt: 0.3 }}>
                    Flat / Tower: {pickupFlat || localStorage.getItem("pickupFlat")}
                  </Typography>
                )}
                <Stack direction="row" spacing={0.8} sx={{ mt: 0.5 }}>
                  <Chip
                    size="small"
                    label={selectedFloor === 0 ? "Ground Floor" : selectedFloor ? `Floor ${selectedFloor}` : "Floor unselected"}
                    sx={{ fontSize: "10.5px", height: 22, fontWeight: 700 }}
                  />
                  <Chip
                    size="small"
                    label={serviceLift === "yes" ? "Lift Yes" : serviceLift === "no" ? "Stairs Only" : "Lift unselected"}
                    sx={{
                      fontSize: "10.5px",
                      height: 22,
                      fontWeight: 700,
                      bgcolor: serviceLift === "yes" ? "rgba(22, 163, 74, 0.1)" : serviceLift === "no" ? "rgba(220, 38, 38, 0.1)" : "grey.100",
                      color: serviceLift === "yes" ? "#16a34a" : serviceLift === "no" ? "#dc2626" : "text.secondary"
                    }}
                  />
                </Stack>
              </Box>
            </Box>

            {/* Destination */}
            <Box sx={{ display: "flex", gap: 1.25 }}>
              <LocationOn sx={{ fontSize: 20, color: "#dc2626", mt: 0.2 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography fontSize="11px" fontWeight={800} color="#dc2626" textTransform="uppercase">
                  Destination (Drop-off)
                </Typography>
                <Typography fontSize="12.5px" fontWeight={600} color="text.primary" sx={{ lineHeight: 1.3, mt: 0.2 }}>
                  {toAddress || "Not specified"}
                </Typography>
                {isSameApartment && (dropFlat || localStorage.getItem("dropFlat")) && (
                  <Typography fontSize="11.5px" fontWeight={700} color="primary.main" sx={{ mt: 0.3 }}>
                    Flat / Tower: {dropFlat || localStorage.getItem("dropFlat")}
                  </Typography>
                )}
                <Stack direction="row" spacing={0.8} sx={{ mt: 0.5 }}>
                  <Chip
                    size="small"
                    label={floordrop === 0 ? "Ground Floor" : floordrop ? `Floor ${floordrop}` : "Floor unselected"}
                    sx={{ fontSize: "10.5px", height: 22, fontWeight: 700 }}
                  />
                  <Chip
                    size="small"
                    label={serviceLiftdrop === "yes" ? "Lift Yes" : serviceLiftdrop === "no" ? "Stairs Only" : "Lift unselected"}
                    sx={{
                      fontSize: "10.5px",
                      height: 22,
                      fontWeight: 700,
                      bgcolor: serviceLiftdrop === "yes" ? "rgba(22, 163, 74, 0.1)" : serviceLiftdrop === "no" ? "rgba(220, 38, 38, 0.1)" : "grey.100",
                      color: serviceLiftdrop === "yes" ? "#16a34a" : serviceLiftdrop === "no" ? "#dc2626" : "text.secondary"
                    }}
                  />
                </Stack>
              </Box>
            </Box>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* TIME & ACCESS DETAILS */}
          <Stack spacing={1.25} sx={{ mb: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography fontSize="12px" color="text.secondary">
                Pickup Slot:
              </Typography>
              <Typography fontSize="12.5px" fontWeight={700} color={selectedTimeSlot ? "primary.main" : "text.disabled"}>
                {selectedTimeSlot ? selectedTimeSlotLabel : "Pending selection"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography fontSize="12px" color="text.secondary">
                Truck Access:
              </Typography>
              <Typography fontSize="12.5px" fontWeight={700} color={vanAccessible ? "text.primary" : "text.disabled"}>
                {vanAccessible === "yes"
                  ? "Direct Doorstep"
                  : vanAccessible === "no"
                  ? `Walk: ${roadDistance || "Distance unselected"}`
                  : "Pending selection"}
              </Typography>
            </Box>

            {totalExtraCharge > 0 && (
              <Box
                sx={{
                  p: 1.25,
                  mt: 1,
                  borderRadius: 2,
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: "grey.200"
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                  <Typography fontSize="11.5px" color="text.secondary">
                    Extra service charges:
                  </Typography>
                  <Typography fontSize="12px" fontWeight={800} color="primary.main">
                    ₹{totalExtraCharge}
                  </Typography>
                </Box>
                <Typography fontSize="10px" color="text.disabled">
                  Includes floor carry & manual walking assistance
                </Typography>
              </Box>
            )}
          </Stack>

          {/* ACTION BUTTONS */}
          <Stack spacing={1.5}>
            <Button
              fullWidth
              variant="contained"
              onClick={onNext}
              disabled={isNextDisabled || loading}
              endIcon={<ArrowForward />}
              sx={{
                py: 1.4,
                borderRadius: 2.5,
                fontWeight: 800,
                fontSize: "14px",
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
              Continue to Review & Payment
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={onBack}
              startIcon={<ArrowBack />}
              sx={{
                py: 1.1,
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: "13px",
                textTransform: "none",
                borderColor: "grey.300",
                color: "text.secondary",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                  bgcolor: "rgba(79, 70, 229, 0.04)"
                }
              }}
            >
              Back to Item Selection
            </Button>
          </Stack>

          {isNextDisabled && (
            <Typography fontSize="11px" color="text.disabled" textAlign="center" sx={{ mt: 1.5 }}>
              * Please select a pickup time slot and doorstep access to proceed.
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Step2_ServiceOptions;