"use client";

import { useMemo, useState } from "react";
// import "@500ux/components/styles/base.css"; This will be used in the production dont remove keep in all components

export const version = "2.0.0";

// ─────────────────────────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface PricingFeature {
  /** Feature label text */
  label: string;
  /** Optional sub-description shown beneath the label */
  subLabel?: string;
  /** true = checkmark (default), false = excluded dash */
  included?: boolean;
  /** Highlight this feature with the plan's accent color */
  highlight?: boolean;
}

export interface PricingFeatureGroup {
  /** Category header label, e.g. "USAGE", "AVATAR", "INTELLIGENCE" */
  groupLabel: string;
  /** Features inside this group */
  features: PricingFeature[];
}

export interface PricingPlan {
  id: string | number;
  name: string;
  /** Monthly price value (number or string, e.g. "0", "39", "Free") */
  price: string | number;
  /** Yearly price value shown when billing toggle is set to yearly */
  yearlyPrice?: string | number;
  /** Savings text shown under yearly price, e.g. "Save $120/yr billed annually" */
  yearlySavings?: string;
  /** Currency symbol, defaults to "$" */
  currency?: string;
  /** Period label for monthly, e.g. "/mo" */
  period?: string;
  /** Period label for yearly, e.g. "/yr" */
  yearlyPeriod?: string;
  /** Simple flat feature string list (legacy / quick setup) */
  features?: string[];
  /** Rich grouped features with categories, sub-labels and states */
  featureGroups?: PricingFeatureGroup[];
  /** CTA button text */
  buttonText?: string;
  /** Mark this as the highlighted / most popular plan */
  isMostPopular?: boolean;
  /** Override the badge text. Defaults to "Most Popular" */
  mostPopularLabel?: string;
  /** Short plan tagline */
  description?: string;
  /** Accent color for CTA button + highlighted features. Defaults to #0f172a (light) / #6366f1 (dark) */
  accentColor?: string;
}

export interface ComparisonRow {
  /** Section/category this row belongs to, e.g. "USAGE & TRAINING" */
  category?: string;
  /** Feature name */
  label: string;
  /**
   * Per-plan display value keyed by plan id.
   * true  → checkmark
   * false | null | undefined → dash (not included)
   * string → text value (e.g. "1,000", "Unlimited", "Top 5")
   */
  values: Record<string | number, string | boolean | null | undefined>;
}

export interface PricingTableProps {
  /** Section heading */
  title?: string;
  /** Section subheading */
  subtitle?: string;
  /** Pricing plans */
  plans: PricingPlan[];
  /** Show monthly / yearly billing toggle */
  showBillingToggle?: boolean;
  /** Badge text shown on the Yearly button, e.g. "Save 20%" */
  yearlyDiscountText?: string;
  /**
   * "cards"      – individual plan cards (default)
   * "comparison" – full feature comparison table
   * "both"       – cards + a Plans / Compare toggle button
   */
  mode?: "cards" | "comparison" | "both";
  /** Feature rows for the comparison table view */
  comparisonRows?: ComparisonRow[];
  /** Event dispatcher from 500ux runtime */
  dispatch?: (eventName: string, payload?: Record<string, unknown>) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon helpers
// ─────────────────────────────────────────────────────────────────────────────

const CheckIcon = ({ color }: { color: string }) => (
  <svg
    className="ux:w-4 ux:h-4 ux:flex-shrink-0"
    style={{ color }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const DashIcon = ({ color }: { color: string }) => (
  <svg
    className="ux:w-4 ux:h-4 ux:flex-shrink-0"
    style={{ color }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function Pricing({
  title,
  subtitle,
  plans,
  showBillingToggle = false,
  yearlyDiscountText,
  mode = "cards",
  comparisonRows = [],
  dispatch,
}: PricingTableProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [activeView, setActiveView] = useState<"cards" | "comparison">("cards");

  const currentView = mode === "both" ? activeView : mode;

  const planAccent = (plan: PricingPlan) => plan.accentColor || "#0f172a";

  const handleSelect = (plan: PricingPlan) => {
    dispatch?.("plan_selected", {
      planId: plan.id,
      planName: plan.name,
      price: isYearly && plan.yearlyPrice != null ? plan.yearlyPrice : plan.price,
      billingCycle: isYearly ? "yearly" : "monthly",
    });
  };

  // Ordered unique categories from comparisonRows
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const row of comparisonRows) {
      const cat = row.category ?? "";
      if (!seen.has(cat)) { seen.add(cat); out.push(cat); }
    }
    return out;
  }, [comparisonRows]);

  if (!plans || plans.length === 0) {
    return (
      <div className="ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:p-8 ux:shadow-sm">
        <p className="ux:text-center ux:text-sm ux:text-slate-500">No pricing plans available</p>
      </div>
    );
  }

  // ── Header ─────────────────────────────────────────────────────────────────
  const renderHeader = () => (
    <div className="ux:flex ux:flex-col lg:ux:flex-row lg:ux:items-end ux:justify-between ux:mb-10 ux:gap-6">
      <div className={`ux:space-y-2 ux:flex-1 ${!title && !subtitle ? "ux:hidden" : ""}`}>
        {title && <h2 className="ux:text-3xl ux:font-bold ux:text-slate-900">{title}</h2>}
        {subtitle && <p className="ux:text-base ux:text-slate-500 ux:max-w-xl">{subtitle}</p>}
      </div>

      <div className="ux:flex ux:items-center ux:gap-3 ux:flex-wrap">
        {/* Plans / Compare toggle — shown only in "both" mode */}
        {mode === "both" && (
          <div className="ux:flex ux:items-center ux:p-1 ux:rounded-xl ux:border ux:border-slate-200 ux:bg-slate-50">
            {(["cards", "comparison"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={`ux:px-4 ux:py-1.5 ux:rounded-lg ux:text-xs ux:font-bold ux:transition-all ux:cursor-pointer active:ux:scale-[0.98] ${
                  activeView === v
                    ? "ux:bg-white ux:text-slate-900 ux:shadow-sm"
                    : "ux:text-slate-400 hover:ux:text-slate-600"
                }`}
              >
                {v === "cards" ? "Plans" : "Compare All"}
              </button>
            ))}
          </div>
        )}

        {/* Monthly / Yearly billing toggle */}
        {showBillingToggle && (
          <div className="ux:flex ux:items-center ux:p-1.5 ux:rounded-2xl ux:border ux:border-slate-100 ux:bg-slate-50">
            <button
              onClick={() => setIsYearly(false)}
              className={`ux:px-4 ux:py-2 ux:rounded-xl ux:text-xs ux:font-bold ux:transition-all ux:cursor-pointer active:ux:scale-[0.98] ${
                !isYearly
                  ? "ux:bg-white ux:text-slate-900 ux:shadow-sm"
                  : "ux:text-slate-400 hover:ux:text-slate-600"
              }`}
            >
              Monthly
            </button>
            <div className="ux:relative">
              <button
                onClick={() => setIsYearly(true)}
                className={`ux:px-4 ux:py-2 ux:rounded-xl ux:text-xs ux:font-bold ux:transition-all ux:cursor-pointer active:ux:scale-[0.98] ${
                  isYearly
                    ? "ux:bg-white ux:text-slate-900 ux:shadow-sm"
                    : "ux:text-slate-400 hover:ux:text-slate-600"
                }`}
              >
                Yearly
              </button>
              {yearlyDiscountText && (
                <span className="ux:absolute ux:-top-8 ux:left-1/2 ux:-translate-x-1/2 ux:whitespace-nowrap ux:text-[10px] ux:font-bold ux:px-2 ux:py-1 ux:rounded-lg ux:animate-bounce ux:bg-emerald-100 ux:text-emerald-700">
                  {yearlyDiscountText}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Cards view ─────────────────────────────────────────────────────────────
  const renderCards = () => (
    <div
      className="ux:grid ux:gap-6 ux:items-start"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))" }}
    >
      {plans.map((plan) => {
        const accent = planAccent(plan);
        const displayPrice = isYearly && plan.yearlyPrice != null ? plan.yearlyPrice : plan.price;
        const displayPeriod = isYearly && plan.yearlyPeriod ? plan.yearlyPeriod : plan.period;

        return (
          <div
            key={plan.id}
            className={`ux:relative ux:flex ux:flex-col ux:rounded-2xl ux:overflow-hidden ux:bg-white ux:transition-all ux:duration-200 ${
              plan.isMostPopular
                ? "ux:shadow-xl"
                : "ux:border ux:border-slate-200 ux:shadow-sm hover:ux:shadow-md hover:ux:border-slate-300"
            }`}
            style={plan.isMostPopular ? { border: `1px solid ${accent}`, boxShadow: `0 0 0 1px ${accent}, 0 8px 32px rgba(0,0,0,0.12)` } : {}}
          >
            {/* Most popular banner */}
            {plan.isMostPopular && (
              <div
                className="ux:text-[10px] ux:font-bold ux:uppercase ux:tracking-widest ux:text-center ux:py-1.5 ux:text-white"
                style={{ backgroundColor: accent }}
              >
                {plan.mostPopularLabel ?? "Most Popular"}
              </div>
            )}

            {/* Plan header */}
            <div className="ux:px-6 ux:pt-6 ux:pb-5">
              <h3 className="ux:text-base ux:font-bold ux:text-slate-900 ux:mb-1">
                {plan.name}
              </h3>
              {plan.description && (
                <p className="ux:text-xs ux:text-slate-400 ux:leading-relaxed">
                  {plan.description}
                </p>
              )}

              {/* Price block */}
              <div className="ux:mt-4">
                <div className="ux:flex ux:items-start ux:gap-0.5">
                  <span className="ux:text-sm ux:font-semibold ux:text-slate-900 ux:mt-2">
                    {plan.currency ?? "$"}
                  </span>
                  <span className="ux:text-5xl ux:font-extrabold ux:leading-none ux:text-slate-900">
                    {displayPrice}
                  </span>
                  {displayPeriod && (
                    <span className="ux:text-sm ux:text-slate-400 ux:self-end ux:mb-1 ux:ml-0.5">
                      {displayPeriod}
                    </span>
                  )}
                </div>
                {isYearly && plan.yearlySavings && (
                  <p className="ux:text-xs ux:mt-1.5 ux:font-medium" style={{ color: accent }}>
                    {plan.yearlySavings}
                  </p>
                )}
              </div>

              {/* CTA button */}
              <button
                onClick={() => handleSelect(plan)}
                className={`ux:w-full ux:mt-5 ux:py-2.5 ux:px-6 ux:rounded-xl ux:font-bold ux:text-sm ux:transition-all ux:cursor-pointer ux:shadow-sm active:ux:scale-[0.98] ${
                  plan.isMostPopular
                    ? "ux:text-white"
                    : "ux:bg-white ux:text-slate-900 ux:border ux:border-slate-200 hover:ux:bg-slate-50 hover:ux:border-slate-300"
                }`}
                style={plan.isMostPopular ? { backgroundColor: accent } : {}}
              >
                {plan.buttonText ?? "Get Started"}
              </button>
            </div>

            {/* Divider */}
            <div className="ux:h-px ux:bg-slate-100" />

            {/* Feature sections */}
            <div className="ux:px-6 ux:py-5 ux:flex-1 ux:flex ux:flex-col ux:gap-6">
              {/* Legacy flat list */}
              {plan.features && plan.features.length > 0 && !plan.featureGroups && (
                <ul className="ux:space-y-3">
                  {plan.features.map((f, i) => (
                    <li key={i} className="ux:flex ux:items-start ux:gap-2.5">
                      <CheckIcon color={accent} />
                      <span className="ux:text-sm ux:text-slate-600">{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Rich grouped features */}
              {plan.featureGroups?.map((group, gi) => (
                <div key={gi}>
                  <p className="ux:text-[10px] ux:font-bold ux:uppercase ux:tracking-widest ux:text-slate-400 ux:mb-3">
                    {group.groupLabel}
                  </p>
                  <ul className="ux:space-y-3">
                    {group.features.map((feat, fi) => {
                      const included = feat.included !== false;

                      return (
                        <li key={fi} className="ux:flex ux:items-start ux:gap-2.5">
                          {included
                            ? <CheckIcon color={feat.highlight ? accent : "#94a3b8"} />
                            : <DashIcon color="#cbd5e1" />
                          }
                          <div className="ux:min-w-0">
                            <span
                              className={`ux:text-sm ux:leading-snug ${
                                feat.highlight ? "ux:font-semibold" : included ? "ux:text-slate-600" : "ux:text-slate-400"
                              }`}
                              style={feat.highlight ? { color: accent } : {}}
                            >
                              {feat.label}
                            </span>
                            {feat.subLabel && (
                              <p className="ux:text-[11px] ux:text-slate-400 ux:mt-0.5 ux:leading-snug">
                                {feat.subLabel}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── Comparison table view ──────────────────────────────────────────────────
  const renderComparison = () => {
    if (comparisonRows.length === 0) {
      return (
        <p className="ux:text-center ux:text-sm ux:text-slate-400 ux:py-12">
          No comparison data provided. Pass <code>comparisonRows</code> to enable this view.
        </p>
      );
    }

    return (
      <div className="ux:w-full ux:rounded-2xl ux:overflow-hidden ux:border ux:border-slate-200 ux:shadow-sm">
        <div className="ux:overflow-x-auto">
          <table className="ux:w-full ux:border-collapse">
            <thead>
              <tr className="ux:bg-slate-50">
                <th className="ux:text-left ux:px-6 ux:py-4 ux:text-xs ux:font-bold ux:uppercase ux:tracking-wider ux:text-slate-400 ux:border-b ux:border-slate-200 ux:bg-slate-50 ux:w-52">
                  Feature
                </th>
                {plans.map((plan) => {
                  const accent = planAccent(plan);
                  const displayPrice = isYearly && plan.yearlyPrice != null ? plan.yearlyPrice : plan.price;
                  const displayPeriod = isYearly && plan.yearlyPeriod ? plan.yearlyPeriod : plan.period;

                  return (
                    <th
                      key={plan.id}
                      className="ux:px-4 ux:py-4 ux:text-center ux:min-w-[130px] ux:border-b ux:border-slate-200"
                      style={plan.isMostPopular ? { backgroundColor: `${accent}10` } : {}}
                    >
                      <div className="ux:flex ux:flex-col ux:items-center ux:gap-1">
                        {plan.isMostPopular && (
                          <span
                            className="ux:text-[9px] ux:font-bold ux:uppercase ux:tracking-widest ux:px-2 ux:py-0.5 ux:rounded-full ux:mb-0.5 ux:text-white"
                            style={{ backgroundColor: accent }}
                          >
                            {plan.mostPopularLabel ?? "Most Popular"}
                          </span>
                        )}
                        <span
                          className="ux:text-sm ux:font-bold ux:text-slate-900"
                          style={plan.isMostPopular ? { color: accent } : {}}
                        >
                          {plan.name}
                        </span>
                        <span className="ux:text-xs ux:text-slate-400">
                          {plan.currency ?? "$"}{displayPrice}{displayPeriod}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => {
                const rows = comparisonRows.filter((r) => (r.category ?? "") === cat);
                return (
                  <tr key={`tbody-${cat}`} className="ux:contents">
                    {/* Category section header */}
                    {cat !== "" && (
                      <tr key={`cat-${cat}`} className="ux:bg-slate-50">
                        <td
                          colSpan={plans.length + 1}
                          className="ux:px-6 ux:py-2 ux:text-[10px] ux:font-bold ux:uppercase ux:tracking-widest ux:text-slate-400 ux:border-t ux:border-slate-200 ux:bg-slate-50"
                        >
                          {cat}
                        </td>
                      </tr>
                    )}

                    {rows.map((row, ri) => (
                      <tr key={`${cat}-${ri}`} className="ux:border-t ux:border-slate-100">
                        <td className="ux:px-6 ux:py-3.5 ux:text-sm ux:text-slate-600 ux:bg-white">
                          {row.label}
                        </td>
                        {plans.map((plan) => {
                          const val = row.values[plan.id];
                          const accent = planAccent(plan);

                          return (
                            <td
                              key={plan.id}
                              className="ux:px-4 ux:py-3.5 ux:text-center"
                              style={plan.isMostPopular ? { backgroundColor: `${accent}06` } : {}}
                            >
                              <div className="ux:flex ux:items-center ux:justify-center">
                                {val === true ? (
                                  <CheckIcon color={accent} />
                                ) : val === false || val == null ? (
                                  <DashIcon color="#cbd5e1" />
                                ) : (
                                  <span
                                    className="ux:text-xs ux:font-medium ux:text-slate-600"
                                    style={plan.isMostPopular ? { color: accent } : {}}
                                  >
                                    {val}
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tr>
                );
              })}
            </tbody>

            {/* Footer CTA row */}
            <tfoot>
              <tr className="ux:border-t ux:border-slate-200 ux:bg-slate-50">
                <td className="ux:px-6 ux:py-4 ux:bg-slate-50" />
                {plans.map((plan) => {
                  const accent = planAccent(plan);
                  return (
                    <td key={plan.id} className="ux:px-4 ux:py-4 ux:text-center">
                      <button
                        onClick={() => handleSelect(plan)}
                        className={`ux:px-4 ux:py-2 ux:rounded-xl ux:text-xs ux:font-bold ux:transition-all ux:cursor-pointer active:ux:scale-[0.98] ux:shadow-sm ${
                          plan.isMostPopular
                            ? "ux:text-white"
                            : "ux:bg-white ux:text-slate-900 ux:border ux:border-slate-200 hover:ux:bg-slate-50"
                        }`}
                        style={plan.isMostPopular ? { backgroundColor: accent } : {}}
                      >
                        {plan.buttonText ?? "Get Started"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="ux:w-full ux:max-w-6xl ux:mx-auto">
      {renderHeader()}
      {currentView === "cards" ? renderCards() : renderComparison()}
    </div>
  );
}
