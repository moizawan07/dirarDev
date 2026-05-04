import { useState } from "react";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ui/ConfirmModal";
import Modal from "../../components/ui/Modal";
import { useData } from "../../context/DataContext";
import type { ServiceRecord } from "../../types";

const emptyForm = { title: "", description: "", price: 0, status: "active" as const };

const ServicesPage = () => {
  const { services, setServices } = useData();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const saveService = () => {
    if (!form.title || !form.description || !form.price) {
      toast.error("Fill all service fields");
      return;
    }
    if (editingId) {
      setServices((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)));
      toast.success("Service updated");
    } else {
      const record: ServiceRecord = { id: Date.now(), ...form };
      setServices((prev) => [record, ...prev]);
      toast.success("Service created");
    }
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(false);
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Services</h3>
          <button onClick={() => { setEditingId(null); setForm(emptyForm); setModalOpen(true); }}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><th>Title</th><th>Description</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.title}</td><td>{service.description}</td><td>${service.price}</td><td>{service.status}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setEditingId(service.id); setForm({ title: service.title, description: service.description, price: service.price, status: service.status }); setModalOpen(true); }} title="Edit"><Pencil size={15} /></button>
                  <button onClick={() => setDeleteId(service.id)} title="Delete" style={{ background: "#dc2626" }}><Trash2 size={15} /></button>
                  <button onClick={() => setServices((prev) => prev.map((s) => s.id === service.id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s))} title="Toggle Status" style={{ background: "#334155" }}><Power size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title={editingId ? "Edit Service" : "Add Service"} onClose={() => setModalOpen(false)}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr 1fr 1fr", gap: 10 }}>
          <input value={form.title} placeholder="Title" onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          <input value={form.description} placeholder="Description" onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          <input type="number" value={form.price} placeholder="Price" onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} />
          <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "active" | "inactive" }))}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button onClick={saveService}>{editingId ? "Update" : "Create"}</button>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteId !== null}
        message="Are you sure you want to delete this service?"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId === null) return;
          setServices((prev) => prev.filter((s) => s.id !== deleteId));
          setDeleteId(null);
          toast.success("Service deleted");
        }}
      />
    </div>
  );
};

export default ServicesPage;
