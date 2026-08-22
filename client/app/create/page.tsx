"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { HelpCircle, Mail, Upload, Info, Loader2, ArrowRight, Recycle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileUpload } from "@/components/ui/file-upload";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";

const loadingStates = [
  { text: "Analyzing waste material" },
  { text: "Categorizing industrial waste" },
  { text: "Estimating B2B market value" },
  { text: "Calculating sustainability impact" },
  { text: "Matching potential buyers" },
  { text: "Generating professional listing" },
];

const SelectPills = ({ options, value, onChange }: { options: string[], value: string, onChange: (v: string) => void }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => (
      <button
        key={opt}
        type="button"
        onClick={() => onChange(opt)}
        className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${value === opt ? 'border-[#b200ff] bg-[#fdf5ff] text-[#b200ff]' : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'}`}
      >
        {opt}
      </button>
    ))}
  </div>
);

export default function CreateAd() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Step Management
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 State
  const [quantity, setQuantity] = useState("");
  const [province, setProvince] = useState("");
  const [unit, setUnit] = useState("kg");
  const [file, setFile] = useState<File | null>(null);
  const [isHazardous, setIsHazardous] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 State
  const [analyzedData, setAnalyzedData] = useState<any>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = (files: File[]) => {
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const analyzeMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/listings/analyze-and-create", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const payload = await res.json();
          throw new Error(payload.error || "Failed to analyze listing");
        }

        const message = await res.text();
        throw new Error(message || "Failed to analyze listing");
      }
      return res.json();
    },
    onSuccess: (res) => {
      const d = res.data;
      setAnalyzedData({
        title: d.title || "",
        description: d.description || "",
        category: d.category || "",
        framing: d.framing || "",
        quantity: d.quantity || quantity,
        unit: d.unit || unit,
        province: d.province || province,
        production: "",
        withdrawals_per_year: "",
        storage: "",
        image_url: d.image_url,
        material_type: d.material_type || "",
        estimated_value_per_unit: d.estimated_value_per_unit || "",
        total_estimated_value: d.total_estimated_value || "",
        sustainability_impact: d.sustainability_impact || {},
        potential_buyers: d.potential_buyers || [],
        isHazardous: d.isHazardous || false
      });
      setStep(2);
    },
    onError: (error) => {
      console.error("Error analyzing listing:", error);
      alert(error instanceof Error ? error.message : "Failed to analyze image. Please try again.");
    }
  });

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !quantity || !province) {
      alert("Please upload an image, enter quantity, and enter province.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("quantity", quantity);
    formData.append("province", province);
    formData.append("unit", unit);
    formData.append("isHazardous", isHazardous.toString());

    analyzeMutation.mutate(formData);
  };

  const submitFinalMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/listings/create-final", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const payload = await res.json();
          throw new Error(payload.error || "Failed to finalize listing");
        }

        const message = await res.text();
        throw new Error(message || "Failed to finalize listing");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      router.push("/listing");
    },
    onError: (error) => {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to save final listing.");
    }
  });

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFinalMutation.mutate(analyzedData);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />

      {/* AI Analysis Loading Overlay */}
      <Loader loadingStates={loadingStates} loading={analyzeMutation.isPending} duration={1500} />

      {step === 1 && (
        <main className="max-w-[700px] mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Intelligent Listing</h1>
          <p className="text-gray-500 mb-8">Upload a photo of your waste. Our AI will automatically categorize, value, and find matching buyers.</p>

          <form className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100" onSubmit={handleStep1Submit}>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Attach a photo of the material *
              </label>
              <div className="w-full relative">
                <FileUpload onChange={handleFileUpload} />

              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Quantity *</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="e.g. 500"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="bg-gray-50/50 border border-gray-100 rounded-lg py-6"
                    required
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-24 appearance-none bg-gray-50/50 border border-gray-100 rounded-lg py-3 px-4 outline-none text-gray-700"
                  >
                    <option value="kg">kg</option>
                    <option value="tons">tons</option>
                    <option value="units">units</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Location (Province) *</label>
                <Input
                  placeholder="e.g. Milan"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="bg-gray-50/50 border border-gray-100 rounded-lg py-6"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 p-4 bg-red-50/50 border border-red-100 rounded-lg cursor-pointer hover:bg-red-50 transition-colors">
                <input
                  type="checkbox"
                  checked={isHazardous}
                  onChange={(e) => setIsHazardous(e.target.checked)}
                  className="w-5 h-5 text-red-600 rounded border-red-300 focus:ring-red-500"
                />
                <span className="text-sm font-semibold text-red-900">
                  Mark as Hazardous Waste
                  <p className="text-xs font-normal text-red-700/80 mt-0.5">Check this if the material requires special administrative review (e.g., toxic, flammable).</p>
                </span>
              </label>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={analyzeMutation.isPending}
                className="w-full bg-[#b200ff] hover:bg-[#9a00dd] text-white rounded-lg font-semibold py-7 text-base tracking-wide flex justify-center items-center gap-2 transition-all"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>ANALYZING WITH AI...</span>
                  </>
                ) : (
                  <>
                    <span>AI AUTO-GENERATE & FORWARD</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </main>
      )}

      {step === 2 && (
        <main className="max-w-[760px] mx-auto px-6 py-12">
          <h1 className="text-[28px] font-bold text-gray-900 mb-10">Enter your ad</h1>

          <form className="space-y-10 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100" onSubmit={handleFinalSubmit}>

            {analyzedData.isHazardous && (
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                <img src="/hazerdous.jpg" title="Hazardous - Under Admin Review" alt="Hazardous" className="w-5 h-5 rounded object-cover shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-900">Hazardous Waste Detected</h4>
                  <p className="text-sm text-red-700 mt-1">This material has been flagged as hazardous. Upon creation, it will be marked "Under Admin Review" in the marketplace.</p>
                </div>
              </div>
            )}

            {/* Category */}
            <div className="space-y-3">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                Category of material *
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </label>
              <SelectPills
                options={["Paper and Cardboard", "Pre-consumer cosmetics", "Electronic Devices", "Sludge and Waste", "Pre-consumer Pharmaceuticals", "Rubber and Tires", "Wood", "Building Materials", "Metals", "Pre-consumer organic", "Stones and Inerts", "Plastic", "Chemical Substances", "Fabrics and Leather", "Glass"]}
                value={analyzedData.category}
                onChange={(v) => setAnalyzedData({ ...analyzedData, category: v })}
              />
            </div>

            {/* Title */}
            <div className="space-y-3">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                Title of the announcement *
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </label>
              <Input
                value={analyzedData.title}
                onChange={(e) => setAnalyzedData({ ...analyzedData, title: e.target.value })}
                placeholder="Give your ad a title (200 characters max)"
                className="bg-[#f5f5f5] border-transparent focus:border-[#b200ff] focus:ring-[#b200ff]/20 py-6"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                Describe the material best *
              </label>
              <textarea
                value={analyzedData.description}
                onChange={(e) => setAnalyzedData({ ...analyzedData, description: e.target.value })}
                placeholder="The material has these characteristics (...) contains 10% of (...) and 20% of (...) it can be used for (...)"
                className="w-full bg-[#f5f5f5] text-sm border-transparent focus:border-[#b200ff] rounded-lg p-4 outline-none focus:ring-4 focus:ring-[#b200ff]/10 transition-all min-h-[120px] resize-y"
                required
              />
            </div>

            {/* Photo Preview */}
            <div className="space-y-3">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                Attach a photo of the material
              </label>
              <div className="border border-dashed border-gray-300 bg-[#f5f5f5] rounded-xl flex flex-col items-center justify-center relative overflow-hidden h-32">
                {analyzedData.image_url ? (
                  <img src={analyzedData.image_url} alt="Material" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-gray-500 mb-2" />
                    <span className="text-sm text-gray-500">Increase visibility with a representative photo</span>
                  </>
                )}
              </div>
            </div>

            {/* Framework */}
            <div className="space-y-3">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                Current framework *
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </label>
              <SelectPills
                options={["Warehouse Leftover", "Former Food Product", "Materia Prima Seconda (EoW)", "Rejection", "By-product", "Animal Origin (SOA) by-product"]}
                value={analyzedData.framing}
                onChange={(v) => setAnalyzedData({ ...analyzedData, framing: v })}
              />
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                Quantity (kg) *
              </label>
              <Input
                value={analyzedData.quantity}
                onChange={(e) => setAnalyzedData({ ...analyzedData, quantity: e.target.value })}
                placeholder="kg"
                type="number"
                className="bg-[#f5f5f5] border-transparent focus:border-[#b200ff] py-6 w-full max-w-[300px]"
                required
              />
            </div>

            {/* Production & Withdrawals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                  Production *
                </label>
                <SelectPills
                  options={["Constant", "Seasonal", "One-off"]}
                  value={analyzedData.production}
                  onChange={(v) => setAnalyzedData({ ...analyzedData, production: v })}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                  Number of withdrawals in a year *
                </label>
                <Input
                  value={analyzedData.withdrawals_per_year}
                  onChange={(e) => setAnalyzedData({ ...analyzedData, withdrawals_per_year: e.target.value })}
                  placeholder='If single batch indicates "1"'
                  className="bg-[#f5f5f5] border-transparent focus:border-[#b200ff] py-6"
                />
              </div>
            </div>

            {/* Province */}
            <div className="space-y-3">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                Province of where the material is located *
              </label>
              <select
                value={analyzedData.province}
                onChange={(e) => setAnalyzedData({ ...analyzedData, province: e.target.value })}
                className="w-full bg-[#f5f5f5] border border-transparent rounded-lg py-4 px-4 outline-none text-gray-700 focus:border-[#b200ff] focus:ring-4 focus:ring-[#b200ff]/10"
              >
                <option value="">Select Province</option>
                <option value="Milan">Milan</option>
                <option value="Rome">Rome</option>
                <option value="Naples">Naples</option>
                <option value="Turin">Turin</option>
                {/* Dynamically allow whatever province came from AI */}
                {analyzedData.province && !['Milan', 'Rome', 'Naples', 'Turin'].includes(analyzedData.province) && (
                  <option value={analyzedData.province}>{analyzedData.province}</option>
                )}
              </select>
            </div>

            {/* Storage */}
            <div className="space-y-3">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                Storage *
              </label>
              <SelectPills
                options={["Big Bags", "Bins", "Metal box", "Urban cash registers", "Tank", "In Balle", "Octabin", "Pallet", "Carton box", "Paper box", "Bulk", "Loose in Cassone"]}
                value={analyzedData.storage}
                onChange={(v) => setAnalyzedData({ ...analyzedData, storage: v })}
              />
            </div>

            <div className="pt-8">
              <Button
                type="submit"
                disabled={submitFinalMutation.isPending}
                className="w-full bg-[#b200ff] hover:bg-[#9a00dd] text-white rounded-lg font-semibold py-7 text-base tracking-wide flex justify-center items-center gap-2"
              >
                {submitFinalMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>SAVING LISTING...</span>
                  </>
                ) : (
                  <>
                    <span>FORWARD</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>

          </form>
        </main>
      )}

    </div>
  );
}
