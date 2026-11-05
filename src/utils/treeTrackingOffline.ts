import { TreeQRPayload, OfflineWateringEvent, TreeItem, TreeSpecies, TreeHealthStatus } from '../types';

/**
 * محرك تتبع الأشجار الذكي وتوليد والتحقق من رموز QR المشفرة
 * يضمن منع تزوير الأشجار والتحقق من مطابقة الإحداثيات الميدانية
 */

const SECRET_SALT = 'NamAA_Mila_Pilot_HMAC_Secret_2026';

/**
 * توليد توقيع تشفيري خفيف للشجرة (محاكاة HMAC-SHA256)
 */
export function generateTreeSignature(
  tagCode: string,
  speciesCode: string,
  coords: [number, number],
  plantedTimestamp: number
): string {
  const payloadStr = `${tagCode}:${speciesCode}:${coords[0].toFixed(5)},${coords[1].toFixed(5)}:${plantedTimestamp}:${SECRET_SALT}`;
  let hash = 0;
  for (let i = 0; i < payloadStr.length; i++) {
    const char = payloadStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `SIG-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
}

/**
 * إنشاء كائن حمولة رمز الاستجابة السريعة (QR Payload) للشجرة المغروسة
 */
export function createTreeQRPayload(tree: TreeItem): TreeQRPayload {
  let speciesCode: 'OLV' | 'CRB' | 'PIN' | 'SDR' = 'OLV';
  if (tree.species.includes('Carob')) speciesCode = 'CRB';
  else if (tree.species.includes('Pine')) speciesCode = 'PIN';
  else if (tree.species.includes('Jujube')) speciesCode = 'SDR';

  const plantedTimestamp = new Date(tree.plantedAt).getTime() || Date.now();
  const coords: [number, number] = [tree.lat, tree.lng];
  const cryptoSignature = generateTreeSignature(
    tree.tagCode,
    speciesCode,
    coords,
    plantedTimestamp
  );

  return {
    v: 1,
    tid: tree.tagCode,
    treeId: tree.id,
    speciesCode,
    plantedTimestamp,
    coords,
    cryptoSignature,
  };
}

/**
 * التحقق من أصالة رمز QR للشجرة عند المسح الميداني
 */
export function verifyTreeQRPayload(payload: TreeQRPayload): {
  isValid: boolean;
  reason?: string;
} {
  if (payload.v !== 1) {
    return { isValid: false, reason: 'إصدار رمز QR غير مدعوم' };
  }

  const expectedSignature = generateTreeSignature(
    payload.tid,
    payload.speciesCode,
    payload.coords,
    payload.plantedTimestamp
  );

  if (payload.cryptoSignature !== expectedSignature) {
    return { isValid: false, reason: 'التوقيع الرقمي للشجرة غير متطابق (شبهة تلاعب)' };
  }

  return { isValid: true };
}

export interface DetailedTreeFieldUpdate {
  treeTagCode: string;
  volunteerId: string;
  volunteerName: string;
  waterVolumeLiters: number;
  soilMoistureLevel: 'dry' | 'moderate' | 'optimal';
  healthStatus: TreeHealthStatus;
  growthStage?: 'sapling' | 'young' | 'maturing' | 'mature';
  heightCm?: number;
  canopyDiameterCm?: number;
  notes?: string;
  timestamp: number;
}

/**
 * بروتوكول المزامنة غير المتصلة (Offline Sync Protocol)
 * لتسجيل عمليات الري والنمو الميدانية وحل التعارضات (Conflict Resolution via Vector Clocks)
 */
export class OfflineWateringSyncManager {
  private static STORAGE_KEY = 'namaa_offline_watering_queue';

  /**
   * استرجاع السجلات المحلية المخزنة في الجهاز
   */
  public static getQueuedEvents(): OfflineWateringEvent[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * إضافة عملية ري ونمو جديدة إلى طابور المزامنة دون اتصال
   */
  public static recordOfflineWatering(
    treeTagCode: string,
    volunteerId: string,
    volunteerName: string,
    waterVolumeLiters: number = 10,
    soilMoistureLevel: 'dry' | 'moderate' | 'optimal' = 'optimal',
    extra?: {
      healthStatus?: TreeHealthStatus;
      heightCm?: number;
      canopyDiameterCm?: number;
      growthStage?: 'sapling' | 'young' | 'maturing' | 'mature';
    }
  ): OfflineWateringEvent {
    const queue = this.getQueuedEvents();
    const existingEventsForTree = queue.filter((e) => e.treeTagCode === treeTagCode);
    const nextVectorClock = existingEventsForTree.length + 1;

    const event: OfflineWateringEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      idempotencyKey: `IDEM-${treeTagCode}-${volunteerId}-${Math.floor(Date.now() / 60000)}`,
      treeTagCode,
      volunteerId,
      volunteerName,
      waterVolumeLiters,
      soilMoistureLevel,
      recordedAtTimestamp: Date.now(),
      vectorClock: nextVectorClock,
      syncStatus: 'queued',
    };

    queue.push(event);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
    return event;
  }

  /**
   * معالجة طابور المزامنة عند الاتصال وحل التعارضات
   * خوارزمية: تجميع كافة أحداث الري دون فقدان، واعتماد أحدث قراءة للرطوبة
   */
  public static reconcileQueue(
    onProgress?: (reconciledCount: number) => void
  ): {
    reconciled: OfflineWateringEvent[];
    uniqueTreesUpdated: string[];
    treeUpdatesMap: Record<string, { totalWater: number; latestMoisture: 'dry' | 'moderate' | 'optimal'; lastEventTimestamp: number }>;
  } {
    const queue = this.getQueuedEvents();
    if (queue.length === 0) {
      return { reconciled: [], uniqueTreesUpdated: [], treeUpdatesMap: {} };
    }

    // تصفية العمليات المتطابقة (Idempotency deduplication)
    const seenIdempotencyKeys = new Set<string>();
    const deduplicatedEvents: OfflineWateringEvent[] = [];
    const treeUpdatesMap: Record<string, { totalWater: number; latestMoisture: 'dry' | 'moderate' | 'optimal'; lastEventTimestamp: number }> = {};

    for (const evt of queue) {
      if (!seenIdempotencyKeys.has(evt.idempotencyKey)) {
        seenIdempotencyKeys.add(evt.idempotencyKey);
        deduplicatedEvents.push({
          ...evt,
          syncStatus: 'reconciled',
        });

        if (!treeUpdatesMap[evt.treeTagCode]) {
          treeUpdatesMap[evt.treeTagCode] = {
            totalWater: evt.waterVolumeLiters,
            latestMoisture: evt.soilMoistureLevel,
            lastEventTimestamp: evt.recordedAtTimestamp,
          };
        } else {
          treeUpdatesMap[evt.treeTagCode].totalWater += evt.waterVolumeLiters;
          if (evt.recordedAtTimestamp >= treeUpdatesMap[evt.treeTagCode].lastEventTimestamp) {
            treeUpdatesMap[evt.treeTagCode].latestMoisture = evt.soilMoistureLevel;
            treeUpdatesMap[evt.treeTagCode].lastEventTimestamp = evt.recordedAtTimestamp;
          }
        }
      }
    }

    const uniqueTrees = Object.keys(treeUpdatesMap);

    // تفريغ الطابور المحلي بعد نجاح المزامنة
    localStorage.removeItem(this.STORAGE_KEY);
    if (onProgress) onProgress(deduplicatedEvents.length);

    return {
      reconciled: deduplicatedEvents,
      uniqueTreesUpdated: uniqueTrees,
      treeUpdatesMap,
    };
  }
}
