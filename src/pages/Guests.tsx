import { useState } from 'react';
import EmptyState from '../components/common/EmptyState';

interface GuestEntry {
  initials: string;
  name: string;
  email: string;
  bookings: number;
  rating: number;
  isVip: boolean;
}

const ALL_GUESTS: GuestEntry[] = [
  { initials: 'MS', name: 'Maria Santos', email: 'maria.s@email.com', bookings: 8, rating: 5.0, isVip: true },
  { initials: 'JC', name: 'John Cruz', email: 'john.c@email.com', bookings: 3, rating: 4.9, isVip: false },
  { initials: 'AR', name: 'Anna Reyes', email: 'anna.r@email.com', bookings: 6, rating: 5.0, isVip: true },
  { initials: 'PL', name: 'Peter Lim', email: 'peter.l@email.com', bookings: 2, rating: 4.7, isVip: false },
];

const Guests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Guests');

  const filteredGuests = ALL_GUESTS.filter((g) => {
    const matchesSearch =
      searchQuery === '' ||
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'All Guests' ||
      filterStatus === 'Active' ||
      filterStatus === 'Past Guests' ||
      (filterStatus === 'VIP' && g.isVip);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="s-screen bg-dark-800 min-h-[520px] p-4 sm:p-6 lg:p-8 page-enter">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="font-serif text-[24px] text-white text-gradient-gold">Guest Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search guests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="s-input bg-dark-700 border border-white/10 rounded-lg px-4 py-2 text-[13px] text-white outline-none w-full sm:w-64"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="s-input bg-dark-700 border border-white/10 rounded-lg px-4 py-2 text-[13px] text-muted outline-none"
          >
            <option>All Guests</option>
            <option>Active</option>
            <option>Past Guests</option>
            <option>VIP</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6 card-interactive">
          <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
            Total Guests
          </div>
          <div className="font-serif text-[32px] text-white leading-none mb-1">
            247
          </div>
          <div className="text-[11px] text-emerald-400">+23 this month</div>
        </div>
        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6 card-interactive">
          <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
            Repeat Guests
          </div>
          <div className="font-serif text-[32px] text-white leading-none mb-1">
            79
          </div>
          <div className="text-[11px] text-muted-faint">32% of total</div>
        </div>
        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6 card-interactive">
          <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
            VIP Guests
          </div>
          <div className="font-serif text-[32px] text-white leading-none mb-1">
            12
          </div>
          <div className="text-[11px] text-muted-faint">5+ bookings</div>
        </div>
        <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6 card-interactive">
          <div className="text-[11px] text-muted-faint uppercase tracking-widest mb-2">
            Average Rating Given
          </div>
          <div className="font-serif text-[32px] text-white leading-none mb-1">
            4.8⭐
          </div>
          <div className="text-[11px] text-emerald-400">Excellent feedback</div>
        </div>
      </div>

      <div className="bg-dark-700 border border-white/[0.07] rounded-2xl p-6 animate-fadeInUp">
        <h3 className="font-serif text-[20px] text-white mb-6">Guest List</h3>

        {filteredGuests.length === 0 ? (
          <EmptyState
            title="No guests found"
            description="Try adjusting your search or filter to find matching guests."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
            {filteredGuests.map((guest) => (
              <div
                key={guest.email}
                className="bg-dark-900 border border-white/[0.07] rounded-xl p-5 card-interactive"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-[18px] flex-shrink-0 hover-scale ${
                      guest.isVip
                        ? 'bg-gold text-dark-900'
                        : 'bg-dark-600 border border-gold/30 text-primary'
                    }`}
                  >
                    {guest.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[15px] text-white font-medium truncate">
                        {guest.name}
                      </h4>
                      {guest.isVip && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 flex-shrink-0">
                          VIP
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-muted-faint mb-2 truncate">
                      {guest.email}
                    </div>
                    <div className="flex gap-4 text-[11px] text-muted-faint">
                      <span>📅 {guest.bookings} bookings</span>
                      <span>⭐ {guest.rating} rating</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-dark-800 border border-white/10 text-muted px-3 py-2 rounded-lg text-[11px] hover:bg-dark-700 transition-colors btn-press">
                    View History
                  </button>
                  <button className="flex-1 bg-gold/10 border border-gold/20 text-gold px-3 py-2 rounded-lg text-[11px] hover:bg-gold/20 transition-colors btn-press relative overflow-hidden shine">
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Guests;
