import React, { useState } from 'react';
import { NutritionalVoucher } from '../../types';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  UtensilsCrossed,
  Sparkles,
  Camera,
  ShieldCheck,
  Clock,
  Dumbbell,
  Droplet,
  Award,
} from 'lucide-react';

interface RecoveryPageProps {
  vouchers: NutritionalVoucher[];
  onRedeemVoucher: (voucherCode: string) => boolean;
}

export const RecoveryPage: React.FC<RecoveryPageProps> = ({
  vouchers,
  onRedeemVoucher,
}) => {
  const [voucherCodeInput, setVoucherCodeInput] = useState<string>('');
  const [selectedVoucherForScan, setSelectedVoucherForScan] = useState<NutritionalVoucher | null>(null);
  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'error' | 'already_redeemed';
    msg: string;
    voucher?: NutritionalVoucher;
  } | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const pendingVouchers = vouchers.filter((v) => !v.isRedeemed);
  const redeemedVouchers = vouchers.filter((v) => v.isRedeemed);

  const handleManualRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCodeInput.trim()) return;

    const code = voucherCodeInput.trim().toUpperCase();
    const existing = vouchers.find((v) => v.code.toUpperCase() === code);

    if (!existing) {
      setScanResult({
        status: 'error',
        msg: `رمز القسيمة غير موجود في السجل المركزي لميلة: ${code}`,
      });
      return;
    }

    if (existing.isRedeemed) {
      setScanResult({
        status: 'already_redeemed',
        msg: `تم صرف هذه القسيمة مسبقاً في: ${existing.redeemedAt || 'وقت سابق'}`,
        voucher: existing,
      });
      return;
    }

    const ok = onRedeemVoucher(code);
    if (ok) {
      setScanResult({
        status: 'success',
        msg: `تم تأكيد وصرف وجبة التعافي بنجاح لصالح المتطوع: ${existing.volunteerName}`,
        voucher: existing,
      });
      setVoucherCodeInput('');
    }
  };

  const handleSimulateCameraScan = (voucher: NutritionalVoucher) => {
    setIsScanning(true);
    setSelectedVoucherForScan(voucher);
    setTimeout(() => {
      setIsScanning(false);
      const ok = onRedeemVoucher(voucher.code);
      if (ok) {
        setScanResult({
          status: 'success',
          msg: `تم مسح رمز QR بنجاح عبر نقطة توزيع Healthy Brunchy بميلة!`,
          voucher: voucher,
        });
      } else {
        setScanResult({
          status: 'already_redeemed',
          msg: `تم صرف هذه القسيمة مسبقاً!`,
          voucher: voucher,
        });
      }
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              بوابة الشركاء والرعاة (Healthy Brunchy Station)
            </span>
            <span className="text-xs text-slate-400">· التحقق واسترداد وجبات التعافي الغذائي</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            ماسح قسائم الوجبات الرياضية عالية البروتين
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
            {pendingVouchers.length} قسائم جاهزة للاستلام
          </span>
        </div>
      </div>

      {/* Main Grid: Scanner Camera Viewfinder & Manual Input */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Camera / QR Viewfinder Simulation (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs">كاميرا التحقق الميداني من الـ QR</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              HMAC SHA-256 Verifier
            </span>
          </div>

          {/* Scanner Viewfinder Box */}
          <div className="relative aspect-video bg-slate-950 rounded-xl border-2 border-dashed border-emerald-500/50 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            {isScanning ? (
              <div className="space-y-3 animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto border border-emerald-400">
                  <QrCode className="w-10 h-10 animate-spin" />
                </div>
                <span className="text-xs font-mono text-emerald-300 block">جاري مسح شفرة القسيمة وتأكيد المصادقة...</span>
              </div>
            ) : (
              <div className="space-y-3 max-w-xs">
                <QrCode className="w-16 h-16 text-emerald-400/80 mx-auto" />
                <div>
                  <span className="text-xs font-bold text-white block">وجّه الكاميرا نحو رمز QR بهاتف المتطوع</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    أو انقر على إحدى القسائم أدناه لمحاكاة المسح الفوري بنقطة التوزيع
                  </span>
                </div>
              </div>
            )}

            {/* Viewfinder Target Brackets */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
          </div>

          {/* Result Alert */}
          {scanResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-1 ${
                scanResult.status === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                  : scanResult.status === 'already_redeemed'
                  ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                  : 'bg-rose-950/80 border-rose-500 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {scanResult.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
                <span>{scanResult.msg}</span>
              </div>
              {scanResult.voucher && (
                <div className="text-[11px] text-slate-300 font-mono pt-1">
                  الكود: {scanResult.voucher.code} · البروتين: {scanResult.voucher.targetProteinG}g · السعرات: {scanResult.voucher.calories} kcal
                </div>
              )}
            </div>
          )}
        </div>

        {/* Manual Code Input & Quick Redemption (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              إدخال رمز القسيمة يدوياً
            </h3>
            <p className="text-xs text-slate-500">
              في حال تعذر مسح الكاميرا، أدخل كود القسيمة المطبوع على هاتف المتطوع
            </p>
          </div>

          <form onSubmit={handleManualRedeem} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={voucherCodeInput}
                onChange={(e) => setVoucherCodeInput(e.target.value)}
                placeholder="مثال: BRUNCHY-MLA-8492"
                className="flex-1 p-3 rounded-xl border border-slate-300 font-mono text-xs uppercase font-bold tracking-wider focus:outline-none focus:border-emerald-600 bg-slate-50 focus:bg-white"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                تحقق واسترداد
              </button>
            </div>
          </form>

          {/* Quick Click to Simulate Scan */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <span className="text-xs font-bold text-slate-800 block">
              القسائم النشطة المعلقة ({pendingVouchers.length}):
            </span>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {pendingVouchers.length === 0 ? (
                <div className="p-5 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                  لا توجد قسائم معلقة حالياً. سجل نشاطاً جديداً في حاسبة الأثر لتوليد قسيمة.
                </div>
              ) : (
                pendingVouchers.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{v.code}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                          {v.targetProteinG}g بروتين
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        المتطوع: <b className="text-slate-700">{v.volunteerName}</b> · {v.mealName}
                      </span>
                    </div>

                    <button
                      onClick={() => handleSimulateCameraScan(v)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      صرف الوجبة
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* History of Redeemed Vouchers */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">سجل القسائم المصروفة بنجاح ({redeemedVouchers.length})</h3>
          <span className="text-xs text-slate-400">فرع Healthy Brunchy - ولاية ميلة</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {redeemedVouchers.map((v) => (
            <div
              key={v.id}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1.5 opacity-80"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-700">{v.code}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                  تم الاستلام
                </span>
              </div>
              <span className="text-[11px] text-slate-600 block">
                المستفيد: <b>{v.volunteerName}</b>
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                صرفت في: {v.redeemedAt || 'اليوم'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
