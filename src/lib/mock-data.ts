import { Resident, Medication, Observation, Wound, Incident, CarePlan, Task, ProgressNote } from './types';

// Mock residents with realistic Australian data
export const mockResidents: Resident[] = [
  {
    id: '1',
    fullName: 'Margaret Rose Thompson',
    preferredName: 'Maggie',
    dateOfBirth: '1935-03-15',
    medicareNumber: '2234567891',
    ndisNumber: 'NDI-2234567891-AB',
    roomNumber: '12A',
    bedNumber: '1',
    status: 'permanent',
    photoUrl: '/placeholder.svg',
    allergies: ['Penicillin', 'Shellfish'],
    diagnoses: [
      { id: '1', icd10Code: 'F03.90', title: 'Dementia, unspecified', onsetDate: '2021-08-15', active: true },
      { id: '2', icd10Code: 'I10', title: 'Essential hypertension', onsetDate: '2018-03-20', active: true }
    ],
    hasAdvanceDirective: true,
    isInfectionControl: false,
    cognitiveStatus: 'Moderate cognitive impairment',
    mobilityStatus: 'Requires assistance with walking',
    lastVitalsDate: '2024-01-15T10:30:00Z',
    nextReviewDate: '2024-02-01'
  },
  {
    id: '2',
    fullName: 'James Patrick O\'Brien',
    preferredName: 'Jim',
    dateOfBirth: '1942-07-22',
    medicareNumber: '3345678902',
    roomNumber: '15B',
    bedNumber: '2',
    status: 'permanent',
    allergies: ['Aspirin'],
    diagnoses: [
      { id: '3', icd10Code: 'G30.9', title: 'Alzheimer\'s disease, unspecified', onsetDate: '2020-01-10', active: true }
    ],
    hasAdvanceDirective: false,
    isInfectionControl: true,
    cognitiveStatus: 'Severe cognitive impairment',
    mobilityStatus: 'Wheelchair dependent',
    lastVitalsDate: '2024-01-15T14:00:00Z',
    nextReviewDate: '2024-01-28'
  },
  {
    id: '3',
    fullName: 'Dorothy May Wilson',
    preferredName: 'Dot',
    dateOfBirth: '1938-11-08',
    medicareNumber: '4456789013',
    ndisNumber: 'NDI-4456789013-CD',
    roomNumber: '8A',
    bedNumber: '1',
    status: 'respite',
    allergies: [],
    diagnoses: [
      { id: '4', icd10Code: 'M79.3', title: 'Panniculitis, unspecified', onsetDate: '2023-05-12', active: true }
    ],
    hasAdvanceDirective: true,
    isInfectionControl: false,
    cognitiveStatus: 'Intact',
    mobilityStatus: 'Independent with walking aid',
    lastVitalsDate: '2024-01-15T08:15:00Z',
    nextReviewDate: '2024-01-20'
  },
  {
    id: '4',
    fullName: 'Robert Charles Davies',
    preferredName: 'Bob',
    dateOfBirth: '1940-04-18',
    medicareNumber: '5567890124',
    roomNumber: '22C',
    status: 'permanent',
    allergies: ['Morphine', 'Latex'],
    diagnoses: [
      { id: '5', icd10Code: 'C78.00', title: 'Secondary malignant neoplasm', onsetDate: '2023-09-03', active: true }
    ],
    hasAdvanceDirective: true,
    isInfectionControl: false,
    cognitiveStatus: 'Intact',
    mobilityStatus: 'Bed bound',
    lastVitalsDate: '2024-01-15T16:45:00Z',
    nextReviewDate: '2024-01-18'
  }
];

export const mockMedications: Medication[] = [
  {
    id: '1',
    residentId: '1',
    genericName: 'Amlodipine',
    brandName: 'Norvasc',
    route: 'Oral',
    dose: '5mg',
    schedule: 'Once daily at 8:00 AM',
    isPRN: false,
    startDate: '2024-01-01',
    allergyCrosscheck: true
  },
  {
    id: '2',
    residentId: '1',
    genericName: 'Paracetamol',
    route: 'Oral',
    dose: '500mg',
    schedule: 'PRN for pain',
    isPRN: true,
    startDate: '2024-01-01',
    allergyCrosscheck: true
  },
  {
    id: '3',
    residentId: '2',
    genericName: 'Donepezil',
    brandName: 'Aricept',
    route: 'Oral',
    dose: '10mg',
    schedule: 'Once daily at bedtime',
    isPRN: false,
    startDate: '2023-12-15',
    allergyCrosscheck: true
  }
];

export const mockObservations: Observation[] = [
  {
    id: '1',
    residentId: '1',
    type: 'BP',
    value: '145/90',
    unit: 'mmHg',
    recordedAt: '2024-01-15T10:30:00Z',
    recordedBy: 'Sarah Johnson, RN',
    thresholdFlag: 'HIGH'
  },
  {
    id: '2',
    residentId: '1',
    type: 'TEMP',
    value: '36.8',
    unit: '°C',
    recordedAt: '2024-01-15T10:30:00Z',
    recordedBy: 'Sarah Johnson, RN'
  },
  {
    id: '3',
    residentId: '2',
    type: 'SPO2',
    value: '94',
    unit: '%',
    recordedAt: '2024-01-15T14:00:00Z',
    recordedBy: 'Michael Chen, EN',
    thresholdFlag: 'LOW'
  }
];

export const mockWounds: Wound[] = [
  {
    id: '1',
    residentId: '4',
    location: 'Left heel',
    stage: '2',
    length: 3.2,
    width: 2.1,
    depth: 0.5,
    status: 'Improving',
    photos: ['/placeholder.svg'],
    lastAssessment: '2024-01-14T09:00:00Z',
    nextDressingDue: '2024-01-16T09:00:00Z'
  },
  {
    id: '2',
    residentId: '1',
    location: 'Sacrum',
    stage: '1',
    length: 2.5,
    width: 1.8,
    status: 'Stable',
    photos: [],
    lastAssessment: '2024-01-13T15:30:00Z',
    nextDressingDue: '2024-01-17T15:30:00Z'
  }
];

export const mockIncidents: Incident[] = [
  {
    id: '1',
    residentId: '2',
    type: 'Fall',
    severity: 'Medium',
    description: 'Resident found on floor beside bed. No obvious injury noted.',
    witnessNames: ['Emma Wilson, PCW'],
    immediateActions: 'Resident assisted back to bed, vital signs checked, family notified',
    familyNotified: true,
    doctorNotified: true,
    occurredAt: '2024-01-14T22:15:00Z',
    reportedBy: 'Emma Wilson, PCW'
  },
  {
    id: '2',
    residentId: '3',
    type: 'Medication Error',
    severity: 'Low',
    description: 'Medication administered 30 minutes late due to staff shortage',
    witnessNames: [],
    immediateActions: 'Medication given, incident documented, supervisor notified',
    familyNotified: false,
    doctorNotified: false,
    occurredAt: '2024-01-13T08:30:00Z',
    reportedBy: 'David Smith, EN'
  }
];

export const mockCarePlans: CarePlan[] = [
  {
    id: '1',
    residentId: '1',
    problem: 'Risk of falls due to cognitive impairment',
    goals: ['Prevent falls', 'Maintain mobility', 'Ensure safety'],
    interventions: ['Bed alarm activated', 'Regular toileting rounds', 'Clear pathways'],
    ownerRole: 'RN',
    startDate: '2024-01-01',
    reviewDate: '2024-02-01',
    status: 'Active'
  },
  {
    id: '2',
    residentId: '4',
    problem: 'Pressure injury prevention',
    goals: ['Prevent pressure injuries', 'Maintain skin integrity'],
    interventions: ['2-hourly turns', 'Pressure relieving mattress', 'Skin assessment daily'],
    ownerRole: 'RN',
    startDate: '2024-01-10',
    reviewDate: '2024-02-10',
    status: 'Active'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    residentId: '1',
    title: 'Wound dressing change',
    description: 'Change dressing on sacral pressure injury',
    type: 'Clinical',
    priority: 'High',
    assignedRole: 'RN',
    dueAt: '2024-01-16T09:00:00Z',
    status: 'Pending'
  },
  {
    id: '2',
    residentId: '2',
    title: 'GP review appointment',
    description: 'Schedule GP review for medication changes',
    type: 'Administrative',
    priority: 'Medium',
    assignedRole: 'ADMIN',
    dueAt: '2024-01-18T10:00:00Z',
    status: 'Pending'
  },
  {
    id: '3',
    title: 'Staff meeting preparation',
    type: 'Administrative',
    priority: 'Low',
    assignedRole: 'ADMIN',
    dueAt: '2024-01-17T14:00:00Z',
    status: 'In Progress'
  }
];

export const mockProgressNotes: ProgressNote[] = [
  {
    id: '1',
    residentId: '1',
    type: 'Clinical',
    content: 'Resident appears comfortable today. Appetite good, participated in group activities. No concerning symptoms noted.',
    recordedBy: 'Sarah Johnson, RN',
    recordedAt: '2024-01-15T15:30:00Z',
    isConfidential: false
  },
  {
    id: '2',
    residentId: '2',
    type: 'Behavioral',
    content: 'Resident showed increased agitation during personal care. Distraction techniques used successfully.',
    recordedBy: 'Michael Chen, EN',
    recordedAt: '2024-01-15T11:00:00Z',
    isConfidential: true
  }
];

// Helper functions for mock API
export const getMockResident = (id: string) => mockResidents.find(r => r.id === id);
export const getMockMedicationsByResident = (residentId: string) => 
  mockMedications.filter(m => m.residentId === residentId);
export const getMockObservationsByResident = (residentId: string) => 
  mockObservations.filter(o => o.residentId === residentId);
export const getMockWoundsByResident = (residentId: string) => 
  mockWounds.filter(w => w.residentId === residentId);
export const getMockIncidentsByResident = (residentId: string) => 
  mockIncidents.filter(i => i.residentId === residentId);
export const getMockCarePlansByResident = (residentId: string) => 
  mockCarePlans.filter(cp => cp.residentId === residentId);
export const getMockTasksByResident = (residentId: string) => 
  mockTasks.filter(t => t.residentId === residentId);
export const getMockProgressNotesByResident = (residentId: string) => 
  mockProgressNotes.filter(pn => pn.residentId === residentId);