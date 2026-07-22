import { FaImage, FaPencil, FaRegTrashCan } from "react-icons/fa6";
import { useProperty } from "../../context/PropertyContext";
import { type ChangeEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PropertyImages = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, setData } = useProperty();
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const image = e.target.files[0];
      setData((prev) => ({
        ...prev,
        images: [...prev.images, image],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = data.images.filter((_, i) => i !== index);
    const removedImage = data.images[index];
    setData((prev) => ({
      ...prev,
      images: newFiles,
      deletedImages:
        removedImage instanceof File
          ? [...(prev.deletedImages ?? [])]
          : [...(prev.deletedImages ?? []), removedImage.id],
    }));
  };

  const handleEditImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const updatedFile = e.target.files[0];
      setData((prev) => {
        const updatedImages = [...prev.images];
        updatedImages[index] = updatedFile;
        return { ...prev, images: updatedImages };
      });
    }
  };

  const handleNavigation = () => {
    if (data.images.length < 1) {
      setHasError(true);
      setErrorMessage("Property Image is required");
      return;
    }

    setHasError(false);
    if (id) {
      navigate(`/property/edit/review/${id}`);
      return;
    }

    navigate(`/property/review`);
  };

  const handleBack = () => {
    if (id) {
      navigate(`/property/edit/info/${id}`);
      return;
    }
    navigate("/property/form");
  };

  return (
    <div className="min-h-[90vh] flex flex-col bg-dark-800 page-enter" id="sc-add">
      <div className="p-4 sm:p-8 flex-grow overflow-y-auto">
        <div className="flex items-center justify-between mb-5 animate-fadeInDown">
          <h1 className="font-serif text-[20px] text-primary">
            Add Property Images
          </h1>
        </div>

        <div className="grid place-items-center mb-7 mx-auto">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full border-[1.5px] border-gold bg-gold text-dark-900 flex items-center justify-center text-[11px] font-medium transition-all duration-300">
              ✓
            </div>
            <div className="w-10 h-px bg-gold transition-all duration-300"></div>
            <div className="w-10 h-10 rounded-full border-[1.5px] border-gold bg-gold/10 text-gold flex items-center justify-center text-[11px] font-medium animate-scaleIn transition-all duration-300">
              2
            </div>
            <div className="w-10 h-px bg-white/10 transition-all duration-300"></div>
            <div className="w-10 h-10 rounded-full border-[1.5px] border-white/[0.15] bg-dark-700 text-muted-faint flex items-center justify-center text-[11px] font-medium transition-all duration-300">
              3
            </div>
          </div>
          <div className="text-[11px] text-muted-faint mt-1.5">
            Step 2 of 3 — Photos
          </div>
        </div>

        {hasError && (
          <div className="text-red-500 text-sm font-medium mb-4 animate-fadeInDown">
            {errorMessage}
          </div>
        )}

        {/* Grid for Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {data.images.map((image, index) => (
            <div
              key={index}
              className="image-card relative rounded-lg overflow-hidden bg-dark-700 border border-white/[0.1] shadow-md hover:shadow-lg card-interactive"
            >
              <img
                src={
                  image instanceof File
                    ? URL.createObjectURL(image as File)
                    : image.url
                }
                alt={`preview-${index}`}
                className="w-full h-[200px] object-cover zoom-img"
              />
              <div className="absolute top-0 right-0 p-2 flex gap-2">
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="bg-red-500 w-10 h-10 text-white p-2 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                  title="Remove image"
                >
                  <FaRegTrashCan className="text-xl" />
                </button>
                <label className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full bg-gold/20 border border-gold/30 text-gold hover:bg-gold/30 transition-colors">
                  <FaPencil className=" hover:text-gray-100" />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleEditImage(e, index)}
                    aria-label="Choose an image to upload"
                  />
                </label>
              </div>
            </div>
          ))}

          {/* Add Image Button */}
          <label className="add-image-card flex flex-col items-center justify-center gap-2 p-5 rounded-lg bg-dark-700 border border-white/[0.15] hover:bg-dark-600 transition-colors cursor-pointer hover-glow">
            <FaImage size={50} color="#fff" />
            <h4 className="text-primary text-sm">+ Add Image</h4>
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={handleAddImage}
            />
          </label>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-2.5 mt-auto justify-center mb-8">
        <button
          onClick={handleBack}
          className="bg-transparent border border-white/[0.15] text-muted rounded-[9px] px-6 py-[11px] text-[13px] font-sans cursor-pointer hover:bg-white/[0.04] transition-colors btn-press"
        >
          ← Back
        </button>
        <button
          onClick={handleNavigation}
          className="relative overflow-hidden shine btn-press bg-gold border-none text-dark-900 rounded-[9px] px-7 py-[11px] text-[13px] font-semibold font-sans cursor-pointer hover:bg-gold-light transition-colors"
        >
          Next → Review
        </button>
      </div>
    </div>
  );
};

export default PropertyImages;
