"use client";

import { useState } from "react";
// import "@500ux/components/styles/base.css"; This will be used in the production dont remove keep in all components

export const version = "1.0.0";

export interface PricingPlan {
  id: string | number;
  name: string;
  price: string | number;
  currency?: string;
  period?: string;
  features: string[];
  buttonText?: string;
  isMostPopular?: boolean;
  description?: string;
}

export interface PricingTableProps {
  /** Table title */
  title?: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Array of pricing plans */
  plans: PricingPlan[];
  /** Default layout direction: "horizontal" (side-by-side cards) or "vertical" (stacked rows) */
  layout?: "horizontal" | "vertical";
  /** Event dispatcher from 500ux runtime */
  dispatch?: (eventName: string, payload?: Record<string, unknown>) => void;
}

const CheckIcon = ({ highlighted }: { highlighted?: boolean }) => (
  <svg
    className={`ux:w-4 ux:h-4 ux:mt-0.5 ux:flex-shrink-0 ${highlighted ? "ux:text-emerald-500" : "ux:text-slate-400"}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function PricingTable({
  title,
  subtitle,
  plans,
  layout = "horizontal",
  dispatch,
}: PricingTableProps) {
  const [currentLayout, setCurrentLayout] = useState<"horizontal" | "vertical">(layout);

  const handleSelect = (plan: PricingPlan) => {
    dispatch?.("plan_selected", {
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
    });
  };

  if (!plans || plans.length === 0) {
    return (
      <div className="ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:p-8 ux:shadow-sm">
        <p className="ux:text-center ux:text-sm ux:text-slate-500">No pricing plans available</p>
      </div>
    );
  }

  return (
    <div className="ux:w-full ux:max-w-6xl ux:mx-auto">
      {/* Header */}
      <div className="ux:flex ux:flex-col sm:ux:flex-row sm:ux:items-start ux:justify-between ux:mb-10 ux:gap-4">
        <div className={`ux:space-y-2 ${!title && !subtitle ? "ux:hidden" : ""}`}>
          {title && (
            <h2 className="ux:text-3xl ux:font-bold ux:text-slate-900">{title}</h2>
          )}
          {subtitle && (
            <p className="ux:text-base ux:text-slate-500 ux:max-w-xl">{subtitle}</p>
          )}
        </div>

        {/* Layout Toggle */}
        <div className="ux:flex ux:items-center ux:gap-1 ux:bg-slate-100 ux:rounded-xl ux:p-1 ux:self-start sm:ux:self-auto ux:shrink-0">
          <button
            onClick={() => setCurrentLayout("horizontal")}
            title="Horizontal layout"
            className={`ux:flex ux:items-center ux:gap-2 ux:px-3 ux:py-2 ux:rounded-lg ux:text-xs ux:font-semibold ux:transition-all ux:cursor-pointer ${
              currentLayout === "horizontal"
                ? "ux:bg-white ux:text-slate-900 ux:shadow-sm"
                : "ux:text-slate-400 hover:ux:text-slate-600"
            }`}
          >
            {/* Horizontal icon: 3 side-by-side columns */}
            <svg className="ux:w-4 ux:h-4" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="4" height="12" rx="1" fill="currentColor" opacity="0.4"/>
              <rect x="6" y="2" width="4" height="12" rx="1" fill="currentColor"/>
              <rect x="11" y="2" width="4" height="12" rx="1" fill="currentColor" opacity="0.4"/>
            </svg>
            Columns
          </button>
          <button
            onClick={() => setCurrentLayout("vertical")}
            title="Vertical layout"
            className={`ux:flex ux:items-center ux:gap-2 ux:px-3 ux:py-2 ux:rounded-lg ux:text-xs ux:font-semibold ux:transition-all ux:cursor-pointer ${
              currentLayout === "vertical"
                ? "ux:bg-white ux:text-slate-900 ux:shadow-sm"
                : "ux:text-slate-400 hover:ux:text-slate-600"
            }`}
          >
            {/* Vertical icon: 3 stacked rows */}
            <svg className="ux:w-4 ux:h-4" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="1" width="12" height="4" rx="1" fill="currentColor" opacity="0.4"/>
              <rect x="2" y="6" width="12" height="4" rx="1" fill="currentColor"/>
              <rect x="2" y="11" width="12" height="4" rx="1" fill="currentColor" opacity="0.4"/>
            </svg>
            Rows
          </button>
        </div>
      </div>

      {/* Horizontal Layout: Cards side-by-side, collapses to stacked on small screens */}
      {currentLayout === "horizontal" && (
        <div
          className="ux:grid ux:gap-6 ux:items-stretch"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))" }}
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`ux:relative ux:flex ux:flex-col ux:p-7 ux:bg-white ux:border ux:rounded-2xl ux:transition-all ux:duration-200 ${
                plan.isMostPopular
                  ? "ux:border-slate-900 ux:shadow-xl ux:ring-1 ux:ring-slate-900"
                  : "ux:border-slate-200 ux:shadow-sm hover:ux:shadow-md hover:ux:border-slate-300"
              }`}
            >
              {plan.isMostPopular && (
                <span className="ux:absolute ux:top-0 ux:left-1/2 ux:-translate-x-1/2 ux:-translate-y-1/2 ux:bg-slate-900 ux:text-white ux:text-[10px] ux:font-bold ux:uppercase ux:tracking-widest ux:px-3 ux:py-1 ux:rounded-full ux:whitespace-nowrap">
                  Most Popular
                </span>
              )}

              {/* Plan name + description */}
              <div className="ux:mb-6">
                <h3 className="ux:text-base ux:font-bold ux:text-slate-900 ux:mb-1">{plan.name}</h3>
                {plan.description && (
                  <p className="ux:text-xs ux:text-slate-400 ux:leading-relaxed">{plan.description}</p>
                )}
              </div>

              {/* Price */}
              <div className="ux:flex ux:items-baseline ux:gap-1 ux:mb-6">
                <span className="ux:text-4xl ux:font-extrabold ux:text-slate-900">
                  {plan.currency || "$"}{plan.price}
                </span>
                {plan.period && (
                  <span className="ux:text-slate-400 ux:text-sm">{plan.period}</span>
                )}
              </div>

              {/* Features */}
              <ul className="ux:flex-1 ux:space-y-3 ux:mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="ux:flex ux:items-start ux:gap-2 ux:text-sm ux:text-slate-600">
                    <CheckIcon highlighted={plan.isMostPopular} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelect(plan)}
                className={`ux:w-full ux:py-2.5 ux:px-5 ux:rounded-xl ux:font-semibold ux:text-sm ux:transition-all ux:cursor-pointer ${
                  plan.isMostPopular
                    ? "ux:bg-slate-900 ux:text-white hover:ux:bg-slate-700"
                    : "ux:bg-slate-50 ux:text-slate-900 ux:border ux:border-slate-200 hover:ux:bg-slate-100 hover:ux:border-slate-300"
                }`}
              >
                {plan.buttonText || "Get Started"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Vertical Layout: Stacked rows */}
      {currentLayout === "vertical" && (
        <div className="ux:flex ux:flex-col ux:gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`ux:relative ux:flex ux:flex-col sm:ux:flex-row sm:ux:items-center ux:gap-6 ux:p-6 ux:bg-white ux:border ux:rounded-2xl ux:transition-all ux:duration-200 ${
                plan.isMostPopular
                  ? "ux:border-slate-900 ux:shadow-lg ux:ring-1 ux:ring-slate-900"
                  : "ux:border-slate-200 ux:shadow-sm hover:ux:shadow-md hover:ux:border-slate-300"
              }`}
            >
              {plan.isMostPopular && (
                <span className="ux:absolute ux:top-0 ux:right-6 ux:-translate-y-1/2 ux:bg-slate-900 ux:text-white ux:text-[10px] ux:font-bold ux:uppercase ux:tracking-widest ux:px-3 ux:py-1 ux:rounded-full">
                  Most Popular
                </span>
              )}

              {/* Name + Description */}
              <div className="ux:w-full sm:ux:w-48 ux:shrink-0">
                <h3 className="ux:text-base ux:font-bold ux:text-slate-900 ux:mb-1">{plan.name}</h3>
                {plan.description && (
                  <p className="ux:text-xs ux:text-slate-400 ux:leading-relaxed">{plan.description}</p>
                )}
              </div>

              {/* Price */}
              <div className="ux:w-28 ux:shrink-0 ux:flex ux:items-baseline ux:gap-1">
                <span className="ux:text-2xl ux:font-extrabold ux:text-slate-900">
                  {plan.currency || "$"}{plan.price}
                </span>
                {plan.period && (
                  <span className="ux:text-slate-400 ux:text-xs">{plan.period}</span>
                )}
              </div>

              {/* Features */}
              <ul className="ux:flex-1 ux:flex ux:flex-wrap ux:gap-x-6 ux:gap-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="ux:flex ux:items-center ux:gap-1.5 ux:text-xs ux:text-slate-600">
                    <CheckIcon highlighted={plan.isMostPopular} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="ux:shrink-0">
                <button
                  onClick={() => handleSelect(plan)}
                  className={`ux:whitespace-nowrap ux:py-2.5 ux:px-6 ux:rounded-xl ux:font-semibold ux:text-sm ux:transition-all ux:cursor-pointer ${
                    plan.isMostPopular
                      ? "ux:bg-slate-900 ux:text-white hover:ux:bg-slate-700"
                      : "ux:bg-slate-50 ux:text-slate-900 ux:border ux:border-slate-200 hover:ux:bg-slate-100 hover:ux:border-slate-300"
                  }`}
                >
                  {plan.buttonText || "Get Started"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
