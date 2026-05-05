import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Search,
  X,
  ChevronDown,
  Layers,
} from "lucide-react";
import { servicesService } from "../../services/dataService";
import type { Service } from "../../types";

// ─── Extended type (category + branch added when backend ready) ───────────────
type ServiceWithMeta = Service & {
  category?: string;
  branch?: string;
};

// ─── Single form state object — easy to wire to API ──────────────────────────
interface ServiceForm {
  title: string;
  description: string;
  price: string;
  status: "active" | "inactive";
  category: string;
  branch: string;
}

const EMPTY_FORM: ServiceForm = {
  title: "",
  description: "",
  price: "",
  status: "active",
  category: "Rooms",
  branch: "Branch A",
};

// ─── Options ──────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Rooms", "Events", "Dining", "Spa", "Transport"];
const BRANCHES = ["All Branches", "Branch A", "Branch B", "HQ"];
const STATUSES = ["All", "active", "inactive"];

// ─── Default meta (remove when backend sends category/branch) ────────────────
const DEFAULT_CATS: string[] = ["Rooms", "Rooms", "Rooms", "Events", "Rooms"];
const DEFAULT_BRANCH: string[] = [
  "Branch A",
  "Branch B",
  "Branch A",
  "Branch B",
  "Branch A",
];

const genId = () => "s" + Date.now();
const formatPrice = (n: number) => "Rs " + n.toLocaleString("en-PK");

// ─── Category color map ───────────────────────────────────────────────────────
const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  Rooms: { bg: "#E6F1FB", color: "#185FA5" },
  Events: { bg: "#FAEEDA", color: "#854F0B" },
  Dining: { bg: "#E1F5EE", color: "#0F6E56" },
  Spa: { bg: "#FBEAF0", color: "#993556" },
  Transport: { bg: "#F1EFE8", color: "#5F5E5A" },
};

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-2.5 border-[1.5px] border-gray-200 rounded-[9px] text-sm outline-none transition-colors focus:border-[#0B73B7] bg-white text-gray-900";
const labelCls =
  "block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5";
const dropdownCls =
  "appearance-none pl-3 pr-8 py-2 border-[1.5px] border-gray-200 rounded-[9px] text-sm bg-white text-gray-700 cursor-pointer outline-none focus:border-[#0B73B7] transition-colors";

// ─── Toggle ───────────────────────────────────────────────────────────────────
const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    type="button"
    onClick={onChange}
    style={{
      position: "relative",
      width: 36,
      height: 20,
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      padding: 0,
      flexShrink: 0,
      background: checked ? "var(--primary)" : "#d1d5db",
      transition: "background 0.2s",
    }}
  >
    <span
      style={{
        position: "absolute",
        top: 2,
        left: checked ? 18 : 2,
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "#fff",
        transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }}
    />
  </button>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: "active" | "inactive" }) =>
  status === "active" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E1F5EE] text-[#0F6E56]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E56]" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAECE7] text-[#993C1D]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#993C1D]" /> Inactive
    </span>
  );

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="col-span-full text-center py-16 px-6">
    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 text-primary">
      <Layers size={32} />
    </div>
    <p className="text-base font-bold text-gray-800 mb-1">No services found</p>
    <p className="text-sm text-gray-500 mb-5">
      Try adjusting filters or add a new service.
    </p>
    <button
      onClick={onAdd}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[9px] bg-primary text-white text-sm font-bold"
    >
      <Plus size={15} /> Add Service
    </button>
  </div>
);

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  editing: ServiceWithMeta | null;
  onSave: (form: ServiceForm) => void;
}

const ServiceModal = ({ isOpen, onClose, editing, onSave }: ModalProps) => {
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setForm(
      editing
        ? {
            title: editing.title,
            description: editing.description,
            price: String(editing.price),
            status: editing.status,
            category: editing.category ?? "Rooms",
            branch: editing.branch ?? "Branch A",
          }
        : EMPTY_FORM,
    );
  }, [editing, isOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  const set = <K extends keyof ServiceForm>(k: K, v: ServiceForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Service title is required.");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error("Enter a valid price.");
      return;
    }
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          animation: "modalIn 0.2s ease",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-0">
          <div>
            <h3
              className="text-lg font-bold text-gray-900"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {editing ? "Edit Service" : "Add New Service"}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {editing
                ? "Update the service details below."
                : "Fill in the details to add a new service."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Row 1 — Title + Category */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelCls}>Service Title *</label>
              <input
                className={inputCls}
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Deluxe Room"
              />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <div className="relative">
                <select
                  className={dropdownCls + " w-full"}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Row 2 — Price + Branch */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelCls}>Price (Rs) *</label>
              <input
                type="number"
                className={inputCls}
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="e.g. 9500"
                min={0}
              />
            </div>
            <div>
              <label className={labelCls}>Branch</label>
              <div className="relative">
                <select
                  className={dropdownCls + " w-full"}
                  value={form.branch}
                  onChange={(e) => set("branch", e.target.value)}
                >
                  {BRANCHES.filter((b) => b !== "All Branches").map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Description — full width */}
          <div className="mb-4">
            <label className={labelCls}>Description</label>
            <textarea
              className={inputCls + " resize-y min-h-[80px]"}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description of this service..."
              rows={3}
            />
          </div>

          {/* Status toggle */}
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-[10px] px-4 py-3 mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Service Status
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Toggle to activate or deactivate
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span
                className={`text-xs font-bold ${form.status === "active" ? "text-[#0F6E56]" : "text-[#993C1D]"}`}
              >
                {form.status === "active" ? "Active" : "Inactive"}
              </span>
              <Toggle
                checked={form.status === "active"}
                onChange={() =>
                  set(
                    "status",
                    form.status === "active" ? "inactive" : "active",
                  )
                }
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-[10px] border-[1.5px] border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-[10px] bg-primary text-white text-sm font-bold hover:bg-primary/80 transition-colors"
            >
              {editing ? "Save Changes" : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Book Now Modal ───────────────────────────────────────────────────────────
interface BookForm {
  customer_name: string;
  checkin: string;
  checkout: string;
  notes: string;
}

const EMPTY_BOOK: BookForm = {
  customer_name: "",
  checkin: "",
  checkout: "",
  notes: "",
};

const BookModal = ({
  service,
  onClose,
}: {
  service: ServiceWithMeta;
  onClose: () => void;
}) => {
  const [form, setForm] = useState<BookForm>(EMPTY_BOOK);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const set = <K extends keyof BookForm>(k: K, v: BookForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name || !form.checkin || !form.checkout) {
      toast.error("Please fill all required fields.");
      return;
    }
    // TODO: wire to bookingsService.create({ ...form, service_id: service.id, room_type: service.title })
    toast.success(`Booking created for ${form.customer_name}!`);
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-5"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[440px] overflow-hidden"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }}
      >
        {/* Blue header */}
        <div className="bg-[#0B73B7] px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1">
              Book Now
            </p>
            <p
              className="text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {service.title}
            </p>
            <p className="text-sm text-white/80 mt-0.5">
              {formatPrice(service.price)} / stay
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-4">
            <label className={labelCls}>Customer Name *</label>
            <input
              className={inputCls}
              value={form.customer_name}
              onChange={(e) => set("customer_name", e.target.value)}
              placeholder="Full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelCls}>Check-in *</label>
              <input
                type="date"
                className={inputCls}
                value={form.checkin}
                onChange={(e) => set("checkin", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Check-out *</label>
              <input
                type="date"
                className={inputCls}
                value={form.checkout}
                onChange={(e) => set("checkout", e.target.value)}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className={labelCls}>Notes (optional)</label>
            <textarea
              className={inputCls + " resize-y min-h-[70px]"}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Any special requests..."
              rows={2}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-[10px] border-[1.5px] border-gray-200 bg-white text-gray-700 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] py-2.5 rounded-[10px] bg-[#89c441] text-white text-sm font-bold hover:bg-[#6fa832] transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Service Card ─────────────────────────────────────────────────────────────
interface CardProps {
  service: ServiceWithMeta;
  onEdit: (s: ServiceWithMeta) => void;
  onDelete: (id: string) => void;
  onToggle: (s: ServiceWithMeta) => void;
  onBook: (s: ServiceWithMeta) => void;
}

const ServiceCard = ({
  service,
  onEdit,
  onDelete,
  onToggle,
  onBook,
}: CardProps) => {
  const cat = CAT_COLORS[service.category ?? "Rooms"] ?? CAT_COLORS.Rooms;
  const isActive = service.status === "active";

  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Top color band */}
      {/* <div
        style={{ height: 2, background: isActive ? "var(--primary)" : "#d1d5db" }}
      /> */}

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex gap-1.5 flex-wrap mb-2">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: cat.bg, color: cat.color }}
              >
                {service.category ?? "Rooms"}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                {service.branch ?? "—"}
              </span>
            </div>
            <h3
              className="text-[15px] font-bold text-gray-900 leading-snug"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {service.title}
            </h3>
          </div>
          <StatusBadge status={service.status} />
        </div>

        {/* Description */}
        <p className="text-[13px] text-gray-500 leading-relaxed mb-4 flex-1">
          {service.description || "No description provided."}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4">
          <span
            className="text-xl font-bold"
            style={{
              color: isActive ? "#000" : "#9ca3af",
              fontFamily: "var(--font-heading)",
            }}
          >
            {formatPrice(service.price)}
          </span>
          <span className="text-xs text-gray-400">/stay</span>
        </div>

        {/* Book Now */}
        <button
          onClick={() => onBook(service)}
          disabled={!isActive}
          className={`w-full py-2.5 rounded-[9px] text-sm font-bold flex items-center justify-center gap-2 mb-3 transition-colors border
    ${
      isActive
        ? "border-primary text-primary bg-white hover:bg-primary hover:text-white"
        : "border-gray-300 text-gray-400 bg-white cursor-not-allowed"
    }
  `}
        >
          <BookOpen size={14} />
          {isActive ? "Book Now" : "Unavailable"}
        </button>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Toggle checked={isActive} onChange={() => onToggle(service)} />
          <span className="text-xs text-gray-500">
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(service)}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 transition-all hover:text-primary hover:border-primary hover:bg-[#E6F1FB]"
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(service.id)}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 transition-all hover:text-[#993C1D] hover:border-[#993C1D] hover:bg-[#FAECE7]"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// IMPORTANT: ALL hooks are declared FIRST — no early returns before hooks end
// ═══════════════════════════════════════════════════════════════════════════════
const ServiceManagement = () => {
  // ── Declare every hook unconditionally at the top ─────────────────────────
  const [services, setServices] = useState<ServiceWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCat] = useState("All");
  const [branchFilter, setBranch] = useState("All Branches");
  const [statusFilter, setStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingSvc, setEditingSvc] = useState<ServiceWithMeta | null>(null);
  const [bookingSvc, setBookingSvc] = useState<ServiceWithMeta | null>(null);

  const openAdd = useCallback(() => {
    setEditingSvc(null);
    setShowModal(true);
  }, []);
  const openEdit = useCallback((s: ServiceWithMeta) => {
    setEditingSvc(s);
    setShowModal(true);
  }, []);
  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingSvc(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await servicesService.getAll();
        if (cancelled) return;
        const withMeta: ServiceWithMeta[] = data.map((s, i) => ({
          ...s,
          category:
            (s as ServiceWithMeta).category ?? DEFAULT_CATS[i] ?? "Rooms",
          branch:
            (s as ServiceWithMeta).branch ?? DEFAULT_BRANCH[i] ?? "Branch A",
        }));
        setServices(withMeta);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          toast.error("Failed to load services.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Derived values (no hooks below this line) ─────────────────────────────
  const filtered = services.filter((s) => {
    const q = search.toLowerCase();
    return (
      (!q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)) &&
      (catFilter === "All" || s.category === catFilter) &&
      (branchFilter === "All Branches" || s.branch === branchFilter) &&
      (statusFilter === "All" || s.status === statusFilter)
    );
  });

  const hasFilter =
    search ||
    catFilter !== "All" ||
    branchFilter !== "All Branches" ||
    statusFilter !== "All";

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = (form: ServiceForm) => {
    const payload: ServiceWithMeta = {
      id: editingSvc?.id ?? genId(),
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      status: form.status,
      category: form.category,
      branch: form.branch,
    };
    // TODO: replace local state update with API call
    // e.g. editingSvc ? await servicesService.update(editingSvc.id, payload) : await servicesService.create(payload)
    if (editingSvc) {
      setServices((prev) =>
        prev.map((s) => (s.id === editingSvc.id ? payload : s)),
      );
      toast.success("Service updated!");
    } else {
      setServices((prev) => [...prev, payload]);
      toast.success("Service added!");
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this service? This cannot be undone.")) return;
    // TODO: await servicesService.delete(id)
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast.success("Service deleted.");
  };

  const handleToggle = (service: ServiceWithMeta) => {
    const next = service.status === "active" ? "inactive" : "active";
    // TODO: await servicesService.update(service.id, { status: next })
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, status: next } : s)),
    );
    toast.success(`Marked as ${next}.`);
  };

  // ── NOW safe to do conditional render (after all hooks) ───────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        Loading services...
      </div>
    );
  }

  return (
    <>
      <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(10px) scale(0.98)}to{opacity:1;transform:none}}`}</style>

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <h1
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Services Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage hotel room types, amenities and services.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-primary text-white text-sm font-bold hover:bg-primary/80 transition-colors"
        >
          <Plus size={15} /> Add Service
        </button>
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white flex gap-10  items-start border border-gray-200 rounded-xl p-4 mb-5">
        {/* Search Section (50%) */}
        <div className="w-[60%]">
          <div className="flex items-center gap-2 bg-gray-50 border-[1.5px] border-gray-200 rounded-[9px] px-3 py-2.5">
            <Search size={14} className="text-gray-400 flex-shrink-0" />

            <input
              type="text"
              placeholder="Search services by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-none bg-transparent outline-none text-sm text-gray-800"
              style={{ fontFamily: "var(--font-body)" }}
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filters Section (Remaining width) */}
        <div className="flex-1 flex gap-2 flex-wrap items-center">
          {/* Category */}
          <div className="relative">
            <select
              value={catFilter}
              onChange={(e) => setCat(e.target.value)}
              className={dropdownCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Categories" : c}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Branch */}
          <div className="relative">
            <select
              value={branchFilter}
              onChange={(e) => setBranch(e.target.value)}
              className={dropdownCls}
            >
              {BRANCHES.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatus(e.target.value)}
              className={dropdownCls}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "All"
                    ? "All Statuses"
                    : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Reset */}
          {hasFilter && (
            <button
              onClick={() => {
                setSearch("");
                setCat("All");
                setBranch("All Branches");
                setStatus("All");
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-[9px] text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <X size={13} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Services Grid ── */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))" }}
      >
        {filtered.length === 0 ? (
          <EmptyState onAdd={openAdd} />
        ) : (
          filtered.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onBook={setBookingSvc}
            />
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-center text-xs text-gray-400 mt-4">
          Showing {filtered.length} of {services.length} services
        </p>
      )}

      {/* ── Add / Edit Modal ── */}
      <ServiceModal
        isOpen={showModal}
        onClose={closeModal}
        editing={editingSvc}
        onSave={handleSave}
      />

      {/* ── Book Now Modal ── */}
      {bookingSvc && (
        <BookModal service={bookingSvc} onClose={() => setBookingSvc(null)} />
      )}
    </>
  );
};

export default ServiceManagement;
