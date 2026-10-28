import React, { useId } from "react";

/**
 * Official PackYatra Formal Corporate Brand Logo
 * 
 * Formal Corporate Identity for PackYatra:
 * - Architectural Heraldic Shield & 3D Isometric Transit Cube emblem
 *   featuring safe packaging ('P'), onward journey ('Y'), directional speed arrow,
 *   and 5-star gold service trust star.
 * - Bold Corporate Wordmark: "PACK" in solid executive navy/white + "YATRA" in royal cobalt
 * - Formal corporate accent wedge in refined amber gold
 * - High-tracking formal sub-brand: "RELOCATIONS & LOGISTICS"
 * 
 * Props:
 * - height: number (default 44)
 * - className: string
 * - style: object
 * - isDark: boolean (for dark backgrounds like footers or dark banners)
 * - showSubtitle: boolean (whether to render the tagline)
 * - subtitle: string (custom tagline override)
 */
const PackYatraLogo = ({ 
  height = 44, 
  className = "", 
  style = {},
  isDark = false,
  showSubtitle = true,
  subtitle = "RELOCATIONS & LOGISTICS"
}) => {
  const uniqueId = useId().replace(/:/g, "_");

  // Color Palette - Formal Corporate Logistics Tier
  const navyColor = isDark ? "#FFFFFF" : "#0A192F";
  const blueColor = isDark ? "#60A5FA" : "#1D4ED8";
  const goldAccent = isDark ? "#F59E0B" : "#D97706";
  const dividerColor = isDark ? "rgba(255, 255, 255, 0.16)" : "#E2E8F0";
  const subtitleColor = isDark ? "#94A3B8" : "#475569";

  // Gradient IDs
  const shieldGradId = `pyShieldGrad_${uniqueId}`;
  const topFaceGradId = `pyTopGrad_${uniqueId}`;
  const leftFaceGradId = `pyLeftGrad_${uniqueId}`;
  const rightFaceGradId = `pyRightGrad_${uniqueId}`;

  // ViewBox calculation
  const viewBox = showSubtitle ? "0 0 405 96" : "0 0 398 70";

  return (
    <div 
      className={`packyatra-brand-logo ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        userSelect: "none",
        cursor: "pointer",
        transition: "transform 0.2s ease",
        ...style
      }}
      aria-label="PackYatra Relocations & Logistics"
    >
      <svg 
        viewBox={viewBox} 
        style={{ 
          height: `${height}px`, 
          width: "auto",
          display: "block",
          overflow: "visible"
        }}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Outer Shield Gradient */}
          <linearGradient id={shieldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#1E293B" : "#0A192F"} />
            <stop offset="100%" stopColor={isDark ? "#0F172A" : "#1E3A8A"} />
          </linearGradient>

          {/* Cube Top Face Gradient (Transit Direction) */}
          <linearGradient id={topFaceGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Cube Left Face Gradient (Packaging / Structural Base) */}
          <linearGradient id={leftFaceGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Cube Right Face Gradient (Delivery Speed) */}
          <linearGradient id={rightFaceGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>

        {showSubtitle ? (
          /* ==========================================================
             FULL FORMAL LOCKUP WITH SUBTITLE (96px height)
             ========================================================== */
          <g id="packyatra-formal-full">
            {/* --- FORMAL EMBLEM MARK (LEFT: X=4 to 92, Y=8 to 92) --- */}
            <g id="formal-emblem" transform="translate(0, 0)">
              {/* Outer Shield Body */}
              <path 
                d="M 22 10 L 74 10 C 84 10 90 16 90 26 L 90 54 C 90 73 58 88 48 92 C 38 88 6 73 6 54 L 6 26 C 6 16 12 10 22 10 Z" 
                fill={`url(#${shieldGradId})`}
                stroke={isDark ? "rgba(96, 165, 250, 0.45)" : "rgba(37, 99, 235, 0.3)"}
                strokeWidth="1.8"
              />

              {/* Inner Shield Inset Hairline for Prestige Heraldry */}
              <path 
                d="M 24 14 L 72 14 C 80 14 86 19 86 28 L 86 52 C 86 68 56 82 48 86 C 40 82 10 68 10 52 L 10 28 C 10 19 16 14 24 14 Z" 
                fill="none"
                stroke={isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.18)"}
                strokeWidth="1"
              />

              {/* 3D Isometric Freight Transit Cube */}
              {/* Top Face (Roof / Forward Journey) */}
              <polygon 
                points="48,24 72,37 48,50 24,37" 
                fill={`url(#${topFaceGradId})`} 
              />
              {/* Forward Speed Arrow on Top Face */}
              <path 
                d="M 43 38 L 52 38 L 54 36 L 49 33 L 42 33 L 45 36 Z" 
                fill="#FFFFFF" 
                opacity="0.95"
              />

              {/* Left Face ('P' Structural Face) */}
              <polygon 
                points="24,37 48,50 48,72 24,59" 
                fill={`url(#${leftFaceGradId})`} 
              />
              {/* Stylized Architectural 'P' Emboss on Left Face */}
              <path 
                d="M 31 44 L 38 48 L 38 60 L 34 58 L 34 52 L 31 50 Z" 
                fill="rgba(255, 255, 255, 0.25)" 
              />
              <path 
                d="M 34 46 L 41 50 C 44 52 44 55 41 56 L 38 55 L 38 51 L 34 49 Z" 
                fill="rgba(255, 255, 255, 0.35)" 
              />

              {/* Right Face ('Y' Transit Face) */}
              <polygon 
                points="48,50 72,37 72,59 48,72" 
                fill={`url(#${rightFaceGradId})`} 
              />
              {/* Dynamic Transit Speed Stripe on Right Face */}
              <polygon 
                points="52,52 56,50 68,57 64,59" 
                fill="rgba(255, 255, 255, 0.3)" 
              />
              <polygon 
                points="54,58 58,56 68,62 64,64" 
                fill="rgba(255, 255, 255, 0.18)" 
              />

              {/* Cube Edges Definition */}
              <line x1="48" y1="50" x2="48" y2="72" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="24" y1="37" x2="48" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="72" y1="37" x2="48" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

              {/* 5-Star Quality Laurel & Gold Star Seal */}
              <path 
                d="M 34 76 Q 48 81 62 76" 
                stroke={goldAccent} 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                fill="none" 
              />
              <polygon 
                points="48,74 49.6,78 54,78 50.4,80.5 51.8,84.5 48,82 44.2,84.5 45.6,80.5 42,78 46.4,78" 
                fill={goldAccent} 
              />
            </g>

            {/* --- FORMAL WORDMARK (RIGHT: X=108 to 400) --- */}
            <g id="formal-wordmark">
              {/* Primary Name: PACK */}
              <text 
                x="108" 
                y="52" 
                fill={navyColor} 
                fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
                fontSize="41" 
                fontWeight="900" 
                letterSpacing="-0.03em"
              >
                PACK
              </text>

              {/* Primary Name: YATRA */}
              <text 
                x="234" 
                y="52" 
                fill={blueColor} 
                fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
                fontSize="41" 
                fontWeight="900" 
                letterSpacing="-0.03em"
              >
                YATRA
              </text>

              {/* Corporate Precision Gold Wedge */}
              <polygon 
                points="380,24 388,24 382,52 374,52" 
                fill={goldAccent} 
              />

              {/* Architectural Separation Rule */}
              <line 
                x1="109" 
                y1="64" 
                x2="388" 
                y2="64" 
                stroke={dividerColor} 
                strokeWidth="1.4" 
                strokeLinecap="round" 
              />

              {/* Formal Subtitle Tagline */}
              <text 
                x="110" 
                y="81" 
                fill={subtitleColor} 
                fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
                fontSize="10.8" 
                fontWeight="800" 
                letterSpacing="0.32em"
              >
                {subtitle}
              </text>
            </g>
          </g>
        ) : (
          /* ==========================================================
             COMPACT HORIZONTAL LOCKUP (NO SUBTITLE - 70px height)
             ========================================================== */
          <g id="packyatra-formal-compact">
            {/* --- COMPACT EMBLEM MARK --- */}
            <g id="formal-emblem-compact" transform="translate(0, -6)">
              {/* Outer Shield Body */}
              <path 
                d="M 22 14 L 74 14 C 84 14 90 20 90 30 L 90 52 C 90 69 58 82 48 86 C 38 82 6 69 6 52 L 6 30 C 6 20 12 14 22 14 Z" 
                fill={`url(#${shieldGradId})`}
                stroke={isDark ? "rgba(96, 165, 250, 0.45)" : "rgba(37, 99, 235, 0.3)"}
                strokeWidth="1.8"
              />

              {/* 3D Isometric Freight Cube */}
              <polygon 
                points="48,25 70,37 48,49 26,37" 
                fill={`url(#${topFaceGradId})`} 
              />
              <path 
                d="M 44 38 L 51 38 L 53 36 L 49 33 L 43 33 L 46 36 Z" 
                fill="#FFFFFF" 
                opacity="0.95"
              />

              <polygon 
                points="26,37 48,49 48,68 26,56" 
                fill={`url(#${leftFaceGradId})`} 
              />
              <polygon 
                points="48,49 70,37 70,56 48,68" 
                fill={`url(#${rightFaceGradId})`} 
              />

              {/* Cube Edges */}
              <line x1="48" y1="49" x2="48" y2="68" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="26" y1="37" x2="48" y2="49" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="70" y1="37" x2="48" y2="49" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

              {/* Gold Star */}
              <polygon 
                points="48,71 49.3,74.5 53,74.5 50,76.5 51.2,80 48,78 44.8,80 46,76.5 43,74.5 46.7,74.5" 
                fill={goldAccent} 
              />
            </g>

            {/* --- COMPACT WORDMARK --- */}
            <g id="formal-wordmark-compact">
              <text 
                x="106" 
                y="48" 
                fill={navyColor} 
                fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
                fontSize="41" 
                fontWeight="900" 
                letterSpacing="-0.03em"
              >
                PACK
              </text>

              <text 
                x="232" 
                y="48" 
                fill={blueColor} 
                fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
                fontSize="41" 
                fontWeight="900" 
                letterSpacing="-0.03em"
              >
                YATRA
              </text>

              {/* Corporate Precision Gold Wedge */}
              <polygon 
                points="378,20 386,20 380,48 372,48" 
                fill={goldAccent} 
              />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default PackYatraLogo;
