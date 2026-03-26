import { useState, useRef, forwardRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Send,
  MapPin,
  History,
  Star,
  Package,
  LogOut,
  ChevronRight,
  Clock,
  Camera,
  User,
  HelpCircle,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Mail,
  Phone,
  Info,
  AlertTriangle,
  Sparkles,
  Bell,
  Truck,
  AlertCircle,
  Gift,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type Announcement = {
  id: string;
  type: "system" | "update";
  title: string;
  message: string;
  isPinned: boolean;
};

export type Notification = {
  id: string;
  type: "delivery" | "system" | "promo";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
};

// ─── Assets ──────────────────────────────────────────────────────────────────

const logoImg = "/logo.png";

const sendParcelIcon = "https://i.imgur.com/a6gHhtu.png";
const trackPackageIcon = "https://i.imgur.com/HHNarFY.png";
const historyIcon = "https://i.imgur.com/4Xgmx8D.png";
const rateReviewIcon = "https://i.imgur.com/pvzfoIz.png";
const sadMascotImg = "https://i.imgur.com/6bx4yV2.png";
const mascotWavingImg = "https://i.imgur.com/G4RbCRo.png";
const mascotWinkingImg = "https://i.imgur.com/0RM52cS.png";
const mascotMotorcycleImg = "https://i.imgur.com/7ywKdmd.png";
const mascotThinkingImg = "https://i.imgur.com/gDo17NY.png";

// ─── Main Component ──────────────────────────────────────────────────────────

export function CustomerHomePage() {
  const navigate = useNavigate();

  // Profile & UI State
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userName, setUserName] = useState("Guest User");

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "delivery",
      title: "Package In Transit",
      message: "Your parcel PKS-2024-001 is on its way to Makati City.",
      time: "2 mins ago",
      isRead: false,
    },
    {
      id: "2",
      type: "promo",
      title: "Weekend Flash Sale!",
      message: "Get 20% off on all inter-city deliveries this Saturday.",
      time: "1 hour ago",
      isRead: false,
    },
    {
      id: "3",
      type: "system",
      title: "Security Update",
      message: "Your password was successfully changed.",
      time: "5 hours ago",
      isRead: true,
    },
  ]);

  // Announcements State
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "maint-001",
      type: "system",
      title: "Scheduled Maintenance",
      message: "System will be offline on March 15, 2:00 AM - 4:00 AM PHT.",
      isPinned: true,
    },
    {
      id: "lipa-hub-2024",
      type: "update",
      title: "New Partner Hubs!",
      message: "Expanded locations in Lipa City.",
      isPinned: false,
    },
  ]);

  // Refs for Tutorial Spotlight
  const fileInputRef = useRef<HTMLInputElement>(null);
  const actionCardsRef = useRef<HTMLDivElement>(null);
  const sendParcelRef = useRef<HTMLButtonElement>(null);
  const trackPackageRef = useRef<HTMLButtonElement>(null);
  const historyRef = useRef<HTMLButtonElement>(null);
  const rateReviewRef = useRef<HTMLButtonElement>(null);
  const activeDeliveriesRef = useRef<HTMLDivElement>(null);
  const guideButtonRef = useRef<HTMLButtonElement>(null);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAllNotifs = () => {
    setNotifications([]);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleTrackParcel = (trackingId: string) => {
    navigate("/customer/track-package", {
      state: { trackingNumber: trackingId },
    });
  };

  const dismissAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    localStorage.setItem(`dismissed_${id}`, "true");
  };

  // ─── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const syncProfileData = () => {
      const storedName = localStorage.getItem("userName");
      const storedImg = localStorage.getItem("customerProfilePicture");
      if (storedName) setUserName(storedName);
      if (storedImg) setProfileImage(storedImg);
    };

    syncProfileData();
    window.addEventListener("storage", syncProfileData);
    const hasShownTutorial = localStorage.getItem("hasShownCustomerTutorial");
    if (!hasShownTutorial) setShowTutorial(true);

    return () => window.removeEventListener("storage", syncProfileData);
  }, []);

  useEffect(() => {
    setAnnouncements((prev) =>
      prev.filter((a) => !localStorage.getItem(`dismissed_${a.id}`))
    );
  }, []);

  return (
    <div className="h-screen w-full bg-[#F0F9F8] text-[#1A5D56] font-sans overflow-hidden flex flex-col">
      {showTutorial && (
        <Tutorial
          step={tutorialStep}
          onNext={() => setTutorialStep(tutorialStep + 1)}
          onPrev={() => setTutorialStep(tutorialStep - 1)}
          onClose={() => {
            setShowTutorial(false);
            setTutorialStep(0);
            localStorage.setItem("hasShownCustomerTutorial", "true");
          }}
          actionCardsRef={actionCardsRef}
          sendParcelRef={sendParcelRef}
          trackPackageRef={trackPackageRef}
          historyRef={historyRef}
          rateReviewRef={rateReviewRef}
          activeDeliveriesRef={activeDeliveriesRef}
          guideButtonRef={guideButtonRef}
        />
      )}

      {/* Header */}
      <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-12 border-b border-[#39B5A8]/10 bg-white/80 backdrop-blur-md shrink-0 z-50">
        <img src={logoImg} alt="PakiSHIP" className="h-9 md:h-9" />

        <div className="flex items-center gap-2 md:gap-4">
          <NotificationDropdown
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAllNotifs}
          />

          <button
            ref={guideButtonRef}
            onClick={() => {
              setShowTutorial(true);
              setTutorialStep(0);
            }}
            className="p-2 hover:bg-[#39B5A8]/5 rounded-xl transition-colors text-[#39B5A8] border border-[#39B5A8]/20 active:scale-95"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 md:pr-4 md:border-r border-[#39B5A8]/10">
            <div className="text-right hidden sm:block">
              <p className="text-[#041614] font-bold text-sm leading-none">
                {userName}
              </p>
              <p className="text-[#39B5A8] text-[9px] font-bold uppercase tracking-widest mt-1">
                Verified
              </p>
            </div>

            <button
              onClick={() => navigate("/customer/edit-profile")}
              className="relative w-9 h-9 md:w-10 md:h-10 rounded-full group overflow-hidden border-2 border-[#39B5A8]/20 hover:border-[#39B5A8] transition-all"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#E6F4F2] flex items-center justify-center">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-[#39B5A8]" />
                </div>
              )}
            </button>
          </div>

          <button
            className="p-2 hover:bg-red-50 rounded-xl transition-colors text-red-500 active:scale-95"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
      />

      <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-4 md:px-12 py-3 md:py-8 flex flex-col">
        {/* Announcements Section */}
        {announcements.length > 0 && (
          <div className="mb-3 md:mb-6 space-y-2 md:space-y-3 shrink-0">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className={`flex items-start md:items-center justify-between p-3 md:p-4 rounded-2xl border animate-in fade-in slide-in-from-top-4 duration-500 ${
                  ann.type === "system"
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-[#39B5A8]/10 border-[#39B5A8]/20 text-[#1A5D56]"
                }`}
              >
                <div className="flex items-start md:items-center gap-3 md:gap-4">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      ann.type === "system" ? "bg-amber-100" : "bg-white"
                    }`}
                  >
                    {ann.type === "system" ? (
                      <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#39B5A8]" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-[11px] md:text-sm uppercase tracking-tight leading-tight">
                      {ann.title}
                    </h4>
                    <p className="text-[11px] md:text-xs opacity-80 font-medium leading-tight mt-0.5">
                      {ann.message}
                    </p>
                  </div>
                </div>
                {!ann.isPinned && (
                  <button
                    onClick={() => dismissAnnouncement(ann.id)}
                    className="p-1.5 hover:bg-black/5 rounded-lg transition-colors shrink-0"
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <h2 className="text-[14px] md:text-sm font-bold text-[#39B5A8] uppercase tracking-[0.15em] mb-6 md:mb-10 shrink-0">
          Navigation Menu
        </h2>

        <div
          ref={actionCardsRef}
          className="grid grid-cols-2 gap-6 md:gap-10 mb-3 md:mb-16 -mt-4 pt-4 shrink-0 max-w-5xl mx-auto w-full"
        >
          <ActionCard
            ref={sendParcelRef}
            image={sendParcelIcon}
            title="Send Parcel"
            desc="Book a delivery"
            accentColor="bg-[#FDB833]/10"
            onClick={() => navigate("/customer/send-parcel")}
          />
          <ActionCard
            ref={trackPackageRef}
            image={trackPackageIcon}
            title="Track Package"
            desc="Live tracking"
            accentColor="bg-[#54A0CC]/10"
            onClick={() => navigate("/customer/track-package")}
          />
          <ActionCard
            ref={historyRef}
            image={historyIcon}
            title="History"
            desc="Past deliveries"
            accentColor="bg-[#39B5A8]/10"
            onClick={() => navigate("/customer/history")}
          />
          <ActionCard
            ref={rateReviewRef}
            image={rateReviewIcon}
            title="Rate & Review"
            desc="Give feedback"
            accentColor="bg-[#A6DCD6]/20"
            onClick={() => navigate("/customer/rate-review")}
          />
        </div>

        <div
          ref={activeDeliveriesRef}
          className="flex items-center justify-between mb-3 shrink-0"
        >
          <h2 className="text-lg md:text-2xl font-black font-bold text-[#041614]">
            Active Deliveries
          </h2>
          <button
            onClick={() => navigate("/customer/track-package")}
            className="text-[#39B5A8] font-bold text-[11px] md:text-sm hover:underline flex items-center gap-1 p-1"
          >
            View All <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>

        <div className="space-y-2.5 md:space-y-4 pb-2">
          <DeliveryItem
            id="PKS-2024-001"
            location="Makati City"
            time="15 mins away"
            status="In Transit"
            statusClass="text-[#54A0CC] bg-[#54A0CC]/10"
            onTrack={() => handleTrackParcel("PKS-2024-001")}
          />
          <DeliveryItem
            id="PKS-2024-002"
            location="Quezon City"
            time="30 mins away"
            status="Out for Delivery"
            statusClass="text-[#FDB833] bg-[#FDB833]/10"
            onTrack={() => handleTrackParcel("PKS-2024-002")}
          />
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-[#041614]/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
          <div className="relative bg-white rounded-[2rem] md:rounded-[2.5rem] max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300 overflow-visible pt-16 md:pt-28 pb-6 md:pb-8 px-6 md:px-8 mt-12">
            <div className="absolute -top-16 md:-top-24 left-1/2 -translate-x-1/2 w-32 md:w-48 h-32 md:h-48 pointer-events-none drop-shadow-2xl">
              <img
                src={sadMascotImg}
                alt="Sad Mascot"
                className="w-full h-full object-contain"
              />
            </div>

            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-[#041614] p-2 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setShowLogoutModal(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-black text-[#041614] mb-2 leading-tight">
                Your parcels will miss you!
              </h2>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium">
                Logging out means your active deliveries won't be tracked here.
                Sure about this?
              </p>
            </div>

            <div className="flex flex-col gap-2 md:gap-3">
              <button
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-red-500 text-white rounded-2xl font-black text-xs md:text-sm hover:bg-red-600 shadow-lg active:scale-95 transition-all"
                onClick={() => navigate("/")}
              >
                <LogOut className="w-4 h-4" />
                Yes, Sign Me Out
              </button>
              <button
                className="w-full py-3.5 font-bold text-[#39B5A8] hover:bg-[#39B5A8]/5 rounded-2xl transition-all text-xs md:text-sm"
                onClick={() => setShowLogoutModal(false)}
              >
                Keep Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-Components ─────────────────────────────────────────────────────────────

// 1. Notification Dropdown (As requested)
interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "delivery":
        return <Truck className="w-4 h-4 text-[#39B5A8]" />;
      case "system":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case "promo":
        return <Gift className="w-4 h-4 text-purple-500" />;
      default:
        return <Package className="w-4 h-4 text-[#39B5A8]" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case "delivery":
        return "bg-[#E6F4F2]";
      case "system":
        return "bg-amber-50";
      case "promo":
        return "bg-purple-50";
      default:
        return "bg-[#E6F4F2]";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 hover:bg-[#39B5A8]/5 rounded-full transition-colors border border-[#39B5A8]/20 group"
      >
        <Bell className="w-5 h-5 text-[#39B5A8] group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

  {isOpen && (
  <>
    {/* Minimal backdrop for focus */}
    <div className="fixed inset-0 z-[55] md:hidden" onClick={() => setIsOpen(false)} />
    
    <div className="
      /* Small & Floating on Mobile | Standard on Desktop */
      fixed md:absolute 
      right-4 top-17 md:top-auto md:right-0 md:mt-2
      
      /* Reduced Width: 280px is the sweet spot for 'small' */
      w-[280px] md:w-80 
      
      /* Styling: Tighter corners and cleaner borders */
      bg-white rounded-2xl md:rounded-2xl 
      shadow-xl border border-[#39B5A8]/20 
      overflow-hidden z-[60] 
      animate-in fade-in zoom-in-95 duration-200 
      max-h-[60vh] md:max-h-[500px] 
      flex flex-col
    ">
      {/* Compact Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-[#F0F9F8]/30">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#041614] uppercase tracking-wider">
            Notifications ({unreadCount})
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-red-500 p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tighter Notifications List */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <p className="text-[11px] font-bold text-gray-400">All caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 border-b border-gray-50 active:bg-gray-50 transition-colors cursor-pointer ${
                !notification.isRead ? "bg-[#F0F9F8]/40" : ""
              }`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg ${getNotificationBgColor(notification.type)} flex items-center justify-center shrink-0`}>
                  {/* Smaller icons for the 'small' look */}
                  <div className="scale-75">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-black text-[#041614] leading-tight truncate">
                    {notification.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 line-clamp-2 leading-snug mt-0.5">
                    {notification.message}
                  </p>
                  <span className="text-[10px] text-gray-400 font-bold mt-2 inline-block">
                    {notification.time}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </>
)}
    </div>
  );
}

// 2. Action Card
const ActionCard = forwardRef<
  HTMLButtonElement,
  {
    image?: string;
    title: string;
    desc: string;
    accentColor: string;
    onClick?: () => void;
  }
>(({ image, title, desc, accentColor, onClick }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className="relative flex flex-col items-center justify-end w-full h-[120px] md:h-[200px] p-3 md:p-5 bg-white border border-[#39B5A8]/15 rounded-[2rem] shadow-sm active:scale-95 active:bg-gray-50 active:border-[#39B5A8] transition-transform overflow-visible"
    >
      <div
        className={`absolute inset-0 opacity-10 rounded-[2rem] ${accentColor}`}
      />

      {image && (
        <div className="absolute -top-6 md:-top-10 left-1/2 -translate-x-1/2 w-20 h-20 md:w-36 md:h-36 pointer-events-none z-20 drop-shadow-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div className="relative z-10 w-full text-center">
        <div className="mx-auto w-6 h-1 rounded-full bg-[#39B5A8]/30 mb-2" />
        <h3 className="text-[#041614] font-black text-xs md:text-lg leading-tight">
          {title}
        </h3>
        <p className="text-gray-400 text-[10px] md:text-sm font-bold uppercase tracking-tight mt-0.5">
          {desc}
        </p>
      </div>
    </button>
  );
});

// 3. Delivery Item
function DeliveryItem({
  id,
  location,
  time,
  status,
  statusClass,
  onTrack,
}: {
  id: string;
  location: string;
  time: string;
  status: string;
  statusClass: string;
  onTrack?: () => void;
}) {
  return (
    <div className="bg-white border border-[#39B5A8]/20 rounded-xl md:rounded-[1.2rem] p-2 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3 hover:border-[#39B5A8] hover:bg-[#F0F9F8]/30 transition-all shadow-sm group shrink-0">
      <div className="flex items-center gap-3 md:gap-5">
        <div className="w-10 h-10 md:w-14 md:h-14 bg-[#39B5A8]/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-[#39B5A8]/20 shrink-0">
          <Package className="w-5 h-5 md:w-7 md:h-7 text-[#39B5A8]" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-[#1A5D56] font-black text-sm md:text-lg leading-none">
              {id}
            </h4>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#39B5A8] rounded-full animate-pulse" />
          </div>
          <p className="text-slate-500 text-[10px] md:text-sm font-medium mt-0.5">
            {location}
          </p>
          <div className="flex items-center gap-1 mt-0.5 text-[#39B5A8] text-[9px] md:text-xs font-bold">
            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span>{time}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3 md:gap-8 border-t border-gray-100 md:border-t-0 pt-2 md:pt-0 mt-1 md:mt-0">
        <div className="flex flex-col items-start md:items-end justify-center">
          <span className="text-[8px] md:text-[10px] text-[#39B5A8]/60 font-black uppercase tracking-[0.2em] mb-0.5 md:mb-1 hidden sm:block">
            Status
          </span>
          <span
            className={`text-[9px] md:text-sm font-black uppercase tracking-wider px-2 md:px-3 py-1 rounded-md md:rounded-lg ${statusClass}`}
          >
            {status}
          </span>
        </div>

        <button
          onClick={onTrack}
          className="bg-[#39B5A8] text-white px-3 md:px-8 py-2 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-[#2D8F85] transition-all shadow-lg shadow-[#39B5A8]/20 active:scale-95 flex items-center justify-center gap-1.5 w-auto"
        >
          Track <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  );
}

// 4. Tutorial Component (Updated for Action Cards)
function Tutorial({
  step,
  onNext,
  onPrev,
  onClose,
  actionCardsRef,
  sendParcelRef,
  trackPackageRef,
  historyRef,
  rateReviewRef,
  activeDeliveriesRef,
  guideButtonRef,
}: any) {
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const steps = [
    {
      title: "Welcome to PakiSHIP!",
      content:
        "Hi there! I'm your guide. Let me show you around your dashboard.",
      image: mascotWavingImg,
      targetRef: null,
    },
    {
      title: "Quick Actions",
      content:
        "These cards are your main tools! Book, track, view history, or add a rate & review.",
      image: mascotWinkingImg,
      targetRef: actionCardsRef,
    },
    {
      title: "Send Parcel",
      content: "Need to send something? Start booking here.",
      image: sendParcelIcon,
      targetRef: sendParcelRef,
    },
    {
      title: "Track Package",
      content: "See real-time updates of your parcels. No more guessing!",
      image: trackPackageIcon,
      targetRef: trackPackageRef,
    },
    {
      title: "History",
      content: "All your past deliveries are stored here for easy review.",
      image: historyIcon,
      targetRef: historyRef,
    },
    {
      title: "Rate & Review",
      content:
        "Help us improve by rating your experience! We value your feedback.",
      image: rateReviewIcon,
      targetRef: rateReviewRef,
    },
    {
      title: "Active Deliveries",
      content: "Ongoing deliveries are listed here for quick access.",
      image: mascotMotorcycleImg,
      targetRef: activeDeliveriesRef,
    },
    {
      title: "Need Help?",
      content: "Click 'Guide' anytime to see this again. Happy shipping!",
      image: mascotThinkingImg,
      targetRef: guideButtonRef,
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  useEffect(() => {
    const targetRef = currentStep.targetRef;

    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    const updateHighlight = () => {
      if (targetRef?.current) {
        const rect = targetRef.current.getBoundingClientRect();
        // Fully visible spotlight for Action Cards (Handles Mascot Heads)
        const isActionCard = rect.height > 100 && rect.width > 100;
        const padding = isActionCard ? 24 : 12;
        const topOffset = isActionCard ? 40 : 6;

        setHighlightRect({
          left: rect.left - padding,
          top: rect.top - topOffset,
          width: rect.width + padding * 2,
          height: rect.height + topOffset + padding,
        } as DOMRect);
      } else {
        setHighlightRect(null);
      }
    };

    updateHighlight();
    const timeout = setTimeout(updateHighlight, 400);

    window.addEventListener("scroll", updateHighlight, true);
    window.addEventListener("resize", updateHighlight);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", updateHighlight, true);
      window.removeEventListener("resize", updateHighlight);
    };
  }, [step, currentStep.targetRef]);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[59]">
        <svg className="w-full h-full">
          <defs>
            <mask id="spotlight-mask-customer">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={highlightRect ? highlightRect.left : "50%"}
                y={highlightRect ? highlightRect.top : "50%"}
                width={highlightRect ? highlightRect.width : 0}
                height={highlightRect ? highlightRect.height : 0}
                rx="24"
                fill="black"
                style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(4, 22, 20, 0.6)"
            mask="url(#spotlight-mask-customer)"
            className="transition-opacity duration-300"
          />
        </svg>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-6 z-[60] w-[calc(100vw-2rem)] md:w-[350px] pointer-events-auto">
        <div className="relative flex justify-center mb-0">
          <div className="w-20 h-20 md:w-28 md:h-28 drop-shadow-2xl z-10 pointer-events-none">
            <img
              key={currentStep.image}
              src={currentStep.image}
              alt="Guide Mascot"
              className="w-full h-full object-contain animate-in zoom-in-75 duration-300"
            />
          </div>
        </div>

        <div className="bg-white border border-[#39B5A8]/20 text-[#1A5D56] p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl -mt-6 pt-10 md:pt-10">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-1 bg-[#F0F9F8] rounded-full text-[#39B5A8] text-[9px] font-black uppercase tracking-widest">
              Step {step + 1}/{steps.length}
            </span>
            <button
              className="text-gray-300 hover:text-red-500 transition-colors p-1"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-base md:text-lg font-black text-[#041614] mb-1.5">
            {currentStep.title}
          </h2>
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium mb-5">
            {currentStep.content}
          </p>

          <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
            <button 
              onClick={onPrev} 
              disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2 text-[#39B5A8] font-black text-xs uppercase tracking-widest disabled:opacity-0 transition-all"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#39B5A8] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              onClick={isLastStep ? onClose : onNext}
            >
              {isLastStep ? "Finish" : "Next"}{" "}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}