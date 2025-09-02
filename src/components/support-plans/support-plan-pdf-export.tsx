import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download,
  FileText,
  Shield,
  Signature,
  Calendar,
  User,
  Clock
} from 'lucide-react';
import { SupportPlan } from '@/lib/support-plan-types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface SupportPlanPDFExportProps {
  plan: SupportPlan;
  isOpen: boolean;
  onClose: () => void;
}

export const SupportPlanPDFExport = ({ plan, isOpen, onClose }: SupportPlanPDFExportProps) => {
  const { toast } = useToast();
  
  // Export settings
  const [facilityName, setFacilityName] = useState('Sunset Manor Aged Care');
  const [facilityAddress, setFacilityAddress] = useState('123 Care Street, Melbourne VIC 3000');
  const [facilityPhone, setFacilityPhone] = useState('(03) 9123 4567');
  const [exportNotes, setExportNotes] = useState('');
  const [includeSignatureBlock, setIncludeSignatureBlock] = useState(plan.guardianSignatureRequired);
  const [includeFacilityLogo, setIncludeFacilityLogo] = useState(true);
  const [includeAuditTrail, setIncludeAuditTrail] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Audit compliance fields
  const [auditStandard, setAuditStandard] = useState('MAC Quality Standards');
  const [auditReference, setAuditReference] = useState('QS.2024.01');

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      // In a real application, this would call a PDF generation service
      // For this demo, we'll simulate the export process
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      
      // Create a simple HTML representation that could be converted to PDF
      const pdfContent = generatePDFContent();
      
      // In production, you would send this to a PDF service or use a library like jsPDF
      console.log('PDF Content Generated:', pdfContent);
      
      toast({
        title: 'PDF Generated Successfully',
        description: `Support plan PDF for ${plan.title} has been generated`,
      });
      
      // Simulate download
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `support-plan-${plan.id}-v${plan.version}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      onClose();
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDFContent = () => {
    const tasksByTimeSlot = plan.tasks.reduce((acc, task) => {
      task.timeSlots.forEach(slot => {
        if (!acc[slot]) acc[slot] = [];
        acc[slot].push(task);
      });
      return acc;
    }, {} as Record<string, typeof plan.tasks>);

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Support Plan - ${plan.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .facility-info { margin-bottom: 20px; }
        .plan-info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .task-section { margin-bottom: 25px; }
        .task { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 3px; }
        .signature-block { border: 1px solid #333; padding: 20px; margin-top: 30px; }
        .audit-info { background: #e9ecef; padding: 15px; margin-top: 20px; border-left: 4px solid #007bff; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .badge { background: #e9ecef; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
        .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); 
                     font-size: 72px; color: rgba(0,0,0,0.1); z-index: -1; }
    </style>
</head>
<body>
    ${plan.status === 'DRAFT' ? '<div class="watermark">DRAFT</div>' : ''}
    
    <div class="header">
        <h1>DAILY LIVING SUPPORT PLAN</h1>
        <div class="facility-info">
            <h2>${facilityName}</h2>
            <p>${facilityAddress}<br>${facilityPhone}</p>
        </div>
    </div>

    <div class="plan-info">
        <table>
            <tr><td><strong>Plan Title:</strong></td><td>${plan.title}</td></tr>
            <tr><td><strong>Version:</strong></td><td>${plan.version}</td></tr>
            <tr><td><strong>Status:</strong></td><td>${plan.status}</td></tr>
            <tr><td><strong>Created Date:</strong></td><td>${format(new Date(plan.createdAt), 'dd/MM/yyyy')}</td></tr>
            <tr><td><strong>Last Updated:</strong></td><td>${format(new Date(plan.updatedAt), 'dd/MM/yyyy')}</td></tr>
            <tr><td><strong>Created By:</strong></td><td>${plan.createdBy}</td></tr>
            ${plan.finalizedBy ? `<tr><td><strong>Finalized By:</strong></td><td>${plan.finalizedBy}</td></tr>` : ''}
            ${plan.nextReviewDate ? `<tr><td><strong>Next Review:</strong></td><td>${format(new Date(plan.nextReviewDate), 'dd/MM/yyyy')}</td></tr>` : ''}
        </table>
    </div>

    ${plan.specialInstructions ? `
    <div class="task-section">
        <h3>Special Instructions</h3>
        <div class="task">
            <p>${plan.specialInstructions}</p>
        </div>
    </div>
    ` : ''}

    <div class="task-section">
        <h3>Daily Care Schedule</h3>
        
        ${Object.entries(tasksByTimeSlot).map(([timeSlot, tasks]) => `
            <h4>${timeSlot} Shift (${tasks.length} tasks)</h4>
            ${tasks.map(task => `
                <div class="task">
                    <h5>${task.title}</h5>
                    <p><strong>Description:</strong> ${task.description}</p>
                    <p><strong>Frequency:</strong> ${task.frequency}</p>
                    <p><strong>Assigned Role:</strong> ${task.assignedRole}</p>
                    ${task.instructions ? `<p><strong>Instructions:</strong> ${task.instructions}</p>` : ''}
                    <p><strong>Time Slots:</strong> ${task.timeSlots.join(', ')}</p>
                </div>
            `).join('')}
        `).join('')}
    </div>

    ${exportNotes ? `
    <div class="task-section">
        <h3>Export Notes</h3>
        <div class="task">
            <p>${exportNotes}</p>
        </div>
    </div>
    ` : ''}

    ${includeSignatureBlock ? `
    <div class="signature-block">
        <h3>Approval & Authorization</h3>
        <table>
            <tr>
                <td width="50%">
                    <p><strong>Registered Nurse Signature:</strong></p>
                    <br><br>
                    <hr>
                    <p>Name: ________________________</p>
                    <p>Date: ________________________</p>
                </td>
                <td width="50%">
                    <p><strong>Guardian/Family Signature:</strong></p>
                    <br><br>
                    <hr>
                    <p>Name: ________________________</p>
                    <p>Date: ________________________</p>
                </td>
            </tr>
        </table>
    </div>
    ` : ''}

    ${includeAuditTrail ? `
    <div class="audit-info">
        <h3>Audit Information</h3>
        <table>
            <tr><td><strong>Compliance Standard:</strong></td><td>${auditStandard}</td></tr>
            <tr><td><strong>Reference Number:</strong></td><td>${auditReference}</td></tr>
            <tr><td><strong>Generated On:</strong></td><td>${format(new Date(), 'dd/MM/yyyy HH:mm')}</td></tr>
            <tr><td><strong>Document Version:</strong></td><td>V${plan.version}</td></tr>
        </table>
        <p><small>This document was electronically generated and is compliant with regulatory requirements for aged care documentation.</small></p>
    </div>
    ` : ''}

    <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
        <p>Generated by Clinical Information System | Page 1 of 1</p>
    </div>
</body>
</html>
    `;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Support Plan PDF
          </DialogTitle>
          <DialogDescription>
            Configure PDF export settings for {plan.title}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Facility Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Facility Information</CardTitle>
                <CardDescription>This information will appear in the PDF header</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facilityName">Facility Name</Label>
                  <Input
                    id="facilityName"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilityAddress">Address</Label>
                  <Textarea
                    id="facilityAddress"
                    value={facilityAddress}
                    onChange={(e) => setFacilityAddress(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilityPhone">Phone Number</Label>
                  <Input
                    id="facilityPhone"
                    value={facilityPhone}
                    onChange={(e) => setFacilityPhone(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Options</CardTitle>
                <CardDescription>Configure what to include in the PDF</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="logo"
                    checked={includeFacilityLogo}
                    onCheckedChange={(checked) => setIncludeFacilityLogo(checked === true)}
                  />
                  <Label htmlFor="logo">Include facility logo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="signature"
                    checked={includeSignatureBlock}
                    onCheckedChange={(checked) => setIncludeSignatureBlock(checked === true)}
                  />
                  <Label htmlFor="signature" className="flex items-center gap-2">
                    <Signature className="h-4 w-4" />
                    Include signature blocks for approval
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="audit"
                    checked={includeAuditTrail}
                    onCheckedChange={(checked) => setIncludeAuditTrail(checked === true)}
                  />
                  <Label htmlFor="audit" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Include audit compliance information
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Audit Compliance */}
            {includeAuditTrail && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Audit Compliance
                  </CardTitle>
                  <CardDescription>Information required for regulatory compliance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="auditStandard">Compliance Standard</Label>
                    <Input
                      id="auditStandard"
                      value={auditStandard}
                      onChange={(e) => setAuditStandard(e.target.value)}
                      placeholder="e.g., MAC Quality Standards"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="auditReference">Reference Number</Label>
                    <Input
                      id="auditReference"
                      value={auditReference}
                      onChange={(e) => setAuditReference(e.target.value)}
                      placeholder="e.g., QS.2024.01"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Export Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Notes</CardTitle>
                <CardDescription>Optional notes to include in the exported PDF</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={exportNotes}
                  onChange={(e) => setExportNotes(e.target.value)}
                  placeholder="Any additional information to include in the PDF..."
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Preview Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Preview</CardTitle>
                <CardDescription>Summary of what will be included</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Plan: {plan.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">V{plan.version}</Badge>
                    <span>{plan.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{plan.tasks.length} tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                
                {plan.guardianSignatureRequired && (
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <Shield className="h-4 w-4" />
                    <span>Guardian signature is required for this plan</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            PDF will be downloaded automatically
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleExportPDF} 
              disabled={isExporting}
              className="min-w-[120px]"
            >
              {isExporting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};