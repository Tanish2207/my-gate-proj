import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FlatOwnerDashboard from './pages/FlatOwnerDashboard';
import SecurityDashboard from './pages/SecurityDashboard';
import AddFlat from './pages/AddFlat';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<FlatOwnerDashboard />} />
            <Route path="/security" element={<SecurityDashboard />} />
            <Route path="/add-flat" element={<AddFlat />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;