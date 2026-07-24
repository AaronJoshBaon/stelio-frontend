import type { PropertyTypes } from "../context/PropertyContext";
import api from "./axios";

export const createProperty = async (info: PropertyTypes) => {
    const formData = new FormData();
    formData.append("title", info.title);
    formData.append("description", info.description);
    formData.append("price", info.price.toString())
    formData.append("maxGuest", info.maxGuest.toString());
    formData.append("totalBedroom", info.totalBedroom.toString());
    formData.append("totalBed", info.totalBed.toString());
    formData.append("totalBath", info.totalBath.toString());
    formData.append("city", info.city)
    formData.append("propertyType", info.propertyType);
    formData.append("address", info.address)

    if (info.images && info.images.length > 0) {
        info.images.forEach((image) => {
            if (image instanceof File) {
                formData.append(`images`, image);
            }
        });
    }

    // On create every image is a newly uploaded File, so the selected index maps
    // directly to the order the images were appended above.
    formData.append("primaryImageIndex", String(info.primaryIndex ?? 0));

    try {
        const res = await api.post("/properties", formData);

        return res.data;
    } catch (e: any) {
        console.error(e)
        throw new Error("Something went wrong. Please try again.");
    }
}


export const updateProperty = async (info: PropertyTypes, propertyId: string) => {
    const formData = new FormData();

    formData.append("title", info.title);
    formData.append("description", info.description);
    formData.append("price", info.price.toString());
    formData.append("maxGuest", info.maxGuest.toString());
    formData.append("totalBedroom", info.totalBedroom.toString());
    formData.append("totalBed", info.totalBed.toString());
    formData.append("totalBath", info.totalBath.toString());
    formData.append("city", info.city);
    formData.append("propertyType", info.propertyType);
    formData.append("address", info.address);

    if (info.images && info.images.length > 0) {
        info.images.forEach((image) => {
            if (image instanceof File) {
                formData.append(`newImages`, image);
            }
        });
    }

    if (info.deletedImages && info.deletedImages.length > 0) {
        info.deletedImages.forEach((image) => {
            formData.append(`removedImages`, image);
        });
    }

    // Tell the backend which image is the primary (display) one. On edit the
    // images array mixes existing images (PropertyImage) with newly uploaded
    // Files, so we send either the existing image id or the index within the
    // newly uploaded images.
    if (info.primaryIndex !== null && info.primaryIndex < info.images.length) {
        const primary = info.images[info.primaryIndex];

        if (primary instanceof File) {
            const primaryNewImageIndex = info.images
                .slice(0, info.primaryIndex)
                .filter((image) => image instanceof File).length;
            formData.append("primaryNewImageIndex", String(primaryNewImageIndex));
        } else {
            formData.append("primaryImageId", primary.id);
        }
    }

    try {
        const res = await api.post(`/properties/${propertyId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data;
    } catch (e: any) {
        console.error(e);
        throw new Error("Something went wrong. Please try again.");
    }
};

export const getMyProperties = async (page: number) => {
    try {
        const res = await api.get(`/owner/properties?page=${page + 1}`)

        return await res.data;
    } catch (e: any) {
        console.error(e)
    }
}

export const getProperties = async (
    currentPage: number,
    address: string | null,
    checkIn: Date,
    checkOut: Date | undefined,
    minGuests: number | null,
    minPrice: number | null,
    maxPrice: number | null
) => {
    // Base Url
    let url = `/properties/?page=${currentPage}`;

    // Queries
    if (address) {
        url += `&address=${encodeURIComponent(address)}`;
    }
    if (checkIn) {
        url += `&checkIn=${checkIn.toISOString()}`;
    }
    if (checkOut) {
        url += `&checkOut=${checkOut.toISOString()}`;
    }
    if (minGuests !== null) {
        url += `&minGuests=${minGuests}`;
    }
    if (minPrice !== null) {
        url += `&minPrice=${minPrice}`;
    }
    if (maxPrice !== null) {
        url += `&maxPrice=${maxPrice}`;
    }

    const res = await api.get(url);

    return await res.data;
};

export const getPropertyById = async (id: string) => {
    const res = await api.get(`/properties/${id}`)
    return await res.data;
}

export const deleteProperty = async (id: String) => {
    const res = await api.delete(`/properties/${id}`);
    return await res.data;
}

export const fetchDashboard = async () => {
    const res = await api.get("/stats");

    return await res.data;
}

export const fetchBooking = async () => {
    const res = await api.get("/stats/bookings")

    return await res.data;
}