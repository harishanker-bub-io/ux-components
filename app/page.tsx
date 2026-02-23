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
    <main className="ux:min-h-screen ux:bg-slate-100 ux:px-6 ux:py-10">
      <div className="ux:mx-auto ux:max-w-7xl">
        <h1 className="ux:mb-2 ux:text-2xl ux:font-semibold ux:text-slate-900">
          UX Components Playground
        </h1>
        <p className="ux:mb-8 ux:text-sm ux:text-slate-600">
          Testing standalone components
        </p>

        <div className="ux:space-y-12">
          {/* Contact Form Section */}
          <section>
            <h2 className="ux:mb-4 ux:text-xl ux:font-semibold ux:text-slate-900">
              Contact Form
            </h2>
            <div className="ux:grid ux:grid-cols-[auto_minmax(0,1fr)] ux:items-start ux:gap-6">
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

              <div className="ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:p-6 ux:shadow-sm">
                <h3 className="ux:mb-3 ux:text-lg ux:font-semibold ux:text-slate-900">
                  Dispatch Event
                </h3>
                {!lastEvent ? (
                  <p className="ux:text-sm ux:text-slate-500">
                    Submit or validate the form to view emitted events.
                  </p>
                ) : (
                  <pre className="ux:overflow-auto ux:rounded-xl ux:bg-slate-900 ux:p-4 ux:text-xs ux:text-slate-100">
                    {JSON.stringify(lastEvent, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </section>

          {/* Carousel Section */}
          <section>
            <h2 className="ux:mb-4 ux:text-xl ux:font-semibold ux:text-slate-900">
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
              visibleCount={3}
              dispatch={(eventName, payload) => {
                setLastEvent({ eventName, payload });
              }}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
