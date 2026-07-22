import { Link } from "react-router-dom";
import type { UserContextTypes } from "../../context/UserContext";

interface Props {
  userData: UserContextTypes;
  logout: () => void;
  open: boolean;
  onNavigate?: () => void;
}

export default function NavbarMenu({
  userData,
  logout,
  open,
  onNavigate,
}: Props) {
  return (
    <ul
      role="menu"
      data-open={open}
      className="menu-pop dropdown-menu absolute right-0 mt-2 bg-dark-700 border border-white/[0.12] rounded-xl shadow-lg w-[160px] grid gap-0.5 p-1 z-50"
    >
      <Link
        to="/profile"
        role="menuitem"
        onClick={onNavigate}
        className="link px-5 py-3 text-primary text-sm hover:bg-gold/10 hover:text-gold rounded-lg transition-colors duration-200 w-full text-center"
      >
        Profile
      </Link>

      {userData.role === "RENTER" && (
        <Link
          to="/my-bookings"
          role="menuitem"
          onClick={onNavigate}
          className="link px-5 py-3 text-primary text-sm hover:bg-gold/10 hover:text-gold rounded-lg transition-colors duration-200 w-full text-center"
        >
          My Bookings
        </Link>
      )}

      <button
        type="button"
        role="menuitem"
        onClick={() => {
          onNavigate?.();
          logout();
        }}
        className="px-5 py-3 w-full text-primary text-sm cursor-pointer hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors duration-200 text-center"
      >
        Logout
      </button>
    </ul>
  );
}
