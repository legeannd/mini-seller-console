import { AppProvider } from "@/context/AppContext";
import { MainPage } from "@/pages/MainPage";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <AppProvider>
      <MainPage />
      <Toaster />
    </AppProvider>
  );
}

export default App;
