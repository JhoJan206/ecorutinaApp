import { IonPage, IonContent, IonButton, IonToast, IonSpinner, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';
import { chevronBackOutline } from 'ionicons/icons';
import EcoIcon from '../components/EcoIcon';
import './Simulador.css';

interface CategoriaCO2 {
  categoria: string;
  icono: string;
  completados: number;
  co2_ahorrado: number;
}

interface HistorialCO2 {
  fecha: string;
  co2_ahorrado: number;
  habitos_completados: number;
}

interface Equivalencias {
  _arboles: string;
  kilometrosCoche: string;
  bolsasPlastico: number;
  horasTV: string;
  kilosCarne: string;
  diasSinHuella: string;
}

const Simulador: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [co2Total, setCo2Total] = useState(0);
  const [habitosTotales, setHabitosTotales] = useState(0);
  const [categorias, setCategorias] = useState<CategoriaCO2[]>([]);
  const [historial, setHistorial] = useState<HistorialCO2[]>([]);
  const [equivalencias, setEquivalencias] = useState<Equivalencias | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const metaMensual = 50;
  const progresoMeta = Math.min((co2Total / metaMensual) * 100, 100);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const [co2Res, compRes] = await Promise.all([
        fetch(`http://localhost:3000/co2/${userId}`),
        fetch(`http://localhost:3000/comparativas/${userId}`)
      ]);

      const co2Data = await co2Res.json();
      setCo2Total(co2Data.co2_total || 0);
      setHabitosTotales(co2Data.habitos_totales || 0);
      setCategorias(co2Data.por_categoria || []);
      setHistorial(co2Data.historial || []);

      const compData = await compRes.json();
      setEquivalencias(compData.equivalencias);
    } catch (error) {
      console.error('Error al cargar datos CO2:', error);
      setToastMessage('Error al cargar datos');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha: string) => {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
  };

  const getMaxHistorial = () => {
    if (historial.length === 0) return 1;
    return Math.max(...historial.map(h => h.co2_ahorrado), 1);
  };

  return (
    <IonPage>
      <IonContent className="simulador-content">
        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={2000}
          position="top"
          onDidDismiss={() => setShowToast(false)}
        />

        <div className="simulador-header">
          <IonButton className='btn-back' onClick={() => history.push('/home')} expand="block" shape="round">
            <IonIcon icon={chevronBackOutline} />
          </IonButton>

          <div className="header-content">
            <h1><EcoIcon emoji="🌍" /> Mi Huella de Carbono</h1>
            <p className="subtitle">CO₂ ahorrado con tus hábitos ecológicos</p>
          </div>
        </div>

        <main className="simulador-main">
          {loading ? (
            <div className="loading-container">
              <IonSpinner name="lines" color="success" />
              <p>Cargando datos...</p>
            </div>
          ) : (
            <>
              <div className="co2-highlight">
                <div className="co2-circle">
                  <span className="co2-number">{co2Total.toFixed(2)}</span>
                  <span className="co2-unit">kg CO₂</span>
                </div>
                <p className="co2-label">¡Has ahorrado!</p>
                <p className="habitos-count">{habitosTotales} hábitos completados</p>
              </div>

              <div className="meta-section">
                <div className="meta-header">
                  <h3><EcoIcon emoji="🎯" /> Meta Mensual</h3>
                  <span>{progresoMeta.toFixed(0)}%</span>
                </div>
                <div className="meta-progress">
                  <div className="meta-bar" style={{ width: `${progresoMeta}%` }}></div>
                </div>
                <p className="meta-text">{co2Total.toFixed(1)} / {metaMensual} kg CO₂ al mes</p>
              </div>

              <div className="categorias-section">
                <h3><EcoIcon emoji="📊" /> Por Categoría</h3>
                {categorias.length === 0 ? (
                  <p className="empty-text">Completa hábitos para ver el desglose</p>
                ) : (
                  categorias.map((cat, idx) => (
                    <div key={idx} className="categoria-card">
                      <div className="categoria-icon"><EcoIcon emoji={cat.icono} /></div>
                      <div className="categoria-info">
                        <h4>{cat.categoria}</h4>
                        <p>{cat.completados} hábitos</p>
                      </div>
                      <div className="categoria-co2">
                        <span className="co2-value">{Number(cat.co2_ahorrado || 0).toFixed(2)}</span>
                        <span className="co2-unit">kg</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {historial.length > 0 && (
                <div className="historial-section">
                  <h3><EcoIcon emoji="📈" /> Evolución (últimos 7 días)</h3>
                  <div className="historial-chart">
                    {historial.map((h, idx) => (
                      <div key={idx} className="chart-bar-container">
                        <div
                          className="chart-bar"
                          style={{ height: `${(h.co2_ahorrado / getMaxHistorial()) * 100}%` }}
                        >
                          <span className="bar-value">{Number(h.co2_ahorrado || 0).toFixed(1)}</span>
                        </div>
                        <span className="bar-label">{formatFecha(h.fecha)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {equivalencias && (
                <div className="equivalencias-section">
                  <h3><EcoIcon emoji="🌱" /> Equivalencias</h3>
                  <p className="eq-subtitle">Lo que has logrado equivale a:</p>

                  <div className="eq-grid">
                    <div className="eq-card">
                      <EcoIcon emoji="🌳" className="eq-icon" />
                      <span className="eq-value">{equivalencias._arboles}</span>
                      <span className="eq-label">árboles plantados</span>
                    </div>

                    <div className="eq-card">
                      <EcoIcon emoji="🚗" className="eq-icon" />
                      <span className="eq-value">{equivalencias.kilometrosCoche}</span>
                      <span className="eq-label">km sin conducir</span>
                    </div>

                    <div className="eq-card">
                      <EcoIcon emoji="🛍️" className="eq-icon" />
                      <span className="eq-value">{equivalencias.bolsasPlastico}</span>
                      <span className="eq-label">bolsas evitadas</span>
                    </div>

                    <div className="eq-card">
                      <EcoIcon emoji="📺" className="eq-icon" />
                      <span className="eq-value">{equivalencias.horasTV}</span>
                      <span className="eq-label">horas sin TV</span>
                    </div>

                    <div className="eq-card">
                      <EcoIcon emoji="🥩" className="eq-icon" />
                      <span className="eq-value">{equivalencias.kilosCarne}</span>
                      <span className="eq-label">kg carne ahorrada</span>
                    </div>

                    <div className="eq-card">
                      <EcoIcon emoji="🏠" className="eq-icon" />
                      <span className="eq-value">{equivalencias.diasSinHuella}</span>
                      <span className="eq-label">días huella cero</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="tips-section">
                <h3><EcoIcon emoji="💡" /> ¿Sabías que?</h3>
                <ul>
                  <li>Un árbol adulto absorbe aproximadamente 21 kg de CO₂ al año</li>
                  <li>El transporte representa el 25% de las emisiones globales</li>
                  <li>Cada kWh de energía ahorrada evita 0.5 kg de CO₂</li>
                  <li>Reciclar 1kg de papel ahorra 1.5 kg de CO₂</li>
                </ul>
              </div>
            </>
          )}
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Simulador;