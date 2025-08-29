import { useState } from 'react';
import { Medication } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';

interface MedicationManagerProps {
  medications: Medication[];
  residentId: string;
  allergies: string[];
  onSave: (medications: Medication[]) => void;
}

export const MedicationManager = ({ medications, residentId, allergies, onSave }: MedicationManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [formData, setFormData] = useState<Partial<Medication>>({
    residentId,
    genericName: '',
    brandName: '',
    route: 'oral',
    dose: '',
    schedule: { times: [], frequency: '', instructions: '' },
    isPRN: false,
    startDate: '',
    endDate: '',
    allergyCrosscheck: true,
  });

  const handleInputChange = (field: keyof Medication, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (field: keyof Medication['schedule'], value: any) => {
    setFormData(prev => ({
      ...prev,
      schedule: { ...prev.schedule, [field]: value }
    }));
  };

  const openDialog = (medication?: Medication) => {
    if (medication) {
      setEditingMed(medication);
      setFormData(medication);
    } else {
      setEditingMed(null);
      setFormData({
        residentId,
        genericName: '',
        brandName: '',
        route: 'oral',
        dose: '',
        schedule: { times: [], frequency: '', instructions: '' },
        isPRN: false,
        startDate: '',
        endDate: '',
        allergyCrosscheck: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const medicationData: Medication = {
      id: editingMed?.id || `med-${Date.now()}`,
      residentId,
      genericName: formData.genericName || '',
      brandName: formData.brandName || '',
      route: formData.route || 'oral',
      dose: formData.dose || '',
      schedule: formData.schedule || { times: [], frequency: '', instructions: '' },
      isPRN: formData.isPRN || false,
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      allergyCrosscheck: formData.allergyCrosscheck || true,
    };

    const updatedMedications = editingMed
      ? medications.map(med => med.id === editingMed.id ? medicationData : med)
      : [...medications, medicationData];

    onSave(updatedMedications);
    setIsDialogOpen(false);
    toast({
      title: editingMed ? "Medication updated" : "Medication added",
      description: "Medication has been successfully saved.",
    });
  };

  const handleDelete = (medId: string) => {
    const updatedMedications = medications.filter(med => med.id !== medId);
    onSave(updatedMedications);
    toast({
      title: "Medication removed",
      description: "Medication has been successfully removed.",
    });
  };

  const checkAllergyConflict = (genericName: string) => {
    return allergies.some(allergy => 
      genericName.toLowerCase().includes(allergy.toLowerCase()) ||
      allergy.toLowerCase().includes(genericName.toLowerCase())
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medications</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMed ? 'Edit' : 'Add'} Medication</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {formData.genericName && checkAllergyConflict(formData.genericName) && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">
                    Potential allergy conflict detected!
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genericName">Generic Name</Label>
                  <Input
                    id="genericName"
                    value={formData.genericName || ''}
                    onChange={(e) => handleInputChange('genericName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input
                    id="brandName"
                    value={formData.brandName || ''}
                    onChange={(e) => handleInputChange('brandName', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="route">Route</Label>
                  <Select value={formData.route} onValueChange={(value) => handleInputChange('route', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oral">Oral</SelectItem>
                      <SelectItem value="topical">Topical</SelectItem>
                      <SelectItem value="injection">Injection</SelectItem>
                      <SelectItem value="inhaled">Inhaled</SelectItem>
                      <SelectItem value="rectal">Rectal</SelectItem>
                      <SelectItem value="sublingual">Sublingual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dose">Dose</Label>
                  <Input
                    id="dose"
                    value={formData.dose || ''}
                    onChange={(e) => handleInputChange('dose', e.target.value)}
                    placeholder="e.g., 500mg"
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    value={formData.schedule?.frequency || ''}
                    onChange={(e) => handleScheduleChange('frequency', e.target.value)}
                    placeholder="e.g., BID, TID"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.schedule?.instructions || ''}
                  onChange={(e) => handleScheduleChange('instructions', e.target.value)}
                  placeholder="Special instructions for administration..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPRN"
                  checked={formData.isPRN || false}
                  onCheckedChange={(checked) => handleInputChange('isPRN', checked)}
                />
                <Label htmlFor="isPRN">PRN (As needed)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="allergyCrosscheck"
                  checked={formData.allergyCrosscheck || false}
                  onCheckedChange={(checked) => handleInputChange('allergyCrosscheck', checked)}
                />
                <Label htmlFor="allergyCrosscheck">Enable allergy cross-checking</Label>
              </div>

              <Button onClick={handleSave} className="w-full">
                {editingMed ? 'Update' : 'Add'} Medication
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medications.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No medications recorded
            </p>
          ) : (
            medications.map(medication => (
              <div key={medication.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{medication.genericName}</h4>
                    {medication.brandName && (
                      <span className="text-sm text-muted-foreground">({medication.brandName})</span>
                    )}
                    {medication.isPRN && <Badge variant="outline">PRN</Badge>}
                    {checkAllergyConflict(medication.genericName) && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Allergy Alert
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {medication.dose} • {medication.route} • {medication.schedule.frequency}
                  </p>
                  {medication.schedule.instructions && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {medication.schedule.instructions}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(medication)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(medication.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};