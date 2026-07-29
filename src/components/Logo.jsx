/**
 * Daily Pans mark — a pan silhouette drawn inline so the brand carries no
 * leftover raster artwork. `tone="light"` renders it for dark backgrounds.
 */
export default function LogoMark({ className = "h-10 w-10", tone = "dark" }) {
  const stroke = tone === "light" ? "currentColor" : "hsl(var(--primary))";
  const fill = tone === "light" ? "currentColor" : "hsl(var(--primary))";

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Daily Pans"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* pan body */}
      <path
        d="M7 20h26v6a13 13 0 0 1-13 13A13 13 0 0 1 7 26v-6Z"
        stroke={stroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* handle */}
      <path
        d="M33 23h5a4 4 0 0 1 0 8h-2"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* steam */}
      <path
        d="M15 14c0-3 3-3 3-6M22 14c0-4 3-4 3-8M29 14c0-3 2-3 2-6"
        stroke={fill}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}
