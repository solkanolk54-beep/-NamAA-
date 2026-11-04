# وثيقة العمارة البرمجية وخطة التنفيذ: منصة "نَماء وصِحّة" (NamAA & Wellness)
> **الشعار:** «نَغرس الأرض.. ونَبني الصِّحة»  
> **الفلسفة الأساسية:** دمج العمل التطوعي البيئي الموجّه مكانياً (غرس الأشجار الذكي وإعادة تأهيل المساحات) مع التغذية الرياضية المحسوبة بدقة وتتبع اللياقة البدنية والأثر البيئي المزدوج.

---

## مراجعة المستخدم والقرارات المعتمدة (User Review & Critical Decisions)

> [!IMPORTANT]
> تم اعتماد تفضيلات التصميم والتشغيل التالية بناءً على المرحلة الاستيضاحية:
> - **نمط الواجهة والتجربة:** منصة موحدة تفاعلية مع مبدّل أدوار فوري (Role Switcher) يتيح التبديل السلس بين:
>   1. واجهة المتطوع (Volunteer Mobile View / PWA)
>   2. لوحة تحكم المنظمات والمرافق الشبابية (Organizer GIS Command Center)
>   3. بوابة الشركاء والرعاة للتحقق من قسائم الوجبات والتعافي (Sponsor / Partner QR Portal)
> - **المحرك الجغرافي (GIS Engine):** استخدام **Leaflet + OpenStreetMap** مع طبقات نطاقات بيئية (Eco-Zones)، ونظام استجابة متقدم مع التخزين المؤقت للاستخدام الميداني دون اتصال (Offline-first caching).
> - **نموذج التغذية وحساب المجهود:** حساب حرق السعرات وفق معادلة المكافئ الأيضي (MET - Metabolic Equivalent of Task)، مع تفصيل العناصر الغذائية الكبرى (Macros: Protein / Carbohydrates / Hydration)، وربطها بنظام قسائم رقمية لوجبات التعافي الرياضية من الشركاء (مثل Healthy Brunchy والمزارع المحلية).

---

## 1. النظرة العامة والمفهوم الجوهري (Overview & Core Concept)

* **ما تقدمه المنصة:** نظام رقمي بيئي-صحي متكامل يربط المبادرات الميدانية لإعادة التشجير بنشاط اللياقة البدنية للمتطوعين؛ حيث يتحول كل مجهود بدني في الحفر، النقل، والغرس إلى مؤشرات صحية حقيقية (سعرات حرارية مستهلكة، ترطيب مطلوب، غرامات بروتين للتعافي العضلي)، وتتحول كل شجرة مغروسة إلى أصل بيئي ذكي (Smart Tree Asset) مسجل بالإحداثيات الجغرافية، يتم تتبعه وريّه وكسب نقاط أثر (Impact Points) لرعايته.
* **الفئات المستهدفة:**
  1. **المتطوعون (أفراد وفرق رياضية وشبابية):** تسجيل المهارات (زراعية، يدوية، إسعافية)، تتبع اللياقة وساعات التطوع، تبني الأشجار ورعايتها، وكسب وجبات تعافي غذائية مجانية.
  2. **المنظمات والمرافق الشرفية والشبابية (NGOs & Youth Centers):** نشر المبادرات الجغرافية، مراقبة خريطة الاحتياج الحرارية (Need Heatmap)، توزيع المهام والكوادر، وإدارة حصص الوجبات والمعدات.
  3. **الرعاة والمزارع والمطاعم الصحية (Partners & Healthy Brands):** دعم الشباب بوجبات عالية البروتين ومغذيات استشفاء، والتحقق الفوري من القسائم عبر مسح رمز الاستجابة السريعة (QR Code Scanner) مع توثيق تقارير المسؤولية الاجتماعية (CSR).

---

## 2. تجربة المستخدم والتصميم البصري (User Experience & Visual Design)

### الهوية البصرية ونظام الألوان
* **التوجه الجمالي:** تصميم طبيعي، نقي، رياضي-تقني (Eco-Athletic Precision). يجمع بين روح التربة والنمو الخضري وديناميكية الصحة والأداء البدني العالي، مع التزام صارم بضوابط منع الابتذال (Anti-AI Slop) والاعتماد على خطوط واضحة وتوزيع رقمي أحادي العرض (`tabular-nums`).
* **لوحة الألوان (60-30-10 Rule):**
  * **60% الخلفيات المحايدة:** أبيض ناصع / رمادي داكن هادئ (`#F8FAFC` نهاراً، `#0F172A` ليلاً).
  * **30% الأسطح الهيكلية:** أخضر الغابات العميق (`#064E3B` / `#065F46`) مع لمسات ترابية دافئة (`#78350F`).
  * **10% لهجات التفاعل الحيوية (Accent Budget):** أخضر نماء الحيوي (`#10B981`) للنجاح ونمو الأشجار، وبرتقالي النشاط الرياضي والتعافي الغذائي (`#F59E0B` / `#EA580C`) لمؤشرات حرق السعرات ومطالبة الوجبات.
* **الطباعة (Typography):**
  * الخط الأساسي للنصوص والعناوين: **Tajawal** و **Plus Jakarta Sans** للوضوح وقوة القراءة باللغتين العربية والإنجليزية.
  * مؤشرات البيانات والقياسات الحيوية والإحداثيات: خط رقمي أحادي العرض (**JetBrains Mono** / `font-mono tabular-nums`).

### مسارات المستخدم الرئيسية (Key User Flows)

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Unified Top Navigation & Role Switcher               │
│  [نَماء وصِحّة] ─────── [المتطوع] ── [المنظم / المرفق] ── [الشريك / الراعي] │
└────────────────────────────────────────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Volunteer View  │      │  Organizer GIS   │      │  Sponsor Portal  │
│ ──────────────── │      │ ──────────────── │      │ ──────────────── │
│ • الخريطة الحية     │      │ • خريطة الاحتياج │      │ • ماسح QR للقسائم │
│ • تبني الأشجار   │      │ • توجيه الفرق    │      │ • صرف وجبات البروتين│
│ • حاسبة الحرق    │      │ • حصص الوجبات    │      │ • تقارير الرعاية  │
│ • قسيمة التعافي   │      │ • مطابقة المهارات│      │ • رصيد المساهمة   │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

---

## 3. القرارات المعمارية المفتاحية (Key Product Decisions & Trade-Offs)

1. **التعامل مع بيئة العمل الميدانية وضعف الاتصال (Offline-First GIS & Local Sync):**
   * *القرار:* استخدام بنية قائمة على **Dexie.js (IndexedDB)** على جانب العميل للتخزين المحلي للمهام، تسجيل الأشجار، وقراءات اللياقة عند انقطاع شبكة الهاتف في المناطق الجبلية والريفية، مع طبقة مزامنة تلقائية فور عودة الاتصال (`Sync Engine`) تعتمد على الطوابع الزمنية وتجنب تضارب التعديلات (UUID v4 + Conflict-Free Timestamps).
2. **المحرك الجغرافي وخريطة الاحتياج:**
   * *القرار:* الاستفادة من مكتبة **Leaflet** بالاشتراك مع خوارزميات **PostGIS** الحسابية على الخادم (وتمثيل خفيف على المتصفح عبر GeoJSON). يتيح ذلك تحميل الخرائط بسرعة فائقة وتلوين المناطق الأكثر تصحراً أو حاجة للتشجير (Need Density Heatmap) مع عرض مواضع الأشجار الفردية المغروسة بدقة متناهية.
3. **نموذج اللياقة والتعافي الغذائي:**
   * *القرار:* تطبيق معادلة الجهد المكافئ للأيض ($MET$) لأنشطة الزراعة الميدانية الشاقة ($MET = 5.5 - 7.5$)، وربط السعرات المحروقة مباشرة باحتياج إعادة بناء الألياف العضلية عبر نسب المغذيات الكبرى:
     $$\text{Protein Target (g)} = \min\left(40, \frac{\text{Calories Burned}}{25}\right) + 15$$
     مما يؤهل المتطوع تلقائياً للحصول على قسيمة مشفرة لوجبة استشفاء عالية البروتين مقدمة من الشريك.

---

## 4. المخطط الهندسي والبنية البرمجية المتكاملة (Technical Architecture & Data Strategy)

### مخطط تدفق البيانات والبنية التحتية (ASCII Architecture)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Client Application (React PWA)                    │
│                                                                             │
│   ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────┐   │
│   │   Volunteer Shell   │   │    Organizer GIS    │   │  Sponsor Portal │   │
│   │ (Map, Trees, Health)│   │ (Heatmap, Dispatch) │   │ (QR Validation) │   │
│   └──────────┬──────────┘   └──────────┬──────────┘   └────────┬────────┘   │
│              │                         │                       │            │
│              └─────────────────────────┼───────────────────────┘            │
│                                        ▼                                    │
│                    ┌──────────────────────────────────────┐                 │
│                    │     Offline-First Local Storage      │                 │
│                    │ (IndexedDB / Local Cache / Sync Q)   │                 │
│                    └──────────────────┬───────────────────┘                 │
└───────────────────────────────────────┼─────────────────────────────────────┘
                                        │ (REST / JSON Sync with Bearer Token)
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Backend Services (API Layer)                        │
│                                                                             │
│   ┌───────────────────────┐ ┌───────────────────────┐ ┌─────────────────┐   │
│   │   GIS & Match Engine  │ │  Dual-Impact Service  │ │ Voucher & Auth  │   │
│   │ (PostGIS Spatial Qs)  │ │ (MET & CO2 Algos)     │ │ (HMAC / QR Sec) │   │
│   └──────────┬────────────┘ └──────────┬────────────┘ └────────┬────────┘   │
│              └─────────────────────────┼───────────────────────┘            │
│                                        ▼                                    │
│                     ┌────────────────────────────────────┐                  │
│                     │       PostgreSQL + PostGIS DB      │                  │
│                     │  (Spatial Indexes, Tables, Logs)   │                  │
│                     └────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### مخطط الكيانات ونموذج قاعدة البيانات (Database Schema - PostGIS & Offline-First)

```sql
-- تفعيل ملحق العمليات المكانية والجغرافية
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. جدول المستخدمين والمتطوعين (Users & Volunteers)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    national_id VARCHAR(50) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'volunteer' CHECK (role IN ('volunteer', 'organizer', 'sponsor', 'admin')),
    
    -- اللياقة والبيانات الحيوية
    weight_kg NUMERIC(5,2) DEFAULT 70.0,
    fitness_level VARCHAR(20) DEFAULT 'moderate' CHECK (fitness_level IN ('beginner', 'moderate', 'athlete')),
    
    -- المهارات (مصفوفة نصية: زراعة، ري، إسعاف، نقل، تقليم)
    skills TEXT[] DEFAULT ARRAY['general_help'],
    
    -- الموقع الجغرافي الحالي / المفضل للمتطوع
    home_location GEOMETRY(Point, 4326),
    
    -- نقاط الأثر ورصيد الوجبات
    impact_points INT DEFAULT 0,
    total_trees_adopted INT DEFAULT 0,
    total_calories_burned NUMERIC(8,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_home_location ON users USING GIST (home_location);

-- 2. جدول المبادرات والمهام الجغرافية (Campaigns & Tasks)
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    facility_name VARCHAR(150), -- مثل: المرفق الشبابي بميلة
    
    -- الموقع الجغرافي للمبادرة ومحيط التدخل
    boundary_area GEOMETRY(Polygon, 4326),
    center_location GEOMETRY(Point, 4326) NOT NULL,
    
    -- التوقيت والحصص
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    volunteer_quota INT NOT NULL DEFAULT 30,
    current_volunteers_count INT DEFAULT 0,
    
    -- المهارات المطلوبة لفرز المتطوعين
    required_skills TEXT[] DEFAULT ARRAY['agriculture'],
    
    -- حصة الوجبات المخصصة للتعافي من الرعاة
    meal_quota INT NOT NULL DEFAULT 30,
    meal_type_description VARCHAR(150) DEFAULT 'High-Protein Recovery Box (Healthy Brunchy)',
    
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'active', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_campaigns_center ON campaigns USING GIST (center_location);

-- 3. سجل الأشجار المعتمدة الذكية (Tree_Registry)
CREATE TABLE tree_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    adopter_id UUID REFERENCES users(id), -- المتطوع الذي تبناها
    
    species VARCHAR(100) NOT NULL, -- مثل: زيتون، خروب، صنوبر حلبي
    tree_tag_code VARCHAR(50) UNIQUE NOT NULL, -- كود NFC / QR الشجرة
    coordinates GEOMETRY(Point, 4326) NOT NULL,
    
    planted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    growth_stage VARCHAR(30) DEFAULT 'sapling' CHECK (growth_stage IN ('sapling', 'young', 'maturing', 'mature')),
    health_status VARCHAR(20) DEFAULT 'healthy' CHECK (health_status IN ('healthy', 'needs_water', 'pruned', 'dormant')),
    
    -- جدول الري والرعاية
    last_watered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    next_watering_due TIMESTAMP WITH TIME ZONE,
    
    -- امتصاص الكربون التقديري (كغ كربون سنوياً حسب النوع والعمر)
    estimated_annual_co2_kg NUMERIC(6,2) DEFAULT 22.0
);
CREATE INDEX idx_tree_coords ON tree_registry USING GIST (coordinates);

-- 4. سجل الأثر المزدوج للنشاط التطوعي (Dual_Impact_Logs)
CREATE TABLE dual_impact_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    campaign_id UUID REFERENCES campaigns(id),
    
    -- تفاصيل الجهد البدني
    task_type VARCHAR(50) NOT NULL, -- digging, planting, water_carrying, clearing
    duration_minutes INT NOT NULL,
    met_intensity NUMERIC(4,2) NOT NULL, -- الجهد الأيضي (مثلاً 6.5 للحفر وغرس الأشجار)
    calories_burned NUMERIC(6,2) NOT NULL,
    
    -- الأثر البيئي المرتبط بالجلسة
    trees_planted_count INT DEFAULT 1,
    co2_offset_lifetime_kg NUMERIC(8,2) NOT NULL,
    
    -- المزامنة غير المتصلة
    is_offline_synced BOOLEAN DEFAULT FALSE,
    client_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. قسائم التعافي الغذائي والشراكات (Nutritional_Rewards & Vouchers)
CREATE TABLE nutritional_vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voucher_code VARCHAR(64) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    campaign_id UUID REFERENCES campaigns(id),
    sponsor_name VARCHAR(100) DEFAULT 'Healthy Brunchy',
    
    -- التفاصيل الغذائية المخصصة للاستشفاء
    target_protein_g NUMERIC(5,2) NOT NULL,
    target_carbs_g NUMERIC(5,2) NOT NULL,
    calories_provided NUMERIC(6,2) NOT NULL,
    hydration_ml INT DEFAULT 750,
    
    -- حالة الصرف
    is_redeemed BOOLEAN DEFAULT FALSE,
    redeemed_at TIMESTAMP WITH TIME ZONE,
    verified_by_sponsor_id UUID REFERENCES users(id),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_voucher_code ON nutritional_vouchers (voucher_code);
```

---

### الخوارزميات الأساسية (Core Algorithmic Logic)

#### 1. خوارزمية المطابقة الجغرافية الذكية والفرز بالمهارات (Smart Spatial Matching)
تقوم بالبحث في نطاق محدد (مثلاً 5 كم أو 10 كم) حول موقع الحملة، مع ترتيب المتطوعين وفق توافق المهارات المطلوبة (مثل المهارات الزراعية أو تقليم الأشجار) وقرب المسافة:

```typescript
/**
 * استعلام PostGIS لمطابقة وفرز المتطوعين حسب النطاق الجغرافي وتطابق المهارات
 * @param campaignLat خط عرض الحملة
 * @param campaignLng خط طول الحملة
 * @param radiusMeters نصف القطر بالأمتار (مثلاً 5000 م)
 * @param requiredSkills المهارات ذات الأولوية
 */
export const buildSpatialMatchQuery = (
  campaignLat: number,
  campaignLng: number,
  radiusMeters: number = 5000,
  requiredSkills: string[] = ['agriculture', 'tree_pruning']
) => {
  return `
    SELECT 
      u.id,
      u.full_name,
      u.phone,
      u.skills,
      u.fitness_level,
      u.impact_points,
      ST_Distance(
        u.home_location::geography, 
        ST_SetSRID(ST_MakePoint(${campaignLng}, ${campaignLat}), 4326)::geography
      ) AS distance_meters,
      -- احتساب وزن تطابق المهارات
      (
        SELECT COUNT(*) 
        FROM unnest(u.skills) AS s 
        WHERE s = ANY(ARRAY[${requiredSkills.map(s => `'${s}'`).join(',')}])
      ) AS skill_match_score
    FROM users u
    WHERE 
      u.role = 'volunteer'
      AND ST_DWithin(
        u.home_location::geography,
        ST_SetSRID(ST_MakePoint(${campaignLng}, ${campaignLat}), 4326)::geography,
        ${radiusMeters}
      )
    ORDER BY 
      skill_match_score DESC,
      distance_meters ASC
    LIMIT 50;
  `;
};
```

#### 2. حاسبة الأثر المزدوج: السعرات والمغذيات وامتصاص الكربون (Dual Impact Tracker)

```typescript
export interface ActivityInput {
  taskType: 'digging' | 'tree_planting' | 'carrying_water' | 'site_clearing';
  durationMinutes: number;
  weightKg: number;
  treesPlanted: number;
}

export interface DualImpactResult {
  caloriesBurned: number;
  recommendedProteinGrams: number;
  recommendedCarbsGrams: number;
  hydrationMl: number;
  lifetimeCo2OffsetKg: number;
  earnedImpactPoints: number;
}

// قيم المكافئ الأيضي (MET) للأنشطة الزراعية الشاقة
const MET_VALUES: Record<string, number> = {
  digging: 7.0,          // حفر التربة الصعبة
  tree_planting: 5.5,    // غرس وتثبيت الشتلات
  carrying_water: 6.5,   // نقل أوعية الري
  site_clearing: 4.8,    // تنظيف وتهيئة الأرض
};

/**
 * حساب الأثر الصحي والبيئي المزدوج
 */
export function calculateDualImpact(input: ActivityInput): DualImpactResult {
  const met = MET_VALUES[input.taskType] || 5.0;
  
  // صيغة الكلية الأمريكية للطب الرياضي (ACSM) لحرق السعرات:
  // Calories = MET * 3.5 * weightKg / 200 * durationMinutes
  const rawCalories = (met * 3.5 * input.weightKg / 200) * input.durationMinutes;
  const caloriesBurned = Math.round(rawCalories);

  // احتساب متطلبات الاستشفاء العضلي (Nutrition Recovery)
  // 15-35g بروتين بناءً على حجم الجهد المبذول
  const protein = Math.min(35, Math.max(15, Math.round(caloriesBurned / 22)));
  const carbs = Math.round(protein * 2.2); // تعويض مخازن الجليكوجين
  const hydration = Math.round(input.durationMinutes * 12.5); // مل ماء

  // تقدير امتصاص الكربون (متوسط 22 كغ CO2 سنوياً للشجرة على مدى 25 عاماً)
  const lifetimeCo2PerTree = 22 * 25; // 550 كغ للشجرة طيلة دورة حياتها
  const lifetimeCo2OffsetKg = input.treesPlanted * lifetimeCo2PerTree;

  // احتساب نقاط الأثر
  const points = Math.round((caloriesBurned / 10) + (input.treesPlanted * 50));

  return {
    caloriesBurned,
    recommendedProteinGrams: protein,
    recommendedCarbsGrams: carbs,
    hydrationMl: Math.max(500, hydration),
    lifetimeCo2OffsetKg,
    earnedImpactPoints: points
  };
}
```

---

### تقسيم مكونات الواجهة وتجربة المستخدم (UI/UX Component Breakdown)

1. **واجهة المتطوع (Volunteer Mobile View):**
   * `VolunteerHeader`: يعرض الرصيد التراكمي لنقاط الأثر، شارة اللياقة، ومفتاح المزامنة الميدانية.
   * `LiveEcoMap`: خريطة Leaflet تفاعلية تبرز مواقع الحملات المحيطة، وتتيح النقر على كل شتلة تم تبنيها لمراجعة جدول ريّها.
   * `WorkoutCalorieTracker`: واجهة تسجيل سريعة لنوع النشاط والوقت، تعرض فورياً السعرات المحروقة والشريط الغذائي للبروتين المكتسب.
   * `VoucherCardModal`: شاشة استعراض قسيمة التعافي الرقمية المشفرة الموجهة للشريك الراعي (مع رمز QR ديناميكي).
   * `TreeCareCard`: بطاقة تتبع الشجرة المتبناة مع منبّه للريّ وتوثيق النمو بالصور.

2. **لوحة تحكم المنظمات والمراكز الشبابية (Organizer Web GIS Dashboard):**
   * `NeedHeatmapLayer`: خريطة طبقات حرارية تبرز الأحياء والمناطق الأكثر افتقاراً للغطاء النباتي.
   * `VolunteerDispatchPanel`: جدول يوضح قائمة المتطوعين المرشحين بناءً على خوارزمية الـ 5 كم ومطابقة المهارات.
   * `ResourceQuotaBar`: عدادات فورية لحصص الوجبات الغذائية المتاحة من الشركاء، الشتلات المتوفرة، والمعدات.
   * `BatchImpactSummary`: ملخص الأثر الإجمالي للمبادرة (مجموع السعرات، مجموع الأشجار، وكمية الكربون الممتصة).

3. **بوابة الشريك والراعي (Sponsor / Partner Portal - Healthy Brunchy Case):**
   * `QrScannerInterface`: قارئ رمز الاستجابة السريعة للتحقق الفوري من استحقاق المتطوع لوجبة التعافي البروتينية.
   * `VoucherVerificationCard`: عرض تفاصيل الوجبة (غرامات البروتين والكربوهيدرات المخصصة) وزر اعتماد الصرف.
   * `SponsorImpactAnalytics`: إحصائيات الدعم المجتمعي (عدد الوجبات المصروفة، إجمالي ساعات التطوع المدعومة).

---

## 5. المخطط التنفيذي لتجربة ولاية ميلة (Mila Pilot Execution Blueprint)

### دراسة حالة تجربة ميلة:
تنظيم أول فعالية تشجير وتعافٍ رياضي بالمرفق الشبابي لولاية ميلة (Mila Youth Center)، تستهدف غرس 150 شتلة زيتون وخروب ملائمة لبيئة المنطقة، وتوزيع 50 وجبة تعافٍ عالية البروتين من الشريك المحلي.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   5-Step Operational Pilot Workflow (Mila)                  │
│                                                                             │
│  [1. الإطلاق الجغرافي] ──► [2. الفرز الذكي] ──► [3. العمل الميداني والـ GPS] │
│      (Organizer)               (Match Algo)             (Volunteers)        │
│                                                              │              │
│  [5. إغلاق دورة الرعاية] ◄── [4. استلام وجبة التعافي والـ QR] ◄──────────────┘
│      (Impact Report)               (Sponsor / Brunchy)                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **الخطوة 1: الإطلاق الجغرافي وتحديد الاحتياج (Geospatial Campaign Setup):**
   * يقوم مدير المرفق الشبابي بميلة برسم مضلع جغرافي لمحيط المركز ومحيط الحزام الأخضر عبر لوحة المنظم، وتحديد حاجة 150 شجرة وحصة 50 وجبة استشفاء مدعومة من الراعي.
2. **الخطوة 2: الاستدعاء الذكي للمتطوعين (Smart Push & Skill Match):**
   * إرسال تنبيهات مستهدفة للمتطوعين المسجلين في دائرة ميلة وضواحيها (في نطاق 7 كم) الذين يمتلكون مهارات حفر، غرس، وتنظيم، مع تأكيد جاهزية نظام الحفظ دون اتصال بالإنترنت.
3. **الخطوة 3: التنفيذ الميداني وتوثيق الأشجار (Field Execution & Offline Tree Registry):**
   * يقوم المتطوعون ببدء مهام الحفر والغرس؛ يتم ربط كل شتلة بإحداثيات GPS ونوع الشجرة واسم المتطوع الراعي. يُسجل العداد الميداني مدة النشاط ويحسب السعرات المحروقة.
4. **الخطوة 4: توليد قسيمة التعافي ومسح الـ QR (Macro Recovery & Sponsor Redemption):**
   * فور إنهاء النشاط، يُصدر النظام قسيمة إلكترونية معتمدة تحتوي على الاحتياج الغذائي (مثلاً: 28g بروتين، 65g كربوهيدرات). يتوجه المتطوع لنقطة توزيع وجبات الراعي الشريك (Healthy Brunchy) حيث يتم مسح الكود واعتماد تسليم الوجبة.
5. **الخطوة 5: التقارير المستدامة وتبني الشجرة (Sustained Care & Impact Ledger):**
   * إشعار المتطوع بمواعيد الري الدورية للشجرة التي غرسها ومتابعة صحتها مع تحديث مؤشر تقليل البصمة الكربونية لميلة.

---

### هيكلية نقاط الاتصال البرمجية (REST API Endpoints)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/campaigns` | إنشاء مبادرة بيئية مع الإحداثيات وحصص الوجبات |
| `GET` | `/api/v1/volunteers/match?lat={}&lng={}&radius={}` | استعلام PostGIS لمطابقة المتطوعين الأقرب |
| `POST` | `/api/v1/trees/register` | تسجيل شجرة جديدة بالإحداثيات وكود التعريف |
| `POST` | `/api/v1/impact/log-activity` | حساب وتسجيل السعرات، البروتين المطلوب، وتوليد القسيمة |
| `POST` | `/api/v1/vouchers/verify-and-redeem` | تحقق الشريك الراعي من رمز QR وصرف الوجبة |
| `GET` | `/api/v1/analytics/mila-summary` | تقرير قياس الأثر المزدوج التراكمي لولاية ميلة |
