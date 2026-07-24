import { handleNumeric } from "./PropertyFunc";
import { useNavigate, useParams } from "react-router-dom";
import { useProperty, type PropertyTypes } from "../../context/PropertyContext";
import { useEffect, useState } from "react";
import { getPropertyById } from "../../api/property";

const PropertyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, setData } = useProperty();

  const [property, setProperty] = useState<PropertyTypes>(data);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData(property);

    if (id) {
      navigate(`/property/edit/image/${id}`);
      return;
    }
    navigate("/property/image");
  };

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await getPropertyById(id);
        if (res.success) {
          const images = res.images ?? [];
          const primaryIdx = images.findIndex(
            (img: { isPrimary?: boolean }) => img.isPrimary,
          );

          const merged: PropertyTypes = {
            ...data,
            ...res.property,
            images,
            deletedImages: [],
            primaryIndex:
              primaryIdx >= 0 ? primaryIdx : images.length > 0 ? 0 : null,
          };

          setData(merged);
          setProperty(merged);
        }
      } catch (e: any) {
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, []);

  if (loading) {
    return (
      <div className="s-screen bg-dark-800 min-h-[520px] animate-fadeIn" id="sc-add">
        <div className="p-4 sm:p-8">
          <h1 className="text-primary font-serif text-[20px]">Loading<span className="typing-dots"><span></span><span></span><span></span></span></h1>
        </div>
      </div>
    );
  }

  return (
    <form
      className="min-h-[90vh] overflow-y-auto bg-dark-800 page-enter"
      id="sc-add"
      onSubmit={handleSubmit}
    >
      <div className="p-4 sm:p-8">
        <div className="flex items-center justify-between mb-5 animate-fadeInDown">
          <h1 className="font-serif text-[20px] text-primary">
            {id ? "Edit Property" : "Add Property"}
          </h1>
        </div>

        <div className="grid place-items-center mb-7 mx-auto">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full border-[1.5px] border-gold bg-gold/10 text-gold flex items-center justify-center text-[11px] font-medium animate-scaleIn transition-all duration-300">
              1
            </div>
            <div className="w-10 h-px bg-white/10 transition-all duration-300"></div>
            <div className="w-10 h-10 rounded-full border-[1.5px] border-white/[0.15] bg-dark-700 text-muted-faint flex items-center justify-center text-[11px] font-medium transition-all duration-300">
              2
            </div>
            <div className="w-10 h-px bg-white/10 transition-all duration-300"></div>
            <div className="w-10 h-10 rounded-full border-[1.5px] border-white/[0.15] bg-dark-700 text-muted-faint flex items-center justify-center text-[11px] font-medium transition-all duration-300">
              3
            </div>
          </div>
          <div className="text-[11px] text-muted-faint mt-1.5">
            Step 1 of 3 — Property Details
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
          <div>
            <label htmlFor="prop-title" className="text-[11px] text-muted-dim uppercase tracking-[0.07em] mb-1.5">
              Title
            </label>
            <input
              id="prop-title"
              className="s-input w-full bg-dark-900 border border-white/10 rounded-lg px-[14px] py-[11px] text-primary text-[13px] font-sans transition-colors"
              placeholder="e.g. Cozy Studio in BGC"
              value={property.title}
              onChange={(e) =>
                setProperty((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label htmlFor="prop-price" className="text-[11px] text-muted-dim uppercase tracking-[0.07em] mb-1.5">
              Price per night (₱)
            </label>
            <input
              id="prop-price"
              className="s-input w-full bg-dark-900 border border-white/10 rounded-lg px-[14px] py-[11px] text-primary text-[13px] font-sans transition-colors"
              type="text"
              inputMode="numeric"
              value={property.price}
              onChange={(e) =>
                setProperty((prev) => ({ ...prev, price: handleNumeric(e) }))
              }
              required
            />
          </div>

          <div>
            <label htmlFor="prop-address" className="text-[11px] text-muted-dim uppercase tracking-[0.07em] mb-1.5">
              Address
            </label>
            <input
              id="prop-address"
              className="s-input w-full bg-dark-900 border border-white/10 rounded-lg px-[14px] py-[11px] text-primary text-[13px] font-sans transition-colors"
              value={property.address}
              onChange={(e) =>
                setProperty((prev) => ({ ...prev, address: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label htmlFor="prop-city" className="text-[11px] text-muted-dim uppercase tracking-[0.07em] mb-1.5">
              City
            </label>
            <input
              id="prop-city"
              className="s-input w-full bg-dark-900 border border-white/10 rounded-lg px-[14px] py-[11px] text-primary text-[13px] font-sans transition-colors"
              value={property.city}
              onChange={(e) =>
                setProperty((prev) => ({ ...prev, city: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label htmlFor="prop-type" className="text-[11px] text-muted-dim uppercase tracking-[0.07em] mb-1.5">
              Property Type
            </label>
            <select
              id="prop-type"
              className="s-input w-full bg-dark-900 border border-white/10 rounded-lg px-[14px] py-[11px] text-primary text-[13px] font-sans outline-none cursor-pointer"
              value={property.propertyType}
              onChange={(e) =>
                setProperty((prev) => ({
                  ...prev,
                  propertyType: e.target.value as
                    | "APARTMENT"
                    | "HOUSE"
                    | "VILLA"
                    | "CABIN",
                }))
              }
              required
            >
              <option>APARTMENT</option>
              <option>HOUSE</option>
              <option>VILLA</option>
              <option>CABIN</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="prop-maxguest" className="text-[11px] text-muted-dim uppercase tracking-[0.07em] mb-1.5">
                Max guests
              </label>
              <input
                id="prop-maxguest"
                className="s-input w-full bg-dark-900 border border-white/10 rounded-lg px-[14px] py-[11px] text-primary text-[13px] font-sans transition-colors"
                value={property.maxGuest}
                onChange={(e) =>
                  setProperty((prev) => ({
                    ...prev,
                    maxGuest: handleNumeric(e),
                  }))
                }
                required
              />
            </div>
            <div>
              <label htmlFor="prop-bedrooms" className="text-[11px] text-muted-dim uppercase tracking-[0.07em] mb-1.5">
                Bedrooms
              </label>
              <input
                id="prop-bedrooms"
                className="s-input w-full bg-dark-900 border border-white/10 rounded-lg px-[14px] py-[11px] text-primary text-[13px] font-sans transition-colors"
                value={property.totalBedroom}
                onChange={(e) =>
                  setProperty((prev) => ({
                    ...prev,
                    totalBedroom: handleNumeric(e),
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="prop-description" className="text-[11px] text-muted-dim uppercase tracking-[0.07em] mb-1.5">
              Description
            </label>
            <textarea
              id="prop-description"
              className="s-textarea w-full bg-dark-900 border border-white/10 rounded-lg px-[14px] py-3 text-primary text-[13px] font-sans resize-y min-h-[110px] transition-colors"
              placeholder="Describe your property..."
              value={property.description}
              onChange={(e) =>
                setProperty((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
            />
          </div>
        </div>

        <div className="flex gap-2.5 mt-6 justify-center">
          <button
            type="button"
            className="bg-transparent border border-white/[0.15] text-muted rounded-[9px] px-6 py-[12px] text-[14px] font-sans cursor-not-allowed opacity-50 hover:bg-transparent transition-all duration-200"
            disabled
          >
            ← Back
          </button>
          <button
            type="submit"
            className="relative overflow-hidden shine btn-press bg-gold border-none text-dark-900 rounded-[9px] px-7 py-[11px] text-[13px] font-semibold font-sans cursor-pointer hover:bg-gold-light transition-colors"
          >
            Next → Photos
          </button>
        </div>
      </div>
    </form>
  );
};

export default PropertyForm;
