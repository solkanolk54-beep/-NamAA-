import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  FileCode,
  FolderTree,
  Sparkles,
  Layers,
  Globe,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const NextJsExportPage: React.FC = () => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeFileTab, setActiveFileTab] = useState<'package' | 'layout' | 'map' | 'impact' | 'vercel'>('package');

  const copyToClipboard = (text: string, fileName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const NEXTJS_PACKAGE_JSON = `{
  "name": "namaa-wellness-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.15",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "lucide-react": "^0.453.0",
    "recharts": "^2.13.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/leaflet": "^1.9.14",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}`;

  const NEXTJS_LAYOUT_CODE = `// app/layout.tsx
import type { Metadata } from "next";
import { Tajawal, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "منصة نَماء وصِحّة | NamAA & Wellness",
  description: "المنظومة الرقمية للعمل التطوعي البيئي الجغرافي والتغذية الرياضية واستشفاء المتطوعين",
  openGraph: {
    title: "منصة نَماء وصِحّة",
    description: "«نَغرس الأرض.. ونَبني الصِّحة» - تجربة ولاية ميلة الميدانية",
    url: "https://namaa-wellness.vercel.app",
    siteName: "NamAA & Wellness",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-lg">نَماء وصِحّة</span>
              <span className="text-xs text-emerald-700 font-mono font-bold">NamAA</span>
            </a>
            <nav className="flex items-center gap-4 text-xs font-medium">
              <a href="/" className="hover:text-emerald-700">الرئيسية</a>
              <a href="/map" className="hover:text-emerald-700">الخريطة التفاعلية</a>
              <a href="/impact" className="hover:text-emerald-700">حاسبة الأثر</a>
              <a href="/recovery" className="hover:text-emerald-700">قسائم التعافي</a>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
          {children}
        </main>
      </body>
    </html>
  );
}`;

  const NEXTJS_MAP_CLIENT_CODE = `// app/map/page.tsx
'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { MapPin, Users, Compass, Send } from 'lucide-react';

// Crucial for Vercel deployment: Dynamic client-side import to prevent SSR window/leaflet crash
const MapView = dynamic(() => import('@/components/GisLeafletClientMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[550px] w-full rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center text-xs text-slate-500 font-mono">
      جاري تحميل خريطة Leaflet الجغرافية الميدانية...
    </div>
  ),
});

export default function MapPage() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            GIS Dashboard
          </span>
          <h1 className="text-xl font-bold mt-1">خريطة المبادرات البيئية ونقاط الاستشفاء بميلة</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-slate-200">
          <MapView filter={filter} />
        </div>
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200">
          <h2 className="font-bold text-sm mb-2 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>خوارزمية الفرز المكاني (PostGIS)</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            تحديد المتطوعين في نطاق 5 كم الأقرب لغابة سنّاوة وسد بني هارون.
          </p>
          {/* Smart match list */}
        </div>
      </div>
    </div>
  );
}`;

  const NEXTJS_IMPACT_PAGE_CODE = `// app/impact/page.tsx
'use client';

import React, { useState } from 'react';
import { Flame, Dumbbell, Droplet, Trees, QrCode } from 'lucide-react';

export default function ImpactPage() {
  const [task, setTask] = useState('tree_planting');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [weightKg, setWeightKg] = useState(72);
  const [treesPlanted, setTreesPlanted] = useState(3);

  // ACSM MET Formula
  const metValue = task === 'digging' ? 7.8 : task === 'tree_planting' ? 5.5 : 4.8;
  const caloriesBurned = Math.round(metValue * 3.5 * weightKg * (durationMinutes / 200));
  const proteinGrams = Math.round(weightKg * 0.35);
  const carbsGrams = Math.round(proteinGrams * 3.2);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">حاسبة الأثر المزدوج والتغذية الرياضية</h1>
      {/* Interactive form + live calculations */}
    </div>
  );
}`;

  const VERCEL_DEPLOY_GUIDE = `# نشر منصة نَماء وصِحّة على Vercel بنقرة واحدة

### 1. المتطلبات المسبقة:
- حساب على [Vercel](https://vercel.com)
- مستودع GitHub للمشروع

### 2. خطوات النشر عبر Vercel CLI:
\`\`\`bash
# 1. تثبيت Vercel CLI
npm i -g vercel

# 2. تسجيل الدخول
vercel login

# 3. النشر الفوري
vercel --prod
\`\`\`

### 3. إعدادات المشروع على Vercel Dashboard:
- **Framework Preset:** Next.js
- **Root Directory:** \`./\`
- **Build Command:** \`npm run build\`
- **Output Directory:** \`.next\`

### 4. المتغيرات البيئية (Environment Variables) الاختيارية:
\`\`\`env
NEXT_PUBLIC_MAPBOX_TOKEN="" # اختياري في حال استخدام Mapbox بدلاً من OpenStreetMap
NEXT_PUBLIC_APP_URL="https://namaa-wellness.vercel.app"
\`\`\`

### 5. ملاحظة حاسمة بخصوص Leaflet و Vercel SSR:
تم تغليف مكونات الخريطة بواسطة \`dynamic(() => import(...), { ssr: false })\` وتضمين \`'use client'\` لتفادي أخطاء \`window is not defined\` أثناء بناء حزم الإنتاج على سيرفرات Vercel.`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono">
              Next.js 14 App Router & Vercel
            </span>
            <span className="text-xs text-slate-400">· كود الإنتاج والتوزيع السحابي الجاهز</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            حزمة كود وتوزيع Next.js 14 الجاهزة للنشر المباشر على Vercel
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>SSR-Safe Ready (Leaflet No-SSR)</span>
          </span>
        </div>
      </div>

      {/* Directory Structure Blueprint */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs">شجرة مجلدات Next.js 14 App Router المعتمدة</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Production Directory Tree</span>
        </div>

        <pre className="text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto bg-slate-950/70 p-4 rounded-xl border border-slate-800">
{`namaa-wellness-nextjs/
├── app/
│   ├── layout.tsx              # Root Layout (RTL Arabic, Tajawal font, Leaflet CSS)
│   ├── page.tsx                # Homepage ('/') with Tagline & Dual CTA
│   ├── map/
│   │   └── page.tsx            # Fullscreen Leaflet GIS & Smart Match ('use client')
│   ├── impact/
│   │   └── page.tsx            # Dual Impact MET Calculator & Tree Digital Twin
│   ├── recovery/
│   │   └── page.tsx            # Healthy Brunchy QR Voucher Scanner
│   └── api/
│       ├── campaigns/route.ts  # REST API for eco campaigns & GeoJSON
│       └── trees/route.ts      # REST API for tree registry & watering sync
├── components/
│   ├── GisLeafletClientMap.tsx # Dynamic Client-only Leaflet Map
│   ├── DualImpactWidget.tsx    # Recharts dual-axis graphics
│   └── TreeQrScanner.tsx       # Field inspection QR modal
├── public/
│   └── markers/                # Tree & meal hotspot icons
├── next.config.mjs             # Next.js production configuration
├── tailwind.config.js          # Tailwind CSS v3/v4 design tokens
├── tsconfig.json               # TypeScript strict configuration
└── package.json                # Vercel deployment dependencies`}
        </pre>
      </div>

      {/* Code Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setActiveFileTab('package')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeFileTab === 'package' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              package.json
            </button>
            <button
              onClick={() => setActiveFileTab('layout')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeFileTab === 'layout' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              app/layout.tsx (RTL)
            </button>
            <button
              onClick={() => setActiveFileTab('map')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeFileTab === 'map' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              app/map/page.tsx ('use client')
            </button>
            <button
              onClick={() => setActiveFileTab('impact')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeFileTab === 'impact' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              app/impact/page.tsx
            </button>
            <button
              onClick={() => setActiveFileTab('vercel')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeFileTab === 'vercel' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              دليل النشر على Vercel (Guide)
            </button>
          </div>

          <button
            onClick={() => {
              const content =
                activeFileTab === 'package'
                  ? NEXTJS_PACKAGE_JSON
                  : activeFileTab === 'layout'
                  ? NEXTJS_LAYOUT_CODE
                  : activeFileTab === 'map'
                  ? NEXTJS_MAP_CLIENT_CODE
                  : activeFileTab === 'impact'
                  ? NEXTJS_IMPACT_PAGE_CODE
                  : VERCEL_DEPLOY_GUIDE;
              copyToClipboard(content, activeFileTab);
            }}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {copiedFile === activeFileTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الكود</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Code Content */}
        <div className="p-4 bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto max-h-[500px]">
          <pre className="leading-relaxed">
            {activeFileTab === 'package' && NEXTJS_PACKAGE_JSON}
            {activeFileTab === 'layout' && NEXTJS_LAYOUT_CODE}
            {activeFileTab === 'map' && NEXTJS_MAP_CLIENT_CODE}
            {activeFileTab === 'impact' && NEXTJS_IMPACT_PAGE_CODE}
            {activeFileTab === 'vercel' && VERCEL_DEPLOY_GUIDE}
          </pre>
        </div>
      </div>
    </div>
  );
};
