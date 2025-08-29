import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Save, ArrowLeft, Activity, User, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { mockResidents } from '@/lib/mock-data';

interface VitalSign {
  type: string;
  value: string;
  unit: string;
  thresholdFlag?: 'HIGH' | 'LOW' | 'CRITICAL';
}

export function NewVitalsForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedResident, setSelectedResident] = useState('');
  const [recordedBy, setRecordedBy] = useState('Demo User, RN');

  const [vitals, setVitals] = useState<{ [key: string]: VitalSign }>({
    BP: { type: 'BP', value: '', unit: 'mmHg' },
    HR: { type: 'HR', value: '', unit: 'bpm' },
    RR: { type: 'RR', value: '', unit: '/min' },
    TEMP: { type: 'TEMP', value: '', unit: '°C' },
    SPO2: { type: 'SPO2', value: '', unit: '%' },
    PAIN: { type: 'PAIN', value: '', unit: '/10' },
    WEIGHT: { type: 'WEIGHT', value: '', unit: 'kg' },
    BSL: { type: 'BSL', value: '', unit: 'mmol/L' }
  });

  const updateVital = (type: string, value: string) => {
    const newVital = { ...vitals[type], value };
    
    // Simple threshold checking for demo
    if (type === 'BP' && value) {
      const [systolic] = value.split('/').map(Number);
      if (systolic > 180) newVital.thresholdFlag = 'CRITICAL';
      else if (systolic > 140) newVital.thresholdFlag = 'HIGH';
      else if (systolic < 90) newVital.thresholdFlag = 'LOW';
      else delete newVital.thresholdFlag;
    } else if (type === 'HR' && value) {
      const hr = Number(value);
      if (hr > 120) newVital.thresholdFlag = 'HIGH';
      else if (hr < 60) newVital.thresholdFlag = 'LOW';
      else delete newVital.thresholdFlag;
    } else if (type === 'TEMP' && value) {
      const temp = Number(value);
      if (temp > 38.5) newVital.thresholdFlag = 'HIGH';
      else if (temp < 35.5) newVital.thresholdFlag = 'LOW';
      else delete newVital.thresholdFlag;
    } else if (type === 'SPO2' && value) {
      const spo2 = Number(value);
      if (spo2 < 90) newVital.thresholdFlag = 'CRITICAL';
      else if (spo2 < 95) newVital.thresholdFlag = 'LOW';
      else delete newVital.thresholdFlag;
    } else if (type === 'PAIN' && value) {
      const pain = Number(value);
      if (pain > 7) newVital.thresholdFlag = 'HIGH';
      else delete newVital.thresholdFlag;
    }

    setVitals(prev => ({ ...prev, [type]: newVital }));
  };

  const handleSave = () => {
    const resident = mockResidents.find(r => r.id === selectedResident);
    const recordedVitals = Object.values(vitals).filter(v => v.value);
    
    if (recordedVitals.length === 0) {
      toast({
        title: "No Vitals Recorded",
        description: "Please record at least one vital sign.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Vitals Recorded",
      description: `${recordedVitals.length} vital signs recorded for ${resident?.preferredName || resident?.fullName || 'resident'}.`,
    });
    
    navigate('/clinical/vitals');
  };

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
    if (!flag) return null;
    if (flag === 'CRITICAL') return 'destructive';
    if (flag === 'HIGH' || flag === 'LOW') return 'secondary';
    return null;
  };

  const vitalDefinitions = {
    BP: { name: 'Blood Pressure', placeholder: '120/80', normal: '90-140/60-90' },
    HR: { name: 'Heart Rate', placeholder: '72', normal: '60-100 bpm' },
    RR: { name: 'Respiratory Rate', placeholder: '16', normal: '12-20 /min' },
    TEMP: { name: 'Temperature', placeholder: '36.5', normal: '36.1-37.2°C' },
    SPO2: { name: 'Oxygen Saturation', placeholder: '98', normal: '95-100%' },
    PAIN: { name: 'Pain Score', placeholder: '2', normal: '0-3/10' },
    WEIGHT: { name: 'Weight', placeholder: '70.5', normal: 'Varies' },
    BSL: { name: 'Blood Sugar Level', placeholder: '5.5', normal: '4.0-7.8 mmol/L' }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Record Vital Signs</h1>
          <p className="text-muted-foreground">Document resident vital signs and observations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resident Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Resident Selection
              </CardTitle>
              <CardDescription>
                Select the resident for vital signs recording
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="residentId">Resident *</Label>
                <Select value={selectedResident} onValueChange={setSelectedResident}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resident" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockResidents.map((resident) => (
                      <SelectItem key={resident.id} value={resident.id}>
                        {resident.preferredName || resident.fullName} - Room {resident.roomNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recordedBy">Recorded By</Label>
                <Input
                  id="recordedBy"
                  value={recordedBy}
                  onChange={(e) => setRecordedBy(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Vital Signs
              </CardTitle>
              <CardDescription>
                Record current vital signs. Values outside normal ranges will be flagged.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(vitalDefinitions).map(([type, def]) => (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={type}>{def.name}</Label>
                      <div className="flex items-center gap-2">
                        {getThresholdIcon(vitals[type].thresholdFlag)}
                        {vitals[type].thresholdFlag && (
                          <Badge variant={getThresholdColor(vitals[type].thresholdFlag)!}>
                            {vitals[type].thresholdFlag}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        id={type}
                        value={vitals[type].value}
                        onChange={(e) => updateVital(type, e.target.value)}
                        placeholder={def.placeholder}
                        className="flex-1"
                      />
                      <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                        {vitals[type].unit}
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Normal range: {def.normal}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Resident */}
          {selectedResident && (
            <Card>
              <CardHeader>
                <CardTitle>Resident Details</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const resident = mockResidents.find(r => r.id === selectedResident);
                  if (!resident) return null;
                  
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={resident.photoUrl} alt={resident.fullName} />
                          <AvatarFallback>{getInitials(resident.fullName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{resident.preferredName || resident.fullName}</div>
                          <div className="text-sm text-muted-foreground">Room {resident.roomNumber}</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2 text-sm">
                        <div><strong>Status:</strong> {resident.status}</div>
                        <div><strong>Mobility:</strong> {resident.mobilityStatus}</div>
                        <div><strong>Cognitive:</strong> {resident.cognitiveStatus}</div>
                        
                        {resident.allergies.length > 0 && (
                          <div>
                            <strong>Allergies:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {resident.allergies.map((allergy, index) => (
                                <Badge key={index} variant="destructive" className="text-xs">
                                  {allergy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Current Session Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Recording Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                </div>
                <div className="text-sm">
                  <strong>Time:</strong> {new Date().toLocaleTimeString()}
                </div>
                <div className="text-sm">
                  <strong>Recorded by:</strong> {recordedBy}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Vitals to Record:</div>
                  {Object.values(vitals).filter(v => v.value).length === 0 ? (
                    <div className="text-xs text-muted-foreground">No vitals recorded yet</div>
                  ) : (
                    <div className="space-y-1">
                      {Object.values(vitals).filter(v => v.value).map((vital, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span>{vital.type}:</span>
                          <div className="flex items-center gap-1">
                            <span>{vital.value} {vital.unit}</span>
                            {vital.thresholdFlag && (
                              <Badge variant={getThresholdColor(vital.thresholdFlag)!} className="text-xs">
                                {vital.thresholdFlag}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {Object.values(vitals).some(v => v.thresholdFlag) && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Abnormal values detected</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Threshold Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Threshold Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Critical</Badge>
                  <span>Immediate medical attention required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">High/Low</Badge>
                  <span>Outside normal range, monitor closely</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Normal</Badge>
                  <span>Within acceptable range</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={!selectedResident || Object.values(vitals).filter(v => v.value).length === 0}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Vital Signs
        </Button>
      </div>
    </div>
  );
}