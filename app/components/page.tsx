"use client";

import { useState } from "react";
import ContactForm from "@/components/ContactForm";

// Helper for conditional classes (since clsx/tailwind-merge are not guaranteed)
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

const COMPONENTS = [
    {
        id: "contact-form",
        name: "Contact Form",
        icon: "📝",
        component: () => (
            <ContactForm
                title="Contact Sales"
                subtitle="Tell us what you need and we will get back shortly."
                submitText="Submit"
                fields={[
                    { label: "Name", required: true },
                    { label: "Email", required: true, type: "email" },
                    { label: "Message", required: true, type: "textarea" },
                ]}
            />
        ),
    },
    {
        id: "placeholder-1",
        name: "Stats Card",
        icon: "📊",
        component: () => (
            <div className="ux:p-8 ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:shadow-sm ux:text-center">
                <h3 className="ux:text-lg ux:font-semibold">Portfolio Stats</h3>
                <p className="ux:text-sm ux:text-slate-500">Placeholder for Stats component</p>
            </div>
        ),
    },
];

export default function ComponentsPage() {
    const [activeId, setActiveId] = useState(COMPONENTS[0].id);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const activeComponent = COMPONENTS.find((c) => c.id === activeId);

    return (
        <div className="ux:flex ux:h-screen ux:bg-slate-50 ux:text-slate-900 ux:overflow-hidden ux:relative">
            {/* Mobile Header */}
            <header className="ux:lg:hidden ux:fixed ux:top-0 ux:inset-x-0 ux:h-16 ux:border-b ux:border-slate-200 ux:bg-white/80 ux:backdrop-blur-md ux:z-40 ux:px-4 ux:flex ux:items-center ux:justify-between">
                <div className="ux:flex ux:items-center ux:space-x-2">
                    <div className="ux:h-6 ux:w-6 ux:bg-slate-900 ux:rounded ux:flex ux:items-center ux:justify-center">
                        <span className="ux:text-[10px] ux:text-white">✨</span>
                    </div>
                    <span className="ux:font-bold ux:tracking-tight">UI Lab</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="ux:p-2 ux:hover:bg-slate-100 ux:rounded-lg ux:transition-colors"
                >
                    {isMobileMenuOpen ? "✕" : "☰"}
                </button>
            </header>

            {/* Backdrop for mobile */}
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="ux:fixed ux:inset-0 ux:bg-black/20 ux:backdrop-blur-sm ux:z-40 ux:lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "ux:fixed ux:inset-y-0 ux:left-0 ux:w-72 ux:border-r ux:border-slate-200 ux:bg-white ux:flex ux:flex-col ux:z-50 ux:transition-transform ux:duration-300",
                    isMobileMenuOpen ? "ux:translate-x-0" : "-ux:translate-x-full",
                    "ux:lg:translate-x-0"
                )}
            >
                <div className="ux:p-6 ux:border-b ux:border-slate-100">
                    <div className="ux:flex ux:items-center ux:space-x-2">
                        <div className="ux:h-8 ux:w-8 ux:bg-slate-900 ux:rounded ux:flex ux:items-center ux:justify-center">
                            <span className="ux:text-sm ux:text-white">✨</span>
                        </div>
                        <span className="ux:text-xl ux:font-bold ux:tracking-tight">UI Lab</span>
                    </div>
                    <p className="ux:text-[10px] ux:text-slate-400 ux:mt-1 ux:uppercase ux:tracking-widest ux:font-semibold">
                        Component System
                    </p>
                </div>

                <nav className="ux:flex-1 ux:overflow-y-auto ux:p-4 ux:space-y-1">
                    {COMPONENTS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveId(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={cn(
                                "ux:w-full ux:flex ux:items-center ux:justify-between ux:px-4 ux:py-3 ux:rounded-xl ux:text-sm ux:font-medium ux:transition-all ux:group",
                                activeId === item.id
                                    ? "ux:bg-slate-900 ux:text-white ux:shadow-md ux:shadow-slate-900/10"
                                    : "ux:text-slate-500 ux:hover:bg-slate-50 ux:hover:text-slate-900"
                            )}
                        >
                            <div className="ux:flex ux:items-center ux:space-x-3">
                                <span className="ux:text-base">{item.icon}</span>
                                <span>{item.name}</span>
                            </div>
                            <span
                                className={cn(
                                    "ux:text-[10px] ux:transition-transform",
                                    activeId === item.id ? "ux:translate-x-0" : "-ux:translate-x-2 ux:opacity-0 ux:group-hover:opacity-100 ux:group-hover:translate-x-0"
                                )}
                            >
                                →
                            </span>
                        </button>
                    ))}
                </nav>

                <div className="ux:p-4 ux:border-t ux:border-slate-100 ux:bg-slate-50/50">
                    <div className="ux:bg-white ux:border ux:border-slate-200 ux:rounded-xl ux:p-3 ux:text-[10px] ux:text-slate-500 ux:leading-relaxed ux:shadow-sm">
                        Experimental environment for testing UI components in isolation.
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ux:flex-1 ux:overflow-y-auto ux:relative ux:pt-24 ux:lg:pt-12 ux:pb-12 ux:px-4 ux:md:px-8 ux:lg:px-12 ux:lg:ml-72">
                <div className="ux:max-w-4xl ux:mx-auto ux:space-y-8 ux:relative ux:z-10">
                    <div className="ux:space-y-1">
                        <h1 className="ux:text-2xl ux:md:text-3xl ux:font-bold ux:tracking-tight ux:text-slate-900">
                            {activeComponent?.name}
                        </h1>
                        <p className="ux:text-sm ux:text-slate-500">
                            Previewing component with mock data integration.
                        </p>
                    </div>

                    <div className="ux:p-6 ux:md:p-12 ux:border ux:border-slate-200 ux:rounded-[2rem] ux:bg-white ux:shadow-sm ux:min-h-[400px] ux:flex ux:items-center ux:justify-center ux:overflow-x-auto">
                        <div className="ux:w-full ux:flex ux:justify-center">
                            {activeComponent && activeComponent.component()}
                        </div>
                    </div>

                    <div className="ux:space-y-4">
                        <h3 className="ux:text-[10px] ux:font-semibold ux:uppercase ux:tracking-widest ux:text-slate-400">
                            Component Details
                        </h3>
                        <div className="ux:grid ux:grid-cols-1 ux:md:grid-cols-2 ux:gap-4">
                            <div className="ux:p-4 ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:text-xs ux:space-y-2">
                                <div className="ux:font-semibold ux:text-slate-900">Component ID</div>
                                <div className="ux:font-mono ux:text-slate-500">{activeId}</div>
                            </div>
                            <div className="ux:p-4 ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:text-xs ux:space-y-2">
                                <div className="ux:font-semibold ux:text-slate-900">Status</div>
                                <div className="ux:text-emerald-600 ux:font-bold">Render Ready</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
