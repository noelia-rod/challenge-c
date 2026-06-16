import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CatalogoProvider } from './context/CatalogoContext';

// Pages (will be created in subsequent subtasks)
import BandejaSolicitudesPage from './pages/BandejaSolicitudesPage';
import NuevaSolicitudPage from './pages/NuevaSolicitudPage';
import DetalleSolicitudPage from './pages/DetalleSolicitudPage';

function App() {
  return (
    <CatalogoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BandejaSolicitudesPage />} />
          <Route path="/solicitudes/nueva" element={<NuevaSolicitudPage />} />
          <Route path="/solicitudes/:id" element={<DetalleSolicitudPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CatalogoProvider>
  );
}

export default App;
