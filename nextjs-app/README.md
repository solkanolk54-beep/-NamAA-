# منصة نَماء وصِحّة (NamAA & Wellness) - Next.js 14 App Router

> «نَغرس الأرض.. ونَبني الصِّحة»  
> تطبيق ويب متكامل للعمل التطوعي البيئي الجغرافي (GIS) والتغذية الرياضية واستشفاء المتطوعين بولاية ميلة.

---

## 🚀 النشر بنقرة واحدة على Vercel (One-Click Deploy)

يمكنك نشر هذا المشروع مباشرة عبر منصة Vercel باتباع الخطوات التالية:

### الخطوة 1: دفع المستودع إلى GitHub
\`\`\`bash
git init
git add .
git commit -m "feat: initial commit for NamAA & Wellness Next.js 14 App"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/namaa-wellness-app.git
git push -u origin main
\`\`\`

### الخطوة 2: النشر عبر Vercel
1. سجّل الدخول إلى [Vercel Dashboard](https://vercel.com/dashboard).
2. انقر على **"Add New..."** ثم **"Project"**.
3. اختر مستودع \`namaa-wellness-app\` من حساب GitHub.
4. اترك الإعدادات الافتراضية:
   - **Framework Preset:** Next.js
   - **Root Directory:** \`./\`
   - **Build Command:** \`npm run build\`
5. انقر على **"Deploy"**!

---

## 🛠️ البنية البرمجية للصفحات (App Router Pages)

| المسار | الوظيفة | التوجيه |
|---|---|---|
| \`/\` | الصفحة الرئيسية واستعراض الإحصائيات وركائز المنصة | Server Component |
| \`/map\` | الخريطة التفاعلية (Leaflet) ومطابقة المتطوعين جغرافياً | Client Component (\`'use client'\`) |
| \`/impact\` | حاسبة الأثر المزدوج (METs) والتوأم الرقمي للأشجار | Client Component (\`'use client'\`) |
| \`/recovery\` | ماسح رموز QR لقسائم وجبات التعافي (Healthy Brunchy) | Client Component (\`'use client'\`) |

---

## ⚡ معالجة خطأ Leaflet SSR في Vercel

لتفادي خطأ \`window is not defined\` أثناء عملية بناء الإنتاج (\`next build\`) على سيرفرات Vercel، تم تحميل مكون الخريطة عبر الاستيراد الديناميكي:

\`\`\`tsx
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('@/components/GisMap'), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-slate-100 animate-pulse rounded-2xl" />
});
\`\`\`
