import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PetsList from './pages/PetsList';
import PetForm from './pages/PetForm';
import PetDetail from './pages/PetDetail';
import Breeds from './pages/Breeds';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/pets" replace />} />
            <Route path="/pets" element={<PetsList />} />
            <Route path="/pets/new" element={<PetForm />} />
            <Route path="/pets/:id" element={<PetDetail />} />
            <Route path="/breeds" element={<Breeds />} />
            <Route path="*" element={<Navigate to="/pets" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;