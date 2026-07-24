import PropertyCard from "../../components/property/PropertyCard";
import { getProperties } from "../../api/property";
import { useEffect, useMemo, useState } from "react";
import type { PropertyTypesView } from "../../pages/property/Propertytypes";
import { addFavorite, removeFavorite } from "../../api/favorite";
import { useUserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import SkeletonLoading from "../../components/common/SkeletonLoading";
import DatePicker from "react-datepicker";
import { FiMapPin, FiCalendar, FiUsers, FiTag, FiSearch, FiX, FiChevronDown } from "react-icons/fi";

// Popular destinations shown before the user types; merged with the real
// cities/addresses of loaded listings so suggestions always reflect inventory.
const POPULAR_DESTINATIONS = [
  "Manila",
  "Makati",
  "Quezon City",
  "Tagaytay",
  "Baguio",
  "Cebu City",
  "Boracay",
  "Palawan",
  "El Nido",
  "Siargao",
  "Bohol",
  "Davao City",
  "La Union",
  "Batangas",
];

const Home = () => {
  const navigate = useNavigate();
  const { userData } = useUserData();

  const [loading, setLoading] = useState<boolean>(true);
  const [properties, setProperties] = useState<PropertyTypesView[]>([]);
  const [updatingFavorites, setUpdatingFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Search Bar
  const [address, setAddress] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [minGuests, setMinGuests] = useState<number>(1);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  // On mobile the search bar is collapsed behind a compact summary chip.
  const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);
  const [highlightedCity, setHighlightedCity] = useState<number>(-1);
  // Bumped on every explicit search so the fetch effect re-runs even when the
  // page is already 0 (state resets are read on the next render, avoiding a
  // stale-closure fetch).
  const [searchNonce, setSearchNonce] = useState<number>(0);

  const toggleField = (field: string | null) => {
    setActiveField((prev) => (prev === field ? null : field));
  };

  const hasActiveFilters =
    !!address ||
    !!checkOut ||
    minGuests > 1 ||
    minPrice !== null ||
    maxPrice !== null;

  const runSearch = () => {
    setActiveField(null);
    setMobileSearchOpen(false);
    setIsSearching(true);
    setCurrentPage(0);
    setSearchNonce((n) => n + 1);
  };

  const fmtShort = (d: Date) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const mobileDateLabel = checkOut
    ? `${fmtShort(checkIn)} – ${fmtShort(checkOut)}`
    : fmtShort(checkIn);

  const clearFilters = () => {
    setAddress("");
    setCheckIn(new Date());
    setCheckOut(undefined);
    setMinGuests(1);
    setMinPrice(null);
    setMaxPrice(null);
    setActiveField(null);
    setIsSearching(true);
    setCurrentPage(0);
    setSearchNonce((n) => n + 1);
  };

  // Destination suggestions: popular destinations + every distinct city and
  // address present in the loaded listings.
  const citySuggestions = useMemo(() => {
    const fromListings = properties
      .flatMap((p) => [p.city, p.address])
      .filter((c): c is string => !!c && c.trim().length > 0);
    return Array.from(new Set([...POPULAR_DESTINATIONS, ...fromListings]));
  }, [properties]);

  const filteredCities = useMemo(() => {
    const q = address.trim().toLowerCase();
    const list = q
      ? citySuggestions.filter((c) => c.toLowerCase().includes(q))
      : citySuggestions;
    return list.slice(0, 6);
  }, [address, citySuggestions]);

  const selectCity = (city: string) => {
    setAddress(city);
    setHighlightedCity(-1);
    runSearch();
  };

  const handleCityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedCity((i) => Math.min(i + 1, filteredCities.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedCity((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedCity >= 0 && filteredCities[highlightedCity]) {
        selectCity(filteredCities[highlightedCity]);
      } else {
        runSearch();
      }
    } else if (e.key === "Escape") {
      setActiveField(null);
    }
  };

  const handleFavorite = async (propertyId: string) => {
    if (!userData.isAuthenticated) {
      navigate("/login");
      return;
    }

    if (updatingFavorites.includes(propertyId)) return;

    setUpdatingFavorites((prev) => [...prev, propertyId]);

    try {
      const isFavorite = properties.find(
        (property) => property.id === propertyId,
      )?.isFavorite;

      const res = !isFavorite
        ? await addFavorite(propertyId)
        : await removeFavorite(propertyId);

      if (res.success) {
        setProperties((prev) =>
          prev.map((property) =>
            property.id === propertyId
              ? { ...property, isFavorite: !property.isFavorite }
              : property,
          ),
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingFavorites((prev) => prev.filter((id) => id !== propertyId));
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await getProperties(
        currentPage + 1,
        address,
        checkIn,
        checkOut,
        minGuests,
        minPrice,
        maxPrice,
      );

      if (res.success) {
        setProperties(res.properties.content);
        setCurrentPage(res.properties.pageable.pageNumber);
        setTotalPages(res.properties.totalPages);
      }

      console.log(res.properties.content);
    } catch (e: any) {
      console.error("Error fetching properties:", e);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [currentPage, searchNonce]);

  if (loading) {
    return <SkeletonLoading />;
  }

  return (
    <div
      className="min-h-[90vh] active bg-dark-800 overflow-y-auto page-enter"
      onClick={() => setActiveField(null)}
    >
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Search Bar */}
        <div className="mb-8">
          {/* Mobile: collapsed search trigger */}
          <button
            type="button"
            aria-expanded={mobileSearchOpen}
            aria-label="Toggle search filters"
            onClick={(e) => {
              e.stopPropagation();
              setMobileSearchOpen((o) => !o);
            }}
            className="lg:hidden w-full flex items-center gap-3 bg-dark-700 border border-white/[0.08] rounded-full px-4 py-3 text-left transition-colors hover:bg-white/[0.03] btn-press"
          >
            <span className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
              <FiSearch size={16} className="text-gold" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[13px] text-primary truncate">
                {address || "Anywhere"}
              </span>
              <span className="block text-[11px] text-muted-faint truncate">
                {mobileDateLabel} · {minGuests}{" "}
                {minGuests === 1 ? "guest" : "guests"}
                {minPrice || maxPrice ? " · Price set" : ""}
              </span>
            </span>
            <FiChevronDown
              size={18}
              className={`text-muted-faint flex-shrink-0 transition-transform duration-200 ${mobileSearchOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Full search: collapsible on mobile, always shown on desktop */}
          <div
            className={`${mobileSearchOpen ? "block animate-fadeInDown" : "hidden"} lg:block mt-3 lg:mt-0`}
          >
          <div className="relative flex flex-col lg:flex-row lg:items-stretch bg-dark-700 border border-white/[0.08] rounded-2xl lg:rounded-[56px] lg:p-1.5 overflow-visible transition-shadow hover:shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)]">
            {/* City */}
            <div
              className={`group relative w-full lg:flex-1 flex items-center gap-3 px-5 py-3 border-b lg:border-b-0 lg:border-r border-white/[0.07] cursor-pointer transition-colors lg:rounded-l-[56px] ${activeField === "location" ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"}`}
              onClick={(e) => {
                toggleField("location");
                e.stopPropagation();
              }}
            >
              <FiMapPin
                size={17}
                className="shrink-0 text-gold/70 group-hover:text-gold transition-colors"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-muted-faint uppercase tracking-widest mb-0.5">
                  City
                </div>
                <div
                  className={`text-[13px] truncate ${address ? "text-primary" : "text-muted-ghost"}`}
                >
                  {address || "Where are you going?"}
                </div>
              </div>
              {activeField === "location" && (
                <div
                  className="absolute top-[calc(100%+10px)] left-0 w-[280px] max-w-[calc(100vw-2rem)] bg-dark-600 border border-white/10 rounded-[20px] z-30 overflow-hidden animate-scaleIn shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4">
                    <input
                      autoFocus
                      type="text"
                      role="combobox"
                      aria-expanded={true}
                      aria-controls="city-suggestions"
                      aria-autocomplete="list"
                      aria-activedescendant={
                        highlightedCity >= 0
                          ? `city-opt-${highlightedCity}`
                          : undefined
                      }
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setHighlightedCity(-1);
                      }}
                      onKeyDown={handleCityKeyDown}
                      placeholder="City, neighborhood…"
                      className="s-input w-full bg-dark-800 border border-white/10 rounded-xl px-[14px] py-[10px] text-[14px] text-primary outline-none focus:border-gold/50 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="text-[10px] uppercase tracking-widest text-muted-faint mt-3 mb-1.5 px-1">
                      {address.trim() ? "Suggestions" : "Popular destinations"}
                    </div>
                    {filteredCities.length > 0 ? (
                      <ul
                        id="city-suggestions"
                        role="listbox"
                        className="max-h-[240px] overflow-y-auto no-scrollbar"
                      >
                        {filteredCities.map((city, i) => (
                          <li
                            id={`city-opt-${i}`}
                            key={city}
                            role="option"
                            aria-selected={i === highlightedCity}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectCity(city);
                            }}
                            onMouseEnter={() => setHighlightedCity(i)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-[13px] transition-colors ${
                              i === highlightedCity
                                ? "bg-gold/15 text-gold"
                                : "text-primary hover:bg-white/[0.05]"
                            }`}
                          >
                            <FiMapPin
                              size={14}
                              className="shrink-0 text-muted-faint"
                            />
                            <span className="truncate">{city}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[12px] text-muted-faint px-1 py-2">
                        No matches. Press{" "}
                        <span className="text-primary">Enter</span> to search “
                        {address}”.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Check-in */}
            <div className="relative w-full lg:flex-1 flex items-center gap-3 px-5 py-3 border-b lg:border-b-0 lg:border-r border-white/[0.07] transition-colors hover:bg-white/[0.04] z-10">
              <FiCalendar size={17} className="shrink-0 text-gold/70" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-muted-faint uppercase tracking-widest mb-0.5">
                  Check-in
                </div>
                <DatePicker
                  selected={checkIn}
                  onChange={(date) => {
                    if (!date) return;
                    setCheckIn(date);
                  }}
                  placeholderText="Select date"
                  dateFormat="MMM d, yyyy"
                  selectsStart
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={new Date()}
                  maxDate={checkOut}
                  className="w-full bg-transparent text-[13px] text-primary outline-none cursor-pointer"
                  wrapperClassName="relative z-30 w-full"
                />
              </div>
            </div>

            {/* Checkout */}
            <div className="relative w-full lg:flex-1 flex items-center gap-3 px-5 py-3 border-b lg:border-b-0 lg:border-r border-white/[0.07] transition-colors hover:bg-white/[0.04] z-10">
              <FiCalendar size={17} className="shrink-0 text-gold/70" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-muted-faint uppercase tracking-widest mb-0.5">
                  Check-out
                </div>
                <DatePicker
                  selected={checkOut}
                  onChange={(date) => {
                    if (!date) return;
                    setCheckOut(date);
                  }}
                  placeholderText="Add date"
                  dateFormat="MMM d, yyyy"
                  selectsEnd
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={checkIn ? checkIn : new Date()}
                  className="w-full bg-transparent text-[13px] text-primary outline-none cursor-pointer"
                  wrapperClassName="relative z-30 w-full"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="relative w-full lg:flex-1 flex items-center gap-3 px-5 py-3 border-b lg:border-b-0 lg:border-r border-white/[0.07]">
              <FiUsers size={17} className="shrink-0 text-gold/70" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-muted-faint uppercase tracking-widest mb-0.5">
                  Guests
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] text-primary">
                    {minGuests} {minGuests === 1 ? "guest" : "guests"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Decrease guests"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMinGuests((p) => Math.max(1, p - 1));
                      }}
                      disabled={minGuests <= 1}
                      className="w-7 h-7 rounded-full border border-white/15 bg-transparent text-primary flex items-center justify-center hover:border-gold/60 hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all btn-press"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      aria-label="Increase guests"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMinGuests((p) => p + 1);
                      }}
                      className="w-7 h-7 rounded-full border border-white/15 bg-transparent text-primary flex items-center justify-center hover:border-gold/60 hover:text-gold transition-all btn-press"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div
              className={`group relative w-full lg:flex-1 flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors z-10 ${activeField === "price" ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"}`}
              onClick={(e) => {
                toggleField("price");
                e.stopPropagation();
              }}
            >
              <FiTag
                size={17}
                className="shrink-0 text-gold/70 group-hover:text-gold transition-colors"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-muted-faint uppercase tracking-widest mb-0.5">
                  Price
                </div>
                <div
                  className={`text-[13px] truncate ${minPrice || maxPrice ? "text-primary" : "text-muted-ghost"}`}
                >
                  {minPrice || maxPrice
                    ? minPrice && maxPrice
                      ? `₱${minPrice} - ₱${maxPrice}`
                      : minPrice
                        ? `₱${minPrice}+`
                        : `Up to ₱${maxPrice}`
                    : "Any price"}
                </div>
              </div>
              {activeField === "price" && (
                <div
                  className="absolute top-[calc(100%+10px)] right-0 lg:right-auto bg-dark-600 w-72 max-w-[calc(100vw-2rem)] border border-white/10 rounded-[20px] z-30 overflow-hidden animate-scaleIn shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-[18px_20px] grid gap-3">
                    <div className="text-[11px] uppercase tracking-widest text-muted-faint">
                      Price range (₱/night)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-faint">
                          ₱
                        </span>
                        <input
                          type="number"
                          min={0}
                          placeholder="Min"
                          value={minPrice ?? ""}
                          onChange={(e) =>
                            setMinPrice(
                              e.target.value ? Number(e.target.value) : null,
                            )
                          }
                          onKeyDown={(e) => e.key === "Enter" && runSearch()}
                          className="s-input w-full bg-dark-800 border border-white/10 rounded-xl pl-6 pr-3 py-[9px] text-[13px] text-primary outline-none focus:border-gold/50 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <span className="text-muted-faint text-[13px]">–</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-faint">
                          ₱
                        </span>
                        <input
                          type="number"
                          min={0}
                          placeholder="Max"
                          value={maxPrice ?? ""}
                          onChange={(e) =>
                            setMaxPrice(
                              e.target.value ? Number(e.target.value) : null,
                            )
                          }
                          onKeyDown={(e) => e.key === "Enter" && runSearch()}
                          className="s-input w-full bg-dark-800 border border-white/10 rounded-xl pl-6 pr-3 py-[9px] text-[13px] text-primary outline-none focus:border-gold/50 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search button */}
            <button
              type="button"
              aria-label="Search properties"
              onClick={runSearch}
              disabled={isSearching}
              className="bg-gold w-full lg:w-auto h-11 lg:min-w-11 rounded-xl lg:rounded-full mx-3 my-3 lg:mx-1 lg:my-auto px-5 lg:px-0 flex items-center justify-center gap-2 flex-shrink-0 border-none hover:bg-gold-light transition-all cursor-pointer relative overflow-hidden shine btn-press disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <span className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
              ) : (
                <FiSearch size={18} className="text-dark-900" strokeWidth={2.4} />
              )}
              <span className="lg:hidden text-dark-900 text-[14px] font-semibold">
                {isSearching ? "Searching…" : "Search"}
              </span>
            </button>
          </div>

          {/* Active-filter reset */}
          {hasActiveFilters && (
            <div className="flex justify-end mt-3 animate-fadeIn">
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-[12px] text-muted-faint hover:text-gold transition-colors btn-press"
              >
                <FiX size={13} />
                Clear filters
              </button>
            </div>
          )}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-4 stagger-children">
          {properties.length > 0 ? (
            properties?.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                actions={{ onFavorite: handleFavorite }}
                settings={{ mode: "home" }}
                bookingDateRange={{ start: checkIn, end: checkOut }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 animate-fadeIn">
              <h1 className="text-xl text-primary">No Properties Found</h1>
              <p className="text-muted-faint mt-2">
                It seems like there are no properties available at the moment.
                Check back later!
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              aria-label="Previous page"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="w-9 h-9 rounded-full border border-white/[0.12] text-muted text-[13px] flex items-center justify-center bg-transparent cursor-pointer hover:bg-gold/15 hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-white/[0.12] disabled:hover:text-muted btn-press"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => {
              const isActive = i === currentPage;
              const isNearCurrent = Math.abs(i - currentPage) <= 1;
              const isEdge = i === 0 || i === totalPages - 1;

              if (!isNearCurrent && !isEdge) {
                if (i === currentPage - 2 || i === currentPage + 2) {
                  return (
                    <span key={i} className="text-muted text-[12px] px-1">
                      …
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-9 h-9 rounded-full text-[13px] flex items-center justify-center transition-all cursor-pointer border btn-press ${
                    isActive
                      ? "bg-gold border-gold text-dark-900 font-semibold"
                      : "border-white/[0.12] text-muted bg-transparent hover:bg-gold/15 hover:border-gold hover:text-gold"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}

            <button
              aria-label="Next page"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage === totalPages - 1}
              className="w-9 h-9 rounded-full border border-white/[0.12] text-muted text-[13px] flex items-center justify-center bg-transparent cursor-pointer hover:bg-gold/15 hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-white/[0.12] disabled:hover:text-muted btn-press"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
