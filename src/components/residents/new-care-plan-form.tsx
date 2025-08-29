import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Trash2, 
  Save, 
  FileText, 
  Target, 
  Shield, 
  Activity,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { CarePlan, CarePlanRevision, CarePlanProblem, CarePlanGoal, CarePlanIntervention, CarePlanRisk, CarePlanMonitoring } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface NewCarePlanFormProps {
  residentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (carePlan: CarePlan, revision: CarePlanRevision) => void;
}

const emptyProblem = (): CarePlanProblem => ({
  title: '',
  narrative: '',
  evidence: '',
  diagnosisLink: ''
});

const emptyGoal = (): CarePlanGoal => ({
  goal: '',
  metric: '',
  targetDate: '',
  status: 'Not Started'
});

const emptyIntervention = (): CarePlanIntervention => ({
  action: '',
  frequency: '',
  responsibleRole: '',
  taskLink: '',
  priority: 'Medium'
});

const emptyRisk = (): CarePlanRisk => ({
  risk: '',
  mitigation: '',
  escalation: '',
  level: 'Medium'
});

const emptyMonitoring = (): CarePlanMonitoring => ({
  what: '',
  who: '',
  frequency: '',
  thresholds: '',
  alertsEnabled: false
});

export const NewCarePlanForm = ({ residentId, isOpen, onClose, onSave }: NewCarePlanFormProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);

  // Basic plan details
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [ownerRole, setOwnerRole] = useState<'RN' | 'EN' | 'PCW' | 'ALLIED_HEALTH'>('RN');
  const [reviewCadenceDays, setReviewCadenceDays] = useState(30);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Revision details
  const [problems, setProblems] = useState<CarePlanProblem[]>([emptyProblem()]);
  const [goals, setGoals] = useState<CarePlanGoal[]>([emptyGoal()]);
  const [interventions, setInterventions] = useState<CarePlanIntervention[]>([emptyIntervention()]);
  const [risks, setRisks] = useState<CarePlanRisk[]>([emptyRisk()]);
  const [monitoring, setMonitoring] = useState<CarePlanMonitoring[]>([emptyMonitoring()]);
  const [familySummary, setFamilySummary] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addProblem = () => setProblems([...problems, emptyProblem()]);
  const removeProblem = (index: number) => setProblems(problems.filter((_, i) => i !== index));
  const updateProblem = (index: number, field: keyof CarePlanProblem, value: string) => {
    const updated = [...problems];
    updated[index] = { ...updated[index], [field]: value };
    setProblems(updated);
  };

  const addGoal = () => setGoals([...goals, emptyGoal()]);
  const removeGoal = (index: number) => setGoals(goals.filter((_, i) => i !== index));
  const updateGoal = (index: number, field: keyof CarePlanGoal, value: string) => {
    const updated = [...goals];
    updated[index] = { ...updated[index], [field]: value };
    setGoals(updated);
  };

  const addIntervention = () => setInterventions([...interventions, emptyIntervention()]);
  const removeIntervention = (index: number) => setInterventions(interventions.filter((_, i) => i !== index));
  const updateIntervention = (index: number, field: keyof CarePlanIntervention, value: string) => {
    const updated = [...interventions];
    updated[index] = { ...updated[index], [field]: value };
    setInterventions(updated);
  };

  const addRisk = () => setRisks([...risks, emptyRisk()]);
  const removeRisk = (index: number) => setRisks(risks.filter((_, i) => i !== index));
  const updateRisk = (index: number, field: keyof CarePlanRisk, value: string) => {
    const updated = [...risks];
    updated[index] = { ...updated[index], [field]: value };
    setRisks(updated);
  };

  const addMonitoring = () => setMonitoring([...monitoring, emptyMonitoring()]);
  const removeMonitoring = (index: number) => setMonitoring(monitoring.filter((_, i) => i !== index));
  const updateMonitoring = (index: number, field: keyof CarePlanMonitoring, value: string | boolean) => {
    const updated = [...monitoring];
    updated[index] = { ...updated[index], [field]: value };
    setMonitoring(updated);
  };

  const validateForm = () => {
    if (!title.trim()) return 'Care plan title is required';
    if (problems.some(p => !p.title.trim())) return 'All problems must have a title';
    if (goals.some(g => !g.goal.trim())) return 'All goals must have a description';
    if (interventions.some(i => !i.action.trim())) return 'All interventions must have an action';
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
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
      const carePlanId = `cp-${Date.now()}`;
      const revisionId = `rev-${carePlanId}-v1`;

      const newCarePlan: CarePlan = {
        id: carePlanId,
        residentId,
        title,
        summary,
        status: 'DRAFT',
        ownerRole,
        reviewCadenceDays,
        currentRevisionId: revisionId,
        tags,
        createdAt: now,
        updatedAt: now,
        createdBy: 'Current User', // In real app, get from auth context
        updatedBy: 'Current User'
      };

      const newRevision: CarePlanRevision = {
        id: revisionId,
        carePlanId,
        version: 1,
        problems: problems.filter(p => p.title.trim()),
        goals: goals.filter(g => g.goal.trim()),
        interventions: interventions.filter(i => i.action.trim()),
        risks: risks.filter(r => r.risk.trim()),
        monitoring: monitoring.filter(m => m.what.trim()),
        familySummary,
        notes,
        effectiveFrom: now,
        createdAt: now,
        createdBy: 'Current User'
      };

      onSave(newCarePlan, newRevision);
      
      toast({
        title: 'Care Plan Created',
        description: 'New care plan has been saved as draft',
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save care plan',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSummary('');
    setOwnerRole('RN');
    setReviewCadenceDays(30);
    setTags([]);
    setNewTag('');
    setProblems([emptyProblem()]);
    setGoals([emptyGoal()]);
    setInterventions([emptyIntervention()]);
    setRisks([emptyRisk()]);
    setMonitoring([emptyMonitoring()]);
    setFamilySummary('');
    setNotes('');
    setCurrentStep('basic');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create New Care Plan
          </DialogTitle>
          <DialogDescription>
            Build a comprehensive care plan with problems, goals, interventions, and monitoring
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="problems">Problems</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="interventions">Interventions</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Care Plan Details</CardTitle>
                  <CardDescription>Basic information about the care plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Falls Prevention Care Plan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner">Owner Role</Label>
                      <Select value={ownerRole} onValueChange={(value: any) => setOwnerRole(value)}>
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
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Brief summary of the care plan for families"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="review">Review Cadence (Days)</Label>
                      <Input
                        id="review"
                        type="number"
                        value={reviewCadenceDays}
                        onChange={(e) => setReviewCadenceDays(Number(e.target.value))}
                        min={1}
                        max={365}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          id="tags"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add tag..."
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <Button type="button" onClick={handleAddTag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                            <X 
                              className="h-3 w-3 ml-1 cursor-pointer" 
                              onClick={() => handleRemoveTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="familySummary">Family Summary</Label>
                      <Textarea
                        id="familySummary"
                        value={familySummary}
                        onChange={(e) => setFamilySummary(e.target.value)}
                        placeholder="Plain-language summary for family members"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Clinical Notes</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Additional clinical notes and observations"
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="problems">
              <ProblemsSection 
                problems={problems}
                updateProblem={updateProblem}
                addProblem={addProblem}
                removeProblem={removeProblem}
              />
            </TabsContent>

            <TabsContent value="goals">
              <GoalsSection 
                goals={goals}
                updateGoal={updateGoal}
                addGoal={addGoal}
                removeGoal={removeGoal}
              />
            </TabsContent>

            <TabsContent value="interventions">
              <InterventionsSection 
                interventions={interventions}
                updateIntervention={updateIntervention}
                addIntervention={addIntervention}
                removeIntervention={removeIntervention}
              />
            </TabsContent>

            <TabsContent value="risks">
              <RisksSection 
                risks={risks}
                updateRisk={updateRisk}
                addRisk={addRisk}
                removeRisk={removeRisk}
              />
            </TabsContent>

            <TabsContent value="monitoring">
              <MonitoringSection 
                monitoring={monitoring}
                updateMonitoring={updateMonitoring}
                addMonitoring={addMonitoring}
                removeMonitoring={removeMonitoring}
              />
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Component sections for each tab
const ProblemsSection = ({ problems, updateProblem, addProblem, removeProblem }: any) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        Problems & Assessment
      </CardTitle>
      <CardDescription>Identify health problems and clinical assessment findings</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {problems.map((problem: CarePlanProblem, index: number) => (
        <Card key={index} className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Problem {index + 1}</h4>
              {problems.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeProblem(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <Label>Problem Title *</Label>
                <Input
                  value={problem.title}
                  onChange={(e) => updateProblem(index, 'title', e.target.value)}
                  placeholder="e.g., High risk of falls"
                />
              </div>
              
              <div>
                <Label>Clinical Narrative</Label>
                <Textarea
                  value={problem.narrative}
                  onChange={(e) => updateProblem(index, 'narrative', e.target.value)}
                  placeholder="Detailed description of the problem and clinical findings"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Evidence/Assessment</Label>
                  <Input
                    value={problem.evidence || ''}
                    onChange={(e) => updateProblem(index, 'evidence', e.target.value)}
                    placeholder="e.g., MORSE Score: 45"
                  />
                </div>
                <div>
                  <Label>Diagnosis Link</Label>
                  <Input
                    value={problem.diagnosisLink || ''}
                    onChange={(e) => updateProblem(index, 'diagnosisLink', e.target.value)}
                    placeholder="e.g., ICD-10 code"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      <Button onClick={addProblem} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Problem
      </Button>
    </CardContent>
  </Card>
);

const GoalsSection = ({ goals, updateGoal, addGoal, removeGoal }: any) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Target className="h-5 w-5" />
        SMART Goals
      </CardTitle>
      <CardDescription>Define specific, measurable, achievable, relevant, and time-bound goals</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {goals.map((goal: CarePlanGoal, index: number) => (
        <Card key={index} className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Goal {index + 1}</h4>
              {goals.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeGoal(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <Label>Goal Description *</Label>
                <Textarea
                  value={goal.goal}
                  onChange={(e) => updateGoal(index, 'goal', e.target.value)}
                  placeholder="e.g., Prevent falls while maintaining mobility and independence"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Success Metric</Label>
                  <Input
                    value={goal.metric}
                    onChange={(e) => updateGoal(index, 'metric', e.target.value)}
                    placeholder="e.g., Zero falls over 30-day period"
                  />
                </div>
                <div>
                  <Label>Target Date</Label>
                  <Input
                    type="date"
                    value={goal.targetDate}
                    onChange={(e) => updateGoal(index, 'targetDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Status</Label>
                <Select 
                  value={goal.status} 
                  onValueChange={(value) => updateGoal(index, 'status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Achieved">Achieved</SelectItem>
                    <SelectItem value="Not Achieved">Not Achieved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      <Button onClick={addGoal} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Goal
      </Button>
    </CardContent>
  </Card>
);

const InterventionsSection = ({ interventions, updateIntervention, addIntervention, removeIntervention }: any) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5" />
        Interventions
      </CardTitle>
      <CardDescription>Define specific actions and care interventions</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {interventions.map((intervention: CarePlanIntervention, index: number) => (
        <Card key={index} className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Intervention {index + 1}</h4>
              {interventions.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeIntervention(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <Label>Action/Intervention *</Label>
                <Textarea
                  value={intervention.action}
                  onChange={(e) => updateIntervention(index, 'action', e.target.value)}
                  placeholder="e.g., Bed alarm activated at night and during rest periods"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Frequency</Label>
                  <Input
                    value={intervention.frequency}
                    onChange={(e) => updateIntervention(index, 'frequency', e.target.value)}
                    placeholder="e.g., 24/7 when in bed"
                  />
                </div>
                <div>
                  <Label>Responsible Role</Label>
                  <Select 
                    value={intervention.responsibleRole} 
                    onValueChange={(value) => updateIntervention(index, 'responsibleRole', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RN">Registered Nurse</SelectItem>
                      <SelectItem value="EN">Enrolled Nurse</SelectItem>
                      <SelectItem value="PCW">Personal Care Worker</SelectItem>
                      <SelectItem value="All staff">All Staff</SelectItem>
                      <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
                      <SelectItem value="Occupational Therapist">Occupational Therapist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select 
                    value={intervention.priority} 
                    onValueChange={(value) => updateIntervention(index, 'priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      <Button onClick={addIntervention} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Intervention
      </Button>
    </CardContent>
  </Card>
);

const RisksSection = ({ risks, updateRisk, addRisk, removeRisk }: any) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Risk Assessment & Mitigation
      </CardTitle>
      <CardDescription>Identify potential risks and mitigation strategies</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {risks.map((risk: CarePlanRisk, index: number) => (
        <Card key={index} className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Risk {index + 1}</h4>
              {risks.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeRisk(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <Label>Risk Description</Label>
                <Textarea
                  value={risk.risk}
                  onChange={(e) => updateRisk(index, 'risk', e.target.value)}
                  placeholder="e.g., Fall resulting in fracture or head injury"
                  rows={2}
                />
              </div>
              
              <div>
                <Label>Mitigation Strategy</Label>
                <Textarea
                  value={risk.mitigation}
                  onChange={(e) => updateRisk(index, 'mitigation', e.target.value)}
                  placeholder="e.g., Bed alarm, frequent checks, clear pathways"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Escalation Process</Label>
                  <Textarea
                    value={risk.escalation}
                    onChange={(e) => updateRisk(index, 'escalation', e.target.value)}
                    placeholder="e.g., If fall occurs: complete incident report, medical assessment"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Risk Level</Label>
                  <Select 
                    value={risk.level} 
                    onValueChange={(value) => updateRisk(index, 'level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      <Button onClick={addRisk} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Risk
      </Button>
    </CardContent>
  </Card>
);

const MonitoringSection = ({ monitoring, updateMonitoring, addMonitoring, removeMonitoring }: any) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        Monitoring & Evaluation
      </CardTitle>
      <CardDescription>Define what to monitor and evaluation criteria</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {monitoring.map((monitor: CarePlanMonitoring, index: number) => (
        <Card key={index} className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Monitoring Item {index + 1}</h4>
              {monitoring.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeMonitoring(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <Label>What to Monitor</Label>
                <Input
                  value={monitor.what}
                  onChange={(e) => updateMonitoring(index, 'what', e.target.value)}
                  placeholder="e.g., Falls incidents and near misses"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Responsible Person</Label>
                  <Input
                    value={monitor.who}
                    onChange={(e) => updateMonitoring(index, 'who', e.target.value)}
                    placeholder="e.g., All nursing staff"
                  />
                </div>
                <div>
                  <Label>Frequency</Label>
                  <Input
                    value={monitor.frequency}
                    onChange={(e) => updateMonitoring(index, 'frequency', e.target.value)}
                    placeholder="e.g., Continuous monitoring"
                  />
                </div>
              </div>
              
              <div>
                <Label>Thresholds & Alerts</Label>
                <Textarea
                  value={monitor.thresholds || ''}
                  onChange={(e) => updateMonitoring(index, 'thresholds', e.target.value)}
                  placeholder="e.g., Any fall or near miss requires immediate reporting"
                  rows={2}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`alerts-${index}`}
                  checked={monitor.alertsEnabled}
                  onChange={(e) => updateMonitoring(index, 'alertsEnabled', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor={`alerts-${index}`}>Enable automated alerts</Label>
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      <Button onClick={addMonitoring} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Monitoring Item
      </Button>
    </CardContent>
  </Card>
);