import React, { useState } from 'react';
import { TreeItem } from '../types';
import { Sprout, TrendingUp, Target, Trees, Leaf, MapPin, CheckCircle2, Sparkles } from 'lucide-react';

interface GreenAreaProgressBannerProps {
  trees: TreeItem[];
  defaultTargetTrees?: number;
  defaultTargetAreaSqm?: number;
}

interface TargetSector {
  id: string;
  name: string;
  targetTrees: number;
  targetAreaSqm: number;
  location: string;
  baselineNdvi: number;
  targetNdvi: number;
}

const TARGET_SECTORS: TargetSector[] = [
  {
    id: 'mila-overall',
    name: 'المخطط العام للحزام الأخضر لولاية ميلة',
    targetTrees: 25,
    targetAreaSqm: 5000, // 5,000 m² (0.5 هكتار)
    location: 'ولاية ميلة (المركب الشبابي + سنّاوة + سد بني هارون)',
    baselineNdvi: 0.22,
    targetNdvi: 0.65,
  },
  {
    id: 'youth-center',
    name: 'محيط المركب ودار الشباب بميلة',
    targetTrees: 12,
    targetAreaSqm: 2400,
    location: 'وسط مدينة ميلة',
    baselineNdvi: 0.26,
    targetNdvi: 0.62,
  },
  {
    id: 'senawa-forest',
    name: 'المسار البيئي لغابة سنّاوة الترفيهية',
    targetTrees: 20,
    targetAreaSqm: 4000,
    location: 'المرتفعات الغربية لسنّاوة',
    baselineNdvi: 0.31,
    targetNdvi: 0.70,
  },
  {
    id: 'beni-haroun',
    name: 'حزام تثبيت التربة ومكافحة التوحل بسد بني هارون',
    targetTrees: 35,
    targetAreaSqm: 7000,
    location: 'القرارم قوقة ومحيط الحوض المائي',
    baselineNdvi: 0.18,
    targetNdvi: 0.58,
  },
];

export const GreenAreaProgressBanner: React.FC<GreenAreaProgressBannerProps> = ({
  trees,
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('mila-overall');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const activeSector =
    TARGET_SECTORS.find((s) => s.id === selectedSectorId) || TARGET_SECTORS[0];

  // Each tree planted accounts for ~200 m² of restored green canopy & root soil conservation zone
  const SQM_PER_TREE = 200;
  const currentTreesCount = trees.length;
  const currentGreenAreaSqm = currentTreesCount * SQM_PER_TREE;

  // Progress percentage calculation
  const progressPercent = Math.min(
    100,
    Math.round((currentGreenAreaSqm / activeSector.targetAreaSqm) * 100)
  );

  // Total annual CO2 absorbed by all registered trees in database
  const totalAnnualCo2Kg = trees.reduce(
    (acc, t) => acc + (t.estimatedAnnualCo2Kg || 22),
    0
  );

  // Estimated current NDVI calculated from baseline to target progress
  const estimatedCurrentNdvi = Number(
    (
      activeSector.baselineNdvi +
      (activeSector.targetNdvi - activeSector.baselineNdvi) * (progressPercent / 100)
    ).toFixed(2)
  );

  // Milestones
  const milestones = [
    { percent: 25, label: 'تثبيت التربة الأولي', achieved: progressPercent >= 25 },
    { percent: 50, label: 'ترابط الحزام الأخضر', achieved: progressPercent >= 50 },
    { percent: 75, label: 'كثافة الغطاء النباتي', achieved: progressPercent >= 75 },
    { percent: 100, label: 'اكتمال الهدف المستهدف', achieved: progressPercent >= 100 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden transition-all">
      {/* Top Banner Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-l from-emerald-900 via-emerald-800 to-teal-900 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Title & Context */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-semibold">
                <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                مؤشر نمو المساحات الخضراء (Green Expansion Index)
              </span>
              <span className="text-[11px] text-emerald-300 font-mono">
                Geo-AI Satellite Tracking
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>نسبة إنجاز المساحة الخضراء المستهدفة:</span>
              <span className="text-emerald-300 font-mono text-xl sm:text-2xl font-extrabold tabular-nums">
                {progressPercent}%
              </span>
            </h2>

            <p className="text-xs text-emerald-100/90 max-w-2xl leading-relaxed">
              يتم احتساب النمو آلياً بناءً على عدد الأشجار المسجلة في قاعدة البيانات (
              <b className="font-mono text-white">{currentTreesCount} شجرة</b> مسجلة بمعدل{' '}
              <b className="font-mono text-white">200 م²</b> لكل شجرة) مقابل الهدف الميداني لميلة.
            </p>
          </div>

          {/* Sector Selector & Quick Switch */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/15">
            <div className="text-right">
              <span className="block text-[10px] text-emerald-200 font-medium">القطاع المستهدف:</span>
              <select
                value={selectedSectorId}
                onChange={(e) => setSelectedSectorId(e.target.value)}
                className="bg-emerald-950/80 text-white font-medium text-xs px-2.5 py-1.5 rounded-lg border border-emerald-400/40 focus:outline-none focus:border-emerald-300 cursor-pointer"
              >
                {TARGET_SECTORS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.name} ({s.targetAreaSqm.toLocaleString()} م²)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* The Animated Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-emerald-100">
            <span className="flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5 text-emerald-300" />
              المساحة المكتسبة حالياً:{' '}
              <b className="font-mono text-white text-sm font-bold">
                {currentGreenAreaSqm.toLocaleString()} م²
              </b>{' '}
              <span className="text-emerald-300/80 font-mono text-[11px]">
                ({(currentGreenAreaSqm / 10000).toFixed(2)} هكتار)
              </span>
            </span>

            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-300" />
              المستهدف المخطط له:{' '}
              <b className="font-mono text-white text-sm font-bold">
                {activeSector.targetAreaSqm.toLocaleString()} م²
              </b>{' '}
              <span className="text-emerald-300/80 font-mono text-[11px]">
                ({(activeSector.targetAreaSqm / 10000).toFixed(2)} هكتار)
              </span>
            </span>
          </div>

          {/* Main Visual Progress Track */}
          <div className="relative w-full h-4 bg-emerald-950/60 rounded-full overflow-hidden p-0.5 border border-emerald-700/50 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 transition-all duration-700 ease-out shadow-sm relative overflow-hidden"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Subtle light shimmer animation */}
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Milestone Step Indicators */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {milestones.map((m) => (
              <div
                key={m.percent}
                className={`text-[10px] sm:text-[11px] flex items-center gap-1 ${
                  m.achieved
                    ? 'text-emerald-200 font-semibold'
                    : 'text-emerald-400/60 font-normal'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    m.achieved ? 'bg-emerald-300 shadow-xs' : 'bg-emerald-950 border border-emerald-700'
                  }`}
                />
                <span className="hidden sm:inline font-mono">{m.percent}%</span>
                <span className="truncate">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Cards Bottom Bar */}
      <div className="p-3.5 sm:p-4 bg-emerald-50/50 border-t border-emerald-100/80 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* Metric 1: Trees Registered */}
        <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Trees className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">الأشجار بقاعدة البيانات</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-bold text-slate-900 text-sm">{currentTreesCount}</span>
              <span className="text-[10px] text-slate-400 font-mono">/ {activeSector.targetTrees} شجرة</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Annual CO2 Sequestration */}
        <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4 text-teal-700" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">امتصاص CO2 السنوي</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-bold text-teal-900 text-sm">{totalAnnualCo2Kg}</span>
              <span className="text-[10px] text-teal-600 font-mono">kg/year</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Geo-AI NDVI */}
        <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">مؤشر الغطاء النباتي (NDVI)</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-bold text-emerald-900 text-sm">{estimatedCurrentNdvi}</span>
              <span className="text-[10px] text-emerald-600 font-mono">(المستهدف: {activeSector.targetNdvi})</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Sector Location */}
        <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-blue-700" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] text-slate-500 block">النطاق الجغرافي النشط</span>
            <span className="font-medium text-slate-800 truncate block text-[11px]" title={activeSector.location}>
              {activeSector.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
