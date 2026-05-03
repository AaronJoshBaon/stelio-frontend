import { memo, useState } from "react";

import type { BookingCard } from "../../pages/bookings/BookingTypes";
import {
  useStripe,
  useElements,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";

interface PaymentModalProps {
  booking: BookingCard;
  clientSecret: string;
  action: {
    onPaymentSuccess: () => void;
    coupon: (coupon: string) => void;
    onClose: () => void;
  };
}

const PaymentModal = ({ booking, clientSecret, action }: PaymentModalProps) => {
  const imageBaseUrl = import.meta.env.VITE_CLOUD_PUBLIC_KEY + "/";
  const stripe = useStripe();
  const elements = useElements();

  const [cardName, setCardName] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [isPaymentInprogress, setIsPaymentInprogress] =
    useState<boolean>(false);

  const startDate = new Date(booking.start);
  const endDate = new Date(booking.end);

  const toMonthStr = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1] || "Invalid month";
  };

  const formatPHP = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

  const totalNights = endDate.getDate() - startDate.getDate();
  const totalPrice = Math.max(0, booking.price * totalNights);

  const handleElementChange = (event: any) => {
    if (event.brand) {
      setBrand(event.brand);
    }
  };

  const handlePay = async () => {
    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      console.error("Stripe Element not found");
      return;
    }

    setIsPaymentInprogress(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: {
          name: cardName,
        },
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else if (result.paymentIntent?.status === "succeeded") {
      action.onPaymentSuccess();
      setIsPaymentInprogress(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={(e) => e.target === e.currentTarget && action.onClose()}
    >
      <div
        className="w-full max-h-[90vh] max-w-[35vw] bg-dark-700 border border-white/10 rounded-l-lg overflow-y-auto"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2
                className="text-[20px] font-medium text-[#e8e6e1] leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Payment Details
              </h2>
              <p className="text-[12px] text-muted-faint mt-1">
                Complete your reservation to confirm
              </p>
            </div>
            <button
              onClick={action.onClose}
              className="w-[30px] h-[30px] rounded-full bg-white/[0.07] border border-white/10 text-muted-dim text-[13px] flex items-center justify-center cursor-pointer hover:bg-white/[0.12] hover:text-[#e8e6e1] transition-all flex-shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Payment status */}
          <div className="flex items-center justify-between bg-dark-900 border border-white/[0.07] rounded-xl px-4 py-3 mb-3">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full bg-gold flex-shrink-0"
                style={{ animation: "statusPulse 2s ease-in-out infinite" }}
              />
              <span className="text-[11px] font-semibold text-gold uppercase tracking-[0.05em]">
                {booking.status}
              </span>
            </div>
          </div>

          {/* Booking info */}
          <div className="bg-dark-900 border border-white/[0.07] rounded-xl p-4 mb-4 flex gap-4 items-start">
            <div className="w-[25%] min-w-[80px] aspect-square rounded-[10px] bg-dark-600 flex-shrink-0 overflow-hidden">
              <img
                src={imageBaseUrl + booking.imageUrl}
                alt={booking.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between text-[13px] text-white my-auto gap-1">
              <div>
                <span className="text-muted-faint">Property:</span>{" "}
                <span className="font-medium">{booking.title}</span>
              </div>
              <div>
                <span className="text-muted-faint">Dates:</span>{" "}
                <span className="font-medium">
                  {toMonthStr(startDate.getMonth() + 1)} {startDate.getDate()} –{" "}
                  {toMonthStr(endDate.getMonth() + 1)} {endDate.getDate()}
                </span>
              </div>
              <div>
                <span className="text-muted-faint">Guests:</span>{" "}
                <span className="font-medium">{booking.totalGuests}</span>
              </div>
              <div>
                <span className="text-muted-faint">Contact:</span>{" "}
                <span className="font-medium">{booking.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-dark-900 border border-white/[0.07] rounded-xl px-4 py-4 mb-5">
            <div className="flex justify-between text-[13px] py-1">
              <span className="text-muted-dim">Property Rate</span>
              <span className="text-[#e8e6e1]">{formatPHP(booking.price)}</span>
            </div>
            <div className="border-t border-white/[0.06] mt-2 pt-3 flex items-center justify-between">
              <span className="text-[14px] font-medium text-[#e8e6e1]">
                Total due
              </span>
              <span
                className="text-[22px] text-gold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {formatPHP(totalPrice)}
              </span>
            </div>
          </div>

          {/* ── Card payment form ── */}
          <div className="bg-dark-900 border border-white/[0.07] rounded-xl p-4 mb-5">
            {/* Method label */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold text-muted-dim uppercase tracking-[0.08em]">
                Pay with card
              </span>
              <div className="flex items-center gap-1.5">
                {/* Visa */}
                <span
                  className="px-2 py-0.5 rounded bg-white/[0.07] border border-white/[0.08] text-[9px] font-bold tracking-wider text-[#e8e6e1]"
                  style={{ opacity: brand === "visa" || !brand ? 1 : 0.35 }}
                >
                  VISA
                </span>
                {/* Mastercard */}
                <span
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.07] border border-white/[0.08]"
                  style={{ opacity: brand === "mc" || !brand ? 1 : 0.35 }}
                >
                  <span className="w-3 h-3 rounded-full bg-red-500 opacity-90 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 opacity-90 -ml-1.5 inline-block" />
                </span>
                {/* Amex */}
                <span
                  className="px-2 py-0.5 rounded bg-white/[0.07] border border-white/[0.08] text-[9px] font-bold tracking-wider text-blue-400"
                  style={{ opacity: brand === "amex" || !brand ? 1 : 0.35 }}
                >
                  AMEX
                </span>
              </div>
            </div>

            {/* Card number */}
            <div className="mb-3">
              <label className="block text-[11px] text-muted-dim mb-1.5 tracking-wide">
                Card number
              </label>
              <CardNumberElement
                onChange={handleElementChange}
                className="w-full bg-dark-700 border rounded-xl px-4 py-3 text-[14px] text-[#e8e6e1] placeholder:text-white/20 outline-none transition-all pr-16"
                options={{
                  style: {
                    base: {
                      fontFamily: "'DM Mono', monospace",
                      letterSpacing: "0.08em",
                      color: "#e8e6e1",
                      "::placeholder": {
                        color: "rgba(255,255,255,0.2)",
                      },
                    },
                  },
                  disableLink: true,
                }}
              />
            </div>

            {/* Name on card */}
            <div className="mb-3">
              <label className="block text-[11px] text-muted-dim mb-1.5 tracking-wide">
                Name on card
              </label>
              <input
                type="text"
                placeholder="Alex Reyes"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                className="w-full bg-dark-700 border rounded-xl px-4 py-3 text-[14px] text-[#e8e6e1] placeholder:text-white/20 outline-none transition-all"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.05em",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(201,169,110,0.5)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-muted-dim mb-1.5 tracking-wide">
                  Expiry date
                </label>
                <CardExpiryElement
                  className="w-full bg-dark-700 border rounded-xl px-4 py-3 text-[14px] text-[#e8e6e1] placeholder:text-white/20 outline-none transition-all"
                  options={{
                    style: {
                      base: {
                        fontFamily: "'DM Mono', monospace",
                        letterSpacing: "0.08em",
                        color: "#e8e6e1",
                        "::placeholder": {
                          color: "rgba(255,255,255,0.2)",
                        },
                      },
                    },
                  }}
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted-dim mb-1.5 tracking-wide">
                  CVV
                </label>
                <CardCvcElement
                  className="w-full bg-dark-700 border rounded-xl px-4 py-3 text-[14px] text-[#e8e6e1] placeholder:text-white/20 outline-none transition-all pr-10"
                  options={{
                    style: {
                      base: {
                        fontFamily: "'DM Mono', monospace",
                        letterSpacing: "0.1em",
                        color: "#e8e6e1",
                        "::placeholder": {
                          color: "rgba(255,255,255,0.2)",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Secure note */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.06]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-dim flex-shrink-0"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span className="text-[11px] text-muted-faint">
                Your payment info is encrypted and never stored
              </span>
            </div>
          </div>

          {/* Pay button */}
          <button
            className="w-full bg-gold text-dark-900 border-none rounded-xl py-[14px] text-[14px] font-semibold cursor-pointer hover:bg-gold-light transition-colors flex items-center justify-center gap-2"
            onClick={handlePay}
            disabled={isPaymentInprogress}
          >
            {isPaymentInprogress ? "In-progress..." : "Pay"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};

export default memo(PaymentModal);
