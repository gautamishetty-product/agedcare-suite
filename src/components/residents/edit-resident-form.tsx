import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { Resident } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface EditResidentFormProps {
  resident: Resident;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditResidentForm({ resident, open, onOpenChange }: EditResidentFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: resident.fullName,
    preferredName: resident.preferredName || '',
    medicareNumber: resident.medicareNumber || '',
    ndisNumber: resident.ndisNumber || '',
    roomNumber: resident.roomNumber || '',
    bedNumber: resident.bedNumber || '',
    status: resident.status,
    cognitiveStatus: resident.cognitiveStatus,
    mobilityStatus: resident.mobilityStatus,
    hasAdvanceDirective: resident.hasAdvanceDirective,
    isInfectionControl: resident.isInfectionControl,
  });

  const [allergies, setAllergies] = useState<string[]>(resident.allergies);
  const [newAllergy, setNewAllergy] = useState('');

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
    // Here you would typically save to your backend/database
    console.log('Saving resident updates:', { ...formData, allergies });
    
    toast({
      title: "Profile Updated",
      description: "Resident profile has been successfully updated.",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Resident Profile</DialogTitle>
          <DialogDescription>
            Update {resident.fullName}'s information
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredName">Preferred Name</Label>
              <Input
                id="preferredName"
                value={formData.preferredName}
                onChange={(e) => handleInputChange('preferredName', e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicareNumber">Medicare Number</Label>
              <Input
                id="medicareNumber"
                value={formData.medicareNumber}
                onChange={(e) => handleInputChange('medicareNumber', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ndisNumber">NDIS Number</Label>
              <Input
                id="ndisNumber"
                value={formData.ndisNumber}
                onChange={(e) => handleInputChange('ndisNumber', e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Care Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Care Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  value={formData.roomNumber}
                  onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedNumber">Bed Number</Label>
                <Input
                  id="bedNumber"
                  value={formData.bedNumber}
                  onChange={(e) => handleInputChange('bedNumber', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label htmlFor="cognitiveStatus">Cognitive Status</Label>
              <Textarea
                id="cognitiveStatus"
                value={formData.cognitiveStatus}
                onChange={(e) => handleInputChange('cognitiveStatus', e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobilityStatus">Mobility Status</Label>
              <Textarea
                id="mobilityStatus"
                value={formData.mobilityStatus}
                onChange={(e) => handleInputChange('mobilityStatus', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Allergies Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Allergies</h3>
          
          <div className="flex gap-2">
            <Input
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="Add new allergy"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAllergy();
                }
              }}
            />
            <Button type="button" onClick={addAllergy} variant="outline">
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {allergies.map((allergy, index) => (
              <Badge key={index} variant="destructive" className="gap-1">
                {allergy}
                <button
                  type="button"
                  onClick={() => removeAllergy(allergy)}
                  className="hover:bg-destructive-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Flags Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Care Flags</h3>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="hasAdvanceDirective"
              checked={formData.hasAdvanceDirective}
              onCheckedChange={(checked) => handleInputChange('hasAdvanceDirective', checked)}
            />
            <Label htmlFor="hasAdvanceDirective">Has Advance Directive</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isInfectionControl"
              checked={formData.isInfectionControl}
              onCheckedChange={(checked) => handleInputChange('isInfectionControl', checked)}
            />
            <Label htmlFor="isInfectionControl">Infection Control</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}