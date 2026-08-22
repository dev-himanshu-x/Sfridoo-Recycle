"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Recycle, Leaf, BarChart3, ListChecks, BarChart2, Star } from "lucide-react";
import BentoGridThirdDemo from "@/components/bento-grid-demo-3";

import Header from "@/components/header";

const WasteFlowDiagram = dynamic(() => import("@/components/waste-flow-diagram"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: 700, borderRadius: 16, background: "#fff" }} />
  ),
});

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex-1 bg-white">
        {/* Full-viewport hero card */}
        <section className="px-8 pt-4 pb-0">
          <div
            className="relative w-full rounded-3xl overflow-hidden flex flex-col items-center justify-center text-center"
            style={{
              minHeight: "calc(100vh - 72px)",
              backgroundImage: "url('https://framerusercontent.com/images/haK7pc5gUzcnGMDC0GHDsLXMql0.png?width=1200&height=904')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          >
            {/* Gradient overlay — lighter at top, darker at bottom for depth */}
            <div
              className="absolute inset-0"
            
            />

            {/* Content */}
            <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center">
              

              {/* Heading */}
              <h1
                className="text-5xl md:text-7xl font-normal text-gray-900 tracking-tight leading-[1.08] mb-6"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Transform Industrial<br />Waste Into New Value
              </h1>

              {/* Subtitle */}
              <p
                className="text-base md:text-lg text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Our platform connects industries to turn one company's waste into another's raw material — automatically, compliantly, profitably.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link href="/create">
                  <Button
                    className="h-12 px-7 text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-full transition-all hover:scale-105 shadow-md"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    Sell Materials
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/listing">
                  <Button
                    variant="outline"
                    className="h-12 px-7 text-sm font-medium bg-white/70 backdrop-blur-sm border border-gray-300 text-gray-800 rounded-full transition-all hover:bg-white hover:scale-105"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Flow Diagram — white strip below the card */}
        <section className="bg-white">
          <div className="w-full overflow-hidden max-w-7xl mx-auto">
            <WasteFlowDiagram />
          </div>
        </section>


        {/* Services Section */}
        <section className="px-6 pb-32">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 items-start">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-sm font-medium mb-6">
                Services
              </span>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-6">
                Your guide for
                <br />
                the road ahead
              </h2>
              <p className="text-gray-500 text-base leading-relaxed max-w-sm">
                We help small and mid-sized businesses navigate the path to sustainability. Whether you are setting out or refining your route, we will guide you every step of the way.
              </p>
            </div>

            <div className="space-y-10">
              <article className="rounded-2xl overflow-hidden">
                <img
                  src="/carbon-footprint-definition.jpg"
                  alt="Carbon footprinting and reporting"
                  className="w-full max-h-[280px] object-contain rounded-2xl"
                />
                <div className="pt-5">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Carbon footprinting & reporting
                  </h3>
                  <p className="text-gray-500">
                    Measure your emissions with clarity, laying the foundation for smarter action.
                  </p>
                </div>
              </article>

              <article className="rounded-2xl overflow-hidden">
                <img
                  src="/sustainablity.jpg"
                  alt="Sustainability strategy"
                  className="w-full max-h-[280px] object-contain rounded-2xl"
                />
                <div className="pt-5">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Sustainability strategy
                  </h3>
                  <p className="text-gray-500">
                    Build a practical roadmap that aligns operations with measurable ESG goals.
                  </p>
                </div>
              </article>

              <article className="rounded-2xl overflow-hidden">
                <img
                  src="/waste stream.png"
                  alt="Waste stream optimization"
                  className="w-full max-h-[280px] object-contain rounded-2xl"
                />
                <div className="pt-5">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Waste stream optimization
                  </h3>
                  <p className="text-gray-500">
                    Identify hidden value in your waste and unlock new revenue streams through circular practices.
                  </p>
                </div>
              </article>

              <article className="rounded-2xl overflow-hidden">
                <img
                  src="/8-steps-regulatory-compliance.png"
                  alt="Regulatory compliance"
                  className="w-full max-h-[280px] object-contain rounded-2xl"
                />
                <div className="pt-5">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Regulatory compliance
                  </h3>
                  <p className="text-gray-500">
                    Stay ahead of environmental regulations with automated compliance tracking and reporting tools.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Bento Grid Section */}
        <section className="px-6 pb-32">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">

            {/* Card 1: Get ahead of regulation - spans 2 cols */}
            <RegulationCard />

            {/* Card 2: Win more contracts - spans 2 rows */}
            <div className="md:row-span-2 bg-[#f5f5f0] rounded-3xl p-8 flex flex-col justify-between min-h-[280px]">
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                  Close deals faster
                </h3>
                <p className="text-gray-500 text-sm max-w-[200px]">
                  Connect with verified buyers actively seeking your industrial by-products.
                </p>
              </div>
              <div className="flex-1 flex justify-center items-center mt-6">
                <img
                  src="/deals.svg"
                  alt="Close deals faster"
                  className="w-48 h-auto object-contain"
                  style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
                />
              </div>
            </div>

            {/* Card 3: Boost your team - spans 2 cols */}
            <div className="md:col-span-2 bg-[#f5f5f0] rounded-3xl p-8 min-h-[200px] flex flex-col justify-center">
              <div className="flex items-center gap-1 mb-2">
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  Scale your
                </h3>
                <div className="flex -space-x-2 mx-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 border-2 border-[#f5f5f0] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" alt="Team member" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-600 border-2 border-[#f5f5f0] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="Team member" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-sky-600 border-2 border-[#f5f5f0] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" alt="Team member" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  operations
                </h3>
              </div>
              <p className="text-gray-500 text-sm">
                Our waste specialists work as an extension of your team to optimize every stream.
              </p>
            </div>

            {/* Card 4: Award winning */}
            <div className="bg-[#f5f5f0] rounded-3xl p-8 flex flex-col justify-between min-h-[260px]">
              <h3 className="text-2xl font-semibold text-emerald-800">
                Trusted platform
              </h3>
              <div className="flex-1 flex justify-center items-center mt-4">
                <img src="/trophy.svg" alt="Trophy" className="w-48 h-48 object-contain" />
              </div>
            </div>

            {/* Card 5: Happy clients */}
            <div className="bg-[#f5f5f0] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[260px]">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-5xl font-bold text-gray-900">120+</span>
              <span className="text-gray-500 text-lg mt-1">Industries served</span>
            </div>

            {/* Card 6: Create real impact */}
            <div className="md:row-span-1 bg-[#f5f5f0] rounded-3xl p-8 flex flex-col justify-between min-h-[320px] overflow-hidden relative">
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
                Zero waste<br />to landfill
              </h3>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: 320, height: 180 }}>
                <svg viewBox="0 0 320 180" width="320" height="180">
                  <ellipse cx="160" cy="180" rx="160" ry="160" fill="#d4d4d4" />
                  <ellipse cx="160" cy="180" rx="130" ry="130" fill="#b8b8b8" />
                  <ellipse cx="160" cy="180" rx="100" ry="100" fill="#9a9a9a" />
                  <ellipse cx="160" cy="180" rx="72" ry="72" fill="#7a7a7a" />
                  <ellipse cx="160" cy="180" rx="48" ry="48" fill="#555" />
                  <ellipse cx="160" cy="180" rx="26" ry="26" fill="#2a2e2a" />
                </svg>
              </div>
            </div>

          </div>
        </section>

        {/* Aceternity Bento Grid Section */}
        <section className="px-6 pb-32">
          <div className="max-w-6xl mx-auto">
            <BentoGridThirdDemo />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="pb-32 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 text-center mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 text-sm font-medium mb-6">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
              What our clients say
            </h2>
            <p className="text-gray-500 text-base max-w-md mx-auto">
              Climate action is a long-term commitment so we&apos;re building lasting relationships to match.
            </p>
          </div>

          <TestimonialCarousel />
        </section>

        {/* Climate Action CTA Section */}
        <section className="px-6 pb-32">
          <div className="max-w-6xl mx-auto bg-[#f5f5f0] rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] min-h-[420px]">
              {/* Left: Text Content */}
              <div className="flex flex-col justify-center px-10 md:px-16 py-16">
                <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 leading-tight mb-6">
                  Ready to take climate action?
                </h2>
                <p className="text-gray-500 text-base leading-relaxed max-w-lg mb-8">
                  Book a free consultation to speak with a carbon expert and discuss your goals. Let&apos;s build a smarter, greener future for your business.
                </p>
                <div>
                  <Link href="/create">
                    <Button className="h-12 px-7 text-sm bg-[#1C1F2A] hover:bg-[#2A2E3D] text-white rounded-full transition-all hover:scale-105">
                      Book my free consultation
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: Vertically Scrolling Image Columns */}
              <div className="hidden lg:flex gap-3 pr-6 py-6 h-[420px] overflow-hidden">
                {/* Column 1 — scrolls top to bottom */}
                <div className="w-[160px] overflow-hidden relative">
                  <div className="animate-marquee-down flex flex-col gap-3">
                    <img src="/sustainablity.jpg" alt="Sustainability" className="w-full h-[200px] object-cover rounded-2xl" />
                    <img src="/waste%20stream.png" alt="Waste Stream" className="w-full h-[240px] object-cover rounded-2xl" />
                    <img src="/sustainablity.jpg" alt="Sustainability" className="w-full h-[200px] object-cover rounded-2xl" />
                    {/* Duplicate for seamless loop */}
                    <img src="/sustainablity.jpg" alt="Sustainability" className="w-full h-[200px] object-cover rounded-2xl" />
                    <img src="/waste%20stream.png" alt="Waste Stream" className="w-full h-[240px] object-cover rounded-2xl" />
                    <img src="/sustainablity.jpg" alt="Sustainability" className="w-full h-[200px] object-cover rounded-2xl" />
                  </div>
                </div>
                {/* Column 2 — scrolls bottom to top */}
                <div className="w-[160px] overflow-hidden relative">
                  <div className="animate-marquee-up flex flex-col gap-3">
                    <img src="/carbon-footprint-definition.jpg" alt="Carbon Footprint" className="w-full h-[200px] object-cover rounded-2xl" />
                    <img src="/8-steps-regulatory-compliance.png" alt="Compliance" className="w-full h-[240px] object-cover rounded-2xl" />
                    <img src="/carbon-footprint-definition.jpg" alt="Carbon Footprint" className="w-full h-[200px] object-cover rounded-2xl" />
                    {/* Duplicate for seamless loop */}
                    <img src="/carbon-footprint-definition.jpg" alt="Carbon Footprint" className="w-full h-[200px] object-cover rounded-2xl" />
                    <img src="/8-steps-regulatory-compliance.png" alt="Compliance" className="w-full h-[240px] object-cover rounded-2xl" />
                    <img src="/carbon-footprint-definition.jpg" alt="Carbon Footprint" className="w-full h-[200px] object-cover rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a2e1a] rounded-t-[2.5rem] mt-[-10px] relative z-10 text-white">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-12 md:gap-20 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Recycle className="w-5 h-5 text-white" />
                <span className="text-lg font-semibold">Sfridoo</span>
              </div>
              <p className="text-sm text-white/60 max-w-xs mb-6">
                B2B industrial waste marketplace for savvy businesses. Turn by-products into profit.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-4">
                <a href="#" aria-label="Twitter" className="text-white/50 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="#" aria-label="Instagram" className="text-white/50 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="text-white/50 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
                <a href="#" aria-label="YouTube" className="text-white/50 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </a>
              </div>
            </div>

            {/* Pages */}
            <div>
              <h4 className="text-sm font-semibold mb-5">Pages</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="/listing" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/demand" className="hover:text-white transition-colors">Material Requests</Link></li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h4 className="text-sm font-semibold mb-5">Information</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <span>© 2025 Sfridoo, All rights reserved</span>
            <span>B2B Industrial Waste Marketplace</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RegulationCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="md:col-span-2 bg-[#f5f5f0] rounded-3xl p-8 flex flex-col justify-between min-h-[280px]"
    >
      <div>
        <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
          Stay compliant, stay ahead
        </h3>
        <p className="text-gray-500 text-sm">
          Meet evolving waste disposal regulations with automated tracking and reporting.
        </p>
      </div>
      <div className="mt-8 space-y-5">
        {/* Slider line 1 */}
        <div className="flex items-center gap-0">
          <div
            className="h-[2px] bg-[#1C1F2A] transition-all duration-1000 ease-out"
            style={{ width: inView ? '100%' : '0%' }}
          />
          <div
            className="w-10 h-10 rounded-full border-2 border-[#1C1F2A] flex items-center justify-center bg-white -ml-1 shrink-0 transition-all duration-1000 ease-out"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'scale(1)' : 'scale(0.5)' }}
          >
            <ListChecks className="w-4 h-4 text-[#1C1F2A]" />
          </div>
        </div>
        {/* Slider line 2 — slightly delayed */}
        <div className="flex items-center gap-0">
          <div
            className="h-[2px] bg-[#1C1F2A] transition-all ease-out"
            style={{ width: inView ? '70%' : '0%', transitionDuration: '1.2s', transitionDelay: '0.3s' }}
          />
          <div
            className="w-10 h-10 rounded-full border-2 border-[#1C1F2A] flex items-center justify-center bg-white -ml-1 shrink-0 transition-all ease-out"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'scale(1)' : 'scale(0.5)', transitionDuration: '0.6s', transitionDelay: '1s' }}
          >
            <BarChart2 className="w-4 h-4 text-[#1C1F2A]" />
          </div>
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote: "Sfridoo simplified what felt impossibly complex. We finally have a clear channel to monetize our factory by-products.",
    name: "Lisa K.",
    company: "GreenVolt Energy",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop",
  },
  {
    quote: "Their AI classification saved us weeks of manual sorting. We listed our steel slag and had a buyer within 48 hours.",
    name: "Mark D.",
    company: "Avora Manufacturing",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
  },
  {
    quote: "We used to pay for waste disposal. Now Sfridoo turns it into revenue. Our plastic offcuts found a second life.",
    name: "Ben F.",
    company: "Crafter & Co.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
  },
  {
    quote: "Sfridoo doesn't just list waste — they match you with the right buyer. The routing engine is genuinely impressive.",
    name: "Rachel E.",
    company: "NineTwenty Industries",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
  },
  {
    quote: "From upload to deal closed in three days. The platform handles compliance docs, logistics — everything.",
    name: "James P.",
    company: "Orion Logistics",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
  },
];

function TestimonialCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 400;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto px-6 md:px-16 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[320px] bg-white border border-gray-100 rounded-2xl p-7 flex flex-col justify-between shadow-sm"
          >
            {/* Stars */}
            <div>
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#1C1F2A] text-[#1C1F2A]" />
                ))}
              </div>
              <p className="text-gray-800 text-[15px] leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
            {/* Author */}
            <div className="flex items-center gap-3 mt-6">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}