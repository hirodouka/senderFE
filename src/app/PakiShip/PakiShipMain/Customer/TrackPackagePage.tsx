import { useState } from "react";
import {
  Search,
  Package,
  Phone,
  MapPin,
  Clock,
  Loader2,
  AlertCircle,
  XCircle,
  PhoneOff,
  User,
  Smartphone,
  Map as MapIcon,
  ListTree
} from "lucide-react";
import { useNavigate } from "react-router";
import { CustomerPageHeader } from "../components/CustomerPageHeader";
import MapPreview from "../components/MapPreview";
import logoImg from "@/assets/d0a94c34a139434e20f5cb9888d8909dd214b9e7.png";

const allDeliveries = [
  { id: "PKS-2024-001", location: "Makati City", time: "15 mins away", status: "In Transit" },
  { id: "PKS-2024-002", location: "Quezon City", time: "30 mins away", status: "Out for Delivery" },
  { id: "PKS-2024-003", location: "BGC, Taguig", time: "1 hour away", status: "In Transit" },
  { id: "PKS-2024-007", location: "Pasig City", time: "2 hours away", status: "Picked Up" },
  { id: "PKS-2024-008", location: "Mandaluyong", time: "45 mins away", status: "Out for Delivery" },
  { id: "PKS-2024-009", location: "Manila", time: "20 mins away", status: "In Transit" },
];

export function TrackPackagePage() {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [activeTab, setActiveTab] = useState<"timeline" | "map">("timeline");

  const fetchTrackingData = async (id: string) => {
    setIsSearching(true);
    setError(null);
    setTrackingResult(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundParcel = allDeliveries.find(
      (p) => p.id.toLowerCase() === id.trim().toLowerCase()
    );

    if (!foundParcel) {
      setError("Parcel Not Found: Check the number and try again.");
      setIsSearching(false);
      return;
    }

    const detailedData = {
      trackingNumber: foundParcel.id,
      status: foundParcel.status,
      origin: "PakiShip Central Hub",
      destination: foundParcel.location,
      estimatedDelivery: foundParcel.time === "Pending" ? "Calculating..." : foundParcel.time,
      driver: {
        name: "Pedro Reyes",
        phone: "+63 912 345 6789",
        vehicleType: "Motorcycle",
        plateNumber: "ABC 1234",
      },
      timeline: [
        { status: "Package Received", location: "PakiShip Hub - Manila", timestamp: "08:30 AM", completed: true },
        { status: "Picked Up", location: "Sorted at Facility", timestamp: "10:15 AM", completed: foundParcel.status !== "Picked Up" },
        { status: "In Transit", location: "En route to destination", timestamp: "01:45 PM", completed: ["In Transit", "Out for Delivery"].includes(foundParcel.status) },
        { status: "Out for Delivery", location: foundParcel.location, timestamp: "Active", completed: foundParcel.status === "Out for Delivery" },
      ],
    };

    setTrackingResult(detailedData);
    setIsSearching(false);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) fetchTrackingData(trackingNumber);
  };

  return (
    <div className="h-screen max-h-screen bg-[#F0F9F8] flex flex-col overflow-hidden font-sans select-none">
      <CustomerPageHeader
        title="Track Parcel"
        subtitle="Real-time delivery updates"
        icon={Package}
        logo={logoImg}
        onBack={() => navigate("/customer/home")}
      />

      <main className="flex-1 flex flex-col min-h-0 px-4 py-4 sm:px-6">
        <div className="max-w-4xl w-full mx-auto flex flex-col h-full space-y-4">
          
          {/* Search Box - Static */}
          <form onSubmit={handleTrack} className="shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-[#39B5A8]/10 p-2 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A5D56]/40" />
                <input
                  type="text"
                  placeholder="Enter Tracking ID..."
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full pl-10 h-11 text-sm rounded-xl border-none bg-slate-50 focus:ring-2 focus:ring-[#39B5A8]/20 font-bold"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !trackingNumber}
                className="h-11 px-6 bg-[#39B5A8] text-white rounded-xl font-bold shadow-md active:scale-95 transition-all flex items-center justify-center"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track"}
              </button>
            </div>
            {error && (
              <div className="mt-2 bg-red-50 border border-red-100 p-2 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <p className="text-[10px] font-bold text-red-700 truncate">{error}</p>
              </div>
            )}
          </form>

          {trackingResult ? (
            <div className="flex-1 flex flex-col min-h-0 space-y-4 animate-in fade-in slide-in-from-bottom-4">
              
              {/* Info Header - Shrinkable */}
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#39B5A8]/10 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{trackingResult.trackingNumber}</h2>
                  <div className="bg-[#F0F9F8] px-2 py-0.5 rounded-full border border-[#39B5A8]/20 text-[9px] font-bold text-[#39B5A8]">
                    ETA: {trackingResult.estimatedDelivery}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#39B5A8]/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-[#39B5A8]" />
                  </div>
                  <h3 className="text-base font-black text-[#1A5D56]">{trackingResult.status}</h3>
                </div>
              </div>

              {/* Mobile Tab Switcher - Shrinkable */}
              <div className="lg:hidden flex bg-white/50 p-1 rounded-2xl border border-[#39B5A8]/10 shrink-0">
                <button
                  onClick={() => setActiveTab("timeline")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                    activeTab === "timeline" ? "bg-white text-[#39B5A8] shadow-sm" : "text-slate-400"
                  }`}
                >
                  <ListTree size={14} /> Timeline
                </button>
                <button
                  onClick={() => setActiveTab("map")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                    activeTab === "map" ? "bg-white text-[#39B5A8] shadow-sm" : "text-slate-400"
                  }`}
                >
                  <MapIcon size={14} /> Live Map
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Timeline Section */}
                <div className={`${activeTab !== "timeline" ? "hidden lg:flex" : "flex"} flex-col bg-white rounded-3xl border border-[#39B5A8]/10 overflow-hidden`}>
                  <div className="p-4 border-b border-slate-50 shrink-0">
                    <h4 className="text-[10px] font-black text-[#1A5D56] uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} className="text-[#39B5A8]" /> Status History
                    </h4>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {trackingResult.timeline.map((event: any, i: number) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                            event.completed ? "bg-[#39B5A8] text-white" : "bg-slate-100 text-slate-300"
                          }`}>
                            {event.completed ? "✓" : i + 1}
                          </div>
                          {i < trackingResult.timeline.length - 1 && (
                            <div className={`w-0.5 h-10 ${event.completed ? "bg-[#39B5A8]" : "bg-slate-100"}`} />
                          )}
                        </div>
                        <div className="flex-1 pb-6 min-w-0">
                          <p className={`text-xs font-black truncate ${event.completed ? "text-[#1A5D56]" : "text-slate-300"}`}>{event.status}</p>
                          <p className="text-[10px] text-slate-500 font-medium truncate">{event.location}</p>
                          <p className="text-[9px] font-bold text-[#39B5A8] mt-0.5">{event.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Section */}
                <div className={`${activeTab !== "map" ? "hidden lg:block" : "block"} bg-white rounded-3xl overflow-hidden border border-[#39B5A8]/10 h-full`}>
                  <MapPreview
                    pickupAddress={trackingResult.origin}
                    deliveryAddress={trackingResult.destination}
                    driverName={trackingResult.driver.name}
                    driverPhone={trackingResult.driver.phone}
                    trackingNumber={trackingResult.trackingNumber}
                    showDriverInfo={false}
                  />
                </div>
              </div>

              {/* Driver Card - Static at Bottom */}
              <div className="bg-[#1A5D56] rounded-3xl p-4 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[8px] font-black text-[#39B5A8] uppercase tracking-[0.2em] mb-0.5">Assigned Rider</p>
                  <h4 className="text-base font-black">{trackingResult.driver.name}</h4>
                  <p className="text-[10px] text-white/60">{trackingResult.driver.vehicleType} • {trackingResult.driver.plateNumber}</p>
                </div>
                <button 
                  onClick={() => setIsCalling(true)}
                  className="relative z-10 w-11 h-11 bg-[#39B5A8] rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
                >
                  <Phone size={18} />
                </button>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[2.5rem] p-10 text-center border border-[#39B5A8]/5">
              <div className="w-16 h-16 bg-[#F0F9F8] rounded-full flex items-center justify-center mb-4">
                <Package className="text-[#39B5A8]" size={32} />
              </div>
              <h3 className="font-black text-[#1A5D56]">Ready to track?</h3>
              <p className="text-xs text-slate-400 mt-1">Enter your ID to see live progress.</p>
            </div>
          )}
        </div>
      </main>

      {/* Calling Modal - Overlay */}
      {isCalling && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1A5D56]/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xs p-8 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-[#39B5A8] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
              <Phone size={28} className="text-white" />
            </div>
            <h3 className="text-lg font-black text-[#1A5D56]">Calling {trackingResult?.driver.name}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 mb-8">Connecting...</p>
            <button
              onClick={() => setIsCalling(false)}
              className="w-full h-12 bg-red-500 text-white rounded-xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <PhoneOff size={18} /> End Call
            </button>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}