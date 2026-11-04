import React, { useState } from 'react';
import { Campaign, TreeItem, User } from '../../types';
import { matchVolunteersSpatially } from '../../utils/spatialMatching';
import { GisMap } from '../GisMap';
import {
  MapPin,
  Users,
  UtensilsCrossed,
  Sprout,
  Send,
  Sliders,
  CheckCircle2,
  Compass,
  AlertCircle,
  TrendingUp,
  Flame,
  Leaf,
  Layers,
  Sparkles
} from 'lucide-react';

interface OrganizerViewProps {
  campaigns: Campaign[];
  volunteers: User[];
  trees: TreeItem[];
  selectedCampaignId: string;
  onSelectCampaign: (id: string) => void;
  onWaterTree: (treeId: string) => void;
}

export const OrganizerView: React.FC<OrganizerViewProps> = ({
  campaigns,
  volunteers,
  trees,
  selectedCampaignId,
  onSelectCampaign,
  onWaterTree,
}) => {
  const currentCampaign =
    campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  // Spatial Matcher Controls
  const [radiusKm, setRadiusKm] = useState<number>(6);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'زراعة وغرس',
    'حفر شاق',
  ]);
  const [dispatchedVolunteers, setDispatchedVolunteers] = useState<string[]>([]);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

  const availableSkills = [
    'زراعة وغرس',
    'حفر شاق',
    'ري ونقل مياه',
    'تقليم الأشجار',
    'إسعاف أولي',
    'تنظيم فرق',
  ];

  // Run spatial match algorithm based on active campaign location
  const matchedList = matchVolunteersSpatially(
    currentCampaign.lat,
    currentCampaign.lng,
    radiusKm,
    selectedSkills,
    volunteers
  );

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleDispatchSingle = (volunteerId: string, volunteerName: string) => {
    if (!dispatchedVolunteers.includes(volunteerId)) {
      setDispatchedVolunteers((prev) => [...prev, volunteerId]);
      setDispatchAlert(`تم إرسال إشعار التوجيه الميداني إلى المتطوع: ${volunteerName}`);
      setTimeout(() => setDispatchAlert(null), 3500);
    }
  };

  const handleDispatchAll = () => {
    const allIds = matchedList.map((m) => m.volunteer.id);
    setDispatchedVolunteers(allIds);
    setDispatchAlert(`تم توجيه الاستدعاء لجميع المتطوعين المؤهلين (${matchedList.length} متطوع) بنجاح!`);
    setTimeout(() => setDispatchAlert(null), 4000);
  };

  // Aggregate Metrics
  const totalTreesPlanted = trees.length;
  const totalEstimatedAnnualCo2 = trees.reduce((acc, t) => acc + t.estimatedAnnualCo2Kg, 0);

  return (
    <div className="space-y-6">
      {/* Campaign Selector & High-level Status */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              لوحة تحكم المنظمات والمرافق الشبابية (GIS Command Center)
            </span>
            <span className="text-xs text-slate-400">· ولاية ميلة</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">{currentCampaign.title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            المقر: <span className="text-slate-700 font-medium">{currentCampaign.facilityName}</span>
          </p>
        </div>

        {/* Campaign switcher dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 shrink-0">المبادرة النشطة:</span>
          <select
            value={currentCampaign.id}
            onChange={(e) => onSelectCampaign(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 text-xs bg-slate-50 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 text-slate-800"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Campaign Quotas & Resource Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Volunteer Quota */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              حصة المتطوعين الميدانيين
            </span>
            <span className="font-mono text-slate-800 font-bold">
              {currentCampaign.currentVolunteers} / {currentCampaign.volunteerQuota}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{
                width: `${(currentCampaign.currentVolunteers / currentCampaign.volunteerQuota) * 100}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            متبقي {currentCampaign.volunteerQuota - currentCampaign.currentVolunteers} مقاعد شاغرة
          </span>
        </div>

        {/* Healthy Brunchy Meals Quota */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="flex items-center gap-1.5">
              <UtensilsCrossed className="w-4 h-4 text-amber-600" />
              حصص وجبات التعافي (Healthy Brunchy)
            </span>
            <span className="font-mono text-slate-800 font-bold">
              {currentCampaign.mealsClaimed} / {currentCampaign.mealQuota}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{
                width: `${(currentCampaign.mealsClaimed / currentCampaign.mealQuota) * 100}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            صندوق استشفاء بروتيني مدعوم بالكامل
          </span>
        </div>

        {/* Tree Saplings */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" />
              الشتلات المغروسة الموثقة
            </span>
            <span className="font-mono text-slate-800 font-bold">
              {totalTreesPlanted} شتلة
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${Math.min(100, (totalTreesPlanted / 20) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            أشجار زيتون، خروب، وصنوبر حلبي
          </span>
        </div>

        {/* CO2 Sequestration */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-teal-600" />
              امتصاص الكربون السنوي
            </span>
            <span className="font-mono text-slate-800 font-bold">
              {totalEstimatedAnnualCo2} كغ/سنة
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full" style={{ width: '70%' }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            حزام تثبيت التربة ومكافحة التصحر
          </span>
        </div>
      </div>

      {/* Main Interactive Grid: Leaflet Map + Spatial Matching Dispatcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map View with Need Heatmap */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">
                خريطة ميلة الجغرافية وخريطة الاحتياج (Need Heatmap)
              </span>
              <span className="text-slate-500">
                المناطق باللون الأحمر تشير لنطاقات التصحر العالي ذات الأولوية
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {currentCampaign.lat.toFixed(4)}°N, {currentCampaign.lng.toFixed(4)}°E
              </span>
            </div>
          </div>

          <GisMap
            campaigns={campaigns}
            trees={trees}
            volunteers={volunteers}
            selectedCampaignId={currentCampaign.id}
            onSelectCampaign={onSelectCampaign}
            onWaterTree={onWaterTree}
            userRole="organizer"
          />
        </div>

        {/* Spatial Volunteer Matcher & Team Dispatcher */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                خوارزمية الفرز المكاني ومطابقة المهارات
              </h3>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                PostGIS ST_DWithin
              </span>
            </div>
            <p className="text-xs text-slate-500">
              فرز المتطوعين الأقرب جغرافياً لحملة ميلة مع ترتيب تطابق المهارات المطلوبة
            </p>
          </div>

          {dispatchAlert && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{dispatchAlert}</span>
            </div>
          )}

          {/* Controls: Radius & Skills */}
          <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/60 text-xs">
            {/* Radius Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-700">نصف قطر البحث الجغرافي:</span>
                <span className="font-mono font-bold text-emerald-800">{radiusKm} كم</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                <span>1 كم</span>
                <span>5 كم (نطاق المشي)</span>
                <span>10 كم</span>
                <span>20 كم (ولاية ميلة)</span>
              </div>
            </div>

            {/* Skills selection filter */}
            <div>
              <span className="block font-medium text-slate-700 mb-1.5">
                المهارات ذات الأولوية للمبادرة:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Matched Results Header */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-800">
              المتطوعون المؤهلون في النطاق ({matchedList.length}):
            </span>
            {matchedList.length > 0 && (
              <button
                onClick={handleDispatchAll}
                className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                استدعاء وتوجيه الجميع
              </button>
            )}
          </div>

          {/* Matched Volunteers List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {matchedList.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                لا يوجد متطوعون في هذا النطاق أو بهذه المهارات. قم بتوسيع نطاق البحث بالكيلومتر.
              </div>
            ) : (
              matchedList.map((match) => {
                const isDispatched = dispatchedVolunteers.includes(match.volunteer.id);
                return (
                  <div
                    key={match.volunteer.id}
                    className="p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {match.volunteer.fullName}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {match.distanceKm} كم
                        </span>
                        {match.skillMatchCount > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-medium">
                            تطابق {match.skillMatchCount} مهارة
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap gap-1">
                        {match.volunteer.skills.map((s) => (
                          <span
                            key={s}
                            className={`px-1 rounded text-[10px] ${
                              selectedSkills.includes(s)
                                ? 'bg-emerald-100 text-emerald-800 font-semibold'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleDispatchSingle(match.volunteer.id, match.volunteer.fullName)
                      }
                      disabled={isDispatched}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                        isDispatched
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                      }`}
                    >
                      {isDispatched ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>تم الاستدعاء</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>إرسال استدعاء</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
