"use client";

import React, { useState } from "react";
import ContactForm from "@/components/ContactForm";
import Carousel from "@/components/Carousel";
import Media from "@/components/Media";
import Pricing from "@/components/Pricing";
import Map from "@/components/Map";
import Faqs from "@/components/Faqs";
import Locations from "@/components/Locations";
import Testimonial, { type TestimonialItem } from "@/components/Testimonial";

type DispatchEvent = {
  eventName: string;
  payload?: Record<string, unknown>;
};

type DispatchFn = (eventName: string, payload?: Record<string, unknown>) => void;

// Helper for conditional classes
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

type ComponentVariant = {
  id: string;
  label: string;
  component: (dispatch: DispatchFn) => React.ReactNode;
};

type ComponentEntry = {
  id: string;
  name: string;
  icon: string;
  component?: (dispatch: DispatchFn) => React.ReactNode;
  variants?: ComponentVariant[];
};

export default function Home() {
  const [activeId, setActiveId] = useState("contact-form");
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<DispatchEvent | null>(null);
  const testimonialItems: TestimonialItem[] = [
    {
      id: "t1",
      title: "Excellent onboarding experience",
      description:
        "The setup process was smooth, and the support team answered every question quickly.",
      name: "Sarah Lee",
      location: "Austin, TX",
      rating: 5,
    },
    {
      id: "t2",
      title: "Fast delivery and clean UX",
      description:
        "We saw a clear reduction in support tickets after launch. The flow is much easier for users.",
      name: "David Kim",
      location: "Seattle, WA",
      rating: 4,
    },
    {
      id: "t3",
      title: "Reliable for production",
      description:
        "Stable performance, clear documentation, and no surprises during deployment.",
      name: "Priya Nair",
      location: "San Jose, CA",
      rating: 5,
    },
    {
      id: "t4",
      title: "Strong support and quick fixes",
      description:
        "Whenever we had an issue, the team responded quickly and resolved it without delay.",
      name: "Michael Brown",
      location: "Denver, CO",
      rating: 4,
    },
    {
      id: "t5",
      title: "Easy to integrate",
      description:
        "The component API was straightforward, and integration took less than a day.",
      name: "Ananya Patel",
      location: "Chicago, IL",
      rating: 5,
    },
    {
      id: "t6",
      title: "Great performance at scale",
      description:
        "We rolled this out to thousands of users and it remained fast and stable.",
      name: "Ethan Clark",
      location: "New York, NY",
      rating: 5,
    },
  ];

  const COMPONENTS: ComponentEntry[] = [
    {
      id: "contact-form",
      name: "Contact Form",
      icon: "📝",
      component: (dispatch) => (
        <ContactForm
          title="Book a VR Tour"
          subtitle="Book a VR tour of the property with us today."
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
      component: (dispatch) => (
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
      id: "pricing",
      name: "Pricing",
      icon: "🏷️",
      variants: [
        {
          id: "pricing-rich-cards",
          label: "Rich Cards",
          component: (dispatch) => (
            <Pricing
              title="Plans for every stage"
              subtitle="From solo builders to full-scale enterprise teams."
              showBillingToggle={true}
              yearlyDiscountText="Save up to 40%"
              mode="cards"
              plans={[
                {
                  id: "starter",
                  name: "Starter",
                  price: "0",
                  yearlyPrice: "0",
                  description: "Your website gets a brain. No setup required.",
                  buttonText: "Start free →",
                  featureGroups: [
                    {
                      groupLabel: "Usage",
                      features: [
                        { label: "100 conversations/mo" },
                        { label: "50 pages trained", subLabel: "5 pages monitored live" },
                        { label: "Document upload", included: false },
                        { label: "Custom Q&A pairs", included: false },
                      ],
                    },
                    {
                      groupLabel: "Avatar",
                      features: [
                        { label: "Default avatar", subLabel: "Watermarked" },
                        { label: "Custom avatar", included: false },
                      ],
                    },
                    {
                      groupLabel: "Intelligence",
                      features: [
                        { label: "Proactive triggers", included: false },
                        { label: "Lead notifications", included: false },
                        { label: "Branding removal", included: false },
                      ],
                    },
                    {
                      groupLabel: "History & Sites",
                      features: [
                        { label: "7-day conversation history" },
                        { label: "1 website" },
                      ],
                    },
                  ],
                },
                {
                  id: "growth",
                  name: "Growth",
                  price: "39",
                  period: "/mo",
                  yearlyPrice: "31",
                  yearlyPeriod: "/mo",
                  yearlySavings: "Save $120/yr billed annually",
                  description: "Your website gets a face. Visitors remember you.",
                  buttonText: "Start 30-day trial →",
                  featureGroups: [
                    {
                      groupLabel: "Usage",
                      features: [
                        { label: "1,000 conversations/mo", highlight: true },
                        { label: "200 pages trained", subLabel: "30 pages monitored live", highlight: true },
                        { label: "5 documents upload", highlight: true },
                        { label: "Custom Q&A pairs", included: false },
                      ],
                    },
                    {
                      groupLabel: "Avatar",
                      features: [
                        { label: "Avatar library", subLabel: "No watermark", highlight: true },
                        { label: "Custom lip-sync avatar", included: false },
                      ],
                    },
                    {
                      groupLabel: "Intelligence",
                      features: [
                        { label: "Proactive triggers", subLabel: "Page-based rules", highlight: true },
                        { label: "Lead notifications", subLabel: "Slack + Email", highlight: true },
                        { label: "Branding removal", highlight: true },
                      ],
                    },
                    {
                      groupLabel: "History & Sites",
                      features: [
                        { label: "90-day history", highlight: true },
                        { label: "1 website" },
                      ],
                    },
                  ],
                },
                {
                  id: "pro",
                  name: "Pro",
                  price: "79",
                  period: "/mo",
                  yearlyPrice: "63",
                  yearlyPeriod: "/mo",
                  yearlySavings: "Save $240/yr billed annually",
                  description: "Your website gets a voice. Understands intent; speaks every language.",
                  buttonText: "Start 30-day trial →",
                  isMostPopular: true,
                  mostPopularLabel: "Most Popular",
                  accentColor: "#6366f1",
                  featureGroups: [
                    {
                      groupLabel: "Usage",
                      features: [
                        { label: "5,000 conversations/mo", highlight: true },
                        { label: "500 pages trained", subLabel: "100 pages monitored live", highlight: true },
                        { label: "50 documents upload", highlight: true },
                        { label: "100 custom Q&A pairs", highlight: true },
                      ],
                    },
                    {
                      groupLabel: "Avatar",
                      features: [
                        { label: "Custom lip-sync avatar", subLabel: "Upload your photo — AI animates", highlight: true },
                        { label: "Custom 3D mascot", included: false },
                      ],
                    },
                    {
                      groupLabel: "Intelligence",
                      features: [
                        { label: "Smart proactive triggers", subLabel: "Intent-based, no rules needed", highlight: true },
                        { label: "Lead notifications + WhatsApp", highlight: true },
                        { label: "Agent live handoff", highlight: true },
                        { label: "Conversion analytics", highlight: true },
                      ],
                    },
                    {
                      groupLabel: "History & Sites",
                      features: [
                        { label: "1-year history", highlight: true },
                        { label: "Unlimited websites", highlight: true },
                      ],
                    },
                  ],
                },
                {
                  id: "agency",
                  name: "Agency",
                  price: "199",
                  period: "/mo",
                  yearlyPrice: "159",
                  yearlyPeriod: "/mo",
                  yearlySavings: "Save $600/yr billed annually",
                  description: "Your clients get their own person. Fully yours, fully branded.",
                  buttonText: "Contact sales →",
                  featureGroups: [
                    {
                      groupLabel: "Usage",
                      features: [
                        { label: "20,000 conversations/mo", highlight: true },
                        { label: "1,000 pages per site", subLabel: "All trained pages monitored", highlight: true },
                        { label: "200 documents upload", highlight: true },
                        { label: "500 custom Q&A pairs", highlight: true },
                      ],
                    },
                    {
                      groupLabel: "Avatar",
                      features: [
                        { label: "Custom 3D brand mascot", subLabel: "Per-client avatars", highlight: true },
                        { label: "White-label — zero branding", highlight: true },
                      ],
                    },
                    {
                      groupLabel: "Intelligence",
                      features: [
                        { label: "Predictive triggers", subLabel: "Visitor history across sessions", highlight: true },
                        { label: "Client dashboards + reports", highlight: true },
                        { label: "Reseller portal", highlight: true },
                      ],
                    },
                    {
                      groupLabel: "History & Sites",
                      features: [
                        { label: "1-year history", highlight: true },
                        { label: "Unlimited websites", highlight: true },
                      ],
                    },
                  ],
                },
              ]}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "pricing-comparison",
          label: "Comparison Table",
          component: (dispatch) => (
            <Pricing
              title="Full comparison"
              subtitle="Every feature, side by side — no surprises."
              showBillingToggle={true}
              yearlyDiscountText="Save up to 40%"
              mode="comparison"
              plans={[
                { id: "starter", name: "Starter", price: "0", yearlyPrice: "0", buttonText: "Start free" },
                { id: "growth",  name: "Growth",  price: "39", period: "/mo", yearlyPrice: "31", yearlyPeriod: "/mo", buttonText: "Try Growth" },
                { id: "pro",     name: "Pro",     price: "79", period: "/mo", yearlyPrice: "63", yearlyPeriod: "/mo", isMostPopular: true, accentColor: "#6366f1", buttonText: "Try Pro" },
                { id: "agency",  name: "Agency",  price: "199", period: "/mo", yearlyPrice: "159", yearlyPeriod: "/mo", buttonText: "Contact Sales" },
              ]}
              comparisonRows={[
                { category: "Usage & Training", label: "Conversations / month",  values: { starter: "100",      growth: "1,000",   pro: "5,000",          agency: "20,000" } },
                { category: "Usage & Training", label: "Pages trained",          values: { starter: "50",       growth: "200",     pro: "500",            agency: "1,000 / site" } },
                { category: "Usage & Training", label: "Document upload",        values: { starter: false,      growth: "5",       pro: "50",             agency: "200" } },
                { category: "Usage & Training", label: "Custom Q&A pairs",       values: { starter: false,      growth: false,     pro: "100",            agency: "500" } },
                { category: "Usage & Training", label: "Monitoring frequency",   values: { starter: "Manual",   growth: "Weekly",  pro: "Daily auto",     agency: "Real-time" } },
                { category: "Usage & Training", label: "Websites",               values: { starter: "1",        growth: "1",       pro: "3",              agency: "Unlimited" } },
                { category: "System",           label: "Default avatar",         values: { starter: "Watermarked", growth: true,   pro: true,             agency: true } },
                { category: "System",           label: "Avatar library",         values: { starter: false,      growth: true,      pro: true,             agency: true } },
                { category: "System",           label: "Custom lip-sync avatar", values: { starter: false,      growth: false,     pro: true,             agency: true } },
                { category: "System",           label: "Custom 3D brand mascot", values: { starter: false,      growth: false,     pro: false,            agency: true } },
                { category: "Proactive Intelligence", label: "Proactive triggers", values: { starter: false,   growth: "Page-based", pro: "Intent-based", agency: "Predictive" } },
                { category: "Proactive Intelligence", label: "Lead notifications", values: { starter: false,   growth: "Slack + Email", pro: "+ WhatsApp", agency: "+ WhatsApp" } },
                { category: "Proactive Intelligence", label: "Agent live handoff", values: { starter: false,   growth: false,     pro: true,             agency: true } },
                { category: "Proactive Intelligence", label: "Conversion analytics", values: { starter: false, growth: "Basic",   pro: "Full",           agency: "Full + client reports" } },
                { category: "Language & Voice", label: "Languages supported",    values: { starter: "English", growth: "Top 5",   pro: "50+",            agency: "Unlimited" } },
                { category: "Language & Voice", label: "Voice conversations",    values: { starter: false,     growth: false,     pro: "Text + Voice",   agency: "Full voice agent" } },
                { category: "History & Access", label: "Conversation history",   values: { starter: "7 days",  growth: "90 days", pro: "1 year",         agency: "1 year" } },
                { category: "History & Access", label: "Branding removal",       values: { starter: false,     growth: true,      pro: true,             agency: true } },
                { category: "History & Access", label: "White-label portal",     values: { starter: false,     growth: false,     pro: false,            agency: true } },
                { category: "History & Access", label: "Reseller knowledge base", values: { starter: false,    growth: false,     pro: false,            agency: true } },
              ]}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "pricing-both",
          label: "Cards + Compare",
          component: (dispatch) => (
            <Pricing
              title="Pricing"
              subtitle="Switch between plan cards and the full feature comparison."
              showBillingToggle={true}
              yearlyDiscountText="Save 20%"
              mode="both"
              plans={[
                {
                  id: "starter", name: "Starter", price: "0", description: "Free forever.",
                  buttonText: "Start free",
                  features: ["100 conversations/mo", "50 pages trained", "1 website", "7-day history"],
                },
                {
                  id: "pro", name: "Pro", price: "79", period: "/mo", yearlyPrice: "63", yearlyPeriod: "/mo",
                  yearlySavings: "Save $192/yr billed annually",
                  isMostPopular: true, accentColor: "#6366f1",
                  description: "Everything you need to grow.",
                  buttonText: "Start 30-day trial",
                  features: ["5,000 conversations/mo", "500 pages trained", "50 docs upload", "100 Q&A pairs", "Voice support", "1-year history", "Unlimited websites"],
                },
                {
                  id: "agency", name: "Agency", price: "199", period: "/mo", yearlyPrice: "159", yearlyPeriod: "/mo",
                  yearlySavings: "Save $480/yr billed annually",
                  description: "For agencies & white-label.",
                  buttonText: "Contact sales",
                  features: ["20,000 conversations/mo", "1,000 pages/site", "200 docs upload", "500 Q&A pairs", "Custom 3D mascot", "Reseller portal", "White-label branding"],
                },
              ]}
              comparisonRows={[
                { category: "Usage",       label: "Conversations / month", values: { starter: "100",     pro: "5,000",   agency: "20,000" } },
                { category: "Usage",       label: "Pages trained",         values: { starter: "50",      pro: "500",     agency: "1,000/site" } },
                { category: "Usage",       label: "Document upload",       values: { starter: false,     pro: "50",      agency: "200" } },
                { category: "Usage",       label: "Custom Q&A pairs",      values: { starter: false,     pro: "100",     agency: "500" } },
                { category: "Intelligence",label: "Proactive triggers",    values: { starter: false,     pro: true,      agency: true } },
                { category: "Intelligence",label: "Conversion analytics",  values: { starter: false,     pro: "Full",    agency: "Full + reports" } },
                { category: "Intelligence",label: "Reseller portal",       values: { starter: false,     pro: false,     agency: true } },
                { category: "Voice",       label: "Languages supported",   values: { starter: "English", pro: "50+",     agency: "Unlimited" } },
                { category: "Voice",       label: "Voice conversations",   values: { starter: false,     pro: true,      agency: true } },
                { category: "Access",      label: "Conversation history",  values: { starter: "7 days",  pro: "1 year",  agency: "1 year" } },
                { category: "Access",      label: "White-label branding",  values: { starter: false,     pro: false,     agency: true } },
              ]}
              dispatch={dispatch}
            />
          ),
        },
      ],
    },
    {
      id: "testimonial",
      name: "Testimonial",
      icon: "💬",
      component: (dispatch) => (
        <Testimonial
          title="Testimonials"
          subtitle="Hear what our customers have to say."
          items={testimonialItems}
          minCards="1" // Optional: minimum cards to keep
          maxCards="6" // Optional: cannot exceed total items provided
          mode="carousel"
          columns="3" // Grid-only: used when mode="grid" (supports "1" to "6")
          autoPlay="0" // Carousel-only: milliseconds; "0" disables auto-play
          showDots="true"
          cardBg="#ffffffff"
          cardBorder="#e2e8f0"
          sectionBg="transparent"
          accentColor="#6366f1"
          headingColor="#0f172a"
          bodyColor="#475569"
          mutedColor="#94a3b8"
          starColor="#f59e0b"
          fontFamily="inherit"
          radius="xl"
          shadow="sm"
          dispatch={dispatch}
        />
      ),
    },
    {
      id: "media",
      name: "Media",
      icon: "🎬",
      variants: [
        {
          id: "media-image",
          label: "Image",
          component: (dispatch) => (
            <Media
              title="Image Preview"
              subtitle="Responsive image with fullscreen support."
              media={{
                src: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=1400&h=900&fit=crop",
                type: "image",
                alt: "Modern workspace with large windows",
              }}
              aspectRatio="16/9"
              allowFullscreen={true}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "media-video",
          label: "Video",
          component: (dispatch) => (
            <Media
              title="Video Preview"
              subtitle="HTML5 video with playback events."
              media={{
                src: "https://www.w3schools.com/html/mov_bbb.mp4",
                alt: "Sample video",
                thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1400&h=900&fit=crop",
                transcriptSrc: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              }}
              aspectRatio="16/9"
              controls={true}
              allowFullscreen={true}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "media-youtube",
          label: "YouTube",
          component: (dispatch) => (
            <Media
              title="YouTube Embed"
              subtitle="Privacy-enhanced regular YouTube embed."
              media={{
                src: "https://www.youtube.com/watch?v=9xwazD5SyVg",
                alt: "YouTube demo video",
              }}
              youtubePrivacyMode={true}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "media-shorts",
          label: "YouTube Shorts",
          component: (dispatch) => (
            <Media
              title="YouTube Shorts"
              subtitle="Short-form vertical embed with 9:16 aspect ratio."
              media={{
                src: "https://www.youtube.com/shorts/OOfrMa9Qbwk",
                alt: "YouTube shorts demo",
              }}
              youtubePrivacyMode={true}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "media-pdf-inline",
          label: "PDF Inline",
          component: (dispatch) => (
            <Media
              title="PDF Inline Preview"
              subtitle="Inline PDF rendering with fallback actions."
              media={{
                src: "https://www.orimi.com/pdf-test.pdf",
                alt: "Dummy PDF",
                downloadName: "dummy.pdf",
              }}
              height={520}
              openPdfInNewTab={false}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "media-pdf-tab",
          label: "PDF New Tab",
          component: (dispatch) => (
            <Media
              title="PDF External Flow"
              subtitle="Render as action card that opens PDF in a new tab."
              media={{
                src: "https://www.orimi.com/pdf-test.pdf",
                alt: "Dummy PDF",
                downloadName: "dummy.pdf",
              }}
              openPdfInNewTab={true}
              height={380}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "media-audio",
          label: "Audio",
          component: (dispatch) => (
            <Media
              title="Audio Playback"
              subtitle="Native audio control surface with playback events."
              media={{
                src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                alt: "Sample audio",
                transcriptSrc: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              }}
              height={220}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "media-unsupported",
          label: "Unsupported",
          component: (dispatch) => (
            <Media
              title="Unsupported Media"
              subtitle="Graceful fallback when media type is not supported."
              media={{
                src: "https://example.com/file.unknown-extension",
                alt: "Unsupported source",
              }}
              dispatch={dispatch}
            />
          ),
        },
      ],
    },
    {
      id: "faqs",
      name: "FAQs Component",
      icon: "❓",
      component: (dispatch) => (
        <Faqs
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about our services."
          faqs={[
            {
              question: "How do I get started with your service?",
              answer: "Getting started is easy! Simply sign up for a free account and follow our quick setup guide. Our team will be available to help you every step of the way."
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers. All payments are processed securely."
            },
            {
              question: "Can I cancel my subscription at any time?",
              answer: "Yes, you can cancel your subscription at any time with no penalties. Your service will continue until the end of your current billing cycle."
            },
            {
              question: "Do you offer a free trial?",
              answer: "Yes, we offer a 14-day free trial on all our paid plans. No credit card is required to start your trial."
            },
            {
              question: "Is there a limit to the number of users on my account?",
              answer: "Our Starter plan supports up to 5 users. The Pro plan supports unlimited users, and the Enterprise plan includes advanced user management features."
            },
            {
              question: "How secure is my data with your service?",
              answer: "We take security very seriously. All data is encrypted in transit and at rest. We comply with industry standards and conduct regular security audits."
            }
          ]}
          dispatch={dispatch}
        />
      ),
    },
    {
      id: "map",
      name: "Map",
      icon: "📍",
      variants: [
        {
          id: "map-address",
          label: "Address only",
          component: (dispatch) => (
            <Map
              address="T-Hub, Phase 2, Madhapur, Hyderabad, Telangana, India"
              markerLabel="T-Hub"
              height={440}
              showDirectionsLink={true}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "map-coordinates",
          label: "Coordinates only",
          component: (dispatch) => (
            <Map
              coordinates={{ lat: 17.433777767502608, lng: 78.37869814713162 }}
              markerLabel="Hyderabad"
              zoom={13}
              height={440}
              showDirectionsLink={true}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "map-both",
          label: "Coords + Label",
          component: (dispatch) => (
            <Map
              coordinates={{ lat: 17.433777767502608, lng: 78.37869814713162 }}
              address="T-Hub, Phase 2, Madhapur, Hyderabad, Telangana, India"
              markerLabel="T-Hub, Phase 2, Madhapur, Hyderabad, Telangana, India  "
              zoom={16}
              height={440}
              showDirectionsLink={true}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "map-empty",
          label: "No location",
          component: (dispatch) => (
            <Map
              height={440}
              dispatch={dispatch}
            />
          ),
        },
      ],
    },
    {
      id: "locations",
      name: "Locations",
      icon: "🏢",
      variants: [
        {
          id: "locations-full",
          label: "With images",
          component: (dispatch) => (
            <Locations
              title="Our Offices"
              subtitle="Find a T-Hub location near you."
              locations={[
                {
                  id: "thub-phase2",
                  title: "T-Hub Phase 2",
                  address: "Survey No. 1/1, Madhapur",
                  city: "Hyderabad",
                  phone: "+91 40 4444 5555",
                  email: "hello@t-hub.co",
                  operatingHours: "09:00-18:00",
                  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
                  coordinates: { lat: 17.4474, lng: 78.3762 },
                  tags: ["Incubation", "Coworking"],
                },
                {
                  id: "thub-phase1",
                  title: "T-Hub Phase 1",
                  address: "IIT Hyderabad Campus, Kandi",
                  city: "Hyderabad",
                  phone: "+91 40 2222 3333",
                  email: "phase1@t-hub.co",
                  operatingHours: "09:00-18:00",
                  image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop",
                  coordinates: { lat: 17.5968, lng: 78.1244 },
                  tags: ["Research", "Innovation"],
                },
                {
                  id: "thub-bengaluru",
                  title: "T-Hub Bengaluru",
                  address: "Koramangala, 5th Block",
                  city: "Bengaluru",
                  phone: "+91 80 6666 7777",
                  email: "blr@t-hub.co",
                  operatingHours: "08:00-20:00",
                  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
                  coordinates: { lat: 12.9352, lng: 77.6245 },
                  tags: ["Coworking", "Events"],
                },
              ]}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "locations-no-images",
          label: "No images",
          component: (dispatch) => (
            <Locations
              title="Our Offices"
              subtitle="Find a T-Hub location near you."
              locations={[
                {
                  id: "thub-phase2",
                  title: "T-Hub Phase 2",
                  address: "Survey No. 1/1, Madhapur",
                  city: "Hyderabad",
                  phone: "+91 40 4444 5555",
                  operatingHours: "09:00-18:00",
                  coordinates: { lat: 17.4474, lng: 78.3762 },
                  tags: ["Incubation", "Coworking"],
                },
                {
                  id: "thub-phase1",
                  title: "T-Hub Phase 1",
                  address: "IIT Hyderabad Campus, Kandi",
                  city: "Hyderabad",
                  phone: "+91 40 2222 3333",
                  operatingHours: "09:00-18:00",
                  coordinates: { lat: 17.5968, lng: 78.1244 },
                  tags: ["Research", "Innovation"],
                },
                {
                  id: "thub-bengaluru",
                  title: "T-Hub Bengaluru",
                  address: "Koramangala, 5th Block",
                  city: "Bengaluru",
                  phone: "+91 80 6666 7777",
                  operatingHours: "08:00-20:00",
                  coordinates: { lat: 12.9352, lng: 77.6245 },
                  tags: ["Coworking", "Events"],
                },
              ]}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "locations-single",
          label: "Single card",
          component: (dispatch) => (
            <Locations
              title="HQ"
              subtitle="Our Headquarters"
              locations={[
                {
                  id: "thub-phase2",
                  title: "T-Hub Phase 2",
                  address: "Survey No. 1/1, Madhapur",
                  city: "Hyderabad",
                  phone: "+91 40 4444 5555",
                  email: "hello@t-hub.co",
                  operatingHours: "09:00-18:00",
                  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
                  coordinates: { lat: 17.4474, lng: 78.3762 },
                  tags: ["Incubation", "Coworking"],
                },
              ]}
              dispatch={dispatch}
            />
          ),
        },
        {
          id: "locations-empty",
          label: "Empty state",
          component: (dispatch) => (
            <Locations
              title="Our Offices"
              locations={[]}
              dispatch={dispatch}
            />
          ),
        },
      ],
    },
  ];

  const activeComponent = COMPONENTS.find((c) => c.id === activeId);
  const activeVariant =
    activeComponent?.variants?.find((v) => v.id === activeVariantId) ??
    activeComponent?.variants?.[0];
  const handleDispatch: DispatchFn = (eventName, payload) => {
    setLastEvent({ eventName, payload });
  };

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
              onClick={() => { setActiveId(item.id); setActiveVariantId(null); }}
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
          <div className="ux:max-w-7xl ux:mx-auto ux:space-y-8">
            {/* Variant tabs — only shown when the active component has variants */}
            {activeComponent?.variants && (
              <div className="ux:flex ux:items-center ux:gap-1 ux:bg-slate-100 ux:rounded-xl ux:p-1 ux:self-start ux:w-fit">
                {activeComponent.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveVariantId(v.id)}
                    className={cn(
                      "ux:px-4 ux:py-2 ux:rounded-lg ux:text-xs ux:font-semibold ux:transition-all ux:cursor-pointer",
                      (activeVariant?.id === v.id)
                        ? "ux:bg-white ux:text-slate-900 ux:shadow-sm"
                        : "ux:text-slate-400 hover:ux:text-slate-600"
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            )}

            <div className="ux:p-1 ux:min-h-125 ux:flex ux:items-start ux:justify-center">
              {activeVariant
                ? activeVariant.component(handleDispatch)
                : activeComponent?.component?.(handleDispatch)}
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
                  {JSON.stringify(lastEvent.payload ?? {}, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
