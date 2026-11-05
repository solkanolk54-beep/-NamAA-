import React, { useState } from 'react';
import { Campaign } from '../types';
import { X, Sprout, MapPin, Users, UtensilsCrossed, Sparkles } from 'lucide-react';

interface AddCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCampaign: (newCampaign: Campaign) => void;
}

export const AddCampaignModal: React.FC<AddCampaignModalProps> = ({
  isOpen,
  onClose,
  onAddCampaign,
}) => {
  const [title, setTitle] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [description, setDescription] = useState('');
  const [volunteerQuota, setVolunteerQuota] = useState(25);
  const [mealQuota, setMealQuota] = useState(30);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'زراعة وغرس',
    'حفر شاق',
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !facilityName.trim()) return;

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      title: title.trim(),
      facilityName: facilityName.trim(),
      description: description.trim() || 'مبادرة بيئية مجتمعية تهدف لغرس الأشجار وتوسيع الحزام الأخضر وتأهيل المسارات الطبيعية.',
      lat: 36.4500 + (Math.random() - 0.5) * 0.02,
      lng: 6.2650 + (Math.random() - 0.5) * 0.02,
      radiusMeters: 500,
      startTime: '08:00 صباحاً',
      endTime: '12:30 ظهراً',
      volunteerQuota: Number(volunteerQuota),
      currentVolunteers: 0,
      requiredSkills: selectedSkills,
      mealQuota: Number(mealQuota),
      mealsClaimed: 0,
      sponsorName: 'Healthy Brunchy',
      status: 'active',
    };

    onAddCampaign(newCampaign);
    onClose();
  };

  const availableSkills = ['زراعة وغرس', 'حفر شاق', 'ري ونقل مياه', 'تقليم الأشجار', 'إسعاف أولي', 'تنظيم فرق'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">إضافة مبادرة بيئية جديدة</h3>
              <p className="text-xs text-emerald-200">نشر حملة تشجير وتأهيل مكاني عبر المرافق الشبانية بميلة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-emerald-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">عنوان المبادرة / الحملة</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تشجير الحزام البيئي لوادي الرمال بميلة"
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">الجهة المنظمة / المرفق الشرفي</label>
            <input
              type="text"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              placeholder="مثال: ديوان مؤسسات الشباب (ODEJ Mila) - دار الشباب زغاية"
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                حصة المتطوعين المطلوبة
              </label>
              <input
                type="number"
                min="5"
                max="200"
                value={volunteerQuota}
                onChange={(e) => setVolunteerQuota(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />
                حصة وجبات التعافي (Healthy Brunchy)
              </label>
              <input
                type="number"
                min="5"
                max="200"
                value={mealQuota}
                onChange={(e) => setMealQuota(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">المهارات المطلوبة للمبادرة</label>
            <div className="flex flex-wrap gap-1.5">
              {availableSkills.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() =>
                      setSelectedSkills((prev) =>
                        prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
                      )
                    }
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      isSelected
                        ? 'bg-emerald-700 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-sm"
            >
              نشر المبادرة فورياً
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
