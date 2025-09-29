import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import AppRoutes from "@/routes/AppRoutes";
import { Toaster } from "sonner";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <Toaster position="top-center" theme="dark" />
    </QueryClientProvider>
  );
}

export default App;
