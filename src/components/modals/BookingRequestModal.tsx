import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import "../../styles/components/bookingRequestModal.css";
import type { PropertyTypesView } from "../../pages/property/Propertytypes";
import { useUserData } from "../../context/UserContext";
import { type Booking } from "../../pages/bookings/BookingTypes";

const BookingRequestModal = ({
  data,
  action,
}: {
  data: {
    property: PropertyTypesView;
    booking: Booking;
  };
  action: {
    handleRequestBooking: () => void;
    updateBooking: (booking: Booking) => void;
    onClose: () => void;
  };
}) => {
  const { userData } = useUserData();

  const [emptyGuestName, setEmptyGuestName] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [requestingBooking, setRequestingBooking] = useState<boolean>(false);

  const handleAddGuest = () => {
    const hasEmpty = data.booking.guestNames?.some((guest, index) => {
      if (guest.trim() === "") {
        setEmptyGuestName(index);
        return true;
      }
    });

    if (hasEmpty) return;

    action.updateBooking({
      ...data.booking,
      guestNames: [...(data.booking.guestNames || []), ""],
    });
  };

  const toMonthStr: (month: number) => string = (month) => {
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

  const formatPHP = (amount: number) => {
    const formatter = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    });

    return formatter.format(amount);
  };

  const handleValidation = () => {
    if (
      !data.booking.contactPhone ||
      data.booking.contactPhone.trim().length <= 0
    ) {
      setError("contact");
      return;
    }

    setRequestingBooking(true);
    action.handleRequestBooking();
  };

  const handleContactInput = (contact: string) => {
    // Always propagate the value (including empty) so the controlled input
    // can be cleared; only clear the error once there's actual input.
    if (error === "contact" && contact.trim() !== "") setError("");

    action.updateBooking({ ...data.booking, contactPhone: contact });
  };

  const duration = Math.ceil(
    (data.booking.end.getTime() - data.booking.start.getTime()) /
      (1000 * 3600 * 24),
  );

  useEffect(() => {
    action.updateBooking({
      ...data.booking,
      guestNames: [userData.name],
    });
  }, []);

  return (
    <div
      className={`s-modal-bg flex animate-fadeIn absolute inset-0 bg-black/70 items-center justify-center z-[200] ${
        isClosing ? "booking-modal-exit" : ""
      }`}
      onClick={action.onClose}
    >
      <div
        className="m-auto animate-scaleIn bg-dark-800 border border-white/[0.1] rounded-2xl w-[520px] max-w-[92%] relative overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header with gold accent bar */}
        <div className="h-[3px] w-full bg-gradient-to-r from-gold to-gold-dark"></div>

        <div className="p-4 sm:p-6">
          {/* Title row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-serif text-[20px] text-[#e8e6e1] leading-tight">
                Booking Summary
              </div>
              <div className="text-[12px] text-muted-faint mt-0.5">
                Review your stay details before confirming
              </div>
            </div>
            <button
              onClick={() => {
                setIsClosing(true);
                action.onClose();
              }}
              aria-label="Close modal"
              className="hover-scale w-11 h-11 rounded-full bg-white/[0.07] border border-white/[0.1] text-muted-faint cursor-pointer flex items-center justify-center text-[13px] hover:bg-white/[0.12] hover:text-[#e8e6e1] transition-all flex-shrink-0"
            >
              <IoMdClose />
            </button>
          </div>

          {/* Property summary card */}
          <div className="animate-fadeInUp bg-dark-900 border border-white/[0.07] rounded-xl p-4 mb-5 flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=80&h=80&fit=crop"
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium text-[#e8e6e1] truncate">
                {data.property.title}
              </div>
              <div className="text-[12px] text-muted-faint mt-0.5">
                📍 {data.property.address}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[13px] font-semibold text-gold">
                {formatPHP(data.property.price)}
              </div>
              <div className="text-[11px] text-muted-faint">per night</div>
            </div>
          </div>

          {/* Stay duration row */}
          <div className="stagger-children grid grid-cols-3 gap-3 mb-5">
            <div className="bg-dark-900 border border-white/[0.07] rounded-xl p-3 col-span-1">
              <div className="text-[10px] text-muted-faint uppercase tracking-widest mb-1">
                Check-in
              </div>
              <div className="text-[13px] font-medium text-[#e8e6e1]">
                {toMonthStr(data.booking.start.getMonth() + 1)}{" "}
                {data.booking.start.getDate()}
              </div>
              <div className="text-[11px] text-muted-faint">
                {data.booking.start.getFullYear()}
              </div>
            </div>
            <div className="bg-dark-900 border border-white/[0.07] rounded-xl p-3 col-span-1 flex flex-col items-center justify-center">
              <div className="text-[11px] text-muted-faint mb-1">Duration</div>
              <div className="text-[18px] font-semibold text-gold leading-none">
                {duration}
              </div>
              <div className="text-[11px] text-muted-faint mt-0.5">nights</div>
            </div>
            <div className="bg-dark-900 border border-white/[0.07] rounded-xl p-3 col-span-1">
              <div className="text-[10px] text-muted-faint uppercase tracking-widest mb-1">
                Check-out
              </div>
              <div className="text-[13px] font-medium text-[#e8e6e1]">
                {toMonthStr(data.booking.end.getMonth() + 1)}{" "}
                {data.booking.end.getDate()}
              </div>
              <div className="text-[11px] text-muted-faint">
                {data.booking.end.getFullYear()}
              </div>
            </div>
          </div>

          {/* Contact number */}
          <div className="mb-4">
            <label className="block text-[11px] text-muted-dim uppercase tracking-[0.07em] mb-2">
              Contact Number
            </label>
            {error === "contact" && (
              <p className="text-red-400 text-[11px]">Phone Number is required</p>
            )}
            <input
              className={`s-input w-full bg-dark-900 border rounded-xl px-4 py-3 text-[#e8e6e1] text-[13px] font-sans transition-colors ${
                error === "contact" ? "border-red-500" : "border-white/[0.1]"
              }`}
              placeholder="09XX XXX XXXX"
              type="tel"
              pattern="09\d{2} \d{3} \d{4}"
              onChange={(e) => handleContactInput(e.target.value)}
              value={data.booking.contactPhone ?? ""}
            />
          </div>

          {/* Guests */}
          <div className="mb-5">
            <label className="block text-[11px] text-muted-dim uppercase tracking-[0.07em] mb-2">
              Guests
            </label>
            <div className="flex flex-wrap gap-2">
              {data.booking.guestNames?.map((guest, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 bg-dark-900 border border-white/[0.08] rounded-[20px] py-1.5 pr-3 pl-1.5 text-[12px] text-muted ${
                    index === emptyGuestName ? "border-red-500" : ""
                  }`}
                >
                  <span>{guest}</span>
                  <span
                    className="text-muted-ghost cursor-pointer hover:text-muted-faint ml-0.5 text-[11px]"
                    onClick={() => {
                      // Removing a guest clears the empty-guest lock so the
                      // "Add guest" button can't stay permanently disabled.
                      setEmptyGuestName(null);
                      action.updateBooking({
                        ...data.booking,
                        guestNames: data.booking.guestNames
                          ? data.booking.guestNames.filter(
                              (_, i) => i !== index,
                            )
                          : null,
                      });
                    }}
                  >
                    <IoMdClose />
                  </span>
                </div>
              ))}
              <button
                onClick={handleAddGuest}
                className="flex items-center gap-1.5 border border-dashed border-white/[0.15] rounded-[20px] px-3 py-1.5 text-[12px] text-muted-faint cursor-pointer bg-transparent font-sans hover:border-gold/40 hover:text-gold transition-all"
                disabled={emptyGuestName !== null}
              >
                + Add guest
              </button>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="stagger-children space-y-2 mb-4">
            <div className="flex justify-between text-[13px]">
              <span className="text-muted-faint">
                {formatPHP(data.property.price)} ×{" "}
                {Math.ceil(
                  (data.booking.end.getTime() - data.booking.start.getTime()) /
                    (1000 * 3600 * 24),
                )}
                {" nights"}
              </span>
              <span className="text-[#e8e6e1]">
                {formatPHP(data.property.price * duration)}
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-muted-faint">Service fee</span>
              <span className="text-[#e8e6e1]">₱0</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-dark-900 border border-white/[0.07] rounded-xl px-4 py-3 mb-5">
            <span className="text-[14px] font-medium text-[#e8e6e1]">
              Total
            </span>
            <span className="font-serif text-[22px] text-gold">
              {formatPHP(data.property.price * duration)}
            </span>
          </div>

          {/* CTA */}
          <button
            className="relative overflow-hidden shine btn-press w-full bg-gold text-dark-900 border-none rounded-xl py-[14px] text-[14px] font-semibold cursor-pointer hover:bg-gold-light transition-colors tracking-wide"
            onClick={handleValidation}
            disabled={
              error.trim() !== "" ||
              emptyGuestName !== null ||
              requestingBooking
            }
          >
            {requestingBooking ? "Booking In-progress" : "Confirm Booking"}
          </button>
          <p className="text-center text-[11px] text-muted-ghost mt-3">
            You won't be charged yet · Free cancellation for 24h
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingRequestModal;
