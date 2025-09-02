import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus,
  Eye,
  Edit,
  FileText,
  Download,
  Shield,
  CheckCircle,
  AlertTriangle,
  Users
} from 'lucide-react';
import { SupportPlan, SupportPlanStatus, StaffRole, ROLE_PERMISSIONS } from '@/lib/support-plan-types';
import { SupportPlanBuilder } from './support-plan-builder';
import { SupportPlanPDFExport } from './support-plan-pdf-export';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface SupportPlanManagerProps {
  residentId: string;
  currentUserRole: StaffRole;
}

// Mock data - in real app this would come from API
const mockSupportPlans: SupportPlan[] = [
  {
    id: 'sp-001',
    residentId: '1',
    title: 'Daily Living Support Plan',
    status: 'FINAL',
    version: 2,
    tasks: [],
    facilityTemplate: 'high-care',
    specialInstructions: 'Resident prefers morning showers and weak coffee',
    guardianSignatureRequired: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    createdBy: 'Sarah Johnson, RN',
    updatedBy: 'Sarah Johnson, RN',
    finalizedBy: 'Sarah Johnson, RN',
    finalizedAt: '2024-01-20T10:30:00Z',
    nextReviewDate: '2024-04-20T00:00:00Z'
  }
];

const getStatusColor = (status: SupportPlanStatus) => {
  switch (status) {
    case 'FINAL': return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
    case 'DRAFT': return 'bg-amber-500/10 text-amber-700 border-amber-200';
    case 'ARCHIVED': return 'bg-slate-500/10 text-slate-700 border-slate-200';
    default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
  }
};

const getStatusIcon = (status: SupportPlanStatus) => {
  switch (status) {
    case 'FINAL': return <CheckCircle className="h-4 w-4" />;
    case 'DRAFT': return <Clock className="h-4 w-4" />;
    case 'ARCHIVED': return <FileText className="h-4 w-4" />;
    default: return <AlertTriangle className="h-4 w-4" />;
  }
};

export const SupportPlanManager = ({ residentId, currentUserRole }: SupportPlanManagerProps) => {
  const { toast } = useToast();
  const permissions = ROLE_PERMISSIONS[currentUserRole];
  
  const [supportPlans, setSupportPlans] = useState<SupportPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SupportPlan | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPDFOpen, setIsPDFOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SupportPlan | null>(null);

  useEffect(() => {
    // Filter mock data by resident ID
    const plans = mockSupportPlans.filter(plan => plan.residentId === residentId);
    setSupportPlans(plans);
  }, [residentId]);

  const handleViewPlan = (plan: SupportPlan) => {
    setSelectedPlan(plan);
    setIsDetailOpen(true);
  };

  const handleEditPlan = (plan: SupportPlan) => {
    if (!permissions.canEdit) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to edit support plans',
        variant: 'destructive'
      });
      return;
    }
    setEditingPlan(plan);
    setIsBuilderOpen(true);
  };

  const handleFinalizePlan = async (planId: string) => {
    if (!permissions.canFinalize) {
      toast({
        title: 'Access Denied',
        description: 'Only RNs can finalize support plans',
        variant: 'destructive'
      });
      return;
    }

    const updatedPlans = supportPlans.map(plan => 
      plan.id === planId 
        ? { 
            ...plan, 
            status: 'FINAL' as SupportPlanStatus,
            finalizedBy: 'Current User',
            finalizedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : plan
    );
    
    setSupportPlans(updatedPlans);
    toast({
      title: 'Plan Finalized',
      description: 'Support plan has been finalized and is now active',
    });
  };

  const handleArchivePlan = async (planId: string) => {
    if (!permissions.canArchive) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to archive support plans',
        variant: 'destructive'
      });
      return;
    }

    const updatedPlans = supportPlans.map(plan => 
      plan.id === planId 
        ? { 
            ...plan, 
            status: 'ARCHIVED' as SupportPlanStatus,
            updatedAt: new Date().toISOString()
          }
        : plan
    );
    
    setSupportPlans(updatedPlans);
    toast({
      title: 'Plan Archived',
      description: 'Support plan has been archived',
    });
  };

  const handleSaveNewPlan = (supportPlan: SupportPlan) => {
    if (editingPlan) {
      // Update existing plan
      setSupportPlans(supportPlans.map(p => p.id === editingPlan.id ? supportPlan : p));
      setEditingPlan(null);
    } else {
      // Add new plan
      setSupportPlans([...supportPlans, supportPlan]);
    }
    setIsBuilderOpen(false);
  };

  const handleExportPDF = (plan: SupportPlan) => {
    if (!permissions.canExportPDF) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to export PDFs',
        variant: 'destructive'
      });
      return;
    }
    setSelectedPlan(plan);
    setIsPDFOpen(true);
  };

  const finalPlans = supportPlans.filter(plan => plan.status === 'FINAL');
  const draftPlans = supportPlans.filter(plan => plan.status === 'DRAFT');
  const archivedPlans = supportPlans.filter(plan => plan.status === 'ARCHIVED');

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Support Plans
              </CardTitle>
              <CardDescription>
                Daily care task management and support planning
              </CardDescription>
            </div>
            {permissions.canCreate && (
              <Button onClick={() => setIsBuilderOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Support Plan
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="final" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="final">Active ({finalPlans.length})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({draftPlans.length})</TabsTrigger>
              <TabsTrigger value="archived">Archived ({archivedPlans.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="final" className="space-y-4">
              {finalPlans.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active support plans
                </div>
              ) : (
                finalPlans.map((plan) => (
                  <SupportPlanCard 
                    key={plan.id} 
                    plan={plan}
                    currentUserRole={currentUserRole}
                    onView={handleViewPlan}
                    onEdit={handleEditPlan}
                    onFinalize={handleFinalizePlan}
                    onArchive={handleArchivePlan}
                    onExportPDF={handleExportPDF}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="drafts" className="space-y-4">
              {draftPlans.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No draft support plans
                </div>
              ) : (
                draftPlans.map((plan) => (
                  <SupportPlanCard 
                    key={plan.id} 
                    plan={plan}
                    currentUserRole={currentUserRole}
                    onView={handleViewPlan}
                    onEdit={handleEditPlan}
                    onFinalize={handleFinalizePlan}
                    onArchive={handleArchivePlan}
                    onExportPDF={handleExportPDF}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="archived" className="space-y-4">
              {archivedPlans.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No archived support plans
                </div>
              ) : (
                archivedPlans.map((plan) => (
                  <SupportPlanCard 
                    key={plan.id} 
                    plan={plan}
                    currentUserRole={currentUserRole}
                    onView={handleViewPlan}
                    onEdit={handleEditPlan}
                    onFinalize={handleFinalizePlan}
                    onArchive={handleArchivePlan}
                    onExportPDF={handleExportPDF}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Support Plan Builder */}
      <SupportPlanBuilder
        residentId={residentId}
        isOpen={isBuilderOpen}
        onClose={() => {
          setIsBuilderOpen(false);
          setEditingPlan(null);
        }}
        onSave={handleSaveNewPlan}
        currentUserRole={currentUserRole}
        existingPlan={editingPlan || undefined}
      />

      {/* Plan Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {selectedPlan?.title}
            </DialogTitle>
            <DialogDescription>
              Version {selectedPlan?.version} • {selectedPlan && format(new Date(selectedPlan.updatedAt), 'MMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <ScrollArea className="max-h-[60vh]">
              <SupportPlanDetails plan={selectedPlan} />
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Export */}
      {selectedPlan && (
        <SupportPlanPDFExport
          plan={selectedPlan}
          isOpen={isPDFOpen}
          onClose={() => setIsPDFOpen(false)}
        />
      )}
    </>
  );
};

// Support Plan Card Component
interface SupportPlanCardProps {
  plan: SupportPlan;
  currentUserRole: StaffRole;
  onView: (plan: SupportPlan) => void;
  onEdit: (plan: SupportPlan) => void;
  onFinalize: (planId: string) => void;
  onArchive: (planId: string) => void;
  onExportPDF: (plan: SupportPlan) => void;
}

const SupportPlanCard = ({ 
  plan, 
  currentUserRole, 
  onView, 
  onEdit, 
  onFinalize, 
  onArchive, 
  onExportPDF 
}: SupportPlanCardProps) => {
  const permissions = ROLE_PERMISSIONS[currentUserRole];

  return (
    <Card className="border-l-4 border-l-primary/20">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold flex items-center gap-2">
                {getStatusIcon(plan.status)}
                {plan.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {plan.tasks.length} tasks • Version {plan.version}
              </p>
            </div>
            <Badge className={getStatusColor(plan.status)}>
              {plan.status}
            </Badge>
          </div>

          {plan.specialInstructions && (
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
              {plan.specialInstructions}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Updated by: {plan.updatedBy}</span>
            </div>
            {plan.nextReviewDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Review: {format(new Date(plan.nextReviewDate), 'MMM d, yyyy')}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                Updated {format(new Date(plan.updatedAt), 'MMM d, yyyy')}
              </span>
              {plan.guardianSignatureRequired && (
                <>
                  <span>•</span>
                  <Shield className="h-3 w-3" />
                  <span>Guardian signature required</span>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(plan)}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              {permissions.canEdit && plan.status !== 'ARCHIVED' && (
                <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              {permissions.canFinalize && plan.status === 'DRAFT' && (
                <Button variant="outline" size="sm" onClick={() => onFinalize(plan.id)}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Finalize
                </Button>
              )}
              {permissions.canExportPDF && plan.status === 'FINAL' && (
                <Button variant="outline" size="sm" onClick={() => onExportPDF(plan)}>
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Support Plan Details Component
interface SupportPlanDetailsProps {
  plan: SupportPlan;
}

const SupportPlanDetails = ({ plan }: SupportPlanDetailsProps) => {
  const tasksByTimeSlot = plan.tasks.reduce((acc, task) => {
    task.timeSlots.forEach(slot => {
      if (!acc[slot]) acc[slot] = [];
      acc[slot].push(task);
    });
    return acc;
  }, {} as Record<string, typeof plan.tasks>);

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <div className="space-y-4">
        <h4 className="font-semibold">Plan Overview</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Status:</strong> {plan.status}
          </div>
          <div>
            <strong>Version:</strong> {plan.version}
          </div>
          <div>
            <strong>Total Tasks:</strong> {plan.tasks.length}
          </div>
          <div>
            <strong>Created by:</strong> {plan.createdBy}
          </div>
        </div>
        
        {plan.specialInstructions && (
          <div>
            <strong>Special Instructions:</strong>
            <p className="mt-1 p-3 bg-muted rounded">{plan.specialInstructions}</p>
          </div>
        )}
      </div>

      {/* Tasks by Time Slot */}
      <div className="space-y-4">
        <h4 className="font-semibold">Daily Schedule</h4>
        <Tabs defaultValue="AM" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="AM">Morning ({tasksByTimeSlot.AM?.length || 0})</TabsTrigger>
            <TabsTrigger value="PM">Afternoon ({tasksByTimeSlot.PM?.length || 0})</TabsTrigger>
            <TabsTrigger value="Night">Night ({tasksByTimeSlot.Night?.length || 0})</TabsTrigger>
            <TabsTrigger value="PRN">PRN ({tasksByTimeSlot.PRN?.length || 0})</TabsTrigger>
          </TabsList>

          {(['AM', 'PM', 'Night', 'PRN'] as const).map(timeSlot => (
            <TabsContent key={timeSlot} value={timeSlot} className="space-y-3">
              {!tasksByTimeSlot[timeSlot] || tasksByTimeSlot[timeSlot].length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No tasks scheduled for {timeSlot.toLowerCase()}
                </div>
              ) : (
                tasksByTimeSlot[timeSlot].map(task => (
                  <Card key={task.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h5 className="font-medium">{task.title}</h5>
                        <Badge variant="outline">{task.assignedRole}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline">{task.frequency}</Badge>
                        {task.timeSlots.map(slot => (
                          <Badge key={slot} variant="outline">{slot}</Badge>
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
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};