import React from 'react';
import { Campaign, TreeItem } from '../../types';
import { ActiveTab } from '../Navbar';
import { GreenAreaProgressBanner } from '../GreenAreaProgressBanner';
import {
  Sprout,
  Dumbbell,
  MapPin,
  UtensilsCrossed,
  Trees,
  Flame,
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  QrCode,
  Users,
  Compass,
} from 'lucide-react';

interface HomePageProps {
  campaigns: Campaign[];
  trees: TreeItem[];
  onNavigate: (route: ActiveTab) => void;
  onOpenAddVolunteer: () => void;
  onOpenAddCampaign: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  campaigns,
  trees,
  onNavigate,
  onOpenAddVolunteer,
  onOpenAddCampaign,
}) => {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white p-8 sm:p-12 shadow-xl border border-emerald-700/40">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
            <Sprout className="w-4 h-4 text-emerald-300" />
            <span>منصة نَماء وصِحّة · NamAA & Wellness</span>
            <span className="text-emerald-400 font-mono">v1.4 App Router Ready</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            «نَغرس الأرض.. ونَبني الصِّحة»
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            المنظومة الرقمية الجغرافية الأولى من نوعها التي تدمج <strong className="text-white font-semibold">العمل التطوعي البيئي الميداني</strong> وحملات التشجير الذكية مع <strong className="text-white font-semibold">حسابات التغذية الرياضية والاستشفاء العضلي</strong> وقسائم الوجبات عالية البروتين.
          </p>

          {/* Dual Call to Action */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onOpenAddVolunteer}
              className="px-6 py-3.5 bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold rounded-xl text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-700" />
              <span>سجّل كمتطوع رياضي</span>
            </button>

            <button
              onClick={onOpenAddCampaign}
              className="px-6 py-3.5 bg-emerald-700/80 hover:bg-emerald-600 text-white border border-emerald-400/40 font-bold rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <Sprout className="w-4 h-4 text-emerald-200" />
              <span>أضف مبادرة بيئية</span>
            </button>

            <button
              onClick={() => onNavigate('/map')}
              className="px-5 py-3.5 bg-transparent hover:bg-white/10 text-emerald-200 hover:text-white font-medium rounded-xl text-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>استكشف خريطة ميلة</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
      </section>

      {/* Targeted Green Area Growth Progress Bar (Exclusive to Home Page) */}
      <GreenAreaProgressBanner trees={trees} />

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Trees Planted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <Trees className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">الأشجار المغروسة</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">4,850+</span>
              <span className="text-xs text-emerald-600 font-semibold font-mono">شجرة</span>
            </div>
            <span className="text-[11px] text-slate-400">سجل رقمي مشفر بـ QR</span>
          </div>
        </div>

        {/* Stat 2: Volunteered Hours */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">الساعات التطوعية</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">1,420+</span>
              <span className="text-xs text-blue-600 font-semibold font-mono">ساعة</span>
            </div>
            <span className="text-[11px] text-slate-400">توثيق ميداني موثوق</span>
          </div>
        </div>

        {/* Stat 3: Calories Burned */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">السعرات المحروقة</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">825,000+</span>
              <span className="text-xs text-amber-600 font-semibold font-mono">kcal</span>
            </div>
            <span className="text-[11px] text-slate-400">حساب ACSM & METs</span>
          </div>
        </div>

        {/* Stat 4: Recovery Meals Served */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">وجبات التعافي الرياضي</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">650+</span>
              <span className="text-xs text-teal-600 font-semibold font-mono">وجبة</span>
            </div>
            <span className="text-[11px] text-slate-400">برعاية Healthy Brunchy</span>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-900">ركائز منظومة نَماء وصِحّة</h2>
          <p className="text-xs text-slate-500">
            دمج الجغرافيا المكانية والاستشعار الفضائي بالصحة الرياضية والتمكين المجتمعي
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1 */}
          <div
            onClick={() => onNavigate('/map')}
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
              1. الخرائط الذكية وخريطة الاحتياج (GIS Hotspots)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              تحديد قطاعات التصحر والانجراف ذات الأولوية بميلة عبر خوارزمية PostGIS المكانية، مع مطابقة أقرب المتطوعين وفق المهارات المطلوبة.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:underline">
              <span>انتقل إلى خريطة المبادرات</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </span>
          </div>

          {/* Pillar 2 */}
          <div
            onClick={() => onNavigate('/impact')}
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Dumbbell className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
              2. حاسبة الأثر المزدوج والتغذية (Dual Impact Engine)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              احتساب السعرات المحروقة لكل متطوع، وتحديد نسب المغذيات الكبرى للاستشفاء (3:1 Carbs to Protein)، وتتبع الكتلة الحيوية لامتصاص الكربون.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:underline">
              <span>افتح حاسبة الجهد والأثر</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </span>
          </div>

          {/* Pillar 3 */}
          <div
            onClick={() => onNavigate('/recovery')}
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
              3. استرداد وجبات التعافي (Healthy Brunchy Vouchers)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              توليد قسائم مشفرة فورية للوجبات الرياضية عالية البروتين والمشروبات التعويضية، مع ماسح QR رقمي للشركاء والمطاعم المانحة.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:underline">
              <span>بوابة استرداد القسائم</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </span>
          </div>
        </div>
      </section>

      {/* Pilot Case Study Banner (Mila) */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
              CASE STUDY · تجربة ولاية ميلة الميدانية
            </span>
            <span className="text-xs text-slate-400">سد بني هارون & غابة سنّاوة</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold">
            مشروع غرس 5,000 شجرة زيتون وخروب وصنوبر لحماية الحوض المائي
          </h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            تدمج المبادرة جهود 150 متطوعاً أسبوعياً مع وجبات استشفاء عالية البروتين من الشريك المحلي Healthy Brunchy ونظام سجل الـ QR المقاوم للماء.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/map')}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow-md"
        >
          <MapPin className="w-4 h-4" />
          <span>عرض مواقع المبادرات الحية</span>
        </button>
      </section>
    </div>
  );
};
