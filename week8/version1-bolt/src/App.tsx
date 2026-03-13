import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar } from 'lucide-react';
import { supabase } from './lib/supabase';
import { LeaveRequest, CreateLeaveRequest } from './types/leave';
import { SummaryCards } from './components/SummaryCards';
import { LeaveTable } from './components/LeaveTable';
import { CreateLeaveModal } from './components/CreateLeaveModal';
import { EditLeaveModal } from './components/EditLeaveModal';
import { DeleteConfirmation } from './components/DeleteConfirmation';
import { Toast, ToastType } from './components/Toast';

function App() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [deleteRequestId, setDeleteRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      showToast('Failed to load leave requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const handleCreate = async (newRequest: CreateLeaveRequest) => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .insert([{ ...newRequest, status: 'Pending' }])
        .select()
        .single();

      if (error) throw error;

      setRequests([data, ...requests]);
      showToast('Leave request created successfully', 'success');
    } catch (error) {
      console.error('Error creating leave request:', error);
      showToast('Failed to create leave request', 'error');
    }
  };

  const handleEdit = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (id: string, updates: Partial<LeaveRequest>) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setRequests(
        requests.map((req) =>
          req.id === id ? { ...req, ...updates, updated_at: new Date().toISOString() } : req
        )
      );
      showToast('Leave request updated successfully', 'success');
    } catch (error) {
      console.error('Error updating leave request:', error);
      showToast('Failed to update leave request', 'error');
    }
  };

  const handleDelete = (id: string) => {
    const request = requests.find((req) => req.id === id);
    if (request) {
      setDeleteRequestId(id);
      setSelectedRequest(request);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!deleteRequestId) return;

    try {
      const { error } = await supabase.from('leave_requests').delete().eq('id', deleteRequestId);

      if (error) throw error;

      setRequests(requests.filter((req) => req.id !== deleteRequestId));
      showToast('Leave request deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting leave request:', error);
      showToast('Failed to delete leave request', 'error');
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteRequestId(null);
      setSelectedRequest(null);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ status: 'Approved', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setRequests(
        requests.map((req) =>
          req.id === id ? { ...req, status: 'Approved', updated_at: new Date().toISOString() } : req
        )
      );
      showToast('Leave request approved', 'success');
    } catch (error) {
      console.error('Error approving leave request:', error);
      showToast('Failed to approve leave request', 'error');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ status: 'Rejected', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setRequests(
        requests.map((req) =>
          req.id === id ? { ...req, status: 'Rejected', updated_at: new Date().toISOString() } : req
        )
      );
      showToast('Leave request rejected', 'success');
    } catch (error) {
      console.error('Error rejecting leave request:', error);
      showToast('Failed to reject leave request', 'error');
    }
  };

  const totalRequests = requests.length;
  const pendingApprovals = requests.filter((req) => req.status === 'Pending').length;
  const approvedLeaves = requests.filter((req) => req.status === 'Approved').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600 font-medium">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg shadow-blue-500/30">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Si-Cuti</h1>
                <p className="text-sm text-slate-600">Leave Management System</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-150 shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Leave Request</span>
              <span className="sm:hidden">New</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SummaryCards
          totalRequests={totalRequests}
          pendingApprovals={pendingApprovals}
          approvedLeaves={approvedLeaves}
        />

        <LeaveTable
          requests={requests}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>

      <CreateLeaveModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      <EditLeaveModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRequest(null);
        }}
        onUpdate={handleUpdate}
        request={selectedRequest}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteRequestId(null);
          setSelectedRequest(null);
        }}
        onConfirm={confirmDelete}
        employeeName={selectedRequest?.employee_name || ''}
      />
    </div>
  );
}

export default App;
