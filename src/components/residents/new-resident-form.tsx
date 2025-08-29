import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Save, ArrowLeft, Plus, X, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function NewResidentForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    preferredName: '',
    dateOfBirth: '',
    medicareNumber: '',
    ndisNumber: '',
    roomNumber: '',
    bedNumber: '',
    status: 'permanent' as const,
    photoUrl: '',
    cognitiveStatus: '',
    mobilityStatus: '',
    hasAdvanceDirective: false,
    isInfectionControl: false,
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    gp: '',
    gpContact: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies(prev => [...prev, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies(prev => prev.filter(a => a !== allergy));
  };

  const handleSave = () => {
    // Mock save functionality
    toast({
      title: "Resident Added",
      description: `${formData.fullName} has been successfully added to the system.`,
    });
    
    // Navigate back to residents list
    navigate('/residents');
  };

  const steps = [
    { id: 1, title: 'Personal Information', description: 'Basic demographic details' },
    { id: 2, title: 'Medical Information', description: 'Health status and allergies' },
    { id: 3, title: 'Emergency Contacts', description: 'Contact details for emergencies' },
    { id: 4, title: 'Care Details', description: 'Room assignment and care preferences' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/residents">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Resident</h1>
          <p className="text-muted-foreground">Enter resident information step by step</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step.id}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter full legal name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preferredName">Preferred Name</Label>
                  <Input
                    id="preferredName"
                    value={formData.preferredName}
                    onChange={(e) => handleInputChange('preferredName', e.target.value)}
                    placeholder="How they prefer to be addressed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Resident Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="respite">Respite</SelectItem>
                      <SelectItem value="home">Home Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medicareNumber">Medicare Number</Label>
                  <Input
                    id="medicareNumber"
                    value={formData.medicareNumber}
                    onChange={(e) => handleInputChange('medicareNumber', e.target.value)}
                    placeholder="1234567890"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ndisNumber">NDIS Number</Label>
                  <Input
                    id="ndisNumber"
                    value={formData.ndisNumber}
                    onChange={(e) => handleInputChange('ndisNumber', e.target.value)}
                    placeholder="NDI-1234567890-AB"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Photo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={formData.photoUrl} />
                    <AvatarFallback>
                      {formData.fullName ? formData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cognitiveStatus">Cognitive Status</Label>
                  <Select value={formData.cognitiveStatus} onValueChange={(value) => handleInputChange('cognitiveStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cognitive status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intact">Intact</SelectItem>
                      <SelectItem value="mild-impairment">Mild cognitive impairment</SelectItem>
                      <SelectItem value="moderate-impairment">Moderate cognitive impairment</SelectItem>
                      <SelectItem value="severe-impairment">Severe cognitive impairment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mobilityStatus">Mobility Status</Label>
                  <Select value={formData.mobilityStatus} onValueChange={(value) => handleInputChange('mobilityStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mobility status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="independent">Independent</SelectItem>
                      <SelectItem value="walking-aid">Independent with walking aid</SelectItem>
                      <SelectItem value="assistance">Requires assistance</SelectItem>
                      <SelectItem value="wheelchair">Wheelchair dependent</SelectItem>
                      <SelectItem value="bed-bound">Bed bound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Allergies</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Enter allergy"
                    onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                  />
                  <Button type="button" onClick={addAllergy} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive" className="flex items-center gap-1">
                      {allergy}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeAllergy(allergy)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasAdvanceDirective"
                    checked={formData.hasAdvanceDirective}
                    onCheckedChange={(checked) => handleInputChange('hasAdvanceDirective', checked as boolean)}
                  />
                  <Label htmlFor="hasAdvanceDirective">Has Advance Care Directive</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isInfectionControl"
                    checked={formData.isInfectionControl}
                    onCheckedChange={(checked) => handleInputChange('isInfectionControl', checked as boolean)}
                  />
                  <Label htmlFor="isInfectionControl">Infection Control Precautions</Label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  placeholder="Full name of emergency contact"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    placeholder="0400 000 000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelation">Relationship *</Label>
                  <Select value={formData.emergencyContactRelation} onValueChange={(value) => handleInputChange('emergencyContactRelation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gp">General Practitioner</Label>
                  <Input
                    id="gp"
                    value={formData.gp}
                    onChange={(e) => handleInputChange('gp', e.target.value)}
                    placeholder="Dr. Smith"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gpContact">GP Contact Details</Label>
                  <Input
                    id="gpContact"
                    value={formData.gpContact}
                    onChange={(e) => handleInputChange('gpContact', e.target.value)}
                    placeholder="Phone or clinic name"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input
                    id="roomNumber"
                    value={formData.roomNumber}
                    onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                    placeholder="e.g. 12A"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bedNumber">Bed Number</Label>
                  <Input
                    id="bedNumber"
                    value={formData.bedNumber}
                    onChange={(e) => handleInputChange('bedNumber', e.target.value)}
                    placeholder="e.g. 1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional information about the resident..."
                  rows={4}
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Summary</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Name:</strong> {formData.fullName}</div>
                  {formData.preferredName && <div><strong>Preferred:</strong> {formData.preferredName}</div>}
                  <div><strong>Status:</strong> {formData.status}</div>
                  {formData.roomNumber && <div><strong>Room:</strong> {formData.roomNumber}</div>}
                  <div><strong>Allergies:</strong> {allergies.length > 0 ? allergies.join(', ') : 'None'}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentStep < 4 ? (
            <Button onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Resident
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}