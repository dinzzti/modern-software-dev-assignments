/*
  # Create Leave Management System Schema

  ## Overview
  This migration creates the core table for the Si-Cuti Leave Management System,
  which allows employees to submit, track, and manage leave requests.

  ## New Tables
  
  ### `leave_requests`
  Stores all employee leave requests with complete audit trail.
  
  - `id` (uuid, primary key) - Unique identifier for each leave request
  - `employee_name` (text, required) - Name of the employee requesting leave
  - `leave_type` (text, required) - Type of leave (Cuti Tahunan, Cuti Sakit, etc.)
  - `start_date` (date, required) - First day of leave
  - `end_date` (date, required) - Last day of leave
  - `reason` (text, required) - Detailed reason for the leave request
  - `status` (text, default 'Pending') - Current status: Pending, Approved, or Rejected
  - `created_at` (timestamptz) - Timestamp when the request was created
  - `updated_at` (timestamptz) - Timestamp when the request was last modified

  ## Security
  
  1. Enable RLS on `leave_requests` table
  2. Create policies for public access (since we're building a demo app):
     - Allow anyone to view all leave requests
     - Allow anyone to create new leave requests
     - Allow anyone to update existing leave requests
     - Allow anyone to delete leave requests
  
  ## Notes
  
  - All leave types supported: Cuti Tahunan, Cuti Sakit, Cuti Alasan Penting, Cuti Melahirkan, Cuti Besar
  - Default status is 'Pending' for new requests
  - Timestamps are automatically managed for audit purposes
*/

-- Create leave_requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name text NOT NULL,
  leave_type text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for demo purposes (public access)
CREATE POLICY "Anyone can view leave requests"
  ON leave_requests
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create leave requests"
  ON leave_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update leave requests"
  ON leave_requests
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete leave requests"
  ON leave_requests
  FOR DELETE
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_created_at ON leave_requests(created_at DESC);

-- Insert sample data for initial demo
INSERT INTO leave_requests (employee_name, leave_type, start_date, end_date, reason, status) VALUES
  ('Ahmad Zulkifli', 'Cuti Tahunan', '2026-03-15', '2026-03-20', 'Family vacation to Langkawi', 'Approved'),
  ('Siti Nurhaliza', 'Cuti Sakit', '2026-03-10', '2026-03-12', 'Recovering from flu', 'Pending'),
  ('Raj Kumar', 'Cuti Alasan Penting', '2026-03-18', '2026-03-19', 'Attending family wedding ceremony', 'Pending');
