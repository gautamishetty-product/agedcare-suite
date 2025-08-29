import { useState } from 'react';
import { ClinicalProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { X, Plus } from 'lucide-react';

interface ClinicalProfileFormProps {
  clinicalProfile?: ClinicalProfile;
  residentId: string;
  onSave: (profile: ClinicalProfile) => void;
}

export const ClinicalProfileForm = ({ clinicalProfile, residentId, onSave }: ClinicalProfileFormProps) => {
  const [formData, setFormData] = useState<Partial<ClinicalProfile>>(
    clinicalProfile || {
      residentId,
      gpName: '',
      medicalOfficer: '',
      practiceContact: '',
      allergies: [],
      contraindications: [],
    }
  );
  const [newAllergy, setNewAllergy] = useState('');
  const [newContraindication, setNewContraindication] = useState('');

  const handleInputChange = (field: keyof ClinicalProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...(prev.allergies || []), newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies?.filter((_, i) => i !== index) || []
    }));
  };

  const addContraindication = () => {
    if (newContraindication.trim()) {
      setFormData(prev => ({
        ...prev,
        contraindications: [...(prev.contraindications || []), newContraindication.trim()]
      }));
      setNewContraindication('');
    }
  };

  const removeContraindication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contraindications: prev.contraindications?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSave = () => {
    const profileData: ClinicalProfile = {
      id: clinicalProfile?.id || `profile-${Date.now()}`,
      residentId,
      gpName: formData.gpName || '',
      medicalOfficer: formData.medicalOfficer || '',
      practiceContact: formData.practiceContact || '',
      allergies: formData.allergies || [],
      contraindications: formData.contraindications || [],
    };
    
    onSave(profileData);
    toast({
      title: "Clinical profile updated",
      description: "Clinical profile has been successfully updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gpName">GP/Family Doctor</Label>
            <Input
              id="gpName"
              value={formData.gpName || ''}
              onChange={(e) => handleInputChange('gpName', e.target.value)}
              placeholder="Dr. John Smith"
            />
          </div>
          <div>
            <Label htmlFor="medicalOfficer">Medical Officer</Label>
            <Input
              id="medicalOfficer"
              value={formData.medicalOfficer || ''}
              onChange={(e) => handleInputChange('medicalOfficer', e.target.value)}
              placeholder="Dr. Jane Doe"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="practiceContact">Practice Contact</Label>
          <Textarea
            id="practiceContact"
            value={formData.practiceContact || ''}
            onChange={(e) => handleInputChange('practiceContact', e.target.value)}
            placeholder="Practice name, address, phone, fax..."
            rows={3}
          />
        </div>

        <div>
          <Label>Allergies</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="Add allergy..."
              onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
            />
            <Button onClick={addAllergy} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.allergies?.map((allergy, index) => (
              <Badge key={index} variant="destructive" className="flex items-center gap-1">
                {allergy}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeAllergy(index)} />
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label>Contraindications</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newContraindication}
              onChange={(e) => setNewContraindication(e.target.value)}
              placeholder="Add contraindication..."
              onKeyPress={(e) => e.key === 'Enter' && addContraindication()}
            />
            <Button onClick={addContraindication} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.contraindications?.map((contraindication, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {contraindication}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeContraindication(index)} />
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Clinical Profile
        </Button>
      </CardContent>
    </Card>
  );
};