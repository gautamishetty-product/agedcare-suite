import { TaskTemplate, TaskCategory } from './support-plan-types';

// Comprehensive task library based on James Klein's care plan and best practices
export const TASK_LIBRARY: TaskTemplate[] = [
  // MOBILITY TASKS
  {
    id: 'mob-001',
    category: 'Mobility',
    title: 'Transfers - Bed to Wheelchair',
    description: 'Assist with transfers between bed and wheelchair using appropriate equipment',
    defaultFrequency: 'As required',
    defaultTimeSlots: ['AM', 'PM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: true,
      timeSlots: true,
      instructions: true,
      staffRole: false
    },
    requiresApproval: false
  },
  {
    id: 'mob-002',
    category: 'Mobility',
    title: 'Hoist Transfers',
    description: '2x assist for hoist transfers with full body sling',
    defaultFrequency: 'As required',
    defaultTimeSlots: ['AM', 'PM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: false,
      timeSlots: true,
      instructions: true,
      staffRole: false
    },
    requiresApproval: true
  },
  {
    id: 'mob-003',
    category: 'Mobility',
    title: 'Mobility Assessment',
    description: 'Regular mobility assessment and repositioning',
    defaultFrequency: '2 hourly',
    defaultTimeSlots: ['AM', 'PM', 'Night'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: true,
      timeSlots: false,
      instructions: true,
      staffRole: false
    },
    requiresApproval: false
  },

  // BATHING & SKIN CARE TASKS
  {
    id: 'bath-001',
    category: 'Bathing',
    title: 'Personal Hygiene - 2x Assist',
    description: 'Full personal hygiene care with 2 staff members',
    defaultFrequency: 'Daily',
    defaultTimeSlots: ['AM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: true,
      timeSlots: true,
      instructions: true,
      staffRole: false
    },
    requiresApproval: false
  },
  {
    id: 'bath-002',
    category: 'Bathing',
    title: 'Skin Care - "No Frizz" Cream Application',
    description: 'Apply specialized skin cream as per resident preference',
    defaultFrequency: 'After bathing',
    defaultTimeSlots: ['AM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: false,
      timeSlots: false,
      instructions: true,
      staffRole: false
    },
    requiresApproval: false
  },
  {
    id: 'bath-003',
    category: 'Bathing',
    title: 'Incontinence Care',
    description: 'Pad changes and skin integrity monitoring',
    defaultFrequency: 'PRN',
    defaultTimeSlots: ['AM', 'PM', 'Night'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: true,
      timeSlots: false,
      instructions: true,
      staffRole: false
    },
    requiresApproval: false
  },

  // MEALS & NUTRITION TASKS
  {
    id: 'meal-001',
    category: 'Meals',
    title: 'Diabetic Diet - Easy to Chew',
    description: 'Provide diabetic-friendly, easy-to-chew meals with appropriate portion sizes',
    defaultFrequency: '3x daily',
    defaultTimeSlots: ['AM', 'PM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: false,
      timeSlots: false,
      instructions: true,
      staffRole: false
    },
    requiresApproval: false
  },
  {
    id: 'meal-002',
    category: 'Meals',
    title: 'Weak Coffee Preference',
    description: 'Serve weak coffee as per resident preference',
    defaultFrequency: 'With meals',
    defaultTimeSlots: ['AM', 'PM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: true,
      timeSlots: true,
      instructions: true,
      staffRole: false
    },
    requiresApproval: false
  },
  {
    id: 'meal-003',
    category: 'Meals',
    title: 'Feeding Assistance',
    description: 'Provide feeding assistance and monitor intake',
    defaultFrequency: 'Each meal',
    defaultTimeSlots: ['AM', 'PM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: false,
      timeSlots: false,
      instructions: true,
      staffRole: false
    },
    requiresApproval: false
  },

  // GROOMING TASKS
  {
    id: 'groom-001',
    category: 'Grooming',
    title: 'Matching Clothes Selection',
    description: 'Assist with selecting matching, appropriate clothing',
    defaultFrequency: 'Daily',
    defaultTimeSlots: ['AM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: false,
      timeSlots: false,
      instructions: true,
      staffRole: false
    },
    requiresApproval: false
  },
  {
    id: 'groom-002',
    category: 'Grooming',
    title: 'Nail Polish Application',
    description: 'Apply nail polish as per resident preference',
    defaultFrequency: 'Weekly',
    defaultTimeSlots: ['PM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: true,
      timeSlots: true,
      instructions: true,
      staffRole: false
    },
    requiresApproval: false
  },
  {
    id: 'groom-003',
    category: 'Grooming',
    title: 'Hair Care with Cream',
    description: 'Hair styling and cream application',
    defaultFrequency: 'Daily',
    defaultTimeSlots: ['AM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: true,
      timeSlots: true,
      instructions: true,
      staffRole: false
    },
    requiresApproval: false
  },

  // TOILETING TASKS
  {
    id: 'toilet-001',
    category: 'Toileting',
    title: 'Scheduled Pad Checks',
    description: 'Regular pad checks before meals and PRN',
    defaultFrequency: 'Before meals + PRN',
    defaultTimeSlots: ['AM', 'PM', 'Night'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: false,
      timeSlots: false,
      instructions: true,
      staffRole: false
    },
    requiresApproval: false
  },
  {
    id: 'toilet-002',
    category: 'Toileting',
    title: 'Toileting Assistance',
    description: 'Assist with toileting and maintain dignity',
    defaultFrequency: 'As required',
    defaultTimeSlots: ['AM', 'PM', 'Night'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: true,
      timeSlots: false,
      instructions: true,
      staffRole: false
    },
    requiresApproval: false
  },

  // SAFETY TASKS
  {
    id: 'safety-001',
    category: 'Safety',
    title: 'Sensor Mat Monitoring',
    description: 'Monitor sensor mat and respond to alerts',
    defaultFrequency: 'Continuous',
    defaultTimeSlots: ['AM', 'PM', 'Night'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: false,
      timeSlots: false,
      instructions: true,
      staffRole: false
    },
    requiresApproval: true
  },
  {
    id: 'safety-002',
    category: 'Safety',
    title: 'Bed Rail Safety Check',
    description: 'Regular bed rail position and safety checks',
    defaultFrequency: 'Each shift',
    defaultTimeSlots: ['AM', 'PM', 'Night'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: false,
      timeSlots: false,
      instructions: true,
      staffRole: false
    },
    requiresApproval: true
  },
  {
    id: 'safety-003',
    category: 'Safety',
    title: 'High Falls Risk Monitoring',
    description: 'Enhanced monitoring for high falls risk resident',
    defaultFrequency: 'Continuous observation',
    defaultTimeSlots: ['AM', 'PM', 'Night'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: false,
      timeSlots: false,
      instructions: true,
      staffRole: false
    },
    requiresApproval: true
  },

  // LIFESTYLE & SOCIAL TASKS
  {
    id: 'lifestyle-001',
    category: 'Lifestyle',
    title: 'Bingo Participation',
    description: 'Encourage and assist with bingo activities',
    defaultFrequency: 'Weekly',
    defaultTimeSlots: ['PM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: true,
      timeSlots: true,
      instructions: true,
      staffRole: true
    },
    requiresApproval: false
  },
  {
    id: 'lifestyle-002',
    category: 'Lifestyle',
    title: 'Gardening Activities',
    description: 'Supervised gardening and plant care activities',
    defaultFrequency: 'Twice weekly',
    defaultTimeSlots: ['PM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: true,
      timeSlots: true,
      instructions: true,
      staffRole: true
    },
    requiresApproval: false
  },
  {
    id: 'lifestyle-003',
    category: 'Lifestyle',
    title: 'Music Therapy',
    description: 'Facilitate music listening and participation',
    defaultFrequency: 'Daily',
    defaultTimeSlots: ['PM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: true,
      timeSlots: true,
      instructions: true,
      staffRole: true
    },
    requiresApproval: false
  },
  {
    id: 'lifestyle-004',
    category: 'Lifestyle',
    title: 'Pet Therapy Visits',
    description: 'Facilitate and supervise pet therapy interactions',
    defaultFrequency: 'Weekly',
    defaultTimeSlots: ['PM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: true,
      timeSlots: true,
      instructions: true,
      staffRole: true
    },
    requiresApproval: false
  },
  {
    id: 'lifestyle-005',
    category: 'Lifestyle',
    title: 'Family Video Calls',
    description: 'Assist with family video calls and communication',
    defaultFrequency: 'As arranged',
    defaultTimeSlots: ['PM'],
    defaultStaffRole: 'PCW',
    customizable: {
      frequency: true,
      timeSlots: true,
      instructions: true,
      staffRole: false
    },
    requiresApproval: false
  }
];

export const getTasksByCategory = (category: TaskCategory): TaskTemplate[] => {
  return TASK_LIBRARY.filter(task => task.category === category);
};

export const getTaskById = (id: string): TaskTemplate | undefined => {
  return TASK_LIBRARY.find(task => task.id === id);
};

export const getAllCategories = (): TaskCategory[] => {
  return ['Mobility', 'Bathing', 'Meals', 'Grooming', 'Toileting', 'Safety', 'Lifestyle'];
};

export const FACILITY_TEMPLATES = [
  {
    id: 'standard-care',
    name: 'Standard Care Package',
    description: 'Basic daily living support for independent residents',
    taskIds: ['bath-001', 'meal-001', 'groom-001', 'lifestyle-001']
  },
  {
    id: 'high-care',
    name: 'High Care Package',
    description: 'Comprehensive care for residents requiring significant assistance',
    taskIds: ['mob-002', 'bath-001', 'bath-003', 'meal-003', 'toilet-001', 'safety-001', 'safety-003']
  },
  {
    id: 'dementia-care',
    name: 'Dementia Care Package',
    description: 'Specialized care for residents with cognitive impairment',
    taskIds: ['groom-001', 'lifestyle-003', 'lifestyle-005', 'safety-003', 'meal-003']
  }
];