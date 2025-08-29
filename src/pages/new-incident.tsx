import { AppLayout } from '@/components/layout/app-layout';
import { NewIncidentForm } from '@/components/incidents/new-incident-form';

const NewIncidentPage = () => {
  return (
    <AppLayout>
      <NewIncidentForm />
    </AppLayout>
  );
};

export default NewIncidentPage;