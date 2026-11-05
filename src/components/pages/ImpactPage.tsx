import React, { useState } from 'react';
import { Campaign, TreeItem, User, TaskType, TerrainSlope, AmbientTemp, DualImpactLog, TreeHealthStatus } from '../../types';
import { calculateImpact, MET_TABLE } from '../../utils/calculator';
import { DualImpactChartWidget } from '../DualImpactChartWidget';
import { TreeQrScannerModal } from '../TreeQrScannerModal';
import {
  Flame,
  Dumbbell,
  Droplet,
  Trees,
  Award,
  QrCode,
  Sparkles,
  Camera,
  Activity,
  Send,
  Calendar,
  CheckCircle2,
  Ruler,
  Leaf,
  Clock,
} from 'lucide-react';

interface ImpactPageProps {
  currentVolunteer: User;
  campaigns: Campaign[];
  trees: TreeItem[];
  logs: DualImpactLog[];
  isOffline: boolean;
  onLogActivity: (
    taskType: TaskType,
    durationMinutes: number,
    treesPlanted: number,
    campaignId: string
  ) => void;
  onWaterTree: (treeId: string) => void;
  onUpdateTreeDetailed?: (
    treeId: string,
    updates: {
      healthStatus: TreeHealthStatus;
      waterVolumeLiters: number;
      soilMoistureLevel: 'dry' | 'moderate' | 'optimal';
      heightCm?: number;
      canopyDiameterCm?: number;
      growthStage?: 'sapling' | 'young' | 'maturing' | 'mature';
      earnedPoints: number;
    }
  ) => void;
}

export const ImpactPage: React.FC<ImpactPageProps> = ({
  currentVolunteer,
  campaigns,
  trees,
  logs,
  isOffline,
  onLogActivity,
  onWaterTree,
  onUpdateTreeDetailed,
}) => {
  // Activity inputs
  const [selectedTask, setSelectedTask] = useState<TaskType>('tree_planting');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [treesPlanted, setTreesPlanted] = useState<number>(3);
  const [terrainSlope, setTerrainSlope] = useState<TerrainSlope>('moderate_slope');
  const [ambientTemp, setAmbientTemp] = useState<AmbientTemp>('moderate');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [logSuccessMsg, setLogSuccessMsg] = useState<string | null>(null);

  // Field Tree QR Modal State
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const [selectedTreeForModal, setSelectedTreeForModal] = useState<TreeItem | null>(null);

  // Live impact calculation
  const liveCalc = calculateImpact(
    selectedTask,
    durationMinutes,
    currentVolunteer.weightKg,
    treesPlanted,
    { terrainSlope, ambientTemp }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogActivity(selectedTask, durationMinutes, treesPlanted, selectedCampaignId);
    setLogSuccessMsg(`تم تسجيل النشاط الرياضي والبيئي بنجاح (+${liveCalc.earnedPoints} نقطة أثر) وتوليد قسيمة وجبة التعافي تلقائياً!`);
    setTimeout(() => setLogSuccessMsg(null), 4000);
  };

  const handleOpenQrForTree = (tree: TreeItem) => {
    setSelectedTreeForModal(tree);
    setQrModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              حاسبة الأثر المزدوج والتغذية (ACSM & METs)
            </span>
            <span className="text-xs text-slate-400">· الاستشفاء العضلي والتوأم الرقمي للأشجار</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            تتبع الجهد البدني واحتساب وجبة التعافي الرياضية
          </h2>
        </div>

        <button
          onClick={() => {
            setSelectedTreeForModal(trees[0] || null);
            setQrModalOpen(true);
          }}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>مسح رمز QR لشجرة ميدانية</span>
        </button>
      </div>

      {logSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{logSuccessMsg}</span>
        </div>
      )}

      {/* Main Grid: Calculator & Live Nutrition Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>بيانات النشاط الميداني والتطوعي</span>
          </h3>

          {/* Activity Type Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              نوع النشاط البيئي:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(MET_TABLE) as TaskType[]).map((taskKey) => {
                const isSelected = selectedTask === taskKey;
                return (
                  <button
                    type="button"
                    key={taskKey}
                    onClick={() => setSelectedTask(taskKey)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="block font-bold">{MET_TABLE[taskKey].nameAr}</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                      {MET_TABLE[taskKey].met} METs
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration & Trees planted */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-medium text-slate-700">مدة النشاط:</span>
                <span className="font-mono font-bold text-emerald-700">{durationMinutes} دقيقة</span>
              </div>
              <input
                type="range"
                min="15"
                max="240"
                step="15"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>15 د</span>
                <span>60 د (ساعة)</span>
                <span>120 د</span>
                <span>240 د (4 س)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-medium text-slate-700">عدد الأشجار المغروسة:</span>
                <span className="font-mono font-bold text-emerald-700">{treesPlanted} شجرة</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={treesPlanted}
                onChange={(e) => setTreesPlanted(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>0</span>
                <span>5 أشجار</span>
                <span>10</span>
                <span>20 شجرة</span>
              </div>
            </div>
          </div>

          {/* Environmental Multipliers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">انحدار التضاريس الجبلية:</label>
              <select
                value={terrainSlope}
                onChange={(e) => setTerrainSlope(e.target.value as TerrainSlope)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 font-medium"
              >
                <option value="flat">أرض مستوية (Flat - 1.0x)</option>
                <option value="moderate_slope">انحدار متوسط بتلال ميلة (1.12x)</option>
                <option value="steep_mountain">سفح جبلي وعر بسنّاوة (1.25x)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">درجة الحرارة الميدانية:</label>
              <select
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(e.target.value as AmbientTemp)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 font-medium"
              >
                <option value="cool">معتدلة / ربيعية (Cool - 1.0x)</option>
                <option value="moderate">دافئة 22-29°C (1.05x)</option>
                <option value="hot_summer">حارة صيفية أعلى من 30°C (1.15x)</option>
              </select>
            </div>
          </div>

          {/* Campaign Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">المبادرة الميدانية المرتبطة:</label>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 font-medium"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} — {c.facilityName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Send className="w-4 h-4" />
            <span>تسجيل الجهد واستخراج قسيمة الوجبة</span>
          </button>
        </form>

        {/* Live Output Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 border border-slate-700 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <h3 className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>مخرجات الأثر الفوري والتعافي الرياضي</span>
            </h3>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
              +{liveCalc.earnedPoints} نقطة
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">السعرات المحروقة</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-mono font-bold text-xl text-amber-400">{liveCalc.caloriesBurned}</span>
                <span className="text-[10px] text-slate-400">kcal</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">امتصاص CO2 السنوي</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-mono font-bold text-xl text-emerald-400">{liveCalc.lifetimeCo2OffsetKg}</span>
                <span className="text-[10px] text-slate-400">kg CO2</span>
              </div>
            </div>
          </div>

          {/* Recovery Meal Macros Breakdown */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-3">
            <span className="text-xs font-bold text-slate-200 block">
              الاحتياج الغذائي للاستشفاء العضلي (3:1 Carbs-to-Protein):
            </span>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 block">البروتين</span>
                <span className="font-mono font-bold text-sm text-rose-300">{liveCalc.proteinGrams}g</span>
                <span className="text-[9px] text-slate-500 block">ليوسين &gt; 2.8g</span>
              </div>

              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 block">الكاربوهيدرات</span>
                <span className="font-mono font-bold text-sm text-amber-300">{liveCalc.carbsGrams}g</span>
                <span className="text-[9px] text-slate-500 block">تجديد الجليكوجين</span>
              </div>

              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 block">السوائل</span>
                <span className="font-mono font-bold text-sm text-blue-300">{liveCalc.hydrationMl}ml</span>
                <span className="text-[9px] text-slate-500 block">مع إلكترولايتات</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 pt-1 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>مؤهلة للاستلام الفوري من الشريك الراعي <b>Healthy Brunchy</b> بميلة.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Visual Dashboard Widget */}
      <DualImpactChartWidget
        volunteer={currentVolunteer}
        logs={logs}
        trees={trees}
      />

      {/* Smart Tree Digital Twin Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              التوأم الرقمي للأشجار المغروسة (Smart Tree Digital Twin)
            </h3>
            <p className="text-xs text-slate-500">
              سجل بطاقات الـ QR الميدانية، قياسات النمو الرأسي، والري الموثق بميلة
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
            {trees.length} أشجار مسجلة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trees.slice(0, 6).map((tree) => (
            <div
              key={tree.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {tree.tagCode}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    tree.healthStatus === 'healthy'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {tree.healthStatus === 'healthy' ? 'حالة ممتازة' : 'بحاجة لسقاية'}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900">{tree.species}</h4>
                <span className="text-[11px] text-slate-500">
                  المتبني: <b>{tree.adopterName || 'متاح للتبني'}</b>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">الارتفاع:</span>
                  <span className="font-mono font-bold text-slate-800">{tree.heightCm || 95} cm</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">قطر التاج:</span>
                  <span className="font-mono font-bold text-slate-800">{tree.canopyDiameterCm || 45} cm</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[10px] text-slate-500">
                  السقاية: {tree.lastWatered}
                </span>
                <button
                  onClick={() => handleOpenQrForTree(tree)}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>فحص QR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field QR Inspection Modal */}
      <TreeQrScannerModal
        trees={trees}
        volunteer={currentVolunteer}
        isOffline={isOffline}
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        initialSelectedTree={selectedTreeForModal}
        onUpdateTree={(treeId, updates) => {
          if (onUpdateTreeDetailed) {
            onUpdateTreeDetailed(treeId, updates);
          } else {
            onWaterTree(treeId);
          }
        }}
      />
    </div>
  );
};
