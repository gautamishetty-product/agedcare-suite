import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/app-layout';
import { ResidentProfile } from '@/components/residents/resident-profile';

const ResidentProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <AppLayout>
      <ResidentProfile residentId={id!} />
    </AppLayout>
  );
};

export default ResidentProfilePage;