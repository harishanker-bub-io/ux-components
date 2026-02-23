"use client";

// import "@500ux/components/styles/base.css"; This will be used in the production dont remove keep in all components

export const version = "1.0.0";

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface Location {
  id: string | number;
  title: string;
  address: string;
  city?: string;
  phone?: string;
  email?: string;
  operatingHours?: string;
  image?: string;
  coordinates?: LocationCoordinates;
  tags?: string[];
}

export interface LocationsProps {
  /** Section heading */
  title?: string;
  /** Section subheading */
  subtitle?: string;
  /** Array of location objects */
  locations: Location[];

  /** Event dispatcher from 500ux runtime */
  dispatch?: (eventName: string, payload?: Record<string, unknown>) => void;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function isOpenNow(hours?: string): boolean | null {
  if (!hours) return null;
  // Expects "HH:MM–HH:MM" 24-h format e.g. "09:00–18:00"
  const match = hours.match(/^(\d{2}):(\d{2})[–-](\d{2}):(\d{2})$/);
  if (!match) return null;
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = parseInt(match[1]) * 60 + parseInt(match[2]);
  const close = parseInt(match[3]) * 60 + parseInt(match[4]);
  return mins >= open && mins < close;
}

const PhoneIcon = () => (
  <svg className="ux:w-3.5 ux:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
  </svg>
);

const MailIcon = () => (
  <svg className="ux:w-3.5 ux:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PinIcon = () => (
  <svg className="ux:w-3.5 ux:h-3.5 ux:shrink-0 ux:mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="ux:w-3.5 ux:h-3.5 ux:shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="ux:w-4 ux:h-4 ux:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// ── LocationCard ──────────────────────────────────────────────────────────────

function LocationCard({
  location,
  onViewMap,
  onCall,
  onEmail,
}: {
  location: Location;
  onViewMap: () => void;
  onCall: () => void;
  onEmail: () => void;
}) {
  const openStatus = isOpenNow(location.operatingHours);

  return (
    <div className="ux:flex ux:flex-col ux:bg-white ux:border ux:border-slate-200 ux:rounded-2xl ux:overflow-hidden ux:shadow-sm ux:transition-all ux:duration-200 hover:ux:shadow-md hover:ux:border-slate-300">
      {/* Image */}
      {location.image ? (
        <div className="ux:h-44 ux:w-full ux:overflow-hidden ux:bg-slate-100">
          <img
            src={location.image}
            alt={location.title}
            className="ux:w-full ux:h-full ux:object-cover"
          />
        </div>
      ) : (
        <div className="ux:h-44 ux:w-full ux:bg-gradient-to-br ux:from-slate-100 ux:to-slate-200 ux:flex ux:items-center ux:justify-center">
          <svg className="ux:w-12 ux:h-12 ux:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      )}

      {/* Body */}
      <div className="ux:flex ux:flex-col ux:flex-1 ux:p-5 ux:gap-3">
        {/* Title + badges */}
        <div className="ux:flex ux:items-start ux:justify-between ux:gap-2">
          <h3 className="ux:text-base ux:font-bold ux:text-slate-900 ux:leading-snug">{location.title}</h3>
          <div className="ux:flex ux:flex-col ux:items-end ux:gap-1 ux:shrink-0">
            {openStatus !== null && (
              <span className={`ux:text-[10px] ux:font-bold ux:uppercase ux:tracking-wider ux:px-2 ux:py-0.5 ux:rounded-full ${
                openStatus
                  ? "ux:bg-emerald-50 ux:text-emerald-600"
                  : "ux:bg-rose-50 ux:text-rose-500"
              }`}>
                {openStatus ? "Open" : "Closed"}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {location.tags && location.tags.length > 0 && (
          <div className="ux:flex ux:flex-wrap ux:gap-1.5">
            {location.tags.map((tag) => (
              <span key={tag} className="ux:text-[10px] ux:font-semibold ux:uppercase ux:tracking-wider ux:px-2 ux:py-0.5 ux:rounded-full ux:bg-slate-100 ux:text-slate-500">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Details */}
        <div className="ux:flex ux:flex-col ux:gap-2 ux:text-xs ux:text-slate-500">
          <div className="ux:flex ux:items-start ux:gap-2">
            <PinIcon />
            <span className="ux:leading-relaxed">{location.address}{location.city ? `, ${location.city}` : ""}</span>
          </div>
          {location.operatingHours && (
            <div className="ux:flex ux:items-center ux:gap-2">
              <ClockIcon />
              <span>{location.operatingHours}</span>
            </div>
          )}
          {location.phone && (
            <div className="ux:flex ux:items-center ux:gap-2">
              <PhoneIcon />
              <span>{location.phone}</span>
            </div>
          )}
          {location.email && (
            <div className="ux:flex ux:items-center ux:gap-2">
              <MailIcon />
              <span className="ux:truncate">{location.email}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="ux:mt-auto ux:pt-3 ux:border-t ux:border-slate-100 ux:flex ux:gap-2">
          {(location.phone || location.email) && (
            <button
              onClick={location.phone ? onCall : onEmail}
              className="ux:flex-1 ux:py-2 ux:px-3 ux:rounded-xl ux:text-xs ux:font-semibold ux:border ux:border-slate-200 ux:text-slate-600 ux:bg-slate-50 hover:ux:bg-slate-100 hover:ux:border-slate-300 ux:transition-all ux:cursor-pointer ux:flex ux:items-center ux:justify-center ux:gap-1.5"
            >
              {location.phone ? <PhoneIcon /> : <MailIcon />}
              {location.phone ? "Call" : "Email"}
            </button>
          )}
          <button
            onClick={onViewMap}
            className="ux:flex-1 ux:py-2 ux:px-3 ux:rounded-xl ux:text-xs ux:font-semibold ux:bg-slate-900 ux:text-white hover:ux:bg-slate-700 ux:transition-all ux:cursor-pointer ux:flex ux:items-center ux:justify-center ux:gap-1.5"
          >
            <PinIcon />
            View on Map
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Locations ─────────────────────────────────────────────────────────────────

export default function Locations({
  title,
  subtitle,
  locations,
  dispatch,
}: LocationsProps) {
  if (!locations || locations.length === 0) {
    return (
      <div className="ux:rounded-2xl ux:border ux:border-dashed ux:border-slate-300 ux:bg-slate-50 ux:flex ux:flex-col ux:items-center ux:justify-center ux:gap-3 ux:p-12 ux:text-center">
        <div className="ux:w-12 ux:h-12 ux:rounded-full ux:bg-slate-100 ux:flex ux:items-center ux:justify-center">
          <PinIcon />
        </div>
        <p className="ux:text-sm ux:font-medium ux:text-slate-500">No locations available</p>
      </div>
    );
  }

  return (
    <div className="ux:w-full ux:max-w-6xl ux:mx-auto">
      {/* Header */}
      {(title || subtitle) && (
        <div className="ux:mb-10 ux:text-center">
          <div className="ux:space-y-1">
            {title && <h2 className="ux:text-3xl ux:font-bold ux:text-slate-900">{title}</h2>}
            {subtitle && <p className="ux:text-base ux:text-slate-500">{subtitle}</p>}
          </div>
        </div>
      )}

      <div
        className="ux:grid ux:gap-6 ux:justify-center"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))" }}
      >
        {locations.map((location) => (
          <div key={location.id} className="ux:flex ux:justify-center">
            <div className="ux:w-full ux:max-w-md ux:h-full">
              <LocationCard
                location={location}
                onViewMap={() =>
                  dispatch?.("location_selected", {
                    id: location.id,
                    title: location.title,
                    address: location.address,
                    coordinates: location.coordinates,
                  })
                }
                onCall={() =>
                  dispatch?.("call_initiated", {
                    id: location.id,
                    title: location.title,
                    phone: location.phone,
                  })
                }
                onEmail={() =>
                  dispatch?.("email_initiated", {
                    id: location.id,
                    title: location.title,
                    email: location.email,
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
      <p className="ux:mt-8 ux:text-xs ux:text-slate-400 ux:text-center">
        Showing {locations.length} total location{locations.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
