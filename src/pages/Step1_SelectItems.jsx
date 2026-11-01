import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
  Stack,
  Paper,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Container,
  Pagination,
  Divider,
  Avatar,
  Tooltip,
  Drawer,
  LinearProgress
} from "@mui/material";

import {
  Add,
  Remove,
  Category,
  CheckCircle,
  Search,
  Clear,
  Inventory2,
  ShoppingCartOutlined,
  WeekendOutlined,
  TvOutlined,
  KitchenOutlined,
  TwoWheelerOutlined,
  Inventory2Outlined,
  CategoryOutlined,
  LocalShippingOutlined,
  DeleteOutline,
  DeleteSweepOutlined,
  ArrowForward,
  Close,
  StraightenOutlined
} from "@mui/icons-material";

const ITEMS_PER_PAGE = 12;

/* Helper: Clean Title Casing while preserving standard abbreviations */
const formatItemName = (name) => {
  if (!name) return "";
  const abbreviations = ["tv", "ac", "led", "cft", "bhk", "usb", "pc", "dvd", "lcd", "lpg"];
  return name
    .toLowerCase()
    .split(" ")
    .map(word => {
      if (abbreviations.includes(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

/* Helper: Categorize item by keyword or category */
const getItemCategoryIcon = (category = "", itemName = "") => {
  const cat = (category || "").toLowerCase();
  const name = (itemName || "").toLowerCase();

  if (
    cat.includes("furn") ||
    name.includes("sofa") ||
    name.includes("bed") ||
    name.includes("chair") ||
    name.includes("table") ||
    name.includes("wardrobe") ||
    name.includes("almirah") ||
    name.includes("cupboard") ||
    name.includes("desk") ||
    name.includes("stool")
  ) {
    return <WeekendOutlined sx={{ fontSize: 17, color: "#4f46e5" }} />;
  }
  if (
    cat.includes("elect") ||
    name.includes("tv") ||
    name.includes("fridge") ||
    name.includes("refrigerator") ||
    name.includes("washing") ||
    name.includes("ac") ||
    name.includes("cooler") ||
    name.includes("computer") ||
    name.includes("monitor") ||
    name.includes("microwave") ||
    name.includes("oven")
  ) {
    return <TvOutlined sx={{ fontSize: 17, color: "#0284c7" }} />;
  }
  if (
    cat.includes("kitchen") ||
    name.includes("gas") ||
    name.includes("stove") ||
    name.includes("crock") ||
    name.includes("utensil") ||
    name.includes("mixer") ||
    name.includes("cooker") ||
    name.includes("cylinder")
  ) {
    return <KitchenOutlined sx={{ fontSize: 17, color: "#ea580c" }} />;
  }
  if (
    cat.includes("vehic") ||
    name.includes("bike") ||
    name.includes("scooter") ||
    name.includes("cycle") ||
    name.includes("car")
  ) {
    return <TwoWheelerOutlined sx={{ fontSize: 17, color: "#16a34a" }} />;
  }
  if (
    cat.includes("box") ||
    cat.includes("carton") ||
    name.includes("box") ||
    name.includes("luggage") ||
    name.includes("suitcase") ||
    name.includes("bag")
  ) {
    return <Inventory2Outlined sx={{ fontSize: 17, color: "#8b5cf6" }} />;
  }
  return <CategoryOutlined sx={{ fontSize: 17, color: "#64748b" }} />;
};

/* Helper: Moving Vehicle Capacity recommendation */
const getVehicleRecommendation = (cft) => {
  if (cft <= 0) return null;
  if (cft <= 120) {
    return {
      type: "Tata Ace / Mini Truck",
      capacity: 120,
      description: "Ideal for 1 RK / Bachelor setup / Light essentials",
      pct: Math.min(100, Math.max(15, Math.round((cft / 120) * 100))),
      color: "#059669",
      bg: "rgba(5, 150, 105, 0.08)"
    };
  }
  if (cft <= 350) {
    return {
      type: "8ft / 9ft Pickup Truck",
      capacity: 350,
      description: "Recommended for 1 BHK / Studio Apartment move",
      pct: Math.min(100, Math.max(15, Math.round((cft / 350) * 100))),
      color: "#2563eb",
      bg: "rgba(37, 99, 235, 0.08)"
    };
  }
  if (cft <= 650) {
    return {
      type: "14ft Canter Truck",
      capacity: 650,
      description: "Standard for 2 BHK / Moderate 3 BHK Relocation",
      pct: Math.min(100, Math.max(15, Math.round((cft / 650) * 100))),
      color: "#4f46e5",
      bg: "rgba(79, 70, 229, 0.08)"
    };
  }
  if (cft <= 1000) {
    return {
      type: "17ft Heavy Canter",
      capacity: 1000,
      description: "Spacious for Large 3 BHK / 4 BHK Home",
      pct: Math.min(100, Math.max(15, Math.round((cft / 1000) * 100))),
      color: "#7c3aed",
      bg: "rgba(124, 58, 237, 0.08)"
    };
  }
  return {
    type: "20ft Dedicated Fleet / Container",
    capacity: 1400,
    description: "Designed for Villa / 4+ BHK / Multi-load shifting",
    pct: Math.min(100, Math.max(15, Math.round((cft / 1400) * 100))),
    color: "#d97706",
    bg: "rgba(217, 119, 6, 0.08)"
  };
};

const Step1_SelectItems = ({
  bookingData,
  onUpdate,
  onNext,
  inventoryData,
  organizedInventory,
  loading
}) => {
  const { selectedItems, categories } = bookingData;

  const [activeCategory, setActiveCategory] = useState(categories[0] || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [confirmClear, setConfirmClear] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const itemsTopRef = useRef(null);

  /* ============================
      FLATTEN INVENTORY
  ============================ */
  const allItemsWithCategory = useMemo(() => {
    return Object.entries(organizedInventory).flatMap(
      ([category, items]) =>
        items.map(item => ({ ...item, __category: category }))
    );
  }, [organizedInventory]);

  /* ============================
      FILTER ITEMS
  ============================ */
  const filteredItems = useMemo(() => {
    let items = [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = allItemsWithCategory.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          (item.description &&
            item.description.toLowerCase().includes(q))
      );
    } else {
      items = organizedInventory[activeCategory] || [];
    }

    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [
    searchQuery,
    allItemsWithCategory,
    activeCategory,
    organizedInventory
  ]);

  /* ============================
      AUTO CATEGORY SWITCH
  ============================ */
  useEffect(() => {
    if (!searchQuery) return;

    const q = searchQuery.toLowerCase();
    const match = allItemsWithCategory.find(
      item =>
        item.name.toLowerCase().includes(q) ||
        (item.description &&
          item.description.toLowerCase().includes(q))
    );

    if (match && match.__category !== activeCategory) {
      setActiveCategory(match.__category);
    }
  }, [searchQuery, allItemsWithCategory, activeCategory]);

  /* ============================
      RESET PAGE
  ============================ */
  useEffect(() => {
    setPage(1);
  }, [activeCategory, searchQuery]);

  /* ============================
      PAGINATION
  ============================ */
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, page]);

  const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, filteredItems.length);

  /* ============================
      SCROLL TO TOP ON PAGE CHANGE
  ============================ */
  useEffect(() => {
    if (itemsTopRef.current) {
      itemsTopRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [page]);

  /* ============================
      ACTION HANDLERS
  ============================ */
  const handleAddItem = (itemID) => {
    const exist = selectedItems.find(i => i.itemID === itemID);

    if (exist) {
      onUpdate({
        selectedItems: selectedItems.map(i =>
          i.itemID === itemID
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      });
    } else {
      const item = inventoryData.find(i => i.itemID === itemID);
      if (item) {
        onUpdate({
          selectedItems: [
            ...selectedItems,
            {
              itemID: item.itemID,
              name: item.name,
              sizeCFT: item.sizeCFT,
              quantity: 1
            }
          ]
        });
      }
    }
  };

  const handleRemoveItem = (itemID) => {
    onUpdate({
      selectedItems: selectedItems
        .map(i =>
          i.itemID === itemID
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter(i => i.quantity > 0)
    });
  };

  const handleDeleteRow = (itemID) => {
    onUpdate({
      selectedItems: selectedItems.filter(i => i.itemID !== itemID)
    });
  };

  const handleClearAll = () => {
    onUpdate({ selectedItems: [] });
    setConfirmClear(false);
  };

  /* ============================
      TOTALS & VEHICLE ESTIMATE
  ============================ */
  const totalQuantity = selectedItems.reduce(
    (s, i) => s + i.quantity,
    0
  );

  const totalCFT = selectedItems.reduce(
    (s, i) => s + i.quantity * i.sizeCFT,
    0
  );

  const vehicleRecommendation = useMemo(() => {
    return getVehicleRecommendation(totalCFT);
  }, [totalCFT]);

  /* ============================
      SELECTION CONTENT COMPONENT (Shared between Desktop & Mobile)
  ============================ */
  const renderSelectionContent = () => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            sx={{
              background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
              color: "white",
              width: 38,
              height: 38,
              boxShadow: "0 4px 10px rgba(79, 70, 229, 0.3)"
            }}
          >
            <ShoppingCartOutlined fontSize="small" />
          </Avatar>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography fontWeight={800} fontSize="15.5px" color="text.primary">
                Your Selection
              </Typography>
              {totalQuantity > 0 && (
                <Box
                  sx={{
                    bgcolor: "rgba(79, 70, 229, 0.1)",
                    color: "primary.main",
                    fontSize: "11px",
                    fontWeight: 700,
                    px: 1,
                    py: 0.2,
                    borderRadius: "999px"
                  }}
                >
                  {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                </Box>
              )}
            </Stack>
            <Typography fontSize="12px" color="text.secondary">
              Review before continuing
            </Typography>
          </Box>
        </Stack>

        {selectedItems.length > 0 && (
          <Box>
            {confirmClear ? (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={handleClearAll}
                  sx={{
                    fontSize: "11px",
                    py: 0.4,
                    px: 1,
                    minWidth: "auto",
                    textTransform: "none",
                    fontWeight: 700
                  }}
                >
                  Confirm
                </Button>
                <IconButton
                  size="small"
                  onClick={() => setConfirmClear(false)}
                  sx={{ width: 24, height: 24 }}
                >
                  <Close sx={{ fontSize: 14 }} />
                </IconButton>
              </Stack>
            ) : (
              <Tooltip title="Clear all selected items">
                <Button
                  size="small"
                  onClick={() => setConfirmClear(true)}
                  startIcon={<DeleteSweepOutlined sx={{ fontSize: 16 }} />}
                  sx={{
                    color: "text.secondary",
                    fontSize: "11.5px",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { color: "error.main", bgcolor: "error.50" }
                  }}
                >
                  Clear
                </Button>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>

      {/* METRIC TILES */}
      <Grid container spacing={1.25} sx={{ mt: 0.5, mb: 1.5 }}>
        <Grid item xs={6}>
          <Box
            sx={{
              p: 1.4,
              borderRadius: 2.5,
              bgcolor: "grey.50",
              border: "1px solid",
              borderColor: "grey.200",
              textAlign: "center",
              transition: "all 0.2s ease"
            }}
          >
            <Typography
              fontSize="20px"
              fontWeight={800}
              color="text.primary"
              sx={{ fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}
            >
              {totalQuantity}
            </Typography>
            <Typography fontSize="10.5px" fontWeight={700} color="text.secondary" sx={{ letterSpacing: "0.04em" }}>
              TOTAL ITEMS
            </Typography>
            <Typography fontSize="10px" color="text.disabled" sx={{ mt: 0.2 }}>
              {selectedItems.length} unique {selectedItems.length === 1 ? "type" : "types"}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box
            sx={{
              p: 1.4,
              borderRadius: 2.5,
              bgcolor: "rgba(79, 70, 229, 0.05)",
              border: "1px solid",
              borderColor: "rgba(79, 70, 229, 0.2)",
              textAlign: "center",
              transition: "all 0.2s ease"
            }}
          >
            <Typography
              fontSize="20px"
              fontWeight={800}
              color="primary.main"
              sx={{ fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}
            >
              {totalCFT.toFixed(1)}
            </Typography>
            <Typography fontSize="10.5px" fontWeight={700} color="primary.main" sx={{ letterSpacing: "0.04em" }}>
              TOTAL CFT
            </Typography>
            <Typography fontSize="10px" color="primary.dark" sx={{ mt: 0.2, opacity: 0.85 }}>
              Cubic Feet Volume
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* VEHICLE CAPACITY INDICATOR */}
      {vehicleRecommendation && (
        <Box
          sx={{
            mb: 2,
            p: 1.35,
            borderRadius: 2.5,
            bgcolor: vehicleRecommendation.bg,
            border: "1px solid",
            borderColor: "rgba(0,0,0,0.06)"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.6 }}>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <LocalShippingOutlined sx={{ fontSize: 17, color: vehicleRecommendation.color }} />
              <Typography fontSize="12px" fontWeight={700} sx={{ color: vehicleRecommendation.color }}>
                {vehicleRecommendation.type}
              </Typography>
            </Stack>
            <Typography fontSize="11px" fontWeight={700} sx={{ color: vehicleRecommendation.color, fontVariantNumeric: "tabular-nums" }}>
              ~{vehicleRecommendation.pct}% load
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={vehicleRecommendation.pct}
            sx={{
              height: 5,
              borderRadius: 3,
              bgcolor: "rgba(0,0,0,0.06)",
              "& .MuiLinearProgress-bar": {
                bgcolor: vehicleRecommendation.color,
                borderRadius: 3
              }
            }}
          />

          <Typography fontSize="10.5px" color="text.secondary" sx={{ mt: 0.6, lineHeight: 1.3 }}>
            {vehicleRecommendation.description}
          </Typography>
        </Box>
      )}

      <Divider sx={{ mb: 1.5 }} />

      {/* SELECTED ITEMS LIST */}
      <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5, minHeight: 180 }}>
        {selectedItems.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 5, px: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "grey.100",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
                color: "grey.400"
              }}
            >
              <ShoppingCartOutlined sx={{ fontSize: 28 }} />
            </Box>
            <Typography fontSize="14px" color="text.primary" fontWeight={700}>
              No items selected yet
            </Typography>
            <Typography fontSize="12px" color="text.secondary" sx={{ mt: 0.5, maxWidth: 220, mx: "auto" }}>
              Tap <strong>"+"</strong> on any item from the catalog to build your relocation inventory.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1}>
            {selectedItems.map(item => {
              const itemTotalCFT = (item.quantity * (item.sizeCFT || 0)).toFixed(1);
              return (
                <Box
                  key={item.itemID}
                  sx={{
                    p: 1.2,
                    borderRadius: 2.5,
                    bgcolor: "white",
                    border: "1px solid",
                    borderColor: "grey.200",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    transition: "all 0.18s ease",
                    "&:hover": {
                      borderColor: "primary.300",
                      boxShadow: "0 3px 10px rgba(79, 70, 229, 0.08)"
                    }
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    {/* Item Icon & Details */}
                    <Stack direction="row" alignItems="center" spacing={1.1} sx={{ minWidth: 0, flex: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          bgcolor: "grey.50",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          border: "1px solid",
                          borderColor: "grey.200"
                        }}
                      >
                        {getItemCategoryIcon(item.category, item.name)}
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          fontSize="12.5px"
                          fontWeight={700}
                          color="text.primary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            lineHeight: 1.25
                          }}
                          title={item.name}
                        >
                          {formatItemName(item.name)}
                        </Typography>
                        <Stack direction="row" spacing={0.7} alignItems="center" sx={{ mt: 0.2 }}>
                          <Typography fontSize="11px" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
                            {item.sizeCFT} CFT each
                          </Typography>
                          <Typography fontSize="11px" color="text.disabled">
                            ·
                          </Typography>
                          <Typography
                            fontSize="11px"
                            fontWeight={700}
                            color="primary.main"
                            sx={{ fontVariantNumeric: "tabular-nums" }}
                          >
                            {itemTotalCFT} CFT total
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>

                    {/* Stepper + Delete button */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, flexShrink: 0 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(item.itemID)}
                        sx={{
                          width: 26,
                          height: 26,
                          bgcolor: "error.50",
                          color: "error.main",
                          border: "1px solid",
                          borderColor: "error.100",
                          "&:hover": { bgcolor: "error.100" }
                        }}
                        title={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                      >
                        {item.quantity === 1 ? (
                          <DeleteOutline sx={{ fontSize: 14 }} />
                        ) : (
                          <Remove sx={{ fontSize: 14 }} />
                        )}
                      </IconButton>

                      <Box
                        sx={{
                          minWidth: 26,
                          height: 26,
                          border: "1px solid",
                          borderColor: "grey.300",
                          borderRadius: 1.5,
                          fontSize: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          bgcolor: "white",
                          fontVariantNumeric: "tabular-nums"
                        }}
                      >
                        {item.quantity}
                      </Box>

                      <IconButton
                        size="small"
                        onClick={() => handleAddItem(item.itemID)}
                        sx={{
                          width: 26,
                          height: 26,
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" }
                        }}
                        title="Increase quantity"
                      >
                        <Add sx={{ fontSize: 14 }} />
                      </IconButton>

                      <Tooltip title="Remove row">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteRow(item.itemID)}
                          sx={{
                            width: 22,
                            height: 22,
                            color: "grey.400",
                            "&:hover": { color: "error.main", bgcolor: "transparent" }
                          }}
                        >
                          <Close sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* FOOTER CTA */}
      <Box sx={{ pt: 2, mt: "auto" }}>
        <Button
          fullWidth
          variant="contained"
          disabled={selectedItems.length === 0 || loading}
          onClick={onNext}
          endIcon={<ArrowForward />}
          sx={{
            py: 1.35,
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
          {selectedItems.length > 0
            ? `Continue (${totalQuantity} items · ${totalCFT.toFixed(1)} CFT)`
            : "Select Items to Continue"}
        </Button>
      </Box>
    </Box>
  );

  /* ============================
      MAIN UI RENDER
  ============================ */
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* SEARCH HERO BANNER */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          mb: 3,
          borderRadius: 3.5,
          background: "linear-gradient(135deg, #4338ca 0%, #4f46e5 50%, #6366f1 100%)",
          color: "white",
          boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.3)"
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 42, height: 42 }}>
            <Inventory2 fontSize="small" />
          </Avatar>
          <Box>
            <Typography fontWeight={800} fontSize={{ xs: "18px", sm: "20px" }} letterSpacing="-0.01em">
              Select Your Items
            </Typography>
            <Typography fontSize="12.5px" sx={{ opacity: 0.9 }}>
              Browse categories or search to build your inventory list
            </Typography>
          </Box>
        </Stack>

        <TextField
          fullWidth
          placeholder="Search items by name (e.g. Sofa, Dining Table, Bed, Refrigerator)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            bgcolor: "white",
            borderRadius: 2.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              fontSize: "14px",
              "& fieldset": { border: "none" }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" sx={{ color: "primary.main" }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery("")}>
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Paper>

      {/* CATEGORY CHIPS */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 3,
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "grey.300", borderRadius: 3 }
        }}
      >
        {categories.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <Chip
              key={cat}
              label={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSearchQuery("");
              }}
              icon={
                isActive
                  ? <CheckCircle fontSize="small" />
                  : <Category fontSize="small" />
              }
              sx={{
                fontWeight: 700,
                fontSize: "12.5px",
                px: 1,
                py: 2.2,
                borderRadius: "999px",
                flexShrink: 0,
                cursor: "pointer",
                transition: "all 0.18s ease",
                ...(isActive
                  ? {
                      background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                      color: "white",
                      boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
                      "& .MuiChip-icon": { color: "white" }
                    }
                  : {
                      bgcolor: "white",
                      color: "text.primary",
                      border: "1px solid",
                      borderColor: "grey.200",
                      "&:hover": {
                        borderColor: "primary.main",
                        color: "primary.main",
                        bgcolor: "rgba(79, 70, 229, 0.04)"
                      }
                    })
              }}
            />
          );
        })}
      </Stack>

      <Grid container spacing={2.5}>
        {/* LEFT COLUMN: ITEM CATALOG GRID */}
        <Grid item xs={12} lg={8} ref={itemsTopRef}>
          {filteredItems.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                py: 8,
                textAlign: "center",
                borderRadius: 3,
                border: "1px dashed",
                borderColor: "grey.300",
                bgcolor: "grey.50"
              }}
            >
              <Inventory2 sx={{ fontSize: 44, color: "grey.400", mb: 1.5 }} />
              <Typography fontWeight={700} color="text.primary" fontSize="16px">
                No items found
              </Typography>
              <Typography fontSize="13px" color="text.secondary" sx={{ mt: 0.5 }}>
                Try searching for a different keyword or switch categories above
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {paginatedItems.map(item => {
                const selected = selectedItems.find(
                  i => i.itemID === item.itemID
                );
                const qty = selected?.quantity ?? 0;
                const isInCart = qty > 0;

                return (
                  <Grid item xs={12} sm={6} md={3} key={item.itemID}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        minHeight: 120,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        border: "1.5px solid",
                        borderColor: isInCart ? "primary.main" : "grey.200",
                        bgcolor: isInCart ? "rgba(79, 70, 229, 0.02)" : "white",
                        boxShadow: isInCart
                          ? "0 4px 16px rgba(79, 70, 229, 0.12)"
                          : "0 1px 3px rgba(0,0,0,0.03)",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                          borderColor: isInCart ? "primary.main" : "primary.light",
                          boxShadow: "0 6px 18px rgba(79, 70, 229, 0.14)",
                          transform: "translateY(-2px)"
                        }
                      }}
                    >
                      {/* Active Quantity Badge in Top-Right */}
                      {isInCart && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "primary.main",
                            color: "white",
                            borderRadius: "999px",
                            height: 20,
                            minWidth: 20,
                            fontSize: "11px",
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            px: 0.7,
                            boxShadow: "0 2px 6px rgba(79, 70, 229, 0.4)",
                            fontVariantNumeric: "tabular-nums"
                          }}
                        >
                          ✓ {qty}
                        </Box>
                      )}

                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          p: 1.75,
                          "&:last-child": { pb: 1.75 }
                        }}
                      >
                        {/* Item Name */}
                        <Typography
                          fontSize="13px"
                          fontWeight={700}
                          color="text.primary"
                          sx={{
                            lineHeight: 1.35,
                            minHeight: 36,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            pr: isInCart ? 3 : 0
                          }}
                          title={item.name}
                        >
                          {formatItemName(item.name)}
                        </Typography>

                        {/* Volume Tag */}
                        <Box sx={{ mt: 0.5, mb: 1.25 }}>
                          <Typography
                            component="span"
                            fontSize="11px"
                            fontWeight={600}
                            color={isInCart ? "primary.main" : "text.secondary"}
                            sx={{
                              bgcolor: isInCart ? "rgba(79, 70, 229, 0.08)" : "grey.100",
                              px: 0.8,
                              py: 0.25,
                              borderRadius: 1,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.4,
                              fontVariantNumeric: "tabular-nums"
                            }}
                          >
                            <StraightenOutlined sx={{ fontSize: 12, opacity: 0.75 }} />
                            {item.sizeCFT || 0} CFT
                          </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />

                        {/* Quantity Stepper */}
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.8,
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          <IconButton
                            disabled={!selected || selected.quantity <= 0}
                            onClick={() => handleRemoveItem(item.itemID)}
                            size="small"
                            sx={{
                              bgcolor: "error.50",
                              color: "error.main",
                              width: 32,
                              height: 32,
                              borderRadius: 2,
                              transition: "all 0.15s ease",
                              "&:hover": { bgcolor: "error.100" },
                              "&.Mui-disabled": { bgcolor: "grey.100", color: "grey.300" }
                            }}
                          >
                            <Remove fontSize="small" />
                          </IconButton>

                          <Box
                            sx={{
                              flex: 1,
                              height: 32,
                              border: "1.5px solid",
                              borderColor: isInCart ? "primary.main" : "grey.200",
                              borderRadius: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              fontWeight: 800,
                              color: isInCart ? "primary.main" : "text.secondary",
                              bgcolor: isInCart ? "rgba(79, 70, 229, 0.06)" : "white",
                              fontVariantNumeric: "tabular-nums"
                            }}
                          >
                            {qty}
                          </Box>

                          <IconButton
                            onClick={() => handleAddItem(item.itemID)}
                            size="small"
                            sx={{
                              bgcolor: "primary.main",
                              color: "white",
                              width: 32,
                              height: 32,
                              borderRadius: 2,
                              transition: "all 0.15s ease",
                              "&:hover": { bgcolor: "primary.dark" }
                            }}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography fontSize="12.5px" color="text.secondary" sx={{ mb: 1.25 }}>
                Showing <strong>{startItem}–{endItem}</strong> of{" "}
                <strong>{filteredItems.length}</strong> items
              </Typography>

              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, v) => setPage(v)}
                size={isMobile ? "small" : "medium"}
                color="primary"
                shape="rounded"
                sx={{
                  display: "inline-flex",
                  "& .MuiPaginationItem-root": { fontWeight: 700 }
                }}
              />
            </Box>
          )}
        </Grid>

        {/* RIGHT COLUMN: THE SELECTED ITEMS SECTION PANEL */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              height: { lg: "calc(100vh - 120px)", xs: "auto" },
              display: "flex",
              flexDirection: "column",
              position: { lg: "sticky", xs: "static" },
              top: 24,
              borderRadius: 3.5,
              border: "1.5px solid",
              borderColor: "grey.200",
              bgcolor: "white",
              boxShadow: "0 10px 30px -10px rgba(15, 23, 42, 0.08)"
            }}
          >
            {renderSelectionContent()}
          </Paper>
        </Grid>
      </Grid>

      {/* MOBILE STICKY FLOATING ACTION BAR */}
      {isMobile && totalQuantity > 0 && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 16,
            left: 16,
            right: 16,
            zIndex: 1200,
            p: 1.5,
            borderRadius: 3,
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
            backdropFilter: "blur(10px)"
          }}
        >
          <Box
            onClick={() => setMobileDrawerOpen(true)}
            sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 1.25 }}
          >
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                width: 36,
                height: 36,
                color: "white"
              }}
            >
              <ShoppingCartOutlined fontSize="small" />
            </Avatar>
            <Box>
              <Typography fontSize="13px" fontWeight={800} color="white">
                {totalQuantity} {totalQuantity === 1 ? "Item" : "Items"} · {totalCFT.toFixed(1)} CFT
              </Typography>
              <Typography fontSize="11px" sx={{ color: "rgba(255,255,255,0.75)" }}>
                Tap to edit selection
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            size="small"
            onClick={onNext}
            endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
            sx={{
              bgcolor: "#4f46e5",
              color: "white",
              fontWeight: 800,
              textTransform: "none",
              fontSize: "13px",
              px: 2,
              py: 0.9,
              borderRadius: 2,
              "&:hover": { bgcolor: "#4338ca" }
            }}
          >
            Continue
          </Button>
        </Paper>
      )}

      {/* MOBILE SELECTION DRAWER */}
      {isMobile && (
        <Drawer
          anchor="bottom"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              p: 2.5,
              maxHeight: "85vh"
            }
          }}
        >
          <Box sx={{ width: 40, height: 4, bgcolor: "grey.300", borderRadius: 2, mx: "auto", mb: 2 }} />
          {renderSelectionContent()}
        </Drawer>
      )}
    </Container>
  );
};

export default Step1_SelectItems;