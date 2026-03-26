import { useState, useEffect } from "react";
import { Star, MessageSquare, ShieldCheck, Zap, Package, UserCheck, Clock, AlertCircle, CheckCircle2, X } from "lucide-react";
import { useNavigate } from "react-router";
import { CustomerPageHeader } from "../components/CustomerPageHeader";
const logoImg = "/logo.png";

const MASCOTS = {
  1: { src: "https://i.imgur.com/yBvmbRD.png", label: "Poor" },
  2: { src: "https://i.imgur.com/PKTxvFR.png", label: "Fair" },
  3: { src: "https://i.imgur.com/cFzyyZ4.png", label: "Good" },
  4: { src: "https://i.imgur.com/C1jpIzN.png", label: "Very Good" },
  5: { src: "https://i.imgur.com/jknPCsk.png", label: "Excellent" },
};

export function RateReviewPage() {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "error" | "success" }>({
    show: false,
    message: "",
    type: "success",
  });

  const recentFeedback = [
    { id: "PKS-002", text: "Excellent service! Driver was professional.", tag: "SECURED" },
    { id: "PKS-003", text: "On time and very polite rider.", tag: "FAST" },
    { id: "PKS-004", text: "Package handled with great care.", tag: "PERFECT" },
    { id: "PKS-005", text: "Super fast shipping, highly recommended!", tag: "FAST" },
  ];

  const quickTags = [
    { id: "fast", label: "Fast", icon: <Zap className="w-3 h-3" /> },
    { id: "secured", label: "Secured", icon: <ShieldCheck className="w-3 h-3" /> },
    { id: "friendly", label: "Friendly", icon: <UserCheck className="w-3 h-3" /> },
    { id: "perfect", label: "Perfect", icon: <Package className="w-3 h-3" /> },
    { id: "ontime", label: "On Time", icon: <Clock className="w-3 h-3" /> },
  ];

  const showToast = (message: string, type: "error" | "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const toggleTag = (label: string) => {
    setSelectedTags(prev => 
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      showToast("Please select a star rating to continue.", "error");
      return;
    }
    showToast("Feedback submitted! Redirecting...", "success");
    setTimeout(() => navigate("/customer/home"), 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F0F9F8] selection:bg-[#39B5A8]/20 font-sans overflow-hidden">

      <style>{`
        @keyframes mascotPop {
          0%   { transform: scale(0.4) translateY(8px); opacity: 0; }
          100% { transform: scale(1)   translateY(0px); opacity: 1; }
        }
      `}</style>
      
      {/* Toast Notification */}
      <div className={`fixed top-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-[100] transition-all duration-500 transform ${
          toast.show ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none"
        }`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border-2 ${
          toast.type === "error" ? "bg-white border-red-100 text-red-600 shadow-red-200/50" : "bg-white border-[#39B5A8]/20 text-[#1A5D56] shadow-[#39B5A8]/20"
        }`}>
          {toast.type === "error" ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-[#39B5A8] shrink-0" />}
          <p className="font-bold text-xs tracking-tight">{toast.message}</p>
          <button onClick={() => setToast(p => ({ ...p, show: false }))} className="ml-auto p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="shrink-0">
        <CustomerPageHeader
          title="Rate & Review"
          subtitle="Help us improve"
          icon={MessageSquare}
          logo={logoImg}
        />
      </div>

      <main className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8">
        <div className="h-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form Section */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] shadow-xl shadow-[#1A5D56]/5 border border-[#39B5A8]/20 p-5 sm:p-8 flex flex-col h-full overflow-y-auto no-scrollbar">
            <div className="mb-5 border-l-4 border-[#39B5A8] pl-4 shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A5D56]">Delivery Feedback</h2>
              <p className="text-slate-500 font-medium text-xs sm:text-sm">Rate your recent PKS experience.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Tracking Number */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1A5D56] uppercase tracking-wider">Tracking #</label>
                  <input
                    type="text"
                    placeholder="PKS-2024-001"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-[#39B5A8] focus:bg-white focus:outline-none transition-all text-[#1A5D56] font-bold text-sm"
                    required
                  />
                </div>

                {/* Star Rating Box with Inline Mascot */}
                <div className="bg-[#F0F9F8] rounded-xl px-2.5 pt-2 pb-2 border border-[#39B5A8]/10 flex flex-col items-center justify-center shadow-inner">
                  
                  {/* Mascot — slides in above stars */}
                  <div
                    className="overflow-hidden flex items-center justify-center transition-all duration-300"
                    style={{
                      height: rating > 0 ? "56px" : "0px",
                      opacity: rating > 0 ? 1 : 0,
                      marginBottom: rating > 0 ? "4px" : "0px",
                    }}
                  >
                    {rating > 0 && (
                      <img
                        key={rating}
                        src={MASCOTS[rating as keyof typeof MASCOTS].src}
                        alt={MASCOTS[rating as keyof typeof MASCOTS].label}
                        className="h-14 w-auto object-contain drop-shadow-md"
                        style={{
                          animation: "mascotPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                        }}
                      />
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform active:scale-90 hover:scale-125"
                      >
                        <Star className={`w-5 h-5 sm:w-6 sm:h-6 ${star <= (hoveredRating || rating) ? "fill-[#39B5A8] text-[#39B5A8]" : "text-slate-300 fill-slate-50"}`} />
                      </button>
                    ))}
                  </div>

                  <span className="text-[9px] font-bold text-[#1A5D56] mt-1 uppercase tracking-tighter">
                    {rating === 0 ? "Tap to Rate" : ["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1]}
                  </span>
                </div>
              </div>

              {/* Quick Tags */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-[#1A5D56] uppercase tracking-wider">What went well?</label>
                <div className="flex flex-wrap gap-1.5">
                  {quickTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.label)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-[10px] transition-all border ${
                        selectedTags.includes(tag.label)
                          ? "bg-[#39B5A8] border-[#39B5A8] text-white"
                          : "bg-white border-slate-100 text-slate-500 hover:border-[#39B5A8]/40"
                      }`}
                    >
                      {tag.icon}
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Textarea */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <label className="block text-[10px] font-bold text-[#1A5D56] uppercase tracking-wider">Review</label>
                  <span className="text-[9px] text-slate-400 font-bold">{review.length}/500</span>
                </div>
                <textarea
                  placeholder="Share your experience..."
                  value={review}
                  maxLength={500}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-[#39B5A8] focus:bg-white transition-all resize-none text-[#1A5D56] font-bold min-h-[80px] text-xs sm:text-sm"
                />
              </div>

              {/* Mobile Recent Feedback Slider */}
              <div className="lg:hidden space-y-2 pt-2 shrink-0">
                <h3 className="text-[10px] font-bold text-[#1A5D56] uppercase tracking-wider">Recent Feedback</h3>
                <div className="flex gap-3 overflow-x-auto pb-3 
                  [&::-webkit-scrollbar]:h-1.5
                  [&::-webkit-scrollbar-track]:bg-slate-100
                  [&::-webkit-scrollbar-track]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-[#39B5A8]/30
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  hover:[&::-webkit-scrollbar-thumb]:bg-[#39B5A8]/50">
                  {recentFeedback.map((item, idx) => (
                    <div key={idx} className="min-w-[240px] bg-[#F8FAFB] rounded-xl p-3 border border-slate-100 shrink-0 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] font-bold text-[#39B5A8]">{item.id}</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-2 h-2 fill-[#39B5A8] text-[#39B5A8]" />)}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-600 font-medium italic truncate">"{item.text}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate("/customer/home")}
                  className="flex-1 h-11 rounded-xl border-2 border-slate-200 font-bold text-slate-500 text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] h-11 rounded-xl bg-[#39B5A8] hover:bg-[#1A5D56] text-white font-bold transition-all shadow-lg shadow-[#39B5A8]/20 text-xs active:scale-95"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Sidebar Feedback */}
          <div className="lg:col-span-5 hidden lg:flex flex-col gap-6 h-full overflow-hidden">
            <div className="bg-[#1A5D56] rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden flex flex-col h-full">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#39B5A8]/10 rounded-full" />
              
              <div className="flex items-center justify-between mb-5 relative z-10 shrink-0">
                <h3 className="font-bold flex items-center gap-2 text-lg">
                  <ShieldCheck className="w-5 h-5 text-[#39B5A8]" />
                  Recent Feedback
                </h3>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md font-bold text-[#39B5A8] border border-white/10">12 Total</span>
              </div>

              <div className="space-y-4 relative z-10 overflow-y-auto pr-2 flex-1
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-white/5
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-[#39B5A8]/40
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-[#39B5A8]/60">
                {recentFeedback.map((item, idx) => (
                  <div key={idx} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/[0.08] transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#39B5A8] tracking-widest uppercase">{item.id}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-[#39B5A8] text-[#39B5A8]" />)}
                      </div>
                    </div>
                    <p className="text-[12px] text-white/80 font-medium italic mb-2 leading-relaxed">"{item.text}"</p>
                    <span className="text-[8px] font-extrabold bg-[#39B5A8]/20 text-[#39B5A8] px-2 py-0.5 rounded-md border border-[#39B5A8]/20 tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-5 border border-[#39B5A8]/20 shadow-sm flex items-center gap-4 shrink-0">
              <div className="bg-[#F0F9F8] p-3 rounded-2xl">
                <UserCheck className="w-6 h-6 text-[#1A5D56]" />
              </div>
              <div>
                <h4 className="font-bold text-[#1A5D56] text-[10px] uppercase tracking-widest mb-0.5">Impact</h4>
                <p className="text-xs text-slate-500 font-bold">Feedback helps us reward top-tier riders.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}