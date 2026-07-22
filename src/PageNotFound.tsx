import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="page-enter min-h-[80vh] bg-dark-900 flex flex-col items-center justify-center px-8 text-center">
      <div className="animate-fadeInUp flex flex-col items-center">
        <div
          className="text-[120px] md:text-[160px] font-serif font-bold text-gradient-gold leading-none mb-2 select-none"
          aria-hidden="true"
        >
          404
        </div>
        <h1 className="text-[#e8e6e1] text-2xl md:text-3xl font-serif font-semibold mb-3 tracking-wide">
          Page not found
        </h1>
        <p className="text-muted-faint text-sm mb-8 max-w-xs mx-auto leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/"
          className="inline-block relative overflow-hidden bg-gold/[0.12] border border-gold/40 text-gold px-8 py-3 rounded-lg text-sm font-medium btn-press shine hover:bg-gold/[0.2] transition-colors duration-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
