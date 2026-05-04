import React, { useEffect, useState } from 'react';
import { bookingsService } from '../services/dataService';
import type { Booking } from '../types';
import { Trash2, Edit, Plus, FileText, Download } from 'lucide-react';

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    hotel_name: '',
    room_type: '',
    booking_date: '',
    checkin_date: '',
    checkout_date: '',
    total_amount: '',
    status: 'pending' as Booking['status'],
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingsService.getAll();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (booking?: Booking) => {
    if (booking) {
      setEditingBooking(booking);
      setFormData({
        customer_name: booking.customer_name,
        customer_email: booking.customer_email || '',
        customer_phone: booking.customer_phone || '',
        hotel_name: booking.hotel_name,
        room_type: booking.room_type,
        booking_date: booking.booking_date,
        checkin_date: booking.checkin_date,
        checkout_date: booking.checkout_date,
        total_amount: booking.total_amount.toString(),
        status: booking.status,
      });
    } else {
      setEditingBooking(null);
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        hotel_name: '',
        room_type: '',
        booking_date: new Date().toISOString().split('T')[0],
        checkin_date: '',
        checkout_date: '',
        total_amount: '',
        status: 'pending',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
    setShowModal(false);
    loadBookings();
  };

  const handleDelete = (bookingId: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      console.log('Deleting booking:', bookingId);
      loadBookings();
    }
  };

  const generateBookingSlip = (booking: Booking) => {
    const slipHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Booking Slip #${booking.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .header h1 { margin: 0; color: #333; }
          .header p { margin: 5px 0; color: #666; }
          .section { margin: 20px 0; }
          .section h3 { background: #f0f0f0; padding: 10px; margin: 0; }
          .section-content { padding: 15px; border: 1px solid #ddd; border-top: none; }
          .row { display: flex; justify-content: space-between; margin: 10px 0; }
          .label { font-weight: bold; color: #333; }
          .value { color: #666; }
          .total { background: #f9f9f9; padding: 15px; margin-top: 20px; border: 2px solid #333; }
          .total-amount { font-size: 24px; font-weight: bold; color: #2563eb; }
          .footer { text-align: center; margin-top: 40px; color: #999; font-size: 12px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Hotel Management System</h1>
          <p>BOOKING CONFIRMATION SLIP</p>
          <p>Booking ID: <strong>#${booking.id}</strong></p>
        </div>

        <div class="section">
          <h3>Customer Information</h3>
          <div class="section-content">
            <div class="row">
              <span class="label">Name:</span>
              <span class="value">${booking.customer_name}</span>
            </div>
            <div class="row">
              <span class="label">Email:</span>
              <span class="value">${booking.customer_email || 'N/A'}</span>
            </div>
            <div class="row">
              <span class="label">Phone:</span>
              <span class="value">${booking.customer_phone || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Booking Details</h3>
          <div class="section-content">
            <div class="row">
              <span class="label">Hotel Name:</span>
              <span class="value">${booking.hotel_name}</span>
            </div>
            <div class="row">
              <span class="label">Room Type:</span>
              <span class="value">${booking.room_type}</span>
            </div>
            <div class="row">
              <span class="label">Booking Date:</span>
              <span class="value">${new Date(booking.booking_date).toLocaleDateString()}</span>
            </div>
            <div class="row">
              <span class="label">Check-in Date:</span>
              <span class="value">${new Date(booking.checkin_date).toLocaleDateString()}</span>
            </div>
            <div class="row">
              <span class="label">Check-out Date:</span>
              <span class="value">${new Date(booking.checkout_date).toLocaleDateString()}</span>
            </div>
            <div class="row">
              <span class="label">Status:</span>
              <span class="value"><strong>${booking.status.toUpperCase()}</strong></span>
            </div>
          </div>
        </div>

        <div class="total">
          <div class="row">
            <span class="label">Total Amount:</span>
            <span class="total-amount">$${booking.total_amount.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated booking confirmation. Please retain for your records.</p>
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(slipHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const downloadBookingSlip = (booking: Booking) => {
    const slipText = `
HOTEL MANAGEMENT SYSTEM - BOOKING CONFIRMATION SLIP
==================================================

Booking ID: #${booking.id}
Booking Date: ${new Date(booking.booking_date).toLocaleDateString()}

CUSTOMER INFORMATION
-------------------
Name: ${booking.customer_name}
Email: ${booking.customer_email || 'N/A'}
Phone: ${booking.customer_phone || 'N/A'}

BOOKING DETAILS
---------------
Hotel Name: ${booking.hotel_name}
Room Type: ${booking.room_type}
Check-in: ${new Date(booking.checkin_date).toLocaleDateString()}
Check-out: ${new Date(booking.checkout_date).toLocaleDateString()}
Status: ${booking.status.toUpperCase()}

PAYMENT INFORMATION
------------------
Total Amount: $${booking.total_amount.toFixed(2)}

Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(slipText));
    element.setAttribute('download', `booking-${booking.id}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return <div className="text-center py-12">Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600 mt-1">Manage all hotel bookings</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Booking</span>
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Hotel</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                  Room Type
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                  Check-in
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-center py-3 px-6 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-6 text-sm font-medium text-gray-900">
                    {booking.customer_name}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-600">{booking.hotel_name}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">{booking.room_type}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">
                    {new Date(booking.checkin_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-sm font-semibold text-gray-900">
                    ${booking.total_amount}
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => generateBookingSlip(booking)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Print Slip"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadBookingSlip(booking)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Download Slip"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(booking)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {editingBooking ? 'Edit Booking' : 'Add New Booking'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.customer_phone}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hotel Name
                    </label>
                    <input
                      type="text"
                      value={formData.hotel_name}
                      onChange={(e) =>
                        setFormData({ ...formData, hotel_name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type
                    </label>
                    <input
                      type="text"
                      value={formData.room_type}
                      onChange={(e) =>
                        setFormData({ ...formData, room_type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      value={formData.total_amount}
                      onChange={(e) =>
                        setFormData({ ...formData, total_amount: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Booking Date
                    </label>
                    <input
                      type="date"
                      value={formData.booking_date}
                      onChange={(e) =>
                        setFormData({ ...formData, booking_date: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      value={formData.checkin_date}
                      onChange={(e) =>
                        setFormData({ ...formData, checkin_date: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      value={formData.checkout_date}
                      onChange={(e) =>
                        setFormData({ ...formData, checkout_date: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as Booking['status'],
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    {editingBooking ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
