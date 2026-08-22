"use client";

import { useState } from "react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Recycle, ArrowRight, CheckCircle2, Zap, Bell } from "lucide-react";

interface DemandRequest {
  _id: string;
  companyName: string;
  contactEmail: string;
  materialName: string;
  category?: string;
  quantityNeeded?: number;
  unit?: string;
  province?: string;
  description?: string;
  createdAt: string;
}

const CATEGORIES = [
  "Textile", "Metal", "Plastic", "Wood", "Paper", "Chemical",
  "Electronic", "Rubber", "Glass", "Organic", "Other"
];

const UNITS = ["kg", "tons", "liters", "units", "m²", "m³"];

export default function DemandPage() {
  const [form, setForm] = useState({
    companyName: "",
    contactEmail: "",
    materialName: "",
    category: "",
    quantityNeeded: "",
    unit: "kg",
    province: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demands, setDemands] = useState<DemandRequest[]>([]);
  const [showDemands, setShowDemands] = useState(false);
  const [loadingDemands, setLoadingDemands] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/demand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantityNeeded: form.quantityNeeded ? Number(form.quantityNeeded) : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const loadDemands = async () => {
    setLoadingDemands(true);
    try {
      const res = await fetch("/api/demand");
      const data = await res.json();
      setDemands(Array.isArray(data) ? data : []);
      setShowDemands(true);
    } catch {
      setDemands([]);
    } finally {
      setLoadingDemands(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f6]">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          
          <h1
            className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Register What You Need.<br />
            <span className="text-[#1a2e1a]">We Find It For You.</span>
          </h1>
          <p
            className="text-gray-500 max-w-lg mx-auto text-base leading-relaxed"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Tell us what industrial materials your business needs. When a matching listing appears on the marketplace, we instantly notify you by email.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
          {/* Form */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Request Registered!</h2>
                <p className="text-gray-500 max-w-sm mb-8">
                  We'll email <strong>{form.contactEmail}</strong> as soon as a matching listing for <strong>{form.materialName}</strong> appears on the marketplace.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="rounded-md border-gray-200"
                    onClick={() => { setSubmitted(false); setForm({ companyName: "", contactEmail: "", materialName: "", category: "", quantityNeeded: "", unit: "kg", province: "", description: "" }); }}
                  >
                    Add another request
                  </Button>
                  <Link href="/listing">
                    <Button className="bg-[#1C1F2A] hover:bg-[#2A2E3D] text-white rounded-md">
                      Browse Marketplace <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Material Demand Request</h2>
                  <p className="text-sm text-gray-400">We'll notify you instantly when a match is found.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name *</label>
                    <Input
                      name="companyName"
                      placeholder="Acme Industries Ltd."
                      value={form.companyName}
                      onChange={handleChange}
                      required
                      className="rounded-md border-gray-200 focus-visible:ring-[#1a2e1a]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email *</label>
                    <Input
                      name="contactEmail"
                      type="email"
                      placeholder="procurement@company.com"
                      value={form.contactEmail}
                      onChange={handleChange}
                      required
                      className="rounded-md border-gray-200 focus-visible:ring-[#1a2e1a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Material Needed *</label>
                  <Input
                    name="materialName"
                    placeholder="e.g. Cotton, Steel Slag, ABS Plastic, Wood Chips..."
                    value={form.materialName}
                    onChange={handleChange}
                    required
                    className="rounded-md border-gray-200 focus-visible:ring-[#1a2e1a]"
                  />
                  <p className="text-xs text-gray-400 mt-1">Be specific — this is used to match against new listings</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2e1a]"
                    >
                      <option value="">Select…</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity Needed</label>
                    <Input
                      name="quantityNeeded"
                      type="number"
                      min={0}
                      placeholder="e.g. 5000"
                      value={form.quantityNeeded}
                      onChange={handleChange}
                      className="rounded-md border-gray-200 focus-visible:ring-[#1a2e1a]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
                    <select
                      name="unit"
                      value={form.unit}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2e1a]"
                    >
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Province / Region</label>
                  <Input
                    name="province"
                    placeholder="e.g. Maharashtra, Gujarat, Punjab…"
                    value={form.province}
                    onChange={handleChange}
                    className="rounded-md border-gray-200 focus-visible:ring-[#1a2e1a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Details</label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Purity requirements, packaging preferences, frequency of procurement…"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-md border border-gray-200 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#1a2e1a]"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-md">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-[#1a2e1a] hover:bg-[#243424] text-white rounded-md text-base font-semibold"
                >
                  {submitting ? "Registering…" : (
                    <>
                      <Bell className="w-4 h-4 mr-2" />
                      Register Demand & Get Notified
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How it works */}
            <div className="bg-[#1a2e1a] rounded-3xl p-8 text-white">
              <h3 className="text-lg font-semibold mb-6">How Symbiosis Works</h3>
              <div className="space-y-5">
                {[
                  { step: "1", title: "Register your need", desc: "Tell us what material your factory requires." },
                  { step: "2", title: "AI scans listings", desc: "Every new listing is matched against all active demand requests." },
                  { step: "3", title: "Instant email alert", desc: "You get an email the moment a match is available on the marketplace." },
                  { step: "4", title: "Connect & transact", desc: "Visit the listing, make an offer, and close the deal." },
                ].map(item => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-white/60 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Browse marketplace */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Already listed?</h3>
              <p className="text-sm text-gray-500 mb-4">Check the marketplace — your material might already be available.</p>
              <Link href="/listing">
                <Button variant="outline" className="w-full rounded-md border-gray-200">
                  Browse Marketplace <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* View active demands */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Active Demand Requests</h3>
                <button
                  onClick={loadDemands}
                  disabled={loadingDemands}
                  className="text-xs text-[#1a2e1a] font-medium hover:underline"
                >
                  {loadingDemands ? "Loading…" : "Load"}
                </button>
              </div>
              {showDemands && (
                demands.length === 0 ? (
                  <p className="text-sm text-gray-400">No active demands yet.</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {demands.map(d => (
                      <div key={d._id} className="flex items-start justify-between gap-2 py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{d.materialName}</p>
                          <p className="text-xs text-gray-400">{d.companyName} · {d.province || "Any region"}</p>
                          {d.quantityNeeded && (
                            <p className="text-xs text-gray-400">{d.quantityNeeded.toLocaleString()} {d.unit}</p>
                          )}
                        </div>
                        {d.category && (
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full shrink-0">{d.category}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
