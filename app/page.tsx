"use client";

import { useState } from "react";
import ContactForm from "@/components/ContactForm";
import Carousel from "@/components/Carousel";

type DispatchLog = {
  eventName: string;
  payload?: Record<string, unknown>;
};

export default function Home() {
  const [lastEvent, setLastEvent] = useState<DispatchLog | null>(null);

  return (
    <main className="ux:min-h-screen ux:bg-white">
      {/* Header */}
      <div className="ux:bg-slate-900 ux:py-12 ux:mb-0">
        <div className="ux:mx-auto ux:max-w-7xl ux:px-6">
          <h1 className="ux:text-3xl ux:font-bold ux:text-white">
            UX Components Playground
          </h1>
          <p className="ux:mt-2 ux:text-slate-400 ux:text-sm">
            Testing standalone production-ready components
          </p>
        </div>
      </div>

      <div className="ux:relative ux:mx-auto ux:max-w-[1600px] ux:flex ux:flex-col lg:ux:flex-row">
        {/* Main Content Areas */}
        <div className="ux:flex-1">
          {/* Contact Form Section - Light Gray Background */}
          <section className="ux:bg-slate-50 ux:py-16 ux:border-b ux:border-slate-200">
            <div className="ux:px-6 ux:max-w-4xl ux:mx-auto lg:ux:mx-0 lg:ux:ml-auto">
              <h2 className="ux:mb-8 ux:text-xl ux:font-semibold ux:text-slate-900 ux:flex ux:items-center ux:gap-2">
                <span className="ux:w-1 ux:h-6 ux:bg-slate-900 ux:rounded-full"></span>
                Contact Form
              </h2>
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
                dispatch={(eventName, payload) => {
                  setLastEvent({ eventName, payload });
                }}
              />
            </div>
          </section>

          {/* Carousel Section - White Background */}
          <section className="ux:bg-white ux:py-16 ux:border-b ux:border-slate-200">
            <div className="ux:px-6 ux:max-w-4xl ux:mx-auto lg:ux:mx-0 lg:ux:ml-auto">
              <h2 className="ux:mb-8 ux:text-xl ux:font-semibold ux:text-slate-900 ux:flex ux:items-center ux:gap-2">
                <span className="ux:w-1 ux:h-6 ux:bg-slate-900 ux:rounded-full"></span>
                Image Carousel
              </h2>
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
                dispatch={(eventName, payload) => {
                  setLastEvent({ eventName, payload });
                }}
              />
            </div>
          </section>
        </div>

        {/* Sticky Sidebar - Event Log */}
        <aside className="ux:w-full lg:ux:w-[400px] ux:p-6 lg:ux:sticky lg:ux:top-0 lg:ux:h-screen ux:bg-slate-50 lg:ux:border-l ux:border-slate-200 ux:overflow-y-auto">
          <div className="ux:pt-4 lg:ux:pt-10">
            <h3 className="ux:mb-4 ux:text-lg ux:font-semibold ux:text-slate-900 ux:flex ux:items-center ux:gap-2">
              <span className="ux:flex ux:h-2 ux:w-2 ux:rounded-full ux:bg-emerald-500"></span>
              Event Dispatch Log
            </h3>
            <p className="ux:mb-6 ux:text-sm ux:text-slate-500">
              Interact with any component to see the JSON payload emitted to the
              parent application.
            </p>

            {!lastEvent ? (
              <div className="ux:rounded-2xl ux:border ux:border-dashed ux:border-slate-300 ux:bg-white ux:p-8 ux:text-center">
                <p className="ux:text-sm ux:text-slate-400">
                  No events captured yet.
                </p>
              </div>
            ) : (
              <div className="ux:space-y-4 animate-in ux:fade-in ux:slide-in-from-bottom-2 ux:duration-300">
                <div className="ux:flex ux:items-center ux:justify-between">
                  <span className="ux:text-[10px] ux:font-bold ux:uppercase ux:tracking-wider ux:text-slate-400">
                    Latest Event
                  </span>
                  <button
                    onClick={() => setLastEvent(null)}
                    className="ux:text-[10px] ux:font-bold ux:uppercase ux:tracking-wider ux:text-rose-500 hover:ux:underline"
                  >
                    Clear
                  </button>
                </div>
                <pre className="ux:overflow-auto ux:rounded-xl ux:bg-slate-900 ux:p-5 ux:text-xs ux:leading-relaxed ux:text-slate-100 ux:shadow-inner ux:border ux:border-slate-800">
                  {JSON.stringify(lastEvent, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
