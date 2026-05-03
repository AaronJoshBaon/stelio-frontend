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

  console.log(status);

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

  return (
    <div
      className={`bg-dark-700 border border-white/[0.07] rounded-2xl overflow-hidden flex ${
        status === "cancelled" ? "opacity-60" : ""
      }`}
    >
      {/* Image */}
      <img
        src={imageBaseUrl + booking.imageUrl}
        alt={booking.title}
        className={`w-[200px] h-auto object-cover flex-shrink-0 ${
          status === "cancelled" ? "grayscale" : ""
        }`}
      />

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        {/* Top */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-medium text-[15px] text-[#e8e6e1]">
                {booking.title}
              </span>

              {/* Status Badge */}
              <span
                className={`text-[10px] font-semibold px-2.5 py-[4px] rounded-full tracking-wide border ${
                  statusMap[status]?.classes ||
                  "bg-white/10 text-white/80 border-white/20"
                }`}
              >
                {statusMap[status]?.text || status}
              </span>
            </div>

            <div className="text-[12px] text-muted-faint">
              📍 {booking.city} — {booking.address}
            </div>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            <div className="font-serif text-[18px] text-gold">
              ₱{booking.price.toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-faint">{nights} nights</div>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-3 my-3">
          <div className="bg-dark-900 border border-white/[0.07] rounded-lg px-3 py-2 text-center min-w-[80px]">
            <div className="text-[10px] text-muted-faint uppercase">
              Check-in
            </div>
            <div className="text-[13px] font-medium text-[#e8e6e1] mt-0.5">
              {formatDate(booking.start)}
            </div>
          </div>

          <div className="flex-1 flex items-center gap-1">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <div className="text-[10px] text-muted-ghost px-2">
              {nights} nights
            </div>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          <div className="bg-dark-900 border border-white/[0.07] rounded-lg px-3 py-2 text-center min-w-[80px]">
            <div className="text-[10px] text-muted-faint uppercase">
              Check-out
            </div>
            <div className="text-[13px] font-medium text-[#e8e6e1] mt-0.5">
              {formatDate(booking.end)}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {booking.totalGuests && (
              <div className="text-[12px] text-muted-faint">
                👤 {booking.totalGuests} guests
              </div>
            )}

            <div className="w-px h-3 bg-white/[0.1]" />

            <div className="text-[12px] text-muted-faint">
              🛏 {booking.totalBedroom} bedrooms
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {/* View Details */}
            <Link
              className="px-4 py-2 rounded-lg text-[12px] bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20 transition"
              to={`/property/${booking.propertyId}`}
            >
              View Details
            </Link>

            {![
              "REJECTED",
              "EXPIRED",
              "CANCELLED",
              "COMPLETED",
              "INPROGRESS",
            ].includes(status) && (
              <>
                {/* Payment Button */}
                {status === "PENDING_PAYMENT" && (
                  <button
                    onClick={action.paymentModal}
                    className="px-4 py-2 rounded-lg text-[12px] bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20 transition"
                  >
                    Pay Now
                  </button>
                )}
                {/* Cancel Button */}
                <button
                  onClick={action.cancel}
                  disabled={status === "cancelled"}
                  className={`px-4 py-2 rounded-lg text-[12px] border
                ${
                  status === "cancelled"
                    ? "border-white/10 text-muted cursor-not-allowed"
                    : "border-white/10 text-muted hover:bg-red-900/10 hover:border-red-500/30 hover:text-red-400"
                }`}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookingCard;
