import { useState } from "react";
import Calendar from "react-calendar";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const BookingCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="animate-fadeInUp">
      <Calendar
        onChange={onChange}
        value={value}
        className="booking-calendar"
        showNeighboringMonth={false}
      />
    </div>
  );
};

export default BookingCalendar;
