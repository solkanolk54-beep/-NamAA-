import React from 'react';
import { Sprout, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export type ActiveTab = '/' | '/map' | '/impact' | '/recovery' | '/organizer' | '/nextjs-export';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Zone */}
        <div
          onClick={() => onSelectTab('/')}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
            <Sprout className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
              <span>نَماء وصِحّة</span>
              <span className="text-xs font-semibold text-emerald-700 font-mono">NamAA</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              «نَغرس الأرض.. ونَبني الصِّحة»
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line Next.js App Router tabs) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium shrink-0">
          <button
            onClick={() => onSelectTab('/')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === '/'
                ? 'bg-white text-emerald-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الرئيسية (/)
          </button>
          <button
            onClick={() => onSelectTab('/map')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === '/map'
                ? 'bg-white text-emerald-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الخريطة التفاعلية (/map)
          </button>
          <button
            onClick={() => onSelectTab('/impact')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === '/impact'
                ? 'bg-white text-emerald-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            حاسبة الأثر وسجل الأشجار (/impact)
          </button>
          <button
            onClick={() => onSelectTab('/recovery')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === '/recovery'
                ? 'bg-white text-emerald-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ماسح قسائم الوجبات (/recovery)
          </button>
          <button
            onClick={() => onSelectTab('/organizer')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === '/organizer'
                ? 'bg-white text-emerald-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            لوحة المنظم (GIS)
          </button>
          <button
            onClick={() => onSelectTab('/nextjs-export')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === '/nextjs-export'
                ? 'bg-emerald-800 text-white shadow-xs font-bold'
                : 'text-emerald-800 hover:text-emerald-950 font-semibold bg-emerald-50'
            }`}
          >
            توزيع Vercel & Next.js
          </button>
        </nav>

        {/* Zone 3: Primary Action & Offline Connectivity Control */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Offline Sync Badge */}
          {offlineQueueCount > 0 && (
            <button
              onClick={onSyncQueue}
              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              title="مزامنة السجلات المحلية المحفوظة دون اتصال"
            >
              <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
              <span>مزامنة ({offlineQueueCount})</span>
            </button>
          )}

          {/* Offline Mode Toggle Button */}
          <button
            onClick={onToggleOffline}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap border cursor-pointer ${
              isOffline
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="تبديل محاكاة انقطاع الاتصال الميداني (Offline-First Testing)"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>دون اتصال (Offline)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>متصل (Online)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-start gap-1 border-t border-slate-100 bg-slate-50/90 py-1.5 px-3 text-[11px] font-medium overflow-x-auto">
        <button
          onClick={() => onSelectTab('/')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === '/' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-600'
          }`}
        >
          الرئيسية
        </button>
        <button
          onClick={() => onSelectTab('/map')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === '/map' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-600'
          }`}
        >
          الخريطة
        </button>
        <button
          onClick={() => onSelectTab('/impact')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === '/impact' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-600'
          }`}
        >
          حاسبة الأثر
        </button>
        <button
          onClick={() => onSelectTab('/recovery')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === '/recovery' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-600'
          }`}
        >
          قسائم الوجبات
        </button>
        <button
          onClick={() => onSelectTab('/organizer')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === '/organizer' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-600'
          }`}
        >
          لوحة المنظم
        </button>
        <button
          onClick={() => onSelectTab('/nextjs-export')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === '/nextjs-export' ? 'bg-emerald-800 text-white font-bold' : 'text-emerald-700'
          }`}
        >
          كود Next.js
        </button>
      </div>
    </header>
  );
};
