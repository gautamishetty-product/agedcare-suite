// Core types for the Clinical Information System

export interface Resident {
  id: string;
  fullName: string;
  preferredName?: string;
  dateOfBirth: string;
  medicareNumber?: string;
  ndisNumber?: string;
  pensionType?: string;
  roomNumber?: string;
  bedNumber?: string;
  status: 'permanent' | 'respite' | 'home' | 'discharged';
  photoUrl?: string;
  language?: string;
  culture?: string;
  religion?: string;
  nextOfKinId?: string;
  allergies: string[];
  diagnoses: Diagnosis[];
  hasAdvanceDirective: boolean;
  isInfectionControl: boolean;
  cognitiveStatus: string;
  mobilityStatus: string;
  lastVitalsDate?: string;
  nextReviewDate?: string;
}

export interface NextOfKin {
  id: string;
  residentId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
}

export interface ResidentAbout {
  id: string;
  residentId: string;
  bio?: string;
  preferences?: string;
  commsNeeds?: string;
  mobilityStatus: string;
  sensoryNeeds?: string;
  cognitiveStatus: string;
  psychosocialNotes?: string;
}

export interface ClinicalProfile {
  id: string;
  residentId: string;
  gpName?: string;
  medicalOfficer?: string;
  practiceContact?: string;
  allergies: string[];
  contraindications: string[];
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
  schedule: {
    times: string[];
    frequency: string;
    instructions?: string;
  };
  isPRN: boolean;
  startDate: string;
  endDate?: string;
  allergyCrosscheck: boolean;
}

export interface MAR {
  id: string;
  residentId: string;
  medicationId: string;
  adminTime: string;
  administeredBy: string;
  doseGiven: string;
  route: string;
  site?: string;
  signature: string;
  missedReason?: 'refused' | 'nausea' | 'asleep' | 'other';
  notes?: string;
}

export interface Observation {
  id: string;
  residentId: string;
  type: 'BP' | 'HR' | 'RR' | 'SPO2' | 'TEMP' | 'PAIN' | 'WEIGHT' | 'BSL' | 'CUSTOM';
  value: string;
  systolic?: number;
  diastolic?: number;
  unit: string;
  customType?: string;
  recordedAt: string;
  recordedBy: string;
  thresholdFlag?: 'HIGH' | 'LOW' | 'CRITICAL';
}

export interface BowelEvent {
  id: string;
  residentId: string;
  stoolType: 1 | 2 | 3 | 4 | 5 | 6 | 7; // Bristol Stool Chart
  time: string;
  notes?: string;
  recordedBy: string;
}

export interface Wound {
  id: string;
  residentId: string;
  location: string;
  stage: '1' | '2' | '3' | '4' | 'Unstageable' | 'DTI';
  size: {
    length: number;
    width: number;
    depth?: number;
    area?: number;
  };
  status: 'New' | 'Improving' | 'Stable' | 'Deteriorating' | 'Healed';
  photos: string[];
  lastAssessment: string;
  nextDressingDue?: string;
}

export interface WoundDressing {
  id: string;
  woundId: string;
  date: string;
  dressingType: string;
  notes?: string;
  photoUrl?: string;
  appliedBy: string;
}

export interface Incident {
  id: string;
  residentId: string;
  type: 'Fall' | 'Injury' | 'Medication Error' | 'Behavioral' | 'Missing Person' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  injuryDetails?: string;
  witnesses: {
    name: string;
    role: string;
    statement?: string;
  }[];
  immediateActions: string;
  notifications: {
    family: boolean;
    doctor: boolean;
    manager: boolean;
    time?: string;
  };
  rcaLink?: string;
  occurredAt: string;
  reportedBy: string;
}

export interface Assessment {
  id: string;
  residentId: string;
  instrument: 'MMSE' | 'MDS' | 'BRADEN' | 'MORSE' | 'WATERLOW' | 'OTHER';
  result: Record<string, any>;
  assessor: string;
  version: string;
  assessedAt: string;
  nextDue?: string;
}

export interface Referral {
  id: string;
  residentId: string;
  discipline: string;
  provider?: string;
  reason: string;
  notes?: string;
  attachments: string[];
  status: 'Pending' | 'Accepted' | 'Completed' | 'Declined';
  referredBy: string;
  referredAt: string;
  responseDate?: string;
}

export interface LegalFinancial {
  id: string;
  residentId: string;
  poaDetails?: {
    name: string;
    type: 'Financial' | 'Medical' | 'Both';
    contact: string;
    documents: string[];
  };
  guardianship?: {
    guardianName: string;
    type: 'Person' | 'Estate' | 'Both';
    contact: string;
    documents: string[];
  };
  bankMasked?: string;
  consentDocs: string[];
}

export interface EndOfLife {
  id: string;
  residentId: string;
  acd?: {
    hasDirective: boolean;
    documentUrl?: string;
    lastReviewed?: string;
  };
  resuscitationStatus: 'Full' | 'DNR' | 'Modified' | 'Not Documented';
  wishes: {
    placeOfDeath?: string;
    culturalRequirements?: string;
    spiritualCare?: string;
    familyInvolvement?: string;
    painManagement?: string;
  };
  lastReviewed?: string;
}

export interface Transfer {
  id: string;
  residentId: string;
  type: 'discharge' | 'inter-facility' | 'home';
  summary: string;
  destination?: string;
  date: string;
  reason: string;
  transferredBy: string;
  receivingFacility?: string;
  followUpRequired: boolean;
}

export interface AuditLog {
  id: string;
  actorUserId: string;
  action: string;
  entity: string;
  entityId: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  timestamp: string;
}

export interface CarePlan {
  id: string;
  residentId: string;
  title: string;
  summary?: string;
  status: CarePlanStatus;
  ownerRole: 'RN' | 'EN' | 'PCW' | 'ALLIED_HEALTH';
  reviewCadenceDays?: number;
  activeFrom?: string;
  activeTo?: string;
  currentRevisionId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type CarePlanStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'ACTIVE' | 'REJECTED' | 'ARCHIVED';

export interface CarePlanRevision {
  id: string;
  carePlanId: string;
  version: number;
  problems: CarePlanProblem[];
  goals: CarePlanGoal[];
  interventions: CarePlanIntervention[];
  risks: CarePlanRisk[];
  monitoring: CarePlanMonitoring[];
  familySummary?: string;
  notes?: string;
  effectiveFrom?: string;
  supersededAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface CarePlanProblem {
  title: string;
  narrative: string;
  evidence?: string;
  diagnosisLink?: string;
}

export interface CarePlanGoal {
  goal: string;
  metric: string;
  targetDate?: string;
  status: 'Not Started' | 'In Progress' | 'Achieved' | 'Not Achieved';
}

export interface CarePlanIntervention {
  action: string;
  frequency: string;
  responsibleRole: string;
  taskLink?: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface CarePlanRisk {
  risk: string;
  mitigation: string;
  escalation: string;
  level: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface CarePlanMonitoring {
  what: string;
  who: string;
  frequency: string;
  thresholds?: string;
  alertsEnabled: boolean;
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