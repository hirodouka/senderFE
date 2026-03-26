import { ArrowLeft, Search, Package, ChevronRight, Calendar, MapPin, History, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { CustomerPageHeader } from "../components/CustomerPageHeader";
import { TransactionDetailsModal } from "../components/TransactionDetailsModal";
const logoImg = "/logo.png";
const mascotImg = "/logo.png";

export function HistoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const transactions = [
    {
      id: "PKS-2024-001",
      date: "Feb 17, 2026",
      from: "Makati City",
      to: "Quezon City",
      status: "In Transit",
      amount: "₱150.00",
      type: "Express Delivery",
      isLive: true,
    },
    {
      id: "PKS-2024-002",
      date: "Feb 15, 2026",
      from: "Manila",
      to: "Pasig City",
      status: "Delivered",
      amount: "₱120.00",
      type: "Standard",
      isLive: false,
    },
    {
      id: "PKS-2024-003",
      date: "Feb 12, 2026",
      from: "Quezon City",
      to: "Caloocan City",
      status: "Delivered",
      amount: "₱180.00",
      type: "Fragile Handle",
      isLive: false,
    },
    {
      id: "PKS-2024-004",
      date: "Feb 10, 2026",
      from: "BGC",
      to: "Alabang",
      status: "Delivered",
      amount: "₱250.00",
      type: "Express Delivery",
      isLive: false,
    },
  ];

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.to.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "active") return matchesSearch && t.isLive;
    if (activeTab === "completed") return matchesSearch && !t.isLive;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFB] text-[#041614] font-sans selection:bg-[#39B5A8]/20 flex flex-col">
      {/* Header - Fixed to top */}
      <div className="shrink-0">
        <CustomerPageHeader
          title="Activity"
          subtitle="Complete tracking history"
          icon={History}
          logo={logoImg}
          onBack={() => navigate("/customer/home")}
        />
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 mt-4 sm:mt-8 pb-24">
        {/* Search & Tabs Container */}
        <div className="bg-white p-2 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 mb-6 sm:mb-10">
          <div className="relative mb-2">
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
            <input
              type="text"
              placeholder="Search by ID or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 sm:pl-14 pr-4 h-12 sm:h-16 bg-slate-50/50 rounded-xl sm:rounded-2xl border-none focus:ring-2 focus:ring-[#39B5A8]/20 transition-all outline-none font-medium text-sm sm:text-base text-slate-700"
            />
          </div>

          <div className="flex gap-1 p-1">
            {(['all', 'active', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all capitalize tracking-wider ${
                  activeTab === tab 
                    ? "bg-[#39B5A8] text-white shadow-md" 
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-slate-400">Parcel Records</h2>
            <span className="text-[9px] sm:text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
              {filteredTransactions.length} results
            </span>
          </div>

          {filteredTransactions.map((transaction) => (
            <div 
              key={transaction.id}
              onClick={() => setSelectedTransaction(transaction)}
              className="group relative bg-white p-4 sm:p-6 rounded-[1.8rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-[#39B5A8]/40 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between mb-4 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-transform group-hover:scale-105 ${transaction.isLive ? 'bg-[#39B5A8]/10 text-[#39B5A8]' : 'bg-slate-100 text-slate-400'}`}>
                    <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-0.5 sm:mb-1">
                      <h3 className="font-bold text-sm sm:text-lg text-slate-800">{transaction.id}</h3>
                      {transaction.isLive && (
                        <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-100">
                          <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                          LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{transaction.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm sm:text-xl font-bold text-[#1A5D56] mb-1">{transaction.amount}</p>
                  <span className={`text-[8px] sm:text-[10px] font-bold uppercase px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl ${
                    transaction.isLive ? 'bg-[#39B5A8] text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>

              {/* Delivery Path UI */}
              <div className="flex items-center gap-2 sm:gap-4 bg-slate-50/80 p-3 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100/50">
                <div className="flex-1 min-w-0">
                  <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase mb-0.5 sm:mb-1">From</p>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-300 shrink-0" />
                    <span className="font-bold text-slate-700 text-xs sm:text-sm truncate">{transaction.from}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center px-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-[#39B5A8]" />
                  </div>
                </div>

                <div className="flex-1 text-right min-w-0">
                  <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase mb-0.5 sm:mb-1">To</p>
                  <div className="flex items-center gap-1.5 sm:gap-2 justify-end">
                    <span className="font-bold text-slate-700 text-xs sm:text-sm truncate">{transaction.to}</span>
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#39B5A8] shrink-0" />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[9px] sm:text-[11px] font-bold text-slate-400">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {transaction.date}</span>
                  {transaction.isLive && (
                    <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Arrival Today
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[#39B5A8] font-bold text-[10px] sm:text-xs">
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <div className="py-12 sm:py-24 px-6 text-center bg-white rounded-[2rem] sm:rounded-[3rem] border-2 border-dashed border-slate-100">
              <div className="relative w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-[#39B5A8]/10 rounded-full animate-ping" />
                <img src={mascotImg} alt="No orders" className="relative z-10 w-full h-full object-contain grayscale opacity-40" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1A5D56] mb-2">No shipments found</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-medium mb-6 max-w-xs mx-auto">Adjust your search or filters to see past activity.</p>
              <button 
                onClick={() => {setSearchTerm(""); setActiveTab("all");}}
                className="w-full sm:w-auto px-10 py-3.5 bg-[#1A5D56] text-white rounded-xl sm:rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}