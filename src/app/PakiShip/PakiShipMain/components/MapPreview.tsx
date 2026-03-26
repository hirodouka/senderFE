import { useState, useEffect } from "react";
import { MapPin, Navigation, Phone, User, Clock, Package } from "lucide-react";

interface MapPreviewProps {
  pickupAddress: string;
  deliveryAddress: string;
  driverName?: string;
  driverPhone?: string;
  estimatedTime?: string;
  trackingNumber?: string;
  showDriverInfo?: boolean;
  isDriverView?: boolean;
  onETAUpdate?: (eta: string, distance: string) => void;
}

export default function MapPreview({
  pickupAddress,
  deliveryAddress,
  driverName = "Juan Dela Cruz",
  driverPhone = "+63 912 345 6789",
  estimatedTime = "25 mins",
  trackingNumber,
  showDriverInfo = false,
  isDriverView = false,
  onETAUpdate,
}: MapPreviewProps) {
  const [driverProgress, setDriverProgress] = useState(isDriverView ? 15 : 30);
  const [liveETA, setLiveETA] = useState(estimatedTime);
  const [liveDistance, setLiveDistance] = useState("12.5 km");

  // Simulate real-time driver movement
  useEffect(() => {
    if (showDriverInfo || isDriverView) {
      const interval = setInterval(() => {
        setDriverProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + (isDriverView ? 1.5 : 3);
        });

        setLiveDistance((prev) => {
          const km = parseFloat(prev);
          const newKm = Math.max(0.1, km - 0.2);
          return `${newKm.toFixed(1)} km`;
        });

        setLiveETA((prev) => {
          const match = prev.match(/(\d+)/);
          if (!match) return prev;
          const mins = parseInt(match[1]);
          const newMins = Math.max(1, mins - 1);
          return `${newMins} mins`;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [showDriverInfo, isDriverView]);

  useEffect(() => {
    if (onETAUpdate && isDriverView) {
      onETAUpdate(liveETA, liveDistance);
    }
  }, [liveETA, liveDistance, onETAUpdate, isDriverView]);

  const t = driverProgress / 100;
  const driverPathX = (1 - t) * (1 - t) * 15 + 2 * (1 - t) * t * 50 + t * t * 85;
  const driverPathY = (1 - t) * (1 - t) * 20 + 2 * (1 - t) * t * 50 + t * t * 45;

  return (
    <div className="relative w-full h-full min-h-[450px] md:min-h-[500px] bg-[#F1F5F9] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden font-sans border border-slate-200">
      {/* Map Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.15]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A5D56" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGrid)" />
          </svg>
        </div>

        {/* Road overlay */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#1A5D56" />
            </linearGradient>
          </defs>
          <path d="M 15 20 Q 50 50 85 45" stroke="#CBD5E0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {(showDriverInfo || isDriverView) && (
            <path
              d="M 15 20 Q 50 50 85 45"
              stroke="url(#routeGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset={200 - (driverProgress * 2)}
              className="transition-all duration-1000 ease-linear"
            />
          )}
          {(showDriverInfo || isDriverView) && (
            <g className="transition-all duration-1000 ease-linear">
              <circle cx={driverPathX} cy={driverPathY} r="2.5" fill="white" className="drop-shadow-md" />
              <circle cx={driverPathX} cy={driverPathY} r="1.5" fill="#38BDF8" />
            </g>
          )}
        </svg>

        {/* Markers */}
        <div className="absolute top-[20%] left-[15%] -translate-x-1/2 -translate-y-1/2 scale-75 md:scale-100">
          <div className="flex flex-col items-center">
             <div className="bg-white p-1 rounded-lg shadow-sm mb-1"><span className="text-[8px] font-bold text-slate-500 uppercase">Pickup</span></div>
             <div className="w-8 h-8 bg-[#38BDF8] rounded-full flex items-center justify-center shadow-lg border-2 border-white"><MapPin className="w-4 h-4 text-white" /></div>
          </div>
        </div>
        <div className="absolute top-[45%] left-[85%] -translate-x-1/2 -translate-y-1/2 scale-75 md:scale-100">
          <div className="flex flex-col items-center">
             <div className="bg-white p-1 rounded-lg shadow-sm mb-1"><span className="text-[8px] font-bold text-[#1A5D56] uppercase">Delivery</span></div>
             <div className="w-8 h-8 bg-[#1A5D56] rounded-full flex items-center justify-center shadow-lg border-2 border-white"><MapPin className="w-4 h-4 text-white" /></div>
          </div>
        </div>
      </div>

      

      {/* Driver Info Card - Mobile Optimized */}
      {showDriverInfo && !isDriverView && (
        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-white/95 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl p-4 md:p-7 border border-white animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center justify-between mb-4 md:mb-10">
            <div className="flex items-center gap-3 md:gap-5">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-[#F0F9F8] flex items-center justify-center border border-[#38BDF8]/20 shrink-0">
                <User className="w-6 h-6 md:w-8 md:h-8 text-[#1A5D56]" />
              </div>
              <div>
                <div className="font-black text-[#1A5D56] text-base md:text-xl tracking-tight">{driverName}</div>
                <div className="flex items-center gap-1.5">
                   <span className="text-[8px] md:text-xs font-bold text-slate-400 uppercase">Courier</span>
                   <span className="text-[8px] md:text-xs font-black text-[#38BDF8]">4.9 ★</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mascot Progress Bar */}
          <div className="relative mb-3 mt-10 md:mt-16 px-1">
            <div
              className="absolute transition-all duration-1000 ease-linear z-10"
              style={{
                left: `clamp(0px, calc(${driverProgress}% - 35px), calc(100% - 45px))`,
                bottom: "100%",
                marginBottom: "-12px",
              }}
            >
              <img
                src="https://i.imgur.com/JCkCd6c.png"
                alt="Mascot"
                className="w-10 h-10 md:w-16 md:h-16 object-contain drop-shadow-md"
              />
            </div>
            <div className="w-full h-3 md:h-5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner relative z-20">
              <div
                className="h-full bg-gradient-to-r from-[#38BDF8] to-[#1A5D56] rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${driverProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-[8px] md:text-[10px] font-black text-gray-400 uppercase">
              <span>Picked Up</span>
              <span className="text-[#38BDF8]">{Math.round(driverProgress)}%</span>
              <span>Delivered</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 text-slate-500 bg-slate-50 rounded-xl p-3 md:p-4 border border-slate-100">
            <Navigation className="w-4 h-4 md:w-5 md:h-5 text-[#38BDF8] shrink-0" />
            <p className="text-[10px] md:text-sm font-bold leading-tight">
              {driverProgress < 100 
                ? `Rider is ${liveDistance} away.`
                : "Rider has arrived!"}
            </p>
          </div>
        </div>
      )}

      {/* Attribution */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-30 text-[7px] md:text-[9px] font-black text-[#1A5D56] uppercase tracking-[0.2em] md:tracking-[0.4em] whitespace-nowrap">
        PakiShip Secure Logistics
      </div>
    </div>
  );
}