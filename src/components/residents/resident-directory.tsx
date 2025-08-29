import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Filter, Eye } from 'lucide-react';
import { mockResidents } from '@/lib/mock-data';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export function ResidentDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredResidents = mockResidents.filter(resident => {
    const matchesSearch = resident.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.preferredName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.roomNumber?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || resident.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'permanent': return 'bg-accent text-accent-foreground';
      case 'respite': return 'bg-secondary text-secondary-foreground';
      case 'home': return 'bg-primary text-primary-foreground';
      case 'discharged': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Residents</h1>
          <p className="text-muted-foreground">Manage resident information and care</p>
        </div>
        <Button asChild>
          <Link to="/residents/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Resident
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search residents..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'permanent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('permanent')}
              >
                Permanent
              </Button>
              <Button
                variant={statusFilter === 'respite' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('respite')}
              >
                Respite
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Residents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResidents.map((resident) => (
          <Card key={resident.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={resident.photoUrl} alt={resident.fullName} />
                  <AvatarFallback>{getInitials(resident.fullName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{resident.preferredName || resident.fullName}</CardTitle>
                  <CardDescription>
                    {resident.roomNumber && `Room ${resident.roomNumber}`}
                    {resident.bedNumber && ` • Bed ${resident.bedNumber}`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(resident.status)}>
                  {resident.status.charAt(0).toUpperCase() + resident.status.slice(1)}
                </Badge>
                
                {resident.allergies.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    ALLERGY
                  </Badge>
                )}
                
                {resident.isInfectionControl && (
                  <Badge variant="secondary" className="text-xs">
                    ISOLATION
                  </Badge>
                )}
                
                {resident.hasAdvanceDirective && (
                  <Badge variant="outline" className="text-xs">
                    ACD
                  </Badge>
                )}
              </div>

              <div className="text-sm space-y-1">
                <div>
                  <span className="font-medium">Age: </span>
                  {formatDistanceToNow(new Date(resident.dateOfBirth), { addSuffix: false })}
                </div>
                
                {resident.diagnoses.filter(d => d.active).length > 0 && (
                  <div>
                    <span className="font-medium">Primary Diagnosis: </span>
                    {resident.diagnoses.filter(d => d.active)[0]?.title}
                  </div>
                )}
                
                <div>
                  <span className="font-medium">Mobility: </span>
                  {resident.mobilityStatus}
                </div>
                
                {resident.nextReviewDate && (
                  <div>
                    <span className="font-medium">Next Review: </span>
                    <span className={new Date(resident.nextReviewDate) < new Date() ? 'text-destructive' : ''}>
                      {new Date(resident.nextReviewDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button asChild size="sm" className="flex-1">
                  <Link to={`/residents/${resident.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResidents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              No residents found matching your criteria.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}