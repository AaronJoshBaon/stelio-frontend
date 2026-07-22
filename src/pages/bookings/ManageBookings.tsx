import { useEffect, useState } from "react";
import type { PropertyTypesView } from "../property/Propertytypes";
import PropertyCard from "../../components/property/PropertyCard";
import { getMyBookings } from "../../api/bookProperty";
import EmptyState from "../../components/common/EmptyState";

const ManageBookings = () => {
  const [properties, setProperties] = useState<PropertyTypesView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await getMyBookings();

        if (res.success) {
          setProperties(res?.properties ?? []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="s-screen bg-dark-800 min-h-[520px] p-4 sm:p-6 lg:p-8 page-enter">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-6 stagger-children">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skel-block rounded-2xl h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="s-screen bg-dark-800 min-h-[520px] p-4 sm:p-6 lg:p-8 page-enter">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-6 stagger-children">
        {properties.length > 0 ? (
          properties.map((property, i) => (
            <PropertyCard
              key={i}
              property={property}
              actions={{}}
              settings={{ mode: "booking" }}
            />
          ))
        ) : (
          <EmptyState
            title="No bookings yet"
            description="Your booked properties will appear here."
          />
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
