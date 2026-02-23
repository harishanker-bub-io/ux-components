"use client";

import { useEffect, useMemo, useState } from "react";

export type TabsItem = {
  id: string;
  label: string;
  icon?: string;
  heading?: string;
  description?: string;
  bullets?: string[];
  ctaLabel?: string;
};

export type TabsProps = {
  title?: string;
  subtitle?: string;
  tabs: TabsItem[];
  defaultTabId?: string;
  dispatch?: (eventName: string, payload?: Record<string, unknown>) => void;
};

function getSafeDefaultTabId(tabs: TabsItem[], defaultTabId?: string): string {
  if (defaultTabId && tabs.some((tab) => tab.id === defaultTabId)) return defaultTabId;
  return tabs[0]?.id ?? "";
}

export default function Tabs({
  title = "Product Details",
  subtitle = "Explore each section to learn more.",
  tabs,
  defaultTabId,
  dispatch,
}: TabsProps) {
  const normalizedTabs = useMemo(() => tabs ?? [], [tabs]);
  const [activeTabId, setActiveTabId] = useState<string>(
    getSafeDefaultTabId(normalizedTabs, defaultTabId),
  );

  // Reset active tab when the tabs list changes and the current selection no longer exists
  useEffect(() => {
    if (!normalizedTabs.some((tab) => tab.id === activeTabId)) {
      setActiveTabId(normalizedTabs[0]?.id ?? "");
    }
  }, [normalizedTabs, activeTabId]);

  const activeTab = normalizedTabs.find((tab) => tab.id === activeTabId) ?? normalizedTabs[0];

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    dispatch?.("tab_change", { tabId });
  };

  const handleCtaClick = () => {
    if (!activeTab) return;
    dispatch?.("tab_cta_click", {
      tabId: activeTab.id,
      label: activeTab.label,
      ctaLabel: activeTab.ctaLabel ?? "Continue",
    });
  };

  if (!activeTab) {
    return (
      <div className="ux:w-full ux:max-w-4xl ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:p-6 ux:text-sm ux:text-slate-500 ux:shadow-sm">
        No tabs configured.
      </div>
    );
  }

  return (
    <section className="ux:w-full ux:max-w-4xl ux:overflow-hidden ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:shadow-sm">
      <header className="ux:border-b ux:border-slate-200 ux:px-6 ux:py-5">
        <h2 className="ux:text-xl ux:font-semibold ux:text-slate-900">{title}</h2>
        {subtitle ? <p className="ux:mt-1 ux:text-sm ux:text-slate-500">{subtitle}</p> : null}
      </header>

      <div className="ux:border-b ux:border-slate-200 ux:bg-slate-50 ux:px-3 ux:py-3">
        <div role="tablist" aria-label={title} className="ux:flex ux:flex-wrap ux:gap-2">
          {normalizedTabs.map((tab) => {
            const isActive = tab.id === activeTab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => handleTabChange(tab.id)}
                className={
                  "ux:inline-flex ux:cursor-pointer ux:items-center ux:gap-2 ux:rounded-lg ux:px-3 ux:py-2 ux:text-sm ux:font-medium ux:transition-colors " +
                  (isActive
                    ? "ux:bg-slate-900 ux:text-white"
                    : "ux:bg-white ux:text-slate-700 hover:ux:bg-slate-200")
                }
              >
                {tab.icon ? <span>{tab.icon}</span> : null}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`tabpanel-${activeTab.id}`}
        aria-labelledby={`tab-${activeTab.id}`}
        className="ux:px-6 ux:py-6"
      >
        <h3 className="ux:text-lg ux:font-semibold ux:text-slate-900">
          {activeTab.heading ?? activeTab.label}
        </h3>

        {activeTab.description ? (
          <p className="ux:mt-2 ux:text-sm ux:leading-6 ux:text-slate-600">{activeTab.description}</p>
        ) : null}

        {activeTab.bullets && activeTab.bullets.length > 0 ? (
          <ul className="ux:mt-4 ux:list-disc ux:space-y-2 ux:pl-5 ux:text-sm ux:text-slate-700">
            {activeTab.bullets.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : null}

        <div className="ux:mt-6">
          <button
            type="button"
            onClick={handleCtaClick}
            className="ux:cursor-pointer ux:rounded-xl ux:border-none ux:bg-slate-900 ux:px-5 ux:py-2.5 ux:text-sm ux:font-semibold ux:text-white ux:transition-all hover:ux:bg-slate-800 active:ux:scale-[0.98]"
          >
            {activeTab.ctaLabel ?? "Continue"}
          </button>
        </div>
      </div>
    </section>
  );
}
