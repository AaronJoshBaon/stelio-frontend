import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  className?: string;
}

/**
 * Consistent, on-brand empty-state block for lists and grids.
 * Dark surface, gold accent CTA, gentle entrance animation.
 */
export default function EmptyState({
  icon = "✦",
  title,
  description,
  cta,
  className = "",
}: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 py-14 sm:py-20 animate-fadeInUp ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl text-gold mb-5 animate-float">
        {icon}
      </div>
      <h2 className="font-serif text-xl sm:text-2xl text-primary mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-muted-faint text-sm max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {cta && (
        <Link
          to={cta.href}
          className="mt-6 inline-flex items-center gap-2 bg-gold text-dark-900 font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gold-light transition-colors btn-press shine"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
