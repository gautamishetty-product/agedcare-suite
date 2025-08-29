import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Save, ArrowLeft, AlertTriangle, Clock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { mockResidents } from '@/lib/mock-data';

export function NewIncidentForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    residentId: '',
    type: '',
    severity: '',
    description: '',
    injuryDetails: '',
    witnessNames: '',
    immediateActions: '',
    familyNotified: false,
    doctorNotified: false,
    managementNotified: false,
    occurredAt: '',
    location: '',
    contributingFactors: '',
    preventiveActions: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const selectedResident = mockResidents.find(r => r.id === formData.residentId);
    
    toast({
      title: "Incident Reported",
      description: `Incident for ${selectedResident?.preferredName || selectedResident?.fullName || 'resident'} has been successfully reported.`,
    });
    
    navigate('/incidents');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
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
          <h1 className="text-3xl font-bold">Report Incident</h1>
          <p className="text-muted-foreground">Document and report a new incident</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Incident Details
              </CardTitle>
              <CardDescription>
                Basic information about the incident
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="residentId">Resident *</Label>
                  <Select value={formData.residentId} onValueChange={(value) => handleInputChange('residentId', value)}>
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
                  <Label htmlFor="type">Incident Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fall">Fall</SelectItem>
                      <SelectItem value="Injury">Injury</SelectItem>
                      <SelectItem value="Medication Error">Medication Error</SelectItem>
                      <SelectItem value="Behavioral">Behavioral Incident</SelectItem>
                      <SelectItem value="Missing Person">Missing Person</SelectItem>
                      <SelectItem value="Property Damage">Property Damage</SelectItem>
                      <SelectItem value="Infection Control">Infection Control</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity *</Label>
                  <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occurredAt">Date & Time of Incident *</Label>
                  <Input
                    id="occurredAt"
                    type="datetime-local"
                    value={formData.occurredAt}
                    onChange={(e) => handleInputChange('occurredAt', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Where did the incident occur?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description of Incident *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what happened in detail..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="injuryDetails">Injury Details (if applicable)</Label>
                <Textarea
                  id="injuryDetails"
                  value={formData.injuryDetails}
                  onChange={(e) => handleInputChange('injuryDetails', e.target.value)}
                  placeholder="Describe any injuries sustained..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Response & Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Response & Actions</CardTitle>
              <CardDescription>
                What was done immediately and who was notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="immediateActions">Immediate Actions Taken *</Label>
                <Textarea
                  id="immediateActions"
                  value={formData.immediateActions}
                  onChange={(e) => handleInputChange('immediateActions', e.target.value)}
                  placeholder="What immediate steps were taken?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="witnessNames">Witnesses</Label>
                <Input
                  id="witnessNames"
                  value={formData.witnessNames}
                  onChange={(e) => handleInputChange('witnessNames', e.target.value)}
                  placeholder="Names of any witnesses (comma separated)"
                />
              </div>

              <div className="space-y-4">
                <Label>Notifications</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="familyNotified"
                      checked={formData.familyNotified}
                      onCheckedChange={(checked) => handleInputChange('familyNotified', checked as boolean)}
                    />
                    <Label htmlFor="familyNotified">Family/Next of Kin Notified</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="doctorNotified"
                      checked={formData.doctorNotified}
                      onCheckedChange={(checked) => handleInputChange('doctorNotified', checked as boolean)}
                    />
                    <Label htmlFor="doctorNotified">Doctor/GP Notified</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="managementNotified"
                      checked={formData.managementNotified}
                      onCheckedChange={(checked) => handleInputChange('managementNotified', checked as boolean)}
                    />
                    <Label htmlFor="managementNotified">Management Notified</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis & Prevention */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis & Prevention</CardTitle>
              <CardDescription>
                Contributing factors and prevention strategies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contributingFactors">Contributing Factors</Label>
                <Textarea
                  id="contributingFactors"
                  value={formData.contributingFactors}
                  onChange={(e) => handleInputChange('contributingFactors', e.target.value)}
                  placeholder="What factors may have contributed to this incident?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preventiveActions">Preventive Actions</Label>
                <Textarea
                  id="preventiveActions"
                  value={formData.preventiveActions}
                  onChange={(e) => handleInputChange('preventiveActions', e.target.value)}
                  placeholder="What actions can be taken to prevent similar incidents?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Resident */}
          {formData.residentId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Resident Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const resident = mockResidents.find(r => r.id === formData.residentId);
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

          {/* Severity Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Severity Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Critical</Badge>
                  <span className="text-xs">Life threatening, requires immediate medical attention</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">High</Badge>
                  <span className="text-xs">Significant injury/impact, medical attention required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Medium</Badge>
                  <span className="text-xs">Moderate impact, first aid or monitoring needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Low</Badge>
                  <span className="text-xs">Minor impact, no immediate medical attention</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          {formData.severity && (
            <Card>
              <CardHeader>
                <CardTitle>Incident Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Draft - Not Submitted</span>
                </div>
                
                {formData.severity && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <Badge variant={getSeverityColor(formData.severity)}>
                      {formData.severity} Severity
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!formData.residentId || !formData.type || !formData.severity}>
          <Save className="h-4 w-4 mr-2" />
          Submit Incident Report
        </Button>
      </div>
    </div>
  );
}