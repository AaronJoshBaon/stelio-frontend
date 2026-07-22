import { useState, useEffect } from 'react';

const Analytics = () => {
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="s-screen bg-dark-800 min-h-[520px] p-4 sm:p-6 lg:p-8 page-enter">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-[24px] text-white text-gradient-gold">
          Analytics Dashboard
        </h2>
        <select className="s-input bg-dark-700 border border-white/10 rounded-lg px-4 py-2 text-[13px] text-muted outline-none">
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6 card-interactive">
          <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
            Average Nightly Rate
          </div>
          <div className="font-serif text-[32px] text-white leading-none mb-1">
            ₱3,850
          </div>
          <div className="text-[11px] text-emerald-400">+₱250 from avg</div>
        </div>
        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6 card-interactive">
          <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
            Average Stay Duration
          </div>
          <div className="font-serif text-[32px] text-white leading-none mb-1">
            3.2
          </div>
          <div className="text-[11px] text-muted-faint">nights per booking</div>
        </div>
        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6 card-interactive">
          <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
            Guest Satisfaction
          </div>
          <div className="font-serif text-[32px] text-white leading-none mb-1">
            4.8⭐
          </div>
          <div className="text-[11px] text-emerald-400">
            Based on 47 reviews
          </div>
        </div>
        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6 card-interactive">
          <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
            Repeat Guest Rate
          </div>
          <div className="font-serif text-[32px] text-white leading-none mb-1">
            32%
          </div>
          <div className="text-[11px] text-emerald-400">
            +5% from last period
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 stagger-children">
        <div className="lg:col-span-2 bg-dark-700 border border-white/[0.07] rounded-2xl p-6">
          <h3 className="font-serif text-[20px] text-white mb-6">
            Revenue Trends
          </h3>
          <div className="h-[350px] flex items-center justify-center border-2 border-dashed border-white/[0.08] rounded-xl">
            <div className="text-center animate-fadeIn">
              <div className="text-[48px] text-muted-ghost mb-3">📊</div>
              <p className="text-[13px] text-muted-faint">
                Revenue trend chart
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6">
          <h3 className="font-serif text-[20px] text-white mb-6">
            Revenue by Property
          </h3>
          <div className="mt-8 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[12px] text-white">Luxury Condo BGC</span>
                <span className="text-[12px] text-gold font-medium">₱85k</span>
              </div>
              <div className="w-full h-2 bg-dark-900 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gold transition-all duration-1000 ${barsVisible ? 'w-[60%]' : 'w-0'}`}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[12px] text-white">
                  Modern Studio Makati
                </span>
                <span className="text-[12px] text-gold font-medium">₱52k</span>
              </div>
              <div className="w-full h-2 bg-dark-900 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gold transition-all duration-1000 ${barsVisible ? 'w-[37%]' : 'w-0'}`}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[12px] text-white">Beachfront Villa</span>
                <span className="text-[12px] text-gold font-medium">₱0</span>
              </div>
              <div className="w-full h-2 bg-dark-900 rounded-full overflow-hidden">
                <div className="h-full bg-gold w-0 transition-all duration-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
