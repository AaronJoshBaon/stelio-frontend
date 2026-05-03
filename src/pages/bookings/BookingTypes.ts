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
};

const generateEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
};

export const defaultBooking: Booking = {
    id: "",
    propertyId: "",
    title: "",
    address: "",
    city: "",
    price: 0,
    totalGuests: 0,
    totalBedroom: 0,
    status: "PENDING",
    start: new Date(),
    end: generateEndDate(),
    imageUrl: "",
};