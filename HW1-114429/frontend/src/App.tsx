import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { ReservationsPage } from './pages/ReservationPage';
import { StaffPage } from './pages/StaffPage';

function App() {
  return (
    <Router>
      <div>
          <Routes>
              <Route path="/" element={<RestaurantsPage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/reservas" element={<ReservationsPage />} />
              <Route path="/staff" element={<StaffPage />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
