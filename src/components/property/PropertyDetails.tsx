import { GoPeople } from "react-icons/go";
import { LuBedSingle } from "react-icons/lu";
import { MdOutlineBathroom, MdOutlineMeetingRoom } from "react-icons/md";

import type { PropertyTypesView } from "../../pages/property/Propertytypes";

const PropertyDetails = ({ property }: { property: PropertyTypesView }) => {
  return (
    <div className="space-y-4 animate-fadeInUp">
      <h2 className="font-serif text-2xl sm:text-3xl text-white">{property.title}</h2>
      <p className="text-sm text-muted-faint">{property.address}</p>

      <p className="text-sm text-muted leading-relaxed">{property.description}</p>

      <ul className="flex flex-wrap gap-4 mt-2 list-none p-0 stagger-children">
        <li className="flex items-center gap-2 text-sm text-primary">
          <GoPeople size={22} />
          <span>
            {property.maxGuest} {property.maxGuest > 1 ? "guests" : "guest"}
          </span>
        </li>
        <li className="flex items-center gap-2 text-sm text-primary">
          <MdOutlineMeetingRoom size={22} />
          <span>
            {property.totalBedroom}{" "}
            {property.totalBedroom > 1 ? "bedrooms" : "bedroom"}
          </span>
        </li>
        <li className="flex items-center gap-2 text-sm text-primary">
          <LuBedSingle size={22} />
          <span>
            {property.totalBed} {property.totalBed > 1 ? "beds" : "bed"}
          </span>
        </li>
        <li className="flex items-center gap-2 text-sm text-primary">
          <MdOutlineBathroom size={22} />
          <span>
            {property.totalBath} {property.totalBath > 1 ? "baths" : "bath"}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default PropertyDetails;
