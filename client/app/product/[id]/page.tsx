"use client";

import { useEffect, useState, type ReactNode } from "react";
import Header from "@/components/header";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Send, AlertCircle, Recycle } from "lucide-react";
import Link from "next/link";

interface SustainabilityImpact {
  co2_saved_kg: number;
  water_saved_liters: number;
  trees_equivalent: number;
}

interface Listing {
  _id: string;
  title: string;
  description: string;
  category: string;
  material_type: string;
  framing: string;
  quantity: number;
  unit: string;
  estimated_value_per_unit: string;
  total_estimated_value: string;
  province: string;
  production: string;
  withdrawals_per_year: string;
  storage: string;
  sustainability_impact: SustainabilityImpact;
  potential_buyers: string[];
  image_url: string;
  status: string;
  createdAt: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5001";

async function loadRazorpayScript() {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function ProductPage() {
  const params = useParams<{ id?: string }>();
  const listingId = params?.id;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!listingId) return;
        const response = await fetch(`/api/listings/${listingId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch listing");
        }
        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-6xl mt-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto p-4 max-w-6xl mt-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error: {error || "Listing not found"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleBuyWhole = async () => {
    setPayError(null);
    setIsPaying(true);

    try {
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Failed to load Razorpay checkout");

      const response = await fetch(`${backendBaseUrl}/api/payments/razorpay/order`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ listingId: listing._id }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment order");
      }

      const data = await response.json();
      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Sfridoo",
        description: listing.title,
        order_id: data.order.id,
        handler: async (payment: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; }) => {
          const verifyResponse = await fetch(`${backendBaseUrl}/api/payments/razorpay/verify`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              orderId: payment.razorpay_order_id,
              paymentId: payment.razorpay_payment_id,
              signature: payment.razorpay_signature,
              listingId: listing._id,
            }),
          });

          if (verifyResponse.ok) {
            setListing((prev) => (prev ? { ...prev, status: "sold" } : prev));
          }
        },
        prefill: {},
        theme: { color: "#7c3aed" },
      };

      if (!window.Razorpay) throw new Error("Razorpay is unavailable");
      const checkout = new window.Razorpay(options);
      checkout.open();
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setIsPaying(false);
    }
  };

  const createdDate = new Date(listing.createdAt).toLocaleDateString("en-US");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="container mx-auto p-4 max-w-6xl mt-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {listing.isHazardous && (
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                <img src="/hazerdous.jpg" title="Hazardous - Under Admin Review" alt="Hazardous" className="w-6 h-6 rounded object-cover shrink-0" />
                <div>
                  <h4 className="text-base font-bold text-red-900">Hazardous Material - Admin Review Pending</h4>
                  <p className="text-sm text-red-700 mt-0.5">This material requires special handling and administrative review before transaction can be authorized.</p>
                </div>
              </div>
            )}
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Cover Image */}
                  <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    {listing.image_url ? (
                      <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">
                        {listing.title || "-"}
                      </h1>
                      <p className="text-gray-600 mt-1">{listing.description || "-"}</p>
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                      {listing.category || "Uncategorized"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0 divide-y divide-gray-100">
                <DetailRow label="Category" value={<Badge variant="secondary">{listing.category || "-"}</Badge>} />
                <DetailRow label="Province" value={listing.province || "-"} tooltip />
                <DetailRow label="Material Type" value={listing.material_type || "-"} tooltip />
                <DetailRow label="Framing" value={listing.framing || "-"} tooltip />
                <DetailRow
                  label="Quantity"
                  value={listing.quantity ? `${listing.quantity.toLocaleString()} ${listing.unit || 'kg'}` : "-"}
                />
                <DetailRow label="Production" value={listing.production || "-"} />
                <DetailRow label="Storage" value={listing.storage || "-"} />
                <DetailRow label="Description" value={listing.description || "-"} />
                <DetailRow label="Status" value={listing.status || "-"} />
                <DetailRow label="Posted Date" value={createdDate} tooltip />
              </CardContent>
            </Card>

            {listing.sustainability_impact && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sustainability Impact</CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-gray-100">
                  <DetailRow label="CO2 Saved" value={listing.sustainability_impact.co2_saved_kg ? `${listing.sustainability_impact.co2_saved_kg} kg` : "-"} />
                  <DetailRow label="Water Saved" value={listing.sustainability_impact.water_saved_liters ? `${listing.sustainability_impact.water_saved_liters} L` : "-"} />
                  <DetailRow label="Trees Equivalent" value={listing.sustainability_impact.trees_equivalent || "-"} />
                </CardContent>
              </Card>
            )}

            {listing.potential_buyers && listing.potential_buyers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Potential Buyers</CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-gray-100">
                  <div className="p-4 flex flex-wrap gap-2">
                    {listing.potential_buyers.map((buyer, idx) => (
                      <Badge key={idx} variant="outline">
                        {buyer}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Commercial Information</CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-gray-100">
                <DetailRow vertical label="Transaction Type" value={<Badge className="bg-blue-100 text-blue-900 hover:bg-blue-200">Sell</Badge>} />
                <DetailRow vertical label="Estimated Value / Unit" value={listing.estimated_value_per_unit || "-"} />
                <DetailRow vertical label="Total Estimated Value" value={listing.total_estimated_value || "-"} />
                <DetailRow vertical label="Quantity" value={listing.quantity ? `${listing.quantity.toLocaleString()} ${listing.unit || 'kg'}` : "-"} />
                <DetailRow vertical label="Withdrawals / Year" value={listing.withdrawals_per_year || "-"} />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                className="w-full bg-[#1b2e1a] hover:bg-[#121f11] text-white flex items-center justify-center gap-2 h-12 text-lg font-semibold rounded-xl"
                onClick={handleBuyWhole}
                disabled={isPaying}
              >
                Buy
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-12 text-lg font-semibold rounded-xl border-gray-200 text-gray-700">
                <AlertCircle className="w-5 h-5" />
                Contact Seller
              </Button>
              {payError ? (
                <p className="text-sm text-red-600">{payError}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, tooltip, vertical }: { label: string; value: ReactNode; tooltip?: boolean; vertical?: boolean }) {
  return (
    <div className={`p-4 flex ${vertical ? 'flex-col gap-1' : 'flex-col sm:flex-row sm:items-start gap-4'}`}>
      <div className={`${vertical ? 'w-full' : 'w-full sm:w-1/3'} flex items-center gap-2 shrink-0`}>
        <span className="font-semibold text-gray-700">{label}</span>
        {tooltip && <Info className="w-4 h-4 text-gray-400" />}
      </div>
      <div className="text-gray-800 font-medium flex-1">{value}</div>
    </div>
  );
}
