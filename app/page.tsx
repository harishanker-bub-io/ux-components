"use client";

import { useState } from "react";
import ContactForm from "@/components/ContactForm";
import Carousel from "@/components/Carousel";
import PricingTable from "@/components/PricingTable";

type DispatchLog = {
  eventName: string;
  payload?: Record<string, unknown>;
};

// Helper for conditional classes
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

export default function Home() {
  const [activeId, setActiveId] = useState("contact-form");
  const [lastEvent, setLastEvent] = useState<DispatchLog | null>(null);

  const COMPONENTS = [
    {
      id: "contact-form",
      name: "Contact Form",
      icon: "📝",
      component: (dispatch: any) => (
        <ContactForm
          title="Contact Sales"
          subtitle="Tell us what you need and we will get back shortly."
          submitText="Submit"
          fields={[
            { label: "Name", required: true },
            { label: "Email", required: true, type: "email" },
            { label: "Phone", type: "tel" },
            { label: "Company" },
            { label: "Website", type: "url" },
            { label: "Message", required: true, type: "textarea" },
          ]}
          dispatch={dispatch}
        />
      ),
    },
    {
      id: "carousel",
      name: "Image Carousel",
      icon: "🖼️",
      component: (dispatch: any) => (
        <Carousel
          images={[
            {
              src: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop",
              alt: "Modern Architecture",
              caption: "Modern Architecture Design",
            },
            {
              src: "https://images.unsplash.com/photo-1682687221038-404cb8830901?w=800&h=600&fit=crop",
              alt: "Mountain Landscape",
              caption: "Beautiful Mountain View",
            },
            {
              src: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800&h=600&fit=crop",
              alt: "Ocean Sunset",
              caption: "Stunning Ocean Sunset",
            },
            {
              src: "https://images.unsplash.com/photo-1682687220801-eef408f95d71?w=800&h=600&fit=crop",
              alt: "Forest Path",
              caption: "Peaceful Forest Trail",
            },
            {
              src: "https://images.unsplash.com/photo-1682687220923-c58b9a4592ae?w=800&h=600&fit=crop",
              alt: "City Lights",
              caption: "Urban Night Scene",
            },
            {
              src: "https://images.unsplash.com/photo-1682687221080-5cb261c645cb?w=800&h=600&fit=crop",
              alt: "Desert Dunes",
              caption: "Golden Desert Landscape",
            },
          ]}
          visibleCount={2}
          dispatch={dispatch}
        />
      ),
    },
    {
      id: "pricing-table",
      name: "Pricing Table",
      icon: "🏷️",
      component: (dispatch: any) => (
        <PricingTable
          title="Flexible Plans"
          subtitle="Choose the perfect plan for your business needs."
          plans={[
            {
              id: "starter",
              name: "Starter",
              price: "0",
              description: "For individuals and small projects.",
              features: [
                "Up to 3 projects",
                "Basic analytics",
                "Community support",
                "1GB storage",
              ],
              buttonText: "Start for free",
            },
            {
              id: "pro",
              name: "Pro",
              price: "49",
              period: "/mo",
              isMostPopular: true,
              description: "Standard plan for growing teams.",
              features: [
                "Unlimited projects",
                "Advanced analytics",
                "Priority email support",
                "20GB storage",
                "Custom domains",
              ],
              buttonText: "Get Started",
            },
            {
              id: "enterprise",
              name: "Enterprise",
              price: "99",
              period: "/mo",
              description: "Scale your business with ease.",
              features: [
                "Everything in Pro",
                "24/7 dedicated support",
                "200GB storage",
                "SLA guarantees",
                "Advanced security",
              ],
              buttonText: "Contact Sales",
            },
          ]}
          dispatch={dispatch}
        />
      ),
    },
  ];

  const activeComponent = COMPONENTS.find((c) => c.id === activeId);

  return (
    <main className="ux:min-h-screen ux:flex ux:bg-white ux:overflow-hidden">
      {/* Navigation Sidebar */}
      <aside className="ux:w-64 ux:border-r ux:border-slate-200 ux:bg-slate-50 ux:flex ux:flex-col ux:shrink-0">
        <div className="ux:p-6 ux:border-b ux:border-slate-200 ux:bg-slate-900">
          <h1 className="ux:text-xl ux:font-bold ux:text-white">UI Lab</h1>
          <p className="ux:text-[10px] ux:text-slate-400 ux:uppercase ux:tracking-widest ux:font-semibold ux:mt-1">
            Component System
          </p>
        </div>
        <nav className="ux:flex-1 ux:p-4 ux:space-y-1">
          {COMPONENTS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={cn(
                "ux:w-full ux:flex ux:items-center ux:justify-between ux:px-4 ux:py-3 ux:rounded-xl ux:text-sm ux:font-medium ux:transition-all ux:group ux:cursor-pointer",
                activeId === item.id
                  ? "ux:bg-slate-900 ux:text-white ux:shadow-md"
                  : "ux:text-slate-500 ux:hover:bg-slate-200 ux:hover:text-slate-900"
              )}
            >
              <div className="ux:flex ux:items-center ux:space-x-3">
                <span className="ux:text-base">{item.icon}</span>
                <span>{item.name}</span>
              </div>
              {activeId === item.id && <span className="ux:text-[10px]">→</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="ux:flex-1 ux:flex ux:flex-col ux:overflow-hidden lg:ux:flex-row">
        <div className="ux:flex-1 ux:overflow-y-auto ux:p-8 lg:ux:p-12">
          <div className="ux:max-w-4xl ux:mx-auto ux:space-y-8">
            <div className="ux:space-y-1">
              <h2 className="ux:text-2xl ux:font-bold ux:text-slate-900">
                {activeComponent?.name}
              </h2>
              <p className="ux:text-sm ux:text-slate-500">
                Previewing component in isolation with live event tracking.
              </p>
            </div>

            <div className="ux:p-1 ux:min-h-[500px] ux:flex ux:items-start ux:justify-center">
              {activeComponent?.component((eventName: string, payload: any) => {
                setLastEvent({ eventName, payload });
              })}
            </div>
          </div>
        </div>

        {/* Event Log Sidebar */}
        <aside className="ux:w-full lg:ux:w-[400px] ux:p-6 ux:bg-slate-50 ux:border-l ux:border-slate-200 ux:overflow-y-auto ux:shrink-0 lg:ux:h-screen lg:ux:sticky lg:ux:top-0">
          <div className="ux:pt-4">
            <h3 className="ux:mb-4 ux:text-lg ux:font-semibold ux:text-slate-900 ux:flex ux:items-center ux:gap-2">
              <span className="ux:flex ux:h-2 ux:w-2 ux:rounded-full ux:bg-emerald-500"></span>
              Event Dispatch Log
            </h3>
            <p className="ux:mb-6 ux:text-sm ux:text-slate-500 ux:leading-relaxed">
              Interact with the component to see events emitted to the parent application.
            </p>

            {!lastEvent ? (
              <div className="ux:rounded-2xl ux:border ux:border-dashed ux:border-slate-300 ux:bg-white ux:p-8 ux:text-center">
                <p className="ux:text-sm ux:text-slate-400">
                  No events captured yet.
                </p>
              </div>
            ) : (
              <div className="ux:space-y-4">
                <div className="ux:flex ux:items-center ux:justify-between">
                  <span className="ux:text-[10px] ux:font-bold ux:uppercase ux:tracking-wider ux:text-slate-400">
                    Latest Event: {lastEvent.eventName}
                  </span>
                  <button
                    onClick={() => setLastEvent(null)}
                    className="ux:text-[10px] ux:font-bold ux:uppercase ux:tracking-wider ux:text-rose-500 hover:ux:underline"
                  >
                    Clear
                  </button>
                </div>
                <pre className="ux:overflow-auto ux:rounded-xl ux:bg-slate-900 ux:p-5 ux:text-xs ux:leading-relaxed ux:text-slate-100 ux:shadow-inner ux:border ux:border-slate-800">
                  {JSON.stringify(lastEvent.payload, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
