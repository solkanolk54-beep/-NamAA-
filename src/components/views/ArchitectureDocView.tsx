import React, { useState } from 'react';
import {
  Database,
  Code,
  MapPin,
  Compass,
  CheckCircle2,
  Copy,
  Layers,
  Terminal,
  Activity,
  Award,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Zap,
  Globe,
  Flame,
  QrCode,
  Radio,
  ShieldAlert,
  Leaf,
  Droplet,
  TrendingUp,
  Cpu,
  RefreshCw,
  Send,
  Sliders,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';
import { calculateImpact } from '../../utils/calculator';
import {
  createTreeQRPayload,
  verifyTreeQRPayload,
  OfflineWateringSyncManager
} from '../../utils/treeTrackingOffline';
import {
  MILA_GEO_AI_PLOTS,
  estimateTreeBiomassAndAnnualCo2
} from '../../utils/geoAiMetrics';
import {
  ACTIVE_MILA_CRISIS_EVENTS,
  triageVolunteersForCrisis,
  generateSafeCrisisRoute
} from '../../utils/emergencyDispatch';
import { INITIAL_VOLUNTEERS, INITIAL_TREES } from '../../data/mockData';
import { TerrainSlope, AmbientTemp, TaskType } from '../../types';

export const ArchitectureDocView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    'blueprint' | 'dynamic_met' | 'qr_offline' | 'geo_ai' | 'emergency' | 'schema' | 'algorithms' | 'api'
  >('dynamic_met');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 1. Dynamic MET Interactive State
  const [metTask, setMetTask] = useState<TaskType>('digging');
  const [metDuration, setMetDuration] = useState<number>(60);
  const [metWeight, setMetWeight] = useState<number>(75);
  const [metSlope, setMetSlope] = useState<TerrainSlope>('steep_mountain');
  const [metTemp, setMetTemp] = useState<AmbientTemp>('hot_summer');
  const [metTreesPlanted, setMetTreesPlanted] = useState<number>(4);

  const dynamicMetResult = calculateImpact(metTask, metDuration, metWeight, metTreesPlanted, {
    terrainSlope: metSlope,
    ambientTemp: metTemp,
  });

  // 2. Smart QR & Offline Sync State
  const [selectedTreeForQR, setSelectedTreeForQR] = useState(INITIAL_TREES[0]);
  const sampleQRPayload = createTreeQRPayload(selectedTreeForQR);
  const qrVerification = verifyTreeQRPayload(sampleQRPayload);
  const [offlineSyncEvents, setOfflineSyncEvents] = useState(
    OfflineWateringSyncManager.getQueuedEvents()
  );
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleSimulateOfflineWatering = () => {
    const newEvt = OfflineWateringSyncManager.recordOfflineWatering(
      selectedTreeForQR.tagCode,
      INITIAL_VOLUNTEERS[0].id,
      INITIAL_VOLUNTEERS[0].fullName,
      12,
      'optimal'
    );
    setOfflineSyncEvents(OfflineWateringSyncManager.getQueuedEvents());
    setSyncFeedback(`تم حفظ حدث الري محلياً دون اتصال: ${newEvt.idempotencyKey}`);
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  const handleReconcileOfflineEvents = () => {
    const result = OfflineWateringSyncManager.reconcileQueue();
    setOfflineSyncEvents([]);
    setSyncFeedback(
      `تمت مزامنة ${result.reconciled.length} حدث بنجاح وحل أي تعارضات زمنية عبر Vector Clocks!`
    );
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  // 3. Geo-AI State
  const [selectedPlot, setSelectedPlot] = useState(MILA_GEO_AI_PLOTS[0]);
  const [biomassSpecies, setBiomassSpecies] = useState<'olive' | 'carob' | 'pine'>('olive');
  const [biomassStemDiameter, setBiomassStemDiameter] = useState<number>(18);
  const [biomassHeight, setBiomassHeight] = useState<number>(3.5);
  const biomassCalc = estimateTreeBiomassAndAnnualCo2(biomassSpecies, biomassStemDiameter, biomassHeight);

  // 4. Emergency Dispatch State
  const [selectedCrisis, setSelectedCrisis] = useState(ACTIVE_MILA_CRISIS_EVENTS[0]);
  const crisisTriage = triageVolunteersForCrisis(selectedCrisis, INITIAL_VOLUNTEERS);
  const sampleCrisisRoute = generateSafeCrisisRoute(selectedCrisis, INITIAL_VOLUNTEERS[0]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              ADVANCED ARCHITECTURE SPECIFICATION & CORES
            </span>
            <span className="text-xs text-slate-400">· منصة نَماء وصِحّة (NamAA & Wellness)</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            العمارة المتقدمة للأنظمة الجغرافية، الذكاء الاصطناعي، واستجابة الطوارئ
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            المواصفات الفنية الميدانية: حسابات MET التضاريسية، بروتوكول QR والمزامنة، استشعار Geo-AI، ووحدة توجيه الأزمات
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveSection('dynamic_met')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSection === 'dynamic_met'
                ? 'bg-white text-emerald-950 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. MET والتغذية الديناميكية
          </button>
          <button
            onClick={() => setActiveSection('qr_offline')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSection === 'qr_offline'
                ? 'bg-white text-emerald-950 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. كود QR والمزامنة الميدانية
          </button>
          <button
            onClick={() => setActiveSection('geo_ai')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSection === 'geo_ai'
                ? 'bg-white text-emerald-950 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. ذكاء الغطاء النباتي (Geo-AI)
          </button>
          <button
            onClick={() => setActiveSection('emergency')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSection === 'emergency'
                ? 'bg-white text-emerald-950 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. وحدة طوارئ الأزمات (pgRouting)
          </button>
          <button
            onClick={() => setActiveSection('blueprint')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSection === 'blueprint'
                ? 'bg-white text-emerald-950 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            خطة ميلة (Mila Pilot)
          </button>
          <button
            onClick={() => setActiveSection('schema')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSection === 'schema'
                ? 'bg-white text-emerald-950 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            جداول PostGIS
          </button>
        </div>
      </div>

      {/* MODULE 1: Dynamic MET-based calorie & recovery meal calculator logic */}
      {activeSection === 'dynamic_met' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-amber-200">
                DYNAMIC MET & ADVANCED SPORTS NUTRITION ENGINE
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-amber-100">
                معيار الكلية الأمريكية للطب الرياضي (ACSM) + العوامل التضاريسية
              </span>
            </div>
            <h3 className="text-base font-bold mb-1">
              1. محرك الحساب الديناميكي لمعدل الجهد الأيضي (Dynamic MET) وتعويض الشوارد والمغذيات
            </h3>
            <p className="text-xs text-amber-100/90 leading-relaxed max-w-3xl">
              لا يقتصر حساب السعرات على نوع النشاط فقط، بل يُعدّل فورياً بضرب المكافئ الأيضي بقوى الانحدار الجبلي (Terrain Slope) والإجهاد الحراري (Cardiac Drift & Temp)، مع حساب احتياج ترميم ألياف العضلات (Leucine Synthesis) وتعويض الشوارد الكهرلية (صوديوم، بوتاسيوم، مغنيسيوم).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Interactive Dynamic MET Simulator */}
            <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-600" />
                  مختبر محاكاة العوامل التضاريسية والبيئية
                </h4>
                <p className="text-xs text-slate-500">
                  اختبر كيف يتغير الجهد الأيضي وقسيمة وجبة Healthy Brunchy باختلاف تضاريس ميلة
                </p>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Task Selection */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">النشاط التطوعي:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMetTask('digging')}
                      className={`p-2 rounded border text-right ${
                        metTask === 'digging'
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                          : 'border-slate-200'
                      }`}
                    >
                      حفر الحفر الصلبة (MET 7.0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetTask('carrying_water')}
                      className={`p-2 rounded border text-right ${
                        metTask === 'carrying_water'
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                          : 'border-slate-200'
                      }`}
                    >
                      نقل المياه والري (MET 6.5)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetTask('tree_planting')}
                      className={`p-2 rounded border text-right ${
                        metTask === 'tree_planting'
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                          : 'border-slate-200'
                      }`}
                    >
                      غرس وتدعيم الشتلات (MET 5.5)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetTask('site_clearing')}
                      className={`p-2 rounded border text-right ${
                        metTask === 'site_clearing'
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                          : 'border-slate-200'
                      }`}
                    >
                      تهيئة وتنظيف الأرض (MET 4.8)
                    </button>
                  </div>
                </div>

                {/* Terrain Slope Factor */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-800">
                      معامل انحدار التضاريس (Terrain Slope):
                    </span>
                    <span className="font-mono text-amber-800 font-bold">
                      {metSlope === 'flat' ? 'مستوي (1.0x)' : metSlope === 'moderate_slope' ? 'متوسط 5°-15° (+12%)' : 'جبلي حاد >15° (+25%)'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMetSlope('flat')}
                      className={`flex-1 py-1.5 px-2 rounded text-[11px] font-medium border ${
                        metSlope === 'flat'
                          ? 'bg-white border-amber-600 text-amber-900 shadow-sm'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      أرض منبسطة
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetSlope('moderate_slope')}
                      className={`flex-1 py-1.5 px-2 rounded text-[11px] font-medium border ${
                        metSlope === 'moderate_slope'
                          ? 'bg-white border-amber-600 text-amber-900 shadow-sm'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      منحدر متوسط (صناوة)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetSlope('steep_mountain')}
                      className={`flex-1 py-1.5 px-2 rounded text-[11px] font-medium border ${
                        metSlope === 'steep_mountain'
                          ? 'bg-white border-amber-600 text-amber-900 shadow-sm'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      مرتفعات وعرة (حزام السد)
                    </button>
                  </div>
                </div>

                {/* Ambient Temp & Cardiac Drift */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-800">
                      درجة الحرارة والإجهاد الحراري:
                    </span>
                    <span className="font-mono text-amber-800 font-bold">
                      {metTemp === 'hot_summer' ? 'حار >30°C (+10% جهد)' : metTemp === 'moderate' ? 'معتدل 22°C (1.0x)' : 'بارد 14°C (-2%)'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMetTemp('cool')}
                      className={`flex-1 py-1.5 px-2 rounded text-[11px] font-medium border ${
                        metTemp === 'cool' ? 'bg-white border-amber-600 text-amber-900 font-bold' : 'border-slate-200'
                      }`}
                    >
                      طقس خريفي بارد
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetTemp('moderate')}
                      className={`flex-1 py-1.5 px-2 rounded text-[11px] font-medium border ${
                        metTemp === 'moderate' ? 'bg-white border-amber-600 text-amber-900 font-bold' : 'border-slate-200'
                      }`}
                    >
                      طقس معتدل (مثالي)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetTemp('hot_summer')}
                      className={`flex-1 py-1.5 px-2 rounded text-[11px] font-medium border ${
                        metTemp === 'hot_summer' ? 'bg-white border-amber-600 text-amber-900 font-bold' : 'border-slate-200'
                      }`}
                    >
                      صيف حار (تعرق عالي)
                    </button>
                  </div>
                </div>

                {/* Duration Slider */}
                <div>
                  <div className="flex justify-between font-medium text-slate-700 mb-1">
                    <span>مدة النشاط:</span>
                    <span className="font-mono font-bold text-amber-900">{metDuration} دقيقة</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="150"
                    step="15"
                    value={metDuration}
                    onChange={(e) => setMetDuration(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
              </div>
            </div>

            {/* Results: Adjusted MET & Macro/Electrolyte Synthesis */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    المخرجات الحيوية الديناميكية المحسوبة
                  </span>
                  <span className="font-mono text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    MET المعدل: {dynamicMetResult.adjustedMetValue} (الأساسي: {dynamicMetResult.metValue})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">السعرات المحروقة الإجمالية</span>
                    <span className="text-2xl font-bold font-mono text-amber-400">
                      {dynamicMetResult.caloriesBurned}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">kcal</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">بروتين الاستشفاء العضلي</span>
                    <span className="text-2xl font-bold font-mono text-emerald-400">
                      {dynamicMetResult.advancedRecovery.targetProteinGrams}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">g بروتين صافي</span>
                  </div>
                </div>

                {/* Electrolytes Breakdown */}
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60 text-xs space-y-2">
                  <span className="font-bold text-slate-300 block text-[11px]">
                    مصفوفة الشوارد الكهرلية والترطيب (Electrolyte Matrix):
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[11px]">
                    <div className="bg-slate-900 p-1.5 rounded">
                      <span className="text-[10px] text-slate-400 block">الماء</span>
                      <span className="font-bold text-blue-300">{dynamicMetResult.advancedRecovery.hydrationMl}ml</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded">
                      <span className="text-[10px] text-slate-400 block">صوديوم</span>
                      <span className="font-bold text-amber-300">{dynamicMetResult.advancedRecovery.sodiumMg}mg</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded">
                      <span className="text-[10px] text-slate-400 block">بوتاسيوم</span>
                      <span className="font-bold text-emerald-300">{dynamicMetResult.advancedRecovery.potassiumMg}mg</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded">
                      <span className="text-[10px] text-slate-400 block">مغنيسيوم</span>
                      <span className="font-bold text-purple-300">{dynamicMetResult.advancedRecovery.magnesiumMg}mg</span>
                    </div>
                  </div>
                </div>

                {/* Recovery Meal Profile */}
                <div className="bg-amber-950/40 p-3 rounded-lg border border-amber-800/50 text-xs text-amber-200 leading-relaxed">
                  <span className="font-bold text-amber-300 block mb-1">
                    🥗 صندوق الاستشفاء الموصى به من Healthy Brunchy:
                  </span>
                  {dynamicMetResult.advancedRecovery.recommendedRecipe}
                  <div className="mt-1 text-[11px] text-slate-400 font-mono">
                    النافذة البنائية لتعويض الجليكوجين: {dynamicMetResult.advancedRecovery.glycogenWindowMinutes} دقيقة · حمض الليوسين: {dynamicMetResult.advancedRecovery.leucineGrams}g
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: Smart Tree Tracking via QR-code schema & offline-sync */}
      {activeSection === 'qr_offline' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-200">
                SMART TREE CRYPTOGRAPHIC QR & OFFLINE-SYNC SCHEMA
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-emerald-100">
                بروتوكول التحقق الميداني وسجلات الري بدون إنترنت
              </span>
            </div>
            <h3 className="text-base font-bold mb-1">
              2. التتبع الذكي للأشجار برمز QR المشفر والمزامنة اللامركزية عبر Vector Clocks
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed max-w-3xl">
              تُزود كل شتلة بوسم QR / NFC مشفر يحتوي على توقيع رقمي يربط إحداثيات GPS بنوع الشجرة لمنع التلاعب. في المناطق الجبلية التي تنعدم فيها التغطية، يقوم المتطوع بمسح الوسم وتوثيق السقاية محلياً، وتُحل أي تعارضات (Conflict Resolution) تلقائياً فور الاتصال.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* QR Payload Generator & Verifier */}
            <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    هيكلية حمولة QR للشجرة (Cryptographic Payload Schema)
                  </h4>
                  <p className="text-xs text-slate-500">
                    مختومة بتوقيع HMAC لضمان مطابقة الشجرة لموقعها الجغرافي المسجل
                  </p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    qrVerification.isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {qrVerification.isValid ? 'توقيع معتمد ✓' : 'توقيع غير صالح'}
                </span>
              </div>

              {/* Tree Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">اختر الشجرة لفحص وسمها:</label>
                <select
                  value={selectedTreeForQR.id}
                  onChange={(e) => {
                    const found = INITIAL_TREES.find((t) => t.id === e.target.value);
                    if (found) setSelectedTreeForQR(found);
                  }}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50 font-mono"
                >
                  {INITIAL_TREES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tagCode} ({t.species}) - {t.adopterName}
                    </option>
                  ))}
                </select>
              </div>

              {/* JSON Payload viewer */}
              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto relative">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(sampleQRPayload, null, 2), 'qr_payload')}
                  className="absolute top-2.5 left-2.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedKey === 'qr_payload' ? 'تم!' : 'نسخ JSON'}</span>
                </button>
                <pre className="text-emerald-300 leading-relaxed">
{JSON.stringify(sampleQRPayload, null, 2)}
                </pre>
              </div>

              <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                🔒 <b>التوقيع الرقمي (Signature):</b> يمنع إنشاء رموز وهمية في مواقع مختلفة، حيث يرفض تطبيق المتطوع أي عملية ري إذا تباعد موقع GPS الحالي بأكثر من 25 متراً عن إحداثيات <code>coords</code> المشفرة في الوسم.
              </div>
            </div>

            {/* Offline Sync Simulation & Vector Clock Reconciliation */}
            <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                    محاكي طابور الري والمزامنة غير المتصلة (Offline Journal)
                  </h4>
                  <p className="text-xs text-slate-500">
                    تسجيل محلي بدون اتصال مع منع التكرار (Idempotency Key)
                  </p>
                </div>
                <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  {offlineSyncEvents.length} عمليات في الطابور
                </span>
              </div>

              {syncFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{syncFeedback}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSimulateOfflineWatering}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <Droplet className="w-3.5 h-3.5 text-blue-400" />
                  <span>محاكاة ري ميداني (حفظ محلياً دون 4G)</span>
                </button>
                <button
                  onClick={handleReconcileOfflineEvents}
                  disabled={offlineSyncEvents.length === 0}
                  className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    offlineSyncEvents.length > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>مزامنة الطابور الآن</span>
                </button>
              </div>

              {/* Event Queue List */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {offlineSyncEvents.length === 0 ? (
                  <div className="text-center p-6 border border-dashed border-slate-200 rounded-lg text-xs text-slate-400">
                    طابور المزامنة المحلي فارغ حالياً. انقر على الزر أعلاه لمحاكاة تسجيل ري بدون إنترنت.
                  </div>
                ) : (
                  offlineSyncEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-800 font-mono">
                          {evt.treeTagCode} · {evt.waterVolumeLiters}L ماء
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          مفتاح المزامنة: {evt.idempotencyKey.slice(0, 22)}... (ساعة منطقية: {evt.vectorClock})
                        </div>
                      </div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                        في انتظار المزامنة
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: Geo-AI metrics for measuring green area expansion and CO2 absorption rates */}
      {activeSection === 'geo_ai' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-teal-800 to-emerald-950 text-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-teal-200">
                GEO-AI SATELLITE/DRONE VEGETATION & BIOMASS CARBON ENGINE
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-teal-100">
                مؤشرات NDVI / SAVI ومعادلات الكتلة الحيوية للمتوسط
              </span>
            </div>
            <h3 className="text-base font-bold mb-1">
              3. القياسات الجغرافية بالذكاء الاصطناعي (Geo-AI) لتوسع الرقعة الخضراء وامتصاص الكربون
            </h3>
            <p className="text-xs text-teal-100/90 leading-relaxed max-w-3xl">
              تكامل نماذج الذكاء الاصطناعي لتحليل صور الأقمار الصناعية (Sentinel-2 / Landsat) والدرون لحساب مؤشر الغطاء النباتي (NDVI ومؤشر التربة المعدل SAVI)، مع تطبيق معادلات الكتلة الحيوية المقاسة (Allometric Equations) الخاصة بأشجار الزيتون والخروب والصنوبر الحلبي لتقدير أطنان الكربون الممتصة بدقة علمية.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Plot Metrics & NDVI Explorer */}
            <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    مؤشرات الاستشعار عن بعد لقطاعات ميلة (Geo-AI Remote Sensing)
                  </h4>
                  <p className="text-xs text-slate-500">
                    رصد التحسن في الغطاء النباتي والكثافة الشجرية منذ انطلاق المبادرة
                  </p>
                </div>
                <div className="flex gap-1">
                  {MILA_GEO_AI_PLOTS.map((plot) => (
                    <button
                      key={plot.plotId}
                      onClick={() => setSelectedPlot(plot)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        selectedPlot.plotId === plot.plotId
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {plot.plotName.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Plot Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-slate-900">{selectedPlot.plotName}</h5>
                  <span className="font-mono text-xs text-slate-500">
                    المساحة: {selectedPlot.areaHectares} هكتار
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">مؤشر NDVI الحالي</span>
                    <span className="font-mono font-bold text-base text-emerald-700">
                      {selectedPlot.ndviCurrent}
                    </span>
                    <span className="text-[10px] text-emerald-600 block">
                      +{(selectedPlot.ndviCurrent - selectedPlot.ndviBaseline).toFixed(2)} تحسن
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">مؤشر التربة (SAVI)</span>
                    <span className="font-mono font-bold text-base text-teal-700">
                      {selectedPlot.saviIndex}
                    </span>
                    <span className="text-[10px] text-slate-400 block">معامل L = 0.5</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">نسبة التاج الخضري (Canopy)</span>
                    <span className="font-mono font-bold text-base text-slate-900">
                      {selectedPlot.canopyCoveragePercent}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">تغطية تيجان الأشجار</span>
                  </div>
                </div>

                {/* Satellite Historical Trend Bar */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    مسار تحسن NDVI السنوي وفق رصد الأقمار الصناعية (2022 - 2026):
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 font-mono text-[11px] text-center">
                    {selectedPlot.historicalYears.map((yr, idx) => (
                      <div key={yr} className="bg-white p-2 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">{yr}</span>
                        <span className="font-bold text-emerald-800">
                          {selectedPlot.ndviTrend[idx]}
                        </span>
                        <span className="text-[9px] text-slate-500 block">
                          {selectedPlot.canopyTrendPercent[idx]}% تغطية
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Allometric Biomass Calculator */}
            <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-teal-600" />
                  حاسبة الكتلة الحيوية والمعادلات القياسية (Allometric Equations)
                </h4>
                <p className="text-xs text-slate-500">
                  حساب الكتلة التقديرية للشجرة ومخزون الكربون العضوي
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">النوع الشجري:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBiomassSpecies('olive')}
                      className={`py-1.5 px-2 rounded border text-center ${
                        biomassSpecies === 'olive' ? 'bg-emerald-700 text-white font-bold' : 'border-slate-200'
                      }`}
                    >
                      زيتون جبلي
                    </button>
                    <button
                      type="button"
                      onClick={() => setBiomassSpecies('carob')}
                      className={`py-1.5 px-2 rounded border text-center ${
                        biomassSpecies === 'carob' ? 'bg-emerald-700 text-white font-bold' : 'border-slate-200'
                      }`}
                    >
                      خروب
                    </button>
                    <button
                      type="button"
                      onClick={() => setBiomassSpecies('pine')}
                      className={`py-1.5 px-2 rounded border text-center ${
                        biomassSpecies === 'pine' ? 'bg-emerald-700 text-white font-bold' : 'border-slate-200'
                      }`}
                    >
                      صنوبر حلبي
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">قطر الجذع (سم):</label>
                    <input
                      type="number"
                      value={biomassStemDiameter}
                      onChange={(e) => setBiomassStemDiameter(Number(e.target.value))}
                      className="w-full p-2 rounded border border-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">الارتفاع (متر):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={biomassHeight}
                      onChange={(e) => setBiomassHeight(Number(e.target.value))}
                      className="w-full p-2 rounded border border-slate-200 font-mono"
                    />
                  </div>
                </div>

                {/* Biomass Outputs */}
                <div className="bg-teal-900 text-white p-3.5 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs border-b border-teal-800 pb-2">
                    <span className="text-teal-200">الكتلة الحيوية الكلية (شاملة الجذور):</span>
                    <span className="font-mono font-bold text-sm text-teal-100">
                      {biomassCalc.totalBiomassWithRootsKg} كغ
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-teal-800 pb-2">
                    <span className="text-teal-200">الكربون العضوي المخزن (47%):</span>
                    <span className="font-mono font-bold text-sm text-teal-100">
                      {biomassCalc.carbonStoredKg} كغ C
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-amber-300 font-bold">معدل امتصاص CO2 السنوي:</span>
                    <span className="font-mono font-bold text-base text-amber-300">
                      {biomassCalc.annualCo2RateKg} كغ/سنة
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: Emergency Dispatch Module schema for crisis volunteer routing */}
      {activeSection === 'emergency' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-rose-800 to-slate-900 text-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-rose-300">
                POSTGIS PGROUTING & EMERGENCY VOLUNTEER CRISIS DISPATCH
              </span>
              <span className="text-[10px] bg-rose-600 px-2 py-0.5 rounded text-white font-bold">
                توجيه الأزمات البيئية والتطويق الآمن
              </span>
            </div>
            <h3 className="text-base font-bold mb-1">
              4. وحدة إدارة الطوارئ والتوجيه المكاني لتفادي أخطار الأزمات البيئية
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed max-w-3xl">
              نظام استدعاء تكتيكي لحالات الطوارئ (كحرائق الغابات أو انجرافات السدود بميلة)؛ يقوم النظام بتصنيف المتطوعين لفئات فرز (Triage Tiers)، واحتساب مسارات وصول آمنة تتجاوز بؤر الخطر وحواجز الأمان عبر PostGIS، مع إصدار حزم مشفرة مضغوطة عبر رسائل SMS / شبكات LoRa Mesh عند انقطاع شبكة الهاتف المحمول.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Active Crisis Selector & Safe Route */}
            <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    بلاغ الطوارئ النشط وحزام الأمان (Hazard Buffer)
                  </h4>
                  <p className="text-xs text-slate-500">
                    توليد مسارات وصول آمنة تتجاوز محيط الحريق بمسافة لا تقل عن 600 متر
                  </p>
                </div>
                <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold font-mono">
                  {selectedCrisis.severity}
                </span>
              </div>

              {/* Crisis details card */}
              <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <h5 className="font-bold text-rose-950 text-sm">{selectedCrisis.title}</h5>
                  <span className="font-mono text-[10px] text-rose-700">{selectedCrisis.reportedAt}</span>
                </div>
                <p className="text-slate-700 text-xs">{selectedCrisis.affectedZoneName}</p>

                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                  <div className="bg-white p-2 rounded border border-rose-200 text-center">
                    <span className="text-[10px] text-slate-400 block">نطاق الإخلاء</span>
                    <span className="font-bold text-rose-900">{selectedCrisis.evacuationRadiusMeters}م</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-rose-200 text-center">
                    <span className="text-[10px] text-slate-400 block">المتطوعون المطلوبون</span>
                    <span className="font-bold text-slate-800">{selectedCrisis.minimumVolunteersNeeded} فرد</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-rose-200 text-center">
                    <span className="text-[10px] text-slate-400 block">تم استدعاؤهم</span>
                    <span className="font-bold text-emerald-700">{selectedCrisis.confirmedDispatchedCount} مؤكد</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-rose-200 text-slate-800 text-[11px] flex items-center justify-between">
                  <span>📍 نقطة التجمع الآمنة المجهزة:</span>
                  <b className="text-slate-900">{selectedCrisis.safeAssemblyPoint.name}</b>
                </div>
              </div>

              {/* Safe Route Protocol & SMS Packet */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    حزمة التوجيه المضغوطة للعمل بدون إنترنت (160-char SMS Fallback Packet):
                  </span>
                  <button
                    onClick={() => copyToClipboard(sampleCrisisRoute.offlineCompressedSmsPacket, 'sms_packet')}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-mono"
                  >
                    {copiedKey === 'sms_packet' ? 'تم النسخ!' : 'نسخ الحزمة'}
                  </button>
                </div>
                <div className="bg-slate-900 text-emerald-300 p-2.5 rounded-lg font-mono text-[11px] break-all border border-slate-800">
                  {sampleCrisisRoute.offlineCompressedSmsPacket}
                </div>
                <div className="text-[11px] text-slate-500">
                  المسار يتجنب سحابة الدخان بمحاذاة وادي ميلة؛ مسافة العبور: <b className="font-mono">{sampleCrisisRoute.distanceKm} كم</b> · مؤشر أمان المسار: <b className="font-mono text-emerald-700">{sampleCrisisRoute.routeSafetyScore}/100</b>
                </div>
              </div>
            </div>

            {/* Volunteer Triage Tiers */}
            <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-rose-600" />
                  فرز المتطوعين التكتيكي (Crisis Volunteer Triage)
                </h4>
                <p className="text-xs text-slate-500">
                  توزيع المهام بحسب اللياقة والمهارات التخصصية المعتمدة
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {/* Tier 1 */}
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-rose-950 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      الفئة 1: الإسعاف الأولي والطوارئ الطبية
                    </span>
                    <span className="font-mono text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded font-bold">
                      {crisisTriage.tier1Medical.length} متطوع
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    مختصون بالدعم الطبي الميداني والإنعاش وإخلاء المصابين.
                  </p>
                </div>

                {/* Tier 2 */}
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-amber-950 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                      الفئة 2: فتح خطوط عزل النيران (Firebreak)
                    </span>
                    <span className="font-mono text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                      {crisisTriage.tier2Firebreak.length} متطوع
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    أصحاب اللياقة الرياضية العالية (Athlete) ومهارات الحفر الشاق والتقليم السريع.
                  </p>
                </div>

                {/* Tier 3 */}
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-blue-950 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      الفئة 3: نقل المياه واللوجستيات
                    </span>
                    <span className="font-mono text-[10px] bg-blue-200 text-blue-900 px-1.5 py-0.2 rounded font-bold">
                      {crisisTriage.tier3Logistics.length} متطوع
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    تأمين شاحنات المياه وخزانات السقاية وتوزيع وجبات الاستشفاء.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXISTING SECTIONS (Blueprint, Schema, Algorithms, API) */}
      {activeSection === 'blueprint' && (
        <div className="space-y-4">
          <div className="bg-emerald-900 text-white rounded-xl p-5 shadow-sm border border-emerald-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-300 font-mono">
                PILOT CASE STUDY · WILAYA DE MILA
              </span>
              <span className="text-[11px] bg-emerald-800 px-2.5 py-0.5 rounded text-emerald-100">
                المرحلة الميدانية الأولى
              </span>
            </div>
            <h3 className="text-base font-bold mb-1">
              مخطط تنفيذ التجربة الحية: تشجير محيط المرفق الشبابي لولاية ميلة وتوزيع وجبات التعافي
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl">
              دليل تشغيلي متكامل من 5 خطوات يوضح كيفية تدفق البيانات بين المنظمين والمتطوعين وشريك التغذية (Healthy Brunchy) في يوم الفعالية الميدانية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              {
                step: '01',
                title: 'تحديد الاحتياج الجغرافي',
                owner: 'مدير المرفق الشبابي بميلة',
                desc: 'رسم مضلع محيط المرفق الشرفي، وتحديد استيعاب 150 شتلة زيتون وخروب وتخصيص حصة 30 وجبة استشفاء مدعومة من Healthy Brunchy.',
                tech: 'GIS Polygon / Need Heatmap',
              },
              {
                step: '02',
                title: 'الفرز والاستدعاء الذكي',
                owner: 'خوارزمية PostGIS ST_DWithin',
                desc: 'فرز متطوعي ولاية ميلة ضمن نطاق 5 كم حسب توافق مهارات الزراعة والحفر، وإرسال إشعار توجيه مع خاصية التخزين المحلي Offline Cache.',
                tech: 'Spatial Match + IndexedDB',
              },
              {
                step: '03',
                title: 'التنفيذ وتوثيق الأشجار',
                owner: 'فرق المتطوعين الميدانية',
                desc: 'غرس الشتلات وتثبيت وسوم NFC/QR لكل شجرة، وحساب وقت الجهد الفعلي لحرق السعرات وفق المكافئ الأيضي (MET = 5.5 - 7.0).',
                tech: 'Tree Registry + MET Tracker',
              },
              {
                step: '04',
                title: 'صرف وجبة الاستشفاء',
                owner: 'Healthy Brunchy (نقطة التوزيع)',
                desc: 'توليد قسيمة تعافٍ رقمية بمغذيات دقيقة (32g بروتين، 70g كربوهيدرات)، ومسح رمز الـ QR من قبل الشريك لصرف صندوق الاستشفاء فوراً.',
                tech: 'HMAC QR / Voucher Scanner',
              },
              {
                step: '05',
                title: 'إغلاق الدورة والرعاية الدائمة',
                owner: 'المنصة والمجتمع المحلي',
                desc: 'ربط المتطوعين بجدول السقاية الدوري للأشجار التي غرسوها عبر تنبيهات ذكية، مع إصدار تقرير المسؤولية المجتمعية (CSR) للشريك.',
                tech: 'Care Ledger + CSR Cert',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      الخطوة {s.step}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">{s.owner}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mb-1.5">{s.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{s.desc}</p>
                </div>
                <div className="text-[10px] font-mono bg-slate-50 text-slate-600 p-1.5 rounded border border-slate-100 text-center">
                  {s.tech}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCHEMA */}
      {activeSection === 'schema' && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto relative border border-slate-800">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400">
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                PostgreSQL + PostGIS Production Schema DDL (شامل الطوارئ وسجلات QR)
              </span>
              <button
                onClick={() => copyToClipboard(`-- Full SQL Schema...`, 'sql_full')}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded transition-colors flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedKey === 'sql_full' ? 'تم النسخ!' : 'نسخ كود SQL'}</span>
              </button>
            </div>
            <pre className="text-slate-300 text-[11px] leading-relaxed">
{`-- 1. جدول الأشجار مع التوقيع الرقمي للـ QR
CREATE TABLE tree_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    adopter_id UUID REFERENCES users(id),
    species VARCHAR(100) NOT NULL,
    tree_tag_code VARCHAR(50) UNIQUE NOT NULL,
    crypto_signature VARCHAR(64) NOT NULL,
    coordinates GEOMETRY(Point, 4326) NOT NULL,
    planted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    health_status VARCHAR(20) DEFAULT 'healthy',
    last_watered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estimated_annual_co2_kg NUMERIC(6,2) DEFAULT 22.0
);
CREATE INDEX idx_tree_coords ON tree_registry USING GIST (coordinates);

-- 2. جدول المزامنة غير المتصلة وسجلات الري الميداني
CREATE TABLE offline_watering_journal (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    tree_tag_code VARCHAR(50) REFERENCES tree_registry(tree_tag_code),
    volunteer_id UUID REFERENCES users(id),
    water_volume_liters NUMERIC(5,2) DEFAULT 10.0,
    soil_moisture_status VARCHAR(20) DEFAULT 'optimal',
    vector_clock INT NOT NULL DEFAULT 1,
    client_recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    server_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. جداول طوارئ الأزمات وتوجيه المتطوعين (pgRouting)
CREATE TABLE crisis_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    crisis_type VARCHAR(50) NOT NULL, -- wildfire, flash_flood, siltation
    severity_level VARCHAR(30) NOT NULL,
    hazard_perimeter GEOMETRY(Polygon, 4326) NOT NULL,
    hazard_buffer GEOMETRY(Polygon, 4326) NOT NULL, -- عازل الأمان
    safe_assembly_point GEOMETRY(Point, 4326) NOT NULL,
    min_volunteers_quota INT DEFAULT 30,
    status VARCHAR(20) DEFAULT 'active'
);
CREATE INDEX idx_crisis_hazard_buffer ON crisis_events USING GIST (hazard_buffer);`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
