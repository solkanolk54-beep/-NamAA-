import React, { useState } from 'react';
import { User, FitnessLevel } from '../types';
import { X, UserPlus, MapPin, Dumbbell, ShieldCheck, Heart, Award, Sparkles } from 'lucide-react';

interface AddVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVolunteer: (newVolunteer: User) => void;
}

const MILA_ZONES = [
  { name: 'وسط مدينة ميلة (Mila Downtown)', lat: 36.4520, lng: 6.2680, desc: 'بالقرب من المرفق الشبابي والمدرج الروماني' },
  { name: 'حي صناوة (Senawa District)', lat: 36.4475, lng: 6.2610, desc: 'المتاخم للغابة الترفيهية ومسار التحدي البيئي' },
  { name: 'حي الثنية وبلحاج (Thenia)', lat: 36.4610, lng: 6.2730, desc: 'المنطقة الشمالية المرتفعة' },
  { name: 'القرارم قوقة (Grarem Gouga)', lat: 36.5200, lng: 6.2400, desc: 'حزام سد بني هارون والسهول الرطبة' },
  { name: 'زغاية (Zeghaia)', lat: 36.4100, lng: 6.1800, desc: 'منطقة المزارع البيئية والأشجار المثمرة' },
  { name: 'فرجيوة (Ferdjioua)', lat: 36.3700, lng: 6.0000, desc: 'المرتفعات الغربية ومكافحة الانجراف' },
];

const SKILL_OPTIONS = [
  'زراعة وغرس',
  'حفر شاق',
  'ري ونقل مياه',
  'تقليم الأشجار',
  'إسعاف أولي',
  'تنظيم فرق',
  'صيانة أدوات',
  'توثيق بيئي وتصوير',
];

export const AddVolunteerModal: React.FC<AddVolunteerModalProps> = ({
  isOpen,
  onClose,
  onAddVolunteer,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [weightKg, setWeightKg] = useState<number>(72);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('moderate');
  const [selectedZoneIndex, setSelectedZoneIndex] = useState<number>(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'زراعة وغرس',
    'ري ونقل مياه',
  ]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('يرجى إدخال الاسم الكامل للمتطوع');
      return;
    }
    if (selectedSkills.length === 0) {
      setErrorMsg('يرجى اختيار مهارة واحدة على الأقل');
      return;
    }

    const zone = MILA_ZONES[selectedZoneIndex];
    // Slightly randomize coordinates to simulate individual household/departure point
    const latOffset = (Math.random() - 0.5) * 0.003;
    const lngOffset = (Math.random() - 0.5) * 0.003;

    const newVolunteer: User = {
      id: `vol-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim() || `${fullName.trim().toLowerCase().replace(/\s+/g, '.')}@mila.dz`,
      phone: phone.trim() || '+213 550 00 00 00',
      role: 'volunteer',
      weightKg: Number(weightKg) || 70,
      fitnessLevel,
      skills: selectedSkills,
      impactPoints: 50, // Welcome points
      totalTreesAdopted: 0,
      totalCaloriesBurned: 0,
      location: {
        lat: Number((zone.lat + latOffset).toFixed(6)),
        lng: Number((zone.lng + lngOffset).toFixed(6)),
        address: zone.name,
      },
    };

    onAddVolunteer(newVolunteer);
    onClose();
    // Reset form
    setFullName('');
    setPhone('');
    setEmail('');
    setWeightKg(72);
    setFitnessLevel('moderate');
    setSelectedSkills(['زراعة وغرس', 'ري ونقل مياه']);
    setErrorMsg(null);
  };

  const selectedZone = MILA_ZONES[selectedZoneIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <UserPlus className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">إضافة متطوع جديد للمنصة</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-700 text-emerald-100">
                  ولاية ميلة
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                تسجيل متطوع جديد في السجل المكاني لتمكينه من حاسبة السعرات وتبني الأشجار
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
              {errorMsg}
            </div>
          )}

          {/* Row 1: Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                الاسم الكامل للمتطوع <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: فاروق بوضياف (Farouk Boudiaf)"
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 bg-slate-50 focus:bg-white text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                رقم الهاتف (للتوجيه والتنبيهات الميدانية)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+213 661 XX XX XX"
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 bg-slate-50 focus:bg-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Row 2: Email & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                البريد الإلكتروني (اختياري)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="volunteer@mila.dz"
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 bg-slate-50 focus:bg-white text-xs"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-slate-700">
                  وزن الجسم (كغ) <span className="text-emerald-700">*</span>
                </label>
                <span className="text-[10px] text-slate-400">ضروري لحساب حرق MET</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="45"
                  max="130"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 bg-slate-50 focus:bg-white text-xs font-mono font-bold text-slate-800"
                  required
                />
                <span className="text-slate-500 font-mono text-xs shrink-0">kg</span>
              </div>
            </div>
          </div>

          {/* Row 3: Fitness Level */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-600" />
              المستوى البدني والرياضي (Fitness Profile):
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFitnessLevel('beginner')}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  fitnessLevel === 'beginner'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="block font-bold">مبتدئ (Beginner)</span>
                <span className="text-[10px] text-slate-500">جهد خفيف، غرس وسقاية</span>
              </button>
              <button
                type="button"
                onClick={() => setFitnessLevel('moderate')}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  fitnessLevel === 'moderate'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="block font-bold">متوسط (Moderate)</span>
                <span className="text-[10px] text-slate-500">نشاط منتظم ومتوازن</span>
              </button>
              <button
                type="button"
                onClick={() => setFitnessLevel('athlete')}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  fitnessLevel === 'athlete'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="block font-bold">رياضي متمرس (Athlete)</span>
                <span className="text-[10px] text-slate-500">حفر شاق ونقل أحمال</span>
              </button>
            </div>
          </div>

          {/* Row 4: Geographic Location in Mila */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              المقر السكني / نطاق الانطلاق في ولاية ميلة (PostGIS Geo-Point):
            </label>
            <select
              value={selectedZoneIndex}
              onChange={(e) => setSelectedZoneIndex(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 bg-slate-50 focus:bg-white text-xs text-slate-800 font-medium"
            >
              {MILA_ZONES.map((zone, idx) => (
                <option key={zone.name} value={idx}>
                  {zone.name} — {zone.desc}
                </option>
              ))}
            </select>
            <div className="mt-1 text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span>إحداثيات المركز: {selectedZone.lat.toFixed(4)}°N, {selectedZone.lng.toFixed(4)}°E</span>
              <span>·</span>
              <span className="text-emerald-700 font-medium">جاهزة لمطابقة القرب المكاني (ST_DWithin)</span>
            </div>
          </div>

          {/* Row 5: Multi-select Skills */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-medium text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                المهارات التطوعية والميدانية المتاحة:
              </label>
              <span className="text-[10px] text-slate-400">حدد كل المهارات التي تتقنها</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SKILL_OPTIONS.map((skill) => {
                const isChecked = selectedSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`p-2 rounded-lg border text-center transition-all text-[11px] flex items-center justify-center gap-1.5 ${
                      isChecked
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary / Preview Badge */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <div>
                <span className="font-bold text-slate-800 block text-[11px]">حزمة الترحيب والانضمام المباشر</span>
                <span className="text-[10px] text-slate-500">رصيد أولي ترحيبي + إدراج فوري في خريطة التوجيه لميلة</span>
              </div>
            </div>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded text-xs">
              +50 نقطة أثر
            </span>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-medium transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>تأكيد تسجيل المتطوع</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
