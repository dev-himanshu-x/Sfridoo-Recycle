"use client";

import { useParams } from "next/navigation";
import Header from "@/components/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Recycle, ArrowLeft, Users, Leaf, Zap, Droplets, Building2, ChevronRight } from "lucide-react";

/* ── Static data ─────────────────────────────────────────────── */

const CHAINS: Record<string, {
  name: string;
  status: string;
  description: string;
  longDescription: string;
  impact: { carbon: string; waste: string; energy: string; water: string };
  partners: { name: string; role: string }[];
  materials: string[];
  participants: number;
  administrator: string;
  location: string;
  created: string;
  nextMeeting: string;
  certifications: string[];
}> = {
  "plastic-recycling-loop": {
    name: "Plastic Recycling Loop",
    status: "Active",
    description: "Closed-loop supply chain for recycled plastics from collection to manufacturing.",
    longDescription:
      "Our plastic recycling loop creates a fully circular system for plastic waste. We connect collection points, sorting facilities, recyclers, and manufacturers to ensure that plastic materials remain in use for as long as possible. This reduces the need for virgin plastic production and keeps valuable materials out of landfills and oceans.",
    impact: { carbon: "2,500 tons CO2e", waste: "1,200 tons", energy: "45,000 kWh", water: "12 million liters" },
    partners: [
      { name: "EcoRecycle Ltd", role: "Collection & Sorting" },
      { name: "PlastiPure Processing", role: "Recycling" },
      { name: "GreenMold Manufacturing", role: "Manufacturing" },
      { name: "CircularPackaging Co", role: "End Product Manufacturing" },
      { name: "RetailRevolution", role: "Distribution" },
    ],
    materials: ["HDPE", "PET", "PP"],
    participants: 8,
    administrator: "EcoRecycle Ltd",
    location: "Western Europe",
    created: "2023-02-15",
    nextMeeting: "2025-05-20",
    certifications: ["ISO 14001", "Circular Economy Standard 1.0"],
  },
  "textile-recovery-network": {
    name: "Textile Recovery Network",
    status: "Active",
    description: "Collaborative supply chain for textile waste recovery and reuse.",
    longDescription:
      "A B2B network connecting textile manufacturers, processors, and brands to recover and reuse textile waste at scale. The network operates across collection → sorting → fibre recovery → re-spinning → manufacturing stages.",
    impact: { carbon: "1,800 tons CO2e", waste: "900 tons", energy: "28,000 kWh", water: "8 million liters" },
    partners: [
      { name: "FiberLoop India", role: "Collection" },
      { name: "SortTex Solutions", role: "Sorting" },
      { name: "ReWeave Mills", role: "Processing" },
      { name: "CircleWear Brands", role: "Manufacturing" },
    ],
    materials: ["Cotton", "Polyester", "Nylon"],
    participants: 12,
    administrator: "FiberLoop India",
    location: "South Asia",
    created: "2023-06-01",
    nextMeeting: "2025-06-10",
    certifications: ["GOTS", "ISO 14001"],
  },
  "construction-materials-exchange": {
    name: "Construction Materials Exchange",
    status: "Active",
    description: "Regional network for reusing and recycling construction and demolition waste.",
    longDescription:
      "Connecting demolition contractors, material processors, and construction companies to recover concrete, wood, and metal from demolition sites and channel them back into new building projects.",
    impact: { carbon: "3,200 tons CO2e", waste: "5,800 tons", energy: "62,000 kWh", water: "20 million liters" },
    partners: [
      { name: "DemoTech Services", role: "Demolition & Collection" },
      { name: "StoneSort India", role: "Processing" },
      { name: "ReBuilt Construction", role: "End User" },
    ],
    materials: ["Concrete", "Wood", "Metal"],
    participants: 15,
    administrator: "DemoTech Services",
    location: "Western India",
    created: "2022-11-10",
    nextMeeting: "2025-05-28",
    certifications: ["ISO 14001", "Green Building Council"],
  },
  "electronics-takeback-system": {
    name: "Electronics Takeback System",
    status: "Planning Phase",
    description: "Reverse logistics system for electronics recovery and component reuse.",
    longDescription:
      "A structured take-back program connecting retailers and OEMs with certified e-waste processors to recover precious metals, PCBs, and reusable components from end-of-life electronics.",
    impact: { carbon: "950 tons CO2e", waste: "320 tons", energy: "18,000 kWh", water: "3 million liters" },
    partners: [
      { name: "E-Cycle Corp", role: "Collection" },
      { name: "MetalRecover Labs", role: "Processing" },
      { name: "ReChip Technologies", role: "Component Reuse" },
    ],
    materials: ["PCBs", "Precious Metals", "Plastics"],
    participants: 6,
    administrator: "E-Cycle Corp",
    location: "Pan India",
    created: "2024-01-20",
    nextMeeting: "2025-07-01",
    certifications: ["E-Stewards", "ISO 14001"],
  },
};

const STEPS = ["Collection", "Sorting", "Processing", "Manufacturing", "Distribution"];



export default function ChainDetailPage() {
  const { id } = useParams<{ id: string }>();
  const chain = CHAINS[id];

  if (!chain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Supply chain not found.</p>
          <Link href="/supply-chains">
            <Button variant="outline" className="rounded-md">← Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Back link */}
        <Link
          href="/supply-chains"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Supply Chains
        </Link>

        {/* Page title row */}
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1
                className="text-3xl md:text-4xl font-semibold text-gray-900"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {chain.name}
              </h1>
           
            </div>
            <p className="text-gray-500 text-base max-w-xl">{chain.description}</p>
          </div>
          <Button className="bg-[#1C1F2A] hover:bg-[#2A2E3D] text-white rounded-md px-6 shrink-0 hidden md:flex">
            Join Supply Chain <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Long description */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8 text-sm text-gray-600 leading-relaxed">
          {chain.longDescription}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Left column */}
          <div className="space-y-8">
            {/* Environmental Impact */}
            <section>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Environmental Impact</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: <Leaf className="w-4 h-4 text-emerald-600" />, label: "Carbon Saved", value: chain.impact.carbon },
                  { icon: <Recycle className="w-4 h-4 text-blue-600" />, label: "Waste Recycled", value: chain.impact.waste },
                  { icon: <Zap className="w-4 h-4 text-amber-500" />, label: "Energy Saved", value: chain.impact.energy },
                  { icon: <Droplets className="w-4 h-4 text-sky-500" />, label: "Water Saved", value: chain.impact.water },
                ].map((item) => (
                  <div key={item.label} className="bg-white border border-gray-100 rounded-xl p-4">
                    <div className="mb-2">{item.icon}</div>
                    <p className="text-[11px] text-gray-400 font-medium mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Material Flow */}
            <section>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Material Flow</h2>
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center gap-2">
                  {STEPS.map((step, i) => (
                    <div key={step} className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="flex flex-col items-center flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center mb-1.5">
                          {i + 1}
                        </div>
                        <span className="text-[11px] text-gray-500 font-medium text-center leading-tight truncate w-full text-center">{step}</span>
                      </div>
                      {i < STEPS.length - 1 && <div className="h-px bg-gray-200 flex-1 min-w-[12px]" />}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Partner Companies */}
            <section>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Partner Companies</h2>
              <div className="space-y-2">
                {chain.partners.map((partner) => (
                  <div
                    key={partner.name}
                    className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-5 py-3.5 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{partner.name}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                      {partner.role}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Details card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">Supply Chain Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Materials</p>
                  <div className="flex flex-wrap gap-1.5">
                    {chain.materials.map((m) => (
                      <span key={m} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{m}</span>
                    ))}
                  </div>
                </div>
                {[
                  { label: "Administrator", value: chain.administrator },
                  { label: "Participants", value: `${chain.participants} companies` },
                  { label: "Location", value: chain.location },
                  { label: "Created", value: chain.created },
                  { label: "Next Meeting", value: chain.nextMeeting },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-2">
                    <span className="text-xs text-gray-400">{row.label}</span>
                    <span className="text-xs font-medium text-gray-800 text-right">{row.value}</span>
                  </div>
                ))}
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Certifications</p>
                  <div className="flex flex-col gap-1">
                    {chain.certifications.map((c) => (
                      <span key={c} className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Join CTA */}
            <Button className="w-full bg-[#1C1F2A] hover:bg-[#2A2E3D] text-white rounded-md h-11">
              Join Supply Chain <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
