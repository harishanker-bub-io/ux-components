"use client";

import { useCallback, useEffect, useRef, useState } from "react";
// import "@500ux/components/styles/base.css"; This will be used in the production dont remove keep in all components

export const version = "1.0.0";

export interface CarouselImage {
  src: string;
  alt?: string;
  caption?: string;
}

export interface CarouselProps {
  /** Array of images to display */
  images: CarouselImage[];
  /** Number of images to show at once */
  visibleCount?: number;
  /** Enable autoplay */
  autoplay?: boolean;
  /** Autoplay interval in ms */
  autoplayInterval?: number;
  /** Event dispatcher from 500ux runtime */
  dispatch?: (eventName: string, payload?: Record<string, unknown>) => void;
}

export default function Carousel({
  images,
  visibleCount = 3,
  autoplay = false,
  autoplayInterval = 3000,
  dispatch,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive visible count: 1 on mobile, 2 on tablet, full on desktop
  const effectiveVisibleCount =
    windowWidth === 0
      ? visibleCount
      : windowWidth < 640
      ? 1
      : windowWidth < 1024
      ? Math.min(2, visibleCount)
      : visibleCount;

  const maxIndex = Math.max(0, images.length - effectiveVisibleCount);

  // Track window width
  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Reset index when effective count changes to avoid out-of-bounds
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    dispatch?.("carousel_navigate", { direction: "previous", index: currentIndex - 1 });
  }, [currentIndex, dispatch]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    dispatch?.("carousel_navigate", { direction: "next", index: currentIndex + 1 });
  }, [currentIndex, maxIndex, dispatch]);

  const openModal = useCallback(
    (index: number) => {
      setSelectedImage(index);
      setZoomLevel(1);
      dispatch?.("image_opened", { index, image: images[index] });
    },
    [images, dispatch]
  );

  const closeModal = useCallback(() => {
    setSelectedImage(null);
    setZoomLevel(1);
    dispatch?.("modal_closed", {});
  }, [dispatch]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      goToNext();
    }
    if (touchStart - touchEnd < -75) {
      goToPrevious();
    }
  };

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return next > maxIndex ? 0 : next;
      });
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, maxIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;

      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft") {
        setSelectedImage((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedImage((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, images.length, closeModal]);

  useEffect(() => {
    if (selectedImage !== null) {
      setZoomLevel(1);
    }
  }, [selectedImage]);

  if (!images || images.length === 0) {
    return (
      <div className="ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:p-8 ux:shadow-sm">
        <p className="ux:text-center ux:text-sm ux:text-slate-500">No images to display</p>
      </div>
    );
  }

  return (
    <>
      <div className="ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:shadow-sm ux:overflow-hidden">
        <div className="ux:relative ux:px-10 ux:py-6 sm:ux:px-12 sm:ux:py-8">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="ux:absolute ux:left-1.5 sm:ux:left-2 ux:top-1/2 ux:-translate-y-1/2 ux:z-10 ux:w-8 ux:h-8 sm:ux:w-10 sm:ux:h-10 ux:rounded-full ux:bg-white ux:border ux:border-slate-200 ux:shadow-md ux:flex ux:items-center ux:justify-center ux:transition-all ux:cursor-pointer disabled:ux:opacity-40 disabled:ux:cursor-not-allowed hover:ux:bg-slate-50 hover:ux:scale-110"
            aria-label="Previous"
          >
            <svg
              className="ux:w-4 ux:h-4 sm:ux:w-5 sm:ux:h-5 ux:text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image Track */}
          <div
            ref={containerRef}
            className="ux:overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="ux:flex ux:gap-3 sm:ux:gap-4 ux:transition-transform ux:duration-500 ux:ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / effectiveVisibleCount)}%)`,
              }}
            >
              {images.map((image, idx) => (
                <div
                  key={idx}
                  className="ux:flex-shrink-0 ux:cursor-pointer ux:group"
                  style={{
                    width: `calc(${100 / effectiveVisibleCount}% - ${
                      ((effectiveVisibleCount - 1) * (effectiveVisibleCount > 1 ? 12 : 0)) / effectiveVisibleCount
                    }px)`,
                  }}
                  onClick={() => openModal(idx)}
                >
                  <div className="ux:relative ux:aspect-[4/3] ux:rounded-xl ux:overflow-hidden ux:bg-slate-100 ux:border ux:border-slate-200 ux:transition-all group-hover:ux:shadow-lg group-hover:ux:scale-[1.02]">
                    <img
                      src={image.src}
                      alt={image.alt || `Image ${idx + 1}`}
                      className="ux:w-full ux:h-full ux:object-cover"
                    />
                    {/* Caption overlay — always visible on mobile, hover on desktop */}
                    <div className={`ux:absolute ux:inset-0 ux:bg-gradient-to-t ux:from-black/60 ux:via-transparent ux:to-transparent ux:flex ux:items-end ux:p-3 sm:ux:p-4 ux:transition-opacity ${effectiveVisibleCount === 1 ? "ux:opacity-100" : "ux:opacity-0 group-hover:ux:opacity-100"}`}>
                      {image.caption && (
                        <p className="ux:text-white ux:text-xs sm:ux:text-sm ux:font-medium ux:leading-snug">{image.caption}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="ux:absolute ux:right-1.5 sm:ux:right-2 ux:top-1/2 ux:-translate-y-1/2 ux:z-10 ux:w-8 ux:h-8 sm:ux:w-10 sm:ux:h-10 ux:rounded-full ux:bg-white ux:border ux:border-slate-200 ux:shadow-md ux:flex ux:items-center ux:justify-center ux:transition-all ux:cursor-pointer disabled:ux:opacity-40 disabled:ux:cursor-not-allowed hover:ux:bg-slate-50 hover:ux:scale-110"
            aria-label="Next"
          >
            <svg
              className="ux:w-4 ux:h-4 sm:ux:w-5 sm:ux:h-5 ux:text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Indicators */}
        {images.length > effectiveVisibleCount && (
          <div className="ux:flex ux:justify-center ux:gap-2 ux:pb-5">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`ux:h-2 ux:rounded-full ux:transition-all ux:cursor-pointer ${
                  idx === currentIndex
                    ? "ux:w-6 ux:bg-slate-900"
                    : "ux:w-2 ux:bg-slate-300 hover:ux:bg-slate-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage !== null && (
        <div
          className="ux:fixed ux:inset-0 ux:z-50 ux:flex ux:items-center ux:justify-center ux:bg-black/90 ux:backdrop-blur-sm ux:p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="ux:absolute ux:top-4 ux:right-4 ux:z-30 ux:w-10 ux:h-10 ux:rounded-full ux:bg-white/10 ux:border ux:border-white/20 ux:flex ux:items-center ux:justify-center ux:transition-all ux:cursor-pointer hover:ux:bg-white/20"
            aria-label="Close"
          >
            <svg
              className="ux:w-6 ux:h-6 ux:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Zoom Controls */}
          <div
            className="ux:absolute ux:top-4 ux:right-16 sm:ux:right-20 ux:z-30 ux:flex ux:items-center ux:gap-2 ux:bg-black/50 ux:backdrop-blur-sm ux:px-2 ux:py-2 ux:rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
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
              onClick={() => setZoomLevel((prev) => Math.min(3, Number((prev + 0.25).toFixed(2))))}
              disabled={zoomLevel >= 3}
              className="ux:w-9 ux:h-9 ux:rounded-full ux:bg-white/10 ux:border ux:border-white/20 ux:flex ux:items-center ux:justify-center ux:text-white ux:text-xl ux:leading-none ux:transition-all ux:cursor-pointer disabled:ux:opacity-40 disabled:ux:cursor-not-allowed hover:ux:bg-white/20"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>

          {/* Previous Modal Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
            }}
            className="ux:absolute ux:left-4 ux:z-30 ux:w-12 ux:h-12 ux:rounded-full ux:bg-white/10 ux:border ux:border-white/20 ux:flex ux:items-center ux:justify-center ux:transition-all ux:cursor-pointer hover:ux:bg-white/20"
            aria-label="Previous image"
          >
            <svg
              className="ux:w-6 ux:h-6 ux:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="ux:max-w-5xl ux:max-h-[90vh] ux:relative ux:z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImage].src}
              alt={images[selectedImage].alt || `Image ${selectedImage + 1}`}
              className="ux:max-w-full ux:max-h-[90vh] ux:object-contain ux:rounded-lg ux:transition-transform ux:duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            {images[selectedImage].caption && (
              <div className="ux:absolute ux:bottom-0 ux:left-0 ux:right-0 ux:bg-black/60 ux:backdrop-blur-sm ux:p-4 ux:rounded-b-lg">
                <p className="ux:text-white ux:text-center ux:font-medium">
                  {images[selectedImage].caption}
                </p>
              </div>
            )}
          </div>

          {/* Next Modal Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
            }}
            className="ux:absolute ux:right-4 ux:z-30 ux:w-12 ux:h-12 ux:rounded-full ux:bg-white/10 ux:border ux:border-white/20 ux:flex ux:items-center ux:justify-center ux:transition-all ux:cursor-pointer hover:ux:bg-white/20"
            aria-label="Next image"
          >
            <svg
              className="ux:w-6 ux:h-6 ux:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="ux:absolute ux:bottom-4 ux:left-1/2 ux:-translate-x-1/2 ux:z-30 ux:bg-black/60 ux:backdrop-blur-sm ux:px-4 ux:py-2 ux:rounded-full">
            <p className="ux:text-white ux:text-sm ux:font-medium">
              {selectedImage + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
