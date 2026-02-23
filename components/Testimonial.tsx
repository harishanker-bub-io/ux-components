"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
// import "@500ux/components/styles/base.css"; This will be used in the production dont remove keep in all components

export const version = "3.1.0";

export interface TestimonialItem {
  id?: string;
  title?: string;
  description: string;
  name: string;
  avatar?: string;
  location?: string;
  rating?: number;
}

export interface TestimonialProps {
  /** Section title */
  title?: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Array of testimonials (or a JSON-serialized array) */
  items?: TestimonialItem[] | string;
  /** Minimum number of cards to show */
  minCards?: string;
  /** Maximum number of cards to show */
  maxCards?: string;

  /** "grid" or "carousel" */
  mode?: string;
  /** Grid columns: "1" | "2" | "3" | "4" | "5" | "6" */
  columns?: string;

  /** Carousel auto-play interval in ms. "0" disables */
  autoPlay?: string;
  /** Show dot navigation in carousel */
  showDots?: string;

  /** Theme options */
  cardBg?: string;
  cardBorder?: string;
  sectionBg?: string;
  accentColor?: string;
  headingColor?: string;
  bodyColor?: string;
  mutedColor?: string;
  starColor?: string;
  fontFamily?: string;
  radius?: string;
  shadow?: string;

  /** Event dispatcher from 500ux runtime */
  dispatch?: (eventName: string, payload?: Record<string, unknown>) => void;
}

const DEFAULT_ITEMS: TestimonialItem[] = [
  {
    id: "1",
    title: "Transformed our customer support overnight",
    description:
      "The AI bot was seamless and handled every edge case we threw at it. Our resolution time dropped 60% in the first month alone. Truly world-class work.",
    name: "Priya Sharma",
    location: "Mumbai, India",
    rating: 5,
  },
  {
    id: "2",
    title: "Outstanding technical depth",
    description:
      "Their DevOps team migrated our entire AWS infrastructure with zero downtime. The documentation they produced is some of the best I've seen in 20 years of engineering.",
    name: "Rahul Mehra",
    location: "Pune, India",
    rating: 5,
  },
  {
    id: "3",
    title: "A partner, not just a vendor",
    description:
      "From the first discovery call to go-live, every interaction felt genuinely collaborative. They understood our healthcare workflows and built something staff actually love.",
    name: "Dr. Fatima Al-Hassan",
    location: "Karachi, Pakistan",
    rating: 5,
  },
  {
    id: "4",
    title: "Best WhatsApp bot we've ever deployed",
    description:
      "We tried three other agencies before. Nobody came close to this level of polish. Lead capture on WhatsApp tripled within two weeks of launch.",
    name: "Ankit Joshi",
    location: "Bangalore, India",
    rating: 4,
  },
  {
    id: "5",
    title: "Reliable, fast, and detail-obsessed",
    description:
      "Our database migration had 10 million records and a tight SLA. They delivered on time with a resume-capable pipeline that was simply beautiful engineering.",
    name: "Sandra Obi",
    location: "Lagos, Nigeria",
    rating: 5,
  },
  {
    id: "6",
    title: "Highly recommend for real estate tech",
    description:
      "The platform handles thousands of concurrent users without a sweat. Image optimisation and gallery UX are genuinely impressive - our listings page is night-and-day better.",
    name: "Mehmet Yilmaz",
    location: "Istanbul, Turkey",
    rating: 5,
  },
];

const GRID_COL_MAP: Record<string, string> = {
  "1": "ux:grid-cols-1",
  "2": "ux:grid-cols-2",
  "3": "ux:grid-cols-3",
  "4": "ux:grid-cols-4",
  "5": "ux:grid-cols-5",
  "6": "ux:grid-cols-6",
};

const RADIUS_MAP: Record<string, string> = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
};

function getShadowValue(shadow: string, accentColor: string): string {
  if (shadow === "none") return "none";
  if (shadow === "sm") return "0 1px 4px rgba(0,0,0,0.08)";
  if (shadow === "md") return "0 4px 14px rgba(0,0,0,0.12)";
  if (shadow === "lg") return "0 8px 28px rgba(0,0,0,0.16)";
  if (shadow === "glow") return `0 0 0 1px ${accentColor}33, 0 4px 20px ${accentColor}44`;
  return "0 1px 4px rgba(0,0,0,0.08)";
}

function toSafeText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toSafeRating(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const rounded = Math.round(value);
  return Math.min(5, Math.max(1, rounded));
}

function normalizeItem(input: unknown, index: number): TestimonialItem {
  const raw = (typeof input === "object" && input !== null
    ? input
    : {}) as Partial<TestimonialItem>;

  return {
    id: toSafeText(raw.id),
    title: toSafeText(raw.title),
    description:
      toSafeText(raw.description) || "No testimonial provided.",
    name: toSafeText(raw.name) || `Reviewer ${index + 1}`,
    avatar: toSafeText(raw.avatar),
    location: toSafeText(raw.location),
    rating: toSafeRating(raw.rating),
  };
}

function parseItems(raw?: TestimonialProps["items"]): TestimonialItem[] {
  if (!raw) return DEFAULT_ITEMS;

  if (Array.isArray(raw)) {
    if (raw.length === 0) return DEFAULT_ITEMS;
    return raw.map((item, index) => normalizeItem(item, index));
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_ITEMS;
    }

    return parsed.map((item, index) => normalizeItem(item, index));
  } catch {
    return DEFAULT_ITEMS;
  }
}

function parseCount(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function IcLeft() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15,18 9,12 15,6" />
    </svg>
  );
}

function IcRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9,18 15,12 9,6" />
    </svg>
  );
}

function IcPin() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IcQuote() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" opacity="0.12">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}

function IcStar({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

type TestimonialCardProps = {
  item: TestimonialItem;
  index: number;
  cardStyle: CSSProperties;
  accentColor: string;
  headingColor: string;
  bodyColor: string;
  mutedColor: string;
  starColor: string;
  fontFamily: string;
};

function TestimonialCard({
  item,
  index,
  cardStyle,
  accentColor,
  headingColor,
  bodyColor,
  mutedColor,
  starColor,
  fontFamily,
}: TestimonialCardProps) {
  const heading = item.title?.trim() || `Testimonial ${index + 1}`;

  return (
    <article
      className="ux:relative ux:flex ux:flex-col ux:gap-4 ux:p-6 ux:h-full ux:overflow-hidden"
      style={cardStyle}
    >
      <div
        className="ux:absolute ux:top-4 ux:right-4 ux:pointer-events-none"
        style={{ color: accentColor }}
      >
        <IcQuote />
      </div>

      <div className="ux:flex ux:items-center ux:gap-3">
        {item.avatar ? (
          <img
            src={item.avatar}
            alt={item.name}
            className="ux:w-10 ux:h-10 ux:rounded-full ux:object-cover ux:shrink-0"
            style={{ border: `2px solid ${cardStyle.borderColor || "#e2e8f0"}` }}
          />
        ) : (
          <div
            className="ux:w-10 ux:h-10 ux:rounded-full ux:shrink-0 ux:flex ux:items-center ux:justify-center ux:text-xs ux:font-bold"
            style={{
              backgroundColor: `color-mix(in srgb, ${accentColor} 18%, #ffffff)`,
              color: accentColor,
              fontFamily,
              border: `2px solid color-mix(in srgb, ${accentColor} 25%, transparent)`,
            }}
          >
            {getInitials(item.name)}
          </div>
        )}

        <div className="ux:min-w-0">
          <p
            className="ux:m-0 ux:text-sm ux:font-semibold ux:leading-tight"
            style={{ color: headingColor, fontFamily }}
          >
            {item.name}
          </p>
          {item.location && (
            <span
              className="ux:flex ux:items-center ux:gap-1 ux:text-xs ux:mt-1"
              style={{ color: mutedColor, fontFamily }}
            >
              <IcPin />
              {item.location}
            </span>
          )}
        </div>
      </div>

      <h3
        className="ux:m-0 ux:text-sm ux:font-bold ux:leading-snug"
        style={{ color: headingColor, fontFamily }}
      >
        {heading}
      </h3>

      <p
        className="ux:m-0 ux:text-sm ux:leading-relaxed ux:flex-1"
        style={{ color: bodyColor, fontFamily }}
      >
        {item.description}
      </p>

      {item.rating !== undefined && (
        <div className="ux:flex ux:gap-1" style={{ color: starColor }}>
          {[1, 2, 3, 4, 5].map((step) => (
            <span key={step}>
              <IcStar filled={step <= item.rating!} />
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

export default function Testimonial({
  title,
  subtitle,
  items,
  minCards,
  maxCards,
  mode = "grid",
  columns = "3",
  autoPlay = "0",
  showDots = "true",
  cardBg = "#ffffff",
  cardBorder = "#e2e8f0",
  sectionBg = "transparent",
  accentColor = "#6366f1",
  headingColor = "#0f172a",
  bodyColor = "#475569",
  mutedColor = "#94a3b8",
  starColor = "#f59e0b",
  fontFamily = "inherit",
  radius = "xl",
  shadow = "sm",
  dispatch,
}: TestimonialProps) {
  const allItems = useMemo(() => parseItems(items), [items]);

  const visibleItems = useMemo(() => {
    const minValue = Math.max(1, parseCount(minCards, 1));
    const maxValue = parseCount(maxCards, allItems.length);
    const limit = Math.max(minValue, Math.min(maxValue, allItems.length));
    return allItems.slice(0, limit);
  }, [allItems, minCards, maxCards]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const isCarousel = mode === "carousel";
  const autoPlayMs = Math.max(0, parseCount(autoPlay, 0));
  const showDotNav = showDots !== "false";
  const gridClass = GRID_COL_MAP[columns] || GRID_COL_MAP["3"];
  const safeCurrentIndex =
    visibleItems.length === 0
      ? 0
      : Math.min(currentIndex, visibleItems.length - 1);

  const emitNavigateEvent = useCallback(
    (nextIndex: number) => {
      if (visibleItems.length === 0) return;

      const normalized = (nextIndex + visibleItems.length) % visibleItems.length;
      const current = visibleItems[normalized];

      setCurrentIndex(normalized);
      dispatch?.("navigate", {
        index: normalized,
        total: visibleItems.length,
        id: current.id ?? null,
        title: current.title ?? null,
        description: current.description,
        name: current.name,
        avatar: current.avatar ?? null,
        location: current.location ?? null,
        rating: current.rating ?? null,
      });
    },
    [visibleItems, dispatch]
  );

  useEffect(() => {
    if (!isCarousel || autoPlayMs <= 0 || visibleItems.length <= 1) return;

    const timer = setInterval(() => {
      emitNavigateEvent(safeCurrentIndex + 1);
    }, autoPlayMs);

    return () => clearInterval(timer);
  }, [isCarousel, autoPlayMs, visibleItems.length, safeCurrentIndex, emitNavigateEvent]);

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      backgroundColor: sectionBg,
      borderRadius: "4px",
      fontFamily,
    }),
    [sectionBg, fontFamily]
  );

  const cardStyle = useMemo<CSSProperties>(
    () => ({
      backgroundColor: cardBg,
      border: `1px solid ${cardBorder}`,
      borderColor: cardBorder,
      borderRadius: RADIUS_MAP[radius] || RADIUS_MAP.xl,
      boxShadow: getShadowValue(shadow, accentColor),
    }),
    [cardBg, cardBorder, radius, shadow, accentColor]
  );

  if (visibleItems.length === 0) {
    return (
      <div className="ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:p-8 ux:shadow-sm">
        <p className="ux:text-center ux:text-sm ux:text-slate-500">No testimonials available</p>
      </div>
    );
  }

  return (
    <div className="ux:w-full ux:flex ux:flex-col ux:gap-6" style={containerStyle}>
      {(title || subtitle) && (
        <div className="ux:text-center ux:flex ux:flex-col ux:gap-2">
          {title && (
            <h2
              className="ux:m-0 ux:text-3xl ux:font-bold"
              style={{ color: headingColor, fontFamily }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className="ux:m-0 ux:text-base ux:leading-relaxed ux:max-w-2xl ux:mx-auto"
              style={{ color: bodyColor, fontFamily }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {isCarousel ? (
        <div className="ux:flex ux:flex-col ux:gap-5">
          <div className="ux:flex ux:items-center ux:gap-3">
            <button
              type="button"
              className="ux:w-10 ux:h-10 ux:rounded-full ux:border ux:flex ux:items-center ux:justify-center ux:cursor-pointer ux:transition-colors"
              style={{
                borderColor: cardBorder,
                backgroundColor: cardBg,
                color: headingColor,
              }}
              onClick={() => emitNavigateEvent(safeCurrentIndex - 1)}
              aria-label="Previous testimonial"
            >
              <IcLeft />
            </button>

            <div className="ux:flex-1">
              <TestimonialCard
                item={visibleItems[safeCurrentIndex]}
                index={safeCurrentIndex}
                cardStyle={cardStyle}
                accentColor={accentColor}
                headingColor={headingColor}
                bodyColor={bodyColor}
                mutedColor={mutedColor}
                starColor={starColor}
                fontFamily={fontFamily}
              />
            </div>

            <button
              type="button"
              className="ux:w-10 ux:h-10 ux:rounded-full ux:border ux:flex ux:items-center ux:justify-center ux:cursor-pointer ux:transition-colors"
              style={{
                borderColor: cardBorder,
                backgroundColor: cardBg,
                color: headingColor,
              }}
              onClick={() => emitNavigateEvent(safeCurrentIndex + 1)}
              aria-label="Next testimonial"
            >
              <IcRight />
            </button>
          </div>

          {showDotNav && visibleItems.length > 1 && (
            <div className="ux:flex ux:flex-col ux:items-center ux:gap-2">
              <div className="ux:flex ux:gap-2">
                {visibleItems.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className="ux:h-2 ux:rounded-full ux:border-none ux:cursor-pointer ux:transition-all"
                    style={{
                      width: index === safeCurrentIndex ? 24 : 8,
                      backgroundColor:
                        index === safeCurrentIndex
                          ? accentColor
                          : `color-mix(in srgb, ${accentColor} 25%, ${cardBg})`,
                    }}
                    onClick={() => emitNavigateEvent(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <span className="ux:text-xs" style={{ color: mutedColor }}>
                {safeCurrentIndex + 1} / {visibleItems.length}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className={`ux:grid ${gridClass} ux:gap-5`}>
          {visibleItems.map((item, index) => (
            <TestimonialCard
              key={item.id || index}
              item={item}
              index={index}
              cardStyle={cardStyle}
              accentColor={accentColor}
              headingColor={headingColor}
              bodyColor={bodyColor}
              mutedColor={mutedColor}
              starColor={starColor}
              fontFamily={fontFamily}
            />
          ))}
        </div>
      )}

      {allItems.length > visibleItems.length && (
        <p
          className="ux:mt-3 ux:text-xs ux:text-center"
          style={{ color: mutedColor }}
        >
          Showing {visibleItems.length} of {allItems.length} testimonials
        </p>
      )}
    </div>
  );
}
