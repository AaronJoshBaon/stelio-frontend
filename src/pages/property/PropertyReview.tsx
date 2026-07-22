import PropertySlider from "../../components/property/PropertySlider";
import { propertyData, useProperty } from "../../context/PropertyContext";
import type { PropertyImage } from "../../context/PropertyContext";
import { createProperty, updateProperty } from "../../api/property";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PropertyReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, setData } = useProperty();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleBack = () => {
    if (id) {
      navigate(`/property/edit/image/${id}`);
      return;
    }
    navigate("/property/image");
  };

  const handleCreate = async () => {
    setError("");
    setIsFetching(true);
    try {
      const res = id
        ? await updateProperty(data, id)
        : await createProperty(data);
      if (res.success) {
        setData(propertyData);
        navigate("/manage");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to save property. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div
      className="flex flex-col min-h-[90vh] bg-dark-800 relative page-enter"
      id="sc-add"
    >
      {/* Property Images Slider */}
      <div className="relative w-full h-[200px] sm:h-[280px] md:h-[320px] flex-shrink-0 bg-dark-700 overflow-hidden">
        <PropertySlider images={data.images as File[] | PropertyImage[]} />
      </div>

      <div className="px-4 sm:px-8 py-6 flex-1 animate-fadeInUp">
        {/* Step indicator */}
        <div className="grid place-items-center mb-6 mx-auto">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full border-[1.5px] border-gold bg-gold text-dark-900 flex items-center justify-center text-[11px] font-medium transition-all duration-300">
              ✓
            </div>
            <div className="w-10 h-px bg-gold transition-all duration-300"></div>
            <div className="w-10 h-10 rounded-full border-[1.5px] border-gold bg-gold text-dark-900 flex items-center justify-center text-[11px] font-medium transition-all duration-300">
              ✓
            </div>
            <div className="w-10 h-px bg-gold transition-all duration-300"></div>
            <div className="w-10 h-10 rounded-full border-[1.5px] border-gold bg-gold/10 text-gold flex items-center justify-center text-[11px] font-medium animate-scaleIn transition-all duration-300">
              3
            </div>
          </div>
          <div className="text-[11px] text-muted-faint mt-1.5">
            Step 3 of 3 — Review &amp; Submit
          </div>
        </div>

        {/* Left: Property details */}
        <div>
          <h1 className="font-serif text-[26px] font-medium text-gradient-gold mb-1">
            Review Property
          </h1>
          <div className="text-[13px] text-muted-faint mb-4 flex items-center gap-1">
            📍 {data.address} · ★ 4.9 (24 reviews)
          </div>
          <div className="flex gap-5 mb-5 flex-wrap">
            <div className="flex items-center gap-1.5 text-[13px] text-muted">
              👤 {data.maxGuest} {data.maxGuest > 1 ? "guests" : "guest"}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-muted">
              🛏 {data.totalBedroom}{" "}
              {data.totalBedroom > 1 ? "bedrooms" : "bedroom"}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-muted">
              🛏 {data.totalBed} {data.totalBed > 1 ? "beds" : "bed"}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-muted">
              🚿 {data.totalBath} {data.totalBath > 1 ? "baths" : "bath"}
            </div>
          </div>
          <hr className="border-none border-t border-white/[0.07] my-4" />
          <p className="text-[14px] text-muted-dim leading-[1.7]">
            {data.description}
          </p>
        </div>
      </div>

      {/* Action Buttons — sticky to bottom, sibling of content */}
      <div className="sticky bottom-0 p-4 sm:p-6 bg-dark-800/90 glass border-t border-white/[0.08] flex flex-col items-center gap-2">
        {error && (
          <p className="text-red-400 text-[13px] text-center">{error}</p>
        )}
        <div className="flex justify-center gap-4 w-full">
          <button
            onClick={handleBack}
            disabled={isFetching}
            className="bg-transparent border border-white/[0.15] text-muted rounded-[9px] px-6 py-[11px] text-[13px] font-sans cursor-pointer hover:bg-white/[0.04] transition-colors btn-press disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <button
            onClick={handleCreate}
            disabled={isFetching}
            className="relative overflow-hidden shine btn-press bg-gold border-none text-dark-900 rounded-[9px] px-7 py-[11px] text-[13px] font-semibold font-sans cursor-pointer hover:bg-gold-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {!id
              ? isFetching
                ? "Creating..."
                : "Create"
              : isFetching
                ? "Updating..."
                : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyReview;
