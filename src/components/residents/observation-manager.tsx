import { useState } from 'react';
import { Observation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Activity, Thermometer, Heart, Gauge, Droplets, Scale, Zap } from 'lucide-react';
import { format } from 'date-fns';

interface ObservationManagerProps {
  observations: Observation[];
  residentId: string;
  onSave: (observations: Observation[]) => void;
}

export const ObservationManager = ({ observations, residentId, onSave }: ObservationManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Observation>>({
    residentId,
    type: 'TEMP',
    value: '',
    systolic: undefined,
    diastolic: undefined,
    unit: '°C',
    customType: '',
    recordedAt: new Date().toISOString().slice(0, 16),
    recordedBy: '',
    thresholdFlag: undefined,
  });

  const handleInputChange = (field: keyof Observation, value: any) => {
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

  const getUnitForType = (type: string) => {
    switch (type) {
      case 'TEMP': return '°C';
      case 'BP': return 'mmHg';
      case 'HR': return 'bpm';
      case 'RR': return '/min';
      case 'SPO2': return '%';
      case 'WEIGHT': return 'kg';
      case 'BSL': return 'mmol/L';
      case 'PAIN': return '/10';
      default: return '';
    }
  };

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      type: type as Observation['type'],
      unit: getUnitForType(type),
      value: '',
      systolic: undefined,
      diastolic: undefined,
    }));
  };

  const openDialog = () => {
    setFormData({
      residentId,
      type: 'TEMP',
      value: '',
      systolic: undefined,
      diastolic: undefined,
      unit: '°C',
      customType: '',
      recordedAt: new Date().toISOString().slice(0, 16),
      recordedBy: '',
      thresholdFlag: undefined,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    let value = formData.value || '';
    
    // For BP, combine systolic and diastolic
    if (formData.type === 'BP' && formData.systolic && formData.diastolic) {
      value = `${formData.systolic}/${formData.diastolic}`;
    }

    const observationData: Observation = {
      id: `obs-${Date.now()}`,
      residentId,
      type: formData.type || 'TEMP',
      value,
      systolic: formData.systolic,
      diastolic: formData.diastolic,
      unit: formData.unit || '',
      customType: formData.customType,
      recordedAt: formData.recordedAt || new Date().toISOString(),
      recordedBy: formData.recordedBy || '',
      thresholdFlag: formData.thresholdFlag,
    };

    const updatedObservations = [...observations, observationData];
    onSave(updatedObservations);
    setIsDialogOpen(false);
    toast({
      title: "Observation recorded",
      description: "New observation has been successfully recorded.",
    });
  };

  const getThresholdBadgeVariant = (flag?: string) => {
    switch (flag) {
      case 'HIGH': return 'destructive';
      case 'LOW': return 'secondary';
      case 'CRITICAL': return 'destructive';
      default: return 'outline';
    }
  };

  const formatObservationValue = (obs: Observation) => {
    if (obs.type === 'BP' && obs.systolic && obs.diastolic) {
      return `${obs.systolic}/${obs.diastolic}`;
    }
    return obs.value;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Observations
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Record Observation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Observation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Observation Type</Label>
                  <Select value={formData.type} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEMP">Temperature</SelectItem>
                      <SelectItem value="BP">Blood Pressure</SelectItem>
                      <SelectItem value="HR">Heart Rate</SelectItem>
                      <SelectItem value="RR">Respiratory Rate</SelectItem>
                      <SelectItem value="SPO2">Oxygen Saturation</SelectItem>
                      <SelectItem value="WEIGHT">Weight</SelectItem>
                      <SelectItem value="BSL">Blood Sugar Level</SelectItem>
                      <SelectItem value="PAIN">Pain Score</SelectItem>
                      <SelectItem value="CUSTOM">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="recordedBy">Recorded By</Label>
                  <Input
                    id="recordedBy"
                    value={formData.recordedBy || ''}
                    onChange={(e) => handleInputChange('recordedBy', e.target.value)}
                    placeholder="e.g., John Doe, RN"
                  />
                </div>
              </div>

              {formData.type === 'CUSTOM' && (
                <div>
                  <Label htmlFor="customType">Custom Type</Label>
                  <Input
                    id="customType"
                    value={formData.customType || ''}
                    onChange={(e) => handleInputChange('customType', e.target.value)}
                    placeholder="Specify custom observation type"
                  />
                </div>
              )}

              {formData.type === 'BP' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="systolic">Systolic (mmHg)</Label>
                    <Input
                      id="systolic"
                      type="number"
                      value={formData.systolic || ''}
                      onChange={(e) => handleInputChange('systolic', parseInt(e.target.value))}
                      placeholder="120"
                    />
                  </div>
                  <div>
                    <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                    <Input
                      id="diastolic"
                      type="number"
                      value={formData.diastolic || ''}
                      onChange={(e) => handleInputChange('diastolic', parseInt(e.target.value))}
                      placeholder="80"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      value={formData.value || ''}
                      onChange={(e) => handleInputChange('value', e.target.value)}
                      placeholder="Enter value"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={formData.unit || ''}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      placeholder="Unit"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recordedAt">Date & Time</Label>
                  <Input
                    id="recordedAt"
                    type="datetime-local"
                    value={formData.recordedAt || ''}
                    onChange={(e) => handleInputChange('recordedAt', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="thresholdFlag">Threshold Flag</Label>
                  <Select value={formData.thresholdFlag || ''} onValueChange={(value) => handleInputChange('thresholdFlag', value || undefined)}>
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                Record Observation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {observations.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No observations recorded
            </p>
          ) : (
            observations
              .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
              .map(observation => (
                <div key={observation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getObservationIcon(observation.type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                          {observation.type === 'CUSTOM' ? observation.customType : observation.type}
                        </h4>
                        <span className="text-lg font-semibold">
                          {formatObservationValue(observation)} {observation.unit}
                        </span>
                        {observation.thresholdFlag && (
                          <Badge variant={getThresholdBadgeVariant(observation.thresholdFlag)}>
                            {observation.thresholdFlag}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(observation.recordedAt), 'dd/MM/yyyy HH:mm')} • {observation.recordedBy}
                      </p>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};