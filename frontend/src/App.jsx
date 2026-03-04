import { useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Home from "./pages/home";
import Cameras from "./pages/camera";
import Students from "./pages/students";
import Violations from "./pages/violations";
import Login from "./pages/login";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  const renderPage = () => {
    switch (activeTab) {
      case "home": return <Home />;
      case "cameras": return <Cameras />;
      case "students": return <Students />;
      case "violations": return <Violations />;
      default: return <Home />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0f1117] overflow-hidden font-mono">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 overflow-y-auto bg-[#0f1117]">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}