import { Link } from "react-router-dom";
import type { BookingCard } from "../../pages/bookings/BookingTypes";

const MyBookingCard = ({
  booking,
  action,
}: {
  booking: BookingCard;
  action: { cancel: () => void; paymentModal: () => void };
}) => {
  const imageBaseUrl = import.meta.env.VITE_CLOUD_PUBLIC_KEY + "/";
  const status = booking.status.toUpperCase();

  const statusMap: Record<string, { text: string; classes: string }> = {
    CANCELLED: {
      text: "CANCELLED",
      classes: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    PENDING_PAYMENT: {
      text: "AWAITING PAYMENT",
      classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    PENDING_APPROVAL: {
      text: "PENDING APPROVAL",
      classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    CONFIRMED: {
      text: "CONFIRMED",
      classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    REJECTED: {
      text: "REJECTED",
      classes: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    NOSHOW: {
      text: "NO SHOW",
      classes: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    COMPLETED: {
      text: "COMPLETED",
      classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    EXPIRED: {
      text: "EXPIRED",
      classes: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    INPROGRESS: {
      text: "IN PROGRESS",
      classes: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const nights = Math.ceil(
    (new Date(booking.end).getTime() - new Date(booking.start).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const canManage = ![
    "REJECTED",
    "EXPIRED",
    "CANCELLED",
    "COMPLETED",
    "INPROGRESS",
  ].includes(status);

  return (
    <div
      className={`group bg-dark-700 border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col sm:flex-row card-interactive transition-colors hover:border-white/[0.14] ${
        status === "CANCELLED" ? "opacity-60" : ""
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden flex-shrink-0 w-full h-44 sm:w-[210px] sm:h-auto sm:self-stretch">
        <img
          src={imageBaseUrl + booking.imageUrl}
          alt={booking.title}
          className={`w-full h-full object-cover zoom-img ${
            status === "CANCELLED" ? "grayscale" : ""
          }`}
        />
        {/* Status badge overlay */}
        <span
          className={`absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-[4px] rounded-full tracking-wide border backdrop-blur-sm animate-scaleIn ${
            statusMap[status]?.classes ||
            "bg-black/40 text-white/80 border-white/20"
          }`}
        >
          {statusMap[status]?.text || status}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0 gap-3">
        {/* Top */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-medium text-[15px] text-primary truncate">
              {booking.title}
            </h3>
            <div className="text-[12px] text-muted-faint truncate mt-0.5">
              📍 {booking.city} — {booking.address}
            </div>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            <div className="font-serif text-[18px] text-gold leading-none">
              ₱{booking.price.toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-faint mt-1">/ night</div>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 min-w-0 bg-dark-900 border border-white/[0.07] rounded-lg px-3 py-2 text-center">
            <div className="text-[10px] text-muted-faint uppercase tracking-wide">
              Check-in
            </div>
            <div className="text-[13px] font-medium text-primary mt-0.5 truncate">
              {formatDate(booking.start)}
            </div>
          </div>

          <div className="flex flex-col items-center text-muted-ghost flex-shrink-0 px-0.5">
            <span className="text-[10px] leading-none">{nights}n</span>
            <span className="text-[15px] leading-none mt-0.5">→</span>
          </div>

          <div className="flex-1 min-w-0 bg-dark-900 border border-white/[0.07] rounded-lg px-3 py-2 text-center">
            <div className="text-[10px] text-muted-faint uppercase tracking-wide">
              Check-out
            </div>
            <div className="text-[13px] font-medium text-primary mt-0.5 truncate">
              {formatDate(booking.end)}
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[12px] text-muted-faint">
          {booking.totalGuests && <span>👤 {booking.totalGuests} guests</span>}
          <span className="w-px h-3 bg-white/[0.1]" />
          <span>🛏 {booking.totalBedroom} bedrooms</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-1">
          {/* View Details */}
          <Link
            className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg text-[12px] border border-white/10 text-muted hover:bg-white/[0.05] hover:text-primary transition btn-press"
            to={`/property/${booking.propertyId}`}
          >
            View Details
          </Link>

          {canManage && (
            <>
              {/* Payment Button — primary CTA */}
              {status === "PENDING_PAYMENT" && (
                <button
                  onClick={action.paymentModal}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-lg text-[12px] font-semibold bg-gold text-dark-900 hover:bg-gold-light transition btn-press shine relative overflow-hidden"
                >
                  Pay Now
                </button>
              )}
              {/* Cancel Button */}
              <button
                onClick={action.cancel}
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-[12px] border border-white/10 text-muted hover:bg-red-900/10 hover:border-red-500/30 hover:text-red-400 transition btn-press"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookingCard;
