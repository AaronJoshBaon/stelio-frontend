export type Tab = {
    tab:
    | "Dashboard"
    | "Calendar"
    | "Bookings"
    | "Earnings"
    | "Reviews"
    | "Messages"
    | "Settings"
}

export const defaultTab: Tab = {
    tab: "Dashboard"
}

export type PaymentType = {
    paymentType: "NOW" | "LATER"
}

export const defaultPaymentType: PaymentType = {
    paymentType: "NOW"
}

export type Booking = {
    id: string;

    // Property Details
    propertyId: string;
    title: string;
    description: string;
    address: string;
    city: string;
    price: number;
    maxGuest: number;
    totalBed: number;
    totalBath: number;
    totalBedroom: number;
    paymentStatus: "PENDING" | "PAID" | "FAILED";
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    propertyType: "APARTMENT" | "HOUSE" | "VILLA";
    discount: number;

    // Guest
    contactPhone: string | null;
    guestNames: string[] | null;
    specialRequest: string | null;
    totalGuests: number | null;
    coupon: string;

    // Schedule
    start: Date;
    end: Date;
    expiresAt: number;

    images: string[];
};

export type BookingCard = {
    id: string;
    propertyId: string;
    title: string;
    address: string;
    city: string;
    price: number;
    totalGuests: number;
    totalBedroom: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";

    // Schedule
    start: Date;
    end: Date;
    imageUrl: string;

    contactPhone: string;
};

const generateEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
};

let expiration = new Date()

export const defaultBooking: Booking = {
    id: "",
    propertyId: "",
    title: "",
    description: "",
    address: "",
    city: "",
    price: 0,
    maxGuest: 0,
    totalBed: 0,
    totalBath: 0,
    totalGuests: 0,
    totalBedroom: 0,
    paymentStatus: "PENDING",
    status: "PENDING",
    propertyType: "APARTMENT",
    discount: 0,
    contactPhone: null,
    guestNames: [""],
    specialRequest: null,
    coupon: "",
    start: new Date(),
    end: generateEndDate(),
    images: [],
    expiresAt: expiration.getMinutes() + 10,
};