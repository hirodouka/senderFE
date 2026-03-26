import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Package,
  MapPin,
  Navigation,
  Loader2,
  Target,
  Search,
  Clock,
  User,
  Phone,
  DollarSign,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ShieldCheck,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router";

// Components
import { CustomerPageHeader } from "../components/CustomerPageHeader";
import OnboardingModal from "../components/OnboardingModal";
import PackageDetails, {
  PackageDetails as PackageDetailsType,
} from "../components/PackageDetails";
import ParcelCart from "../components/ParcelCart";
import AddToCartModal from "../components/AddToCartModal";
import DeliveryServiceSelector from "../components/DeliveryServiceSelector";
import MapPreview from "../components/MapPreview";
import DropOffPointSelector from "../components/DropOffPointSelector";
import DropOffQRModal from "../components/DropOffQRModal";
import BookingConfirmationModal from "../components/BookingConfirmationModal";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import LocationPickerModal from "../components/LocationPickerModal";

// Assets
const logo = "/logo.png";
const bgPattern = "/logo.png";

interface CartItem extends PackageDetailsType {
  id: string;
}

export function SendParcelPage() {
  const navigate = useNavigate();

  // UI State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"pickup" | "delivery" | null>(null);

  // Toast Notification State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Booking Data State
  const [pickupLocation, setPickupLocation] = useState<{
    address: string;
    details?: string;
  } | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<{
    address: string;
    details?: string;
  } | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [servicePrice, setServicePrice] = useState<number>(175);
  const [distance] = useState<string>("12.5 km");
  const [duration] = useState<string>("25 mins");

  // Drop-off & Confirmation State
  const [selectedDropOffPoint, setSelectedDropOffPoint] = useState<any>(null);
  const [showDropOffSelector, setShowDropOffSelector] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [bookingConfirmationData, setBookingConfirmationData] = useState<any>(null);

  // Contact Form State
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("pakiship_onboarding_completed");
    if (!hasSeenOnboarding) setShowOnboarding(true);
  }, []);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => {
      setErrorMsg(null);
    }, 4000);
  };

  const handleOpenLocationPicker = (type: "pickup" | "delivery") => {
    setSelectingFor(type);
    setShowLocationPicker(true);
  };

  const handleContinueFromPackageDetails = (details: PackageDetailsType) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.size === details.size && item.itemType === details.itemType
    );
    if (existingIndex !== -1) {
      const newCart = [...cartItems];
      newCart[existingIndex].quantity += details.quantity;
      setCartItems(newCart);
    } else {
      setCartItems([...cartItems, { ...details, id: `${Date.now()}` }]);
    }
    setCurrentStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentMethod)
      return showError("Please select a payment method before continuing.");

    const trackingNumber = `PKS-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalParcels = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    setBookingConfirmationData({
      trackingNumber,
      senderName,
      receiverName,
      totalParcels,
      distance,
      duration,
      servicePrice,
    });
    setShowBookingConfirmation(true);
  };

  const stepTitles = ["Where to?", "Add Parcels", "Your Cart", "Select Service", "Contact Info"];

  // Reusable Tailwind classes
  const inputClasses =
    "w-full px-4 py-2 border border-[#39B5A8]/20 rounded-xl focus:outline-none focus:border-[#39B5A8] bg-white transition-colors font-medium text-sm";
  const labelClasses = "block text-xs font-bold text-[#1A5D56] mb-1 ml-1";
  const primaryBtnClasses =
    "w-full h-12 md:h-14 rounded-2xl bg-[#39B5A8] hover:bg-[#2D8F85] text-white font-bold text-base shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2";
  const secondaryBtnClasses =
    "w-full h-12 md:h-14 rounded-2xl border-2 border-[#39B5A8]/20 text-[#1A5D56] font-bold text-base hover:bg-[#F0F9F8] transition-all flex items-center justify-center gap-2";

  return (
    <div
      className="h-[100dvh] w-full bg-[#F0F9F8] text-[#1A5D56] font-sans flex flex-col overflow-hidden relative"
      style={{
        backgroundImage: `url(${bgPattern})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(57, 181, 168, 0.3); border-radius: 20px; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(57, 181, 168, 0.3) transparent; }
      `}} />

      {/* Header - Fixed */}
      <header className="shrink-0 z-50">
        <CustomerPageHeader
          icon={Send}
          stepTitles={stepTitles}
          currentStep={currentStep}
          subtitle={`Step ${currentStep} of ${stepTitles.length}`}
          onBack={() =>
            currentStep === 1 ? navigate("/customer/home") : setCurrentStep(currentStep - 1)
          }
        />
      </header>

      {/* Error Toast */}
      {errorMsg && (
        <div className="fixed top-20 left-0 right-0 flex justify-center z-[100] animate-in slide-in-from-top-4 px-4 pointer-events-none">
          <div className="bg-white border-l-4 border-red-500 shadow-xl rounded-2xl px-5 py-4 flex items-center gap-3 max-w-md w-full pointer-events-auto">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-xs font-bold text-gray-800 flex-1">{errorMsg}</p>
            <button onClick={() => setErrorMsg(null)} className="p-1 shrink-0">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar - Fixed */}
      <div className="flex items-center justify-center gap-2 py-3 shrink-0 bg-[#F0F9F8]/50 backdrop-blur-sm">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`h-1 rounded-full transition-all duration-500 ${
              step === currentStep ? "w-8 bg-[#39B5A8]" : step < currentStep ? "w-2 bg-[#1A5D56]" : "w-2 bg-[#39B5A8]/20"
            }`}
          />
        ))}
      </div>

      {/* Main Content - Only scrollable area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto h-full flex flex-col pt-1 pb-4">
          
          {/* Step 1: Location */}
          {currentStep === 1 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 flex-1 flex flex-col">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#FDB833]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#39B5A8]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#041614]">Route Details</h2>
                </div>
              </div>

              <div className="relative flex-1 min-h-[300px] rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white">
                <div className="absolute inset-0 z-0">
                  <MapPreview
                    pickupAddress={pickupLocation?.address || ""}
                    deliveryAddress={deliveryLocation?.address || ""}
                    estimatedTime={duration}
                  />
                </div>
                
                {pickupLocation && deliveryLocation && (
                  <div className="absolute top-4 left-0 right-0 flex justify-center z-10 px-4">
                    <div className="bg-[#1A5D56]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-3 border border-white/10">
                      <div className="flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-[#39B5A8]" />
                        <span className="text-[10px] font-bold uppercase">{distance}</span>
                      </div>
                      <div className="w-[1px] h-2 bg-white/20" />
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FDB833]" />
                        <span className="text-[10px] font-bold uppercase">{duration}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 z-10 p-3">
                  <div className="bg-white/95 backdrop-blur-md border border-[#39B5A8]/20 rounded-2xl p-3 shadow-2xl space-y-2">
                    <button onClick={() => handleOpenLocationPicker("pickup")} className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#39B5A8]/10 bg-white hover:bg-[#F0F9F8] transition-all text-left group">
                      <div className="w-8 h-8 rounded-full bg-[#39B5A8]/10 flex items-center justify-center group-hover:bg-[#39B5A8] transition-colors">
                        <MapPin className="w-4 h-4 text-[#39B5A8] group-hover:text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase text-[#39B5A8] tracking-widest leading-none mb-1">Pickup Address</p>
                        <p className={`font-bold truncate text-xs ${pickupLocation ? "text-[#041614]" : "text-gray-400"}`}>
                          {pickupLocation?.address || "Tap to set pickup location"}
                        </p>
                      </div>
                    </button>
                    
                    <button onClick={() => handleOpenLocationPicker("delivery")} className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#39B5A8]/10 bg-white hover:bg-[#F0F9F8] transition-all text-left group">
                      <div className="w-8 h-8 rounded-full bg-[#FDB833]/10 flex items-center justify-center group-hover:bg-[#FDB833] transition-colors">
                        <Target className="w-4 h-4 text-[#FDB833] group-hover:text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase text-[#FDB833] tracking-widest leading-none mb-1">Drop-off Address</p>
                        <p className={`font-bold truncate text-xs ${deliveryLocation ? "text-[#041614]" : "text-gray-400"}`}>
                          {deliveryLocation?.address || "Tap to set destination"}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Package Details */}
          {currentStep === 2 && (
            <div className="animate-in fade-in h-full">
              <PackageDetails onContinue={handleContinueFromPackageDetails} onBack={() => setCurrentStep(1)} />
            </div>
          )}

          {/* Step 3: Cart */}
          {currentStep === 3 && (
            <div className="animate-in fade-in h-full">
              <ParcelCart
                items={cartItems}
                onUpdateQuantity={(id, q) => setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: q } : i)))}
                onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.id !== id))}
                onContinue={() => (cartItems.length > 0 ? setCurrentStep(4) : showError("Add a parcel first."))}
              />
            </div>
          )}

          {/* Step 4: Service Selection */}
          {currentStep === 4 && (
            <div className="animate-in fade-in h-full">
              <DeliveryServiceSelector
                distanceKm={parseFloat(distance.replace(/[^\d.]/g, "")) || 12.5}
                onSelect={(id, price, options) => {
                  setSelectedService(id);
                  setServicePrice(price);
                  if (options?.hub) setSelectedDropOffPoint(options.hub);
                }}
                selectedService={selectedService}
                totalParcels={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                packageSize={cartItems.some((item) => item.size === "xl") ? "xl" : "small"}
                onSelectDropOffPoint={(hub) => setSelectedDropOffPoint(hub)}
                selectedDropOffPoint={selectedDropOffPoint}
                isSurgeActive={false}
                cartItems={cartItems}
              />
            </div>
          )}

          {/* Step 5: Contact Info */}
          {currentStep === 5 && (
            <div className="animate-in fade-in pb-4">
              <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-white border border-[#39B5A8]/10 rounded-3xl p-5 shadow-sm space-y-5">
                  <h2 className="text-base font-bold text-[#041614] flex items-center gap-2">
                    <User className="w-5 h-5 text-[#39B5A8]" /> Contact Info
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className={labelClasses}>Sender Name</label>
                      <input value={senderName} onChange={(e) => setSenderName(e.target.value)} className={inputClasses} required />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClasses}>Sender Phone</label>
                      <input value={senderPhone} onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 11) setSenderPhone(val);
                      }} className={inputClasses} type="tel" placeholder="09171234567" required />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClasses}>Receiver Name</label>
                      <input value={receiverName} onChange={(e) => setReceiverName(e.target.value)} className={inputClasses} required />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClasses}>Receiver Phone</label>
                      <input value={receiverPhone} onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 11) setReceiverPhone(val);
                      }} className={inputClasses} type="tel" placeholder="09171234567" required />
                    </div>
                  </div>

                  <PaymentMethodSelector
                    selectedMethod={selectedPaymentMethod}
                    onSelect={setSelectedPaymentMethod}
                    selectedServiceId={selectedService}
                    receiverName={receiverName}
                    receiverPhone={receiverPhone}
                    onReceiverChange={(data) => {
                      setReceiverName(data.name);
                      setReceiverPhone(data.phone);
                    }}
                  />

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Summary</span>
                      <span className="text-[10px] font-bold text-slate-400">₱{servicePrice}.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-700">Total Due</span>
                      <span className="text-lg font-black text-[#39B5A8]">₱{servicePrice}.00</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer - Fixed */}
      <footer className="shrink-0 bg-white/90 backdrop-blur-md border-t border-[#39B5A8]/10 p-4 z-40">
        <div className="max-w-4xl mx-auto">
          {currentStep !== 2 && currentStep !== 5 ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => (currentStep === 1 ? navigate("/customer/home") : setCurrentStep(currentStep - 1))}
                className={secondaryBtnClasses}
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={() => {
                  if (currentStep === 1 && (!pickupLocation || !deliveryLocation)) return showError("Select locations first.");
                  if (currentStep === 3 && cartItems.length === 0) return showError("Cart is empty.");
                  if (currentStep === 4 && !selectedService) return showError("Select a service.");
                  setCurrentStep(currentStep + 1);
                }}
                className={primaryBtnClasses}
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : currentStep === 5 ? (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setCurrentStep(4)} className={secondaryBtnClasses}>
                Review
              </button>
              <button form="booking-form" type="submit" className={`${primaryBtnClasses} bg-slate-900`}>
                Complete <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          ) : null}
        </div>
      </footer>

      {/* Modals */}
      <DropOffPointSelector isOpen={showDropOffSelector} onClose={() => setShowDropOffSelector(false)} onSelect={setSelectedDropOffPoint} />
      {showQRModal && <DropOffQRModal isOpen={showQRModal} onClose={() => navigate("/customer/dashboard")} bookingData={bookingData} />}
      {showBookingConfirmation && (
        <BookingConfirmationModal
          isOpen={showBookingConfirmation}
          onClose={() => navigate("/customer/home")}
          bookingDetails={{ ...bookingConfirmationData, totalCost: servicePrice }}
        />
      )}
      {showOnboarding && <OnboardingModal onComplete={() => setShowOnboarding(false)} />}
      {showLocationPicker && selectingFor && (
        <LocationPickerModal
          isOpen={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onSelect={selectingFor === "pickup" ? setPickupLocation : setDeliveryLocation}
          type={selectingFor}
        />
      )}
    </div>
  );
}