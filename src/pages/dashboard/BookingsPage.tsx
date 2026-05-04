import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ui/ConfirmModal";
import Modal from "../../components/ui/Modal";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import type { BookingRecord } from "../../types";

const empty = {
  customer_name: "",
  hotel_name: "",
  room_type: "",
  booking_date: "",
  checkin_date: "",
  checkout_date: "",
  total_amount: 0,
  status: "pending" as const,
};

const BookingsPage = () => {
  const { user } = useAuth();
  const { bookings, setBookings } = useData();
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedSlip, setSelectedSlip] = useState<BookingRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const visibleBookings = useMemo(() => {
    if (!user) return [];
    if (user.role === "super_admin") return bookings;
    if (user.role === "admin") return bookings.filter((b) => b.branch === user.branch);
    return bookings.filter((b) => b.created_by_user_id === user.id);
  }, [bookings, user]);

  const save = () => {
    if (!user) return;
    if (!form.customer_name || !form.hotel_name || !form.room_type || !form.booking_date) {
      toast.error("Fill required booking fields");
      return;
    }
    if (editingId) {
      setBookings((prev) => prev.map((b) => (b.id === editingId ? { ...b, ...form } : b)));
      toast.success("Booking updated");
    } else {
      const record: BookingRecord = {
        id: Date.now(),
        ...form,
        branch: user.branch,
        location: user.location,
        created_by_user_id: user.id,
      };
      setBookings((prev) => [record, ...prev]);
      toast.success("Booking created");
    }
    setForm(empty);
    setEditingId(null);
    setModalOpen(false);
  };

  const printSlip = () => window.print();

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Bookings</h3>
          <button onClick={() => { setEditingId(null); setForm(empty); setModalOpen(true); }}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><th>Customer</th><th>Hotel</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {visibleBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.customer_name}</td><td>{booking.hotel_name}</td><td>${booking.total_amount}</td><td>{booking.status}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setEditingId(booking.id); setForm({ customer_name: booking.customer_name, hotel_name: booking.hotel_name, room_type: booking.room_type, booking_date: booking.booking_date, checkin_date: booking.checkin_date, checkout_date: booking.checkout_date, total_amount: booking.total_amount, status: booking.status }); setModalOpen(true); }} title="Edit"><Pencil size={15} /></button>
                  <button onClick={() => setSelectedSlip(booking)} title="View Slip" style={{ background: "#334155" }}><Eye size={15} /></button>
                  <button onClick={() => setDeleteId(booking.id)} title="Delete" style={{ background: "#dc2626" }}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSlip && (
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }} id="booking-slip">
          <h3>Booking Slip #{selectedSlip.id}</h3>
          <p>Customer: {selectedSlip.customer_name}</p>
          <p>Hotel: {selectedSlip.hotel_name}</p>
          <p>Room: {selectedSlip.room_type}</p>
          <p>Booking Date: {selectedSlip.booking_date}</p>
          <p>Check-in: {selectedSlip.checkin_date}</p>
          <p>Check-out: {selectedSlip.checkout_date}</p>
          <p>Total: ${selectedSlip.total_amount}</p>
          <p>Status: {selectedSlip.status}</p>
          <button onClick={printSlip}>Print / Download PDF</button>
        </div>
      )}

      <Modal open={modalOpen} title={editingId ? "Edit Booking" : "Add Booking"} onClose={() => setModalOpen(false)}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(100px,1fr))", gap: 10 }}>
          <input placeholder="Customer Name" value={form.customer_name} onChange={(e) => setForm((p) => ({ ...p, customer_name: e.target.value }))} />
          <input placeholder="Hotel Name" value={form.hotel_name} onChange={(e) => setForm((p) => ({ ...p, hotel_name: e.target.value }))} />
          <input placeholder="Room Type" value={form.room_type} onChange={(e) => setForm((p) => ({ ...p, room_type: e.target.value }))} />
          <input type="date" value={form.booking_date} onChange={(e) => setForm((p) => ({ ...p, booking_date: e.target.value }))} />
          <input type="date" value={form.checkin_date} onChange={(e) => setForm((p) => ({ ...p, checkin_date: e.target.value }))} />
          <input type="date" value={form.checkout_date} onChange={(e) => setForm((p) => ({ ...p, checkout_date: e.target.value }))} />
          <input type="number" value={form.total_amount} placeholder="Total Amount" onChange={(e) => setForm((p) => ({ ...p, total_amount: Number(e.target.value) }))} />
          <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as BookingRecord["status"] }))}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button onClick={save}>{editingId ? "Update" : "Create"} Booking</button>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteId !== null}
        message="Are you sure you want to delete this booking?"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId === null) return;
          setBookings((prev) => prev.filter((b) => b.id !== deleteId));
          setDeleteId(null);
          toast.success("Booking deleted");
        }}
      />
    </div>
  );
};

export default BookingsPage;
