import { ClockDashboard } from '@/components/dashboard/ClockDashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Home() {
  return (
    <ErrorBoundary>
      <ClockDashboard />
    </ErrorBoundary>
  );
}
