import { AppLayout } from '@/components/layout/app-layout';
import { ResidentDirectory } from '@/components/residents/resident-directory';

const ResidentsPage = () => {
  return (
    <AppLayout>
      <ResidentDirectory />
    </AppLayout>
  );
};

export default ResidentsPage;