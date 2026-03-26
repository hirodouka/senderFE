import { Zap, Clock, Truck, Users, Package, AlertCircle, TrendingUp, MapPin, ShieldCheck, ChevronRight, X, CheckCircle2, Navigation, Info, Search, ReceiptText } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import { 
  VehicleType, 
  DeliveryMode, 
  ServiceOption, 
} from "../config/businessRules";
import { 
  calculatePricing, 
  PricingBreakdown 
} from "../utils/pricingCalculations";

const AVAILABLE_HUBS = [
  { id: "hub-1", name: "SM North EDSA PakiHub", address: "North Ave, Quezon City", distance: "1.2 km", status: "Open", capacity: "High" },
  { id: "hub-2", name: "Cubao Expo Terminal", address: "Socorro, Quezon City", distance: "4.5 km", status: "Busy", capacity: "Medium" },
  { id: "hub-3", name: "BGC High Street Hub", address: "Taguig, Metro Manila", distance: "12.0 km", status: "Open", capacity: "Full" },
  { id: "hub-4", name: "Makati Central Hub", address: "Ayala Ave, Makati", distance: "15.3 km", status: "Open", capacity: "High" },
];

interface DeliveryServiceSelectorProps {
  distanceKm: number; 
  onSelect: (serviceId: string, price: number, options?: any) => void;
  onConfirm?: (serviceId: string, finalPrice: number, options?: any) => void;
  selectedService: string;
  packageSize?: "small" | "medium" | "large" | "xl";
  totalParcels: number;
  onSelectDropOffPoint: (hub: any) => void;
  selectedDropOffPoint: any | null;
  isSurgeActive?: boolean;
  selectedCategory?: string;
  cartItems?: Array<{ itemType: string; [key: string]: any }>;
}

export default function DeliveryServiceSelector({
  distanceKm = 0,
  onSelect,
  selectedService,
  packageSize = "small",
  totalParcels = 1,
  onSelectDropOffPoint,
  selectedDropOffPoint,
  isSurgeActive = false,
  selectedCategory = "general",
  cartItems = [],
}: DeliveryServiceSelectorProps) {
  const [showHubPicker, setShowHubPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isXLPackage = packageSize === "xl";

  const isSensitiveItem = useMemo(() => {
    if (cartItems && cartItems.length > 0) {
      return cartItems.some(item => {
        const typeString = item.type || item.itemType || ""; 
        return ["food", "fragile"].includes(typeString.toLowerCase());
      });
    }
    return ["food", "fragile"].includes((selectedCategory || "").toLowerCase());
  }, [cartItems, selectedCategory]);

  const [selectedVehicle] = useState<VehicleType>(
    isXLPackage ? VehicleType.SEDAN : VehicleType.MOTORCYCLE
  );

  const safeDistance = distanceKm || 0;
  const relayHops = Math.max(1, Math.min(2, Math.ceil(safeDistance / 10))); 

  const getPricingData = (id: string): PricingBreakdown => {
    const params = { isSurgeActive, packageSize, distanceKm: safeDistance };

    if (id === "pakishare") {
      return calculatePricing({
        ...params,
        vehicleType: VehicleType.PUV_RELAY,
        deliveryMode: DeliveryMode.RELAY,
        serviceOption: ServiceOption.CHEAP,
        hops: relayHops,
        applyDiscount: true, 
      });
    } else if (id === "pakibusiness") {
      return calculatePricing({
        ...params,
        vehicleType: isXLPackage ? VehicleType.SEDAN : VehicleType.MOTORCYCLE,
        deliveryMode: DeliveryMode.DIRECT,
        serviceOption: ServiceOption.FAST,
        applyDiscount: totalParcels >= 10,
      });
    } else {
      return calculatePricing({
        ...params,
        vehicleType: isXLPackage ? selectedVehicle : VehicleType.MOTORCYCLE,
        deliveryMode: DeliveryMode.DIRECT,
        serviceOption: ServiceOption.FAST,
        applyDiscount: false,
      });
    }
  };

  const currentPricing = useMemo(() => {
    if (!selectedService) return null;
    return getPricingData(selectedService);
  }, [selectedService, totalParcels, packageSize, isSurgeActive, safeDistance]);

  useEffect(() => {
    if (selectedService && currentPricing) {
      const finalPrice = (currentPricing.finalTotal || 0) * (totalParcels || 1);
      onSelect(selectedService, finalPrice, {
        hub: selectedDropOffPoint,
        vehicleType: selectedVehicle,
        isValid: selectedService === "pakishare" ? (!!selectedDropOffPoint && !isSensitiveItem) : true
      });
    }
  }, [selectedService, selectedDropOffPoint, currentPricing, totalParcels, isSensitiveItem]);

  const filteredHubs = useMemo(() => {
    return AVAILABLE_HUBS.filter(hub => 
      hub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      hub.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const services = [
    { 
      id: "pakishare", 
      name: "PakiShare", 
      icon: <Users className="w-5 h-5" />, 
      desc: "Relay Economy", 
      time: "2-4 hrs", 
      available: !isSensitiveItem && totalParcels === 1,
      note: isSensitiveItem ? "No Food/Fragile allowed" : totalParcels > 1 ? "Max 1 parcel" : null,
      rules: ["₱30 per hop", "10% Discount", "72hr window"]
    },
    { 
      id: "PakiExpress", 
      name: "PakiExpress", 
      icon: <Zap className="w-5 h-5" />, 
      desc: "Direct Delivery", 
      time: "30-60 mins", 
      available: isSensitiveItem ? true : totalParcels <= 3,
      note: totalParcels > 3 && !isSensitiveItem ? "Max 3 parcels" : null,
      rules: ["₱50 Base + ₱10/km", "Direct to door", "Safe for Sensitive"]
    },
    { 
      id: "pakibusiness", 
      name: "PakiBusiness", 
      icon: <Truck className="w-5 h-5" />, 
      desc: "Fleet Bulk", 
      time: "1-2 hrs", 
      available: totalParcels >= 10 && !isSensitiveItem,
      note: isSensitiveItem ? "No Food/Fragile" : totalParcels < 10 ? "Min. 10 parcels" : null,
      rules: ["35% Bulk Discount", "Fleet priority", "Biz Dashboard"]
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-4 md:p-5 shadow-2xl shadow-gray-200/50 space-y-4 font-sans overflow-hidden h-auto flex flex-col">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-1">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-[#041614] tracking-tight">Select delivery service</h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 rounded-lg text-[9px] font-bold text-gray-400 border border-gray-100">
              <Navigation className="w-2.5 h-2.5" /> {safeDistance.toFixed(1)} km
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 rounded-lg text-[9px] font-bold text-gray-400 border border-gray-100">
              <Package className="w-2.5 h-2.5" /> {totalParcels} {totalParcels === 1 ? 'unit' : 'units'}
            </span>
            {isSensitiveItem && (
               <span className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-50 rounded-lg text-[9px] font-bold text-orange-600 border border-orange-100">
                <AlertCircle className="w-2.5 h-2.5" /> PakiExpress Required
              </span>
            )}
          </div>
        </div>
        {isSurgeActive && (
          <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-xl border border-red-100 self-start">
            <TrendingUp className="w-3.5 h-3.5 animate-bounce" />
            <span className="text-[9px] font-bold">Peak Surge (+₱20)</span>
          </div>
        )}
      </div>

      {/* SERVICE CARDS */}
      <div className="grid gap-2">
        {services.map((service) => {
          const pricing = getPricingData(service.id);
          const price = (pricing.finalTotal || 0) * (totalParcels || 1);
          const isSelected = selectedService === service.id;

          return (
            <div key={service.id} className="relative">
              <button
                type="button"
                disabled={!service.available}
                onClick={() => onSelect(service.id, price)}
                className={`w-full p-3.5 md:p-4 rounded-[1.5rem] border-2 transition-all flex items-center justify-between gap-3 ${
                  isSelected 
                  ? "border-[#39B5A8] bg-[#F0F9F8] shadow-sm" 
                  : "border-gray-50 bg-gray-50/40 hover:border-gray-200"
                } ${!service.available ? "opacity-50 grayscale cursor-not-allowed" : "active:scale-[0.98]"}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-[#39B5A8] text-white shadow-md" : "bg-white text-gray-400 border border-gray-100"
                  }`}>
                    {service.icon}
                  </div>
                  <div className="text-left min-w-0">
                    <p className={`font-bold text-sm truncate ${isSelected ? "text-[#041614]" : "text-gray-500"}`}>
                      {service.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-medium text-gray-400">{service.desc}</span>
                      <span className="text-[10px] font-bold text-[#39B5A8]">{service.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end shrink-0">
                  <p className="text-base font-bold text-[#041614]">₱{Math.round(price)}</p>
                  <span className="text-[8px] text-gray-400 font-bold uppercase">Per {totalParcels > 1 ? 'Batch' : 'Trip'}</span>
                </div>
              </button>

              {isSelected && (
                <div className="mt-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-xl flex flex-wrap gap-x-3 gap-y-1 animate-in slide-in-from-top-1 duration-200">
                  {service.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-[#39B5A8]" />
                      <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tight">{rule}</span>
                    </div>
                  ))}
                </div>
              )}

              {service.id === "pakishare" && isSelected && (
                <div className="mt-2 px-1 animate-in slide-in-from-top-1 duration-200">
                  <button
                    type="button"
                    onClick={() => setShowHubPicker(true)}
                    className={`w-full p-3 rounded-xl border-2 border-dashed flex items-center justify-between transition-all ${
                      selectedDropOffPoint ? "border-[#39B5A8] bg-white" : "border-orange-200 bg-orange-50/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${selectedDropOffPoint ? "bg-[#39B5A8] text-white" : "bg-orange-100 text-orange-600"}`}>
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <p className={`text-[8px] font-bold uppercase ${selectedDropOffPoint ? "text-[#39B5A8]" : "text-orange-600"}`}>
                          {selectedDropOffPoint ? "Hub Selected" : "Action required"}
                        </p>
                        <p className="text-xs font-bold truncate max-w-[150px]">
                          {selectedDropOffPoint ? selectedDropOffPoint.name : "Choose drop-off hub"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PRICING BREAKDOWN */}
      {selectedService && currentPricing && (
        <div className="bg-[#F8FAFC] rounded-[1.5rem] p-4 border border-gray-100 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200/50">
             <ReceiptText className="w-3.5 h-3.5 text-gray-400" />
             <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Bill Summary</h3>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-[#041614] font-bold">₱{Math.round((currentPricing.subtotal || 0) * (totalParcels || 1))}</span>
            </div>

            {isSurgeActive && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-red-400 font-medium">Peak Surge</span>
                <span className="text-red-500 font-bold">+₱{20 * (totalParcels || 1)}</span>
              </div>
            )}

            {(currentPricing.discountAmount || 0) > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#39B5A8] font-medium">Discount</span>
                <span className="text-[#39B5A8] font-bold">-₱{Math.round((currentPricing.discountAmount || 0) * (totalParcels || 1))}</span>
              </div>
            )}

            <div className="pt-2 mt-1 border-t border-dashed border-gray-200 flex justify-between items-center">
              <span className="text-sm font-bold text-[#041614]">Total Amount</span>
              <span className="text-xl font-bold text-[#39B5A8]">
                ₱{Math.round((currentPricing.finalTotal || 0) * (totalParcels || 1))}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* HUB PICKER MODAL - ONLY SCROLLABLE PART */}
      {showHubPicker && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-[#041614]/80 backdrop-blur-sm" onClick={() => setShowHubPicker(false)} />
          <div className="relative bg-white w-full md:max-w-4xl h-[80vh] md:h-auto md:max-h-[85vh] rounded-t-[2.5rem] md:rounded-[2.5rem] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-1 md:hidden" />
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-64 bg-gray-50 p-5 md:p-6 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="flex justify-between items-center md:block mb-4">
                  <div className="w-10 h-10 bg-[#39B5A8] rounded-xl flex items-center justify-center text-white mb-2 shadow-lg">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#041614]">Find a PakiHub</h3>
                  <button onClick={() => setShowHubPicker(false)} className="md:hidden p-1.5 bg-gray-200/50 rounded-full">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#39B5A8]/20 focus:border-[#39B5A8]"
                    placeholder="Search nearby areas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-3 content-start">
                {filteredHubs.map((hub) => (
                  <button
                    key={hub.id}
                    onClick={() => {
                      onSelectDropOffPoint(hub);
                      setShowHubPicker(false);
                    }}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${
                      selectedDropOffPoint?.id === hub.id 
                      ? "border-[#39B5A8] bg-[#F0F9F8]" 
                      : "border-gray-50 bg-gray-50/20 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className={`p-1.5 rounded-lg ${selectedDropOffPoint?.id === hub.id ? "bg-[#39B5A8] text-white" : "bg-gray-100 text-[#39B5A8]"}`}>
                        <Navigation className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase ${
                        hub.status === 'Busy' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                      }`}>{hub.status}</span>
                    </div>
                    <h4 className="font-bold text-md text-[#041614] mb-0.5 truncate">{hub.name}</h4>
                    <p className="text-[12px] font-medium text-gray-400 line-clamp-1">{hub.address}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="bg-gray-50 rounded-[1.25rem] p-3 flex items-start gap-3 border border-gray-100">
        <ShieldCheck className="w-4 h-4 text-[#39B5A8] shrink-0 mt-0.5" />
        <div>
           <p className="text-[10px] font-bold text-[#041614] mb-0.5 leading-none">PakiShip Transparency</p>
           <p className="text-[9px] font-medium text-gray-400 leading-tight">
             Rates based on <b>{packageSize}</b> size. {isXLPackage ? "XL restricted to Sedan/SUV." : "Includes real-time tracking."}
          </p>
        </div>
      </div>
    </div>
  );
}