import React, { useMemo, useState, useEffect } from "react";
import {
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  ShieldCheck,
  AlertCircle,
  Save,
  Loader2,
  ChevronRight,
  ChevronDown,
  Building2,
  Lock,
  Search,
} from "lucide-react";

// Official Assets
const gcashLogo = "https://i.postimg.cc/RCJfrggQ/37.png";
const mayaLogo = "https://i.postimg.cc/vmS1kn90/38.png";

interface Contact {
  id: number;
  name: string;
  phone: string;
  address: string;
  initial: string;
  frequency: number;
  lastUsed: number;
}

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
  selectedServiceId: string;
  receiverName: string;
  receiverPhone: string;
  onReceiverChange: (data: { name: string; phone: string }) => void;
}

const normalizePhone = (raw: string = "") => raw.replace(/\s+/g, "").trim();
const isLikelyPHMobile = (phone: string = "") => /^09\d{9}$/.test(phone);

export default function PaymentMethodSelector({
  selectedMethod,
  onSelect,
  selectedServiceId,
  receiverName,
  receiverPhone,
  onReceiverChange,
}: PaymentMethodSelectorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // LOGIC: Cash is ONLY allowed for PakiExpress
  const isCashAllowed = selectedServiceId?.toLowerCase() === "pakiexpress";
  
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: "Alyssa", phone: "09171234567", address: "Quezon City", initial: "A", frequency: 5, lastUsed: Date.now() - 864000000 },
    { id: 2, name: "Mario", phone: "09187654321", address: "Makati BGC", initial: "M", frequency: 2, lastUsed: Date.now() - 518400000 },
    { id: 3, name: "Kuya Jojo", phone: "09192223333", address: "Bulacan Hub", initial: "K", frequency: 1, lastUsed: Date.now() - 172800000 },
  ]);

  const normalizedReceiverPhone = useMemo(() => normalizePhone(receiverPhone), [receiverPhone]);
  const matchedContact = useMemo(() => contacts.find((c) => normalizePhone(c.phone) === normalizedReceiverPhone) || null, [contacts, normalizedReceiverPhone]);
  const isAlreadySaved = !!matchedContact;

  // Auto-switch away from Cash if the service changes to something other than PakiExpress
  useEffect(() => {
    if (!isCashAllowed && selectedMethod === 'cash') {
      onSelect('gcash'); 
      setExpandedSection('ewallet');
    }
  }, [selectedServiceId, selectedMethod, onSelect, isCashAllowed]);

  const handleContactSelect = (contact: Contact) => {
    onReceiverChange({ name: contact.name, phone: contact.phone });
    setContacts((prev) => 
      prev.map(c => c.id === contact.id ? { ...c, frequency: c.frequency + 1, lastUsed: Date.now() } : c)
    );
  };

  const handleSaveContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSaving || hasSaved || isAlreadySaved || !receiverName.trim() || !isLikelyPHMobile(normalizedReceiverPhone)) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasSaved(true);
      const newContact: Contact = {
        id: Date.now(),
        name: receiverName.trim(),
        phone: normalizedReceiverPhone,
        address: "Saved Contact",
        initial: receiverName.trim().charAt(0).toUpperCase() || "N",
        frequency: 1,
        lastUsed: Date.now(),
      };
      setContacts(prev => [newContact, ...prev]);
      setTimeout(() => setHasSaved(false), 2500);
    }, 900);
  };

  const bankOptions = [
    { id: "bdo", name: "BDO Unibank" },
    { id: "bpi", name: "BPI" },
    { id: "unionbank", name: "UnionBank" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 antialiased p-2">
      
      {/* SECTION 1: CONTACTS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Frequent Recipients</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        
        <div className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-hide">
          {contacts.sort((a, b) => b.frequency - a.frequency).map((contact) => (
            <button
              key={contact.id}
              type="button"
              onClick={() => handleContactSelect(contact)}
              className={`flex-shrink-0 flex items-center gap-3 pl-2 pr-5 py-2 rounded-full border-2 transition-all ${
                normalizedReceiverPhone === normalizePhone(contact.phone) 
                ? "bg-[#39B5A8] border-[#39B5A8] text-white shadow-md scale-105" 
                : "bg-white border-slate-100"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${normalizedReceiverPhone === normalizePhone(contact.phone) ? "bg-white text-[#39B5A8]" : "bg-slate-100 text-slate-500"}`}>{contact.initial}</div>
              <div className="text-left">
                <p className="text-xs font-bold">{contact.name}</p>
                <p className="text-[10px] opacity-80">{contact.phone}</p>
              </div>
            </button>
          ))}
          <button type="button" className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {receiverName && (
          <div className="bg-slate-50/80 border border-slate-100 rounded-[2rem] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${hasSaved || isAlreadySaved ? "bg-[#39B5A8] text-white rotate-[360deg]" : "bg-white text-slate-400 shadow-sm"}`}>
                {hasSaved || isAlreadySaved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{isAlreadySaved ? "Contact Verified" : "Save recipient?"}</h4>
                <p className="text-[10px] text-slate-500">{isAlreadySaved ? "Already in your book." : "Quick add to contacts."}</p>
              </div>
            </div>
            {!isAlreadySaved && (
              <button 
                type="button"
                onClick={handleSaveContact} 
                disabled={isSaving || !isLikelyPHMobile(normalizedReceiverPhone)} 
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : hasSaved ? "Saved!" : "Save"}
              </button>
            )}
          </div>
        )}
      </section>

      {/* SECTION 2: PAYMENT METHODS */}
      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#39B5A8]/10 rounded-lg"><CreditCard className="w-5 h-5 text-[#39B5A8]" /></div>
            <h3 className="text-md font-black text-slate-900">Payment Method</h3>
          </div>
          {!isCashAllowed && (
            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-1 animate-pulse">
              <AlertCircle className="w-3 h-3" /> PakiExpress exclusive for Cash payments
            </p>
          )}
        </div>

        <div className="space-y-3">
          {/* 1. CASH ON DELIVERY (RESTRICTED LOGIC) */}
          <button 
            type="button"
            onClick={() => {
              if (isCashAllowed) {
                onSelect('cash');
                setExpandedSection(null);
              }
            }}
            className={`w-full p-4 flex items-center justify-between border-2 rounded-[1.5rem] transition-all relative overflow-hidden ${
              !isCashAllowed 
                ? 'bg-slate-50 border-slate-100 cursor-not-allowed opacity-60' 
                : selectedMethod === 'cash' 
                  ? 'border-[#39B5A8] bg-white shadow-sm' 
                  : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${!isCashAllowed ? 'bg-slate-200 text-slate-400' : 'bg-emerald-50 text-emerald-500'}`}>
                {isCashAllowed ? <Banknote className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-800">Cash on Delivery</p>
                  {!isCashAllowed && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded font-black uppercase">Locked</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  {isCashAllowed ? 'Pay upon arrival' : 'Only available for PakiExpress'}
                </p>
              </div>
            </div>
            {selectedMethod === 'cash' && isCashAllowed && <CheckCircle className="w-4 h-4 text-[#39B5A8]" />}
          </button>

          {/* 2. E-WALLET SECTION */}
          <div className={`border-2 rounded-[1.5rem] transition-all overflow-hidden ${expandedSection === 'ewallet' ? 'border-[#39B5A8] bg-white' : 'border-slate-100 bg-white'}`}>
            <button 
              type="button"
              onClick={() => setExpandedSection(expandedSection === 'ewallet' ? null : 'ewallet')}
              className="w-full p-4 flex items-center justify-between outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><Smartphone className="w-5 h-5" /></div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">E-Wallet</p>
                  <p className="text-[10px] text-slate-400">GCash or Maya</p>
                </div>
              </div>
              {expandedSection === 'ewallet' ? <ChevronDown className="w-4 h-4 text-[#39B5A8]" /> : <ChevronRight className="w-4 h-4 text-slate-300" />}
            </button>
            
            {expandedSection === 'ewallet' && (
              <div className="p-2 bg-slate-50 flex flex-col gap-2">
                <button 
                  type="button"
                  onClick={() => onSelect('gcash')}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${selectedMethod === 'gcash' ? 'bg-white shadow-sm ring-1 ring-[#39B5A8]' : 'hover:bg-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-slate-100 p-1">
                      <img src={gcashLogo} alt="GCash" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">GCash</span>
                  </div>
                  {selectedMethod === 'gcash' && <CheckCircle className="w-4 h-4 text-[#39B5A8]" />}
                </button>

                <button 
                  type="button"
                  onClick={() => onSelect('paymaya')}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${selectedMethod === 'paymaya' ? 'bg-white shadow-sm ring-1 ring-[#39B5A8]' : 'hover:bg-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-slate-100 p-1">
                      <img src={mayaLogo} alt="Maya" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Maya</span>
                  </div>
                  {selectedMethod === 'paymaya' && <CheckCircle className="w-4 h-4 text-[#39B5A8]" />}
                </button>
              </div>
            )}
          </div>

          {/* 3. BANK SECTION */}
          <div className={`border-2 rounded-[1.5rem] transition-all overflow-hidden ${expandedSection === 'bank' ? 'border-[#39B5A8] bg-white' : 'border-slate-100 bg-white'}`}>
            <button 
              type="button"
              onClick={() => setExpandedSection(expandedSection === 'bank' ? null : 'bank')}
              className="w-full p-4 flex items-center justify-between outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl"><Building2 className="w-5 h-5" /></div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">Bank Transfer</p>
                  <p className="text-[10px] text-slate-400">Direct secure payment</p>
                </div>
              </div>
              {expandedSection === 'bank' ? <ChevronDown className="w-4 h-4 text-[#39B5A8]" /> : <ChevronRight className="w-4 h-4 text-slate-300" />}
            </button>
            
            {expandedSection === 'bank' && (
              <div className="p-2 bg-slate-50 flex flex-col gap-1">
                {bankOptions.map((bank) => (
                  <button 
                    key={bank.id}
                    type="button"
                    onClick={() => onSelect(bank.id)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${selectedMethod === bank.id ? 'bg-white shadow-sm ring-1 ring-[#39B5A8]' : 'hover:bg-slate-100'}`}
                  >
                    <span className="text-xs font-medium text-slate-700">{bank.name}</span>
                    {selectedMethod === bank.id && <CheckCircle className="w-4 h-4 text-[#39B5A8]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECURITY FOOTER */}
      <div className="rounded-[2rem] border border-[#39B5A8]/20 bg-white p-5 shadow-sm flex items-center gap-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#39B5A8]/10 text-[#39B5A8]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-black text-slate-800">SecurePay™</h4>
            <span className="bg-[#39B5A8]/10 px-1.5 py-0.5 text-[7px] font-bold uppercase text-[#39B5A8] rounded">SSL</span>
          </div>
          <p className="text-[9px] text-slate-500 leading-tight">Your payment is encrypted and secure.</p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
      </div>
    </div>
  );
}