"use client";

import { useState } from "react";
// import "@500ux/components/styles/base.css"; This will be used in the production dont remove keep in all components

export const version = "1.0.0";

export interface PricingPlan {
  id: string | number;
  name: string;
  price: string | number;
  yearlyPrice?: string | number;
  currency?: string;
  period?: string;
  yearlyPeriod?: string;
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
  /** Whether to show the monthly/yearly toggle */
  showBillingToggle?: boolean;
  /** Label for yearly billing discount badge */
  yearlyDiscountText?: string;
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
  showBillingToggle = false,
  yearlyDiscountText,
  dispatch,
}: PricingTableProps) {
  const [isYearly, setIsYearly] = useState(false);

  const handleSelect = (plan: PricingPlan) => {
    dispatch?.("plan_selected", {
      planId: plan.id,
      planName: plan.name,
      price: isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price,
      billingCycle: isYearly ? "yearly" : "monthly",
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
      <div className="ux:flex ux:flex-col lg:ux:flex-row lg:ux:items-end ux:justify-between ux:mb-12 ux:gap-8">
        <div className={`ux:space-y-2 ${!title && !subtitle ? "ux:hidden" : "ux:flex-1"}`}>
          {title && (
            <h2 className="ux:text-3xl ux:font-bold ux:text-slate-900">{title}</h2>
          )}
          {subtitle && (
            <p className="ux:text-base ux:text-slate-500 ux:max-w-xl">{subtitle}</p>
          )}
        </div>

        <div className="ux:flex ux:flex-col sm:ux:flex-row ux:items-center ux:gap-6">
          {/* Billing Toggle */}
          {showBillingToggle && (
            <div className="ux:flex ux:items-center ux:gap-3 ux:bg-slate-50 ux:p-1.5 ux:rounded-2xl ux:border ux:border-slate-100">
              <button
                onClick={() => setIsYearly(false)}
                className={`ux:px-4 ux:py-2 ux:rounded-xl ux:text-xs ux:font-bold ux:transition-all ux:cursor-pointer ${
                  !isYearly
                    ? "ux:bg-white ux:text-slate-900 ux:shadow-sm"
                    : "ux:text-slate-400 hover:ux:text-slate-600"
                }`}
              >
                Monthly
              </button>
              <div className="ux:relative ux:flex ux:items-center ux:gap-2">
                <button
                  onClick={() => setIsYearly(true)}
                  className={`ux:px-4 ux:py-2 ux:rounded-xl ux:text-xs ux:font-bold ux:transition-all ux:cursor-pointer ${
                    isYearly
                      ? "ux:bg-white ux:text-slate-900 ux:shadow-sm"
                      : "ux:text-slate-400 hover:ux:text-slate-600"
                  }`}
                >
                  Yearly
                </button>
                {yearlyDiscountText && (
                  <span className="ux:absolute ux:-top-8 ux:left-1/2 ux:-translate-x-1/2 ux:whitespace-nowrap ux:bg-emerald-100 ux:text-emerald-700 ux:text-[10px] ux:font-bold ux:px-2 ux:py-1 ux:rounded-lg ux:animate-bounce">
                    {yearlyDiscountText}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div
        className="ux:grid ux:gap-6 ux:items-stretch"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))" }}
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`ux:relative ux:flex ux:flex-col ux:p-7 ux:transition-all ux:duration-200 ux:bg-white ux:border ux:rounded-2xl ${
              plan.isMostPopular
                ? "ux:border-slate-900 ux:shadow-xl ux:ring-1 ux:ring-slate-900"
                : "ux:border-slate-200 ux:shadow-sm hover:ux:shadow-md hover:ux:border-slate-300"
            }`}
          >
            {plan.isMostPopular && (
              <span className="ux:absolute ux:bg-slate-900 ux:text-white ux:text-[10px] ux:font-bold ux:uppercase ux:tracking-widest ux:px-3 ux:py-1 ux:rounded-full ux:top-0 ux:left-1/2 ux:-translate-x-1/2 ux:-translate-y-1/2 ux:whitespace-nowrap">
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
                {plan.currency || "$"}{isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
              </span>
              <span className="ux:text-slate-400 ux:text-sm">
                {(isYearly && plan.yearlyPeriod) ? plan.yearlyPeriod : plan.period}
              </span>
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

            {/* CTA */}
            <div>
              <button
                onClick={() => handleSelect(plan)}
                className={`ux:w-full ux:py-2.5 ux:px-6 ux:rounded-xl ux:font-semibold ux:text-sm ux:transition-all ux:cursor-pointer ${
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
    </div>
  );
}
