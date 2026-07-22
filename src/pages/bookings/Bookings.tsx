import "@/styles/booking/calendar.css";
import "@/styles/booking/bookings.css";
import { useEffect, useState } from "react";
import { type activeBookings, type bookingsStats } from "../../types/booking";
import { fetchBooking } from "../../api/property";

const Bookings = () => {
  const [summary, setSummary] = useState<bookingsStats>();
  const [activeBookings, setActiveBookings] = useState<activeBookings[]>([]);

  const fetchBookings = async () => {
    const res = await fetchBooking();

    if (res.success) {
      setSummary(res.summary);
      setActiveBookings(res.activeBookings);
    }
  };

  const getDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getTime = (date: Date) => {
    {
      return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="s-screen bg-dark-800 min-h-[520px] p-4 sm:p-6 lg:p-8 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="font-serif text-[24px] text-white text-gradient-gold">
          Bookings Management
        </h2>
        <div className="flex flex-wrap gap-3">
          <select className="bg-dark-700 border border-white/10 rounded-lg px-4 py-2 text-[13px] text-muted outline-none s-input">
            <option>All Properties</option>
            <option>Luxury Condo BGC</option>
            <option>Modern Studio Makati</option>
          </select>
          <select className="bg-dark-700 border border-white/10 rounded-lg px-4 py-2 text-[13px] text-muted outline-none s-input">
            <option>All Status</option>
            <option>Upcoming</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 stagger-children">
        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6">
          <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
            Upcoming Check-ins
          </div>
          <div className="font-serif text-[32px] text-white leading-none mb-1">
            {summary?.upcomingCheckins}
          </div>
          <div className="text-[11px] text-emerald-400">
            Next in {summary?.nextBooking}
          </div>
        </div>
        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6">
          <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
            Current Guests
          </div>
          <div className="font-serif text-[32px] text-white leading-none mb-1">
            {summary?.currentGuests}
          </div>
          <div className="text-[11px] text-muted-faint">
            {summary?.checkOutToday} checking out today
          </div>
        </div>
      </div>

      <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h3 className="font-serif text-[20px] text-white">
            Active & Upcoming Bookings
          </h3>
          <button className="text-[12px] text-gold hover:text-gold-light transition-colors link-underline">
            View Calendar →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="text-left py-4 px-4 text-[11px] text-muted-faint uppercase tracking-widest font-medium">
                  Guest
                </th>
                <th className="hidden md:table-cell text-left py-4 px-4 text-[11px] text-muted-faint uppercase tracking-widest font-medium">
                  Property
                </th>
                <th className="text-left py-4 px-4 text-[11px] text-muted-faint uppercase tracking-widest font-medium">
                  Check-in
                </th>
                <th className="text-left py-4 px-4 text-[11px] text-muted-faint uppercase tracking-widest font-medium">
                  Check-out
                </th>
                <th className="hidden md:table-cell text-left py-4 px-4 text-[11px] text-muted-faint uppercase tracking-widest font-medium">
                  Amount
                </th>
                <th className="text-left py-4 px-4 text-[11px] text-muted-faint uppercase tracking-widest font-medium">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-[11px] text-muted-faint uppercase tracking-widest font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="stagger-children">
              {activeBookings.length > 0 ? (
                activeBookings.map((booking, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-default">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center font-semibold text-[14px] text-dark-900">
                          {booking.name.split(" ").filter(Boolean).map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <div>
                          <div className="text-[13px] text-white font-medium">
                            {booking.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell py-4 px-4">
                      <div className="text-[13px] text-white">
                        {booking.propertyTitle}
                      </div>
                      <div className="text-[11px] text-muted-faint">
                        📍 {booking.propertyAddress}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-[13px] text-white">
                        {getDate(booking.checkInDateTime)}
                      </div>
                      <div className="text-[11px] text-muted-faint">
                        {getTime(booking.checkInDateTime)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-[13px] text-white">
                        {getDate(booking.checkOutDateTime)}
                      </div>
                      <div className="text-[11px] text-muted-faint">
                        {getTime(booking.checkOutDateTime)}
                      </div>
                    </td>
                    <td className="hidden md:table-cell py-4 px-4">
                      <div className="text-[14px] text-gold font-medium">
                        ₱{booking.price}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[10px] px-2 py-1 rounded-full bg-gold/10 text-gold border border-gold/20 animate-scaleIn">
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="bg-dark-900 border border-white/10 text-muted px-3 py-1.5 rounded-lg text-[11px] hover:bg-dark-800 transition-colors btn-press">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-faint animate-fadeInUp">
                    No active bookings
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
