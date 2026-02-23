"use client";

import { useCallback, useState } from "react";
// import "@500ux/components/styles/base.css";

export const version = "1.0.0";

export interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

export interface FAQProps {
  /** Title for the FAQ section */
  title?: string;
  /** Subtitle for the FAQ section */
  subtitle?: string;
  /** Array of FAQ faqs */
  faqs: FAQItem[];
  /** Allow multiple faqs to be open at once (default: true) */
  allowMultiple?: boolean;
  /** Event dispatcher from 500ux runtime */
  dispatch?: (eventName: string, payload?: Record<string, unknown>) => void;
  /** Background color for cards */
  cardBg?: string;
  /** Border color for cards */
  cardBorder?: string;
  /** Background color for section */
  sectionBg?: string;
  /** Color for headings */
  headingColor?: string;
  /** Color for body text */
  bodyColor?: string;
  /** Color for muted text */
  mutedColor?: string;
  /** Font family for text */
  fontFamily?: string;
  /** Alignment for title and subtitle */
  titleAlign?: 'left' | 'center' | 'right';
}

export default function Faqs({
  title,
  subtitle,
  faqs,
  allowMultiple = true,
  dispatch,
  cardBg = "#ffffff",
  cardBorder = "#e2e8f0",
  sectionBg = "transparent",
  headingColor = "#0f172a",
  bodyColor = "#475569",
  mutedColor = "#94a3b8",
  fontFamily = "inherit",
  titleAlign = "center",
}: FAQProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleItem = useCallback(
    (index: number) => {
      setOpenIndices((prev) => {
        const isOpen = prev.includes(index);
        let newOpen: number[];

        if (isOpen) {
          // Close this one
          newOpen = prev.filter((i) => i !== index);
        } else {
          // Open this one
          if (allowMultiple) {
            newOpen = [...prev, index];
          } else {
            // Single mode → close others
            newOpen = [index];
          }
        }

        return newOpen;
      });

      // Dispatch event after state update to avoid rendering during render
      dispatch?.("faq_toggled", {
        index,
        question: faqs[index]?.question,
        opened: !openIndices.includes(index),
        openCount: openIndices.includes(index) ? Math.max(0, openIndices.length - 1) : openIndices.length + 1,
      });
    },
    [allowMultiple, dispatch, faqs, openIndices]
  );

  if (!faqs || faqs.length === 0) {
    return (
      <div className="ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:p-8 ux:shadow-sm">
        <p className="ux:text-center ux:text-sm ux:text-slate-500">No FAQs available</p>
      </div>
    );
  }

  return (
    <div className="ux:w-full ux:max-w-6xl ux:mx-auto">
      {(title || subtitle) && (
        <div className={`ux:mb-8 ${titleAlign === 'center' ? 'ux:text-center' : titleAlign === 'left' ? 'ux:text-left' : 'ux:text-right'}`} style={{ backgroundColor: sectionBg, fontFamily }}>
          {title && (
            <h2 className="ux:text-3xl ux:font-bold ux:text-slate-900 ux:mb-2" style={{ color: headingColor, fontFamily }}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="ux:text-lg ux:text-slate-600 ux:max-w-2xl ux:mx-auto" style={{ color: bodyColor, fontFamily }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:shadow-sm ux:overflow-hidden ux:divide-y ux:divide-slate-100" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
        {faqs.map((item, index) => {
          const isOpen = openIndices.includes(index);

          return (
            <div key={index} className="ux:group">
              <button
                onClick={() => toggleItem(index)}
                className="ux:flex ux:w-full ux:items-center ux:justify-between ux:px-6 ux:py-4 ux:text-left ux:transition-colors ux:hover:bg-slate-50 ux:focus:outline-none ux:focus:ring-2 ux:focus:ring-slate-200 ux:cursor-pointer"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                style={{ backgroundColor: cardBg, fontFamily }}
              >
                <span className="ux:text-lg ux:font-medium ux:text-slate-900 ux:group-hover:text-slate-700" style={{ color: headingColor, fontFamily }}>
                  {item.question}
                </span>

                {/* Plus / Minus icon with rotation */}
                <span
                  className={`ux:ml-4 ux:flex ux:h-8 ux:w-8 ux:items-center ux:justify-center ux:rounded-full ux:bg-slate-100 ux:text-slate-600 ux:transition-all ux:duration-300 ux:group-hover:bg-slate-200 ux:cursor-pointer ${
                    isOpen ? "ux:rotate-180" : ""
                  }`}
                  style={{ backgroundColor: cardBg, color: mutedColor }}
                >
                  <svg
                    className="ux:h-5 ux:w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>

              {/* Answer content with smooth height animation */}
              <div
                id={`faq-answer-${index}`}
                className={`ux:overflow-hidden ux:transition-all ux:duration-300 ux:ease-out ${
                  isOpen ? "ux:max-h-250 ux:pb-6" : "ux:max-h-0"
                }`}
                style={{
                  transitionProperty: "max-height, padding-bottom",
                  backgroundColor: cardBg,
                  color: bodyColor,
                  fontFamily,
                }}
              >
                <div className="ux:px-6 ux:pt-4 ux:pb-2 ux:text-slate-600" style={{ color: bodyColor, fontFamily }}>
                  {typeof item.answer === "string" ? (
                    <p className="ux:leading-relaxed">{item.answer}</p>
                  ) : (
                    item.answer
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
