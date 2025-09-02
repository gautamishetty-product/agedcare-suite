import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle, 
  Clock, 
  Users, 
  Shield,
  Download,
  Eye,
  Edit,
  X,
  FileText,
  Search
} from 'lucide-react';
import { SupportPlan, SupportTask, TaskTemplate, TaskCategory, TimeSlot, StaffRole, ROLE_PERMISSIONS } from '@/lib/support-plan-types';
import { TASK_LIBRARY, getTasksByCategory, getTaskById, getAllCategories, FACILITY_TEMPLATES } from '@/lib/task-library';
import { useToast } from '@/hooks/use-toast';

interface SupportPlanBuilderProps {
  residentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (supportPlan: SupportPlan) => void;
  currentUserRole: StaffRole;
  existingPlan?: SupportPlan;
}

export const SupportPlanBuilder = ({ 
  residentId, 
  isOpen, 
  onClose, 
  onSave, 
  currentUserRole,
  existingPlan 
}: SupportPlanBuilderProps) => {
  const { toast } = useToast();
  const permissions = ROLE_PERMISSIONS[currentUserRole];
  
  // Basic plan details
  const [title, setTitle] = useState(existingPlan?.title || '');
  const [specialInstructions, setSpecialInstructions] = useState(existingPlan?.specialInstructions || '');
  const [guardianSignatureRequired, setGuardianSignatureRequired] = useState(existingPlan?.guardianSignatureRequired || false);
  const [facilityTemplate, setFacilityTemplate] = useState(existingPlan?.facilityTemplate || '');
  
  // Tasks management
  const [selectedTasks, setSelectedTasks] = useState<SupportTask[]>(existingPlan?.tasks || []);
  const [activeCategory, setActiveCategory] = useState<TaskCategory>('Mobility');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTaskCustomizationOpen, setIsTaskCustomizationOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<SupportTask | null>(null);

  // Task customization form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskFrequency, setTaskFrequency] = useState('');
  const [taskTimeSlots, setTaskTimeSlots] = useState<TimeSlot[]>([]);
  const [taskInstructions, setTaskInstructions] = useState('');
  const [taskAssignedRole, setTaskAssignedRole] = useState<StaffRole>('PCW');
  const [taskCustomizations, setTaskCustomizations] = useState<any>({});

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!permissions.canCreate && !existingPlan) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to create support plans',
        variant: 'destructive'
      });
      onClose();
    }
  }, [permissions, existingPlan, onClose, toast]);

  const filteredTasks = TASK_LIBRARY.filter(task => {
    const matchesCategory = task.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddTask = (template: TaskTemplate) => {
    const newTask: SupportTask = {
      id: `task-${Date.now()}`,
      templateId: template.id,
      title: template.title,
      description: template.description,
      frequency: template.defaultFrequency,
      timeSlots: [...template.defaultTimeSlots],
      instructions: '',
      assignedRole: template.defaultStaffRole,
      isActive: true
    };

    setEditingTask(newTask);
    resetTaskForm();
    setTaskTitle(template.title);
    setTaskDescription(template.description);
    setTaskFrequency(template.defaultFrequency);
    setTaskTimeSlots([...template.defaultTimeSlots]);
    setTaskAssignedRole(template.defaultStaffRole);
    setIsTaskCustomizationOpen(true);
  };

  const handleEditTask = (task: SupportTask) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskFrequency(task.frequency);
    setTaskTimeSlots([...task.timeSlots]);
    setTaskInstructions(task.instructions);
    setTaskAssignedRole(task.assignedRole);
    setTaskCustomizations(task.customizations || {});
    setIsTaskCustomizationOpen(true);
  };

  const handleSaveTask = () => {
    if (!editingTask) return;

    const updatedTask: SupportTask = {
      ...editingTask,
      title: taskTitle,
      description: taskDescription,
      frequency: taskFrequency,
      timeSlots: taskTimeSlots,
      instructions: taskInstructions,
      assignedRole: taskAssignedRole,
      customizations: taskCustomizations
    };

    const isExisting = selectedTasks.find(t => t.id === editingTask.id);
    if (isExisting) {
      setSelectedTasks(selectedTasks.map(t => t.id === editingTask.id ? updatedTask : t));
    } else {
      setSelectedTasks([...selectedTasks, updatedTask]);
    }

    setIsTaskCustomizationOpen(false);
    resetTaskForm();
  };

  const handleRemoveTask = (taskId: string) => {
    setSelectedTasks(selectedTasks.filter(t => t.id !== taskId));
  };

  const handleTimeSlotToggle = (slot: TimeSlot) => {
    if (taskTimeSlots.includes(slot)) {
      setTaskTimeSlots(taskTimeSlots.filter(s => s !== slot));
    } else {
      setTaskTimeSlots([...taskTimeSlots, slot]);
    }
  };

  const resetTaskForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskFrequency('');
    setTaskTimeSlots([]);
    setTaskInstructions('');
    setTaskAssignedRole('PCW');
    setTaskCustomizations({});
    setEditingTask(null);
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = FACILITY_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    const templateTasks: SupportTask[] = template.taskIds
      .map(taskId => getTaskById(taskId))
      .filter(Boolean)
      .map((taskTemplate, index) => ({
        id: `task-${Date.now()}-${index}`,
        templateId: taskTemplate!.id,
        title: taskTemplate!.title,
        description: taskTemplate!.description,
        frequency: taskTemplate!.defaultFrequency,
        timeSlots: [...taskTemplate!.defaultTimeSlots],
        instructions: '',
        assignedRole: taskTemplate!.defaultStaffRole,
        isActive: true
      }));

    setSelectedTasks(templateTasks);
    setFacilityTemplate(templateId);
    setTitle(template.name);
  };

  const validatePlan = () => {
    if (!title.trim()) return 'Support plan title is required';
    if (selectedTasks.length === 0) return 'At least one task must be added';
    if (selectedTasks.some(t => !t.title.trim())) return 'All tasks must have a title';
    return null;
  };

  const handleSave = async () => {
    const validationError = validatePlan();
    if (validationError) {
      toast({
        title: 'Validation Error',
        description: validationError,
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);

    try {
      const now = new Date().toISOString();
      const planId = existingPlan?.id || `sp-${Date.now()}`;

      const supportPlan: SupportPlan = {
        id: planId,
        residentId,
        title,
        status: permissions.canFinalize ? 'FINAL' : 'DRAFT',
        version: existingPlan ? existingPlan.version + 1 : 1,
        tasks: selectedTasks,
        facilityTemplate,
        specialInstructions,
        guardianSignatureRequired,
        createdAt: existingPlan?.createdAt || now,
        updatedAt: now,
        createdBy: existingPlan?.createdBy || 'Current User',
        updatedBy: 'Current User',
        finalizedBy: permissions.canFinalize ? 'Current User' : undefined,
        finalizedAt: permissions.canFinalize ? now : undefined,
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days from now
      };

      onSave(supportPlan);
      
      toast({
        title: 'Support Plan Saved',
        description: `Support plan has been saved as ${supportPlan.status.toLowerCase()}`,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save support plan',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isFieldDisabled = (field: string) => {
    return permissions.restrictedFields?.includes(field) || (!permissions.canEdit && !!existingPlan);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {existingPlan ? 'Edit Support Plan' : 'Create Support Plan'}
            </DialogTitle>
            <DialogDescription>
              Build a comprehensive daily care support plan with task-based activities
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[75vh]">
            <div className="space-y-6">
              {/* Basic Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Details</CardTitle>
                  <CardDescription>Basic information and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Plan Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Daily Living Support Plan"
                        disabled={isFieldDisabled('title')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template">Facility Template</Label>
                      <Select value={facilityTemplate} onValueChange={setFacilityTemplate} disabled={isFieldDisabled('facilityTemplate')}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No template</SelectItem>
                          {FACILITY_TEMPLATES.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {facilityTemplate && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleApplyTemplate(facilityTemplate)}
                          disabled={isFieldDisabled('tasks')}
                        >
                          Apply Template
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Special Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Additional instructions or notes..."
                      rows={3}
                      disabled={isFieldDisabled('specialInstructions')}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="guardian"
                      checked={guardianSignatureRequired}
                      onCheckedChange={(checked) => setGuardianSignatureRequired(checked === true)}
                      disabled={isFieldDisabled('guardianSignatureRequired')}
                    />
                    <Label htmlFor="guardian">Guardian signature required for PDF export</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Task Builder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Support Tasks ({selectedTasks.length})</span>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search tasks..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Click tasks from the library to add them to your plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Task Library */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Task Library</h4>
                      <Tabs value={activeCategory} onValueChange={(value: any) => setActiveCategory(value)}>
                        <TabsList className="grid grid-cols-4 lg:grid-cols-3 gap-1">
                          {getAllCategories().slice(0, 6).map(category => (
                            <TabsTrigger key={category} value={category} className="text-xs">
                              {category}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                          {filteredTasks.map(task => (
                            <Card 
                              key={task.id} 
                              className="p-3 hover:bg-muted/50 cursor-pointer border-l-4 border-l-primary/20"
                              onClick={() => handleAddTask(task)}
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between">
                                  <h5 className="font-medium text-sm">{task.title}</h5>
                                  <Plus className="h-4 w-4 text-primary" />
                                </div>
                                <p className="text-xs text-muted-foreground">{task.description}</p>
                                <div className="flex items-center gap-2 text-xs">
                                  <Badge variant="outline">{task.defaultFrequency}</Badge>
                                  <Badge variant="outline">{task.defaultStaffRole}</Badge>
                                  {task.requiresApproval && (
                                    <Badge variant="outline" className="text-amber-600">
                                      <Shield className="h-3 w-3 mr-1" />
                                      Approval Required
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </Tabs>
                    </div>

                    {/* Selected Tasks */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Selected Tasks ({selectedTasks.length})</h4>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {selectedTasks.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No tasks selected. Click tasks from the library to add them.
                          </div>
                        ) : (
                          selectedTasks.map(task => (
                            <Card key={task.id} className="p-3 border-l-4 border-l-accent">
                              <div className="space-y-2">
                                <div className="flex items-start justify-between">
                                  <h5 className="font-medium text-sm">{task.title}</h5>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditTask(task)}
                                      disabled={isFieldDisabled('tasks')}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveTask(task.id)}
                                      className="text-red-600 hover:text-red-700"
                                      disabled={isFieldDisabled('tasks')}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground">{task.description}</p>
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="outline" className="text-xs">{task.frequency}</Badge>
                                  <Badge variant="outline" className="text-xs">{task.assignedRole}</Badge>
                                  {task.timeSlots.map(slot => (
                                    <Badge key={slot} variant="outline" className="text-xs">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {slot}
                                    </Badge>
                                  ))}
                                </div>
                                {task.instructions && (
                                  <p className="text-xs bg-muted p-2 rounded italic">
                                    "{task.instructions}"
                                  </p>
                                )}
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{currentUserRole}</Badge>
              <span>•</span>
              <span>{permissions.canFinalize ? 'Can finalize plans' : 'Draft only'}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !permissions.canCreate}
                className="min-w-[120px]"
              >
                {isSaving ? 'Saving...' : permissions.canFinalize ? 'Save & Finalize' : 'Save as Draft'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Customization Dialog */}
      <Dialog open={isTaskCustomizationOpen} onOpenChange={setIsTaskCustomizationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customize Task</DialogTitle>
            <DialogDescription>
              Configure this task for the resident's specific needs
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taskTitle">Task Title</Label>
              <Input
                id="taskTitle"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task title..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taskDescription">Description</Label>
              <Textarea
                id="taskDescription"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Task description..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taskFrequency">Frequency</Label>
                <Input
                  id="taskFrequency"
                  value={taskFrequency}
                  onChange={(e) => setTaskFrequency(e.target.value)}
                  placeholder="e.g., Daily, 2x daily, PRN"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskRole">Assigned Role</Label>
                <Select value={taskAssignedRole} onValueChange={(value: any) => setTaskAssignedRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RN">Registered Nurse</SelectItem>
                    <SelectItem value="EN">Enrolled Nurse</SelectItem>
                    <SelectItem value="PCW">Personal Care Worker</SelectItem>
                    <SelectItem value="ALLIED_HEALTH">Allied Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Time Slots</Label>
              <div className="flex flex-wrap gap-2">
                {(['AM', 'PM', 'Night', 'PRN'] as TimeSlot[]).map(slot => (
                  <div key={slot} className="flex items-center space-x-2">
                    <Checkbox
                      id={slot}
                      checked={taskTimeSlots.includes(slot)}
                      onCheckedChange={() => handleTimeSlotToggle(slot)}
                    />
                    <Label htmlFor={slot} className="text-sm">{slot}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taskInstructions">Special Instructions</Label>
              <Textarea
                id="taskInstructions"
                value={taskInstructions}
                onChange={(e) => setTaskInstructions(e.target.value)}
                placeholder="Any special instructions or preferences..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsTaskCustomizationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask}>
              Save Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};