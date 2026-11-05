import React, { useState, useEffect } from 'react';
import {
  INITIAL_CAMPAIGNS,
  INITIAL_LOGS,
  INITIAL_TREES,
  INITIAL_VOLUNTEERS,
  INITIAL_VOUCHERS,
} from './data/mockData';
import {
  Campaign,
  DualImpactLog,
  NutritionalVoucher,
  TaskType,
  TreeItem,
  User,
  TreeHealthStatus,
} from './types';
import { calculateImpact } from './utils/calculator';
import { OfflineWateringSyncManager } from './utils/treeTrackingOffline';
import { Navbar, ActiveTab } from './components/Navbar';
import { HomePage } from './components/pages/HomePage';
import { MapPage } from './components/pages/MapPage';
import { ImpactPage } from './components/pages/ImpactPage';
import { RecoveryPage } from './components/pages/RecoveryPage';
import { NextJsExportPage } from './components/pages/NextJsExportPage';
import { VolunteerView } from './components/views/VolunteerView';
import { OrganizerView } from './components/views/OrganizerView';
import { SponsorView } from './components/views/SponsorView';
import { ArchitectureDocView } from './components/views/ArchitectureDocView';
import { AddVolunteerModal } from './components/AddVolunteerModal';
import { AddCampaignModal } from './components/AddCampaignModal';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('/');
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [volunteers, setVolunteers] = useState<User[]>(INITIAL_VOLUNTEERS);
  const [currentVolunteerId, setCurrentVolunteerId] = useState<string>(INITIAL_VOLUNTEERS[0].id);
  const [isAddVolunteerOpen, setIsAddVolunteerOpen] = useState(false);
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false);
  const [trees, setTrees] = useState<TreeItem[]>(INITIAL_TREES);
  const [vouchers, setVouchers] = useState<NutritionalVoucher[]>(INITIAL_VOUCHERS);
  const [logs, setLogs] = useState<DualImpactLog[]>(INITIAL_LOGS);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    INITIAL_CAMPAIGNS[0].id
  );

  // Synchronize browser history and path
  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', tab);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (['/', '/map', '/impact', '/recovery', '/organizer', '/nextjs-export'].includes(path)) {
        setActiveTab(path as ActiveTab);
      }
      const handlePopState = () => {
        const curPath = window.location.pathname;
        if (['/', '/map', '/impact', '/recovery', '/organizer', '/nextjs-export'].includes(curPath)) {
          setActiveTab(curPath as ActiveTab);
        }
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  // Offline Simulation State
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<
    {
      taskType: TaskType;
      durationMinutes: number;
      treesPlanted: number;
      campaignId: string;
      timestamp: string;
    }[]
  >([]);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Active user (dynamic selection from volunteers)
  const currentVolunteer =
    volunteers.find((v) => v.id === currentVolunteerId) || volunteers[0];

  // Handler for adding a new volunteer
  const handleAddVolunteer = (newVolunteer: User) => {
    setVolunteers((prev) => [newVolunteer, ...prev]);
    setCurrentVolunteerId(newVolunteer.id);
    setSyncToast(`تم تسجيل المتطوع الجديد "${newVolunteer.fullName}" بنجاح في منصة نماء وصحة بميلة! (+50 نقطة ترحيبية)`);
    setTimeout(() => setSyncToast(null), 4500);
  };

  // Handler for adding a new campaign
  const handleAddCampaign = (newCampaign: Campaign) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
    setSelectedCampaignId(newCampaign.id);
    setSyncToast(`تم نشر المبادرة البيئية "${newCampaign.title}" بنجاح!`);
    setTimeout(() => setSyncToast(null), 4500);
  };

  // Handler for logging volunteer workouts and planting
  const handleLogActivity = (
    taskType: TaskType,
    durationMinutes: number,
    treesPlanted: number,
    campaignId: string
  ) => {
    const calc = calculateImpact(
      taskType,
      durationMinutes,
      currentVolunteer.weightKg,
      treesPlanted
    );

    const targetCampaign =
      campaigns.find((c) => c.id === campaignId) || campaigns[0];

    // If Offline: Queue for later sync
    if (isOffline) {
      setOfflineQueue((prev) => [
        ...prev,
        {
          taskType,
          durationMinutes,
          treesPlanted,
          campaignId,
          timestamp: new Date().toISOString(),
        },
      ]);
      setSyncToast(
        'تم حفظ النشاط محلياً في ذاكرة الجهاز (Offline Queue)! ستتم المزامنة التلقائية فور توفر الشبكة.'
      );
      setTimeout(() => setSyncToast(null), 4000);
      return;
    }

    // If Online: Commit log and generate cryptographic voucher
    const newLogId = `log-${Date.now()}`;
    const newLog: DualImpactLog = {
      id: newLogId,
      userId: currentVolunteer.id,
      userName: currentVolunteer.fullName,
      campaignId: targetCampaign.id,
      taskType,
      durationMinutes,
      metIntensity: calc.metValue,
      caloriesBurned: calc.caloriesBurned,
      recommendedProteinGrams: calc.proteinGrams,
      recommendedCarbsGrams: calc.carbsGrams,
      hydrationMl: calc.hydrationMl,
      treesPlanted,
      lifetimeCo2OffsetKg: calc.lifetimeCo2OffsetKg,
      earnedPoints: calc.earnedPoints,
      timestamp: new Date().toLocaleString('ar-DZ'),
      isOfflineSynced: false,
    };
    setLogs((prev) => [newLog, ...prev]);

    // Update Volunteer Profile
    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === currentVolunteer.id
          ? {
              ...v,
              impactPoints: v.impactPoints + calc.earnedPoints,
              totalTreesAdopted: v.totalTreesAdopted + treesPlanted,
              totalCaloriesBurned: v.totalCaloriesBurned + calc.caloriesBurned,
            }
          : v
      )
    );

    // Register new planted trees on the map near campaign coordinates
    const newTrees: TreeItem[] = Array.from({ length: treesPlanted }).map(
      (_, idx) => {
        const offsetLat = (Math.random() - 0.5) * 0.003;
        const offsetLng = (Math.random() - 0.5) * 0.003;
        return {
          id: `tree-auto-${Date.now()}-${idx}`,
          tagCode: `MLA-${targetCampaign.id.slice(5, 8).toUpperCase()}-${Math.floor(
            100 + Math.random() * 900
          )}`,
          species: idx % 2 === 0 ? 'زيتون (Olive)' : 'خروب (Carob)',
          lat: targetCampaign.lat + offsetLat,
          lng: targetCampaign.lng + offsetLng,
          plantedAt: 'اليوم (جلسة حديثة)',
          adopterId: currentVolunteer.id,
          adopterName: currentVolunteer.fullName,
          healthStatus: 'healthy',
          lastWatered: 'اليوم بعد الغرس مباشرة',
          nextWateringDue: 'بعد 3 أيام',
          estimatedAnnualCo2Kg: 22,
        };
      }
    );
    setTrees((prev) => [...newTrees, ...prev]);

    // Generate Recovery Meal Voucher from Healthy Brunchy
    const randomVoucherCode = `BRUNCHY-MLA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVoucher: NutritionalVoucher = {
      id: `vch-${Date.now()}`,
      code: randomVoucherCode,
      volunteerId: currentVolunteer.id,
      volunteerName: currentVolunteer.fullName,
      campaignTitle: targetCampaign.title,
      sponsorName: 'Healthy Brunchy',
      mealName: 'صندوق الاستشفاء الرياضي (دجاج مشوي + كينوا + تمر بلدي)',
      targetProteinG: calc.proteinGrams,
      targetCarbsG: calc.carbsGrams,
      calories: Math.round(calc.caloriesBurned * 0.85),
      hydrationMl: calc.hydrationMl,
      isRedeemed: false,
      expiresAt: 'بعد 48 ساعة من الجلسة',
      generatedAt: new Date().toLocaleTimeString('ar-DZ'),
    };
    setVouchers((prev) => [newVoucher, ...prev]);

    // Update Campaign numbers
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === targetCampaign.id
          ? {
              ...c,
              currentVolunteers: Math.min(c.volunteerQuota, c.currentVolunteers + 1),
            }
          : c
      )
    );
  };

  // Handler for watering an adopted tree
  const handleWaterTree = (treeId: string) => {
    setTrees((prev) =>
      prev.map((t) =>
        t.id === treeId
          ? {
              ...t,
              healthStatus: 'healthy',
              lastWatered: 'اليوم',
              nextWateringDue: 'بعد 4 أيام',
            }
          : t
      )
    );

    // Award volunteer 10 points
    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === currentVolunteer.id
          ? { ...v, impactPoints: v.impactPoints + 10 }
          : v
      )
    );

    setSyncToast('تم توثيق ري الشجرة بنجاح! تم إضافة +10 نقاط أثر إلى رصيدك.');
    setTimeout(() => setSyncToast(null), 3500);
  };

  // Handler for detailed tree field inspection & watering via QR
  const handleUpdateTreeDetailed = (
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
  ) => {
    setTrees((prev) =>
      prev.map((t) =>
        t.id === treeId
          ? {
              ...t,
              healthStatus: updates.healthStatus,
              lastWatered: 'اليوم (موثق بمسح الـ QR)',
              nextWateringDue: 'بعد 4 أيام',
              heightCm: updates.heightCm ?? t.heightCm,
              canopyDiameterCm: updates.canopyDiameterCm ?? t.canopyDiameterCm,
              growthStage: updates.growthStage ?? t.growthStage,
              soilMoistureLevel: updates.soilMoistureLevel,
              totalWateringCount: (t.totalWateringCount || 0) + 1,
            }
          : t
      )
    );

    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === currentVolunteer.id
          ? { ...v, impactPoints: v.impactPoints + updates.earnedPoints }
          : v
      )
    );

    setSyncToast(
      isOffline
        ? 'تم حفظ سقاية وقياسات الشجرة محلياً دون اتصال! ستتم المزامنة عند عودة الشبكة.'
        : `تم تحديث حالة الشجرة ومزامنتها فورياً عبر رمز QR (+${updates.earnedPoints} نقطة أثر)!`
    );
    setTimeout(() => setSyncToast(null), 4000);
  };

  // Handler for Sponsor redeeming a meal voucher
  const handleRedeemVoucher = (voucherCode: string): boolean => {
    const voucher = vouchers.find(
      (v) => v.code.toUpperCase() === voucherCode.toUpperCase()
    );
    if (!voucher || voucher.isRedeemed) return false;

    setVouchers((prev) =>
      prev.map((v) =>
        v.code.toUpperCase() === voucherCode.toUpperCase()
          ? {
              ...v,
              isRedeemed: true,
              redeemedAt: new Date().toLocaleTimeString('ar-DZ'),
            }
          : v
      )
    );

    // Increment meals claimed in campaign
    setCampaigns((prev) =>
      prev.map((c) =>
        c.title === voucher.campaignTitle
          ? { ...c, mealsClaimed: Math.min(c.mealQuota, c.mealsClaimed + 1) }
          : c
      )
    );

    return true;
  };

  // Process Offline Queue when online
  const handleSyncQueue = () => {
    let syncedCount = 0;

    // 1. Reconcile workouts queue
    if (offlineQueue.length > 0) {
      offlineQueue.forEach((item) => {
        handleLogActivity(
          item.taskType,
          item.durationMinutes,
          item.treesPlanted,
          item.campaignId
        );
      });
      syncedCount += offlineQueue.length;
      setOfflineQueue([]);
    }

    // 2. Reconcile tree inspection & watering offline journal
    const offlineTreeEvents = OfflineWateringSyncManager.getQueuedEvents();
    if (offlineTreeEvents.length > 0) {
      const reconciliation = OfflineWateringSyncManager.reconcileQueue();
      if (reconciliation.reconciled.length > 0) {
        setTrees((prev) =>
          prev.map((tree) => {
            const update = reconciliation.treeUpdatesMap[tree.tagCode];
            if (update) {
              return {
                ...tree,
                healthStatus: 'healthy',
                lastWatered: 'اليوم (مزامنة دون اتصال)',
                nextWateringDue: 'بعد 4 أيام',
                soilMoistureLevel: update.latestMoisture,
                totalWateringCount: (tree.totalWateringCount || 0) + 1,
              };
            }
            return tree;
          })
        );
        syncedCount += reconciliation.reconciled.length;
      }
    }

    if (syncedCount > 0) {
      setSyncToast(`تمت مزامنة ${syncedCount} سجلات ميدانية بنجاح مع الخادم المركزي!`);
    } else {
      setSyncToast('لا توجد سجلات محلية معلقة للمزامنة.');
    }
    setTimeout(() => setSyncToast(null), 4000);
  };

  // Total offline items in localStorage / queue
  const totalOfflineCount = offlineQueue.length + OfflineWateringSyncManager.getQueuedEvents().length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar with Next.js App Router Navigation & Connectivity */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
        offlineQueueCount={totalOfflineCount}
        onSyncQueue={handleSyncQueue}
      />

      {/* Connectivity & Sync Notification Toast */}
      {syncToast && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 max-w-md bg-slate-900 text-white p-3.5 rounded-xl shadow-lg border border-slate-800 flex items-center gap-3 text-xs animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="leading-relaxed flex-1">{syncToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 1. Homepage / Landing Page ('/') */}
        {activeTab === '/' && (
          <HomePage
            campaigns={campaigns}
            trees={trees}
            onNavigate={handleSelectTab}
            onOpenAddVolunteer={() => setIsAddVolunteerOpen(true)}
            onOpenAddCampaign={() => setIsAddCampaignOpen(true)}
          />
        )}

        {/* 2. Interactive Map & Dashboard ('/map') */}
        {activeTab === '/map' && (
          <MapPage
            campaigns={campaigns}
            trees={trees}
            volunteers={volunteers}
            currentVolunteer={currentVolunteer}
            onWaterTree={handleWaterTree}
            onOpenAddVolunteer={() => setIsAddVolunteerOpen(true)}
            onOpenAddCampaign={() => setIsAddCampaignOpen(true)}
          />
        )}

        {/* 3. Dual Impact & Tree Tracker ('/impact') */}
        {activeTab === '/impact' && (
          <ImpactPage
            currentVolunteer={currentVolunteer}
            campaigns={campaigns}
            trees={trees}
            logs={logs}
            isOffline={isOffline}
            onLogActivity={handleLogActivity}
            onWaterTree={handleWaterTree}
            onUpdateTreeDetailed={handleUpdateTreeDetailed}
          />
        )}

        {/* 4. Voucher / Recovery Meal Scanner ('/recovery') */}
        {activeTab === '/recovery' && (
          <RecoveryPage
            vouchers={vouchers}
            onRedeemVoucher={handleRedeemVoucher}
          />
        )}

        {/* 5. Organizer GIS Command Center ('/organizer') */}
        {activeTab === '/organizer' && (
          <OrganizerView
            campaigns={campaigns}
            volunteers={volunteers}
            trees={trees}
            selectedCampaignId={selectedCampaignId}
            onSelectCampaign={setSelectedCampaignId}
            onWaterTree={handleWaterTree}
            onOpenAddVolunteer={() => setIsAddVolunteerOpen(true)}
          />
        )}

        {/* 6. Production Ready Next.js & Vercel Code Export ('/nextjs-export') */}
        {activeTab === '/nextjs-export' && <NextJsExportPage />}
      </main>

      {/* Add New Volunteer Modal */}
      <AddVolunteerModal
        isOpen={isAddVolunteerOpen}
        onClose={() => setIsAddVolunteerOpen(false)}
        onAddVolunteer={handleAddVolunteer}
      />

      {/* Add New Eco Campaign Modal */}
      <AddCampaignModal
        isOpen={isAddCampaignOpen}
        onClose={() => setIsAddCampaignOpen(false)}
        onAddCampaign={handleAddCampaign}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div>
            <span className="font-bold text-slate-800">منصة نَماء وصِحّة (NamAA & Wellness)</span>
            <span className="text-slate-400 mr-2">· «نَغرس الأرض.. ونَبني الصِّحة»</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Mila Pilot Initiative · GIS & Sports Nutrition Engine · 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
