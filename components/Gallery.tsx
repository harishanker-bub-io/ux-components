"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
// import "@500ux/components/styles/base.css"; This will be used in the production dont remove keep in all components

export const version = "1.1.0";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CustomField {
  name: string;
  value: string;
  icon?: string;
}

export interface GalleryItem {
  id?: string;
  url: string;
  link?: string;
  name?: string;
  alt?: string;
  title?: string;
  subheading?: string;
  customFields?: CustomField[];
  type?: "image" | "video" | "pdf";
}

/**
 * Color token bag — all optional, falls back to built-in defaults.
 * Pass hex / rgb / hsl / CSS color keywords.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  Token              Affects                                 │
 * │─────────────────────────────────────────────────────────────│
 * │  primaryColor       Active filmstrip ring, active border    │
 * │  cardBg             Card background                         │
 * │  cardBorderColor    Card border                             │
 * │  cardTitleColor     Card title text                         │
 * │  cardSubColor       Card subheading / meta text             │
 * │  modalOverlayColor  Lightbox backdrop (supports rgba)       │
 * │  modalBg            Lightbox dialog background              │
 * │  modalHeaderBorder  Separator line under modal header       │
 * │  modalMediaBg       Dark area behind the image/video        │
 * │  modalTextColor     Modal title text                        │
 * │  modalSubColor      Modal subheading / muted text           │
 * │  sidebarBg          Details side-panel background           │
 * │  sidebarLabelColor  Custom-field label (small caps)         │
 * │  sidebarValueColor  Custom-field value                      │
 * │  filmstripBg        Filmstrip bar background                │
 * │  galleryTitleColor  Gallery heading text                    │
 * │  gallerySubColor    Gallery subtitle text                   │
 * └─────────────────────────────────────────────────────────────┘
 */
export interface ColorTokens {
  primaryColor?: string;
  cardBg?: string;
  cardBorderColor?: string;
  cardTitleColor?: string;
  cardSubColor?: string;
  modalOverlayColor?: string;
  modalBg?: string;
  modalHeaderBorder?: string;
  modalMediaBg?: string;
  modalTextColor?: string;
  modalSubColor?: string;
  sidebarBg?: string;
  sidebarLabelColor?: string;
  sidebarValueColor?: string;
  filmstripBg?: string;
  galleryTitleColor?: string;
  gallerySubColor?: string;
}

export interface GalleryProps {
  title?: string;
  subtitle?: string;
  /**
   * Gallery items array (or JSON-serialized array).
   * Uses an empty list when omitted/invalid.
   */
  items?: GalleryItem[] | string;
  /** Number of grid columns: 1 | 2 | 3 | 4 (default 3) */
  columns?: number | string;
  minCards?: number | string;
  maxCards?: number | string;
  /** true (default) -> open lightbox | false -> follow item.link */
  openModal?: boolean | string;
  /** "square" (default) | "video" | "auto" */
  aspectRatio?: "square" | "video" | "auto" | string;
  /** "grid" (default) | "list" */
  layout?: "grid" | "list" | string;
  /** true (default) | false */
  showMeta?: boolean | string;
  /**
   * Color token object (or JSON-serialized object).
   *
   * Light theme example:
   *   '{"primaryColor":"#6366f1","cardBg":"#f8faff","cardTitleColor":"#1e1b4b"}'
   *
   * Dark theme example:
   *   '{"primaryColor":"#a78bfa","cardBg":"#1e1e2e","cardBorderColor":"#313244",
   *     "cardTitleColor":"#cdd6f4","cardSubColor":"#6c7086",
   *     "modalBg":"#1e1e2e","modalMediaBg":"#11111b","modalTextColor":"#cdd6f4",
   *     "modalSubColor":"#6c7086","sidebarBg":"#181825","sidebarLabelColor":"#6c7086",
   *     "sidebarValueColor":"#cdd6f4","filmstripBg":"#181825",
   *     "galleryTitleColor":"#cdd6f4","gallerySubColor":"#6c7086"}'
   */
  colors?: ColorTokens | string;
  dispatch?: (eventName: string, payload?: Record<string, unknown>) => void;
}

// ── Default palette (light) ───────────────────────────────────────────────────

const DEFAULT_COLORS: Required<ColorTokens> = {
  primaryColor:      "#0f172a",
  cardBg:            "#ffffff",
  cardBorderColor:   "#e2e8f0",
  cardTitleColor:    "#0f172a",
  cardSubColor:      "#94a3b8",
  modalOverlayColor: "rgba(0,0,0,0.85)",
  modalBg:           "#ffffff",
  modalHeaderBorder: "#f1f5f9",
  modalMediaBg:      "#020617",
  modalTextColor:    "#0f172a",
  modalSubColor:     "#94a3b8",
  sidebarBg:         "#ffffff",
  sidebarLabelColor: "#94a3b8",
  sidebarValueColor: "#1e293b",
  filmstripBg:       "#ffffff",
  galleryTitleColor: "#0f172a",
  gallerySubColor:   "#64748b",
};

type GalleryLayout = "grid" | "list";
type GalleryAspectRatio = "square" | "video" | "auto";

function toSafeText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toSafeItemType(value: unknown): GalleryItem["type"] {
  if (value === "image" || value === "video" || value === "pdf") {
    return value;
  }
  return undefined;
}

function normalizeCustomField(input: unknown): CustomField | null {
  const raw = (typeof input === "object" && input !== null
    ? input
    : {}) as Partial<CustomField>;

  const name = toSafeText(raw.name);
  const value = toSafeText(raw.value);

  if (!name || !value) return null;

  return {
    name,
    value,
    icon: toSafeText(raw.icon),
  };
}

function normalizeItem(input: unknown): GalleryItem | null {
  const raw = (typeof input === "object" && input !== null
    ? input
    : {}) as Partial<GalleryItem>;
  const safeUrl = toSafeText(raw.url);
  if (!safeUrl) return null;

  const customFields = Array.isArray(raw.customFields)
    ? raw.customFields
        .map((field) => normalizeCustomField(field))
        .filter((field): field is CustomField => field !== null)
    : undefined;

  return {
    id: toSafeText(raw.id),
    url: safeUrl,
    link: toSafeText(raw.link),
    name: toSafeText(raw.name),
    alt: toSafeText(raw.alt),
    title: toSafeText(raw.title),
    subheading: toSafeText(raw.subheading),
    customFields:
      customFields && customFields.length > 0 ? customFields : undefined,
    type: toSafeItemType(raw.type) ?? detectType(safeUrl),
  };
}

function normalizeColors(raw: unknown): Required<ColorTokens> {
  if (typeof raw !== "object" || raw === null) return DEFAULT_COLORS;
  const input = raw as ColorTokens;

  return {
    primaryColor:      toSafeText(input.primaryColor) ?? DEFAULT_COLORS.primaryColor,
    cardBg:            toSafeText(input.cardBg) ?? DEFAULT_COLORS.cardBg,
    cardBorderColor:   toSafeText(input.cardBorderColor) ?? DEFAULT_COLORS.cardBorderColor,
    cardTitleColor:    toSafeText(input.cardTitleColor) ?? DEFAULT_COLORS.cardTitleColor,
    cardSubColor:      toSafeText(input.cardSubColor) ?? DEFAULT_COLORS.cardSubColor,
    modalOverlayColor: toSafeText(input.modalOverlayColor) ?? DEFAULT_COLORS.modalOverlayColor,
    modalBg:           toSafeText(input.modalBg) ?? DEFAULT_COLORS.modalBg,
    modalHeaderBorder: toSafeText(input.modalHeaderBorder) ?? DEFAULT_COLORS.modalHeaderBorder,
    modalMediaBg:      toSafeText(input.modalMediaBg) ?? DEFAULT_COLORS.modalMediaBg,
    modalTextColor:    toSafeText(input.modalTextColor) ?? DEFAULT_COLORS.modalTextColor,
    modalSubColor:     toSafeText(input.modalSubColor) ?? DEFAULT_COLORS.modalSubColor,
    sidebarBg:         toSafeText(input.sidebarBg) ?? DEFAULT_COLORS.sidebarBg,
    sidebarLabelColor: toSafeText(input.sidebarLabelColor) ?? DEFAULT_COLORS.sidebarLabelColor,
    sidebarValueColor: toSafeText(input.sidebarValueColor) ?? DEFAULT_COLORS.sidebarValueColor,
    filmstripBg:       toSafeText(input.filmstripBg) ?? DEFAULT_COLORS.filmstripBg,
    galleryTitleColor: toSafeText(input.galleryTitleColor) ?? DEFAULT_COLORS.galleryTitleColor,
    gallerySubColor:   toSafeText(input.gallerySubColor) ?? DEFAULT_COLORS.gallerySubColor,
  };
}

function parseColors(raw?: GalleryProps["colors"]): Required<ColorTokens> {
  if (!raw) return DEFAULT_COLORS;

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return normalizeColors(parsed);
    } catch {
      return DEFAULT_COLORS;
    }
  }

  return normalizeColors(raw);
}

function parseItems(raw?: GalleryProps["items"]): GalleryItem[] {
  const normalizeList = (input: unknown[]): GalleryItem[] =>
    input
      .map((item) => normalizeItem(item))
      .filter((item): item is GalleryItem => item !== null);

  if (!raw) return [];

  if (Array.isArray(raw)) {
    if (raw.length === 0) return [];
    return normalizeList(raw);
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [];
    }
    return normalizeList(parsed);
  } catch {
    return [];
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function detectType(url: string): "image" | "video" | "pdf" {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  if (["mp4", "webm", "ogg", "mov", "mkv"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  return "image";
}

function parseCount(value: number | string | undefined, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) return fallback;
    const parsed = parseInt(trimmed, 10);
    if (Number.isFinite(parsed)) return Math.max(0, parsed);
  }

  return fallback;
}

function parseBoolean(value: boolean | string | undefined, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return fallback;
}

function parseColumns(value: number | string | undefined): keyof typeof COL_CLASSES {
  if (typeof value === "number" && Number.isFinite(value)) {
    const clamped = Math.max(1, Math.min(4, Math.round(value)));
    return String(clamped) as keyof typeof COL_CLASSES;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed in COL_CLASSES) {
      return trimmed as keyof typeof COL_CLASSES;
    }

    const parsed = parseInt(trimmed, 10);
    if (Number.isFinite(parsed)) {
      const clamped = Math.max(1, Math.min(4, parsed));
      return String(clamped) as keyof typeof COL_CLASSES;
    }
  }

  return "3";
}

function parseAspectRatio(value: GalleryProps["aspectRatio"]): GalleryAspectRatio {
  if (value === "video" || value === "auto") return value;
  return "square";
}

function parseLayout(value: GalleryProps["layout"]): GalleryLayout {
  return value === "list" ? "list" : "grid";
}

/** Mix a hex color toward white. Falls back gracefully for non-hex values. */
function lighten(hex: string, ratio: number): string {
  const m = hex.match(/^#([0-9a-f]{3,8})$/i);
  if (!m) return hex;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgb(${Math.round(r + (255 - r) * ratio)},${Math.round(g + (255 - g) * ratio)},${Math.round(b + (255 - b) * ratio)})`;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const IcClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcLeft = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15,18 9,12 15,6" />
  </svg>
);
const IcRight = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9,18 15,12 9,6" />
  </svg>
);
const IcZoomIn = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);
const IcZoomOut = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);
const IcExternalLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15,3 21,3 21,9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const IcPdf = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" />
  </svg>
);
const IcPlay = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

// ── Media Thumbnail ───────────────────────────────────────────────────────────

function MediaThumb({ item, aspectRatio }: { item: GalleryItem; aspectRatio: GalleryAspectRatio }) {
  const type = item.type ?? detectType(item.url);
  const wrapClass =
    aspectRatio === "video" ? "ux:w-full ux:aspect-video"
    : aspectRatio === "auto" ? "ux:w-full"
    : "ux:w-full ux:aspect-square";

  if (type === "image") return (
    <div className={`${wrapClass} ux:overflow-hidden ux:bg-slate-100`}>
      <img src={item.url} alt={item.alt ?? item.name ?? item.title ?? ""}
        className="ux:w-full ux:h-full ux:object-cover ux:transition-transform ux:duration-300 group-hover:ux:scale-105" />
    </div>
  );
  if (type === "video") return (
    <div className={`${wrapClass} ux:overflow-hidden ux:bg-slate-900 ux:relative ux:flex ux:items-center ux:justify-center`}>
      <video src={item.url} className="ux:w-full ux:h-full ux:object-cover" muted playsInline />
      <div className="ux:absolute ux:inset-0 ux:flex ux:items-center ux:justify-center">
        <div className="ux:w-12 ux:h-12 ux:rounded-full ux:bg-black/50 ux:flex ux:items-center ux:justify-center ux:backdrop-blur-sm">
          <IcPlay />
        </div>
      </div>
    </div>
  );
  return (
    <div className={`${wrapClass} ux:bg-red-50 ux:flex ux:flex-col ux:items-center ux:justify-center ux:gap-2 ux:text-red-400`}>
      <IcPdf />
      <span className="ux:text-xs ux:font-bold ux:text-red-400 ux:tracking-widest">PDF</span>
    </div>
  );
}

// ── Modal Media ───────────────────────────────────────────────────────────────

function ModalMedia({ item, zoom }: { item: GalleryItem; zoom: number }) {
  const type = item.type ?? detectType(item.url);
  const style = { transform: `scale(${zoom})`, transformOrigin: "center center" };
  if (type === "image") return (
    <img src={item.url} alt={item.alt ?? item.name ?? ""} draggable={false}
      className="ux:max-w-full ux:max-h-full ux:object-contain ux:transition-transform ux:duration-200 ux:select-none"
      style={style} />
  );
  if (type === "video") return (
    <video src={item.url} controls autoPlay className="ux:max-w-full ux:max-h-full ux:rounded-lg" style={style} />
  );
  return (
    <iframe src={item.url} title={item.name ?? "PDF Document"}
      className="ux:w-full ux:border-none ux:rounded-lg"
      style={{ height: "68vh", ...style, transformOrigin: "top center" }} />
  );
}

// ── Lightbox Modal ────────────────────────────────────────────────────────────

interface ModalProps {
  items: GalleryItem[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  c: Required<ColorTokens>;
}

function LightboxModal({ items, activeIndex, onClose, onNavigate, c }: ModalProps) {
  const [zoom, setZoom] = useState(1);
  const item = items[activeIndex];
  const canPrev = activeIndex > 0;
  const canNext = activeIndex < items.length - 1;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft"  && canPrev) onNavigate(activeIndex - 1);
      if (e.key === "ArrowRight" && canNext) onNavigate(activeIndex + 1);
      if ((e.key === "+" || e.key === "=") && !e.ctrlKey) setZoom((z) => Math.min(+(z + 0.25).toFixed(2), 3));
      if (e.key === "-" && !e.ctrlKey) setZoom((z) => Math.max(+(z - 0.25).toFixed(2), 0.25));
      if (e.key === "0" && !e.ctrlKey) setZoom(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, canPrev, canNext, onClose, onNavigate]);

  const hasFields = item.customFields && item.customFields.length > 0;

  const navBtnStyle: CSSProperties = {
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    width: 40, height: 40, borderRadius: "50%",
    background: `${c.modalBg}e6`, color: c.modalTextColor,
    border: "none", cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.3)", zIndex: 10, transition: "all 0.15s",
  };

  return (
    <div
      className="ux:fixed ux:inset-0 ux:z-50 ux:flex ux:items-center ux:justify-center ux:p-3"
      style={{ background: c.modalOverlayColor }}
      onClick={onClose}
      role="dialog" aria-modal="true"
    >
      <div
        className="ux:relative ux:flex ux:flex-col ux:w-full ux:max-w-5xl ux:rounded-2xl ux:overflow-hidden ux:shadow-2xl"
        style={{ background: c.modalBg, maxHeight: "95vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="ux:flex ux:items-center ux:justify-between ux:px-5 ux:py-3 ux:flex-shrink-0"
          style={{ borderBottom: `1px solid ${c.modalHeaderBorder}` }}
        >
          <div className="ux:flex ux:flex-col ux:gap-0.5 ux:min-w-0 ux:pr-4">
            {item.title && (
              <p className="ux:m-0 ux:text-sm ux:font-semibold ux:truncate" style={{ color: c.modalTextColor }}>{item.title}</p>
            )}
            {item.subheading && (
              <p className="ux:m-0 ux:text-xs ux:truncate" style={{ color: c.modalSubColor }}>{item.subheading}</p>
            )}
            {!item.title && item.name && (
              <p className="ux:m-0 ux:text-sm ux:font-medium ux:truncate" style={{ color: c.modalTextColor }}>{item.name}</p>
            )}
          </div>

          <div className="ux:flex ux:items-center ux:gap-1 ux:flex-shrink-0">
            {/* Zoom out */}
            <button
              className="ux:p-2 ux:rounded-lg ux:border-none ux:cursor-pointer ux:flex ux:items-center ux:justify-center ux:transition-colors hover:ux:bg-black/5"
              style={{ background: "transparent", color: c.modalSubColor }}
              onClick={() => setZoom((z) => Math.max(+(z - 0.25).toFixed(2), 0.25))} title="Zoom out (−)"
            >
              <IcZoomOut />
            </button>

            {/* Zoom % + reset */}
            <button
              className="ux:px-2 ux:py-1.5 ux:rounded-lg ux:border-none ux:cursor-pointer ux:text-xs ux:min-w-12 ux:text-center ux:tabular-nums ux:transition-colors hover:ux:bg-black/5"
              style={{ background: "transparent", color: c.modalSubColor, fontFamily: "monospace" }}
              onClick={() => setZoom(1)} title="Reset zoom (0)"
            >
              {Math.round(zoom * 100)}%
            </button>

            {/* Zoom in */}
            <button
              className="ux:p-2 ux:rounded-lg ux:border-none ux:cursor-pointer ux:flex ux:items-center ux:justify-center ux:transition-colors hover:ux:bg-black/5"
              style={{ background: "transparent", color: c.modalSubColor }}
              onClick={() => setZoom((z) => Math.min(+(z + 0.25).toFixed(2), 3))} title="Zoom in (+)"
            >
              <IcZoomIn />
            </button>

            {/* Divider */}
            <div className="ux:w-px ux:h-5 ux:mx-1" style={{ background: c.modalHeaderBorder }} />

            {/* External link */}
            {item.link && (
              <a href={item.link} target="_blank" rel="noopener noreferrer"
                className="ux:p-2 ux:rounded-lg ux:flex ux:items-center ux:justify-center ux:no-underline ux:transition-colors hover:ux:bg-black/5"
                style={{ color: c.modalSubColor }} title="Open link">
                <IcExternalLink />
              </a>
            )}

            {/* Close */}
            <button
              className="ux:p-2 ux:rounded-lg ux:border-none ux:cursor-pointer ux:flex ux:items-center ux:justify-center ux:transition-colors hover:ux:bg-red-50 hover:ux:text-red-500 ux:ml-1"
              style={{ background: "transparent", color: c.modalSubColor }}
              onClick={onClose} title="Close (Esc)"
            >
              <IcClose />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="ux:flex ux:flex-1 ux:overflow-hidden" style={{ minHeight: 0 }}>
          {/* Media */}
          <div
            className="ux:relative ux:flex-1 ux:flex ux:items-center ux:justify-center ux:overflow-hidden ux:p-4"
            style={{ background: c.modalMediaBg }}
          >
            <ModalMedia item={item} zoom={zoom} />
            {canPrev && (
              <button style={{ ...navBtnStyle, left: 12 }} onClick={() => onNavigate(activeIndex - 1)} title="Previous (←)">
                <IcLeft />
              </button>
            )}
            {canNext && (
              <button style={{ ...navBtnStyle, right: 12 }} onClick={() => onNavigate(activeIndex + 1)} title="Next (→)">
                <IcRight />
              </button>
            )}
          </div>

          {/* Side panel */}
          {hasFields && (
            <div
              className="ux:w-56 ux:flex-shrink-0 ux:overflow-y-auto ux:p-4 ux:flex ux:flex-col ux:gap-4"
              style={{ background: c.sidebarBg, borderLeft: `1px solid ${c.modalHeaderBorder}` }}
            >
              <p className="ux:m-0 ux:text-xs ux:font-semibold ux:uppercase ux:tracking-widest"
                style={{ color: c.sidebarLabelColor }}>
                Details
              </p>
              {item.customFields!.map((cf, i) => (
                <div key={i} className="ux:flex ux:items-start ux:gap-2.5">
                  {cf.icon
                    ? <span className="ux:text-base ux:leading-none ux:flex-shrink-0 ux:mt-0.5">{cf.icon}</span>
                    : <div className="ux:w-1.5 ux:h-1.5 ux:rounded-full ux:flex-shrink-0 ux:mt-1.5"
                        style={{ background: c.sidebarLabelColor }} />
                  }
                  <div className="ux:flex ux:flex-col ux:gap-0.5 ux:min-w-0">
                    <p className="ux:m-0 ux:text-xs" style={{ color: c.sidebarLabelColor }}>{cf.name}</p>
                    <p className="ux:m-0 ux:text-sm ux:font-medium ux:break-words" style={{ color: c.sidebarValueColor }}>{cf.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Filmstrip ── */}
        {items.length > 1 && (
          <div
            className="ux:flex ux:items-center ux:gap-2 ux:px-5 ux:py-3 ux:overflow-x-auto ux:flex-shrink-0"
            style={{ background: c.filmstripBg, borderTop: `1px solid ${c.modalHeaderBorder}` }}
          >
            {items.map((it, i) => {
              const t   = it.type ?? detectType(it.url);
              const isActive = i === activeIndex;
              return (
                <button
                  key={it.id ?? i}
                  onClick={() => onNavigate(i)}
                  className="ux:flex-shrink-0 ux:w-11 ux:h-11 ux:rounded-lg ux:overflow-hidden ux:cursor-pointer ux:p-0 ux:bg-transparent ux:transition-all"
                  style={{
                    border: `2px solid ${isActive ? c.primaryColor : "transparent"}`,
                    outline: isActive ? `2px solid ${lighten(c.primaryColor, 0.6)}` : "none",
                    outlineOffset: 1,
                  }}
                  title={it.title ?? it.name ?? `Item ${i + 1}`}
                >
                  {t === "image" ? (
                    <img src={it.url} alt={it.alt ?? ""} className="ux:w-full ux:h-full ux:object-cover" />
                  ) : t === "video" ? (
                    <div className="ux:w-full ux:h-full ux:bg-slate-800 ux:flex ux:items-center ux:justify-center">
                      <IcPlay />
                    </div>
                  ) : (
                    <div className="ux:w-full ux:h-full ux:bg-red-100 ux:flex ux:items-center ux:justify-center ux:text-red-500 ux:text-xs ux:font-bold">
                      PDF
                    </div>
                  )}
                </button>
              );
            })}
            <span className="ux:text-xs ux:flex-shrink-0 ux:pl-1 ux:tabular-nums" style={{ color: c.sidebarLabelColor }}>
              {activeIndex + 1} / {items.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Gallery Card ──────────────────────────────────────────────────────────────

interface CardProps {
  item: GalleryItem;
  aspectRatio: GalleryAspectRatio;
  showMeta: boolean;
  openModal: boolean;
  layout: GalleryLayout;
  onClick: () => void;
  c: Required<ColorTokens>;
}

function GalleryCard({ item, aspectRatio, showMeta, openModal, layout, onClick, c }: CardProps) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    onClick();
    if (!openModal && item.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    }
  };

  const hasFooter = showMeta && (item.title || item.subheading || (item.customFields && item.customFields.length > 0));

  const cardStyle: CSSProperties = {
    background: c.cardBg,
    border: `1px solid ${c.cardBorderColor}`,
    boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
    transform: hovered ? "translateY(-2px)" : "none",
    transition: "all 0.2s",
  };

  if (layout === "list") return (
    <div
      role="button" tabIndex={0}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="ux:flex ux:gap-4 ux:p-3 ux:rounded-xl ux:cursor-pointer ux:items-start"
      style={cardStyle}
    >
      <div className="ux:w-20 ux:h-20 ux:rounded-lg ux:overflow-hidden ux:flex-shrink-0">
        <MediaThumb item={item} aspectRatio="square" />
      </div>
      <div className="ux:flex ux:flex-col ux:gap-1 ux:flex-1 ux:min-w-0 ux:pt-0.5">
        {item.title && <p className="ux:m-0 ux:text-sm ux:font-semibold ux:truncate" style={{ color: c.cardTitleColor }}>{item.title}</p>}
        {item.subheading && <p className="ux:m-0 ux:text-xs ux:truncate" style={{ color: c.cardSubColor }}>{item.subheading}</p>}
        {!item.title && item.name && <p className="ux:m-0 ux:text-sm ux:truncate" style={{ color: c.cardTitleColor }}>{item.name}</p>}
        {item.customFields && item.customFields.length > 0 && (
          <div className="ux:flex ux:flex-wrap ux:gap-x-3 ux:gap-y-0.5 ux:mt-1">
            {item.customFields.slice(0, 3).map((cf, i) => (
              <span key={i} className="ux:text-xs" style={{ color: c.cardSubColor }}>
                {cf.icon && <span className="ux:mr-1">{cf.icon}</span>}
                <span className="ux:font-medium">{cf.name}:</span> <span>{cf.value}</span>
              </span>
            ))}
          </div>
        )}
      </div>
      {!openModal && item.link && (
        <div className="ux:self-center ux:flex-shrink-0" style={{ color: c.cardSubColor }}>
          <IcExternalLink />
        </div>
      )}
    </div>
  );

  return (
    <div
      role="button" tabIndex={0}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="ux:rounded-xl ux:overflow-hidden ux:cursor-pointer ux:group"
      style={cardStyle}
    >
      <MediaThumb item={item} aspectRatio={aspectRatio} />
      {hasFooter && (
        <div className="ux:p-3 ux:flex ux:flex-col ux:gap-1.5">
          {item.title && <p className="ux:m-0 ux:text-sm ux:font-semibold ux:truncate" style={{ color: c.cardTitleColor }}>{item.title}</p>}
          {item.subheading && <p className="ux:m-0 ux:text-xs ux:line-clamp-2" style={{ color: c.cardSubColor }}>{item.subheading}</p>}
          {!item.title && item.name && <p className="ux:m-0 ux:text-sm ux:truncate" style={{ color: c.cardTitleColor }}>{item.name}</p>}
          {item.customFields && item.customFields.length > 0 && (
            <div className="ux:flex ux:flex-col ux:gap-1 ux:mt-0.5">
              {item.customFields.slice(0, 3).map((cf, i) => (
                <div key={i} className="ux:flex ux:items-center ux:gap-1.5 ux:text-xs" style={{ color: c.cardSubColor }}>
                  {cf.icon
                    ? <span className="ux:flex-shrink-0">{cf.icon}</span>
                    : <div className="ux:w-1 ux:h-1 ux:rounded-full ux:flex-shrink-0" style={{ background: c.cardSubColor }} />
                  }
                  <span className="ux:font-medium">{cf.name}:</span>
                  <span className="ux:truncate">{cf.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
// ── Col classes ───────────────────────────────────────────────────────────────

const COL_CLASSES: Record<string, string> = {
  "1": "ux:grid-cols-1",
  "2": "ux:grid-cols-2",
  "3": "ux:grid-cols-3",
  "4": "ux:grid-cols-4",
};

// ── Main export ───────────────────────────────────────────────────────────────

export default function Gallery({
  title,
  subtitle,
  items: itemsProp,
  columns,
  minCards,
  maxCards,
  openModal,
  aspectRatio,
  layout,
  showMeta,
  colors,
  dispatch,
}: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const c = useMemo(() => parseColors(colors), [colors]);
  const allItems = useMemo(() => parseItems(itemsProp), [itemsProp]);

  const min = parseCount(minCards, 1);
  const max = parseCount(maxCards, allItems.length);
  const visibleCount = Math.max(min, Math.min(max, allItems.length));
  const visibleItems = useMemo(
    () => allItems.slice(0, visibleCount),
    [allItems, visibleCount]
  );

  const modalEnabled = parseBoolean(openModal, true);
  const metaEnabled = parseBoolean(showMeta, true);
  const safeLayout = parseLayout(layout);
  const safeAspectRatio = parseAspectRatio(aspectRatio);
  const colClass = COL_CLASSES[parseColumns(columns)] ?? COL_CLASSES["3"];
  const safeActiveIndex =
    activeIndex !== null && activeIndex >= 0 && activeIndex < visibleItems.length
      ? activeIndex
      : null;

  const emit = useCallback((eventName: string, payload?: Record<string, unknown>) => {
    dispatch?.(eventName, payload);
  }, [dispatch]);

  const buildItemPayload = useCallback((item: GalleryItem | undefined, index: number | null) => ({
    index,
    id: item?.id ?? null,
    url: item?.url ?? null,
    title: item?.title ?? null,
    subheading: item?.subheading ?? null,
    type: item ? (item.type ?? detectType(item.url)) : null,
    customFields: item?.customFields ?? [],
  }), []);

  const handleCardClick = useCallback((index: number) => {
    const item = visibleItems[index];
    const itemPayload = buildItemPayload(item, index);

    if (modalEnabled) {
      setActiveIndex(index);
      emit("open", itemPayload);
    }
  }, [buildItemPayload, emit, modalEnabled, visibleItems]);

  const handleClose = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const handleNavigate = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <>
      <div className="ux:w-full ux:flex ux:flex-col ux:gap-5">
        {(title || subtitle) && (
          <div>
            {title && <h3 className="ux:m-0 ux:text-xl ux:font-semibold" style={{ color: c.galleryTitleColor }}>{title}</h3>}
            {subtitle && <p className="ux:m-0 ux:mt-1 ux:text-sm" style={{ color: c.gallerySubColor }}>{subtitle}</p>}
          </div>
        )}

        {safeLayout === "list" ? (
          <div className="ux:flex ux:flex-col ux:gap-3">
            {visibleItems.map((item, i) => (
              <GalleryCard key={item.id ?? i} item={item} aspectRatio={safeAspectRatio}
                showMeta={metaEnabled} openModal={modalEnabled} layout="list"
                onClick={() => handleCardClick(i)} c={c} />
            ))}
          </div>
        ) : (
          <div className={`ux:grid ${colClass} ux:gap-4`}>
            {visibleItems.map((item, i) => (
              <GalleryCard key={item.id ?? i} item={item} aspectRatio={safeAspectRatio}
                showMeta={metaEnabled} openModal={modalEnabled} layout="grid"
                onClick={() => handleCardClick(i)} c={c} />
            ))}
          </div>
        )}

        {allItems.length > visibleItems.length && (
          <p className="ux:m-0 ux:text-xs ux:text-center" style={{ color: c.gallerySubColor }}>
            Showing {visibleItems.length} of {allItems.length} items
          </p>
        )}
      </div>

      {modalEnabled && safeActiveIndex !== null && (
        <LightboxModal key={safeActiveIndex} items={visibleItems} activeIndex={safeActiveIndex}
          onClose={handleClose} onNavigate={handleNavigate} c={c} />
      )}
    </>
  );
}
