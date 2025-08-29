import { useState } from 'react';
import { Resident, NextOfKin } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface DemographicsFormProps {
  resident: Resident;
  onSave: (resident: Resident) => void;
}

export const DemographicsForm = ({ resident, onSave }: DemographicsFormProps) => {
  const [formData, setFormData] = useState<Partial<Resident>>(resident);

  const handleInputChange = (field: keyof Resident, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData as Resident);
    toast({
      title: "Demographics updated",
      description: "Resident demographics have been successfully updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demographics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName || ''}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="preferredName">Preferred Name</Label>
            <Input
              id="preferredName"
              value={formData.preferredName || ''}
              onChange={(e) => handleInputChange('preferredName', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              value={formData.language || ''}
              onChange={(e) => handleInputChange('language', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="culture">Culture</Label>
            <Input
              id="culture"
              value={formData.culture || ''}
              onChange={(e) => handleInputChange('culture', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="religion">Religion</Label>
            <Input
              id="religion"
              value={formData.religion || ''}
              onChange={(e) => handleInputChange('religion', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="medicareNumber">Medicare Number</Label>
            <Input
              id="medicareNumber"
              value={formData.medicareNumber || ''}
              onChange={(e) => handleInputChange('medicareNumber', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="ndisNumber">NDIS Number</Label>
            <Input
              id="ndisNumber"
              value={formData.ndisNumber || ''}
              onChange={(e) => handleInputChange('ndisNumber', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="pensionType">Pension Type</Label>
            <Input
              id="pensionType"
              value={formData.pensionType || ''}
              onChange={(e) => handleInputChange('pensionType', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="roomNumber">Room Number</Label>
            <Input
              id="roomNumber"
              value={formData.roomNumber || ''}
              onChange={(e) => handleInputChange('roomNumber', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bedNumber">Bed Number</Label>
            <Input
              id="bedNumber"
              value={formData.bedNumber || ''}
              onChange={(e) => handleInputChange('bedNumber', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="permanent">Permanent</SelectItem>
              <SelectItem value="respite">Respite</SelectItem>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="discharged">Discharged</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Demographics
        </Button>
      </CardContent>
    </Card>
  );
};