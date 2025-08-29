import { Resident, Medication, Observation, Wound, Incident, CarePlan, CarePlanRevision, Task, ProgressNote } from './types';

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
    schedule: { times: ['08:00'], frequency: 'Once daily', instructions: 'Take with food' },
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
    schedule: { times: [], frequency: 'PRN', instructions: 'For pain relief as needed' },
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
    schedule: { times: ['21:00'], frequency: 'Once daily', instructions: 'Take at bedtime' },
    isPRN: false,
    startDate: '2023-12-15',
    allergyCrosscheck: true
  }
];

export const mockObservations: Observation[] = [
  // Recent observations (today)
  {
    id: '1',
    residentId: '1',
    type: 'BP',
    value: '145/90',
    unit: 'mmHg',
    recordedAt: '2024-01-15T14:30:00Z',
    recordedBy: 'Sarah Johnson, RN',
    thresholdFlag: 'HIGH'
  },
  {
    id: '2',
    residentId: '1',
    type: 'TEMP',
    value: '36.8',
    unit: '°C',
    recordedAt: '2024-01-15T14:30:00Z',
    recordedBy: 'Sarah Johnson, RN'
  },
  {
    id: '3',
    residentId: '1',
    type: 'HR',
    value: '78',
    unit: 'bpm',
    recordedAt: '2024-01-15T14:30:00Z',
    recordedBy: 'Sarah Johnson, RN'
  },
  {
    id: '4',
    residentId: '1',
    type: 'RR',
    value: '18',
    unit: '/min',
    recordedAt: '2024-01-15T14:30:00Z',
    recordedBy: 'Sarah Johnson, RN'
  },
  {
    id: '5',
    residentId: '1',
    type: 'SPO2',
    value: '97',
    unit: '%',
    recordedAt: '2024-01-15T14:30:00Z',
    recordedBy: 'Sarah Johnson, RN'
  },
  {
    id: '6',
    residentId: '1',
    type: 'WEIGHT',
    value: '68.5',
    unit: 'kg',
    recordedAt: '2024-01-15T14:30:00Z',
    recordedBy: 'Sarah Johnson, RN'
  },
  {
    id: '7',
    residentId: '1',
    type: 'BSL',
    value: '6.2',
    unit: 'mmol/L',
    recordedAt: '2024-01-15T14:30:00Z',
    recordedBy: 'Sarah Johnson, RN'
  },
  {
    id: '8',
    residentId: '1',
    type: 'PAIN',
    value: '3',
    unit: '/10',
    recordedAt: '2024-01-15T14:30:00Z',
    recordedBy: 'Sarah Johnson, RN'
  },

  // Morning observations (same day)
  {
    id: '9',
    residentId: '1',
    type: 'BP',
    value: '138/85',
    unit: 'mmHg',
    recordedAt: '2024-01-15T08:00:00Z',
    recordedBy: 'Emma Wilson, EN'
  },
  {
    id: '10',
    residentId: '1',
    type: 'TEMP',
    value: '36.6',
    unit: '°C',
    recordedAt: '2024-01-15T08:00:00Z',
    recordedBy: 'Emma Wilson, EN'
  },
  {
    id: '11',
    residentId: '1',
    type: 'HR',
    value: '82',
    unit: 'bpm',
    recordedAt: '2024-01-15T08:00:00Z',
    recordedBy: 'Emma Wilson, EN'
  },
  {
    id: '12',
    residentId: '1',
    type: 'SPO2',
    value: '98',
    unit: '%',
    recordedAt: '2024-01-15T08:00:00Z',
    recordedBy: 'Emma Wilson, EN'
  },

  // Yesterday's observations
  {
    id: '13',
    residentId: '1',
    type: 'BP',
    value: '142/88',
    unit: 'mmHg',
    recordedAt: '2024-01-14T20:00:00Z',
    recordedBy: 'Michael Chen, RN',
    thresholdFlag: 'HIGH'
  },
  {
    id: '14',
    residentId: '1',
    type: 'TEMP',
    value: '37.1',
    unit: '°C',
    recordedAt: '2024-01-14T20:00:00Z',
    recordedBy: 'Michael Chen, RN'
  },
  {
    id: '15',
    residentId: '1',
    type: 'HR',
    value: '85',
    unit: 'bpm',
    recordedAt: '2024-01-14T20:00:00Z',
    recordedBy: 'Michael Chen, RN'
  },
  {
    id: '16',
    residentId: '1',
    type: 'RR',
    value: '20',
    unit: '/min',
    recordedAt: '2024-01-14T20:00:00Z',
    recordedBy: 'Michael Chen, RN'
  },
  {
    id: '17',
    residentId: '1',
    type: 'SPO2',
    value: '96',
    unit: '%',
    recordedAt: '2024-01-14T20:00:00Z',
    recordedBy: 'Michael Chen, RN'
  },
  {
    id: '18',
    residentId: '1',
    type: 'PAIN',
    value: '5',
    unit: '/10',
    recordedAt: '2024-01-14T20:00:00Z',
    recordedBy: 'Michael Chen, RN',
    thresholdFlag: 'HIGH'
  },

  // Earlier yesterday
  {
    id: '19',
    residentId: '1',
    type: 'BP',
    value: '135/82',
    unit: 'mmHg',
    recordedAt: '2024-01-14T12:00:00Z',
    recordedBy: 'Lisa Anderson, EN'
  },
  {
    id: '20',
    residentId: '1',
    type: 'TEMP',
    value: '36.7',
    unit: '°C',
    recordedAt: '2024-01-14T12:00:00Z',
    recordedBy: 'Lisa Anderson, EN'
  },
  {
    id: '21',
    residentId: '1',
    type: 'WEIGHT',
    value: '68.3',
    unit: 'kg',
    recordedAt: '2024-01-14T12:00:00Z',
    recordedBy: 'Lisa Anderson, EN'
  },
  {
    id: '22',
    residentId: '1',
    type: 'BSL',
    value: '7.8',
    unit: 'mmol/L',
    recordedAt: '2024-01-14T12:00:00Z',
    recordedBy: 'Lisa Anderson, EN',
    thresholdFlag: 'HIGH'
  },

  // Day before yesterday
  {
    id: '23',
    residentId: '1',
    type: 'BP',
    value: '140/85',
    unit: 'mmHg',
    recordedAt: '2024-01-13T16:30:00Z',
    recordedBy: 'David Smith, RN'
  },
  {
    id: '24',
    residentId: '1',
    type: 'TEMP',
    value: '36.9',
    unit: '°C',
    recordedAt: '2024-01-13T16:30:00Z',
    recordedBy: 'David Smith, RN'
  },
  {
    id: '25',
    residentId: '1',
    type: 'HR',
    value: '76',
    unit: 'bpm',
    recordedAt: '2024-01-13T16:30:00Z',
    recordedBy: 'David Smith, RN'
  },
  {
    id: '26',
    residentId: '1',
    type: 'RR',
    value: '16',
    unit: '/min',
    recordedAt: '2024-01-13T16:30:00Z',
    recordedBy: 'David Smith, RN'
  },
  {
    id: '27',
    residentId: '1',
    type: 'SPO2',
    value: '99',
    unit: '%',
    recordedAt: '2024-01-13T16:30:00Z',
    recordedBy: 'David Smith, RN'
  },
  {
    id: '28',
    residentId: '1',
    type: 'PAIN',
    value: '2',
    unit: '/10',
    recordedAt: '2024-01-13T16:30:00Z',
    recordedBy: 'David Smith, RN'
  },

  // Other residents
  {
    id: '29',
    residentId: '2',
    type: 'SPO2',
    value: '94',
    unit: '%',
    recordedAt: '2024-01-15T14:00:00Z',
    recordedBy: 'Michael Chen, EN',
    thresholdFlag: 'LOW'
  },
  {
    id: '30',
    residentId: '2',
    type: 'BP',
    value: '120/75',
    unit: 'mmHg',
    recordedAt: '2024-01-15T14:00:00Z',
    recordedBy: 'Michael Chen, EN'
  },
  {
    id: '31',
    residentId: '2',
    type: 'TEMP',
    value: '36.5',
    unit: '°C',
    recordedAt: '2024-01-15T14:00:00Z',
    recordedBy: 'Michael Chen, EN'
  }
];

export const mockWounds: Wound[] = [
  {
    id: '1',
    residentId: '4',
    location: 'Left heel',
    stage: '2',
    size: { length: 3.2, width: 2.1, depth: 0.5, area: 6.72 },
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
    size: { length: 2.5, width: 1.8, area: 4.5 },
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
    witnesses: [{ name: 'Emma Wilson, PCW', role: 'PCW', statement: 'Found resident on floor beside bed at 22:15' }],
    immediateActions: 'Resident assisted back to bed, vital signs checked, family notified',
    notifications: { family: true, doctor: true, manager: true, time: '2024-01-14T22:30:00Z' },
    occurredAt: '2024-01-14T22:15:00Z',
    reportedBy: 'Emma Wilson, PCW'
  },
  {
    id: '2',
    residentId: '3',
    type: 'Medication Error',
    severity: 'Low',
    description: 'Medication administered 30 minutes late due to staff shortage',
    witnesses: [],
    immediateActions: 'Medication given, incident documented, supervisor notified',
    notifications: { family: false, doctor: false, manager: true, time: '2024-01-13T08:45:00Z' },
    occurredAt: '2024-01-13T08:30:00Z',
    reportedBy: 'David Smith, EN'
  }
];

export const mockCarePlans: CarePlan[] = [
  {
    id: '1',
    residentId: '1',
    title: 'Falls Prevention Care Plan',
    summary: 'Comprehensive plan to prevent falls and maintain resident safety while preserving mobility and independence.',
    status: 'ACTIVE',
    ownerRole: 'RN',
    reviewCadenceDays: 30,
    activeFrom: '2024-01-01T00:00:00Z',
    currentRevisionId: 'rev-1-v2',
    tags: ['falls', 'safety', 'mobility'],
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: 'Sarah Johnson, RN',
    updatedBy: 'Sarah Johnson, RN'
  },
  {
    id: '2',
    residentId: '4',
    title: 'Pressure Injury Prevention',
    summary: 'Preventive care plan to maintain skin integrity and prevent pressure injuries for bed-bound resident.',
    status: 'ACTIVE',
    ownerRole: 'RN',
    reviewCadenceDays: 14,
    activeFrom: '2024-01-10T00:00:00Z',
    currentRevisionId: 'rev-2-v1',
    tags: ['pressure-injury', 'skin', 'prevention'],
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-10T14:00:00Z',
    createdBy: 'Michael Chen, RN',
    updatedBy: 'Michael Chen, RN'
  },
  {
    id: '3',
    residentId: '1',
    title: 'Dementia Behavioral Support',
    summary: 'Person-centered care plan to manage behavioral symptoms and support quality of life.',
    status: 'DRAFT',
    ownerRole: 'RN',
    reviewCadenceDays: 21,
    tags: ['dementia', 'behavioral', 'psychosocial'],
    createdAt: '2024-01-14T11:00:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    createdBy: 'Emma Wilson, EN',
    updatedBy: 'Emma Wilson, EN'
  }
];

export const mockCarePlanRevisions: CarePlanRevision[] = [
  {
    id: 'rev-1-v2',
    carePlanId: '1',
    version: 2,
    problems: [
      {
        title: 'High risk of falls',
        narrative: 'Resident has moderate cognitive impairment and requires assistance with mobility. Previous fall recorded in December 2023.',
        evidence: 'MORSE Score: 45 (High Risk), History of falls, Cognitive impairment',
        diagnosisLink: 'F03.90'
      }
    ],
    goals: [
      {
        goal: 'Prevent falls while maintaining mobility and independence',
        metric: 'Zero falls over 30-day period',
        targetDate: '2024-02-01',
        status: 'In Progress'
      },
      {
        goal: 'Maintain current mobility level',
        metric: 'Able to walk 20m with assistance daily',
        targetDate: '2024-02-15',
        status: 'In Progress'
      },
      {
        goal: 'Increase resident confidence in mobility',
        metric: 'Resident reports feeling safe during transfers',
        status: 'Not Started'
      }
    ],
    interventions: [
      {
        action: 'Bed alarm activated at night and during rest periods',
        frequency: '24/7 when in bed',
        responsibleRole: 'All staff',
        priority: 'High'
      },
      {
        action: 'Toileting rounds every 2 hours during day',
        frequency: '2 hourly 0800-2000',
        responsibleRole: 'PCW',
        priority: 'High'
      },
      {
        action: 'Clear pathways and adequate lighting',
        frequency: 'Ongoing environmental check',
        responsibleRole: 'All staff',
        priority: 'Medium'
      },
      {
        action: 'Physiotherapy assessment for mobility aids',
        frequency: 'Weekly',
        responsibleRole: 'Physiotherapist',
        priority: 'Medium'
      }
    ],
    risks: [
      {
        risk: 'Fall resulting in fracture or head injury',
        mitigation: 'Bed alarm, frequent checks, clear pathways, appropriate footwear',
        escalation: 'If fall occurs: complete incident report, medical assessment, family notification',
        level: 'High'
      },
      {
        risk: 'Loss of independence due to over-restriction',
        mitigation: 'Encourage supervised mobility, regular PT assessment',
        escalation: 'Monthly review of restrictions with multidisciplinary team',
        level: 'Medium'
      }
    ],
    monitoring: [
      {
        what: 'Falls incidents and near misses',
        who: 'All nursing staff',
        frequency: 'Continuous',
        thresholds: 'Any fall or near miss requires immediate reporting',
        alertsEnabled: true
      },
      {
        what: 'Mobility assessment',
        who: 'RN',
        frequency: 'Weekly',
        thresholds: 'Deterioration in mobility or increased assistance needs',
        alertsEnabled: true
      },
      {
        what: 'MORSE fall risk score',
        who: 'RN',
        frequency: 'Monthly or after any incident',
        thresholds: 'Score >25 requires care plan review',
        alertsEnabled: true
      }
    ],
    familySummary: 'We are working with Maggie to keep her safe while maintaining her ability to move around. We use a bed alarm to alert us if she gets up at night, and our staff check on her regularly. We also make sure her walking areas are clear and well-lit.',
    notes: 'Updated plan following multidisciplinary team meeting. Physiotherapy recommends continuing current interventions with weekly mobility assessment.',
    effectiveFrom: '2024-01-15T00:00:00Z',
    createdAt: '2024-01-15T10:30:00Z',
    createdBy: 'Sarah Johnson, RN'
  },
  {
    id: 'rev-2-v1',
    carePlanId: '2',
    version: 1,
    problems: [
      {
        title: 'High risk of pressure injury development',
        narrative: 'Bed-bound resident with limited mobility, poor nutritional status, and existing Stage 2 pressure injury on left heel.',
        evidence: 'Braden Score: 12 (High Risk), Existing pressure injury, Bed-bound status',
        diagnosisLink: 'C78.00'
      }
    ],
    goals: [
      {
        goal: 'Prevent new pressure injuries',
        metric: 'No new pressure injuries over 14-day period',
        targetDate: '2024-01-24',
        status: 'In Progress'
      },
      {
        goal: 'Heal existing pressure injury',
        metric: 'Left heel injury shows signs of healing',
        targetDate: '2024-02-10',
        status: 'In Progress'
      }
    ],
    interventions: [
      {
        action: '2-hourly position changes',
        frequency: 'Every 2 hours, 24/7',
        responsibleRole: 'All nursing staff',
        priority: 'High'
      },
      {
        action: 'Pressure relieving mattress in use',
        frequency: 'Continuous',
        responsibleRole: 'All staff',
        priority: 'High'
      },
      {
        action: 'Daily skin assessment',
        frequency: 'Daily',
        responsibleRole: 'RN',
        priority: 'High'
      },
      {
        action: 'Nutrition support and hydration monitoring',
        frequency: 'Daily',
        responsibleRole: 'EN',
        priority: 'Medium'
      }
    ],
    risks: [
      {
        risk: 'Development of additional pressure injuries',
        mitigation: 'Regular repositioning, pressure relieving devices, skin monitoring',
        escalation: 'Any new areas of concern require immediate RN assessment',
        level: 'High'
      },
      {
        risk: 'Deterioration of existing wound',
        mitigation: 'Daily dressing changes, wound monitoring, medical review',
        escalation: 'Signs of infection or non-healing require medical review',
        level: 'Medium'
      }
    ],
    monitoring: [
      {
        what: 'Skin condition and pressure points',
        who: 'RN',
        frequency: 'Daily',
        thresholds: 'Any new redness or breakdown',
        alertsEnabled: true
      },
      {
        what: 'Existing wound healing progress',
        who: 'RN',
        frequency: 'Daily',
        thresholds: 'No improvement after 7 days or signs of infection',
        alertsEnabled: true
      },
      {
        what: 'Braden risk assessment',
        who: 'RN',
        frequency: 'Weekly',
        thresholds: 'Score <13 requires plan review',
        alertsEnabled: true
      }
    ],
    familySummary: 'We are taking special care to prevent pressure sores and help Bob\'s existing wound heal. Our nurses turn him every 2 hours and check his skin daily. He has a special mattress to reduce pressure.',
    notes: 'Wound clinic referral made. Family educated on pressure injury prevention.',
    effectiveFrom: '2024-01-10T00:00:00Z',
    createdAt: '2024-01-10T14:00:00Z',
    createdBy: 'Michael Chen, RN'
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
export const getMockCarePlanRevisions = (carePlanId: string) =>
  mockCarePlanRevisions.filter(rev => rev.carePlanId === carePlanId);
export const getMockCarePlanRevision = (revisionId: string) =>
  mockCarePlanRevisions.find(rev => rev.id === revisionId);
export const getMockTasksByResident = (residentId: string) => 
  mockTasks.filter(t => t.residentId === residentId);
export const getMockProgressNotesByResident = (residentId: string) => 
  mockProgressNotes.filter(pn => pn.residentId === residentId);