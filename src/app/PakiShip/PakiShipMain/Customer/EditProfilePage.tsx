import { useState, useRef, cloneElement } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Calendar, Save, 
  Camera, Lock, Eye, EyeOff, ShieldCheck, Upload, FileCheck, 
  Bell, MessageSquare, RefreshCw
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { toast } from 'sonner';
const logoImg = "/logo.png";

type TabType = 'profile' | 'discount' | 'preferences';

export function EditProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const discountIdRef = useRef<HTMLInputElement>(null);
  
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false });
  
  const [profilePicture, setProfilePicture] = useState<string | null>(
    localStorage.getItem('customerProfilePicture')
  );

  const [discountIdUploaded, setDiscountIdUploaded] = useState<boolean>(
    localStorage.getItem('discountIdUploaded') === 'true'
  );

  const [formData, setFormData] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || 'guest@pakiship.ph',
    phone: localStorage.getItem('userPhone') || '09123456789',
    address: localStorage.getItem('userAddress') || '123 Ayala Ave, Makati City',
    dob: localStorage.getItem('userDOB') || '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: localStorage.getItem('prefEmail') !== 'false', 
    smsUpdates: localStorage.getItem('prefSMS') !== 'false',          
    autoExtend: localStorage.getItem('prefAutoExtend') === 'true',     
    twoFactor: localStorage.getItem('pref2FA') === 'true',             
  });

  const [passwordData, setPasswordData] = useState({ current: '', new: '' });

  const userInitials = formData.name 
    ? formData.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
    : 'U';

  // --- HANDLERS ---
  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    const loadingToast = toast.loading('Saving changes...');
    
    setTimeout(() => {
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userPhone', formData.phone);
      localStorage.setItem('userAddress', formData.address);
      localStorage.setItem('userDOB', formData.dob);
      
      localStorage.setItem('prefEmail', String(preferences.emailNotifications));
      localStorage.setItem('prefSMS', String(preferences.smsUpdates));
      localStorage.setItem('prefAutoExtend', String(preferences.autoExtend));
      localStorage.setItem('pref2FA', String(preferences.twoFactor));
      
      window.dispatchEvent(new Event('storage'));
      
      toast.dismiss(loadingToast);
      toast.success('Profile updated successfully!');
      navigate('/customer/home');
    }, 1000);
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfilePicture(base64);
        localStorage.setItem('customerProfilePicture', base64);
        window.dispatchEvent(new Event('storage'));
        toast.success('Photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiscountIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDiscountIdUploaded(true);
      localStorage.setItem('discountIdUploaded', 'true');
      toast.success('ID uploaded for verification!');
    }
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handle2FAToggle = () => {
    if (!preferences.twoFactor) {
      setShow2FAModal(true);
    } else {
      setPreferences(prev => ({ ...prev, twoFactor: false }));
      toast.info('2FA disabled');
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#F0F9F8] text-[#1A5D56] font-sans flex flex-col overflow-hidden">
      
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #39B5A840; border-radius: 20px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #39B5A8; }
      `}</style>

      {/* Modals */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-6 border border-[#39B5A8]/20 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-[#041614]">Enable 2FA</h3>
              <button onClick={() => setShow2FAModal(false)} className="text-gray-400 hover:text-red-500 transition-colors text-xl">✕</button>
            </div>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">Two-factor authentication adds an extra layer of security to your account.</p>
            <div className="flex gap-3">
              <Button onClick={() => setShow2FAModal(false)} variant="outline" className="flex-1 rounded-xl h-11">Cancel</Button>
              <Button className="flex-1 bg-[#39B5A8] hover:bg-[#2D8F85] text-white rounded-xl h-11" onClick={() => {
                setPreferences(prev => ({ ...prev, twoFactor: true }));
                toast.success('2FA enabled!');
                setShow2FAModal(false);
              }}>Enable</Button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end md:items-center justify-center sm:p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-t-[2rem] md:rounded-[2rem] shadow-2xl w-full max-w-md p-6 pb-6 md:p-8 border border-[#39B5A8]/20 animate-in slide-in-from-bottom-full md:fade-in md:zoom-in-95 duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 md:hidden"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl md:text-2xl font-bold text-[#041614]">Security Update</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-red-500 transition-colors text-xl">✕</button>
            </div>
            <div className="space-y-3">
              <PasswordField label="Current Password" value={passwordData.current} show={showPass.current} toggle={() => setShowPass({...showPass, current: !showPass.current})} onChange={(v: string) => setPasswordData({...passwordData, current: v})} />
              <PasswordField label="New Password" value={passwordData.new} show={showPass.new} toggle={() => setShowPass({...showPass, new: !showPass.new})} onChange={(v: string) => setPasswordData({...passwordData, new: v})} />
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={() => setShowPasswordModal(false)} variant="outline" className="flex-1 rounded-xl h-12">Cancel</Button>
              <Button className="flex-1 bg-[#041614] hover:bg-[#123E3A] text-white rounded-xl h-12" onClick={() => {
                toast.success('Password updated!');
                setShowPasswordModal(false);
              }}>Update</Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="h-16 md:h-20 bg-white border-b border-[#39B5A8]/10 flex items-center justify-between px-4 md:px-12 shrink-0 z-50 sticky top-0">
        <div className="flex-1">
          <button onClick={() => navigate('/customer/home')} className="flex items-center gap-2 text-[#39B5A8] font-bold hover:bg-[#F0F9F8] px-2 md:px-4 py-2 rounded-xl transition-all">
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" /> <span className="hidden sm:inline">Back</span>
          </button>
        </div>
        <div className="flex-shrink-0 flex items-center gap-3">
          <img src={logoImg} alt="PakiSHIP" className="h-6 md:h-8 object-contain hidden md:block" />
          <h1 className="text-lg md:text-xl font-bold text-[#041614] md:hidden">Profile Settings</h1>
        </div>
        <div className="flex-1" />
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <div className="max-w-5xl mx-auto px-4 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-full w-full overflow-hidden pb-40 md:pb-6">
          
          {/* Sidebar */}
          <div className="flex flex-col md:flex-row lg:flex-col gap-4 shrink-0">
            <div className="flex-none bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-5 border border-[#39B5A8]/10 shadow-sm flex flex-row lg:flex-col items-center gap-4 lg:gap-3">
              <div className="relative inline-block shrink-0">
                <div className="size-16 md:size-28 rounded-2xl md:rounded-[2rem] bg-[#1A5D56] overflow-hidden border-2 md:border-4 border-[#F0F9F8] shadow-lg flex items-center justify-center">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl md:text-5xl font-black text-white">{userInitials}</span>
                  )}
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-[#39B5A8] text-white p-2 rounded-xl shadow-xl hover:bg-[#2D8F85] border-2 border-white transition-all">
                  <Camera className="w-4 h-4" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleProfileUpload} className="hidden" accept="image/*" />
              </div>
              <div className="flex-1 min-w-0 lg:text-center">
                <h2 className="text-lg md:text-2xl font-black text-[#041614] truncate">{formData.name}</h2>
                <p className="text-xs text-[#39B5A8] font-bold mt-1">Customer Account</p>
              </div>
            </div>

            <div className="bg-white rounded-[1.5rem] p-4 border border-[#39B5A8]/10 shadow-sm hidden md:block">
              <h3 className="font-bold text-[#041614] mb-3 flex items-center gap-2 text-xs uppercase tracking-wider">
                <Lock className="w-4 h-4 text-[#39B5A8]" /> Security
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-3 py-3 border border-[#39B5A8]/10 rounded-xl bg-[#F0F9F8]/50">
                  <span className="text-sm font-bold text-[#041614] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#39B5A8]" /> 2FA
                  </span>
                  <MiniToggle checked={preferences.twoFactor} onChange={handle2FAToggle} />
                </div>
                <Button onClick={() => setShowPasswordModal(true)} variant="outline" className="w-full justify-start rounded-xl h-11 border-[#39B5A8]/20 hover:bg-[#F0F9F8] font-bold text-sm">Change Password</Button>
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-2 flex flex-col h-full min-h-0">
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 shrink-0">
              <div className="flex w-full sm:w-auto bg-white p-1 rounded-2xl border border-[#39B5A8]/10 shadow-sm">
                {(['profile', 'discount', 'preferences'] as TabType[]).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 px-4 md:px-7 py-1 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-[#F0F9F8] text-[#39B5A8] shadow-sm' : 'text-gray-400 hover:text-[#041614]'}`}>
                    {tab === 'discount' ? 'Special Discount' : tab}
                  </button>
                ))}
              </div>
              <Button onClick={() => handleSave()} className="hidden sm:flex bg-[#39B5A8] hover:bg-[#2D8F85] text-white px-8 rounded-2xl h-12 font-bold shadow-lg shadow-[#39B5A8]/20 transition-all active:scale-95 text-base">
                <Save className="w-5 h-5 mr-2" /> Save Changes
              </Button>
            </div>

            {/* Scrollable Container */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border border-[#39B5A8]/10 shadow-sm">
              
              {activeTab === 'profile' && (
                <form className="animate-in fade-in duration-300 space-y-4">
                  <h2 className="text-xl md:text-3xl mb-0 -mt-2 font-black text-[#041614]">Personal Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
                    <FormInput icon={<User />} label="Full Name" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
                    <FormInput icon={<Mail />} label="Email Address" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} />
                    <FormInput icon={<Phone />} label="Phone Number" value={formData.phone} onChange={(v: string) => setFormData({...formData, phone: v})} />
                    <FormInput icon={<Calendar />} label="Birth Date" type="date" value={formData.dob} onChange={(v: string) => setFormData({...formData, dob: v})} />
                    <div className="md:col-span-2">
                      <FormInput icon={<MapPin />} label="Primary Address" value={formData.address} onChange={(v: string) => setFormData({...formData, address: v})} />
                    </div>
                  </div>
                </form>
              )}
              
              {activeTab === 'discount' && (
                <div className="animate-in fade-in duration-300 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-[#F0F9F8] rounded-2xl text-[#39B5A8]">
                      <FileCheck className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-3xl font-black text-[#041614]">Special Discount</h2>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">Upload valid ID for automatic discounts.</p>
                    </div>
                  </div>

                  {discountIdUploaded ? (
                    <div className="bg-[#F0F9F8] border border-[#39B5A8]/30 rounded-[2rem] p-6 md:p-8 text-center">
                      <ShieldCheck className="w-14 h-14 text-[#39B5A8] mx-auto mb-4" />
                      <p className="text-xl font-bold text-[#1A5D56]">ID Uploaded Successfully</p>
                      <p className="text-base text-[#39B5A8] mt-2">Pending admin verification.</p>
                      <button onClick={() => discountIdRef.current?.click()} className="text-sm font-bold text-gray-500 underline mt-6 hover:text-[#39B5A8]">
                        Upload different ID
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => discountIdRef.current?.click()}
                      className="border-2 border-dashed border-[#39B5A8]/30 bg-[#F9FCFC] rounded-[2rem] p-8 md:p-10 text-center cursor-pointer hover:bg-[#F0F9F8] transition-colors group"
                    >
                      <Upload className="w-14 h-14 text-gray-300 group-hover:text-[#39B5A8] mx-auto mb-4 transition-colors" />
                      <p className="text-lg md:text-xl font-bold text-[#041614]">Tap to Upload ID Document</p>
                      <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG or PDF (Max 5MB)</p>
                    </div>
                  )}
                  <input type="file" ref={discountIdRef} onChange={handleDiscountIdUpload} className="hidden" accept="image/png, image/jpeg, application/pdf" />
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="animate-in fade-in duration-300 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-[#F0F9F8] rounded-2xl text-[#39B5A8]"><Bell className="w-8 h-8" /></div>
                    <h2 className="text-xl md:text-3xl font-black text-[#041614]">Preferences</h2>
                  </div>
                  <div className="space-y-2">
                    <CustomToggle icon={<Mail />} label="Email Notifications" description="Booking confirmations and updates via email." checked={preferences.emailNotifications} onChange={() => togglePreference('emailNotifications')} />
                    <CustomToggle icon={<MessageSquare />} label="SMS Updates" description="Real-time text alerts for deliveries." checked={preferences.smsUpdates} onChange={() => togglePreference('smsUpdates')} />
                    <CustomToggle icon={<RefreshCw />} label="Auto-Extend Booking" description="Automatically extend expiring storage." checked={preferences.autoExtend} onChange={() => togglePreference('autoExtend')} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Fixed Bottom Actions */}
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#39B5A8]/10 p-4 pb-8 flex flex-col gap-3 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)] z-[60]">
          <div className="flex items-center justify-between px-4 py-3 border-2 border-[#39B5A8]/10 rounded-2xl bg-[#F0F9F8]/30">
            <span className="text-sm font-bold text-[#39B5A8] flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> 2FA Security</span>
            <MiniToggle checked={preferences.twoFactor} onChange={handle2FAToggle} />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowPasswordModal(true)} className="flex-1 h-14 text-[#39B5A8] font-bold text-sm flex items-center justify-center gap-2 border-2 border-[#39B5A8]/10 rounded-2xl bg-white active:bg-slate-50 transition-colors">
              <Lock className="w-5 h-5" /> Password
            </button>
            <Button onClick={() => handleSave()} className="flex-[1.5] bg-[#39B5A8] h-14 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-lg shadow-[#39B5A8]/20">
              <Save className="w-5 h-5 mr-2" /> Save All
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- INTERNAL HELPERS ---

function FormInput({ icon, label, value, onChange, type = "text" }: any) {
  return (
    // 1. Changed 'space-y-1' to 'space-y-0' to remove the gap between label and input
    <div className="space-y-0"> 
      <label className="text-[10px] md:text-xs font-black text-[#39B5A8] uppercase tracking-[0.2em] ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#39B5A8]/60">
          {icon && cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <Input 
          type={type} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-full bg-[#F0F9F8] border-2 border-transparent focus:border-[#39B5A8]/30 rounded-2xl pl-12 pr-4 h-9 text-sm md:text-base font-bold transition-all shadow-sm -mt-0.5" 
        />
      </div>
    </div>
  );
}

function PasswordField({ label, value, show, toggle, onChange }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <Input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl pr-12 bg-[#F0F9F8] border-transparent focus:border-[#39B5A8]/30 h-12 text-base font-bold" />
        <button type="button" onClick={toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#39B5A8]">
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

function CustomToggle({ icon, label, description, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-4 pr-4">
        <div className="mt-1 text-[#39B5A8] shrink-0">
          {icon && cloneElement(icon, { className: "w-6 h-6" })}
        </div>
        <div>
          <p className="text-base font-bold text-[#041614] leading-tight">{label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <button type="button" onClick={onChange} className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#39B5A8]' : 'bg-gray-200'}`}>
        <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

function MiniToggle({ checked, onChange }: any) {
  return (
    <button type="button" onClick={onChange} className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#39B5A8]' : 'bg-gray-200'}`}>
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}