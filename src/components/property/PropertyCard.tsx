import { FaHeart, FaRegHeart } from "react-icons/fa";
import type {
  PropertyCardActions,
  PropertyCardSettings,
  PropertyTypesView,
} from "../../pages/property/Propertytypes";
import PropertyCardDetails from "./PropertyCardDetails";

export type PropertyCardProps = {
  property: PropertyTypesView;
  actions: PropertyCardActions;
  settings: PropertyCardSettings;
  bookingDateRange?: { start: Date; end: Date | undefined };
};

const PropertyCard = ({
  property,
  actions,
  settings,
  bookingDateRange,
}: PropertyCardProps) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!property.id) return;

    actions.onFavorite?.(property.id);
  };

  return (
    <div className="relative bg-dark-700 rounded-[14px] border border-white/[0.07] overflow-hidden cursor-pointer card-interactive">
      {/* Favorite Button (Home Mode) */}
      {settings.mode === "home" && (
        <button
          type="button"
          aria-label={property.isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 w-11 h-11 bg-dark-900/60 rounded-full flex items-center justify-center text-xl cursor-pointer text-gold backdrop-blur-sm transition-transform duration-300 hover-scale z-1 btn-press ${property.isFavorite ? "animate-popIn" : ""}`}
        >
          {property.isFavorite ? (
            <FaHeart color="#ff0000" size={16} />
          ) : (
            <FaRegHeart size={16} />
          )}
        </button>
      )}

      {/* Property Details */}
      <PropertyCardDetails
        property={property}
        actions={actions}
        settings={settings}
        bookingDateRange={bookingDateRange}
      />
    </div>
  );
};

export default PropertyCard;
