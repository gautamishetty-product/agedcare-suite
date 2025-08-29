import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { mockObservations, mockResidents } from '@/lib/mock-data';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export function ClinicalVitals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [flagFilter, setFlagFilter] = useState<string>('all');

  const filteredObservations = mockObservations.filter(obs => {
    const resident = mockResidents.find(r => r.id === obs.residentId);
    const matchesSearch = resident?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident?.preferredName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         obs.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || obs.type === typeFilter;
    const matchesFlag = flagFilter === 'all' || 
                       (flagFilter === 'flagged' && obs.thresholdFlag) ||
                       (flagFilter === 'normal' && !obs.thresholdFlag);
    
    return matchesSearch && matchesType && matchesFlag;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getThresholdIcon = (flag?: string) => {
    if (!flag) return null;
    if (flag === 'HIGH' || flag === 'CRITICAL') return <TrendingUp className="h-4 w-4 text-destructive" />;
    if (flag === 'LOW') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return null;
  };

  const getThresholdColor = (flag?: string) => {
    if (!flag) return 'outline';
    if (flag === 'CRITICAL') return 'destructive';
    if (flag === 'HIGH' || flag === 'LOW') return 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vital Signs</h1>
          <p className="text-muted-foreground">Monitor and track resident vital signs</p>
        </div>
        <Button asChild>
          <Link to="/clinical/vitals/new">
            <Plus className="h-4 w-4 mr-2" />
            Record Vitals
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by resident name or vital type..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="BP">Blood Pressure</SelectItem>
                  <SelectItem value="HR">Heart Rate</SelectItem>
                  <SelectItem value="TEMP">Temperature</SelectItem>
                  <SelectItem value="SPO2">Oxygen Saturation</SelectItem>
                  <SelectItem value="RR">Respiratory Rate</SelectItem>
                  <SelectItem value="PAIN">Pain Score</SelectItem>
                  <SelectItem value="WEIGHT">Weight</SelectItem>
                  <SelectItem value="BSL">Blood Sugar</SelectItem>
                </SelectContent>
              </Select>

              <Select value={flagFilter} onValueChange={setFlagFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockObservations.length}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {mockObservations.filter(o => o.thresholdFlag === 'CRITICAL').length}
            </div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High/Low Readings</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {mockObservations.filter(o => o.thresholdFlag === 'HIGH' || o.thresholdFlag === 'LOW').length}
            </div>
            <p className="text-xs text-muted-foreground">Outside normal range</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Normal Readings</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {mockObservations.filter(o => !o.thresholdFlag).length}
            </div>
            <p className="text-xs text-muted-foreground">Within normal limits</p>
          </CardContent>
        </Card>
      </div>

      {/* Vitals List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Vital Signs</CardTitle>
          <CardDescription>
            All vital sign recordings with threshold indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredObservations.map((observation) => {
              const resident = mockResidents.find(r => r.id === observation.residentId);
              return (
                <Dialog key={observation.id}>
                  <DialogTrigger asChild>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={resident?.photoUrl} alt={resident?.fullName} />
                          <AvatarFallback>{getInitials(resident?.fullName || '')}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-medium">{resident?.preferredName || resident?.fullName}</div>
                          <div className="text-sm text-muted-foreground">
                            Room {resident?.roomNumber}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium">{observation.type}</div>
                          <div className="text-lg font-bold">
                            {observation.value} {observation.unit}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getThresholdIcon(observation.thresholdFlag)}
                          {observation.thresholdFlag && (
                            <Badge variant={getThresholdColor(observation.thresholdFlag)}>
                              {observation.thresholdFlag}
                            </Badge>
                          )}
                        </div>

                        <div className="text-right text-sm text-muted-foreground">
                          <div>{format(new Date(observation.recordedAt), 'dd/MM/yyyy')}</div>
                          <div>{format(new Date(observation.recordedAt), 'HH:mm')}</div>
                          <div className="text-xs">{observation.recordedBy}</div>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Vital Signs Details</DialogTitle>
                      <DialogDescription>
                        Detailed information for {resident?.preferredName || resident?.fullName}'s {observation.type} reading
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Resident Info */}
                      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={resident?.photoUrl} alt={resident?.fullName} />
                          <AvatarFallback>{getInitials(resident?.fullName || '')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{resident?.preferredName || resident?.fullName}</div>
                          <div className="text-sm text-muted-foreground">Room {resident?.roomNumber}</div>
                        </div>
                      </div>

                      {/* Vital Reading */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Vital Type</div>
                          <div className="text-lg font-semibold">{observation.type}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Reading</div>
                          <div className="text-2xl font-bold flex items-center gap-2">
                            {observation.value} {observation.unit}
                            {getThresholdIcon(observation.thresholdFlag)}
                          </div>
                        </div>
                      </div>

                      {/* Status & Threshold */}
                      {observation.thresholdFlag && (
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            {getThresholdIcon(observation.thresholdFlag)}
                            <Badge variant={getThresholdColor(observation.thresholdFlag)}>
                              {observation.thresholdFlag}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            This reading is outside the normal range and requires attention.
                          </div>
                        </div>
                      )}

                      {/* Recording Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Recorded Date</div>
                          <div>{format(new Date(observation.recordedAt), 'EEEE, MMMM d, yyyy')}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Recorded Time</div>
                          <div>{format(new Date(observation.recordedAt), 'h:mm a')}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Recorded By</div>
                        <div>{observation.recordedBy}</div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}

            {filteredObservations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  No vital signs found matching your criteria.
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}