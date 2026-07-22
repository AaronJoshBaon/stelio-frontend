type SkeletonLoadingProps = {
  allowed?: {
    body?: boolean;
    search?: boolean;
    filters?: boolean;
    cards?: boolean;
  };
  cardType?: "landscape" | "box";
};

const SkeletonLoading = ({
  allowed = {},
  cardType = "box",
}: SkeletonLoadingProps) => {
  const { body = true, search = true, filters = true, cards = true } = allowed;

  const cardHeight = cardType === "landscape" ? "h-[160px]" : "h-[240px]";

  return (
    <div
      id="skeleton-overlay"
      className="min-h-[90vh] bg-dark-800 flex flex-col animate-fadeIn"
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading content, please wait</span>
      {body && (
        <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-5 flex-1">
          {/* Search */}
          {search && <div className="skel-block h-[58px] rounded-[40px]" />}

          {/* Filters */}
          {filters && (
            <div className="flex gap-2 flex-wrap">
              {[60, 80, 60, 70, 55].map((w, i) => (
                <div
                  key={i}
                  className="skel-block h-[30px] rounded-full"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
          )}

          {/* Cards */}
          {cards && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 flex-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`skel-block ${cardHeight} rounded-xl`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkeletonLoading;
