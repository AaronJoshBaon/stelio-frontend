import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { login } from "../../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../../context/UserContext";

const Login = () => {
  const navigate = useNavigate();

  const { setUserData } = useUserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login(email, password);

      if (res.success) {
        const userDetails = res.userDetails;
        setUserData({
          id: userDetails.id,
          name: userDetails?.name,
          email: userDetails?.email,
          role: userDetails?.role,
          isAuthenticated: true,
        });

        navigate("/");
      }
    } catch (err: any) {
      setError(err.message);
      e.preventDefault();
    }
  };

  // Redirect to homepage, if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="bg-dark-800 min-h-screen animated-gradient" id="sc-login">
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
        <div className="bg-dark-700 border border-white/[0.09] rounded-[16px] px-6 py-7 sm:px-10 sm:py-9 w-full max-w-[400px] animate-scaleIn">
          <h1 className="font-serif text-[26px] text-primary mb-1.5 text-gradient-gold">
            Welcome back
          </h1>
          <p className="text-[13px] text-muted-faint mb-5">
            Sign in to your Stelio account
          </p>

          {error.length > 0 && (
            <div className="border-l-4 border-red-500 text-red-400 p-3 bg-red-500/10 rounded-lg animate-fadeInDown mb-3">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label
                htmlFor="login-email"
                className="block text-[11px] text-white uppercase tracking-[0.07em] mb-1.5"
              >
                Email
              </label>
              <input
                id="login-email"
                className="s-input w-full bg-dark-900 border border-white/10 rounded-lg px-[14px] py-[11px] text-primary text-[13px] font-sans transition-colors"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="login-password"
                className="block text-[11px] text-white uppercase tracking-[0.07em] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  className="s-input w-full bg-dark-900 border border-white/10 rounded-lg px-[14px] py-[11px] pr-10 text-primary text-[13px] font-sans transition-colors"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-faint hover-scale"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-[12px] text-gold cursor-pointer">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-gold text-dark-900 border-none rounded-[10px] py-[13px] text-[14px] font-semibold font-sans cursor-pointer hover:bg-gold-light transition-colors mb-4 relative overflow-hidden shine btn-press"
            >
              Sign in
            </button>

            <div className="text-center text-[11px] text-muted-deep my-4">
              or
            </div>

            <div className="text-center text-[12px] text-muted-faint">
              Don't have an account?{" "}
              <Link to="/register" className="text-gold cursor-pointer link-underline">
                Create one →
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
