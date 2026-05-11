import { useCallback, useEffect, useState } from "react";

import MyBookingCard from "../../components/booking/MyBookingCard";
import PaymentModal from "../../components/modals/PaymentModal";
import ToastNotif from "../../components/modals/ToastNotif";
import type { BookingCard } from "./BookingTypes";
import { cancelBooking, getMyBookings } from "../../api/bookProperty";
import { requestPaymentIntent } from "../../api/payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useUserData } from "../../context/UserContext";
import { useWebSocket } from "../../hooks/useWebSocket";

const MyBookings = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);

  const { userData } = useUserData();
  const { payload } = useWebSocket("my-bookings");

  const [bookings, setBookings] = useState<BookingCard[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    show: Boolean;
    message: string;
  }>({ show: false, message: "" });
  const [selectedBooking, setSelectedBooking] = useState<BookingCard | null>(
    null,
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [idempotencyKeyStorage, setIdempotencyKeyStorage] = useState<
    string | null
  >(null);

  const handleCancelBooking = async (bookingId: String) => {
    const res = await cancelBooking(bookingId);

    if (res.success) {
      fetchBookings();
      setNotification({ show: true, message: res.message });
    }
  };

  const onPaymentSuccess = async () => {
    setSelectedBooking(null);
    setShowPaymentModal(!showPaymentModal);
    setNotification({ show: true, message: "Payment successful!" });
    setIdempotencyKeyStorage(null);
    if (idempotencyKeyStorage) localStorage.removeItem(idempotencyKeyStorage);
  };

  const fetchBookings = async () => {
    const res = await getMyBookings();

    if (res.success) {
      setBookings(res.bookings);
    }
  };

  const handlePaymentModal = async (booking: BookingCard) => {
    const storageKey = `payment:${booking.id}:${userData.id}:pay`;
    setIdempotencyKeyStorage(storageKey);
    const res = await requestPaymentIntent(booking.id, storageKey);

    if (res?.success) {
      setClientSecret(res.clientSecret);
      setSelectedBooking(booking);
      setShowPaymentModal(true);
    }
  };

  const handleCoupon = useCallback(
    () => (coupon: string) => {
      if (!selectedBooking) return;

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking.id ? { ...booking, coupon } : booking,
        ),
      );
    },
    [selectedBooking],
  );

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!payload) return;

    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === payload.id
          ? { ...booking, status: payload.status }
          : booking,
      ),
    );
  }, [payload]);

  // const isCompleted = (b: Booking) => new Date(b.end) < new Date();
  // const total = bookings.length;

  // const upcoming = bookings.filter(
  //   (b) => b.status === "CONFIRMED" && !isCompleted(b),
  // ).length;

  // const nights = bookings.reduce((acc, b) => {
  //   return (
  //     acc +
  //     Math.ceil(
  //       (new Date(b.end).getTime() - new Date(b.start).getTime()) /
  //         (1000 * 60 * 60 * 24),
  //     )
  //   );
  // }, 0);

  // const totalSpent = bookings.reduce((acc, b) => acc + b.price, 0);

  return (
    <div className="s-screen bg-dark-800 min-h-[520px]">
      <div className="p-8">
        {/* Toast */}
        {notification.show && (
          <ToastNotif
            message={notification.message}
            onClose={() => setNotification({ show: false, message: "" })}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-[24px] text-[#e8e6e1]">
              My Bookings
            </h1>
            <p className="text-[13px] text-muted-faint mt-0.5">
              Track and manage all your reservations
            </p>
          </div>

          <div className="flex gap-2">
            <button className="s-chip active px-[14px] py-[6px] rounded-[20px] border border-white/[0.12] text-[12px] text-muted bg-transparent hover:bg-gold/15 hover:border-gold hover:text-gold transition-all">
              All
            </button>
            <button className="s-chip px-[14px] py-[6px] rounded-[20px] border border-white/[0.12] text-[12px] text-muted bg-transparent hover:bg-gold/15 hover:border-gold hover:text-gold transition-all">
              Upcoming
            </button>
            <button className="s-chip px-[14px] py-[6px] rounded-[20px] border border-white/[0.12] text-[12px] text-muted bg-transparent hover:bg-gold/15 hover:border-gold hover:text-gold transition-all">
              Completed
            </button>
            <button className="s-chip px-[14px] py-[6px] rounded-[20px] border border-white/[0.12] text-[12px] text-muted bg-transparent hover:bg-gold/15 hover:border-gold hover:text-gold transition-all">
              Cancelled
            </button>
          </div>
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-dark-700 border border-white/[0.07] rounded-xl p-4">
            <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
              Total Stays
            </div>
            <div className="font-serif text-[28px] text-[#e8e6e1] leading-none">
              {total}
            </div>
            <div className="text-[11px] text-muted-ghost mt-1">All time</div>
          </div>

          <div className="bg-dark-700 border border-white/[0.07] rounded-xl p-4">
            <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
              Upcoming
            </div>
            <div className="font-serif text-[28px] text-gold leading-none">
              {upcoming}
            </div>
            <div className="text-[11px] text-muted-ghost mt-1">Confirmed</div>
          </div>

          <div className="bg-dark-700 border border-white/[0.07] rounded-xl p-4">
            <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
              Nights Stayed
            </div>
            <div className="font-serif text-[28px] text-[#e8e6e1] leading-none">
              {nights}
            </div>
            <div className="text-[11px] text-muted-ghost mt-1">
              All bookings
            </div>
          </div>

          <div className="bg-dark-700 border border-white/[0.07] rounded-xl p-4">
            <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
              Total Spent
            </div>
            <div className="font-serif text-[28px] text-[#e8e6e1] leading-none">
              ₱{totalSpent.toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-ghost mt-1">All time</div>
          </div>
        </div> */}

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {bookings.length > 0 ? (
            bookings.map((book) => (
              <MyBookingCard
                key={book.id}
                booking={book}
                action={{
                  cancel: () => handleCancelBooking(book.id),
                  paymentModal: () => handlePaymentModal(book),
                }}
              />
            ))
          ) : (
            <div className="text-center py-20 text-muted-faint">
              No Bookings
            </div>
          )}
        </div>

        {/* Modal */}
        {showPaymentModal && selectedBooking && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentModal
              booking={selectedBooking}
              clientSecret={clientSecret}
              action={{
                onPaymentSuccess: onPaymentSuccess,
                coupon: handleCoupon(),
                onClose: () => {
                  setShowPaymentModal(false);
                  setSelectedBooking(null);
                },
              }}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
