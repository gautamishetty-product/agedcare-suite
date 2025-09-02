// Support Plan specific types for daily care management

export type TimeSlot = 'AM' | 'PM' | 'Night' | 'PRN';
export type StaffRole = 'RN' | 'EN' | 'PCW' | 'ALLIED_HEALTH' | 'MANAGER';
export type TaskCategory = 'Mobility' | 'Bathing' | 'Meals' | 'Grooming' | 'Toileting' | 'Safety' | 'Lifestyle' | 'Custom';
export type SupportPlanStatus = 'DRAFT' | 'FINAL' | 'ARCHIVED';

export interface TaskTemplate {
  id: string;
  category: TaskCategory;
  title: string;
  description: string;
  defaultFrequency: string;
  defaultTimeSlots: TimeSlot[];
  defaultStaffRole: StaffRole;
  customizable: {
    frequency: boolean;
    timeSlots: boolean;
    instructions: boolean;
    staffRole: boolean;
  };
  requiresApproval: boolean;
}

export interface SupportTask {
  id: string;
  templateId: string;
  title: string;
  description: string;
  frequency: string;
  timeSlots: TimeSlot[];
  instructions: string;
  assignedRole: StaffRole;
  isActive: boolean;
  customizations?: {
    portionSize?: string;
    assistLevel?: '1x assist' | '2x assist' | 'Independent' | 'Supervision';
    equipment?: string[];
    preferences?: string;
  };
}

export interface SupportPlan {
  id: string;
  residentId: string;
  title: string;
  status: SupportPlanStatus;
  version: number;
  tasks: SupportTask[];
  facilityTemplate?: string;
  specialInstructions?: string;
  guardianSignatureRequired: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  finalizedBy?: string;
  finalizedAt?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
}

export interface SupportPlanAudit {
  id: string;
  supportPlanId: string;
  action: 'CREATED' | 'UPDATED' | 'FINALIZED' | 'ARCHIVED' | 'TASK_ADDED' | 'TASK_REMOVED' | 'TASK_MODIFIED';
  changes: Record<string, any>;
  performedBy: string;
  performedAt: string;
  roleAtTime: StaffRole;
}

export interface RolePermissions {
  role: StaffRole;
  canCreate: boolean;
  canEdit: boolean;
  canFinalize: boolean;
  canArchive: boolean;
  canViewAll: boolean;
  canExportPDF: boolean;
  restrictedFields?: string[];
}

export const ROLE_PERMISSIONS: Record<StaffRole, RolePermissions> = {
  RN: {
    role: 'RN',
    canCreate: true,
    canEdit: true,
    canFinalize: true,
    canArchive: true,
    canViewAll: true,
    canExportPDF: true
  },
  EN: {
    role: 'EN',
    canCreate: true,
    canEdit: true,
    canFinalize: false,
    canArchive: false,
    canViewAll: true,
    canExportPDF: false,
    restrictedFields: ['finalizedBy', 'finalizedAt']
  },
  PCW: {
    role: 'PCW',
    canCreate: false,
    canEdit: false,
    canFinalize: false,
    canArchive: false,
    canViewAll: true,
    canExportPDF: false,
    restrictedFields: ['specialInstructions', 'guardianSignatureRequired']
  },
  ALLIED_HEALTH: {
    role: 'ALLIED_HEALTH',
    canCreate: true,
    canEdit: true,
    canFinalize: false,
    canArchive: false,
    canViewAll: true,
    canExportPDF: false,
    restrictedFields: ['finalizedBy', 'finalizedAt']
  },
  MANAGER: {
    role: 'MANAGER',
    canCreate: false,
    canEdit: false,
    canFinalize: false,
    canArchive: true,
    canViewAll: true,
    canExportPDF: true,
    restrictedFields: ['tasks', 'specialInstructions']
  }
};