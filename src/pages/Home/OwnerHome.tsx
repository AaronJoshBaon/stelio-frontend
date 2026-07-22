import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchDashboard } from "../../api/property";
import type { summary, property } from "../../types/dashboard";

const OwnerHome = () => {
  const [summary, setSummary] = useState<summary>();
  const [properties, setProperties] = useState<property[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const imageBaseUrl = import.meta.env.VITE_CLOUD_PUBLIC_KEY;

  const loadDashboard = async () => {
    try {
      const res = await fetchDashboard();

      if (res?.success) {
        setSummary(res.summary);
        setProperties(res.properties);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page-enter min-h-[83vh] active bg-dark-800 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6 animate-pulse">
              <div className="h-3 bg-white/10 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-white/10 rounded w-3/4 mb-2"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-dark-700 border border-white/[0.07] rounded-2xl p-6 animate-pulse">
            <div className="h-5 bg-white/10 rounded w-1/3 mb-6"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 mb-4">
                <div className="w-20 h-20 bg-white/10 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6 animate-pulse">
            <div className="h-5 bg-white/10 rounded w-1/2 mb-6"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-white/10 rounded mb-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter min-h-[83vh] active bg-dark-800 overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -mr-12 -mt-12"></div>
          <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
            Total Revenue
          </div>
          <div className="font-serif text-[32px] text-gold leading-none mb-1">
            ₱{summary?.totalRevenue}
          </div>
        </div>

        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6">
          <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
            Monthly Revenue
          </div>
          <div className="font-serif text-[32px] text-white leading-none mb-1">
            ₱{summary?.monthlyRevenue}
          </div>
          <div className="text-[11px] text-emerald-400">
            {summary?.monthlyRevenueComparison}% from last month
          </div>
        </div>

        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6">
          <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
            Occupancy Rate
          </div>
          <div className="font-serif text-[32px] text-white leading-none mb-1">
            {summary?.occupancyRate}%
          </div>
          <div className="w-full h-2 bg-dark-900 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-700"
              style={{ width: `${summary?.occupancyRate ?? 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6">
          <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
            Active Bookings
          </div>
          <div className="font-serif text-[32px] text-white leading-none mb-1">
            {summary?.activeBookings}
          </div>
          <div className="text-[11px] text-muted-faint">
            {summary?.todaysCheckins} check-ins today
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Properties Performance */}
        <div className="lg:col-span-2 bg-dark-700 border border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-[20px] text-white">
              Properties Performance
            </h2>
            <Link
              to="/manage"
              className="text-[12px] text-gold hover:text-gold-light transition-colors link-underline"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-4 stagger-children">
            {/* Property Item */}
            {properties && properties.length > 0 ? (
              properties.map((property: property) => (
                <div key={property.id} className="animate-fadeInUp bg-dark-900 border border-white/[0.07] rounded-xl p-4 flex items-center gap-4 hover:border-gold/30 transition-all cursor-pointer hover-lift">
                  <img
                    src={imageBaseUrl + "/" + property.imageUrl + "?w=400"}
                    alt="Property"
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-medium text-white">
                        {property.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    </div>
                    <div className="text-[12px] text-muted-faint mb-2">
                      📍 {property.address}
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="text-muted-faint">
                        Occupancy:{" "}
                        <span className="text-gold font-medium">
                          {property.occupancyRate}%
                        </span>
                      </span>
                      <span className="text-muted-ghost">•</span>
                      <span className="text-muted-faint">
                        {property.totalBookings} bookings
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-muted-faint mb-1">
                      Revenue
                    </div>
                    <div className="font-serif text-[18px] text-gold">
                      ₱{property.totalRevenue}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-fadeInUp">
                <div className="text-[48px] mb-4">🏠</div>
                <h3 className="font-serif text-lg text-white mb-2">No properties yet</h3>
                <p className="text-sm text-muted-faint mb-6 max-w-[280px]">
                  Add your first property to start tracking performance and revenue.
                </p>
                <Link
                  to="/manage"
                  className="px-5 py-2.5 bg-gold text-dark-900 text-sm font-medium rounded-lg hover:bg-gold-light transition-colors btn-press"
                >
                  Manage Properties
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6">
          <h2 className="font-serif text-[20px] text-white mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[12px] flex-shrink-0">
                📅
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-white mb-1">
                  New booking from Maria Santos
                </div>
                <div className="text-[11px] text-muted-faint truncate">
                  Luxury Condo BGC
                </div>
                <div className="text-[10px] text-muted-ghost mt-1">
                  2 hours ago
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-white/5">
              <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-[12px] flex-shrink-0">
                ⭐
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-white mb-1">
                  John Cruz left a 5⭐ review
                </div>
                <div className="text-[11px] text-muted-faint truncate">
                  Modern Studio Makati
                </div>
                <div className="text-[10px] text-muted-ghost mt-1">
                  5 hours ago
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-white/5">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-[12px] flex-shrink-0">
                💰
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-white mb-1">
                  Payment received: ₱12,500
                </div>
                <div className="text-[11px] text-muted-faint truncate">
                  Luxury Condo BGC
                </div>
                <div className="text-[10px] text-muted-ghost mt-1">
                  1 day ago
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center text-[12px] flex-shrink-0">
                💬
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-white mb-1">
                  Inquiry from Anna Reyes
                </div>
                <div className="text-[11px] text-muted-faint truncate">
                  Beachfront Villa Batangas
                </div>
                <div className="text-[10px] text-muted-ghost mt-1">
                  2 days ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6">
        <h2 className="font-serif text-[20px] text-white mb-6">
          Revenue Overview
        </h2>
        <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-white/[0.08] rounded-xl">
          <div className="text-center">
            <div className="text-[48px] text-muted-ghost mb-3">📈</div>
            <p className="text-[13px] text-muted-faint">
              Revenue chart will be displayed here
            </p>
            <p className="text-[11px] text-muted-ghost mt-1">
              Integrate with a charting library like Recharts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerHome;
