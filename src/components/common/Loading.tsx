import "@/styles/components/loading.css";

const Loading = () => {
  return (
    <div
      className="loading-container animate-fadeIn"
      role="status"
      aria-label="Loading, please wait"
    >
      <div className="spinner" aria-hidden="true"></div>
      <p className="loading-text">Loading...</p>
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default Loading;
