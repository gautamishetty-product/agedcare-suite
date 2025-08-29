import { useState } from 'react';
import { ResidentAbout } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface AboutFormProps {
  residentAbout?: ResidentAbout;
  residentId: string;
  onSave: (about: ResidentAbout) => void;
}

export const AboutForm = ({ residentAbout, residentId, onSave }: AboutFormProps) => {
  const [formData, setFormData] = useState<Partial<ResidentAbout>>(
    residentAbout || {
      residentId,
      bio: '',
      preferences: '',
      commsNeeds: '',
      mobilityStatus: '',
      sensoryNeeds: '',
      cognitiveStatus: '',
      psychosocialNotes: '',
    }
  );

  const handleInputChange = (field: keyof ResidentAbout, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const aboutData: ResidentAbout = {
      id: residentAbout?.id || `about-${Date.now()}`,
      residentId,
      bio: formData.bio || '',
      preferences: formData.preferences || '',
      commsNeeds: formData.commsNeeds || '',
      mobilityStatus: formData.mobilityStatus || '',
      sensoryNeeds: formData.sensoryNeeds || '',
      cognitiveStatus: formData.cognitiveStatus || '',
      psychosocialNotes: formData.psychosocialNotes || '',
    };
    
    onSave(aboutData);
    toast({
      title: "About information updated",
      description: "Resident about information has been successfully updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="bio">Biography</Label>
          <Textarea
            id="bio"
            value={formData.bio || ''}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Personal history, family background, interests..."
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="preferences">Preferences</Label>
          <Textarea
            id="preferences"
            value={formData.preferences || ''}
            onChange={(e) => handleInputChange('preferences', e.target.value)}
            placeholder="Food preferences, activities, routines..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="commsNeeds">Communication Needs</Label>
            <Textarea
              id="commsNeeds"
              value={formData.commsNeeds || ''}
              onChange={(e) => handleInputChange('commsNeeds', e.target.value)}
              placeholder="Hearing aids, language barriers, communication style..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="sensoryNeeds">Sensory Needs</Label>
            <Textarea
              id="sensoryNeeds"
              value={formData.sensoryNeeds || ''}
              onChange={(e) => handleInputChange('sensoryNeeds', e.target.value)}
              placeholder="Vision, hearing, touch sensitivities..."
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mobilityStatus">Mobility Status</Label>
            <Input
              id="mobilityStatus"
              value={formData.mobilityStatus || ''}
              onChange={(e) => handleInputChange('mobilityStatus', e.target.value)}
              placeholder="Independent, walker, wheelchair..."
            />
          </div>
          <div>
            <Label htmlFor="cognitiveStatus">Cognitive Status</Label>
            <Input
              id="cognitiveStatus"
              value={formData.cognitiveStatus || ''}
              onChange={(e) => handleInputChange('cognitiveStatus', e.target.value)}
              placeholder="Alert, mild impairment, moderate..."
            />
          </div>
        </div>

        <div>
          <Label htmlFor="psychosocialNotes">Psychosocial Notes</Label>
          <Textarea
            id="psychosocialNotes"
            value={formData.psychosocialNotes || ''}
            onChange={(e) => handleInputChange('psychosocialNotes', e.target.value)}
            placeholder="Social interactions, emotional needs, behavioral patterns..."
            rows={3}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save About Information
        </Button>
      </CardContent>
    </Card>
  );
};