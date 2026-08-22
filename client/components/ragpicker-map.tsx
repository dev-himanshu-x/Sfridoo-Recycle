"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with Next.js (though we'll use custom ones mostly)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Icons
const createCustomIcon = (color: string, iconClass: string) => {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        border: 2px solid white;
      ">
        <i class="lucide ${iconClass}" style="width: 16px; height: 16px;"></i>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

const hubIcon = L.divIcon({
  className: "custom-hub-icon",
  html: `
    <div style="
      background-color: #1C1F2A;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      border: 2px solid white;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

const ragpickerActiveIcon = L.divIcon({
  className: "custom-rp-icon",
  html: `
    <div style="
      background-color: #10b981;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      border: 2px solid white;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});


// Mock Data (New Delhi)
const CENTER: [number, number] = [28.6139, 77.2090];

const HUBS = [
  { id: "h1", name: "Connaught Place Hub", position: [28.6315, 77.2167] as [number, number], capacity: "85%" },
  { id: "h2", name: "South Ex Collection Spot", position: [28.5684, 77.2201] as [number, number], capacity: "40%" },
  { id: "h3", name: "Dwarka Processing Center", position: [28.5823, 77.0500] as [number, number], capacity: "60%" },
];

const RAGPICKERS = [
  { id: "r1", name: "Raj Kumar", position: [28.6250, 77.2100] as [number, number], status: "Active", load: "12kg", assignedHub: "h1" },
  { id: "r2", name: "Sunita Devi", position: [28.5750, 77.2150] as [number, number], status: "Active", load: "8kg", assignedHub: "h2" },
  { id: "r3", name: "Amit Singh", position: [28.5900, 77.0600] as [number, number], status: "Active", load: "25kg", assignedHub: "h3" },
  { id: "r4", name: "Priya Sharma", position: [28.6400, 77.2000] as [number, number], status: "Active", load: "5kg", assignedHub: "h1" },
  { id: "r5", name: "Mohammad Ali", position: [28.5600, 77.2300] as [number, number], status: "Active", load: "18kg", assignedHub: "h2" },
];

export default function RagpickerMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">Loading Map...</div>;
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 z-0 relative">
      <MapContainer 
        center={CENTER} 
        zoom={12} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        {/* Minimalist CartoDB Positron TileLayer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Draw AI Connections (Polylines) */}
        {RAGPICKERS.map((rp) => {
          const hub = HUBS.find((h) => h.id === rp.assignedHub);
          if (!hub) return null;
          return (
            <Polyline
              key={`line-${rp.id}`}
              positions={[rp.position, hub.position]}
              color="#10b981"
              weight={2}
              opacity={0.4}
              dashArray="5, 10"
            />
          );
        })}

        {/* Render Hubs */}
        {HUBS.map((hub) => (
          <Marker key={hub.id} position={hub.position} icon={hubIcon}>
            <Popup className="custom-popup">
              <div className="p-1">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{hub.name}</h3>
                <p className="text-xs text-gray-500 mb-2">Collection Spot</p>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Capacity</span>
                  <span className="text-xs font-semibold text-gray-800">{hub.capacity}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Ragpickers */}
        {RAGPICKERS.map((rp) => (
          <Marker key={rp.id} position={rp.position} icon={ragpickerActiveIcon}>
            <Popup className="custom-popup">
              <div className="p-1 min-w-[120px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <h3 className="font-semibold text-gray-900 text-sm">{rp.name}</h3>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Current Load</span>
                    <span className="text-xs font-medium text-gray-900">{rp.load}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Status</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">{rp.status}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Custom CSS for Leaflet popups moved to globals.css */}
    </div>
  );
}
