"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { MapPin, Search, Star, Clock, Navigation, Loader2 } from "lucide-react";

/**
 * Business type for marketplace display
 */
interface Business {
  id: string;
  slug: string;
  name: string;
  category: string;
  vertical: "fitness" | "beauty";
  rating: number;
  reviewCount: number;
  image: string;
  city: string;
  lat: number;
  lng: number;
  priceRange: string;
  isOpen: boolean;
  tags: string[];
}

/**
 * Demo businesses for the marketplace
 * In production, this will come from Supabase
 */
const demoBusinesses: Business[] = [
  {
    id: "studio-fit",
    slug: "studio-fit",
    name: "Studio Fit",
    category: "כושר",
    vertical: "fitness",
    rating: 4.9,
    reviewCount: 127,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    city: "תל אביב",
    lat: 32.0853,
    lng: 34.7818,
    priceRange: "₪₪",
    isOpen: true,
    tags: ["יוגה", "פילאטיס", "אימון אישי"],
  },
  {
    id: "bella-beauty",
    slug: "bella-beauty",
    name: "Bella Beauty",
    category: "ביוטי",
    vertical: "beauty",
    rating: 4.8,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    city: "תל אביב",
    lat: 32.0731,
    lng: 34.7925,
    priceRange: "₪₪₪",
    isOpen: true,
    tags: ["מניקור", "פדיקור", "טיפולי פנים"],
  },
  {
    id: "power-gym",
    slug: "power-gym",
    name: "Power Gym",
    category: "כושר",
    vertical: "fitness",
    rating: 4.7,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop",
    city: "רמת גן",
    lat: 32.0680,
    lng: 34.8248,
    priceRange: "₪₪",
    isOpen: false,
    tags: ["חדר כושר", "קרוספיט", "אימון קבוצתי"],
  },
  {
    id: "zen-spa",
    slug: "zen-spa",
    name: "Zen Spa",
    category: "ביוטי",
    vertical: "beauty",
    rating: 5.0,
    reviewCount: 56,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    city: "הרצליה",
    lat: 32.1656,
    lng: 34.8467,
    priceRange: "₪₪₪₪",
    isOpen: true,
    tags: ["עיסוי", "ספא", "טיפולי גוף"],
  },
  {
    id: "hair-master",
    slug: "hair-master",
    name: "Hair Master",
    category: "ביוטי",
    vertical: "beauty",
    rating: 4.6,
    reviewCount: 178,
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop",
    city: "תל אביב",
    lat: 32.0789,
    lng: 34.7741,
    priceRange: "₪₪",
    isOpen: true,
    tags: ["תספורת", "צבע", "החלקה"],
  },
  {
    id: "yoga-life",
    slug: "yoga-life",
    name: "Yoga Life",
    category: "כושר",
    vertical: "fitness",
    rating: 4.9,
    reviewCount: 92,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop",
    city: "רעננה",
    lat: 32.1841,
    lng: 34.8708,
    priceRange: "₪₪",
    isOpen: true,
    tags: ["יוגה", "מדיטציה", "נשימה"],
  },
  {
    id: "nails-art",
    slug: "nails-art",
    name: "Nails Art Studio",
    category: "ביוטי",
    vertical: "beauty",
    rating: 4.8,
    reviewCount: 134,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
    city: "גבעתיים",
    lat: 32.0714,
    lng: 34.8102,
    priceRange: "₪₪",
    isOpen: true,
    tags: ["ג׳ל", "אקריל", "נייל ארט"],
  },
  {
    id: "crossfit-tlv",
    slug: "crossfit-tlv",
    name: "CrossFit TLV",
    category: "כושר",
    vertical: "fitness",
    rating: 4.7,
    reviewCount: 167,
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=300&fit=crop",
    city: "תל אביב",
    lat: 32.0654,
    lng: 34.7699,
    priceRange: "₪₪₪",
    isOpen: true,
    tags: ["קרוספיט", "HIIT", "אולימפי"],
  },
  {
    id: "lash-studio",
    slug: "lash-studio",
    name: "Lash & Brow Studio",
    category: "ביוטי",
    vertical: "beauty",
    rating: 4.9,
    reviewCount: 78,
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
    city: "תל אביב",
    lat: 32.0811,
    lng: 34.7867,
    priceRange: "₪₪₪",
    isOpen: false,
    tags: ["ריסים", "גבות", "לאש ליפט"],
  },
  {
    id: "pilates-plus",
    slug: "pilates-plus",
    name: "Pilates Plus",
    category: "כושר",
    vertical: "fitness",
    rating: 4.8,
    reviewCount: 145,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop",
    city: "הרצליה",
    lat: 32.1612,
    lng: 34.8342,
    priceRange: "₪₪₪",
    isOpen: true,
    tags: ["פילאטיס", "רפורמר", "מזרן"],
  },
];

// Filter categories
const categories = [
  { id: "all", label: "הכל" },
  { id: "fitness", label: "כושר" },
  { id: "beauty", label: "ביוטי" },
];

// Sort options
const sortOptions = [
  { id: "distance", label: "מיון לפי מרחק" },
  { id: "rating", label: "מיון לפי דירוג" },
  { id: "reviews", label: "מיון לפי פופולריות" },
];

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance for display
 */
function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} מ׳`;
  }
  return `${km.toFixed(1)} ק״מ`;
}

interface BusinessWithDistance extends Business {
  distance: number;
}

export function BusinessGrid() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("distance");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user location on mount
  useEffect(() => {
    // Default to Tel Aviv center if no location
    setUserLocation({ lat: 32.0853, lng: 34.7818 });

    // Try to get actual location
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoadingLocation(false);
        },
        () => {
          // Keep default location on error
          setIsLoadingLocation(false);
        },
        { timeout: 5000, maximumAge: 60000 }
      );
    }
  }, []);

  // Calculate distances and filter/sort businesses
  const filteredBusinesses = useMemo(() => {
    let businesses: BusinessWithDistance[] = demoBusinesses.map((b) => ({
      ...b,
      distance: userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
        : 0,
    }));

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      businesses = businesses.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.category.toLowerCase().includes(query) ||
          b.tags.some((t) => t.toLowerCase().includes(query)) ||
          b.city.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (activeCategory !== "all") {
      businesses = businesses.filter((b) => b.vertical === activeCategory);
    }

    // Sort
    switch (sortBy) {
      case "distance":
        businesses.sort((a, b) => a.distance - b.distance);
        break;
      case "rating":
        businesses.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        businesses.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return businesses;
  }, [searchQuery, activeCategory, sortBy, userLocation]);

  // Request location permission
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("הדפדפן שלך לא תומך במיקום");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("נא לאשר גישה למיקום בהגדרות הדפדפן");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("לא ניתן לקבל את המיקום");
            break;
          case error.TIMEOUT:
            setLocationError("תם הזמן לקבלת מיקום");
            break;
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="space-y-8">
      {/* Search bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-xl opacity-20" />
        <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 p-2">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חפש עסק, שירות או קטגוריה..."
              className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-lg"
              dir="rtl"
            />
          </div>
          <button
            onClick={requestLocation}
            disabled={isLoadingLocation}
            className="px-4 py-4 text-slate-500 hover:text-amber-500 transition-colors disabled:opacity-50"
            title="קבל מיקום נוכחי"
          >
            {isLoadingLocation ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Navigation className="h-5 w-5" />
            )}
          </button>
          <button className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300">
            חיפוש
          </button>
        </div>
      </div>

      {/* Location error message */}
      {locationError && (
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
            {locationError}
          </p>
        </div>
      )}

      {/* Quick filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === cat.id
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-md"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {activeCategory === "all" ? "פופולריים באזורך" : activeCategory === "fitness" ? "כושר" : "ביוטי"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {filteredBusinesses.length} עסקים נמצאו
          </p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          {sortOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Business grid */}
      {filteredBusinesses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            לא נמצאו עסקים התואמים את החיפוש
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
          >
            נקה חיפוש
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBusinesses.map((business) => (
            <Link
              key={business.id}
              href={`/${business.slug}`}
              className="group bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-slate-800/50 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={business.image}
                  alt={business.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                      business.isOpen
                        ? "bg-emerald-500/90 text-white"
                        : "bg-slate-800/90 text-slate-300"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        business.isOpen ? "bg-white animate-pulse" : "bg-slate-400"
                      }`}
                    />
                    {business.isOpen ? "פתוח עכשיו" : "סגור"}
                  </span>
                </div>

                {/* Category badge */}
                <div className="absolute bottom-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                      business.vertical === "fitness"
                        ? "bg-blue-500/90 text-white"
                        : "bg-rose-500/90 text-white"
                    }`}
                  >
                    {business.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {business.name}
                  </h3>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    {business.priceRange}
                  </span>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {business.rating}
                    </span>
                  </div>
                  <span className="text-slate-400">•</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {business.reviewCount} ביקורות
                  </span>
                </div>

                {/* Location & Distance */}
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{business.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDistance(business.distance)}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {business.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
