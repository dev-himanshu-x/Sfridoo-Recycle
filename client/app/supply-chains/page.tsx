"use client";

import Link from "next/link";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Recycle, ArrowRight, Users, Leaf, Plus, ChevronRight } from "lucide-react";

const chains = [
  {
    id: "plastic-recycling-loop",
    name: "Plastic Recycling Loop",
    status: "Active",
    description: "Closed-loop supply chain for recycled plastics from collection to manufacturing.",
    participants: 8,
    carbonSaved: "2,500 tons CO2e",
    materials: ["HDPE", "PET", "PP"],
  },
  {
    id: "textile-recovery-network",
    name: "Textile Recovery Network",
    status: "Active",
    description: "Collaborative supply chain for textile waste recovery and reuse.",
    participants: 12,
    carbonSaved: "1,800 tons CO2e",
    materials: ["Cotton", "Polyester", "Nylon"],
  },
  {
    id: "construction-materials-exchange",
    name: "Construction Materials Exchange",
    status: "Active",
    description: "Regional network for reusing and recycling construction and demolition waste.",
    participants: 15,
    carbonSaved: "3,200 tons CO2e",
    materials: ["Concrete", "Wood", "Metal"],
  },
  {
    id: "electronics-takeback-system",
    name: "Electronics Takeback System",
    status: "Planning Phase",
    description: "Reverse logistics system for electronics recovery and component reuse.",
    participants: 6,
    carbonSaved: "950 tons CO2e",
    materials: ["PCBs", "Precious Metals", "Plastics"],
  },
];

const STEPS = ["Collection", "Sorting", "Processing", "Manufacturing", "Distribution"];

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
        isActive
          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
          : "bg-amber-50 text-amber-700 border border-amber-100"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-amber-400"}`} />
      {status}
    </span>
  );
}

export default function SupplyChainsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Platform</p>
          <h1
            className="text-2xl md:text-4xl font-normal text-gray-900 leading-tight mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Circular Supply Chains
          </h1>
          <p className="text-gray-500 max-w-lg text-base leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Connect with companies across industries to create closed-loop supply chains, track material flows, and measure environmental impact.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {chains.map((chain) => (
            <div
              key={chain.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-md transition-all duration-200 flex flex-col gap-5"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-1">{chain.name}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{chain.description}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <Users className="w-3.5 h-3.5" />
                    Participants
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{chain.participants} companies</p>
                </div>
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <Leaf className="w-3.5 h-3.5" />
                    Carbon Saved
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{chain.carbonSaved}</p>
                </div>
              </div>

              {/* Materials */}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-2">Materials</p>
                <div className="flex flex-wrap gap-1.5">
                  {chain.materials.map((m) => (
                    <span key={m} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{m}</span>
                  ))}
                </div>
              </div>

              {/* Flow steps */}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-2">Supply Chain Flow</p>
                <div className="flex items-center gap-1">
                  {STEPS.map((step, i) => (
                    <div key={step} className="flex items-center gap-1 flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-6 h-6 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center">
                          {i + 1}
                        </div>
                        <span className="text-[9px] text-gray-400 mt-1 text-center leading-tight hidden sm:block">{step}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="w-4 h-px bg-gray-200 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t border-gray-50">
                <Link href={`/supply-chains/${chain.id}`} className="flex-1">
                  <Button variant="outline" className="w-full rounded-md border-gray-200 text-sm">
                    View Details
                  </Button>
                </Link>
                <Link href={`/supply-chains/${chain.id}`} className="flex-1">
                  <Button className="w-full rounded-md bg-[#1C1F2A] hover:bg-[#2A2E3D] text-white text-sm">
                    Join Chain <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Create CTA */}
        <div className="border border-dashed border-gray-200 rounded-2xl p-8 text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-5 h-5 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create a New Supply Chain</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
            Have a circular economy initiative in mind? Start a new supply chain to connect with potential partners and create closed-loop material flows. Our platform helps with planning, coordination, and impact measurement.
          </p>
          <Button className="bg-[#1C1F2A] hover:bg-[#2A2E3D] text-white rounded-md px-6">
            <Plus className="w-4 h-4 mr-2" />
            Create Supply Chain
          </Button>
        </div>
      </main>
    </div>
  );
}
