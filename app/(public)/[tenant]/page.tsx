import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Calendar,
  ChevronLeft,
  Check
} from "lucide-react";

interface TenantPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

// Demo data - In production, this comes from Supabase
const demoBusinesses: Record<string, {
  name: string;
  vertical: "beauty" | "fitness";
  description: string;
  rating: number;
  reviewCount: number;
  coverImage: string;
  logoUrl: string;
  city: string;
  address: string;
  phone: string;
  workingHours: { day: string; hours: string }[];
  services: {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
  }[];
}> = {
  "studio-fit": {
    name: "Studio Fit",
    vertical: "fitness",
    description: "סטודיו לאימונים אישיים ויוגה בלב תל אביב. צוות מאמנים מקצועי עם ניסיון של שנים בתחום הכושר והבריאות.",
    rating: 4.9,
    reviewCount: 127,
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop",
    logoUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=100&h=100&fit=crop",
    city: "תל אביב",
    address: "רחוב דיזנגוף 100",
    phone: "03-1234567",
    workingHours: [
      { day: "ראשון - חמישי", hours: "06:00 - 22:00" },
      { day: "שישי", hours: "06:00 - 14:00" },
      { day: "שבת", hours: "סגור" },
    ],
    services: [
      { id: "1", name: "אימון אישי", description: "אימון אחד על אחד עם מאמן מוסמך", duration: 60, price: 200, category: "אימונים" },
      { id: "2", name: "יוגה פרטי", description: "שיעור יוגה אישי מותאם לרמתך", duration: 60, price: 180, category: "יוגה" },
      { id: "3", name: "פילאטיס מזרן", description: "אימון פילאטיס על מזרן", duration: 60, price: 150, category: "פילאטיס" },
      { id: "4", name: "אימון קבוצתי", description: "שיעור קבוצתי עד 8 משתתפים", duration: 45, price: 50, category: "קבוצתי" },
      { id: "5", name: "ייעוץ תזונה", description: "פגישת ייעוץ עם תזונאית", duration: 45, price: 250, category: "תזונה" },
    ],
  },
  "bella-beauty": {
    name: "Bella Beauty",
    vertical: "beauty",
    description: "סלון יופי מוביל עם טיפולי פנים, ציפורניים ומייקאפ. אנחנו מתמחים בטיפולים מתקדמים עם מוצרים באיכות גבוהה.",
    rating: 4.8,
    reviewCount: 89,
    coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=400&fit=crop",
    logoUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&h=100&fit=crop",
    city: "תל אביב",
    address: "רחוב בן יהודה 50",
    phone: "03-7654321",
    workingHours: [
      { day: "ראשון - חמישי", hours: "09:00 - 20:00" },
      { day: "שישי", hours: "09:00 - 15:00" },
      { day: "שבת", hours: "סגור" },
    ],
    services: [
      { id: "1", name: "מניקור ג'ל", description: "מניקור עם לק ג'ל עמיד", duration: 60, price: 120, category: "ציפורניים" },
      { id: "2", name: "פדיקור ספא", description: "טיפול פדיקור מפנק כולל עיסוי", duration: 75, price: 150, category: "ציפורניים" },
      { id: "3", name: "טיפול פנים קלאסי", description: "ניקוי והזנה לעור הפנים", duration: 60, price: 200, category: "פנים" },
      { id: "4", name: "איפור ערב", description: "איפור מקצועי לאירועים", duration: 45, price: 250, category: "איפור" },
      { id: "5", name: "עיצוב גבות", description: "עיצוב גבות מקצועי", duration: 30, price: 80, category: "פנים" },
    ],
  },
};

/**
 * Business Landing Page
 * Route: /{tenant}
 * Shows: Hero + Services + CTA
 */
export default async function TenantLandingPage({ params }: TenantPageProps) {
  const { tenant } = await params;

  // Get business data (demo or from DB)
  const business = demoBusinesses[tenant] ?? {
    name: tenant.charAt(0).toUpperCase() + tenant.slice(1).replace(/-/g, " "),
    vertical: "beauty" as const,
    description: "עסק מקצועי עם שירות איכותי ללקוחותינו",
    rating: 4.5,
    reviewCount: 50,
    coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=400&fit=crop",
    logoUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&h=100&fit=crop",
    city: "תל אביב",
    address: "",
    phone: "",
    workingHours: [
      { day: "ראשון - חמישי", hours: "09:00 - 18:00" },
    ],
    services: [
      { id: "1", name: "שירות בסיסי", description: "תיאור השירות", duration: 60, price: 100, category: "כללי" },
    ],
  };

  // Group services by category
  const categories = [...new Set(business.services.map(s => s.category))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80">
        <img
          src={business.coverImage}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Business Info Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-end gap-4">
              <img
                src={business.logoUrl}
                alt={business.name}
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl object-cover"
              />
              <div className="flex-1 text-white mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold">{business.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-white">{business.rating}</span>
                    <span>({business.reviewCount} ביקורות)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{business.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Services */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">אודות</h2>
              <p className="text-gray-600 dark:text-gray-400">{business.description}</p>
            </section>

            {/* Services */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">שירותים</h2>

              {categories.map((category) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">{category}</h3>
                  <div className="space-y-3">
                    {business.services
                      .filter(s => s.category === category)
                      .map((service) => (
                        <Link
                          key={service.id}
                          href={`/${tenant}/book?service=${service.id}`}
                          className="block p-4 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-800 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400">
                                {service.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {service.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {service.duration} דקות
                                </span>
                              </div>
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-900 dark:text-white">₪{service.price}</p>
                              <div className="mt-2 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                הזמן
                                <ChevronLeft className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </section>
          </div>

          {/* Right Column - Info & CTA */}
          <div className="space-y-6">
            {/* Book CTA */}
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-violet-200/50 dark:shadow-violet-900/30">
              <Calendar className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-bold mb-2">הזמן תור עכשיו</h3>
              <p className="text-violet-100 text-sm mb-4">בחר שירות והזמן את התור שלך בקלות</p>
              <Link
                href={`/${tenant}/book`}
                className="block w-full py-3 bg-white text-violet-600 rounded-xl font-semibold text-center hover:bg-violet-50 transition-colors"
              >
                הזמן תור
              </Link>
            </div>

            {/* Contact Info */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white">פרטי התקשרות</h3>

              {business.address && (
                <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p>{business.address}</p>
                    <p>{business.city}</p>
                  </div>
                </div>
              )}

              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-violet-600"
                >
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span dir="ltr">{business.phone}</span>
                </a>
              )}
            </div>

            {/* Working Hours */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                שעות פעילות
              </h3>
              <div className="space-y-2">
                {business.workingHours.map((wh, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{wh.day}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{wh.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Check className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span>אישור מיידי</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Check className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span>תזכורת SMS</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Check className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span>ביטול קל</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 lg:hidden">
        <Link
          href={`/${tenant}/book`}
          className="block w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-bold text-center shadow-lg"
        >
          הזמן תור
        </Link>
      </div>
    </div>
  );
}
