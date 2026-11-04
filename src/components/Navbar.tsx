import React from 'react';
import { Sprout, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export type ActiveTab = 'volunteer' | 'organizer' | 'sponsor' | 'architecture';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  offlineQueueCount: number;
  onSyncQueue: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  isOffline,
  onToggleOffline,
  offlineQueueCount,
  onSyncQueue,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Zone (Single-line wordmark in display face) */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
            <Sprout className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
              نَماء وصِحّة <span className="text-xs font-semibold text-emerald-700 font-mono">NamAA</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              «نَغرس الأرض.. ونَبني الصِّحة»
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line tabs) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium shrink-0">
          <button
            onClick={() => onSelectTab('volunteer')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'volunteer'
                ? 'bg-white text-emerald-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            واجهة المتطوع (Volunteer)
          </button>
          <button
            onClick={() => onSelectTab('organizer')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'organizer'
                ? 'bg-white text-emerald-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            لوحة المنظم (Organizer GIS)
          </button>
          <button
            onClick={() => onSelectTab('sponsor')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'sponsor'
                ? 'bg-white text-emerald-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            بوابة الراعي (Healthy Brunchy)
          </button>
          <button
            onClick={() => onSelectTab('architecture')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-white text-emerald-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            خطة التجربة والمعمارية
          </button>
        </nav>

        {/* Zone 3: Primary Action & Offline Connectivity Control */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Offline Sync Badge */}
          {offlineQueueCount > 0 && (
            <button
              onClick={onSyncQueue}
              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap"
              title="مزامنة السجلات المحلية المحفوظة دون اتصال"
            >
              <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
              <span>مزامنة ({offlineQueueCount})</span>
            </button>
          )}

          {/* Offline Mode Toggle Button */}
          <button
            onClick={onToggleOffline}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap border ${
              isOffline
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="تبديل محاكاة انقطاع الاتصال الميداني (Offline-First Testing)"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>وضع دون اتصال (Offline)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>متصل بالشبكة (Online)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50/90 py-1.5 px-2 text-[11px] font-medium overflow-x-auto">
        <button
          onClick={() => onSelectTab('volunteer')}
          className={`px-2.5 py-1 rounded ${
            activeTab === 'volunteer' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-600'
          }`}
        >
          المتطوع
        </button>
        <button
          onClick={() => onSelectTab('organizer')}
          className={`px-2.5 py-1 rounded ${
            activeTab === 'organizer' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-600'
          }`}
        >
          المنظم
        </button>
        <button
          onClick={() => onSelectTab('sponsor')}
          className={`px-2.5 py-1 rounded ${
            activeTab === 'sponsor' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-600'
          }`}
        >
          الراعي
        </button>
        <button
          onClick={() => onSelectTab('architecture')}
          className={`px-2.5 py-1 rounded ${
            activeTab === 'architecture' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-600'
          }`}
        >
          المخطط
        </button>
      </div>
    </header>
  );
};
