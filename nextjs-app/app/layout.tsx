import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { Sprout, Users, MapPin, Dumbbell, QrCode } from 'lucide-react';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'منصة نَماء وصِحّة | NamAA & Wellness',
  description: 'منظومة التطوع البيئي الجغرافي والتغذية الرياضية واستشفاء المتطوعين - «نَغرس الأرض.. ونَبني الصِّحة»',
  keywords: ['Ecology', 'Volunteering', 'Sports Nutrition', 'Mila', 'Algeria', 'GIS', 'Tree Tracking'],
  openGraph: {
    title: 'منصة نَماء وصِحّة | NamAA & Wellness',
    description: '«نَغرس الأرض.. ونَبني الصِّحة» - تجربة ولاية ميلة الميدانية',
    url: 'https://namaa-wellness.vercel.app',
    siteName: 'NamAA & Wellness',
    locale: 'ar_DZ',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                <Sprout className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-base">نَماء وصِحّة</span>
                <span className="text-xs text-emerald-700 font-mono font-bold mr-1.5">NamAA</span>
                <span className="text-[10px] text-slate-400 block font-normal">«نَغرس الأرض.. ونَبني الصِّحة»</span>
              </div>
            </a>

            <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
              <a href="/" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors">
                الرئيسية
              </a>
              <a href="/map" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors">
                الخريطة التفاعلية
              </a>
              <a href="/impact" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors">
                حاسبة الأثر
              </a>
              <a href="/recovery" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors">
                قسائم التعافي
              </a>
            </nav>

            <a
              href="/map"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              استكشف خريطة ميلة
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
            <div>
              <span className="font-bold text-slate-800">منصة نَماء وصِحّة (NamAA & Wellness)</span>
              <span className="text-slate-400 mr-2">· «نَغرس الأرض.. ونَبني الصِّحة»</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Next.js 14 App Router · Vercel Production Ready · Mila Pilot
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
