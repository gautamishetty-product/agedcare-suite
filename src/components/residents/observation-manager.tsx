import { useState } from 'react';
import { Observation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Plus, Activity, Thermometer, Heart, Gauge, Droplets, Scale, Zap, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ObservationManagerProps {
  observations: Observation[];
  residentId: string;
  onSave: (observations: Observation[]) => void;
}

interface VitalSignsForm {
  temperature?: string;
  systolic?: string;
  diastolic?: string;
  heartRate?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  weight?: string;
  bloodSugar?: string;
  painScore?: string;
  recordedAt: string;
  recordedBy: string;
  notes?: string;
}

export const ObservationManager = ({ observations, residentId, onSave }: ObservationManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<VitalSignsForm>({
    recordedAt: new Date().toISOString().slice(0, 16),
    recordedBy: '',
  });

  const handleInputChange = (field: keyof VitalSignsForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getObservationIcon = (type: string) => {
    switch (type) {
      case 'TEMP': return <Thermometer className="h-4 w-4" />;
      case 'BP': return <Heart className="h-4 w-4" />;
      case 'HR': return <Activity className="h-4 w-4" />;
      case 'RR': return <Gauge className="h-4 w-4" />;
      case 'SPO2': return <Droplets className="h-4 w-4" />;
      case 'WEIGHT': return <Scale className="h-4 w-4" />;
      case 'BSL': return <Zap className="h-4 w-4" />;
      case 'PAIN': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getThresholdFlag = (type: string, value: string): 'HIGH' | 'LOW' | 'CRITICAL' | undefined => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return undefined;

    switch (type) {
      case 'TEMP':
        if (numValue >= 38.5) return 'HIGH';
        if (numValue <= 35.5) return 'LOW';
        break;
      case 'HR':
        if (numValue >= 100) return 'HIGH';
        if (numValue <= 60) return 'LOW';
        break;
      case 'RR':
        if (numValue >= 20) return 'HIGH';
        if (numValue <= 12) return 'LOW';
        break;
      case 'SPO2':
        if (numValue <= 95) return 'LOW';
        if (numValue <= 88) return 'CRITICAL';
        break;
      case 'BP_SYSTOLIC':
        if (numValue >= 140) return 'HIGH';
        if (numValue <= 90) return 'LOW';
        break;
      case 'BP_DIASTOLIC':
        if (numValue >= 90) return 'HIGH';
        if (numValue <= 60) return 'LOW';
        break;
    }
    return undefined;
  };

  const openDialog = () => {
    setFormData({
      recordedAt: new Date().toISOString().slice(0, 16),
      recordedBy: '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const newObservations: Observation[] = [];
    const timestamp = formData.recordedAt || new Date().toISOString();
    const recordedBy = formData.recordedBy || '';

    // Temperature
    if (formData.temperature) {
      newObservations.push({
        id: `obs-temp-${Date.now()}`,
        residentId,
        type: 'TEMP',
        value: formData.temperature,
        unit: '°C',
        recordedAt: timestamp,
        recordedBy,
        thresholdFlag: getThresholdFlag('TEMP', formData.temperature),
      });
    }

    // Blood Pressure
    if (formData.systolic && formData.diastolic) {
      newObservations.push({
        id: `obs-bp-${Date.now()}`,
        residentId,
        type: 'BP',
        value: `${formData.systolic}/${formData.diastolic}`,
        systolic: parseInt(formData.systolic),
        diastolic: parseInt(formData.diastolic),
        unit: 'mmHg',
        recordedAt: timestamp,
        recordedBy,
        thresholdFlag: getThresholdFlag('BP_SYSTOLIC', formData.systolic) || getThresholdFlag('BP_DIASTOLIC', formData.diastolic),
      });
    }

    // Heart Rate
    if (formData.heartRate) {
      newObservations.push({
        id: `obs-hr-${Date.now()}`,
        residentId,
        type: 'HR',
        value: formData.heartRate,
        unit: 'bpm',
        recordedAt: timestamp,
        recordedBy,
        thresholdFlag: getThresholdFlag('HR', formData.heartRate),
      });
    }

    // Respiratory Rate
    if (formData.respiratoryRate) {
      newObservations.push({
        id: `obs-rr-${Date.now()}`,
        residentId,
        type: 'RR',
        value: formData.respiratoryRate,
        unit: '/min',
        recordedAt: timestamp,
        recordedBy,
        thresholdFlag: getThresholdFlag('RR', formData.respiratoryRate),
      });
    }

    // Oxygen Saturation
    if (formData.oxygenSaturation) {
      newObservations.push({
        id: `obs-spo2-${Date.now()}`,
        residentId,
        type: 'SPO2',
        value: formData.oxygenSaturation,
        unit: '%',
        recordedAt: timestamp,
        recordedBy,
        thresholdFlag: getThresholdFlag('SPO2', formData.oxygenSaturation),
      });
    }

    // Weight
    if (formData.weight) {
      newObservations.push({
        id: `obs-weight-${Date.now()}`,
        residentId,
        type: 'WEIGHT',
        value: formData.weight,
        unit: 'kg',
        recordedAt: timestamp,
        recordedBy,
      });
    }

    // Blood Sugar Level
    if (formData.bloodSugar) {
      newObservations.push({
        id: `obs-bsl-${Date.now()}`,
        residentId,
        type: 'BSL',
        value: formData.bloodSugar,
        unit: 'mmol/L',
        recordedAt: timestamp,
        recordedBy,
      });
    }

    // Pain Score
    if (formData.painScore) {
      newObservations.push({
        id: `obs-pain-${Date.now()}`,
        residentId,
        type: 'PAIN',
        value: formData.painScore,
        unit: '/10',
        recordedAt: timestamp,
        recordedBy,
      });
    }

    if (newObservations.length > 0) {
      const updatedObservations = [...observations, ...newObservations];
      onSave(updatedObservations);
      setIsDialogOpen(false);
      toast({
        title: "Vital signs recorded",
        description: `Successfully recorded ${newObservations.length} observations.`,
      });
    } else {
      toast({
        title: "No observations to record",
        description: "Please fill in at least one vital sign measurement.",
        variant: "destructive",
      });
    }
  };

  const getThresholdBadgeVariant = (flag?: string) => {
    switch (flag) {
      case 'HIGH': return 'destructive';
      case 'LOW': return 'secondary';
      case 'CRITICAL': return 'destructive';
      default: return 'outline';
    }
  };

  // Group observations by recorded time
  const groupedObservations = observations.reduce((groups, obs) => {
    const timeKey = obs.recordedAt;
    if (!groups[timeKey]) {
      groups[timeKey] = [];
    }
    groups[timeKey].push(obs);
    return groups;
  }, {} as Record<string, Observation[]>);

  const sortedTimeKeys = Object.keys(groupedObservations).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Vital Signs & Observations
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Record Vital Signs
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record Vital Signs & Observations</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Recording Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recordedAt">Date & Time</Label>
                  <Input
                    id="recordedAt"
                    type="datetime-local"
                    value={formData.recordedAt}
                    onChange={(e) => handleInputChange('recordedAt', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="recordedBy">Recorded By</Label>
                  <Input
                    id="recordedBy"
                    value={formData.recordedBy}
                    onChange={(e) => handleInputChange('recordedBy', e.target.value)}
                    placeholder="e.g., John Doe, RN"
                  />
                </div>
              </div>

              <Separator />

              {/* Vital Signs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Temperature */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    Temperature (°C)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={formData.temperature || ''}
                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Normal: 36.1-37.2°C</p>
                </div>

                {/* Blood Pressure */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Blood Pressure (mmHg)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="120"
                      value={formData.systolic || ''}
                      onChange={(e) => handleInputChange('systolic', e.target.value)}
                    />
                    <span className="self-center">/</span>
                    <Input
                      type="number"
                      placeholder="80"
                      value={formData.diastolic || ''}
                      onChange={(e) => handleInputChange('diastolic', e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Normal: &lt;120/80 mmHg</p>
                </div>

                {/* Heart Rate */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Heart Rate (bpm)
                  </Label>
                  <Input
                    type="number"
                    placeholder="72"
                    value={formData.heartRate || ''}
                    onChange={(e) => handleInputChange('heartRate', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Normal: 60-100 bpm</p>
                </div>

                {/* Respiratory Rate */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    Respiratory Rate (/min)
                  </Label>
                  <Input
                    type="number"
                    placeholder="16"
                    value={formData.respiratoryRate || ''}
                    onChange={(e) => handleInputChange('respiratoryRate', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Normal: 12-20 /min</p>
                </div>

                {/* Oxygen Saturation */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    Oxygen Saturation (%)
                  </Label>
                  <Input
                    type="number"
                    placeholder="98"
                    value={formData.oxygenSaturation || ''}
                    onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Normal: &gt;95%</p>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Weight (kg)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="70.0"
                    value={formData.weight || ''}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                  />
                </div>

                {/* Blood Sugar Level */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Blood Sugar (mmol/L)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="5.5"
                    value={formData.bloodSugar || ''}
                    onChange={(e) => handleInputChange('bloodSugar', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Normal: 4.0-7.8 mmol/L</p>
                </div>

                {/* Pain Score */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Pain Score (/10)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    placeholder="0"
                    value={formData.painScore || ''}
                    onChange={(e) => handleInputChange('painScore', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">0 = No pain, 10 = Severe pain</p>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full" size="lg">
                Record Vital Signs
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedTimeKeys.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No observations recorded
            </p>
          ) : (
            sortedTimeKeys.map(timeKey => {
              const obsGroup = groupedObservations[timeKey];
              const firstObs = obsGroup[0];
              
              return (
                <Card key={timeKey} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <h4 className="font-medium">
                          {format(new Date(timeKey), 'dd/MM/yyyy HH:mm')}
                        </h4>
                      </div>
                      <Badge variant="outline">{firstObs.recordedBy}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {obsGroup.map(obs => (
                        <div key={obs.id} className="flex items-center gap-2">
                          {getObservationIcon(obs.type)}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium">
                              {obs.type === 'SPO2' ? 'SpO₂' : obs.type}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-bold">
                                {obs.value} {obs.unit}
                              </span>
                              {obs.thresholdFlag && (
                                <Badge 
                                  variant={getThresholdBadgeVariant(obs.thresholdFlag)} 
                                  className="text-xs px-1 py-0"
                                >
                                  {obs.thresholdFlag}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};