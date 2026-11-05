import React, { useState } from 'react';
import { Campaign, TreeItem, User } from '../../types';
import { GisMap } from '../GisMap';
import { matchVolunteersSpatially } from '../../utils/spatialMatching';
import {
  MapPin,
  Filter,
  Users,
  Compass,
  Send,
  CheckCircle2,
  UtensilsCrossed,
  Trees,
  Sliders,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';

interface MapPageProps {
  campaigns: Campaign[];
  trees: TreeItem[];
  volunteers: User[];
  currentVolunteer: User;
  onWaterTree: (treeId: string) => void;
  onOpenAddVolunteer: () => void;
  onOpenAddCampaign: () => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  campaigns,
  trees,
  volunteers,
  currentVolunteer,
  onWaterTree,
  onOpenAddVolunteer,
  onOpenAddCampaign,
}) => {
  // Filters
  const [activityTypeFilter, setActivityTypeFilter] = useState<'all' | 'planting' | 'cleanup' | 'maintenance'>('all');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(6);
  const [isSmartMatchOpen, setIsSmartMatchOpen] = useState<boolean>(true);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);

  // Available skill filter options
  const skillOptions = ['all', 'زراعة وغرس', 'حفر شاق', 'ري ونقل مياه', 'إسعاف أولي', 'تنظيم فرق'];

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    if (activityTypeFilter === 'planting' && !c.title.includes('غرس') && !c.title.includes('تشجير')) return false;
    if (activityTypeFilter === 'cleanup' && !c.title.includes('نظافة') && !c.title.includes('تنظيف')) return false;
    if (selectedSkillFilter !== 'all' && !c.requiredSkills.includes(selectedSkillFilter)) return false;
    return true;
  });

  const activeCampaign =
    campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  // Run spatial matcher for the active campaign
  const matchedVolunteers = matchVolunteersSpatially(
    activeCampaign.lat,
    activeCampaign.lng,
    searchRadiusKm,
    selectedSkillFilter === 'all' ? activeCampaign.requiredSkills : [selectedSkillFilter],
    volunteers
  );

  const handleDispatchTeam = () => {
    setDispatchSuccessMsg(`تم استدعاء وتوجيه فريق المتطوعين (${matchedVolunteers.length} متطوع) إلى موقع المبادرة بنجاح!`);
    setTimeout(() => setDispatchSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Page Title & Filter Control Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              خريطة ميلة التفاعلية (Interactive Leaflet GIS)
            </span>
            <span className="text-xs text-slate-400">· قطاعات التدخل البيئي ومحطات الاستشفاء</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            خريطة المبادرات البيئية ومحطات الوجبات الرياضية
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={onOpenAddCampaign}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>+ أضف مبادرة جديدة</span>
          </button>
          <button
            onClick={onOpenAddVolunteer}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Users className="w-3.5 h-3.5" />
            <span>تسجيل متطوع</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Activity Type Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500 font-medium ml-1">نوع المبادرة:</span>
          <button
            onClick={() => setActivityTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activityTypeFilter === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            الكل ({campaigns.length})
          </button>
          <button
            onClick={() => setActivityTypeFilter('planting')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activityTypeFilter === 'planting'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            تشجير وغرس
          </button>
          <button
            onClick={() => setActivityTypeFilter('cleanup')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activityTypeFilter === 'cleanup'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            تنظيف ومسارات بيئية
          </button>
        </div>

        {/* Skill Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">المهارة المطلوبة:</span>
          <select
            value={selectedSkillFilter}
            onChange={(e) => setSelectedSkillFilter(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50 font-medium focus:outline-none focus:border-emerald-600"
          >
            <option value="all">كافة المهارات الميدانية</option>
            {skillOptions.filter((s) => s !== 'all').map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Leaflet Map & Smart Match Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* The Map (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">خريطة ميلة الرقمية</span>
              <span className="text-slate-400">· طبقات الغرس، محطات Healthy Brunchy، وخريطة الاحتياج</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{activeCampaign.lat.toFixed(4)}°N, {activeCampaign.lng.toFixed(4)}°E</span>
            </div>
          </div>

          <GisMap
            campaigns={filteredCampaigns}
            trees={trees}
            volunteers={volunteers}
            selectedCampaignId={activeCampaign.id}
            onSelectCampaign={setSelectedCampaignId}
            onWaterTree={onWaterTree}
            userRole="organizer"
          />
        </div>

        {/* Smart Match Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                درج المطابقة الذكية (Smart Match)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                PostGIS ST_DWithin
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              خوارزمية فرز تلقائي للمتطوعين الأقرب إلى موقع المبادرة المختارة: <b className="text-slate-700">{activeCampaign.title}</b>
            </p>
          </div>

          {dispatchSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{dispatchSuccessMsg}</span>
            </div>
          )}

          {/* Search Radius Slider */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700">نطاق الفرز الجغرافي:</span>
              <span className="font-mono font-bold text-emerald-700">{searchRadiusKm} كم</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={searchRadiusKm}
              onChange={(e) => setSearchRadiusKm(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 كم</span>
              <span>10 كم</span>
              <span>20 كم</span>
            </div>
          </div>

          {/* Matched Volunteers List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                المتطوعون المؤهلون ({matchedVolunteers.length}):
              </span>
              {matchedVolunteers.length > 0 && (
                <button
                  onClick={handleDispatchTeam}
                  className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>استدعاء الجميع</span>
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {matchedVolunteers.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                  لا يوجد متطوعون متاحون في هذا النطاق. قم بزيادة نصف قطر البحث.
                </div>
              ) : (
                matchedVolunteers.map((m) => (
                  <div
                    key={m.volunteer.id}
                    className="p-3 bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200 transition-colors text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{m.volunteer.fullName}</span>
                      <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-semibold">
                        {m.distanceKm} كم
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {m.volunteer.skills.map((skill) => (
                        <span key={skill} className="px-1.5 py-0.2 rounded text-[10px] bg-white border border-slate-200 text-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
