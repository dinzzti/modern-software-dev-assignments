import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CreateLeaveRequest, LeaveType } from '../types/leave';

interface CreateLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (request: CreateLeaveRequest) => void;
}

const leaveTypes: LeaveType[] = [
  'Cuti Tahunan',
  'Cuti Sakit',
  'Cuti Alasan Penting',
  'Cuti Melahirkan',
  'Cuti Besar',
];

export function CreateLeaveModal({ isOpen, onClose, onCreate }: CreateLeaveModalProps) {
  const [formData, setFormData] = useState<CreateLeaveRequest>({
    employee_name: '',
    leave_type: 'Cuti Tahunan',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.employee_name.trim()) {
      newErrors.employee_name = 'Employee name is required';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }
    if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
      newErrors.end_date = 'End date cannot be before start date';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onCreate(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      employee_name: '',
      leave_type: 'Cuti Tahunan',
      start_date: '',
      end_date: '',
      reason: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-slate-900">New Leave Request</h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-150"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="employee_name" className="block text-sm font-semibold text-slate-700 mb-2">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    id="employee_name"
                    value={formData.employee_name}
                    onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                    className={`w-full px-4 py-3 border ${
                      errors.employee_name ? 'border-red-300' : 'border-slate-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-150`}
                    placeholder="Enter employee name"
                  />
                  {errors.employee_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.employee_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="leave_type" className="block text-sm font-semibold text-slate-700 mb-2">
                    Leave Type
                  </label>
                  <select
                    id="leave_type"
                    value={formData.leave_type}
                    onChange={(e) => setFormData({ ...formData, leave_type: e.target.value as LeaveType })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-150"
                  >
                    {leaveTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start_date" className="block text-sm font-semibold text-slate-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="start_date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.start_date ? 'border-red-300' : 'border-slate-300'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-150`}
                    />
                    {errors.start_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="end_date" className="block text-sm font-semibold text-slate-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="end_date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.end_date ? 'border-red-300' : 'border-slate-300'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-150`}
                    />
                    {errors.end_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-semibold text-slate-700 mb-2">
                    Reason
                  </label>
                  <textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-3 border ${
                      errors.reason ? 'border-red-300' : 'border-slate-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-150 resize-none`}
                    placeholder="Please provide a detailed reason for your leave request"
                  />
                  {errors.reason && (
                    <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-150 shadow-lg shadow-blue-500/30"
                  >
                    Create Request
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
