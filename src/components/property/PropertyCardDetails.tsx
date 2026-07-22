import { Link } from "react-router-dom";
import type {
  PropertyCardActions,
  PropertyCardSettings,
  PropertyTypesView,
} from "../../pages/property/Propertytypes";
import { MdDelete, MdEdit } from "react-icons/md";

interface Props {
  property: PropertyTypesView;
  actions: PropertyCardActions;
  settings: PropertyCardSettings;
  bookingDateRange?: { start: Date; end: Date | undefined };
}

const PropertyCardDetails = ({
  property,
  actions,
  settings,
  bookingDateRange,
}: Props) => {
  const formatted = property.price.toLocaleString("en-US", {
    style: "currency",
    currency: "PHP",
  });

  const publicKey = import.meta.env.VITE_CLOUD_PUBLIC_KEY;

  return (
    <div>
      <Link
        to={
          settings.mode === "home"
            ? `/property/${property.id}`
            : `/booking/${property.id}`
        }
        state={{
          bookingDateRange,
        }}
        className="block mb-4"
      >
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <img
            src={publicKey + "/" + property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover zoom-img"
            loading="lazy"
            decoding="async"
          />

          {/* Category Badge */}
          <div className="absolute top-2 left-2 bg-gold/90 text-dark-900 text-xs px-2 py-1 rounded tracking-wide">
            {property.propertyType}
          </div>
        </div>

        {/* Property Details */}
        <div className="mx-4 my-2">
          <h3 className="text-xl text-primary">{property.title}</h3>
          <h5 className="text-sm font-medium text-muted-faint mb-1 flex items-center space-x-2">
            📍{property.address}, {property.city}
          </h5>
          <hr className="my-2 border-t-1 rounded-lg text-muted-faint" />
          <h5 className="text-sm font-medium text-gold-light mb-2">
            <span className="font-semibold">{formatted}</span>{" "}
            <span className="text-muted-faint">/ night</span>
          </h5>
        </div>
      </Link>

      {/* Manage Property Actions */}
      {settings.mode === "manage" && (
        <div className="flex gap-2 px-4 pb-4">
          <button
            aria-label="Edit property"
            className="edit-btn w-9 h-9 flex items-center justify-center bg-white/10 border border-white/20 text-white rounded-md hover:border-gold/40 hover:text-gold transition-colors hover-scale btn-press"
            onClick={() =>
              actions.onEdit && property.id && actions.onEdit(property.id)
            }
          >
            <MdEdit />
          </button>
          <button
            aria-label="Delete property"
            className="delete-btn w-9 h-9 flex items-center justify-center bg-white/5 border border-white/20 text-muted rounded-md hover:border-red-400/40 hover:text-red-400 transition-colors hover-scale btn-press"
            onClick={() =>
              actions.onDelete && property.id && actions.onDelete(property.id)
            }
          >
            <MdDelete />
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyCardDetails;
