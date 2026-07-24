import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteProperty, getMyProperties } from "../../api/property";
import type { PropertyTypesView } from "../../pages/property/Propertytypes";
import { propertyData, useProperty } from "../../context/PropertyContext";
import { FaPencil, FaPlus, FaRegTrashCan } from "react-icons/fa6";
import EmptyState from "../../components/common/EmptyState";

const ManageProperty = () => {
  const navigate = useNavigate();
  const imageBaseUrl = import.meta.env.VITE_CLOUD_PUBLIC_KEY;

  const { setData } = useProperty();
  const [properties, setProperties] = useState<PropertyTypesView[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const handleOnDelete = async (propertyId: string | undefined) => {
    if (!propertyId) {
      throw new Error("Property ID is missing in search params");
    }

    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    const res = await deleteProperty(propertyId);

    if (res.success) {
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    }
  };

  const handleOnEdit = (propertyId: string | undefined) => {
    if (!propertyId) {
      throw new Error("Property ID is missing in search params");
    }

    navigate(`/property/edit/info/${propertyId}`);
  };

  useEffect(() => {
    setData(propertyData);

    const fetchProperties = async () => {
      const res = await getMyProperties(currentPage);

      if (res.success) {
        setProperties(res.properties.content);
        setCurrentPage(res.properties.pageable.pageNumber);
        setTotalPages(res.properties.totalPages);

        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="s-screen bg-dark-800 min-h-[520px] p-4 sm:p-6 lg:p-8 animate-fadeIn">
        <h1 className="font-serif text-[20px] text-primary">Loading<span className="typing-dots"><span></span><span></span><span></span></span></h1>
      </div>
    );
  }

  return (
    <div className="s-screen bg-dark-800 min-h-[520px] p-4 sm:p-6 lg:p-8 page-enter">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 animate-fadeInDown">
        <h2 className="font-serif text-[24px] text-white">My Properties</h2>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select className="s-input flex-1 sm:flex-none min-w-0 bg-dark-700 border border-white/10 rounded-lg px-4 py-2 text-[13px] text-muted outline-none">
            <option>All Types</option>
            <option>Condo</option>
            <option>House</option>
            <option>Villa</option>
          </select>

          <select className="s-input flex-1 sm:flex-none min-w-0 bg-dark-700 border border-white/10 rounded-lg px-4 py-2 text-[13px] text-muted outline-none">
            <option>All Status</option>
            <option>Active</option>
            <option>Maintenance</option>
            <option>Inactive</option>
          </select>

          <button
            type="button"
            onClick={() => navigate("/property/form")}
            className="flex w-full sm:w-auto items-center justify-center gap-1.5 bg-gold text-dark-900 rounded-lg px-4 py-2 text-[13px] font-semibold cursor-pointer hover:bg-gold-light transition-colors btn-press shine relative overflow-hidden"
          >
            <FaPlus className="text-[11px]" /> Add Property
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-6 stagger-children">
        {properties.length > 0 &&
          properties.map((property) => (
            <div
              key={property.id}
              className="bg-dark-700 border border-white/[0.07] rounded-2xl overflow-hidden card-interactive"
            >
              {/* Image */}
              <div className="relative h-[200px] overflow-hidden">
                <img
                  src={imageBaseUrl + "/" + property.imageUrl}
                  alt={property.title || "Property Image"}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover zoom-img"
                />

                {/* Status badge (static for now) */}
                <div className="absolute top-3 right-3">
                  <span className="text-[11px] px-3 py-1 rounded-full backdrop-blur-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-[16px] font-medium text-white mb-2">
                  {property.title || "Property Title"}
                </h3>

                <div className="text-[12px] text-muted-faint mb-4">
                  📍 {property.address || "—"}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[10px] text-muted-faint mb-1">
                      Price
                    </div>
                    <div className="text-[14px] text-gold font-medium">
                      {property.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted-faint mb-1">
                      Type
                    </div>
                    <div className="text-[14px] text-white font-medium">
                      {property.propertyType || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted-faint mb-1">
                      Status
                    </div>
                    <div className="text-[14px] text-white font-medium">
                      —
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOnEdit(property.id)}
                    className="flex-1 bg-dark-900 border border-white/10 text-muted px-4 py-2 rounded-lg text-[12px] hover:bg-dark-800 transition-colors flex items-center justify-center gap-1 btn-press"
                  >
                    <FaPencil /> Manage
                  </button>

                  <button
                    onClick={() => handleOnDelete(property.id)}
                    className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-[12px] hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1 btn-press"
                  >
                    <FaRegTrashCan /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

        {properties.length > 0 && (
          <button
            type="button"
            onClick={() => navigate("/property/form")}
            className="group flex flex-col items-center justify-center gap-3 min-h-[300px] rounded-2xl border-2 border-dashed border-white/[0.12] bg-dark-700/40 text-muted cursor-pointer hover:border-gold/60 hover:bg-dark-700 hover:text-gold transition-all card-interactive btn-press"
          >
            <div className="w-14 h-14 rounded-full border border-white/[0.12] bg-dark-800 flex items-center justify-center text-2xl transition-all group-hover:border-gold/50 group-hover:bg-gold/10 group-hover:text-gold">
              <FaPlus />
            </div>
            <span className="text-[14px] font-medium">Add New Property</span>
            <span className="text-[12px] text-muted-faint">
              List another place to start earning
            </span>
          </button>
        )}
      </div>

      {properties.length == 0 && (
        <EmptyState
          title="No properties yet"
          description="You haven't listed any properties. Add your first one to start earning."
          cta={{ label: "Add New Property", href: "/property/form" }}
        />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="w-9 h-9 rounded-full border border-white/[0.12] text-muted text-[13px] flex items-center justify-center bg-transparent cursor-pointer hover:bg-gold/15 hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-white/[0.12] disabled:hover:text-muted hover-scale"
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
                className={`w-9 h-9 rounded-full text-[13px] flex items-center justify-center transition-all cursor-pointer border ${
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
            className="w-9 h-9 rounded-full border border-white/[0.12] text-muted text-[13px] flex items-center justify-center bg-transparent cursor-pointer hover:bg-gold/15 hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-white/[0.12] disabled:hover:text-muted hover-scale"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageProperty;
