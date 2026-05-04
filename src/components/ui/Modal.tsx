import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ open, title, onClose, children }: ModalProps) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 120,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(760px, 100%)",
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #e2e8f0",
          padding: 18,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "#e2e8f0", color: "#0f172a" }}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
