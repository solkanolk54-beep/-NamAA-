import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Campaign, TreeItem, User } from '../types';
import { Layers, MapPin, Eye, Compass, ShieldAlert, CheckCircle2, Droplet, Sprout } from 'lucide-react';

interface GisMapProps {
  campaigns: Campaign[];
  trees: TreeItem[];
  volunteers: User[];
  selectedCampaignId?: string;
  onSelectCampaign?: (id: string) => void;
  onAdoptTree?: (treeId: string) => void;
  onWaterTree?: (treeId: string) => void;
  userRole?: string;
}

export const GisMap: React.FC<GisMapProps> = ({
  campaigns,
  trees,
  volunteers,
  selectedCampaignId,
  onSelectCampaign,
  onAdoptTree,
  onWaterTree,
  userRole = 'volunteer',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<{
    campaigns: L.LayerGroup;
    trees: L.LayerGroup;
    volunteers: L.LayerGroup;
    needHeatmap: L.LayerGroup;
  } | null>(null);

  // Layer toggles
  const [showTrees, setShowTrees] = useState(true);
  const [showCampaigns, setShowCampaigns] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showVolunteers, setShowVolunteers] = useState(userRole === 'organizer');

  // Center coordinate for Mila, Algeria
  const MILA_CENTER: [number, number] = [36.4503, 6.2649];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MILA_CENTER,
      zoom: 14,
      zoomControl: false,
    });

    // Custom OpenStreetMap Tiles with crisp cartography
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · منصة نَماء وصِحّة',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    const campaignsGroup = L.layerGroup().addTo(map);
    const treesGroup = L.layerGroup().addTo(map);
    const volunteersGroup = L.layerGroup().addTo(map);
    const needHeatmapGroup = L.layerGroup().addTo(map);

    layersGroupRef.current = {
      campaigns: campaignsGroup,
      trees: treesGroup,
      volunteers: volunteersGroup,
      needHeatmap: needHeatmapGroup,
    };

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layers when data or toggles change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const groups = layersGroupRef.current;
    if (!map || !groups) return;

    // 1. Clear previous layers
    groups.campaigns.clearLayers();
    groups.trees.clearLayers();
    groups.volunteers.clearLayers();
    groups.needHeatmap.clearLayers();

    // 2. Render Need Heatmap / Vulnerable Eco-Zones (Mila pilot areas)
    if (showHeatmap) {
      // Zone 1: المنحدر الشرقي المتصحر بميلة (High priority)
      const zone1 = L.circle([36.4530, 6.2710], {
        radius: 550,
        color: '#dc2626',
        fillColor: '#ef4444',
        fillOpacity: 0.18,
        weight: 1.5,
        dashArray: '4, 4',
      }).bindPopup(`
        <div class="p-3 text-right font-sans" dir="rtl">
          <div class="flex items-center gap-2 text-rose-700 font-bold text-sm mb-1">
            <span class="w-2 h-2 rounded-full bg-rose-600"></span>
            نطاق أولوية حرجة: المنحدر الشرقي بميلة
          </div>
          <p class="text-xs text-slate-600 mb-2 leading-relaxed">
            منطقة تعاني من تآكل التربة وتدهور الغطاء النباتي بنسبة 68%. الحاجة المقدرة: 300 شتلة زيتون وسدر لمكافحة الانجراف.
          </p>
          <div class="text-[11px] bg-rose-50 text-rose-800 p-1.5 rounded font-mono">
            مؤشر التصحر: 78/100 · أولوية التشجير: عاجل
          </div>
        </div>
      `);
      groups.needHeatmap.addLayer(zone1);

      // Zone 2: الحزام الواقي لسد بني هارون
      const zone2 = L.circle([36.5562, 6.2731], {
        radius: 950,
        color: '#d97706',
        fillColor: '#f59e0b',
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '4, 4',
      }).bindPopup(`
        <div class="p-3 text-right font-sans" dir="rtl">
          <div class="flex items-center gap-2 text-amber-700 font-bold text-sm mb-1">
            <span class="w-2 h-2 rounded-full bg-amber-600"></span>
            حزام تثبيت بحيرة سد بني هارون
          </div>
          <p class="text-xs text-slate-600 mb-2 leading-relaxed">
            نطاق استراتيجي لمنع ترسب الطمي في حوض السد. يحتاج إلى 500 شجرة صنوبر حلبي وخروب.
          </p>
          <div class="text-[11px] bg-amber-50 text-amber-800 p-1.5 rounded font-mono">
            معدل الترسب المائي: مرتفع · الأثر المزدوج: حماية السد
          </div>
        </div>
      `);
      groups.needHeatmap.addLayer(zone2);
    }

    // 3. Render Campaigns
    if (showCampaigns) {
      campaigns.forEach((camp) => {
        const isSelected = camp.id === selectedCampaignId;
        const iconHtml = `
          <div class="relative flex items-center justify-center">
            <div class="w-10 h-10 rounded-full ${isSelected ? 'bg-emerald-600 ring-4 ring-emerald-300' : 'bg-slate-900'} text-white flex items-center justify-center shadow-lg border-2 border-white transform transition-transform hover:scale-110">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div class="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-bold px-1 rounded-full border border-white">
              ${camp.volunteerQuota}
            </div>
          </div>
        `;

        const markerIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-camp-pin',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker([camp.lat, camp.lng], { icon: markerIcon });
        
        // Add action radius circle
        const circle = L.circle([camp.lat, camp.lng], {
          radius: camp.radiusMeters,
          color: isSelected ? '#10b981' : '#047857',
          fillColor: '#10b981',
          fillOpacity: isSelected ? 0.22 : 0.08,
          weight: 2,
        });

        marker.bindPopup(`
          <div class="p-3.5 text-right font-sans" dir="rtl">
            <span class="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 mb-1">
              ${camp.status === 'active' ? 'مبادرة نشطة حالياً' : 'مبادرة قادمة'}
            </span>
            <h4 class="font-bold text-slate-900 text-sm mb-1">${camp.title}</h4>
            <p class="text-xs text-slate-500 mb-2">${camp.facilityName}</p>
            <div class="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded mb-3 border border-slate-100">
              <div>
                <span class="text-slate-400 block">المتطوعون:</span>
                <span class="font-mono font-bold text-slate-800">${camp.currentVolunteers} / ${camp.volunteerQuota}</span>
              </div>
              <div>
                <span class="text-slate-400 block">وجبات التعافي:</span>
                <span class="font-mono font-bold text-amber-600">${camp.mealQuota} وجبة</span>
              </div>
            </div>
            <div class="text-[11px] text-slate-600 mb-3">
              <span class="font-medium text-slate-700">الراعي الرسمي:</span> ${camp.sponsorName}
            </div>
            <button 
              id="btn-select-camp-${camp.id}"
              class="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium transition-colors"
            >
              عرض تفاصيل الحملة وتوجيه الفريق
            </button>
          </div>
        `);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-select-camp-${camp.id}`);
          if (btn && onSelectCampaign) {
            btn.onclick = () => onSelectCampaign(camp.id);
          }
        });

        groups.campaigns.addLayer(marker);
        groups.campaigns.addLayer(circle);
      });
    }

    // 4. Render Trees
    if (showTrees) {
      trees.forEach((tree) => {
        const isNeedsWater = tree.healthStatus === 'needs_water';
        const color = isNeedsWater ? '#d97706' : '#15803d';
        const bgColor = isNeedsWater ? 'bg-amber-500 ring-2 ring-amber-300' : 'bg-emerald-600';

        const treeIconHtml = `
          <div class="w-7 h-7 rounded-full ${bgColor} text-white flex items-center justify-center shadow-md border-2 border-white transform hover:scale-125 transition-transform" title="${tree.species}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </div>
        `;

        const icon = L.divIcon({
          html: treeIconHtml,
          className: 'custom-tree-pin',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([tree.lat, tree.lng], { icon });

        marker.bindPopup(`
          <div class="p-3 text-right font-sans" dir="rtl">
            <div class="flex items-center justify-between gap-2 mb-1.5 border-b border-slate-100 pb-1.5">
              <span class="font-mono text-xs font-bold text-slate-700">${tree.tagCode}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded ${isNeedsWater ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}">
                ${isNeedsWater ? 'بحاجة للري اليوم' : 'سليمة وتنمو'}
              </span>
            </div>
            <div class="font-bold text-sm text-slate-900 mb-1">${tree.species}</div>
            <p class="text-xs text-slate-500 mb-2">المتطوع الراعي: <span class="text-slate-800 font-medium">${tree.adopterName || 'غير متبناة'}</span></p>
            
            <div class="text-[11px] space-y-1 bg-slate-50 p-2 rounded border border-slate-100 mb-2.5">
              <div class="flex justify-between">
                <span class="text-slate-500">آخر ري:</span>
                <span class="font-mono text-slate-700">${tree.lastWatered}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">الري القادم:</span>
                <span class="font-mono text-slate-700">${tree.nextWateringDue}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">امتصاص الكربون:</span>
                <span class="font-mono font-bold text-emerald-700">${tree.estimatedAnnualCo2Kg} كغ/سنة</span>
              </div>
            </div>

            <div class="flex gap-1.5">
              <button 
                id="btn-water-tree-${tree.id}"
                class="flex-1 py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
              >
                💧 تسجيل ري الشجرة (+10 نقاط)
              </button>
            </div>
          </div>
        `);

        marker.on('popupopen', () => {
          const waterBtn = document.getElementById(`btn-water-tree-${tree.id}`);
          if (waterBtn && onWaterTree) {
            waterBtn.onclick = () => onWaterTree(tree.id);
          }
        });

        groups.trees.addLayer(marker);
      });
    }

    // 5. Render Volunteers (For Organizer / GIS Command View)
    if (showVolunteers) {
      volunteers.forEach((v) => {
        const iconHtml = `
          <div class="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow hover:scale-110 transition-transform">
            ${v.fullName.charAt(0)}
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'custom-vol-pin',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([v.location.lat, v.location.lng], { icon });

        marker.bindPopup(`
          <div class="p-3 text-right font-sans" dir="rtl">
            <h5 class="font-bold text-sm text-slate-900 mb-0.5">${v.fullName}</h5>
            <p class="text-xs text-slate-500 mb-2">${v.location.address}</p>
            <div class="flex flex-wrap gap-1 mb-2">
              ${v.skills.map(s => `<span class="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">${s}</span>`).join('')}
            </div>
            <div class="text-[11px] bg-blue-50 text-blue-900 p-1.5 rounded font-mono">
              رصيد الأثر: ${v.impactPoints} نقطة · الأشجار المتبناة: ${v.totalTreesAdopted}
            </div>
          </div>
        `);

        groups.volunteers.addLayer(marker);
      });
    }
  }, [campaigns, trees, volunteers, showTrees, showCampaigns, showHeatmap, showVolunteers, selectedCampaignId]);

  // Center navigation shortcuts
  const flyToLocation = (lat: number, lng: number, zoom = 15) => {
    mapInstanceRef.current?.flyTo([lat, lng], zoom, { duration: 1.2 });
  };

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      {/* Map DOM node */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Quick Location Shortcuts (Mila Pilot Points) */}
      <div className="absolute top-3 right-3 z-[400] flex flex-wrap gap-1.5 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg border border-slate-200/80 shadow-sm text-xs">
        <span className="text-slate-400 font-medium px-2 py-1 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-slate-500" />
          مواقع ولاية ميلة:
        </span>
        <button
          onClick={() => flyToLocation(36.4503, 6.2649, 16)}
          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-medium transition-colors"
        >
          المرفق الشبابي بميلة
        </button>
        <button
          onClick={() => flyToLocation(36.4410, 6.2520, 15)}
          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-medium transition-colors"
        >
          غابة صناوة
        </button>
        <button
          onClick={() => flyToLocation(36.5562, 6.2731, 14)}
          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-medium transition-colors"
        >
          سد بني هارون
        </button>
      </div>

      {/* Map Layer Controls */}
      <div className="absolute bottom-3 right-3 z-[400] bg-white/95 backdrop-blur-sm p-2 rounded-lg border border-slate-200 shadow-md text-xs space-y-1.5">
        <div className="font-bold text-slate-800 text-[11px] pb-1 border-b border-slate-100 flex items-center justify-between gap-3">
          <span>طبقات الخريطة الجغرافية</span>
          <Layers className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
          <input
            type="checkbox"
            checked={showCampaigns}
            onChange={(e) => setShowCampaigns(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
          />
          <span>مواقع المبادرات ونطاق الحصص</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
          <input
            type="checkbox"
            checked={showTrees}
            onChange={(e) => setShowTrees(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
          />
          <span>سجل الأشجار الذكية المعتمدة</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={(e) => setShowHeatmap(e.target.checked)}
            className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
          />
          <span className="text-rose-700 font-medium">خريطة الاحتياج الحرارية (Need Heatmap)</span>
        </label>
        {userRole === 'organizer' && (
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={showVolunteers}
              onChange={(e) => setShowVolunteers(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>مواقع المتطوعين الجاهزين</span>
          </label>
        )}
      </div>

      {/* Legend Badge */}
      <div className="absolute bottom-3 left-12 z-[400] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-[11px] text-slate-600 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>أشجار سليمة</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>تحتاج رياً عاجلاً</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>مناطق تصحر مرتفع</span>
        </div>
      </div>
    </div>
  );
};
