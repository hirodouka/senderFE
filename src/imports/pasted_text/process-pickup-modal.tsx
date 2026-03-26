function ProcessPickupModal({ parcel, onClose, onSuccess }: { parcel: Parcel; onClose: () => void; onSuccess: () => void }) {
  const [phase, setPhase] = useState<"scanning" | "verifying" | "success">("scanning");
  const [dots, setDots] = useState(".");
  const [customerName, setCustomerName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    if (phase === "scanning") {
      const dotInterval = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 500);
      const scanTimeout = setTimeout(() => {
        setCustomerName(parcel.recipient);
        setPhase("verifying");
      }, 2500);
      return () => { clearInterval(dotInterval); clearTimeout(scanTimeout); };
    }
  }, [phase, parcel.recipient]);

  const handleVerify = () => {
    if (verificationCode.length === 4) {
      setPhase("success");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#041614]/70 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        {phase === "scanning" ? (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="relative w-48 h-48 mb-6">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#39B5A8] rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#39B5A8] rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#39B5A8] rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#39B5A8] rounded-br-lg"></div>
              <div className="absolute inset-2 overflow-hidden rounded-lg bg-[#F0F9F8]">
                <div className="w-full h-0.5 bg-[#39B5A8] shadow-lg shadow-[#39B5A8]/50"
                  style={{ animation: "scanLine 1.5s ease-in-out infinite" }}></div>
                <div className="absolute inset-4 grid grid-cols-5 grid-rows-5 gap-0.5 opacity-20">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-[#041614]' : 'bg-transparent'}`}></div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-[#39B5A8] rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="w-full bg-[#F0F9F8] rounded-2xl px-4 py-3 mb-4">
              <p className="text-[10px] font-black text-[#39B5A8] uppercase tracking-widest mb-1">Parcel Details</p>
              <p className="text-sm font-black text-[#041614]">{parcel.trackingNumber}</p>
              <p className="text-xs text-gray-400 font-bold mt-0.5">Recipient: {parcel.recipient}</p>
            </div>
            <h2 className="text-xl font-black text-[#041614] mb-2">Scanning Customer QR{dots}</h2>
            <p className="text-gray-400 text-sm font-medium mb-6">Ask the customer to show their pickup QR code</p>
            <button onClick={onClose} className="w-full py-3 text-gray-400 font-bold text-sm hover:text-[#041614] hover:bg-gray-50 rounded-xl transition-all">Cancel</button>
          </div>
        ) : phase === "verifying" ? (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-[#041614]">Verify Pickup</h2>
                <p className="text-xs text-gray-400 font-bold mt-0.5">Enter the 4-digit verification code</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="bg-[#F0F9F8] rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#39B5A8] flex items-center justify-center text-white font-black text-lg">
                  {customerName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-[#041614]">{customerName}</p>
                  <p className="text-xs text-gray-400 font-bold">{parcel.trackingNumber}</p>
                </div>
              </div>
              {parcel.storageLocation && (
                <div className="flex items-center gap-2 text-xs font-bold text-[#39B5A8] bg-white rounded-lg px-3 py-2">
                  <Package className="w-4 h-4" />
                  <span>Located at Shelf: {parcel.storageLocation}</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-[#39B5A8] uppercase tracking-widest ml-1 mb-2 block">Verification Code</label>
                <input
                  type="text"
                  maxLength={4}
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="• • • •"
                  className="w-full bg-[#F0F9F8] rounded-2xl px-4 py-4 text-center text-2xl font-black tracking-widest focus:ring-2 ring-[#39B5A8] outline-none placeholder:text-gray-300"
                  autoFocus
                />
              </div>
              <button
                onClick={handleVerify}
                disabled={verificationCode.length !== 4}
                className="w-full py-4 bg-[#39B5A8] text-white rounded-2xl font-black text-sm shadow-lg hover:bg-[#2D8F85] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
                Confirm Pickup
              </button>
              <button onClick={onClose} className="w-full py-3 text-gray-400 font-bold text-sm hover:text-[#041614] transition-colors">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-5 shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-xl font-black text-green-600 mb-1">Pickup Successful!</h2>
            <div className="w-full bg-[#F0F9F8] rounded-2xl px-4 py-3 mb-2 mt-4">
              <p className="text-[10px] font-black text-[#39B5A8] uppercase tracking-widest mb-1">Tracking Number</p>
              <p className="text-lg font-black text-[#041614]">{parcel.trackingNumber}</p>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-2">Handed to: <span className="font-black text-[#041614]">{customerName}</span></p>
            <p className="text-gray-400 text-xs mb-6">The parcel has been successfully picked up and logged.</p>
            <button onClick={onSuccess}
              className="w-full py-3.5 bg-[#39B5A8] text-white rounded-2xl font-black text-sm shadow-lg hover:bg-[#2D8F85] transition-all active:scale-95">
              Done
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes scanLine {
          0% { transform: translateY(0); }
          50% { transform: translateY(160px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}