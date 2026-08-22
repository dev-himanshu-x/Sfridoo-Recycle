"use client";

import { useMemo, useState } from "react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ChevronDown,
  X,
  LayoutGrid,
  List,
  Recycle,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

/* ----- types ----- */
interface Listing {
  _id: string;
  title: string;
  category: string;
  material_type: string;
  framing: string;
  quantity: number;
  unit: string;
  estimated_value_per_unit: string;
  total_estimated_value: string;
  province: string;
  image_url: string;
  status: string;
}

type ViewMode = "table" | "card";

/* ----- filter keys ----- */
const FILTER_KEYS = [
  { key: "category", label: "CATEGORY" },
  { key: "framing", label: "CLASSIFICATION" },
  { key: "province", label: "PROVINCE" },
  { key: "material_type", label: "MATERIALS" },
] as const;

type FilterKey = (typeof FILTER_KEYS)[number]["key"];

export default function Home() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<FilterKey, string | null>>({
    category: null,
    framing: null,
    province: null,
    material_type: null,
  });
  const [openDropdown, setOpenDropdown] = useState<FilterKey | null>(null);

  const { data: tableData = [], isLoading } = useQuery<Listing[]>({
    queryKey: ["listings"],
    queryFn: async () => {
      const res = await fetch("/api/listings");
      if (!res.ok) throw new Error("Failed to fetch listings");
      return res.json();
    },
  });

  /* ----- derive unique values for each filter ----- */
  const filterOptions = useMemo(() => {
    const opts: Record<FilterKey, string[]> = {
      category: [],
      framing: [],
      province: [],
      material_type: [],
    };
    tableData.forEach((row) => {
      FILTER_KEYS.forEach(({ key }) => {
        const val = row[key];
        if (val && !opts[key].includes(val)) opts[key].push(val);
      });
    });
    return opts;
  }, [tableData]);

  /* ----- filter + search ----- */
  const filteredData = useMemo(() => {
    let rows = tableData;
    // apply dropdown filters
    (Object.entries(activeFilters) as [FilterKey, string | null][]).forEach(
      ([key, value]) => {
        if (value) rows = rows.filter((r) => r[key] === value);
      }
    );
    // apply search
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.category?.toLowerCase().includes(q) ||
          r.material_type?.toLowerCase().includes(q) ||
          r.province?.toLowerCase().includes(q) ||
          r.framing?.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [tableData, activeFilters, search]);

  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  const toggleFilter = (key: FilterKey, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
    setOpenDropdown(null);
  };

  const clearFilters = () => {
    setActiveFilters({ category: null, framing: null, province: null, material_type: null });
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder='Search here for "15 01 06", or Packaging, Coffee, Iron, ABS Plastic,...'
            className="pl-12 py-6 bg-gray-50 border-none text-base rounded-xl focus-visible:ring-[#b200ff]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters + View Toggle */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {FILTER_KEYS.map(({ key, label }) => (
            <div key={key} className="relative">
              <Button
                variant="outline"
                className={`border-gray-200 font-normal px-4 h-10 rounded-lg ${activeFilters[key] ? "bg-[#1C1F2A] text-white border-[#1C1F2A] hover:bg-[#2A2E3D] hover:text-white" : "text-gray-700"}`}
                onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
              >
                {activeFilters[key] || label}
                {activeFilters[key] ? (
                  <X
                    className="ml-2 h-3.5 w-3.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFilters((prev) => ({ ...prev, [key]: null }));
                    }}
                  />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                )}
              </Button>

              {/* Dropdown */}
              {openDropdown === key && filterOptions[key].length > 0 && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[180px] max-h-[240px] overflow-y-auto py-1">
                  {filterOptions[key].map((option) => (
                    <button
                      key={option}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${activeFilters[key] === option ? "bg-gray-100 font-medium" : "text-gray-700"}`}
                      onClick={() => toggleFilter(key, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {hasActiveFilters && (
            <Button variant="ghost" className="text-red-500 hover:text-red-600 h-10 px-3" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" /> Clear all
            </Button>
          )}

          {/* View Toggle */}
          <div className="ml-auto flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              className={`p-2 rounded-md transition-colors ${viewMode === "table" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
              onClick={() => setViewMode("table")}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded-md transition-colors ${viewMode === "card" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
              onClick={() => setViewMode("card")}
              aria-label="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          {filteredData.length} listing{filteredData.length !== 1 ? "s" : ""} found
          {hasActiveFilters || search ? " (filtered)" : ""}
        </p>

        {/* ===== TABLE VIEW ===== */}
        {viewMode === "table" && (
          <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-[0_0_15px_rgba(0,0,0,0.02)]">
            <Table>
              <TableHeader className="bg-white">
                <TableRow className="border-b-gray-100 hover:bg-transparent">
                  <TableHead className="font-semibold text-gray-500 py-4 w-[30%]">Name of the Resource</TableHead>
                  <TableHead className="font-semibold text-gray-500 py-4">Category</TableHead>
                  <TableHead className="font-semibold text-gray-500 py-4">Framing</TableHead>
                  <TableHead className="font-semibold text-gray-500 py-4">Est. Value/Unit</TableHead>
                  <TableHead className="font-semibold text-gray-500 py-4 text-right">Quantity (kg)</TableHead>
                  <TableHead className="font-semibold text-gray-500 py-4">Province</TableHead>
                  <TableHead className="font-semibold text-gray-500 py-4">Photo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-gray-500">Loading listings...</TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-gray-500">No listings found.</TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row) => (
                    <TableRow
                      key={row._id}
                      onClick={() => router.push(`/product/${row._id}`)}
                      className="border-b-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    >
                      <TableCell className="font-medium text-gray-900 py-5">
                        <div className="flex items-center gap-2">
                          {row.title}
                          {row.isHazardous && (
                            <img src="/hazerdous.jpg" title="Hazardous - Under Admin Review" alt="Hazardous" className="w-5 h-5 rounded object-cover shrink-0" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#f5f5f5] text-gray-700 border border-transparent whitespace-nowrap">
                          {row.category || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border truncate max-w-[250px] ${
                            (row.framing || "").includes("Leftover")
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : (row.framing || "").includes("Materia Prima")
                                ? "bg-pink-50 text-pink-700 border-pink-100"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {row.framing || "Unclassified"}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">{row.estimated_value_per_unit || "TBD"}</TableCell>
                      <TableCell className="text-right font-medium text-gray-700 whitespace-nowrap">{row.quantity}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">
                          {row.province}
                        </span>
                      </TableCell>
                      <TableCell>
                        {row.image_url ? (
                          <div className="h-10 w-10 relative rounded-lg overflow-hidden border border-gray-100">
                            <img src={row.image_url} alt="Material" className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#f8f5f8] text-gray-600 text-xs font-medium border border-gray-100">
                            No Img
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* ===== CARD VIEW (Horizontal List Layout) ===== */}
        {viewMode === "card" && (
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center text-gray-500 py-12">Loading listings...</p>
            ) : filteredData.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No listings found.</p>
            ) : (
              filteredData.map((row) => (
                <div
                  key={row._id}
                  onClick={() => router.push(`/product/${row._id}`)}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col md:flex-row group"
                >
                  {/* Left: Image */}
                  <div className="w-full md:w-[320px] h-56 md:h-auto shrink-0 bg-gray-50 relative overflow-hidden">
                    {row.image_url ? (
                      <img
                        src={row.image_url}
                        alt={row.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Recycle className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* Middle: Details */}
                  <div className="flex-1 p-6 flex flex-col justify-center border-r border-gray-50">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-xl leading-tight line-clamp-1">{row.title}</h3>
                      {row.isHazardous && (
                        <img src="/hazerdous.jpg" title="Hazardous - Under Admin Review" alt="Hazardous" className="w-5 h-5 rounded object-cover shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-5 font-medium">by <span className="text-gray-900">{row.category || "Uncategorized"}</span> in {row.province}</p>
                    
                    <ul className="space-y-2.5">
                      <li className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                        <span className="font-medium text-gray-700">Material Type:</span> {row.material_type || "N/A"}
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                        <span className="font-medium text-gray-700">Framing:</span> <span className="truncate max-w-[250px]">{row.framing || "N/A"}</span>
                      </li>
                      {row.sustainability_impact?.co2_saved_kg ? (
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="w-1 h-1 rounded-full bg-green-500 shrink-0" />
                          <span className="font-medium text-gray-700">CO2 Saved:</span> {row.sustainability_impact.co2_saved_kg} kg
                        </li>
                      ) : (
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                          <span className="font-medium text-gray-700">Quantity:</span> {row.quantity} kg
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Right: Price & CTA */}
                  <div className="w-full md:w-[240px] shrink-0 p-6 flex flex-col justify-center items-center bg-gray-50/30">
                    <div className="text-center mb-6">
                      <p className="text-3xl font-bold text-gray-900">{row.estimated_value_per_unit || "TBD"}</p>
                      <p className="text-xs text-gray-400 mt-2">{row.quantity} kg available</p>
                    </div>
                    <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#b200ff] hover:border-[#b200ff] bg-white transition-colors">
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-12 bg-[#b8f38d] rounded-2xl p-12 text-center relative overflow-hidden">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Enhance your scrap on Sfridoo now</h2>
          <p className="text-gray-700 mb-8 max-w-xl mx-auto">
            Create your ad in just a few clicks and enhance!
          </p>
          <Link href="/create">
            <Button className="bg-[#b200ff] hover:bg-[#9a00dd] text-white rounded-md font-semibold px-8 py-6 text-base tracking-wide">
              Sell Materials
            </Button>
          </Link>
        </div>
      </main>

      {/* App Fab */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-[#ba16ff] text-white rounded-full p-3 shadow-lg hover:bg-[#9a00dd] transition-colors flex flex-col items-center justify-center h-16 w-16 group">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
          <span className="text-[7.5px] font-bold uppercase tracking-widest leading-tight text-center">Scarica<br />App</span>
        </button>
      </div>
    </div>
  );
}
