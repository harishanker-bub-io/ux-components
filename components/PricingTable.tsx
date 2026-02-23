"use client";

import { useMemo } from "react";
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
  /** Event dispatcher from 500ux runtime */
  dispatch?: (eventName: string, payload?: Record<string, unknown>) => void;
}

export default function PricingTable({
  title,
  subtitle,
  plans,
  dispatch,
}: PricingTableProps) {
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
      {(title || subtitle) && (
        <div className="ux:text-center ux:mb-12">
          {title && (
            <h2 className="ux:text-3xl ux:font-bold ux:text-slate-900 ux:mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="ux:text-lg ux:text-slate-600 ux:max-w-2xl ux:mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="ux:grid ux:grid-cols-1 md:ux:grid-cols-2 lg:ux:grid-cols-3 ux:gap-8 ux:items-start">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`ux:relative ux:flex ux:flex-col ux:p-8 ux:bg-white ux:border ux:rounded-2xl ux:transition-all ux:duration-300 ${
              plan.isMostPopular
                ? "ux:border-slate-900 ux:shadow-xl ux:scale-105 ux:z-10"
                : "ux:border-slate-200 ux:shadow-sm hover:ux:shadow-md hover:ux:border-slate-300"
            }`}
          >
            {plan.isMostPopular && (
              <span className="ux:absolute ux:top-0 ux:left-1/2 ux:-translate-x-1/2 ux:-translate-y-1/2 ux:bg-slate-900 ux:text-white ux:text-[10px] ux:font-bold ux:uppercase ux:tracking-widest ux:px-3 ux:py-1 ux:rounded-full">
                Most Popular
              </span>
            )}

            <div className="ux:mb-8">
              <h3 className="ux:text-lg ux:font-bold ux:text-slate-900 ux:mb-2">
                {plan.name}
              </h3>
              {plan.description && (
                <p className="ux:text-sm ux:text-slate-500 ux:mb-6">
                  {plan.description}
                </p>
              )}
              <div className="ux:flex ux:items-baseline ux:gap-1">
                <span className="ux:text-4xl ux:font-bold ux:text-slate-900">
                  {plan.currency || "$"}{plan.price}
                </span>
                {plan.period && (
                  <span className="ux:text-slate-500 ux:text-sm">
                    {plan.period}
                  </span>
                )}
              </div>
            </div>

            <ul className="ux:flex-1 ux:space-y-4 ux:mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="ux:flex ux:items-start ux:gap-3 ux:text-sm ux:text-slate-600">
                  <svg
                    className={`ux:w-5 ux:h-5 ux:mt-0.5 ux:flex-shrink-0 ${
                      plan.isMostPopular ? "ux:text-emerald-500" : "ux:text-slate-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelect(plan)}
              className={`ux:w-full ux:py-3 ux:px-6 ux:rounded-xl ux:font-semibold ux:text-sm ux:transition-all ux:cursor-pointer ${
                plan.isMostPopular
                  ? "ux:bg-slate-900 ux:text-white hover:ux:bg-slate-800"
                  : "ux:bg-slate-50 ux:text-slate-900 ux:border ux:border-slate-200 hover:ux:bg-slate-100 hover:ux:border-slate-300"
              }`}
            >
              {plan.buttonText || "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
