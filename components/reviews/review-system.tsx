"use client";

import { useState } from "react";
import { Star, ThumbsUp, MessageCircle, Send, User, Check, AlertCircle, Loader2 } from "lucide-react";

// Types
interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  rating: number;
  comment: string;
  serviceName?: string;
  createdAt: string;
  helpful: number;
  response?: {
    text: string;
    createdAt: string;
  } | null;
}

interface ReviewSystemProps {
  tenantId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onSubmitReview?: (rating: number, comment: string) => Promise<void>;
  canReview?: boolean;
}

// Star Rating Input Component
function StarRatingInput({
  value,
  onChange,
  size = "md",
  readonly = false,
}: {
  value: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={`flex gap-1 ${readonly ? "" : "cursor-pointer"}`}
      dir="ltr"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          onClick={() => !readonly && onChange?.(star)}
          className={`${readonly ? "" : "hover:scale-110 transition-transform"}`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              (hoverValue || value) >= star
                ? "text-amber-400 fill-amber-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// Rating Distribution Bar
function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 w-4">{stars}</span>
      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-500 w-8 text-left">{count}</span>
    </div>
  );
}

// Single Review Card
function ReviewCard({ review }: { review: Review }) {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);

  const handleHelpful = () => {
    if (!isHelpful) {
      setIsHelpful(true);
      setHelpfulCount((prev) => prev + 1);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          {review.userAvatar ? (
            <img
              src={review.userAvatar}
              alt=""
              className="w-full h-full rounded-xl object-cover"
            />
          ) : (
            <span className="text-gray-500 font-bold">
              {review.userName.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">{review.userName}</span>
            <Check className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRatingInput value={review.rating} readonly size="sm" />
            <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Service badge */}
      {review.serviceName && (
        <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg mb-3">
          {review.serviceName}
        </span>
      )}

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>

      {/* Business Response */}
      {review.response && (
        <div className="mt-3 p-3 bg-gray-50 rounded-xl border-r-4 border-amber-400">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-gray-700">תגובת העסק</span>
          </div>
          <p className="text-sm text-gray-600">{review.response.text}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={handleHelpful}
          disabled={isHelpful}
          className={`flex items-center gap-1.5 text-sm ${
            isHelpful
              ? "text-emerald-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${isHelpful ? "fill-emerald-600" : ""}`} />
          <span>מועיל ({helpfulCount})</span>
        </button>
      </div>
    </div>
  );
}

// Write Review Form
function WriteReviewForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  isSubmitting: boolean;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("יש לבחור דירוג");
      return;
    }

    if (comment.trim().length < 10) {
      setError("יש לכתוב לפחות 10 תווים");
      return;
    }

    try {
      await onSubmit(rating, comment);
      setRating(0);
      setComment("");
    } catch (err) {
      setError("שגיאה בשליחת הביקורת. נסה שוב.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 bg-white rounded-2xl border border-gray-100">
      <h3 className="font-bold text-gray-800 mb-4">שתף את החוויה שלך</h3>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          איך היה?
        </label>
        <StarRatingInput value={rating} onChange={setRating} size="lg" />
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ספר לאחרים על החוויה שלך
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="מה אהבת? מה היה מיוחד? איך השירות?"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{comment.length}/500 תווים</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            שולח...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            פרסם ביקורת
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center mt-3">
        הביקורת שלך תיבדק לפני הפרסום
      </p>
    </form>
  );
}

// Main Review System Component
export function ReviewSystem({
  tenantId,
  reviews,
  averageRating,
  totalReviews,
  onSubmitReview,
  canReview = true,
}: ReviewSystemProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!onSubmitReview) return;

    setIsSubmitting(true);
    try {
      await onSubmitReview(rating, comment);
      setShowWriteReview(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="p-6 bg-white rounded-3xl shadow-sm">
        <div className="flex items-start gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800">
              {averageRating.toFixed(1)}
            </div>
            <StarRatingInput value={Math.round(averageRating)} readonly size="sm" />
            <p className="text-sm text-gray-500 mt-1">
              {totalReviews} ביקורות
            </p>
          </div>

          {/* Distribution */}
          <div className="flex-1 space-y-2">
            {ratingDistribution.map(({ stars, count }) => (
              <RatingBar
                key={stars}
                stars={stars}
                count={count}
                total={totalReviews}
              />
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        {canReview && !showWriteReview && (
          <button
            onClick={() => setShowWriteReview(true)}
            className="w-full mt-6 py-3 px-6 border-2 border-amber-400 text-amber-600 font-bold rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
          >
            <Star className="h-5 w-5" />
            כתוב ביקורת
          </button>
        )}
      </div>

      {/* Write Review Form */}
      {showWriteReview && onSubmitReview && (
        <WriteReviewForm
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-gray-800">
          ביקורות ({totalReviews})
        </h3>
        {reviews.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl text-center">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">אין עדיין ביקורות</p>
            <p className="text-sm text-gray-400 mt-1">היה הראשון לשתף את החוויה שלך!</p>
          </div>
        ) : (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </div>
    </div>
  );
}

// Demo data export for testing
export const DEMO_REVIEWS: Review[] = [
  {
    id: "1",
    userId: "u1",
    userName: "שרה כהן",
    rating: 5,
    comment: "שירות מעולה! הספרית הייתה מקצועית ומאוד קשובה לבקשות שלי. התספורת יצאה בדיוק כמו שרציתי.",
    serviceName: "תספורת נשים",
    createdAt: "2025-02-01",
    helpful: 12,
    response: {
      text: "תודה רבה שרה! שמחים שנהנית. נשמח לראותך שוב!",
      createdAt: "2025-02-02",
    },
  },
  {
    id: "2",
    userId: "u2",
    userName: "דני לוי",
    rating: 4,
    comment: "מקום נחמד, אווירה טובה. הספר מוכשר מאוד. קצת המתנה ארוכה אבל שווה.",
    serviceName: "תספורת גברים",
    createdAt: "2025-01-28",
    helpful: 8,
  },
  {
    id: "3",
    userId: "u3",
    userName: "מיכל אברהם",
    rating: 5,
    comment: "הצביעה יצאה מושלמת! כבר חודשיים והצבע עדיין נראה מעולה. ממליצה בחום!",
    serviceName: "צביעת שיער",
    createdAt: "2025-01-20",
    helpful: 15,
  },
  {
    id: "4",
    userId: "u4",
    userName: "יוסי גולן",
    rating: 5,
    comment: "הגעתי בפעם הראשונה וכבר קבעתי תור נוסף. שירות אדיב, ניקיון, ותוצאה מצוינת.",
    createdAt: "2025-01-15",
    helpful: 6,
  },
];
