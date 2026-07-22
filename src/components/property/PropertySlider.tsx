import { useEffect, useMemo, useState } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import type { PropertyImagesView } from "../../pages/property/Propertytypes";

const PropertySlider = ({
  images,
}: {
  images: File[] | PropertyImagesView[];
}) => {
  const imageBaseUrl = import.meta.env.VITE_CLOUD_PUBLIC_KEY;

  const [currentImage, setCurrentImage] = useState(0);

  // Memoize URL creation so File-backed blob URLs aren't regenerated every
  // render, and revoke them on unmount / image change to avoid a memory leak.
  const imageUrls = useMemo(
    () =>
      images.map((image) =>
        image instanceof File
          ? URL.createObjectURL(image)
          : imageBaseUrl + "/" + image.url,
      ),
    [images, imageBaseUrl],
  );

  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [imageUrls]);

  const onNext = () => {
    if (currentImage < images.length - 1) {
      setCurrentImage(currentImage + 1);
    } else {
      setCurrentImage(0);
    }
  };

  const onPrev = () => {
    if (currentImage > 0) {
      setCurrentImage(currentImage - 1);
    } else {
      setCurrentImage(images.length - 1);
    }
  };

  const onImageNavigation = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <div className="relative bg-dark-800">
      {/* Hero image section */}
      <div className="relative w-full aspect-video sm:aspect-auto sm:h-[320px] lg:h-[420px] bg-dark-700 overflow-hidden">
        <img
          key={currentImage}
          src={imageUrls[currentImage]}
          alt={`property-image-${currentImage}`}
          className="w-full h-full object-cover opacity-[0.85] animate-fadeIn zoom-img"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(21,24,32,0.95)]"></div>
        <div className="absolute top-1/2 left-4 right-4 flex justify-between -translate-y-1/2">
          <button
            type="button"
            aria-label="Previous image"
            onClick={onPrev}
            className="w-11 h-11 bg-dark-900/60 rounded-full flex items-center justify-center text-[14px] text-primary border border-white/[0.15] hover-scale transition-all btn-press"
          >
            <MdNavigateBefore />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={onNext}
            className="w-11 h-11 bg-dark-900/60 rounded-full flex items-center justify-center text-[14px] text-primary border border-white/[0.15] hover-scale transition-all btn-press"
          >
            <MdNavigateNext />
          </button>
        </div>

        {/* Dot navigation */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-[5px]">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Image ${index + 1}`}
              aria-pressed={index === currentImage}
              onClick={() => onImageNavigation(index)}
              className={`w-[5px] h-[5px] rounded-full cursor-pointer transition-all duration-300 ${
                index === currentImage ? "bg-white scale-125" : "bg-white/30"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Optional: Any additional content (like property details) can be added here */}
    </div>
  );
};

export default PropertySlider;
