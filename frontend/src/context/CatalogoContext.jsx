import { createContext, useContext, useEffect, useState } from 'react';
import areasService from '../api/services/areasService';
import tiposSolicitudService from '../api/services/tiposSolicitudService';

const CatalogoContext = createContext(null);

export function CatalogoProvider({ children }) {
  const [areas, setAreas] = useState([]);
  const [tiposSolicitud, setTiposSolicitud] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCatalogos = async () => {
      try {
        setLoading(true);
        const [areasData, tiposData] = await Promise.all([
          areasService.getAll(),
          tiposSolicitudService.getAll(),
        ]);
        setAreas(areasData);
        setTiposSolicitud(tiposData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCatalogos();
  }, []);

  return (
    <CatalogoContext.Provider value={{ areas, tiposSolicitud, loading, error }}>
      {children}
    </CatalogoContext.Provider>
  );
}

export function useCatalogo() {
  const context = useContext(CatalogoContext);
  if (!context) {
    throw new Error('useCatalogo debe usarse dentro de CatalogoProvider');
  }
  return context;
}

export default CatalogoContext;
