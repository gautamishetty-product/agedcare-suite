import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, AlertTriangle, Activity, Calendar, TrendingUp, FileText } from 'lucide-react';
import { mockResidents, mockIncidents, mockTasks, mockObservations } from '@/lib/mock-data';
import { Link } from 'react-router-dom';

export function DashboardOverview() {
  const totalResidents = mockResidents.length;
  const criticalAlerts = mockIncidents.filter(i => i.severity === 'Critical' || i.severity === 'High').length;
  const pendingTasks = mockTasks.filter(t => t.status === 'Pending').length;
  const overdueReviews = mockResidents.filter(r => 
    r.nextReviewDate && new Date(r.nextReviewDate) < new Date()
  ).length;

  const recentObservations = mockObservations
    .filter(o => o.thresholdFlag)
    .slice(0, 5);

  const criticalResidents = mockResidents.filter(r => 
    r.allergies.length > 0 || r.isInfectionControl || r.hasAdvanceDirective
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Clinical Information System Overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResidents}</div>
            <p className="text-xs text-muted-foreground">
              Active residents in care
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tasks due today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Reviews</CardTitle>
            <FileText className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{overdueReviews}</div>
            <p className="text-xs text-muted-foreground">
              Care plan reviews overdue
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Observations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Critical Observations
            </CardTitle>
            <CardDescription>
              Recent vitals requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentObservations.map((obs) => {
                const resident = mockResidents.find(r => r.id === obs.residentId);
                return (
                  <div key={obs.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{resident?.preferredName || resident?.fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        {obs.type}: {obs.value} {obs.unit}
                      </div>
                    </div>
                    <Badge variant={obs.thresholdFlag === 'CRITICAL' ? 'destructive' : 'secondary'}>
                      {obs.thresholdFlag}
                    </Badge>
                  </div>
                );
              })}
              {recentObservations.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No critical observations at this time
                </p>
              )}
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link to="/clinical/vitals">View All Vitals</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Residents Requiring Attention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Residents Requiring Attention
            </CardTitle>
            <CardDescription>
              Special care considerations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalResidents.slice(0, 4).map((resident) => (
                <div key={resident.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{resident.preferredName || resident.fullName}</div>
                    <div className="text-sm text-muted-foreground">Room {resident.roomNumber}</div>
                  </div>
                  <div className="flex gap-1">
                    {resident.allergies.length > 0 && (
                      <Badge variant="destructive" className="text-xs">ALLERGY</Badge>
                    )}
                    {resident.isInfectionControl && (
                      <Badge variant="secondary" className="text-xs">ISOLATION</Badge>
                    )}
                    {resident.hasAdvanceDirective && (
                      <Badge variant="outline" className="text-xs">ACD</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link to="/residents">View All Residents</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and navigation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline">
              <Link to="/residents/new" className="flex flex-col items-center gap-2 h-20">
                <Users className="h-6 w-6" />
                <span className="text-sm">Add Resident</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link to="/incidents/new" className="flex flex-col items-center gap-2 h-20">
                <AlertTriangle className="h-6 w-6" />
                <span className="text-sm">Report Incident</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link to="/clinical/vitals/new" className="flex flex-col items-center gap-2 h-20">
                <Activity className="h-6 w-6" />
                <span className="text-sm">Record Vitals</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link to="/tasks" className="flex flex-col items-center gap-2 h-20">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">View Tasks</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}