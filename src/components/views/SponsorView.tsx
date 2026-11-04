import React, { useState } from 'react';
import { NutritionalVoucher } from '../../types';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  UtensilsCrossed,
  Award,
  Clock,
  Search,
  Check,
  ShieldCheck,
  Printer,
  Sparkles,
  HeartPulse,
  Leaf
} from 'lucide-react';

interface SponsorViewProps {
  vouchers: NutritionalVoucher[];
  onRedeemVoucher: (voucherCode: string) => boolean;
}

export const SponsorView: React.FC<SponsorViewProps> = ({
  vouchers,
  onRedeemVoucher,
}) => {
  const [inputCode, setInputCode] = useState<string>('');
  const [scannedVoucher, setScannedVoucher] = useState<NutritionalVoucher | null>(null);
  const [scanMessage, setScanMessage] = useState<{
    type: 'success' | 'error' | 'already_redeemed';
    text: string;
  } | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Filter vouchers
  const activeVouchers = vouchers.filter((v) => !v.isRedeemed);
  const redeemedVouchers = vouchers.filter((v) => v.isRedeemed);

  const handleVerifyCode = (codeToTest?: string) => {
    const code = (codeToTest || inputCode).trim().toUpperCase();
    if (!code) return;

    const found = vouchers.find((v) => v.code.toUpperCase() === code);
    if (!found) {
      setScannedVoucher(null);
      setScanMessage({
        type: 'error',
        text: 'رمز القسيمة غير صالح أو غير مسجل في منظومة نَماء وصِحّة!',
      });
      return;
    }

    setScannedVoucher(found);

    if (found.isRedeemed) {
      setScanMessage({
        type: 'already_redeemed',
        text: `تم صرف هذه القسيمة مسبقاً للمتطوع ${found.volunteerName} في ${found.redeemedAt}.`,
      });
    } else {
      setScanMessage({
        type: 'success',
        text: 'القسيمة معتمدة وصالحة للصرف الفوري! تم التحقق من الجهد البدني للمتطوع.',
      });
    }
  };

  const handleDispenseMeal = () => {
    if (!scannedVoucher) return;
    const success = onRedeemVoucher(scannedVoucher.code);
    if (success) {
      setScannedVoucher({
        ...scannedVoucher,
        isRedeemed: true,
        redeemedAt: new Date().toLocaleTimeString('ar-DZ', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
      setScanMessage({
        type: 'success',
        text: `تم اعتماد وتسليم وجبة الاستشفاء بنجاح للمتطوع ${scannedVoucher.volunteerName}!`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Sponsor Brand Lockup & CSR Summary */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/20 text-amber-100">
              بوابة الشركاء والرعاة (Sponsor Portal)
            </span>
            <span className="text-xs text-amber-200">· شريك التغذية الرياضية الرسمي</span>
          </div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-amber-300" />
            Healthy Brunchy & مزارع ولاية ميلة
          </h2>
          <p className="text-xs text-amber-100/90 mt-1 max-w-xl leading-relaxed">
            رعاية حصرية للمبادرات البيئية الرياضية بميلة: تمكين المتطوعين بوجبات بروتينية طبيعية لتعافي الألياف العضلية بعد مجهود الحفر والتشجير.
          </p>
        </div>

        <button
          onClick={() => setShowCertificateModal(true)}
          className="px-4 py-2 bg-white text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-50 transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Award className="w-4 h-4 text-amber-600" />
          <span>شهادة الأثر البيئي والمسؤولية المجتمعية (CSR)</span>
        </button>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">إجمالي الوجبات المصروفة</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {redeemedVouchers.length}
            </span>
            <span className="text-xs text-slate-400">/ {vouchers.length} وجبة جاهزة</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">صناديق دجاج مشوي وكينوا وتمر بلدي</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">ساعات الجهد التطوعي المدعومة</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-700">
              {(redeemedVouchers.length * 1.5 + 24).toFixed(0)}
            </span>
            <span className="text-xs text-slate-400">ساعة عمل ميداني</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">مكافئ لحرق أكثر من 24,000 سعرة حرارية</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">امتصاص الكربون المدعوم برعايتكم</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-teal-700">
              {(redeemedVouchers.length * 1100 + 4400)}
            </span>
            <span className="text-xs text-slate-400">كغ CO2 مكافئ</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">مساهمة ملموسة في خفض البصمة الكربونية لميلة</span>
        </div>
      </div>

      {/* QR Code Voucher Scanner / Verification Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scanner Terminal */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-600" />
              محطة التحقق من قسائم الوجبات (Voucher Redemption Terminal)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              قم بمسح رمز QR أو إدخال كود القسيمة للتحقق وصرف صندوق الاستشفاء الرياضي للمتطوع
            </p>
          </div>

          {/* Quick Input Bar */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              كود القسيمة الرقمية (Voucher Code):
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="مثال: BRUNCHY-MLA-7892"
                  className="w-full pl-3 pr-9 py-2.5 rounded-lg border border-slate-300 text-xs font-mono font-bold uppercase focus:outline-none focus:border-amber-600 bg-slate-50 focus:bg-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
              <button
                onClick={() => handleVerifyCode()}
                className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-colors shrink-0"
              >
                التحقق من الكود
              </button>
            </div>

            {/* Quick Test Codes Buttons */}
            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500">
              <span>أكواد تجريبية سريعة:</span>
              <button
                type="button"
                onClick={() => {
                  setInputCode('BRUNCHY-MLA-4521');
                  handleVerifyCode('BRUNCHY-MLA-4521');
                }}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono text-[10px]"
              >
                BRUNCHY-MLA-4521 (جاهزة للصرف)
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputCode('BRUNCHY-MLA-7892');
                  handleVerifyCode('BRUNCHY-MLA-7892');
                }}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono text-[10px]"
              >
                BRUNCHY-MLA-7892 (مصروفة مسبقاً)
              </button>
            </div>
          </div>

          {/* Scan Status Message */}
          {scanMessage && (
            <div
              className={`p-3.5 rounded-lg text-xs flex items-start gap-2.5 ${
                scanMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  : scanMessage.type === 'already_redeemed'
                  ? 'bg-amber-50 border border-amber-200 text-amber-900'
                  : 'bg-rose-50 border border-rose-200 text-rose-900'
              }`}
            >
              {scanMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{scanMessage.text}</span>
            </div>
          )}

          {/* Verified Voucher Details Box */}
          {scannedVoucher && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">اسم المتطوع المستحق:</span>
                  <span className="font-bold text-sm text-slate-900">
                    {scannedVoucher.volunteerName}
                  </span>
                </div>
                <div className="text-left font-mono">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      scannedVoucher.isRedeemed
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {scannedVoucher.isRedeemed ? 'تم الصرف مسبقاً' : 'صالحة وغير مستعملة'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">الوجبة المعتمدة:</span>
                <span className="font-medium text-slate-800 block text-xs">
                  {scannedVoucher.mealName}
                </span>
              </div>

              {/* Macro Nutritional Matrix */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">بروتين عالي</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {scannedVoucher.targetProteinG}g
                  </span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">كربوهيدرات</span>
                  <span className="font-mono font-bold text-amber-700">
                    {scannedVoucher.targetCarbsG}g
                  </span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">سعرات الوجبة</span>
                  <span className="font-mono font-bold text-slate-800">
                    {scannedVoucher.calories}
                  </span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">ماء وترطيب</span>
                  <span className="font-mono font-bold text-blue-700">
                    {scannedVoucher.hydrationMl}ml
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {!scannedVoucher.isRedeemed ? (
                <button
                  onClick={handleDispenseMeal}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <UtensilsCrossed className="w-4 h-4 text-emerald-200" />
                  <span>تأكيد تسليم وجبة الاستشفاء الآن (Redeem Meal)</span>
                </button>
              ) : (
                <div className="text-center text-slate-400 text-xs py-1">
                  تم تسليم هذه الوجبة وإغلاق القسيمة في السجل الرقمي.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nutritional Kitchen Preparation Guide */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-rose-600" />
              مواصفات وجبة الاستشفاء الرياضي (Recovery Specs)
            </h3>
            <p className="text-xs text-slate-500">
              معايير إعداد وجبات المتطوعين وفق توصيات أخصائي التغذية الرياضية
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="font-bold text-slate-800 block mb-1">
                🍗 المكونات الأساسية لصندوق Healthy Brunchy:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                <li>180غ صدر دجاج مشوي متبل بأعشاب جبال ميلة البرية (أو بديل نباتي غني).</li>
                <li>120غ كينوا وحبوب كاملة لتعويض مخازن الجليكوجين العضلي ببطء.</li>
                <li>حبتين تمر دقلة نور بلدي + رشة لوز طبيعي لمضادات الأكسدة.</li>
                <li>قارورة ماء معدني نقي 750 مل معزز بشوارد المغنيسيوم والبوتاسيوم.</li>
              </ul>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/50 text-[11px] text-amber-900 leading-relaxed">
              💡 <b>النافذة البنائية (Anabolic Window):</b> يُنصح بتناول وجبة التعافي خلال 45 إلى 60 دقيقة من انتهاء نشاط الحفر والغرس لضمان سرعة ترميم الألياف وتقليل الإجهاد العضلي.
            </div>

            {/* List of Recent Vouchers */}
            <div className="pt-2">
              <span className="font-bold text-slate-800 block mb-2 text-xs">
                سجل القسائم الأخيرة:
              </span>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                {vouchers.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      setInputCode(v.code);
                      handleVerifyCode(v.code);
                    }}
                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">
                        {v.volunteerName}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">{v.code}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        v.isRedeemed
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-emerald-100 text-emerald-800 font-bold'
                      }`}
                    >
                      {v.isRedeemed ? 'مصروفة' : 'جاهزة للصرف'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Official CSR Certificate */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border-4 border-amber-600/30 shadow-2xl relative">
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest block">
                الجمهورية الجزائرية الديمقراطية الشعبية
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                شهادة الأثر البيئي والمسؤولية المجتمعية (CSR)
              </h3>
              <p className="text-xs text-slate-500">
                الممنوحة لشريك التغذية الصحية: <b>Healthy Brunchy</b>
              </p>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-700 leading-relaxed text-right" dir="rtl">
              <p>
                تُشهد منصة <b>«نَماء وصِحّة»</b> بالتعاون مع المرفق الشرفي والرياضي للشباب بولاية ميلة، بأن الشريك الراعي <b>Healthy Brunchy</b> قد ساهم بفعالية في:
              </p>

              <div className="grid grid-cols-2 gap-2 text-center my-3">
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <span className="text-[10px] text-amber-700 block">الوجبات المقدمة للشباب</span>
                  <span className="font-mono text-base font-bold text-amber-950">
                    {redeemedVouchers.length} وجبة استشفاء
                  </span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block">أشجار الزيتون المدعومة</span>
                  <span className="font-mono text-base font-bold text-emerald-950">
                    150 شتلة مثمرة
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                تقديراً لدوركم الريادي في دعم صحة المتطوعين ومكافحة التصحر بإقليم ولاية ميلة.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
              <span className="font-mono text-slate-400 text-[11px]">MLA-CSR-2026-HB</span>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
