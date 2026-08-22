"use client";

import dynamic from "next/dynamic";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus, Users, MapPin, Activity, ArrowRight, ScanLine } from "lucide-react";

// Dynamically import the map component with SSR disabled
const RagpickerMap = dynamic(() => import("@/components/ragpicker-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 rounded-2xl animate-pulse">
      <MapPin className="w-8 h-8 mb-2 opacity-50" />
      <p className="text-sm font-medium">Initializing Map Engine...</p>
    </div>
  ),
});

export default function RagpickerNetworkPage() {
  return (
    <div className="h-screen flex flex-col bg-[#f9f9f6] overflow-hidden">
      <Header />

      <main className="flex-1 flex flex-col md:flex-row p-4 md:p-6 gap-6 h-[calc(100vh-73px)]">
        {/* Left Sidebar - Stats & Controls */}
        <aside className="w-full md:w-[380px] flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="space-y-1">
            
            <h1 className="text-3xl font-normal text-gray-900 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Collection Network
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI-optimized dispatch and routing for urban ragpickers and collection hubs.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Active Pickers</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">248</p>
              <p className="text-xs text-emerald-600 mt-1 font-medium">+12 this week</p>
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Active Hubs</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">14</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">Across 4 zones</p>
            </div>
          </div>

          {/* AI Optimization Status */}
          <div className="bg-[#1C1F2A] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ScanLine className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-gray-200">AI Routing Engine</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed max-w-[90%]">
                Continuously matching nearest ragpickers to hubs based on load capacity, distance, and material type.
              </p>
              <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
                <span className="text-xs font-medium text-gray-300">Routing Efficiency</span>
                <span className="text-sm font-bold text-emerald-400">94.2%</span>
              </div>
            </div>
          </div>

          {/* Onboard CTA */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <Button className="w-full bg-[#1C1F2A] hover:bg-[#2A2E3D] text-white rounded-xl h-12 shadow-sm transition-all group">
              <Plus className="w-4 h-4 mr-2" />
              Onboard New Ragpicker
              <ArrowRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>
        </aside>

        {/* Right Area - Map container */}
        <section className="flex-1 h-full bg-white rounded-3xl border border-gray-100 shadow-sm relative p-2">
          {/* We wrap the map component in a div to ensure it takes full space of its container properly */}
          <div className="w-full h-full relative rounded-2xl overflow-hidden bg-gray-50">
             <RagpickerMap />
          </div>
          
          {/* Overlay Map Legend/Controls */}
          <div className="absolute bottom-6 right-6 z-[1000] bg-white/90 backdrop-blur-md border border-gray-200 p-3 rounded-xl shadow-lg flex flex-col gap-2 pointer-events-none">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded bg-[#1C1F2A]"></div>
               <span className="text-xs font-medium text-gray-700">Collection Hub</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
               <span className="text-xs font-medium text-gray-700">Active Ragpicker</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-0.5 bg-emerald-500 border border-dashed border-white"></div>
               <span className="text-xs font-medium text-gray-700">AI Assigned Route</span>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
