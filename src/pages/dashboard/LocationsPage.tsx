import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ui/ConfirmModal";
import Modal from "../../components/ui/Modal";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import type { LocationRecord } from "../../types";

const LocationsPage = () => {
  const { user } = useAuth();
  const { users, locations, setLocations } = useData();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ user_id: 0, assigned_location: "", branch: user?.branch ?? "" });

  const availableUsers = useMemo(() => {
    if (!user) return [];
    if (user.role === "super_admin") return users.filter((u) => u.role === "admin");
    return users.filter((u) => u.role === "accountant" && u.branch === user.branch);
  }, [user, users]);

  const visibleLocations = useMemo(() => {
    if (!user) return [];
    if (user.role === "super_admin") return locations;
    return locations.filter((l) => l.branch === user.branch);
  }, [locations, user]);

  const addLocation = () => {
    if (!form.user_id || !form.assigned_location || !form.branch) {
      toast.error("Complete all fields");
      return;
    }
    if (editingId) {
      setLocations((prev) => prev.map((loc) => (loc.id === editingId ? { ...loc, ...form } : loc)));
      toast.success("Location updated");
    } else {
      const record: LocationRecord = { id: Date.now(), ...form };
      setLocations((prev) => [record, ...prev]);
      toast.success("Location assigned");
    }
    setForm({ user_id: 0, assigned_location: "", branch: user?.branch ?? "" });
    setEditingId(null);
    setModalOpen(false);
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Location Assignments</h3>
          <button onClick={() => { setEditingId(null); setForm({ user_id: 0, assigned_location: "", branch: user?.branch ?? "" }); setModalOpen(true); }}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 16 }}>
        <table style={{ width: "100%" }}>
          <thead><tr><th>User</th><th>Assigned Location</th><th>Branch</th><th>Action</th></tr></thead>
          <tbody>
            {visibleLocations.map((loc) => {
              const assignedUser = users.find((u) => u.id === loc.user_id);
              return (
                <tr key={loc.id}>
                  <td>{assignedUser?.name ?? "N/A"}</td>
                  <td>{loc.assigned_location}</td>
                  <td>{loc.branch}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => {
                        setEditingId(loc.id);
                        setForm({ user_id: loc.user_id, assigned_location: loc.assigned_location, branch: loc.branch });
                        setModalOpen(true);
                      }}
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeleteId(loc.id)} title="Delete" style={{ background: "#dc2626" }}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title={editingId ? "Edit Location Assignment" : "Add Location Assignment"} onClose={() => setModalOpen(false)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <select value={form.user_id} onChange={(e) => setForm((f) => ({ ...f, user_id: Number(e.target.value) }))}>
            <option value={0}>Select user</option>
            {availableUsers.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
          </select>
          <input placeholder="Assigned location" value={form.assigned_location} onChange={(e) => setForm((f) => ({ ...f, assigned_location: e.target.value }))} />
          <input placeholder="Branch" value={form.branch} onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button onClick={addLocation}>{editingId ? "Update" : "Assign"}</button>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteId !== null}
        message="Are you sure you want to delete this location assignment?"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId === null) return;
          setLocations((prev) => prev.filter((p) => p.id !== deleteId));
          setDeleteId(null);
          toast.success("Location assignment removed");
        }}
      />
    </div>
  );
};

export default LocationsPage;
