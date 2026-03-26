import { ArrowLeft, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router";

interface CustomerPageHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  backPath?: string;
  onBack?: () => void;
  logo?: string;
  stepTitles?: string[];
  currentStep?: number;
}

export function CustomerPageHeader({
  title,
  subtitle,
  icon: Icon,
  backPath = "/customer/home",
  onBack,
  logo,
  stepTitles,
  currentStep,
}: CustomerPageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(backPath);
    }
  };

  // Determine title and subtitle based on props
  const displayTitle = stepTitles && currentStep ? stepTitles[currentStep - 1] : title;
  const displaySubtitle = stepTitles && currentStep 
    ? `Step ${currentStep} of ${stepTitles.length}` 
    : subtitle;

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-[#39B5A8]/10 px-4 md:px-6 py-4">
      {/* Using grid-cols-[auto_1fr_auto] instead of equal grid-cols-3 
          to give the center section maximum available space for the full text.
      */}
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Section: Back Button */}
        <div className="flex-shrink-0 w-10 md:w-12">
          <button
            onClick={handleBack}
            className="p-2.5 bg-white shadow-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 group"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-[#39B5A8]" />
          </button>
        </div>

        {/* Center Section: Titles (Centered and Full Width) */}
        <div className="flex flex-col items-center text-center flex-grow px-2">
          <h1 className="text-lg md:text-2xl font-black tracking-tight text-[#1A5D56] whitespace-nowrap">
            {displayTitle}
          </h1>
          {displaySubtitle && (
            <p className="text-[10px] md:text-[11px] font-black text-[#39B5A8] uppercase tracking-[0.15em] mt-0.5 whitespace-nowrap">
              {displaySubtitle}
            </p>
          )}
        </div>

        {/* Right Section: Icon + Logo Placeholder */}
        <div className="flex-shrink-0 w-10 md:w-12 flex items-center justify-end">
          {Icon ? (
            <div className="hidden sm:flex w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-[#39B5A8]/10 items-center justify-center border border-[#39B5A8]/20">
              <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#39B5A8]" />
            </div>
          ) : (
            // Spacer to keep the title mathematically centered when no icon is present
            <div className="w-5 h-5 invisible sm:block" />
          )}
        </div>
      </div>
    </header>
  );
}