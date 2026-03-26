import { useState, useEffect } from "react";
import { Camera, Info, Plus, Minus, AlertCircle, ArrowRight, X } from "lucide-react";
import ProhibitedItemsModal from "./ProhibitedItemsModal";

interface PackageDetailsProps {
  onContinue: (details: PackageDetails) => void;
  onBack: () => void;
}

export interface PackageDetails {
  size: "S" | "M" | "L" | "XL";
  weight: string;
  itemType: string;
  deliveryGuarantee: "basic" | "standard" | "premium";
  quantity: number;
  photo?: File;
}

export default function PackageDetails({ onContinue, onBack }: PackageDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L" | "XL">("M");
  const [weight, setWeight] = useState("");
  const [selectedItemType, setSelectedItemType] = useState("");
  const [selectedGuarantee, setSelectedGuarantee] = useState<"basic" | "standard" | "premium">("basic");
  const [quantity, setQuantity] = useState(1);
  const [photo, setPhoto] = useState<File | null>(null);
  const [showProhibitedModal, setShowProhibitedModal] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const sizes = [
    { value: "S" as const, label: "S", dimensions: "30cm × 25cm × 35cm", maxWeight: 3, image: "https://i.postimg.cc/xTz2Bw4F/Small-box.png" },
    { value: "M" as const, label: "M", dimensions: "40cm × 40cm × 40cm", maxWeight: 5, image: "https://i.postimg.cc/gkZW1CTt/Medium-Box.png" },
    { value: "L" as const, label: "L", dimensions: "60cm × 60cm × 60cm", maxWeight: 10, image: "https://i.postimg.cc/hPdBNk55/Large-box.png" },
    { value: "XL" as const, label: "XL", dimensions: "1.2m × 2.1m × 1.2m", maxWeight: 50, image: "https://i.postimg.cc/L61pGcbx/xl-box.png" },
  ];

  const itemTypes = [
    { value: "document", label: "Doc", icon: "📄" },
    { value: "food", label: "Food", icon: "🍴" },
    { value: "clothing", label: "Cloth", icon: "👔" },
    { value: "electronics", label: "Electr", icon: "📱" },
    { value: "fragile", label: "Fragile", icon: "⚠️" },
    { value: "other", label: "Other", icon: "📦" },
  ];

  const guarantees = [
    { value: "basic" as const, label: "Basic", price: "Free", description: "Covers ₱3k" },
    { value: "standard" as const, label: "Standard", price: "₱7.00", description: "Covers ₱5k" },
    { value: "premium" as const, label: "Premium", price: "₱9.00", description: "Covers ₱10k" },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const currentSize = sizes.find(s => s.value === selectedSize);
  const requiresDirectDelivery = selectedItemType === "food" || selectedItemType === "fragile";
  const cardClasses = "bg-white rounded-2xl shadow-sm border border-[#39B5A8]/10 p-5 md:p-8";

  const handleContinue = () => {
    if (selectedSize === "XL") {
      if (!weight) return setError("Please enter weight for XL");
      if (parseFloat(weight) > (currentSize?.maxWeight || 50)) 
        return setError(`Max ${currentSize?.maxWeight}kg for XL`);
    }
    if (!selectedItemType) return setError("Please select an item type");
    if (quantity < 1) return setError("Minimum quantity is 1");

    onContinue({
      size: selectedSize,
      weight: selectedSize === "XL" ? weight : `Up to ${currentSize?.maxWeight}kg`,
      itemType: selectedItemType,
      deliveryGuarantee: selectedGuarantee,
      quantity: quantity,
      photo: photo || undefined,
    });
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto relative px-3 md:px-4 pb-12">
      
      {/* ERROR POPUP */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-1.5rem)] max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#1A5D56] text-white p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="flex-1 font-semibold text-xs md:text-sm">{error}</p>
            <button onClick={() => setError(null)} className="p-1 hover:bg-white/10 rounded-md">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Size Visual & Selection */}
      <div className={cardClasses}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="bg-[#F8FDFD] rounded-xl p-4 flex flex-col items-center justify-center min-h-[220px] md:min-h-[280px] border border-[#39B5A8]/5">
            <img 
              src={currentSize?.image} 
              alt={`Size ${selectedSize}`}
              className="h-32 md:h-48 object-contain transition-transform duration-500"
            />
            <div className="mt-4 text-center">
              <span className="text-[#39B5A8] font-bold text-base md:text-lg px-4 py-1">
                Size {currentSize?.label}
              </span>
              <p className="text-[#1A5D56]/60 text-[10px] md:text-xs font-medium uppercase tracking-wider">
                {currentSize?.dimensions}
              </p>
            </div>
          </div>

          <div className="space-y-5 md:space-y-6">
            <div>
              <label className="block text-[10px] md:text-[11px] uppercase tracking-widest font-bold text-[#1A5D56]/50 mb-3">
                Package Size
              </label>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => { setSelectedSize(size.value); setWeight(""); }}
                    className={`flex-1 h-12 rounded-xl font-bold transition-all active:scale-95 border-2 ${
                      selectedSize === size.value
                        ? "bg-[#39B5A8] border-[#39B5A8] text-white shadow-md shadow-[#39B5A8]/20"
                        : "bg-white border-[#39B5A8]/10 text-[#1A5D56] hover:border-[#39B5A8]/30"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedSize === "XL" ? (
              <div className="animate-in fade-in slide-in-from-top-4">
                <label className="block text-[10px] md:text-[11px] uppercase tracking-widest font-black text-[#1A5D56]/50 mb-2">
                  Parcel Weight
                </label>
                <div className="flex items-center gap-2 md:gap-3 bg-[#F0F9F8] p-1.5 md:p-2 rounded-2xl border-2 border-[#39B5A8]/10">
                  <button
                    type="button"
                    onClick={() => setWeight(prev => Math.max(0, (parseFloat(prev) || 0) - 0.5).toFixed(1))}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white text-[#39B5A8] flex items-center justify-center shadow-sm active:scale-90"
                  >
                    <Minus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <div className="flex-1 text-center">
                    <input
                      type="number"
                      placeholder="0.0"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-transparent font-black text-center text-[#1A5D56] text-xl md:text-2xl outline-none"
                    />
                    <span className="block text-[8px] font-black text-[#39B5A8] uppercase tracking-widest">kg</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newWeight = (parseFloat(weight) || 0) + 0.5;
                      if (newWeight <= (currentSize?.maxWeight || 50)) setWeight(newWeight.toFixed(1));
                    }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#39B5A8] text-white flex items-center justify-center shadow-lg active:scale-90"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#F0F9F8] border border-[#39B5A8]/10 flex items-start gap-3">
                <Info className="w-4 h-4 text-[#39B5A8] shrink-0 mt-0.5" />
                <p className="text-[11px] md:text-xs text-[#1A5D56]/80 leading-relaxed">
                  <span className="font-bold text-[#39B5A8]">Included:</span> Up to {currentSize?.maxWeight}kg for this size.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📸 Photo Upload */}
      <div className={cardClasses}>
        <label className="flex items-center justify-center gap-3 py-3 md:py-4 border-2 border-dashed border-[#39B5A8]/20 rounded-xl cursor-pointer hover:bg-[#F0F9F8] transition-all">
          <Camera className="w-5 h-5 text-[#39B5A8]" />
          <span className="text-[#1A5D56] font-bold text-xs md:text-sm truncate max-w-[200px] md:max-w-none">
            {photo ? photo.name : "Attach a photo (optional)"}
          </span>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
        </label>
      </div>

      {/* 📦 Item Type */}
      <div className={cardClasses}>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-bold text-[#1A5D56]">Item type</h3>
          <button 
            type="button"
            className="text-[#39B5A8] hover:underline text-[10px] md:text-xs font-bold" 
            onClick={() => setShowProhibitedModal(true)}
          >
            What's prohibited?
          </button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {itemTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedItemType(type.value)}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 md:gap-2 active:scale-95 ${
                selectedItemType === type.value
                  ? "border-[#39B5A8] bg-[#F0F9F8] text-[#39B5A8]"
                  : "border-transparent bg-gray-50 hover:bg-white hover:border-[#39B5A8]/20 text-[#1A5D56]/60"
              }`}
            >
              <div className="text-xl md:text-2xl">{type.icon}</div>
              <div className="text-[9px] md:text-[10px] uppercase font-bold tracking-tight text-center">
                {type.label}
              </div>
            </button>
          ))}
        </div>

        {requiresDirectDelivery && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-900 font-medium">
              Note: <span className="font-bold">{selectedItemType}</span> requires Direct Delivery.
            </p>
          </div>
        )}
      </div>

      {/* 🛡️ Guarantee & Quantity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className={cardClasses}>
          <h3 className="text-base md:text-lg font-bold text-[#1A5D56] mb-4">Delivery Guarantee</h3>
          <div className="space-y-2">
            {guarantees.map((guarantee) => (
              <button
                key={guarantee.value}
                onClick={() => setSelectedGuarantee(guarantee.value)}
                className={`w-full p-3 md:p-3.5 rounded-xl border-2 transition-all flex justify-between items-center active:scale-[0.99] ${
                  selectedGuarantee === guarantee.value
                    ? "bg-[#1A5D56] border-[#1A5D56] text-white shadow-lg"
                    : "bg-white border-[#39B5A8]/10 text-[#1A5D56] hover:bg-[#F0F9F8]"
                }`}
              >
                <div className="flex flex-col items-start">
                   <span className="font-bold text-xs md:text-sm">{guarantee.label}</span>
                   <span className={`text-[8px] md:text-[10px] opacity-70 ${selectedGuarantee === guarantee.value ? "text-white" : "text-[#1A5D56]"}`}>
                     {guarantee.description}
                   </span>
                </div>
                <span className={`text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-md ${selectedGuarantee === guarantee.value ? "bg-white/20 text-white" : "text-[#39B5A8] bg-[#F0F9F8]"}`}>
                  {guarantee.price}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={`${cardClasses} flex flex-col justify-between`}>
          <h3 className="text-base md:text-lg font-bold text-[#1A5D56] mb-4">Quantity</h3>
          <div className="flex items-center justify-between bg-[#F0F9F8] rounded-xl p-4 border border-[#39B5A8]/10">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-lg bg-white text-[#39B5A8] flex items-center justify-center shadow-sm disabled:opacity-30"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-2xl md:text-3xl font-bold text-[#1A5D56]">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-lg bg-[#39B5A8] text-white flex items-center justify-center shadow-sm hover:bg-[#2D8F85]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[9px] md:text-[10px] text-center text-[#1A5D56]/40 font-bold mt-4 uppercase tracking-widest">
            Total for this size
          </p>
        </div>
      </div>

      {/* 🚀 Actions */}
      <div className="flex gap-3 md:gap-4 pt-4 sticky bottom-0 bg-slate-50/80 backdrop-blur-md pb-4 md:static md:bg-transparent">
        <button
          onClick={onBack}
          className="flex-1 h-12 md:h-14 rounded-xl border-2 border-[#1A5D56]/10 text-[#1A5D56] font-bold bg-white md:bg-transparent active:scale-95"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-[2] h-12 md:h-14 rounded-xl bg-gradient-to-r from-[#39B5A8] to-[#2D8F85] text-white font-bold shadow-lg shadow-[#39B5A8]/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      <ProhibitedItemsModal isOpen={showProhibitedModal} onClose={() => setShowProhibitedModal(false)} />
    </div>
  );
}