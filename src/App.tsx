import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootPage from "./pages/RootPage";
import DashboardPage from "./pages/DashboardPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootPage />}></Route>
        <Route path="/dashboard" element={<DashboardPage />}></Route>
        <Route path="/*" element={<DashboardPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
