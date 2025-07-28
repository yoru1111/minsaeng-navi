import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tab1SelectPage from "./pages/Tab1SelectPage";
import Tab2MapPage from "./pages/Tab2MapPage";
import Tab3SettingsPage from "./pages/Tab3SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tab1SelectPage />} />
        <Route path="/map" element={<Tab2MapPage />} />
        <Route path="/settings" element={<Tab3SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
