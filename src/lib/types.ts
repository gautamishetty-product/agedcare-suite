// Core types for the Clinical Information System

export interface Resident {
  id: string;
  fullName: string;
  preferredName?: string;
  dateOfBirth: string;
  medicareNumber?: string;
  ndisNumber?: string;
  roomNumber?: string;
  bedNumber?: string;
  status: 'permanent' | 'respite' | 'home' | 'discharged';
  photoUrl?: string;
  allergies: string[];
  diagnoses: Diagnosis[];
  hasAdvanceDirective: boolean;
  isInfectionControl: boolean;
  cognitiveStatus: string;
  mobilityStatus: string;
  lastVitalsDate?: string;
  nextReviewDate?: string;
}

export interface Diagnosis {
  id: string;
  icd10Code?: string;
  title: string;
  onsetDate: string;
  notes?: string;
  active: boolean;
}

export interface Medication {
  id: string;
  residentId: string;
  genericName: string;
  brandName?: string;
  route: string;
  dose: string;
  schedule: string;
  isPRN: boolean;
  startDate: string;
  endDate?: string;
  allergyCrosscheck: boolean;
}

export interface Observation {
  id: string;
  residentId: string;
  type: 'BP' | 'HR' | 'RR' | 'SPO2' | 'TEMP' | 'PAIN' | 'WEIGHT' | 'BSL';
  value: string;
  unit: string;
  recordedAt: string;
  recordedBy: string;
  thresholdFlag?: 'HIGH' | 'LOW' | 'CRITICAL';
}

export interface Wound {
  id: string;
  residentId: string;
  location: string;
  stage: '1' | '2' | '3' | '4' | 'Unstageable' | 'DTI';
  length: number;
  width: number;
  depth?: number;
  status: 'New' | 'Improving' | 'Stable' | 'Deteriorating' | 'Healed';
  photos: string[];
  lastAssessment: string;
  nextDressingDue?: string;
}

export interface Incident {
  id: string;
  residentId: string;
  type: 'Fall' | 'Injury' | 'Medication Error' | 'Behavioral' | 'Missing Person' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  injuryDetails?: string;
  witnessNames: string[];
  immediateActions: string;
  familyNotified: boolean;
  doctorNotified: boolean;
  occurredAt: string;
  reportedBy: string;
}

export interface CarePlan {
  id: string;
  residentId: string;
  problem: string;
  goals: string[];
  interventions: string[];
  ownerRole: 'RN' | 'EN' | 'PCW' | 'ALLIED_HEALTH';
  startDate: string;
  reviewDate: string;
  status: 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
}

export interface Task {
  id: string;
  residentId?: string;
  title: string;
  description?: string;
  type: 'Clinical' | 'Administrative' | 'Social' | 'Maintenance';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedRole: 'RN' | 'EN' | 'PCW' | 'ALLIED_HEALTH' | 'ADMIN';
  dueAt: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  completedBy?: string;
  completedAt?: string;
}

export interface ProgressNote {
  id: string;
  residentId: string;
  type: 'Clinical' | 'Social' | 'Behavioral' | 'General';
  content: string;
  recordedBy: string;
  recordedAt: string;
  isConfidential: boolean;
}

export type UserRole = 'ADMIN' | 'FACILITY_MANAGER' | 'RN' | 'EN' | 'PCW' | 'ALLIED_HEALTH' | 'FAMILY';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}