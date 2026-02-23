"use client";

import { useEffect, useMemo, useState } from "react";
// import "@500ux/components/styles/base.css"; This will be used in the production dont remove keep in all components

export const version = "1.0.0";

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MapProps {
  /** Latitude/longitude coordinates. Takes priority over address when both are provided. */
  coordinates?: MapCoordinates;
  /** Plain text address used when coordinates are unavailable — geocoded by Google Maps server-side. */
  address?: string;
  /** Marker / location label shown in the footer bar */
  markerLabel?: string;
  /** Map zoom level (1–21). Ignored when embedding by address. */
  zoom?: number;
  /** Height of the map embed in pixels */
  height?: number;
  /** Show a "Get Directions" link in the footer */
  showDirectionsLink?: boolean;
  /** Event dispatcher from 500ux runtime */
  dispatch?: (eventName: string, payload?: Record<string, unknown>) => void;
}

export default function Map({
  coordinates,
  address,
  markerLabel,
  zoom = 14,
  height = 420,
  showDirectionsLink = true,
  dispatch,
}: MapProps) {
  const [loaded, setLoaded] = useState(false);
  const hasValidCoordinates =
    coordinates !== undefined &&
    Number.isFinite(coordinates.lat) &&
    Number.isFinite(coordinates.lng);

  // Derive the query string and embed URL from whichever source is available
  const { query, embedUrl, querySource } = useMemo(() => {
    if (hasValidCoordinates && coordinates) {
      const q = `${coordinates.lat},${coordinates.lng}`;
      return {
        query: q,
        embedUrl: `https://maps.google.com/maps?q=${q}&z=${zoom}&output=embed`,
        querySource: "coordinates" as const,
      };
    }
    if (address) {
      const q = encodeURIComponent(address);
      return {
        query: address,
        embedUrl: `https://maps.google.com/maps?q=${q}&output=embed`,
        querySource: "address" as const,
      };
    }
    return { query: null, embedUrl: null, querySource: null };
  }, [hasValidCoordinates, coordinates, address, zoom]);

  const displayLabel =
    markerLabel || address || (hasValidCoordinates && coordinates ? `${coordinates.lat}, ${coordinates.lng}` : null);

  const directionsUrl = useMemo(() => {
    if (!query) return null;
    const encodedQuery = querySource === "address" ? encodeURIComponent(query) : query;
    return `https://maps.google.com/maps?q=${encodedQuery}`;
  }, [query, querySource]);

  useEffect(() => {
    setLoaded(false);
  }, [embedUrl]);

  const handleLoad = () => {
    setLoaded(true);
    dispatch?.("map_loaded", { query, source: querySource });
  };

  const handleDirections = () => {
    dispatch?.("directions_opened", { query });
  };

  // Empty state — neither coordinates nor address provided
  if (!embedUrl) {
    return (
      <div className="ux:w-full ux:rounded-2xl ux:border ux:border-dashed ux:border-slate-300 ux:bg-slate-50 ux:flex ux:flex-col ux:items-center ux:justify-center ux:gap-3 ux:p-12 ux:text-center">
        <div className="ux:w-12 ux:h-12 ux:rounded-full ux:bg-slate-100 ux:flex ux:items-center ux:justify-center">
          <svg className="ux:w-6 ux:h-6 ux:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="ux:text-sm ux:font-medium ux:text-slate-500">No location provided</p>
        <p className="ux:text-xs ux:text-slate-400 ux:max-w-xs">
          Pass a <code className="ux:font-mono ux:bg-slate-100 ux:px-1 ux:rounded">coordinates</code> or{" "}
          <code className="ux:font-mono ux:bg-slate-100 ux:px-1 ux:rounded">address</code> prop to render the map.
        </p>
      </div>
    );
  }

  return (
    <div className="ux:w-full ux:rounded-2xl ux:overflow-hidden ux:border ux:border-slate-200 ux:shadow-sm ux:bg-white">
      {/* Map Embed */}
      <div className="ux:relative ux:w-full" style={{ height }}>
        {/* Loading skeleton */}
        {!loaded && (
          <div className="ux:absolute ux:inset-0 ux:bg-slate-100 ux:animate-pulse ux:flex ux:flex-col ux:items-center ux:justify-center ux:gap-3">
            <div className="ux:w-10 ux:h-10 ux:rounded-full ux:bg-slate-200 ux:flex ux:items-center ux:justify-center">
              <svg className="ux:w-5 ux:h-5 ux:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="ux:text-xs ux:text-slate-400 ux:font-medium">Loading map…</p>
          </div>
        )}

        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={handleLoad}
          title={displayLabel || "Map"}
          className={`ux:transition-opacity ux:duration-500 ${loaded ? "ux:opacity-100" : "ux:opacity-0"}`}
        />
      </div>

      {/* Footer Bar */}
      <div className="ux:flex ux:items-center ux:justify-between ux:gap-4 ux:px-5 ux:py-3.5 ux:border-t ux:border-slate-100 ux:bg-slate-50">
        <div className="ux:flex ux:items-center ux:gap-2 ux:min-w-0">
          <svg className="ux:w-4 ux:h-4 ux:text-slate-400 ux:shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {displayLabel && (
            <span className="ux:text-xs ux:text-slate-500 ux:truncate">{displayLabel}</span>
          )}
          {hasValidCoordinates && coordinates && (
            <span className="ux:text-[10px] ux:text-slate-400 ux:bg-slate-100 ux:px-2 ux:py-0.5 ux:rounded-full ux:font-mono ux:shrink-0">
              {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
            </span>
          )}
        </div>

        {showDirectionsLink && directionsUrl && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDirections}
            className="ux:shrink-0 ux:flex ux:items-center ux:gap-1.5 ux:text-xs ux:font-semibold ux:text-slate-700 ux:bg-white ux:border ux:border-slate-200 ux:px-3 ux:py-1.5 ux:rounded-lg hover:ux:bg-slate-50 hover:ux:border-slate-300 ux:transition-all"
          >
            <svg className="ux:w-3.5 ux:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Get Directions
          </a>
        )}
      </div>
    </div>
  );
}
