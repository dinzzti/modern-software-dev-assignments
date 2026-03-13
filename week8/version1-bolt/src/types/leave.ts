export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export type LeaveType =
  | 'Cuti Tahunan'
  | 'Cuti Sakit'
  | 'Cuti Alasan Penting'
  | 'Cuti Melahirkan'
  | 'Cuti Besar';

export interface LeaveRequest {
  id: string;
  employee_name: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  created_at?: string;
  updated_at?: string;
}

export interface CreateLeaveRequest {
  employee_name: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
}
