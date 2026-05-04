import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import type { Role, UserRecord } from "../../types";

const UsersPage = () => {
  const { user } = useAuth();
  const { users, setUsers } = useData();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "accountant" as Role, branch: "", location: "" });

  const canManageRole = (targetRole: Role) => {
    if (!user) return false;
    if (user.role === "super_admin") return targetRole !== "super_admin";
    return targetRole === "accountant";
  };

  const visibleUsers = useMemo(() => {
    if (!user) return [];
    if (user.role === "super_admin") return users.filter((u) => u.role !== "super_admin");
    return users.filter((u) => u.role === "accountant" && u.branch === user.branch);
  }, [user, users]);

  const resetForm = () => setForm({ name: "", email: "", role: "accountant", branch: user?.branch ?? "", location: user?.location ?? "" });

  const saveUser = () => {
    if (!form.name || !form.email || !form.branch || !form.location) {
      toast.error("Fill all fields");
      return;
    }
    if (!canManageRole(form.role)) {
      toast.error("You cannot create this role");
      return;
    }
    if (editingId) {
      setUsers((prev) => prev.map((u) => (u.id === editingId ? { ...u, ...form } : u)));
      toast.success("User updated");
    } else {
      const newUser: UserRecord = { id: Date.now(), ...form };
      setUsers((prev) => [newUser, ...prev]);
      toast.success("User created");
    }
    setEditingId(null);
    resetForm();
    setModalOpen(false);
  };

  const editUser = (target: UserRecord) => {
    setEditingId(target.id);
    setForm({ name: target.name, email: target.email, role: target.role, branch: target.branch, location: target.location });
    setModalOpen(true);
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User removed");
    setDeleteId(null);
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Users</h3>
          <button onClick={() => { setEditingId(null); resetForm(); setModalOpen(true); }}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Users</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Branch</th><th>Location</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visibleUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.branch}</td><td>{u.location}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => editUser(u)} title="Edit"><Pencil size={15} /></button>
                  <button onClick={() => setDeleteId(u.id)} title="Delete" style={{ background: "#dc2626" }}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title={editingId ? "Edit User" : "Add User"} onClose={() => setModalOpen(false)}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(160px,1fr))", gap: 10 }}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
          <select value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value as Role }))}>
            {user?.role === "super_admin" && <option value="admin">Admin</option>}
            <option value="accountant">Accountant</option>
          </select>
          <input placeholder="Branch" value={form.branch} onChange={(e) => setForm((s) => ({ ...s, branch: e.target.value }))} />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button onClick={saveUser}>{editingId ? "Update" : "Create"}</button>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteId !== null}
        message="Are you sure you want to delete this user?"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId === null) return;
          deleteUser(deleteId);
        }}
      />
    </div>
  );
};

export default UsersPage;
