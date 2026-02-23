"use client";

import { useState } from "react";
import ContactForm from "@/components/ContactForm";

type DispatchLog = {
  eventName: string;
  payload?: Record<string, unknown>;
};

export default function Home() {
  const [lastEvent, setLastEvent] = useState<DispatchLog | null>(null);

  return (
    <main className="ux:min-h-screen ux:bg-slate-100 ux:px-6 ux:py-10">
      <div className="ux:mx-auto ux:max-w-5xl">
        <h1 className="ux:mb-2 ux:text-2xl ux:font-semibold ux:text-slate-900">
          UX Components Playground
        </h1>
        <p className="ux:mb-8 ux:text-sm ux:text-slate-600">
          Testing <code>components/ContactForm.tsx</code>
        </p>

        <div className="ux:grid ux:grid-cols-[auto_minmax(0,1fr)] ux:items-start ux:gap-6">
          <ContactForm
            title="Contact Sales"
            subtitle="Tell us what you need and we will get back shortly."
            submitText="Submit"
            fields="Name,Email,Company,Message"
            dispatch={(eventName, payload) => {
              setLastEvent({ eventName, payload });
            }}
          />

          <div className="ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:p-6 ux:shadow-sm">
            <h2 className="ux:mb-3 ux:text-lg ux:font-semibold ux:text-slate-900">
              Dispatch Event
            </h2>
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
      </div>
    </main>
  );
}
