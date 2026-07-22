import { getPropertyById } from "../../api/property";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  type PropertyBookings,
  type PropertyImagesView,
  type PropertyTypesView,
  PropertyTypesViewDefaultData,
} from "../../pages/property/Propertytypes";

import PropertySlider from "../../components/property/PropertySlider";
import ToastNotif from "../../components/modals/ToastNotif";
import { bookProperty, reserveProperty } from "../../api/bookProperty";
import BookingRequestModal from "../../components/modals/BookingRequestModal";
import { defaultBooking, type Booking } from "../bookings/BookingTypes";
import DatePicker from "react-datepicker";

const PropertyView = () => {
  const location = useLocation();

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<PropertyTypesView>(
    PropertyTypesViewDefaultData,
  );
  const [images, setImages] = useState<PropertyImagesView[]>([]);
  const [unavailableBookingDates, setUnAvailableBookingDates] = useState<
    PropertyBookings[]
  >([]);
  const [booking, setBooking] = useState<Booking>(defaultBooking);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [requestBookingModal, setRequestBookingModal] =
    useState<boolean>(false);
  const [reserveBookingModal, setReserveBookingModal] =
    useState<boolean>(false);

  const bookingIntervals = unavailableBookingDates.map((b) => ({
    start: new Date(new Date(b.start).setDate(new Date(b.start).getDate() - 1)),
    end: new Date(new Date(b.end).setDate(new Date(b.end).getDate())),
  }));

  const onBook = async () => {
    if (!id) {
      return;
    }

    const res = await bookProperty(id, booking);

    setRequestBookingModal(!requestBookingModal);
    setModalMessage(res.message);
    setShowModal(true);
  };

  const onReserve = async () => {
    if (!id) {
      return;
    }
    const res = await reserveProperty(id, booking);

    setRequestBookingModal(!requestBookingModal);
    setModalMessage(res.message);
    setShowModal(true);
  };

  useEffect(() => {
    const bookingDateRange = location.state?.bookingDateRange;

    if (bookingDateRange?.start) {
      setBooking((prev) => ({ ...prev, start: bookingDateRange.start }));
    }

    if (bookingDateRange?.end) {
      setBooking((prev) => ({ ...prev, end: bookingDateRange.end }));
    }

    const fetchProperty = async () => {
      try {
        if (!id) throw new Error("Missing property ID");
        const res = await getPropertyById(id);
        if (res.success) {
          setProperty(res.property);
          setImages(res.images);
          setUnAvailableBookingDates(res.bookings);
        }
      } catch (e) {
        console.error("Failed to fetch property:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Calculate the total price based on the selected dates
  const calculateTotalPrice = () => {
    if (booking.start && booking.end) {
      const daysDifference = Math.ceil(
        (booking.end.getTime() - booking.start.getTime()) / (1000 * 3600 * 24),
      );
      return property.price * daysDifference;
    }
    return 0;
  };

  if (loading) {
    return (
      <div
        className="s-screen bg-dark-800 min-h-[520px] relative p-4 sm:p-8"
        id="sc-detail"
      >
        <h2 className="font-serif text-[20px] text-primary">
          Loading property details
          <span className="typing-dots"><span></span><span></span><span></span></span>
        </h2>
      </div>
    );
  }

  return (
    <div className="s-screen bg-dark-800 min-h-[520px] relative page-enter" id="sc-detail">
      <div className="relative w-full h-[320px] bg-dark-700 overflow-hidden">
        <PropertySlider images={images} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 px-4 sm:px-8 py-6">
        {/* Left: Property details */}
        <div>
          <h1 className="font-serif text-[26px] font-medium text-primary mb-1 text-gradient-gold">
            {property.title}
          </h1>
          <div className="text-[13px] text-muted-faint mb-4 flex items-center gap-1">
            📍 {property.address} · ★ 4.9 (24 reviews)
          </div>
          <div className="flex gap-5 mb-5 flex-wrap animate-fadeInUp">
            <div className="flex items-center gap-1.5 text-[13px] text-muted">
              👤 {property.maxGuest}{" "}
              {property.maxGuest > 1 ? "guests" : "guest"}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-muted">
              🛏 {property.totalBedroom}{" "}
              {property.totalBedroom > 1 ? "bedrooms" : "bedroom"}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-muted">
              🛏 {property.totalBed} {property.totalBed > 1 ? "beds" : "bed"}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-muted">
              🚿 {property.totalBath}{" "}
              {property.totalBath > 1 ? "baths" : "bath"}
            </div>
          </div>
          <hr className="border-none border-t border-white/[0.07] my-4" />
          <p className="text-[14px] text-muted-dim leading-[1.7]">
            {property.description}
          </p>
        </div>

        {/* Right: Schedule and Booking */}
        <div className="bg-dark-700 border border-white/[0.09] rounded-[14px] p-5 lg:sticky lg:top-20 glass animate-fadeInRight">
          <div className="font-serif text-[22px] text-primary mb-1">
            ₱{property.price}{" "}
            <span className="text-[13px] font-sans text-muted-faint font-normal">
              / night
            </span>
          </div>

          <div className="grid grid-cols-2 border border-white/[0.12] rounded-[10px] overflow-hidden my-[14px]">
            <div className="px-[14px] py-[10px] border-r border-white/[0.12]">
              <label className="text-[10px] text-muted-faint uppercase tracking-[0.06em] mb-1">
                Check-in
              </label>
              <DatePicker
                selected={booking.start}
                onChange={(date) => {
                  if (!date) return;
                  setBooking((prev) => ({ ...prev, start: date }));
                }}
                selectsStart
                startDate={booking.start}
                endDate={booking.end}
                excludeDateIntervals={bookingIntervals}
                minDate={new Date()}
                maxDate={booking.end}
                placeholderText="Select date"
                dateFormat="MMM d, yyyy"
                className="text-[13px] text-primary outline-none cursor-pointer"
              />
            </div>

            <div className="px-[14px] py-[10px] border-r border-white/[0.12]">
              <label className="text-[10px] text-muted-faint uppercase tracking-[0.06em] mb-1">
                Checkout
              </label>
              <DatePicker
                selected={booking.end}
                onChange={(date) => {
                  if (!date) return;
                  setBooking((prev) => ({ ...prev, end: date }));
                }}
                selectsEnd
                startDate={booking.start}
                endDate={booking.end}
                excludeDateIntervals={bookingIntervals}
                minDate={booking.start || new Date()}
                placeholderText="Select date"
                dateFormat="MMM d, yyyy"
                className="text-[13px] text-primary outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="flex justify-between py-[10px] border-t border-white/[0.07] mt-2 text-[13px]">
            <span className="text-muted-faint">
              ₱{property.price} ×{" "}
              {booking.end && booking.start
                ? Math.ceil(
                    (booking.end.getTime() - booking.start.getTime()) /
                      (1000 * 3600 * 24),
                  )
                : 0}{" "}
              nights
            </span>
            <span className="text-primary font-medium">
              ₱{calculateTotalPrice().toLocaleString("en-PH")}
            </span>
          </div>
          <div className="flex justify-between py-[10px] border-t border-white/[0.07] text-[13px]">
            <span className="text-muted-faint">Total</span>
            <span className="text-gold font-semibold">
              ₱{calculateTotalPrice().toLocaleString("en-PH")}
            </span>
          </div>

          {/* Rent and Reserve Buttons */}
          <button
            className="w-full bg-gold text-dark-900 border-none rounded-[10px] py-[13px] text-[14px] font-semibold cursor-pointer hover:bg-gold-light transition-colors mb-2 relative overflow-hidden shine btn-press"
            onClick={() => {
              setRequestBookingModal(!requestBookingModal);
              setReserveBookingModal(false);
            }}
          >
            Book Now
          </button>
          {/* <button
            className="w-full bg-transparent text-[#e8e6e1] border border-white/20 rounded-[10px] py-3 text-[14px] cursor-pointer hover:bg-white/[0.06] transition-colors"
            onClick={() => {
              setReserveBookingModal(!reserveBookingModal);
              setRequestBookingModal(false);
            }}
          >
            Reserve
          </button> */}
        </div>
      </div>

      {/* Toast notification */}
      {showModal && (
        <ToastNotif
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Booking request modal */}
      {(requestBookingModal || reserveBookingModal) && property && (
        <BookingRequestModal
          data={{
            property: property,
            booking: booking,
          }}
          action={{
            handleRequestBooking: requestBookingModal ? onBook : onReserve,
            updateBooking: setBooking,
            onClose: () => {
              setRequestBookingModal(false);
              setReserveBookingModal(false);
            },
          }}
        />
      )}
    </div>
  );
};

export default PropertyView;
