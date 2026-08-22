"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Recycle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-20">
      <Link href="/" className="flex items-center gap-2">
        <Recycle className="w-6 h-6 text-green-600" />
        <span className="text-xl font-bold tracking-tight text-gray-900">Sfridoo</span>
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link
          href="/listing"
          className={`hover:text-gray-900 transition-colors ${
            pathname === "/listing" ? "text-gray-900 font-semibold" : ""
          }`}
        >
          Marketplace
        </Link>
        <Link
          href="/demand"
          className={`hover:text-gray-900 transition-colors ${
            pathname === "/demand" ? "text-gray-900 font-semibold" : ""
          }`}
        >
          Material Requests
        </Link>
        <Link
          href="/supply-chains"
          className={`hover:text-gray-900 transition-colors ${
            pathname === "/supply-chains" || pathname === "/supply-chains/[id]" ? "text-gray-900 font-semibold" : ""
          }`}
        >
          Supply Chains
        </Link>
        <Link
          href="/ragpicker-network"
          className={`hover:text-gray-900 transition-colors ${
            pathname === "/ragpicker-network" ? "text-gray-900 font-semibold" : ""
          }`}
        >
          Collection Network
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/create">
          <Button className="bg-[#1C1F2A] hover:bg-[#2A2E3D] text-white rounded-md p-3">
            Sell Materials
          </Button>
        </Link>
      </div>
    </header>
  );
}
