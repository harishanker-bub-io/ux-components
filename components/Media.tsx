"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import "@500ux/components/styles/base.css"; This will be used in the production dont remove keep in all components

export const version = "1.0.0";

export type MediaType = "image" | "video" | "youtube" | "pdf" | "audio";
type ResolvedMediaType = MediaType | "unknown";

export interface MediaItem {
  /** Media source URL */
  src: string;
  /** Media type - auto-detected if not provided */
  type?: MediaType;
  /** Alt text for images, title for other media */
  alt?: string;
  /** Thumbnail URL for PDFs and videos */
  thumbnail?: string;
  /** Download filename for PDFs */
  downloadName?: string;
  /** Optional MIME hint to improve type detection */
  mimeType?: string;
  /** Caption/transcript URL (WebVTT or text file URL) */
  transcriptSrc?: string;
}

export interface MediaProps {
  /** Title for the media section */
  title?: string;
  /** Subtitle for the media section */
  subtitle?: string;
  /** Media item to display */
  media: MediaItem;
  /** Fixed height for the media container */
  height?: number;
  /** Optional aspect ratio override (e.g. "16/9", "1/1", "9/16") */
  aspectRatio?: string;
  /** Enable fullscreen mode for videos and images */
  allowFullscreen?: boolean;
  /** Media playback and display options */
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  /** Force opening PDFs in a new tab instead of inline preview */
  openPdfInNewTab?: boolean;
  /** Enable privacy-enhanced YouTube embeds */
  youtubePrivacyMode?: boolean;
  /** Event dispatcher from 500ux runtime */
  dispatch?: (eventName: string, payload?: Record<string, unknown>) => void;
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".avif"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"];
const AUDIO_EXTENSIONS = [".mp3", ".wav", ".ogg", ".aac", ".flac", ".m4a"];
const PDF_EXTENSIONS = [".pdf"];

const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

const normalizeAspectRatio = (ratio?: string): string | undefined => {
  if (!ratio) return undefined;
  if (ratio.includes("/")) {
    const [w, h] = ratio.split("/").map((s) => s.trim());
    if (w && h) return `${w} / ${h}`;
  }
  return ratio;
};

const srcHasAnyExtension = (src: string, extensions: string[]): boolean => {
  const cleanSrc = src.toLowerCase().split("?")[0];
  return extensions.some((ext) => cleanSrc.endsWith(ext));
};

const isYouTubeUrl = (src: string): boolean => {
  const lower = src.toLowerCase();
  return lower.includes("youtube.com/watch") || lower.includes("youtu.be/") || lower.includes("youtube.com/shorts/");
};

const isUnsplashUrl = (src: string): boolean => src.toLowerCase().includes("images.unsplash.com/photo-");

const isYouTubeShorts = (src: string): boolean => src.toLowerCase().includes("youtube.com/shorts/");

const resolveMediaType = (media: MediaItem): ResolvedMediaType => {
  if (media.type) return media.type;

  const mime = media.mimeType?.toLowerCase();
  if (mime) {
    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime.startsWith("audio/")) return "audio";
    if (mime.includes("pdf")) return "pdf";
  }

  const src = media.src.toLowerCase();
  if (isYouTubeUrl(src)) return "youtube";
  if (isUnsplashUrl(src) || srcHasAnyExtension(src, IMAGE_EXTENSIONS)) return "image";
  if (srcHasAnyExtension(src, VIDEO_EXTENSIONS)) return "video";
  if (srcHasAnyExtension(src, PDF_EXTENSIONS)) return "pdf";

  // .ogg defaults to audio when MIME is absent
  if (srcHasAnyExtension(src, AUDIO_EXTENSIONS)) return "audio";

  return "unknown";
};

const extractYouTubeId = (src: string): string | null => {
  try {
    const url = new URL(src);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "") || null;
    }

    if (url.pathname.includes("/shorts/")) {
      const id = url.pathname.split("/shorts/")[1]?.split("/")[0];
      return id || null;
    }

    if (url.searchParams.get("v")) {
      return url.searchParams.get("v");
    }
  } catch {
    return null;
  }

  return null;
};

export default function Media({
  title,
  subtitle,
  media,
  height,
  aspectRatio,
  allowFullscreen = true,
  controls = true,
  autoplay = false,
  muted = false,
  loop = false,
  openPdfInNewTab = false,
  youtubePrivacyMode = true,
  dispatch,
}: MediaProps) {
  const [loadedToken, setLoadedToken] = useState<string | null>(null);
  const [errorState, setErrorState] = useState<{ token: string } | null>(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const dispatchedInvalidErrorTokenRef = useRef<string | null>(null);

  const resolvedType = useMemo(() => resolveMediaType(media), [media]);
  const hasSafeSrc = useMemo(() => isValidUrl(media.src), [media.src]);
  const inferredAspectRatio = useMemo(() => {
    if (aspectRatio) return normalizeAspectRatio(aspectRatio);
    if (resolvedType === "youtube") return isYouTubeShorts(media.src) ? "9 / 16" : "16 / 9";
    if (resolvedType === "image" || resolvedType === "video") return "16 / 9";
    return "4 / 3";
  }, [aspectRatio, resolvedType, media.src]);
  const isYouTubeShortsMedia = useMemo(
    () => resolvedType === "youtube" && isYouTubeShorts(media.src),
    [resolvedType, media.src]
  );

  const containerStyle = useMemo(
    () => ({
      ...(height ? { height } : {}),
      ...(!height && inferredAspectRatio ? { aspectRatio: inferredAspectRatio } : {}),
    }),
    [height, inferredAspectRatio]
  );

  const youtubeEmbedSrc = useMemo(() => {
    if (resolvedType !== "youtube") return null;
    const id = extractYouTubeId(media.src);
    if (!id) return null;
    const base = youtubePrivacyMode ? "https://www.youtube-nocookie.com/embed" : "https://www.youtube.com/embed";
    return `${base}/${id}`;
  }, [resolvedType, media.src, youtubePrivacyMode]);

  const token = useMemo(
    () => `${resolvedType}|${media.src}|${String(openPdfInNewTab)}|${youtubeEmbedSrc || ""}`,
    [resolvedType, media.src, openPdfInNewTab, youtubeEmbedSrc]
  );

  const hasInlineValidationError =
    !hasSafeSrc || resolvedType === "unknown" || (resolvedType === "youtube" && !youtubeEmbedSrc);
  const requiresLoadSignal = !(resolvedType === "pdf" && openPdfInNewTab) && !hasInlineValidationError;
  const hasTokenError = errorState?.token === token;
  const isLoading = requiresLoadSignal && loadedToken !== token && !hasTokenError;
  const showInlineError = hasInlineValidationError || hasTokenError;
  const effectiveContainerStyle = showInlineError
    ? { height: height ?? 240 }
    : containerStyle;

  const openExternal = useCallback(
    (reason: string) => {
      dispatch?.("media_open_external", { type: resolvedType, src: media.src, reason });
      if (typeof window !== "undefined") {
        window.open(media.src, "_blank", "noopener,noreferrer");
      }
    },
    [dispatch, resolvedType, media.src]
  );

  useEffect(() => {
    if (hasInlineValidationError && dispatchedInvalidErrorTokenRef.current !== token) {
      dispatchedInvalidErrorTokenRef.current = token;
      dispatch?.("media_error", {
        type: resolvedType,
        src: media.src,
        reason: !hasSafeSrc
          ? "invalid_url"
          : resolvedType === "unknown"
          ? "unsupported_type"
          : "youtube_embed_invalid",
        error: !hasSafeSrc
          ? "Invalid media URL"
          : resolvedType === "unknown"
          ? "Unsupported media type"
          : "Unable to parse YouTube ID",
      });
    }
  }, [dispatch, hasInlineValidationError, hasSafeSrc, media.src, resolvedType, token]);

  useEffect(() => {
    if (!isFullscreenOpen) return;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreenOpen(false);
        dispatch?.("media_fullscreen", { type: resolvedType, src: media.src, enabled: false });
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isFullscreenOpen, dispatch, resolvedType, media.src]);

  const onMediaLoaded = useCallback(() => {
    setLoadedToken(token);
    setErrorState((prev) => (prev?.token === token ? null : prev));
    dispatch?.("media_loaded", { type: resolvedType, src: media.src });
  }, [dispatch, resolvedType, media.src, token]);

  const onMediaError = useCallback(
    (reason: string, error?: string) => {
      setErrorState({ token });
      dispatch?.("media_error", {
        type: resolvedType,
        src: media.src,
        reason,
        error: error || "Failed to load media",
      });
    },
    [dispatch, resolvedType, media.src, token]
  );

  const toggleFullscreen = useCallback(() => {
    if (!allowFullscreen || (resolvedType !== "image" && resolvedType !== "video")) return;
    setIsFullscreenOpen((prev) => {
      const next = !prev;
      if (next) {
        setZoomLevel(1);
      } else {
        setZoomLevel(1);
      }
      dispatch?.("media_fullscreen", { type: resolvedType, src: media.src, enabled: next });
      return next;
    });
  }, [allowFullscreen, dispatch, media.src, resolvedType]);

  const renderMedia = () => {
    if (showInlineError) {
      return (
        <div className="ux:h-full ux:w-full ux:flex ux:flex-col ux:items-center ux:justify-center ux:gap-3 ux:text-center ux:p-6">
          <p className="ux:text-sm ux:font-semibold ux:text-slate-900">Unable to render media</p>
          <p className="ux:text-xs ux:text-slate-500 ux:max-w-md ux:break-all">{media.src}</p>
          <button
            type="button"
            onClick={() => openExternal(hasSafeSrc ? "unsupported_or_blocked" : "invalid_url")}
            className="ux:px-4 ux:py-2 ux:rounded-xl ux:text-xs ux:font-bold ux:text-slate-900 ux:border ux:border-slate-300 ux:bg-white ux:shadow-sm hover:ux:bg-slate-50 ux:transition-all ux:cursor-pointer active:ux:scale-[0.98]"
          >
            Open in new tab
          </button>
        </div>
      );
    }

    if (resolvedType === "image") {
      return (
        <img
          src={media.src}
          alt={media.alt || "Media image"}
          className={`ux:h-full ux:w-full ux:object-contain ux:bg-slate-50 ${allowFullscreen ? "ux:cursor-zoom-in" : ""}`}
          onLoad={onMediaLoaded}
          onError={() => onMediaError("load_failed", "Image failed to load")}
          onClick={allowFullscreen ? toggleFullscreen : undefined}
        />
      );
    }

    if (resolvedType === "video") {
      return (
        <video
          src={media.src}
          className="ux:h-full ux:w-full ux:bg-black"
          controls={controls}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          poster={media.thumbnail}
          playsInline
          onLoadedData={onMediaLoaded}
          onPlay={() => dispatch?.("media_play", { type: "video", src: media.src })}
          onPause={() => dispatch?.("media_pause", { type: "video", src: media.src })}
          onError={() => onMediaError("load_failed", "Video failed to load")}
        />
      );
    }

    if (resolvedType === "youtube") {
      return (
        <iframe
          src={youtubeEmbedSrc || media.src}
          title={media.alt || "YouTube media"}
          className="ux:h-full ux:w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={onMediaLoaded}
        />
      );
    }

    if (resolvedType === "pdf") {
      if (openPdfInNewTab) {
        return (
          <div className="ux:h-full ux:w-full ux:flex ux:flex-col ux:items-center ux:justify-center ux:gap-4 ux:p-6 ux:bg-slate-50">
            <div className="ux:w-16 ux:h-16 ux:rounded-2xl ux:bg-rose-50 ux:text-rose-600 ux:flex ux:items-center ux:justify-center">
              <svg className="ux:w-8 ux:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ux:text-center ux:space-y-1">
              <p className="ux:text-sm ux:font-bold ux:text-slate-900">PDF Document</p>
              <p className="ux:text-xs ux:text-slate-500 ux:max-w-[240px] ux:truncate">{media.alt || media.src}</p>
            </div>
            <div className="ux:flex ux:gap-3">
              <button
                type="button"
                onClick={() => openExternal("pdf_new_tab")}
                className="ux:px-4 ux:py-2 ux:rounded-xl ux:text-xs ux:font-bold ux:border ux:border-slate-200 ux:bg-white ux:text-slate-900 hover:ux:bg-slate-50 ux:transition-all ux:cursor-pointer ux:shadow-sm active:ux:scale-[0.98]"
              >
                Open Document
              </button>
              <a
                href={media.src}
                download={media.downloadName}
                className="ux:px-4 ux:py-2 ux:rounded-xl ux:text-xs ux:font-bold ux:bg-slate-900 ux:text-white hover:ux:bg-slate-700 ux:transition-all ux:shadow-sm active:ux:scale-[0.98]"
                onClick={() => dispatch?.("pdf_download", { src: media.src, downloadName: media.downloadName })}
              >
                Download
              </a>
            </div>
          </div>
        );
      }

      return (
        <iframe
          src={media.src}
          title={media.alt || "PDF media"}
          className="ux:h-full ux:w-full"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-same-origin allow-scripts allow-downloads"
          onLoad={onMediaLoaded}
          onError={() => onMediaError("iframe_blocked_or_failed", "PDF preview could not be loaded")}
        />
      );
    }

    if (resolvedType === "audio") {
      return (
        <div className="ux:h-full ux:w-full ux:flex ux:flex-col ux:items-center ux:justify-center ux:gap-6 ux:px-8 ux:bg-slate-50">
          <div className="ux:w-16 ux:h-16 ux:rounded-2xl ux:bg-white ux:shadow-sm ux:flex ux:items-center ux:justify-center ux:text-slate-900">
            <svg className="ux:w-8 ux:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div className="ux:w-full ux:max-w-md ux:space-y-4">
            <audio
              src={media.src}
              controls={controls}
              autoPlay={autoplay}
              muted={muted}
              loop={loop}
              className="ux:w-full"
              onCanPlayThrough={onMediaLoaded}
              onPlay={() => dispatch?.("media_play", { type: "audio", src: media.src })}
              onPause={() => dispatch?.("media_pause", { type: "audio", src: media.src })}
              onError={() => onMediaError("load_failed", "Audio failed to load")}
            />
            {media.transcriptSrc && (
              <div className="ux:text-center">
                <a
                  href={media.transcriptSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ux:text-xs ux:font-semibold ux:text-slate-600 hover:ux:underline ux:bg-white ux:px-3 ux:py-1.5 ux:rounded-lg ux:border ux:border-slate-200"
                >
                  View Transcript
                </a>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="ux:w-full ux:max-w-5xl ux:mx-auto ux:space-y-8">
      {(title || subtitle) && (
        <div className="ux:space-y-2">
          {title && (
            <h2 className="ux:text-3xl ux:font-bold ux:text-slate-900">{title}</h2>
          )}
          {subtitle && (
            <p className="ux:text-base ux:text-slate-500 ux:max-w-2xl">{subtitle}</p>
          )}
        </div>
      )}

      <div className="ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:shadow-sm ux:overflow-hidden">
        <div
          className={`ux:relative ux:w-full ${
            isYouTubeShortsMedia && !height ? "ux:mx-auto ux:max-w-[280px] sm:ux:max-w-[320px]" : ""
          }`}
          style={effectiveContainerStyle}
        >
          {isLoading && !showInlineError && (
            <div className="ux:absolute ux:inset-0 ux:flex ux:items-center ux:justify-center ux:bg-slate-100 ux:animate-pulse ux:z-10">
              <p className="ux:text-xs ux:font-semibold ux:text-slate-500">Loading media...</p>
            </div>
          )}

          {allowFullscreen && (resolvedType === "image" || resolvedType === "video") && !showInlineError && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className="ux:absolute ux:top-3 ux:right-3 ux:z-20 ux:w-10 ux:h-10 ux:flex ux:items-center ux:justify-center ux:rounded-xl ux:bg-black/60 ux:text-white hover:ux:bg-black/80 ux:transition-all ux:cursor-pointer ux:backdrop-blur-sm"
              aria-label="Toggle fullscreen"
            >
              <svg className="ux:w-5 ux:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          )}

          {renderMedia()}
        </div>

        {!showInlineError && (
          <div className="ux:flex ux:items-center ux:justify-between ux:gap-2 ux:px-4 ux:py-3 ux:border-t ux:border-slate-100 ux:bg-slate-50">
            <div className="ux:min-w-0">
              <p className="ux:text-xs ux:text-slate-500 ux:truncate">{media.alt || media.src}</p>
              <p className="ux:text-[10px] ux:font-semibold ux:uppercase ux:tracking-wider ux:text-slate-400">{resolvedType}</p>
            </div>
            <button
              type="button"
              onClick={() => openExternal("manual_open")}
              className="ux:shrink-0 ux:px-4 ux:py-2 ux:rounded-xl ux:text-xs ux:font-bold ux:text-slate-900 ux:border ux:border-slate-300 ux:bg-white ux:shadow-sm hover:ux:bg-slate-50 ux:transition-all ux:cursor-pointer active:ux:scale-[0.98]"
            >
              Open in new tab
            </button>
          </div>
        )}
      </div>

      {media.transcriptSrc && resolvedType === "video" && (
        <a
          href={media.transcriptSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="ux:inline-flex ux:text-xs ux:font-semibold ux:text-slate-600 hover:ux:underline"
        >
          View transcript
        </a>
      )}

      {isFullscreenOpen && (resolvedType === "image" || resolvedType === "video") && (
        <div
          className="ux:fixed ux:inset-0 ux:z-50 ux:bg-black/90 ux:flex ux:items-center ux:justify-center ux:p-4"
          onClick={toggleFullscreen}
        >
          {resolvedType === "image" && (
            <div
              className="ux:absolute ux:top-4 ux:right-16 sm:ux:right-20 ux:z-40 ux:flex ux:items-center ux:gap-2 ux:bg-black/50 ux:backdrop-blur-sm ux:px-2 ux:py-2 ux:rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.max(1, Number((prev - 0.25).toFixed(2))))}
                disabled={zoomLevel <= 1}
                className="ux:w-9 ux:h-9 ux:rounded-full ux:bg-white/10 ux:border ux:border-white/20 ux:flex ux:items-center ux:justify-center ux:text-white ux:text-xl ux:leading-none ux:transition-all ux:cursor-pointer disabled:ux:opacity-40 disabled:ux:cursor-not-allowed hover:ux:bg-white/20"
                aria-label="Zoom out"
              >
                -
              </button>
              <span className="ux:text-white ux:text-xs ux:font-semibold ux:min-w-[48px] ux:text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.min(3, Number((prev + 0.25).toFixed(2))))}
                disabled={zoomLevel >= 3}
                className="ux:w-9 ux:h-9 ux:rounded-full ux:bg-white/10 ux:border ux:border-white/20 ux:flex ux:items-center ux:justify-center ux:text-white ux:text-xl ux:leading-none ux:transition-all ux:cursor-pointer disabled:ux:opacity-40 disabled:ux:cursor-not-allowed hover:ux:bg-white/20"
                aria-label="Zoom in"
              >
                +
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="ux:absolute ux:top-4 ux:right-4 ux:z-40 ux:w-10 ux:h-10 ux:rounded-full ux:bg-white/10 ux:border ux:border-white/20 ux:text-white ux:text-xl ux:cursor-pointer hover:ux:bg-white/20"
            aria-label="Close fullscreen"
          >
            ×
          </button>
          <div className="ux:relative ux:z-10 ux:w-full ux:max-w-6xl ux:max-h-[92vh]" onClick={(e) => e.stopPropagation()}>
            {resolvedType === "image" ? (
              <img
                src={media.src}
                alt={media.alt || "Fullscreen image"}
                className="ux:max-h-[92vh] ux:w-full ux:object-contain ux:transition-transform ux:duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            ) : (
              <video
                src={media.src}
                className="ux:max-h-[92vh] ux:w-full ux:bg-black"
                controls={controls}
                autoPlay
                muted={muted}
                loop={loop}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
