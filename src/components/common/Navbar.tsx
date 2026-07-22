import { Link, useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { logout, verifyToken } from "../../api/auth";
import { useUserData } from "../../context/UserContext";
import { LuMessageSquareText } from "react-icons/lu";
import NavbarMenu from "./NavbarMenu";
import { becomeHost } from "../../api/user";

const OWNER_LINKS = [
  { to: "/", icon: "📊", label: "Overview" },
  { to: "/manage", icon: "🏠", label: "Properties" },
  { to: "/bookings", icon: "📅", label: "Bookings" },
  { to: "/analytics", icon: "📈", label: "Analytics" },
  { to: "/guests", icon: "👥", label: "Guests" },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { userData, setUserData } = useUserData();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setUserData({
      id: "",
      name: "",
      email: "",
      role: "",
      isAuthenticated: false,
    });

    navigate("/");
  };

  const handleBecomeHost = async () => {
    const res = await becomeHost();

    if (res.success) {
      setUserData({
        id: res.id,
        name: res.name,
        email: res.email,
        role: res.role,
        isAuthenticated: true,
      });

      window.location.reload();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const verifyUser = async () => {
      const res = await verifyToken();

      setUserData({
        id: res.id,
        name: res.name,
        email: res.email,
        role: res?.role,
        isAuthenticated: true,
      });
    };

    if (token) {
      verifyUser();
    }
  }, []);

  // Close the profile dropdown on outside click or Escape.
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handlePointer = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDropdownOpen(false);
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="bg-dark-900 sticky top-0 z-50">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 md:px-8 min-h-[56px] sm:min-h-[64px] border-b border-white/[0.08]">
        {/* Logo */}
        <Link
          to={"/"}
          className="flex-shrink-0 font-serif text-[22px] sm:text-[28px] font-medium tracking-widest text-primary transition-all duration-300 ease-in-out hover:text-gold hover-scale"
          style={{ fontFamily: "Bristol" }}
        >
          STELIO
        </Link>

        {/* User Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {userData.isAuthenticated ? (
            <>
              {userData.role === "RENTER" && (
                <button
                  onClick={handleBecomeHost}
                  className="relative overflow-hidden bg-white/[0.06] border border-white/[0.12] text-primary rounded-lg px-3 sm:px-[14px] py-[7px] text-[12px] sm:text-[13px] cursor-pointer hover:bg-white/10 transition-colors btn-press shine whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Want to become a host?</span>
                  <span className="sm:hidden">Become a host</span>
                </button>
              )}
              {/* Message Icon */}
              <Link
                to={"/messages/"}
                aria-label="Messages"
                className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer text-muted hover-scale transition-transform duration-200 hover:bg-white/[0.06]"
              >
                <LuMessageSquareText size={22} color="white" />
              </Link>

              {/* Profile Icon (Dropdown) */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  aria-label="Account menu"
                  aria-haspopup="menu"
                  aria-expanded={isDropdownOpen}
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="w-11 h-11 flex items-center justify-center rounded-full cursor-pointer hover-scale transition-transform duration-200 hover:bg-white/[0.06]"
                >
                  <BsPersonCircle size={28} className="text-primary" />
                </button>
                <NavbarMenu
                  userData={userData}
                  logout={handleLogout}
                  open={isDropdownOpen}
                  onNavigate={() => setIsDropdownOpen(false)}
                />
              </div>
            </>
          ) : (
            <Link
              to={"/login"}
              className="text-primary text-[13px] font-medium link-underline px-2 py-2"
            >
              Login / Signup
            </Link>
          )}
        </div>
      </div>

      {userData.role === "OWNER" && (
        <div className="bg-dark-900 border-b border-white/[0.08] flex items-center gap-1 sm:gap-2 md:gap-0 md:justify-between px-2 sm:px-4 md:px-8 h-12 sm:h-14 overflow-x-auto no-scrollbar snap-x">
          {OWNER_LINKS.map((item) => (
            <Link
              key={item.to}
              className={`nav-item flex items-center gap-2 px-3 sm:px-4 py-3 text-[13px] font-medium border-b-2 transition-all duration-200 ease-out flex-shrink-0 whitespace-nowrap snap-start ${
                isActive(item.to)
                  ? "text-gold border-gold"
                  : "text-muted-faint border-transparent hover:text-muted"
              }`}
              to={item.to}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
