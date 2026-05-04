import Modal from "./Modal";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  open,
  title = "Confirm Delete",
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p style={{ marginTop: 0, color: "#334155" }}>{message}</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ background: "#cbd5e1", color: "#0f172a" }}>
          Cancel
        </button>
        <button onClick={onConfirm} style={{ background: "#dc2626" }}>
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
