import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Circle, 
  XCircle,
  Plus,
  Eye,
  Edit,
  FileText,
  Target,
  Shield,
  Activity
} from 'lucide-react';
import { CarePlan, CarePlanRevision, CarePlanStatus } from '@/lib/types';
import { getMockCarePlansByResident, getMockCarePlanRevision } from '@/lib/mock-data';
import { format } from 'date-fns';

interface CarePlanManagerProps {
  residentId: string;
}

const getStatusColor = (status: CarePlanStatus) => {
  switch (status) {
    case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
    case 'APPROVED': return 'bg-blue-500/10 text-blue-700 border-blue-200';
    case 'IN_REVIEW': return 'bg-amber-500/10 text-amber-700 border-amber-200';
    case 'DRAFT': return 'bg-gray-500/10 text-gray-700 border-gray-200';
    case 'REJECTED': return 'bg-red-500/10 text-red-700 border-red-200';
    case 'ARCHIVED': return 'bg-slate-500/10 text-slate-700 border-slate-200';
    default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
  }
};

const getGoalStatusIcon = (status: string) => {
  switch (status) {
    case 'Achieved': return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    case 'In Progress': return <Circle className="h-4 w-4 text-blue-600" />;
    case 'Not Started': return <Circle className="h-4 w-4 text-gray-400" />;
    case 'Not Achieved': return <XCircle className="h-4 w-4 text-red-600" />;
    default: return <Circle className="h-4 w-4 text-gray-400" />;
  }
};

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'Critical': return 'text-red-700';
    case 'High': return 'text-orange-700';
    case 'Medium': return 'text-amber-700';
    case 'Low': return 'text-green-700';
    default: return 'text-gray-700';
  }
};

export const CarePlanManager = ({ residentId }: CarePlanManagerProps) => {
  const [carePlans, setCarePlans] = useState<CarePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<CarePlan | null>(null);
  const [selectedRevision, setSelectedRevision] = useState<CarePlanRevision | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const plans = getMockCarePlansByResident(residentId);
    setCarePlans(plans);
  }, [residentId]);

  const handleViewPlan = (plan: CarePlan) => {
    setSelectedPlan(plan);
    if (plan.currentRevisionId) {
      const revision = getMockCarePlanRevision(plan.currentRevisionId);
      setSelectedRevision(revision || null);
    }
    setIsDialogOpen(true);
  };

  const getGoalProgress = (revision: CarePlanRevision) => {
    const achieved = revision.goals.filter(g => g.status === 'Achieved').length;
    return (achieved / revision.goals.length) * 100;
  };

  const activePlans = carePlans.filter(cp => cp.status === 'ACTIVE');
  const draftPlans = carePlans.filter(cp => cp.status === 'DRAFT' || cp.status === 'IN_REVIEW');
  const archivedPlans = carePlans.filter(cp => cp.status === 'ARCHIVED' || cp.status === 'REJECTED');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Care Plans
            </CardTitle>
            <CardDescription>
              Comprehensive care planning and goal tracking
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Care Plan
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active ({activePlans.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({draftPlans.length})</TabsTrigger>
            <TabsTrigger value="archived">Archived ({archivedPlans.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activePlans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active care plans
              </div>
            ) : (
              activePlans.map((plan) => (
                <CarePlanCard 
                  key={plan.id} 
                  plan={plan} 
                  onView={handleViewPlan}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            {draftPlans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No draft care plans
              </div>
            ) : (
              draftPlans.map((plan) => (
                <CarePlanCard 
                  key={plan.id} 
                  plan={plan} 
                  onView={handleViewPlan}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="archived" className="space-y-4">
            {archivedPlans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No archived care plans
              </div>
            ) : (
              archivedPlans.map((plan) => (
                <CarePlanCard 
                  key={plan.id} 
                  plan={plan} 
                  onView={handleViewPlan}
                />
              ))
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedPlan?.title}
              </DialogTitle>
              <DialogDescription>
                {selectedPlan?.summary}
              </DialogDescription>
            </DialogHeader>
            
            {selectedRevision && (
              <ScrollArea className="max-h-[60vh]">
                <CarePlanDetails revision={selectedRevision} />
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

interface CarePlanCardProps {
  plan: CarePlan;
  onView: (plan: CarePlan) => void;
}

const CarePlanCard = ({ plan, onView }: CarePlanCardProps) => {
  const revision = plan.currentRevisionId ? getMockCarePlanRevision(plan.currentRevisionId) : null;
  
  const getGoalProgress = (revision: CarePlanRevision) => {
    const achieved = revision.goals.filter(g => g.status === 'Achieved').length;
    return (achieved / revision.goals.length) * 100;
  };
  
  const goalProgress = revision ? getGoalProgress(revision) : 0;

  return (
    <Card className="border-l-4 border-l-primary/20">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">{plan.title}</h3>
              <p className="text-sm text-muted-foreground">{plan.summary}</p>
            </div>
            <Badge className={getStatusColor(plan.status)}>
              {plan.status.replace('_', ' ')}
            </Badge>
          </div>

          {plan.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {plan.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Owner: {plan.ownerRole}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                Review: {plan.reviewCadenceDays ? `${plan.reviewCadenceDays} days` : 'As needed'}
              </span>
            </div>
          </div>

          {revision && revision.goals.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Goal Progress</span>
                <span>{Math.round(goalProgress)}%</span>
              </div>
              <Progress value={goalProgress} className="h-2" />
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                Updated {format(new Date(plan.updatedAt), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(plan)}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              {plan.status === 'DRAFT' && (
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CarePlanDetailsProps {
  revision: CarePlanRevision;
}

const CarePlanDetails = ({ revision }: CarePlanDetailsProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Problems & Assessment</h4>
              {revision.problems.map((problem, index) => (
                <Card key={index} className="p-4">
                  <h5 className="font-medium mb-2">{problem.title}</h5>
                  <p className="text-sm text-muted-foreground mb-2">{problem.narrative}</p>
                  {problem.evidence && (
                    <div className="text-xs bg-muted p-2 rounded">
                      <strong>Evidence:</strong> {problem.evidence}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {revision.familySummary && (
              <div>
                <h4 className="font-semibold mb-2">Family Summary</h4>
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-sm">{revision.familySummary}</p>
                </Card>
              </div>
            )}

            {revision.notes && (
              <div>
                <h4 className="font-semibold mb-2">Clinical Notes</h4>
                <Card className="p-4">
                  <p className="text-sm">{revision.notes}</p>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          {revision.goals.map((goal, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                {getGoalStatusIcon(goal.status)}
                <div className="flex-1 space-y-2">
                  <h5 className="font-medium">{goal.goal}</h5>
                  <p className="text-sm text-muted-foreground">
                    <strong>Metric:</strong> {goal.metric}
                  </p>
                  {goal.targetDate && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Target Date:</strong> {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                    </p>
                  )}
                  <Badge variant="outline" className="w-fit">
                    {goal.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="interventions" className="space-y-4">
          {revision.interventions.map((intervention, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h5 className="font-medium">{intervention.action}</h5>
                  <Badge 
                    variant={intervention.priority === 'High' ? 'destructive' : 'outline'}
                    className="text-xs"
                  >
                    {intervention.priority}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <strong>Frequency:</strong> {intervention.frequency}
                  </div>
                  <div>
                    <strong>Responsible:</strong> {intervention.responsibleRole}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          {revision.risks.map((risk, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h5 className="font-medium">{risk.risk}</h5>
                  <Badge variant="outline" className={getRiskLevelColor(risk.level)}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {risk.level}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Mitigation:</strong> {risk.mitigation}
                  </div>
                  <div>
                    <strong>Escalation:</strong> {risk.escalation}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          {revision.monitoring.map((monitor, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h5 className="font-medium">{monitor.what}</h5>
                  {monitor.alertsEnabled && (
                    <Badge variant="outline" className="text-xs">
                      <Activity className="h-3 w-3 mr-1" />
                      Alerts On
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <strong>Responsible:</strong> {monitor.who}
                  </div>
                  <div>
                    <strong>Frequency:</strong> {monitor.frequency}
                  </div>
                </div>
                {monitor.thresholds && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Thresholds:</strong> {monitor.thresholds}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarePlanManager;