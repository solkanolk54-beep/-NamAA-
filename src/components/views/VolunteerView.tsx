import React, { useState } from 'react';
import { User, Campaign, TreeItem, NutritionalVoucher, TaskType } from '../../types';
import { calculateImpact, MET_TABLE } from '../../utils/calculator';
import { GisMap } from '../GisMap';
import {
  Flame,
  Dumbbell,
  Droplet,
  Trees,
  Award,
  QrCode,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Activity,
  Calendar,
  AlertTriangle,
  Send,
  Leaf
} from 'lucide-react';

interface VolunteerViewProps {
  currentVolunteer: User;
  campaigns: Campaign[];
  trees: TreeItem[];
  vouchers: NutritionalVoucher[];
  isOffline: boolean;
  onLogActivity: (
    taskType: TaskType,
    durationMinutes: number,
    treesPlanted: number,
    campaignId: string
  ) => void;
  onWaterTree: (treeId: string) => void;
  onSelectCampaign: (id: string) => void;
  selectedCampaignId?: string;
}

export const VolunteerView: React.FC<VolunteerViewProps> = ({
  currentVolunteer,
  campaigns,
  trees,
  vouchers,
  isOffline,
  onLogActivity,
  onWaterTree,
  onSelectCampaign,
  selectedCampaignId,
}) => {
  // Activity logger state
  const [selectedTask, setSelectedTask] = useState<TaskType>('digging');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [treesPlanted, setTreesPlanted] = useState<number>(3);
  const [selectedCampaignForLog, setSelectedCampaignForLog] = useState<string>(
    campaigns[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'tracker' | 'trees' | 'voucher' | 'map'>('tracker');
  const [showLogSuccess, setShowLogSuccess] = useState(false);

  // Live calculation based on user weight and inputs
  const liveCalc = calculateImpact(
    selectedTask,
    durationMinutes,
    currentVolunteer.weightKg,
    treesPlanted
  );

  // Volunteer's adopted trees
  const myTrees = trees.filter((t) => t.adopterId === currentVolunteer.id);

  // Volunteer's active voucher
  const myActiveVoucher = vouchers.find(
    (v) => v.volunteerId === currentVolunteer.id && !v.isRedeemed
  ) || vouchers.find((v) => v.volunteerId === currentVolunteer.id);

  const handleSubmitActivity = (e: React.FormEvent) => {
    e.preventDefault();
    onLogActivity(selectedTask, durationMinutes, treesPlanted, selectedCampaignForLog);
    setShowLogSuccess(true);
    setTimeout(() => setShowLogSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Volunteer Profile & Quick Impact Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm border-2 border-emerald-100">
            {currentVolunteer.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{currentVolunteer.fullName}</h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                متطوع نشط · ولاية ميلة
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
              <span>الوزن: <b className="text-slate-700 font-mono">{currentVolunteer.weightKg} كغ</b></span>
              <span>·</span>
              <span>المستوى البدني: <b className="text-slate-700">رياضي (Athlete)</b></span>
              <span>·</span>
              <span>المهارات: <span className="text-slate-600">{currentVolunteer.skills.join('، ')}</span></span>
            </div>
          </div>
        </div>

        {/* Impact Numbers */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          <div className="text-center px-3 py-1.5 bg-amber-50/70 border border-amber-200/50 rounded-lg">
            <span className="text-[10px] text-amber-700 block">السعرات المحروقة</span>
            <span className="text-base font-bold text-amber-900 font-mono tabular-nums">
              {currentVolunteer.totalCaloriesBurned}
            </span>
            <span className="text-[10px] text-amber-600 mr-1">kcal</span>
          </div>

          <div className="text-center px-3 py-1.5 bg-emerald-50/70 border border-emerald-200/50 rounded-lg">
            <span className="text-[10px] text-emerald-700 block">الأشجار المتبناة</span>
            <span className="text-base font-bold text-emerald-900 font-mono tabular-nums">
              {currentVolunteer.totalTreesAdopted}
            </span>
            <span className="text-[10px] text-emerald-600 mr-1">شجرة</span>
          </div>

          <div className="text-center px-3 py-1.5 bg-blue-50/70 border border-blue-200/50 rounded-lg">
            <span className="text-[10px] text-blue-700 block">نقاط الأثر (Impact)</span>
            <span className="text-base font-bold text-blue-900 font-mono tabular-nums">
              {currentVolunteer.impactPoints}
            </span>
            <span className="text-[10px] text-blue-600 mr-1">pts</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'tracker'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          حاسبة الجهد والتغذية الرياضية
        </button>
        <button
          onClick={() => setActiveTab('trees')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'trees'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Trees className="w-3.5 h-3.5" />
          أشجاري المتبناة ومهام الري ({myTrees.length})
        </button>
        <button
          onClick={() => setActiveTab('voucher')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'voucher'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          قسيمة وجبة التعافي (Healthy Brunchy)
          {myActiveVoucher && !myActiveVoucher.isRedeemed && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'map'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          الخريطة الجغرافية للحملات
        </button>
      </div>

      {/* TAB 1: Workout & MET Sports Nutrition Tracker */}
      {activeTab === 'tracker' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Activity Form */}
          <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  تسجيل الجهد الميداني وحساب المغذيات
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  حساب دقيق لحرق السعرات وفق المكافئ الأيضي (MET) والبروتين المطلوب للتعافي
                </p>
              </div>
              {isOffline && (
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                  وضع دون اتصال (مزامنة تلقائية)
                </span>
              )}
            </div>

            <form onSubmit={handleSubmitActivity} className="space-y-4 text-xs">
              {/* Campaign Picker */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  المبادرة أو الحملة البيئية:
                </label>
                <select
                  value={selectedCampaignForLog}
                  onChange={(e) => setSelectedCampaignForLog(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} — {c.facilityName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Task Type Buttons */}
              <div>
                <label className="block text-slate-700 font-medium mb-1.5">
                  نوع النشاط والجهد البدني:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(MET_TABLE) as TaskType[]).map((taskKey) => {
                    const task = MET_TABLE[taskKey];
                    const isSelected = selectedTask === taskKey;
                    return (
                      <button
                        type="button"
                        key={taskKey}
                        onClick={() => setSelectedTask(taskKey)}
                        className={`p-3 text-right rounded-lg border transition-all text-xs ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 ring-1 ring-emerald-500'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold">{task.nameAr}</span>
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            MET {task.met}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{task.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration Slider */}
              <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/70">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-700">مدة النشاط البدني المتواصل:</span>
                  <span className="font-mono font-bold text-sm text-emerald-800">
                    {durationMinutes} دقيقة
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="180"
                  step="15"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>15 دقيقة (إحماء خفيف)</span>
                  <span>60 دقيقة</span>
                  <span>120 دقيقة</span>
                  <span>180 دقيقة (جهد مكثف)</span>
                </div>
              </div>

              {/* Trees Planted */}
              <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/70">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-700">عدد الأشجار المغروسة في هذه الجلسة:</span>
                  <span className="font-mono font-bold text-sm text-emerald-800">
                    {treesPlanted} شتلات
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={treesPlanted}
                  onChange={(e) => setTreesPlanted(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {showLogSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    تم تسجيل النشاط بنجاح! تم احتساب الأثر وتوليد قسيمة وجبة التعافي من Healthy Brunchy.
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>توثيق الجلسة وإصدار قسيمة وجبة الاستشفاء</span>
              </button>
            </form>
          </div>

          {/* Real-Time Dual Impact & Recovery Preview Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Health & Nutrition Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-sm border border-slate-700">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  تقدير الأثر الصحي المباشر (MET {liveCalc.metValue})
                </span>
                <span className="text-[10px] text-slate-400">وزن {currentVolunteer.weightKg} كغ</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block mb-1">السعرات المحروقة</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-amber-400">
                      {liveCalc.caloriesBurned}
                    </span>
                    <span className="text-xs text-slate-400">kcal</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block mb-1">البروتين الموصى به</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-emerald-400">
                      {liveCalc.proteinGrams}
                    </span>
                    <span className="text-xs text-slate-400">g بروتين</span>
                  </div>
                </div>
              </div>

              {/* Nutrition breakdown */}
              <div className="space-y-2 text-xs border-t border-slate-700/80 pt-3">
                <div className="flex justify-between items-center text-slate-300">
                  <span>تعويض الجليكوجين (كربوهيدرات):</span>
                  <span className="font-mono font-bold text-slate-100">{liveCalc.carbsGrams}g</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>تعويض السوائل والترطيب:</span>
                  <span className="font-mono font-bold text-blue-300">{liveCalc.hydrationMl} مل ماء</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>نقاط الأثر المكتسبة:</span>
                  <span className="font-mono font-bold text-amber-400">+{liveCalc.earnedPoints} نقطة</span>
                </div>
              </div>
            </div>

            {/* Environmental Impact Card */}
            <div className="bg-emerald-800 text-white rounded-xl p-5 shadow-sm border border-emerald-700">
              <div className="flex items-center justify-between border-b border-emerald-700/80 pb-3 mb-3">
                <span className="text-xs text-emerald-200 font-semibold flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5" />
                  الأثر البيئي المزدوج (Eco-Sequestration)
                </span>
                <span className="text-[10px] text-emerald-300">{treesPlanted} أشجار جديدة</span>
              </div>

              <div className="mb-3">
                <span className="text-[11px] text-emerald-200 block mb-0.5">
                  امتصاص الكربون المقدر (طيلة دورة الحياة 25 سنة):
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-white">
                    {liveCalc.lifetimeCo2OffsetKg}
                  </span>
                  <span className="text-xs text-emerald-200">كغ CO2 معادل</span>
                </div>
                <p className="text-[11px] text-emerald-100/90 mt-1 leading-relaxed">
                  ما يعادل تقريباً امتصاص انبعاثات قيادة سيارة لمسافة {(liveCalc.lifetimeCo2OffsetKg * 4.2).toFixed(0)} كم في شوارع ميلة.
                </p>
              </div>

              <div className="bg-emerald-900/60 p-2.5 rounded-lg border border-emerald-700/50 text-[11px] text-emerald-100">
                🌱 الشتلات تتضمن الزيتون الجبلي والخروب الملائم لمناخ ولاية ميلة لمقاومة الجفاف.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: My Planted Trees Registry */}
      {activeTab === 'trees' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">سجل أشجاري المتبناة ومواعيد الري</h3>
              <p className="text-xs text-slate-500">
                متابعة دورية لكل شجرة تم غرسها مع تنبيهات السقاية الذكية لضمان نسبة نجاح 95%
              </p>
            </div>
            <div className="text-xs font-mono bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200">
              إجمالي الأشجار: {myTrees.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myTrees.map((tree) => {
              const isUrgent = tree.healthStatus === 'needs_water';
              return (
                <div
                  key={tree.id}
                  className={`bg-white rounded-xl p-4 border transition-shadow hover:shadow-md ${
                    isUrgent ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {tree.tagCode}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isUrgent
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isUrgent ? 'بحاجة للري اليوم' : 'حالة صحية ممتازة'}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mb-1">{tree.species}</h4>
                  <div className="text-xs text-slate-500 mb-3 space-y-1">
                    <div className="flex justify-between">
                      <span>تاريخ الغرس:</span>
                      <span className="font-mono text-slate-700">{tree.plantedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>آخر ري موثق:</span>
                      <span className="font-mono text-slate-700">{tree.lastWatered}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الري القادم:</span>
                      <span
                        className={`font-mono font-bold ${
                          isUrgent ? 'text-amber-700' : 'text-slate-700'
                        }`}
                      >
                        {tree.nextWateringDue}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>امتصاص CO2 سنوياً:</span>
                      <span className="font-mono text-emerald-700 font-bold">
                        {tree.estimatedAnnualCo2Kg} كغ/سنة
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onWaterTree(tree.id)}
                    className="w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Droplet className="w-3.5 h-3.5 text-blue-600" />
                    <span>توثيق ري الشجرة (+10 نقاط أثر)</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Recovery Meal Voucher (Healthy Brunchy) */}
      {activeTab === 'voucher' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {myActiveVoucher ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600" />
              
              <div className="flex items-start justify-between mb-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                    {myActiveVoucher.sponsorName} · شريك التعافي الرياضي
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    قسيمة الاستشفاء الغذائي عالي البروتين
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {myActiveVoucher.campaignTitle}
                  </p>
                </div>

                <div className="text-left font-mono">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    myActiveVoucher.isRedeemed 
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {myActiveVoucher.isRedeemed ? 'تم الصرف مسبقاً' : 'جاهزة للصرف'}
                  </span>
                </div>
              </div>

              {/* QR Code and Voucher Body */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                {/* QR Visual */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-center">
                  <div className="w-36 h-36 bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-center relative">
                    {/* Simulated SVG QR */}
                    <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-slate-900 rounded">
                      <div className="bg-white rounded-sm col-span-2 row-span-2"></div>
                      <div className="bg-emerald-400 rounded-sm"></div>
                      <div className="bg-white rounded-sm col-span-2 row-span-2"></div>
                      <div className="bg-amber-400 rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-emerald-400 rounded-sm"></div>
                      <div className="bg-white rounded-sm col-span-2 row-span-2"></div>
                      <div className="bg-amber-400 rounded-sm"></div>
                      <div className="bg-white rounded-sm col-span-2 row-span-2"></div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-800 mt-2">
                    {myActiveVoucher.code}
                  </span>
                </div>

                {/* Macro breakdown */}
                <div className="flex-1 space-y-2 text-xs">
                  <div className="font-medium text-slate-800 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 text-[11px]">
                    🥗 {myActiveVoucher.mealName}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">البروتين المستهدف</span>
                      <span className="font-mono font-bold text-sm text-emerald-700">{myActiveVoucher.targetProteinG}g</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">الكربوهيدرات</span>
                      <span className="font-mono font-bold text-sm text-amber-700">{myActiveVoucher.targetCarbsG}g</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">السعرات الحرارية</span>
                      <span className="font-mono font-bold text-sm text-slate-800">{myActiveVoucher.calories} kcal</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">السوائل والترطيب</span>
                      <span className="font-mono font-bold text-sm text-blue-700">{myActiveVoucher.hydrationMl} ml</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1">
                    صالحة للاستلام من نقطة توزيع المرفق الشبابي بميلة أو فرع Healthy Brunchy حتى {myActiveVoucher.expiresAt}.
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>المستفيد: <b className="text-slate-800">{myActiveVoucher.volunteerName}</b></span>
                <span className="font-mono text-[11px] text-slate-400">تشفير HMAC-SHA256</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
              <QrCode className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 mb-1 text-sm">لا توجد قسيمة نشطة حالياً</h4>
              <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                قم بتسجيل نشاط تطوعي وزراعي عبر حاسبة الجهد للحصول على قسيمة وجبة التعافي الرياضية تلقائياً.
              </p>
              <button
                onClick={() => setActiveTab('tracker')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium"
              >
                الذهاب لحاسبة الجهد
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Leaflet GIS Map */}
      {activeTab === 'map' && (
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">
              استكشف مواقع المبادرات والأشجار المغروسة ونطاق الاحتياج بميلة
            </span>
            <span className="text-slate-400">انقر على أي شجرة لسقايتها أو مراجعة صحتها</span>
          </div>
          <GisMap
            campaigns={campaigns}
            trees={trees}
            volunteers={[currentVolunteer]}
            selectedCampaignId={selectedCampaignId}
            onSelectCampaign={onSelectCampaign}
            onWaterTree={onWaterTree}
            userRole="volunteer"
          />
        </div>
      )}
    </div>
  );
};
