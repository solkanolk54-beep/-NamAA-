import React, { useState, useEffect } from 'react';
import { TreeItem, TreeHealthStatus, User } from '../types';
import {
  createTreeQRPayload,
  verifyTreeQRPayload,
  OfflineWateringSyncManager
} from '../utils/treeTrackingOffline';
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Droplet,
  Sprout,
  X,
  RefreshCw,
  Ruler,
  Maximize2,
  Sparkles,
  ShieldCheck,
  Printer,
  Compass,
  ArrowRight
} from 'lucide-react';

interface TreeQrScannerModalProps {
  trees: TreeItem[];
  volunteer: User;
  isOffline: boolean;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTree: (
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
  initialSelectedTree?: TreeItem | null;
}

export const TreeQrScannerModal: React.FC<TreeQrScannerModalProps> = ({
  trees,
  volunteer,
  isOffline,
  isOpen,
  onClose,
  onUpdateTree,
  initialSelectedTree,
}) => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'tag_print'>('scanner');
  const [scannedTree, setScannedTree] = useState<TreeItem | null>(
    initialSelectedTree || trees[0] || null
  );

  // Scanning animation & verification state
  const [isScanning, setIsScanning] = useState(false);
  const [scanVerified, setScanVerified] = useState(false);

  // Field Form State
  const [waterLiters, setWaterLiters] = useState<number>(10);
  const [soilMoisture, setSoilMoisture] = useState<'dry' | 'moderate' | 'optimal'>('optimal');
  const [healthStatus, setHealthStatus] = useState<TreeHealthStatus>('healthy');
  const [growthStage, setGrowthStage] = useState<'sapling' | 'young' | 'maturing' | 'mature'>('sapling');
  const [heightCm, setHeightCm] = useState<number>(scannedTree?.heightCm || 85);
  const [canopyDiameterCm, setCanopyDiameterCm] = useState<number>(scannedTree?.canopyDiameterCm || 45);
  const [submitFeedback, setSubmitFeedback] = useState<{ type: 'online' | 'offline'; msg: string } | null>(null);

  // Sync initial tree if passed
  useEffect(() => {
    if (initialSelectedTree) {
      setScannedTree(initialSelectedTree);
      setHeightCm(initialSelectedTree.heightCm || 85);
      setCanopyDiameterCm(initialSelectedTree.canopyDiameterCm || 45);
      setHealthStatus(initialSelectedTree.healthStatus);
      setScanVerified(true);
    }
  }, [initialSelectedTree]);

  if (!isOpen) return null;

  // Generate cryptographic QR payload for the scanned tree
  const qrPayload = scannedTree ? createTreeQRPayload(scannedTree) : null;
  const isSignatureValid = qrPayload ? verifyTreeQRPayload(qrPayload).isValid : false;

  const handleSimulateScan = (tree: TreeItem) => {
    setIsScanning(true);
    setScanVerified(false);
    setTimeout(() => {
      setScannedTree(tree);
      setHeightCm(tree.heightCm || (tree.species.includes('Olive') ? 95 : 110));
      setCanopyDiameterCm(tree.canopyDiameterCm || 50);
      setHealthStatus('healthy');
      setIsScanning(false);
      setScanVerified(true);
    }, 700);
  };

  const handleSaveFieldInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedTree) return;

    const pointsEarned = 25; // 15 for watering + 10 for growth measurement

    if (isOffline) {
      // Record locally in offline sync queue
      OfflineWateringSyncManager.recordOfflineWatering(
        scannedTree.tagCode,
        volunteer.id,
        volunteer.fullName,
        waterLiters,
        soilMoisture,
        {
          healthStatus,
          heightCm,
          canopyDiameterCm,
          growthStage,
        }
      );

      // Optimistic local UI update
      onUpdateTree(scannedTree.id, {
        healthStatus,
        waterVolumeLiters: waterLiters,
        soilMoistureLevel: soilMoisture,
        heightCm,
        canopyDiameterCm,
        growthStage,
        earnedPoints: pointsEarned,
      });

      setSubmitFeedback({
        type: 'offline',
        msg: `تم حفظ سقاية وقياسات الشجرة محلياً (Offline Queue)! ستتم المزامنة التلقائية فور عودة الاتصال (+${pointsEarned} نقطة أثر معلقة).`,
      });
    } else {
      // Online direct update
      onUpdateTree(scannedTree.id, {
        healthStatus,
        waterVolumeLiters: waterLiters,
        soilMoistureLevel: soilMoisture,
        heightCm,
        canopyDiameterCm,
        growthStage,
        earnedPoints: pointsEarned,
      });

      setSubmitFeedback({
        type: 'online',
        msg: `تم تحديث حالة الشجرة فورياً ومزامنتها مع الخادم المركزي! تم منحك +${pointsEarned} نقطة أثر.`,
      });
    }

    setTimeout(() => {
      setSubmitFeedback(null);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                ماسح رمز QR وتوثيق الري الميداني والنمو
              </h3>
              <p className="text-[11px] text-slate-400">
                التحقق التشفيري من الأشجار المغروسة والتخزين المحلي دون إنترنت
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOffline && (
              <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded font-medium">
                وضع دون اتصال (Offline)
              </span>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Tabs: Scanner vs Print Physical Tag */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-medium">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'scanner'
                ? 'border-emerald-600 text-emerald-950 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>محطة المسح والتحديث الميداني</span>
          </button>
          <button
            onClick={() => setActiveTab('tag_print')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'tag_print'
                ? 'border-emerald-600 text-emerald-950 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>بطاقة وسم QR الميدانية للطباعة</span>
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {activeTab === 'scanner' && (
            <div className="space-y-4 text-xs">
              {/* Camera Scanner Viewfinder Simulation */}
              <div className="bg-slate-950 rounded-xl p-4 text-white relative overflow-hidden flex flex-col items-center justify-center border border-slate-800">
                {/* Laser scan line animation */}
                <div className="w-48 h-48 border-2 border-dashed border-emerald-500/80 rounded-xl relative flex items-center justify-center bg-emerald-950/20">
                  <div className="absolute top-0 right-0 left-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></div>

                  {/* QR Symbol Inside */}
                  <div className="p-2 bg-white rounded-lg">
                    <div className="w-24 h-24 grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded">
                      <div className="bg-white rounded-xs col-span-2 row-span-2"></div>
                      <div className="bg-emerald-400 rounded-xs"></div>
                      <div className="bg-white rounded-xs"></div>
                      <div className="bg-white rounded-xs"></div>
                      <div className="bg-emerald-400 rounded-xs"></div>
                      <div className="bg-white rounded-xs col-span-2 row-span-2"></div>
                      <div className="bg-white rounded-xs"></div>
                    </div>
                  </div>

                  {/* Corner Target Markers */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                </div>

                <div className="mt-3 text-center">
                  <span className="font-mono text-[11px] text-emerald-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isScanning ? 'جاري فحص التوقيع الرقمي...' : 'كاميرا المسح الميداني جاهزة للتوجيه نحو وسم الشجرة'}
                  </span>
                </div>

                {/* Quick Tree Selector Pills to simulate field scanning */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 pt-2 border-t border-slate-800 w-full">
                  <span className="text-[10px] text-slate-400 ml-1">اختر شجرة للمسح التجريبي:</span>
                  {trees.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSimulateScan(t)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        scannedTree?.id === t.id
                          ? 'bg-emerald-500 text-white font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {t.tagCode} ({t.species.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Alert */}
              {submitFeedback && (
                <div
                  className={`p-3 rounded-lg flex items-center gap-2 text-xs ${
                    submitFeedback.type === 'offline'
                      ? 'bg-amber-50 border border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{submitFeedback.msg}</span>
                </div>
              )}

              {/* Verified Tree Header Card */}
              {scannedTree && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {scannedTree.tagCode}
                        </span>
                        <span className="font-bold text-slate-800 text-xs">{scannedTree.species}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        المتطوع الراعي: <b className="text-slate-700">{scannedTree.adopterName || 'غير متبناة'}</b> · تاريخ الغرس: {scannedTree.plantedAt}
                      </span>
                    </div>

                    <div className="text-left font-mono">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        توقيع موثق ✓
                      </span>
                      <span className="block text-[9px] text-slate-400 mt-0.5">
                        {qrPayload?.cryptoSignature}
                      </span>
                    </div>
                  </div>

                  {/* Form: Update Watering & Growth */}
                  <form onSubmit={handleSaveFieldInspection} className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Section 1: Watering */}
                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800 block text-xs flex items-center gap-1.5 text-blue-700">
                          <Droplet className="w-3.5 h-3.5" />
                          1. توثيق السقاية وكمية المياه:
                        </span>

                        <div>
                          <label className="block text-[11px] text-slate-600 mb-1">
                            حجم المياه المسكوبة:
                          </label>
                          <div className="grid grid-cols-4 gap-1">
                            {[5, 10, 15, 20].map((liters) => (
                              <button
                                key={liters}
                                type="button"
                                onClick={() => setWaterLiters(liters)}
                                className={`py-1 text-center rounded text-[11px] font-mono font-bold border transition-colors ${
                                  waterLiters === liters
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                {liters}L
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-600 mb-1">
                            مستوى رطوبة التربة بعد الري:
                          </label>
                          <select
                            value={soilMoisture}
                            onChange={(e) => setSoilMoisture(e.target.value as any)}
                            className="w-full p-1.5 rounded border border-slate-200 text-xs bg-slate-50 font-medium"
                          >
                            <option value="optimal">رطوبة ممتازة (مشبعة بالكامل)</option>
                            <option value="moderate">رطوبة متوسطة</option>
                            <option value="dry">تربة جافة بحاجة لمزيد من الماء</option>
                          </select>
                        </div>
                      </div>

                      {/* Section 2: Growth & Inspection */}
                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800 block text-xs flex items-center gap-1.5 text-emerald-700">
                          <Sprout className="w-3.5 h-3.5" />
                          2. قياسات النمو والصحة الميدانية:
                        </span>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-500 mb-1">الارتفاع (سم):</label>
                            <input
                              type="number"
                              value={heightCm}
                              onChange={(e) => setHeightCm(Number(e.target.value))}
                              className="w-full p-1.5 rounded border border-slate-200 font-mono text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 mb-1">عرض التاج (سم):</label>
                            <input
                              type="number"
                              value={canopyDiameterCm}
                              onChange={(e) => setCanopyDiameterCm(Number(e.target.value))}
                              className="w-full p-1.5 rounded border border-slate-200 font-mono text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">الحالة الصحية:</label>
                          <select
                            value={healthStatus}
                            onChange={(e) => setHealthStatus(e.target.value as any)}
                            className="w-full p-1.5 rounded border border-slate-200 text-xs bg-slate-50 font-medium"
                          >
                            <option value="healthy">سليمة ونامية بشكل طبيعي ✓</option>
                            <option value="pruned">تم تقليم الأغصان الجافة</option>
                            <option value="needs_water">مجهدة وبحاجة لسقاية عاجلة</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-xs"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>
                        {isOffline
                          ? 'حفظ السقاية والقياسات محلياً (Offline Queue)'
                          : 'اعتماد وتحديث السجل ومزامنة البيانات فورياً (+25 نقطة أثر)'}
                      </span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Physical Tag Print Preview */}
          {activeTab === 'tag_print' && scannedTree && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                {/* Physical Tag Preview Card */}
                <div className="w-48 bg-white p-4 rounded-xl border-2 border-slate-900 shadow-md text-center space-y-2">
                  <div className="font-extrabold text-slate-900 text-xs border-b border-slate-200 pb-1">
                    نَماء وصِحّة · ميلة
                  </div>

                  {/* QR Graphic */}
                  <div className="w-28 h-28 mx-auto p-1 bg-white border border-slate-300 rounded flex items-center justify-center">
                    <div className="w-full h-full grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded">
                      <div className="bg-white rounded-xs col-span-2 row-span-2"></div>
                      <div className="bg-emerald-400 rounded-xs"></div>
                      <div className="bg-white rounded-xs"></div>
                      <div className="bg-white rounded-xs"></div>
                      <div className="bg-emerald-400 rounded-xs"></div>
                      <div className="bg-white rounded-xs col-span-2 row-span-2"></div>
                      <div className="bg-white rounded-xs"></div>
                    </div>
                  </div>

                  <div className="font-mono font-bold text-xs text-slate-900">
                    {scannedTree.tagCode}
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium">
                    {scannedTree.species.split(' ')[0]}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">
                    {scannedTree.lat.toFixed(4)}°N, {scannedTree.lng.toFixed(4)}°E
                  </div>
                </div>

                {/* Print Info */}
                <div className="flex-1 space-y-2 text-slate-700">
                  <h4 className="font-bold text-sm text-slate-900">
                    بطاقة الوسم الفيزيائية المقاومة للعوامل الجوية
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    تُطبع هذه البطاقة على بلاستيك مقوى مقاوم للشمس والماء وتُعلق على دعامة الشجرة في الميدان بمحيط مركب ميلة أو غابة صناوة.
                  </p>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] font-mono space-y-1">
                    <div>رمز الشجرة: <b className="text-slate-900">{scannedTree.tagCode}</b></div>
                    <div>التوقيع الرقمي: <b className="text-emerald-700">{qrPayload?.cryptoSignature}</b></div>
                    <div>نوع الأصل: <b className="text-slate-900">{scannedTree.species}</b></div>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="py-1.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>طباعة بطاقة الوسم الميدانية</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
