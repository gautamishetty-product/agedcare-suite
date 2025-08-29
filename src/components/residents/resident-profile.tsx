import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  FileText, 
  AlertTriangle, 
  Shield, 
  Heart,
  Activity,
  Pill,
  ClipboardList,
  FileHeart,
  Bandage,
  AlertCircle,
  Stethoscope,
  TrendingUp,
  Clock,
  User,
  UserPlus,
  FileUser,
  Scale,
  UserCheck,
  Edit,
  Target
} from 'lucide-react';
import { 
  getMockResident, 
  getMockMedicationsByResident, 
  getMockObservationsByResident,
  getMockCarePlansByResident,
  getMockWoundsByResident,
  getMockIncidentsByResident,
  getMockProgressNotesByResident
} from '@/lib/mock-data';
import { EditResidentForm } from './edit-resident-form';
import { DemographicsForm } from './demographics-form';
import { AboutForm } from './about-form';
import { ClinicalProfileForm } from './clinical-profile-form';
import { MedicationManager } from './medication-manager';
import { ObservationManager } from './observation-manager';
import { formatDistanceToNow, format } from 'date-fns';
import { useState } from 'react';

interface ResidentProfileProps {
  residentId: string;
}

export function ResidentProfile({ residentId }: ResidentProfileProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const resident = getMockResident(residentId);
  const medications = getMockMedicationsByResident(residentId);
  const observations = getMockObservationsByResident(residentId);
  const wounds = getMockWoundsByResident(residentId);
  const incidents = getMockIncidentsByResident(residentId);
  const carePlans = getMockCarePlansByResident(residentId);
  const progressNotes = getMockProgressNotesByResident(residentId);

  if (!resident) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">Resident not found</h2>
        <p className="text-muted-foreground">The requested resident could not be found.</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'permanent': return 'bg-accent text-accent-foreground';
      case 'respite': return 'bg-secondary text-secondary-foreground';
      case 'home': return 'bg-primary text-primary-foreground';
      case 'discharged': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{resident.preferredName || resident.fullName}</h1>
          <p className="text-muted-foreground">Resident Profile</p>
        </div>
        <Button onClick={() => setEditDialogOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Resident Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={resident.photoUrl} alt={resident.fullName} />
              <AvatarFallback className="text-lg">{getInitials(resident.fullName)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{resident.fullName}</h2>
                {resident.preferredName && resident.preferredName !== resident.fullName && (
                  <span className="text-lg text-muted-foreground">"{resident.preferredName}"</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={getStatusColor(resident.status)}>
                  {resident.status.charAt(0).toUpperCase() + resident.status.slice(1)}
                </Badge>
                
                {resident.allergies.length > 0 && (
                  <Badge variant="destructive">ALLERGY ALERT</Badge>
                )}
                
                {resident.isInfectionControl && (
                  <Badge variant="secondary">INFECTION CONTROL</Badge>
                )}
                
                {resident.hasAdvanceDirective && (
                  <Badge variant="outline">ADVANCE DIRECTIVE</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">DOB: </span>
                  {format(new Date(resident.dateOfBirth), 'dd/MM/yyyy')} 
                  ({formatDistanceToNow(new Date(resident.dateOfBirth), { addSuffix: false })})
                </div>
                
                {resident.roomNumber && (
                  <div>
                    <span className="font-medium">Room: </span>
                    {resident.roomNumber}
                    {resident.bedNumber && ` • Bed ${resident.bedNumber}`}
                  </div>
                )}
                
                {resident.medicareNumber && (
                  <div>
                    <span className="font-medium">Medicare: </span>
                    {resident.medicareNumber}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="snapshot" className="w-full">
        <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground overflow-x-auto w-full">
          <TabsTrigger value="snapshot" className="whitespace-nowrap">Snapshot</TabsTrigger>
          <TabsTrigger value="demographics" className="whitespace-nowrap">Demographics</TabsTrigger>
          <TabsTrigger value="about" className="whitespace-nowrap">About</TabsTrigger>
          <TabsTrigger value="clinical-profile" className="whitespace-nowrap">Clinical Profile</TabsTrigger>
          <TabsTrigger value="medications" className="whitespace-nowrap">Medications</TabsTrigger>
          <TabsTrigger value="observations" className="whitespace-nowrap">Observations</TabsTrigger>
          <TabsTrigger value="care-plans" className="whitespace-nowrap">Care Plans</TabsTrigger>
          <TabsTrigger value="wounds" className="whitespace-nowrap">Wounds</TabsTrigger>
          <TabsTrigger value="incidents" className="whitespace-nowrap">Incidents</TabsTrigger>
          <TabsTrigger value="assessments" className="whitespace-nowrap">Assessments</TabsTrigger>
          <TabsTrigger value="legal" className="whitespace-nowrap">Legal/Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="snapshot" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Full Name: </span>
                  {resident.fullName}
                </div>
                <div>
                  <span className="font-medium">Preferred Name: </span>
                  {resident.preferredName || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Date of Birth: </span>
                  {format(new Date(resident.dateOfBirth), 'dd/MM/yyyy')}
                </div>
                {resident.medicareNumber && (
                  <div>
                    <span className="font-medium">Medicare Number: </span>
                    {resident.medicareNumber}
                  </div>
                )}
                {resident.ndisNumber && (
                  <div>
                    <span className="font-medium">NDIS Number: </span>
                    {resident.ndisNumber}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Status */}
            <Card>
              <CardHeader>
                <CardTitle>Health Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Cognitive Status: </span>
                  {resident.cognitiveStatus}
                </div>
                <div>
                  <span className="font-medium">Mobility Status: </span>
                  {resident.mobilityStatus}
                </div>
                {resident.allergies.length > 0 && (
                  <div>
                    <span className="font-medium">Allergies: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {resident.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Active Diagnoses */}
          <Card>
            <CardHeader>
              <CardTitle>Active Diagnoses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resident.diagnoses.filter(d => d.active).map((diagnosis) => (
                  <div key={diagnosis.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{diagnosis.title}</div>
                    {diagnosis.icd10Code && (
                      <div className="text-sm text-muted-foreground">ICD-10: {diagnosis.icd10Code}</div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Onset: {format(new Date(diagnosis.onsetDate), 'dd/MM/yyyy')}
                    </div>
                    {diagnosis.notes && (
                      <div className="text-sm mt-2">{diagnosis.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <DemographicsForm 
            resident={resident} 
            onSave={(updatedResident) => {
              console.log('Updated resident:', updatedResident);
            }} 
          />
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <AboutForm 
            residentId={resident.id} 
            onSave={(about) => {
              console.log('Updated about:', about);
            }} 
          />
        </TabsContent>

        <TabsContent value="clinical-profile" className="space-y-6">
          <ClinicalProfileForm 
            residentId={resident.id} 
            onSave={(profile) => {
              console.log('Updated clinical profile:', profile);
            }} 
          />
        </TabsContent>

        <TabsContent value="medications" className="space-y-6">
          <MedicationManager
            medications={medications}
            residentId={resident.id}
            allergies={resident.allergies}
            onSave={(updatedMedications) => {
              console.log('Updated medications:', updatedMedications);
            }}
          />
        </TabsContent>

        <TabsContent value="observations" className="space-y-6">
          <ObservationManager
            observations={observations}
            residentId={resident.id}
            onSave={(updatedObservations) => {
              console.log('Updated observations:', updatedObservations);
            }}
          />
        </TabsContent>


        <TabsContent value="care-plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Care Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {carePlans.map((plan) => (
                  <div key={plan.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">{plan.problem}</h4>
                      <Badge variant={plan.status === 'Active' ? 'default' : 'secondary'}>
                        {plan.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Goals: </span>
                        <ul className="list-disc list-inside ml-4">
                          {plan.goals.map((goal, index) => (
                            <li key={index}>{goal}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <span className="font-medium">Interventions: </span>
                        <ul className="list-disc list-inside ml-4">
                          {plan.interventions.map((intervention, index) => (
                            <li key={index}>{intervention}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Owner: {plan.ownerRole}</span>
                        <span>Start: {format(new Date(plan.startDate), 'dd/MM/yyyy')}</span>
                        <span>Review: {format(new Date(plan.reviewDate), 'dd/MM/yyyy')}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {carePlans.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No care plans recorded
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wounds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wound Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wounds.map((wound) => (
                  <div key={wound.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{wound.location}</h4>
                      <Badge variant={wound.status === 'Improving' ? 'default' : 'secondary'}>
                        {wound.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Stage: {wound.stage}</div>
                      <div>Size: {wound.size.length} × {wound.size.width} cm</div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-2">
                      Last assessment: {format(new Date(wound.lastAssessment), 'dd/MM/yyyy HH:mm')}
                    </div>
                  </div>
                ))}
                
                {wounds.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No wounds recorded
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div key={incident.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{incident.type}</h4>
                      <Badge variant={
                        incident.severity === 'Critical' ? 'destructive' :
                        incident.severity === 'High' ? 'destructive' :
                        incident.severity === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {incident.severity}
                      </Badge>
                    </div>
                    
                    <p className="text-sm mb-2">{incident.description}</p>
                    
                    <div className="text-xs text-muted-foreground">
                      Occurred: {format(new Date(incident.occurredAt), 'dd/MM/yyyy HH:mm')}
                      <br />
                      Reported by: {incident.reportedBy}
                    </div>
                  </div>
                ))}
                
                {incidents.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No incidents recorded
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Clinical Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">MMSE</CardTitle>
                      <CardDescription>Mini-Mental State Examination</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">24/30</span>
                        <Badge variant="outline">Mild Impairment</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Last assessed: 2024-01-15
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Braden Scale</CardTitle>
                      <CardDescription>Pressure Ulcer Risk Assessment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">18/23</span>
                        <Badge variant="secondary">Mild Risk</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Last assessed: 2024-01-20
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileUser className="h-5 w-5" />
                Legal & Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Power of Attorney</h4>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Name:</strong> Sarah Johnson</p>
                    <p className="text-sm"><strong>Type:</strong> Financial & Medical</p>
                    <p className="text-sm"><strong>Contact:</strong> (555) 123-4567</p>
                    <Badge variant="outline">Documents on file</Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Guardianship</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Not applicable</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Advance Directives</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={resident.hasAdvanceDirective ? "default" : "outline"}>
                      {resident.hasAdvanceDirective ? "On File" : "Not Available"}
                    </Badge>
                    {resident.hasAdvanceDirective && (
                      <span className="text-sm text-muted-foreground">Last reviewed: 2024-01-10</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <EditResidentForm 
        resident={resident}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
}