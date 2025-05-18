
import { LoaderPinwheel } from 'lucide-react';

const DashboardLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-[100]">
      <LoaderPinwheel className="h-16 w-16 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">Loading Dashboard...</p>
      <p className="text-sm text-muted-foreground">Fetching stock data and predictions.</p>
    </div>
  );
};

export default DashboardLoader;
