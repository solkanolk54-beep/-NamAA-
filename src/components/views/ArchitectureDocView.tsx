import React, { useState } from 'react';
import {
  Database,
  Code,
  MapPin,
  Compass,
  CheckCircle2,
  Copy,
  Layers,
  Terminal,
  Activity,
  Award,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Zap,
  Globe
} from 'lucide-react';

export const ArchitectureDocView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'stack' | 'schema' | 'algorithms' | 'blueprint' | 'api'>('blueprint');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
              ARCHITECTURE & BLUEPRINT SPECIFICATION
            </span>
            <span className="text-xs text-slate-400">· نَماء وصِحّة (NamAA & Wellness)</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            المخطط المعماري وخطة التنفيذ الميدانية (Mila Pilot Case Study)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            المرجع التقني الكامل لقواعد البيانات، استعلامات PostGIS، خوارزميات الأثر المزدوج، وسيناريو تشغيل تجربة ميلة
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveSection('blueprint')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSection === 'blueprint'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            خطة تجربة ميلة (5 خطوات)
          </button>
          <button
            onClick={() => setActiveSection('stack')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSection === 'stack'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            المكدس البرمجي (Tech Stack)
          </button>
          <button
            onClick={() => setActiveSection('schema')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSection === 'schema'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            جداول PostGIS (ERD Schema)
          </button>
          <button
            onClick={() => setActiveSection('algorithms')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSection === 'algorithms'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الخوارزميات (Algorithms)
          </button>
          <button
            onClick={() => setActiveSection('api')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSection === 'api'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            واجهات API (REST Endpoints)
          </button>
        </div>
      </div>

      {/* SECTION 1: Mila Pilot 5-Step Blueprint */}
      {activeSection === 'blueprint' && (
        <div className="space-y-4">
          <div className="bg-emerald-900 text-white rounded-xl p-5 shadow-sm border border-emerald-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-300 font-mono">
                PILOT CASE STUDY · WILAYA DE MILA
              </span>
              <span className="text-[11px] bg-emerald-800 px-2.5 py-0.5 rounded text-emerald-100">
                المرحلة الميدانية الأولى
              </span>
            </div>
            <h3 className="text-base font-bold mb-1">
              مخطط تنفيذ التجربة الحية: تشجير محيط المرفق الشبابي لولاية ميلة وتوزيع وجبات التعافي
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl">
              دليل تشغيلي متكامل من 5 خطوات يوضح كيفية تدفق البيانات بين المنظمين والمتطوعين وشريك التغذية (Healthy Brunchy) في يوم الفعالية الميدانية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              {
                step: '01',
                title: 'تحديد الاحتياج الجغرافي',
                owner: 'مدير المرفق الشبابي بميلة',
                desc: 'رسم مضلع محيط المرفق الشرفي، وتحديد استيعاب 150 شتلة زيتون وخروب وتخصيص حصة 30 وجبة استشفاء مدعومة من Healthy Brunchy.',
                tech: 'GIS Polygon / Need Heatmap',
              },
              {
                step: '02',
                title: 'الفرز والاستدعاء الذكي',
                owner: 'خوارزمية PostGIS ST_DWithin',
                desc: 'فرز متطوعي ولاية ميلة ضمن نطاق 5 كم حسب توافق مهارات الزراعة والحفر، وإرسال إشعار توجيه مع خاصية التخزين المحلي Offline Cache.',
                tech: 'Spatial Match + IndexedDB',
              },
              {
                step: '03',
                title: 'التنفيذ وتوثيق الأشجار',
                owner: 'فرق المتطوعين الميدانية',
                desc: 'غرس الشتلات وتثبيت وسوم NFC/QR لكل شجرة، وحساب وقت الجهد الفعلي لحرق السعرات وفق المكافئ الأيضي (MET = 5.5 - 7.0).',
                tech: 'Tree Registry + MET Tracker',
              },
              {
                step: '04',
                title: 'صرف وجبة الاستشفاء',
                owner: 'Healthy Brunchy (نقطة التوزيع)',
                desc: 'توليد قسيمة تعافٍ رقمية بمغذيات دقيقة (32g بروتين، 70g كربوهيدرات)، ومسح رمز الـ QR من قبل الشريك لصرف صندوق الاستشفاء فوراً.',
                tech: 'HMAC QR / Voucher Scanner',
              },
              {
                step: '05',
                title: 'إغلاق الدورة والرعاية الدائمة',
                owner: 'المنصة والمجتمع المحلي',
                desc: 'ربط المتطوعين بجدول السقاية الدوري للأشجار التي غرسوها عبر تنبيهات ذكية، مع إصدار تقرير المسؤولية المجتمعية (CSR) للشريك.',
                tech: 'Care Ledger + CSR Cert',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      الخطوة {s.step}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">{s.owner}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mb-1.5">{s.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{s.desc}</p>
                </div>
                <div className="text-[10px] font-mono bg-slate-50 text-slate-600 p-1.5 rounded border border-slate-100 text-center">
                  {s.tech}
                </div>
              </div>
            ))}
          </div>

          {/* Operational Checklist */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              قائمة التحقق الميداني للفعالية التجريبية بميلة (Operational Readiness Checklist)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-emerald-600" />
                <span>
                  <b>تجهيز الشتلات المحلية:</b> توفير 100 شتلة زيتون جبلي و 50 شتلة خروب متوافقة مع تربة ميلة ومقاومة للجفاف.
                </span>
              </label>
              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-emerald-600" />
                <span>
                  <b>جاهزية العمل دون اتصال (Offline-first):</b> تثبيت تطبيق PWA على أجهزة منسقي الفرق لتسجيل الأشجار دون حاجة لتغطية 4G.
                </span>
              </label>
              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-emerald-600" />
                <span>
                  <b>تنسيق نقطة التغذية مع Healthy Brunchy:</b> تجهيز 30 صندوق استشفاء رياضي عالي البروتين وحفظها في مبردات حرارية بالمركب.
                </span>
              </label>
              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-emerald-600" />
                <span>
                  <b>حسابات الجهد والصحة:</b> اعتماد وزن كل متطوع مسجل لتوليد السعرات الدقيقة وتوصيات البروتين الفردية فور انتهاء الجلسة.
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Tech Stack Selection & Trade-offs */}
      {activeSection === 'stack' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <Layers className="w-4 h-4" />
              <span>واجهة المستخدم والتطبيق الميداني</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li>
                <b className="text-slate-800">React 19 + TypeScript + Vite:</b> سرعة تحميل فائقة واستهلاك ذاكرة منخفض للأجهزة المتوسطة.
              </li>
              <li>
                <b className="text-slate-800">Progressive Web App (PWA):</b> دعم العمل الكامل دون اتصال بالإنترنت في المناطق الجبلية بميلة.
              </li>
              <li>
                <b className="text-slate-800">Leaflet.js + OpenStreetMap:</b> محرك خرائط خفيف الحجم مقارنة بـ Mapbox، لا يتطلب مفاتيح مكلفة، ويدعم التخزين المؤقت للبلاطات (Tile Caching).
              </li>
              <li>
                <b className="text-slate-800">Tailwind CSS:</b> نظام تصميم موحد وعالي الأداء يدعم الاتجاهين (RTL/LTR) والوضع الليلي.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
              <Database className="w-4 h-4" />
              <span>البيانات والمزامنة المكانية</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li>
                <b className="text-slate-800">PostgreSQL + PostGIS:</b> محرك العمليات المكانية القياسي عالمياً لحساب المسافات، تقاطع المضلعات، ومطابقة النطاقات (`ST_DWithin`).
              </li>
              <li>
                <b className="text-slate-800">Dexie.js / IndexedDB:</b> قاعدة بيانات محلية مدمجة بالمتصفح لتخزين إحداثيات الأشجار وسجلات الجهد أثناء انقطاع الشبكة.
              </li>
              <li>
                <b className="text-slate-800">Conflict-Free Timestamps:</b> آلية مزامنة تعتمد على الطوابع الزمنية ومعرفات UUID لتفادي تضارب البيانات عند عودة الاتصال.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <Activity className="w-4 h-4" />
              <span>محرك الصحة والأمان</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li>
                <b className="text-slate-800">معادلة الأيض الرياضي (MET):</b> حساب معتمد من الكلية الأمريكية للطب الرياضي (ACSM) لحرق السعرات بدقة.
              </li>
              <li>
                <b className="text-slate-800">تشفير القسائم (HMAC-SHA256):</b> توليد أكواد QR مشفرة تمنع التلاعب أو صرف الوجبة لأكثر من مرة واحدة.
              </li>
              <li>
                <b className="text-slate-800">معيار HL7 FHIR المتوافق:</b> هيكلة السجلات الصحية بصيغة قابلة للربط المستقبلي مع أنظمة الرعاية الصحية.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* SECTION 3: ERD Entity Schema */}
      {activeSection === 'schema' && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto relative border border-slate-800">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400">
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                PostgreSQL + PostGIS Production Schema DDL
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    `-- NamAA & Wellness Production Schema
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'volunteer',
    weight_kg NUMERIC(5,2) DEFAULT 70.0,
    skills TEXT[] DEFAULT ARRAY['agriculture'],
    home_location GEOMETRY(Point, 4326),
    impact_points INT DEFAULT 0
);
CREATE INDEX idx_users_home_location ON users USING GIST (home_location);

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    center_location GEOMETRY(Point, 4326) NOT NULL,
    volunteer_quota INT NOT NULL DEFAULT 30,
    meal_quota INT NOT NULL DEFAULT 30,
    required_skills TEXT[] DEFAULT ARRAY['agriculture']
);
CREATE INDEX idx_campaigns_center ON campaigns USING GIST (center_location);

CREATE TABLE tree_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    adopter_id UUID REFERENCES users(id),
    species VARCHAR(100) NOT NULL,
    tree_tag_code VARCHAR(50) UNIQUE NOT NULL,
    coordinates GEOMETRY(Point, 4326) NOT NULL,
    health_status VARCHAR(20) DEFAULT 'healthy',
    estimated_annual_co2_kg NUMERIC(6,2) DEFAULT 22.0
);
CREATE INDEX idx_tree_coords ON tree_registry USING GIST (coordinates);`,
                    'sql'
                  )
                }
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded transition-colors flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedKey === 'sql' ? 'تم النسخ!' : 'نسخ كود SQL'}</span>
              </button>
            </div>
            <pre className="text-slate-300 text-[11px] leading-relaxed">
{`-- 1. جدول المستخدمين والمتطوعين (Users & Volunteers)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'volunteer' CHECK (role IN ('volunteer', 'organizer', 'sponsor')),
    weight_kg NUMERIC(5,2) DEFAULT 70.0,
    skills TEXT[] DEFAULT ARRAY['agriculture'],
    home_location GEOMETRY(Point, 4326),
    impact_points INT DEFAULT 0,
    total_trees_adopted INT DEFAULT 0,
    total_calories_burned NUMERIC(8,2) DEFAULT 0
);
CREATE INDEX idx_users_home_location ON users USING GIST (home_location);

-- 2. جدول المبادرات والمهام الجغرافية (Campaigns & Tasks)
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    facility_name VARCHAR(150),
    center_location GEOMETRY(Point, 4326) NOT NULL,
    volunteer_quota INT NOT NULL DEFAULT 30,
    meal_quota INT NOT NULL DEFAULT 30,
    required_skills TEXT[] DEFAULT ARRAY['agriculture'],
    status VARCHAR(20) DEFAULT 'active'
);
CREATE INDEX idx_campaigns_center ON campaigns USING GIST (center_location);

-- 3. سجل الأشجار الذكية المعتمدة (Tree_Registry)
CREATE TABLE tree_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    adopter_id UUID REFERENCES users(id),
    species VARCHAR(100) NOT NULL,
    tree_tag_code VARCHAR(50) UNIQUE NOT NULL,
    coordinates GEOMETRY(Point, 4326) NOT NULL,
    last_watered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estimated_annual_co2_kg NUMERIC(6,2) DEFAULT 22.0
);
CREATE INDEX idx_tree_coords ON tree_registry USING GIST (coordinates);

-- 4. قسائم التعافي الغذائي (Nutritional_Vouchers)
CREATE TABLE nutritional_vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voucher_code VARCHAR(64) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    campaign_id UUID REFERENCES campaigns(id),
    sponsor_name VARCHAR(100) DEFAULT 'Healthy Brunchy',
    target_protein_g NUMERIC(5,2) NOT NULL,
    target_carbs_g NUMERIC(5,2) NOT NULL,
    is_redeemed BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);`}
            </pre>
          </div>
        </div>
      )}

      {/* SECTION 4: Algorithms */}
      {activeSection === 'algorithms' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Spatial Matcher Alg */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-600" />
              1. استعلام المطابقة الجغرافية (Spatial Matching Query)
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              استعلام PostGIS لمطابقة المتطوعين ضمن نطاق 5 كم وفرزهم حسب مهارات الزراعة ونقل المياه:
            </p>
            <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
{`SELECT 
  u.id, u.full_name, u.skills,
  ST_Distance(u.home_location::geography, 
    ST_SetSRID(ST_MakePoint(6.2649, 36.4503), 4326)::geography
  ) AS distance_meters,
  (SELECT COUNT(*) FROM unnest(u.skills) s 
   WHERE s = ANY(ARRAY['زراعة وغرس', 'حفر شاق'])) AS skill_match_score
FROM users u
WHERE u.role = 'volunteer'
  AND ST_DWithin(u.home_location::geography,
    ST_SetSRID(ST_MakePoint(6.2649, 36.4503), 4326)::geography, 
    5000)
ORDER BY skill_match_score DESC, distance_meters ASC;`}
            </div>
          </div>

          {/* MET Dual Impact Formula */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-600" />
              2. معادلة الأثر المزدوج والتعافي الغذائي (Dual Impact Formula)
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              حساب السعرات المحروقة وفق معايير الكلية الأمريكية للطب الرياضي واستنتاج المغذيات الكبرى:
            </p>
            <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto space-y-2">
              <div>
                <span className="text-amber-400">// السعرات المحروقة (Calories Burned):</span>
                <p className="text-slate-100">Calories = (MET * 3.5 * weightKg * durationMin) / 200</p>
              </div>
              <div>
                <span className="text-emerald-400">// البروتين الموصى به للاستشفاء (Protein grams):</span>
                <p className="text-slate-100">Protein = Math.min(38, Math.max(16, round(Calories / 22)))</p>
              </div>
              <div>
                <span className="text-blue-400">// امتصاص الكربون طيلة دورة الحياة (25 سنة):</span>
                <p className="text-slate-100">LifetimeCO2 (kg) = treesPlanted * 22kg * 25 years</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: API Endpoints */}
      {activeSection === 'api' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-blue-600" />
            هيكلية واجهات الاتصال البرمجية (REST API Endpoints)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="p-2.5">المسار (Endpoint)</th>
                  <th className="p-2.5">النوع</th>
                  <th className="p-2.5">الوظيفة والوصف</th>
                  <th className="p-2.5">الصلاحية (RBAC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold text-slate-800">/api/v1/campaigns</td>
                  <td className="p-2.5"><span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">POST</span></td>
                  <td className="p-2.5 font-sans">إنشاء مبادرة بيئية مع الإحداثيات وحصص الوجبات والشتلات</td>
                  <td className="p-2.5 font-sans">المنظم / المرفق</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-800">/api/v1/volunteers/match</td>
                  <td className="p-2.5"><span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">GET</span></td>
                  <td className="p-2.5 font-sans">استعلام PostGIS لمطابقة المتطوعين حسب النطاق والمهارات</td>
                  <td className="p-2.5 font-sans">المنظم</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-800">/api/v1/impact/log-activity</td>
                  <td className="p-2.5"><span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">POST</span></td>
                  <td className="p-2.5 font-sans">تسجيل الجهد البدني وحساب المغذيات وتوليد قسيمة الوجبة</td>
                  <td className="p-2.5 font-sans">المتطوع</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-800">/api/v1/vouchers/verify-redeem</td>
                  <td className="p-2.5"><span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">POST</span></td>
                  <td className="p-2.5 font-sans">تحقق الشريك من رمز QR واعتماد صرف وجبة الاستشفاء</td>
                  <td className="p-2.5 font-sans">الراعي (Healthy Brunchy)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-800">/api/v1/trees/adopt</td>
                  <td className="p-2.5"><span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">POST</span></td>
                  <td className="p-2.5 font-sans">تبني شجرة مغروسة وربطها بالمتطوع لجدول السقاية</td>
                  <td className="p-2.5 font-sans">المتطوع</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
