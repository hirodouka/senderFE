import { ShoppingCart, Trash2, ShieldCheck, Zap } from "lucide-react";

interface CartItem {
  id: string;
  size: string;
  weight: string | number;
  itemType: string;
  deliveryGuarantee: "basic" | "standard" | "premium";
  quantity: number;
}

interface ParcelCartProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onContinue: () => void;
}

export default function ParcelCart({ 
  items, 
  onRemoveItem, 
  onContinue 
}: ParcelCartProps) {
  
  const getItemTypeData = (type: string) => {
    const data: Record<string, { label: string; icon: string }> = {
      document: { label: "Document", icon: "📄" },
      food: { label: "Food", icon: "🍴" },
      clothing: { label: "Clothing", icon: "👔" },
      electronics: { label: "Electronics", icon: "📱" },
      fragile: { label: "Fragile", icon: "⚠️" },
      other: { label: "Other", icon: "📦" },
    };
    const key = type.toLowerCase();
    return data[key] || { label: type, icon: "📦" };
  };

  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 text-center shadow-xl shadow-gray-200/50">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
           <ShoppingCart className="w-6 h-6 text-gray-300" />
        </div>
        <h3 className="text-[#041614] font-bold text-lg">Your cart is empty</h3>
        <p className="text-gray-400 text-sm mt-1">Add items to begin your delivery booking.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 shadow-xl shadow-gray-200/50 space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#041614] tracking-tight">Order summary</h2>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-400 border border-gray-100">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#F0F9F8] flex items-center justify-center border border-[#39B5A8]/10">
          <ShoppingCart className="w-5 h-5 text-[#39B5A8]" />
        </div>
      </div>

      {/* Cart Items List - Removed max-height and overflow to prevent double scrollbars on mobile */}
      <div className="space-y-3">
        {items.map((item) => {
          const itemData = getItemTypeData(item.itemType);
          const isSensitive = ["food", "fragile"].includes(item.itemType.toLowerCase());

          return (
            <div
              key={item.id}
              className="flex flex-col gap-3 p-4 md:p-5 rounded-[1.5rem] border-2 border-gray-50 bg-gray-50/40 hover:bg-white hover:border-gray-100 transition-all group relative"
            >
              {/* Top Row: Icon + Type + Delete */}
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white flex items-center justify-center shrink-0 text-lg md:text-xl shadow-sm border border-gray-100 transition-transform group-hover:scale-105">
                  {itemData.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#041614] text-sm md:text-base leading-none truncate">
                    {itemData.label}
                  </p>
                  <p className="text-[10px] md:text-[11px] font-medium text-gray-400 mt-1">
                    Qty: {item.quantity} • Parcel details
                  </p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Middle Row: Specs Grid */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-100/80">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">Size</p>
                  <p className="text-xs font-bold text-[#041614]">Parcel {item.size}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">Weight</p>
                  <p className="text-xs font-bold text-[#041614]">
                    {item.weight.toString().toLowerCase().includes('kg') ? item.weight : `${item.weight}kg`}
                  </p>
                </div>
              </div>

              {/* Protection & Service Constraint Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-[#F0F9F8] rounded-md">
                    <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#39B5A8]" />
                  </div>
                  <span className="text-[10px] md:text-[11px] font-bold text-[#39B5A8] capitalize">
                    {item.deliveryGuarantee} protection
                  </span>
                </div>
                
                {isSensitive && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 rounded-md border border-orange-100">
                    <Zap className="w-2.5 h-2.5 text-orange-500" />
                    <span className="text-[8px] md:text-[9px] font-bold text-orange-600 uppercase tracking-wider">
                      PakiExpress Only
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="space-y-4 pt-2">
        <div className="bg-[#F0F9F8] rounded-2xl p-4 border border-[#39B5A8]/10 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#39B5A8] shrink-0 mt-0.5" />
          <p className="text-[10px] md:text-[11px] font-medium text-[#041614]/70 leading-relaxed">
            All parcels in your cart are covered by <strong>PakiShip Shield</strong>. You can review your items before final checkout.
          </p>
        </div>
      </div>
    </div>
  );
}