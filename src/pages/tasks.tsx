import { AppLayout } from '@/components/layout/app-layout';
import { TasksOverview } from '@/components/tasks/tasks-overview';

const TasksPage = () => {
  return (
    <AppLayout>
      <TasksOverview />
    </AppLayout>
  );
};

export default TasksPage;