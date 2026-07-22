import { useState } from "react";
import "@/styles/components/confirmationPopUp.css";

interface ConfirmationPopUpProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationPopUp({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmationPopUpProps) {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen && !isClosing) return null;

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onCancel();
    }, 200);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onConfirm();
    }, 200);
  };

  return (
    <div
      className={`confirmationPopUp-container ${isClosing ? "confirmationPopUp-exit" : ""}`}
      onClick={handleCancel}
    >
      <div
        className="confirmationPopUp-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <p>{message}</p>

        <div className="confirmationPopUp-actions">
          <button className="btn-outline btn-press" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn-danger btn-press" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
