import { IonPage, IonContent, IonButton, IonToast, IonSpinner } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';
import EcoIcon from '../components/EcoIcon';
import './Home.css';

interface Habito {
  id: number;
  nombre: string;
  descripcion: string;
  puntos: number;
  categoria: string;
  icono: string;
}

interface Progreso {
  habit_id: number;
  completado: boolean;
}

interface CategoriaData {
  nombre: string;
  icono: string;
  habitos: Habito[];
  completados: number;
}

const Home: React.FC = () => {
    const history = useHistory();
    const [nombre, setNombre] = useState('');
    const [racha, setRacha] = useState(0);
    const [ecoPuntos, setEcoPuntos] = useState(0);
    const [nivel, setNivel] = useState(1);
    const [categorias, setCategorias] = useState<CategoriaData[]>([]);
    const [loading, setLoading] = useState(true);
    const [completadosIds, setCompletadosIds] = useState<number[]>([]);
    
    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

    const getSaludo = () => {
        const hora = new Date().getHours();
        if (hora < 12) return 'Buenos días';
        if (hora < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    const getNivelTexto = (nivel: number) => {
        if (nivel >= 11) return 'Experto';
        if (nivel >= 5) return 'Intermedio';
        return 'Principiante';
    };

    useEffect(() => {
      const nombreGuardado = localStorage.getItem('nombre');
      if (nombreGuardado) setNombre(nombreGuardado);
      cargarDatos();
    }, []);

    const showToastMessage = (mensaje: string, color: 'success' | 'danger' = 'success') => {
        setToastMessage(mensaje);
        setToastColor(color);
        setShowToast(true);
    };

    const cargarDatos = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
          setLoading(false);
          return;
      }

      try {
        const [statsRes, progresoRes] = await Promise.all([
          fetch(`http://localhost:3000/stats/${userId}`),
          fetch(`http://localhost:3000/progreso/${userId}`)
        ]);

        const stats = await statsRes.json();
        const nivelUsuario = stats.nivel || 1;

        setRacha(stats.racha || 0);
        setEcoPuntos(stats.ecoPuntos || 0);
        setNivel(nivelUsuario);

        const habitosRes = await fetch(`http://localhost:3000/habitos/${nivelUsuario}`);
        const categoriasData = await habitosRes.json();
        
        const progresos: Progreso[] = await progresoRes.json();

        const completados = progresos.filter(p => p.completado).map(p => p.habit_id);
        setCompletadosIds(completados);

        const categoriasAgrupadas: CategoriaData[] = categoriasData.map((cat: any) => ({
          nombre: cat.nombre,
          icono: cat.icono,
          habitos: cat.habitos,
          completados: cat.habitos.filter((h: Habito) => completados.includes(h.id)).length
        }));

        setCategorias(categoriasAgrupadas);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        showToastMessage('Error al cargar datos', 'danger');
      } finally {
        setLoading(false);
      }
    };

    const completarHabito = async (habitoId: number, puntos: number) => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const res = await fetch('http://localhost:3000/completarHabito', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuarioId: userId, habitId: habitoId })
        });
        const data = await res.json();
        if (res.ok) {
          showToastMessage(`+${data.puntosGanados} EcoPuntos!`, 'success');
          cargarDatos();
        } else {
          showToastMessage(data.mensaje, 'danger');
        }
      } catch (error) {
        console.error('Error:', error);
        showToastMessage('Error al completar hábito', 'danger');
      }
    };

    return (
        <IonPage>
            <IonContent>
                <IonToast
                    isOpen={showToast}
                    message={toastMessage}
                    duration={2500}
                    color={toastColor}
                    position="top"
                    onDidDismiss={() => setShowToast(false)}
                    buttons={[{ text: 'OK', role: 'cancel' }]}
                />

                <header>
                    <div className='header-user'>
                        <div>
                            <p className="saludo">{getSaludo()},</p>
                            <h2><strong>{nombre || 'Usuario'}</strong></h2>
                        </div>
                        <div className="avatar" onClick={() => history.push('/perfil')}>
                            {(nombre || 'U').charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="stats">
                        <div className="stat-card">
                            <EcoIcon emoji="🔥" className="stat-icon" />
                            <h3>{racha}</h3>
                            <p>Racha</p>
                        </div>
                        <div className="stat-card">
                            <EcoIcon emoji="🌱" className="stat-icon" />
                            <h3>{ecoPuntos}</h3>
                            <p>EcoPuntos</p>
                        </div>
                        <div className="stat-card">
                            <EcoIcon emoji="⭐" className="stat-icon" />
                            <h3>{getNivelTexto(nivel)}</h3>
                            <p>Nivel {nivel}</p>
                        </div>
                    </div>
                </header>
                <main>
                    <h3><EcoIcon emoji="🌿" /> Rutinas de hoy</h3>

                    {loading ? (
                      <div className="loading-container">
                        <IonSpinner name="lines" color="success" />
                        <p>Cargando tus hábitos...</p>
                      </div>
                    ) : categorias.length === 0 ? (
                      <div className="empty-state">
                        <p>No hay hábitos disponibles</p>
                      </div>
                    ) : (
                      categorias.map((cat, idx) => {
                        const porcentaje = cat.habitos.length > 0 
                          ? Math.round((cat.completados / cat.habitos.length) * 100) 
                          : 0;
                        return (
                          <div className="card-progress" key={idx}>
                            <div className="card-header">
                                <h4><EcoIcon emoji={cat.icono} /> {cat.nombre}</h4>
                                <span className="progress-text">{cat.completados}/{cat.habitos.length}</span>
                            </div>
                            <div className="progress">
                                <div className="bar" style={{ width: `${porcentaje}%` }}></div>
                            </div>
                            <small>{porcentaje}% completado</small>

                            <div className="habitos-list">
                              {cat.habitos.map((habito: Habito) => {
                                const estaCompletado = completadosIds.includes(habito.id);
                                return (
                                  <div 
                                    key={habito.id} 
                                    className={`habito-item ${estaCompletado ? 'completado' : ''}`}
                                    onClick={() => !estaCompletado && completarHabito(habito.id, habito.puntos)}
                                  >
                                    <span className="checkbox">{estaCompletado ? <EcoIcon emoji="✓" /> : <EcoIcon emoji="○" />}</span>
                                    <div className="habito-info">
                                      <span>{habito.nombre}</span>
                                      <small>+{habito.puntos} pts</small>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    )}
                </main>

                <div className="bottom-nav">
                    <div className="nav-item active" onClick={() => {}}>
                        <EcoIcon emoji="📒" className="nav-icon" />
                        <span className="nav-label">Rutinas</span>
                    </div>
                    <div className="nav-item" onClick={() => history.push('/recompensas')}>
                        <EcoIcon emoji="🏆" className="nav-icon" />
                        <span className="nav-label">Premios</span>
                    </div>
                    <div className="nav-item" onClick={() => history.push('/simulador')}>
                        <EcoIcon emoji="🌎" className="nav-icon" />
                        <span className="nav-label">Simulador</span>
                    </div>
                    <div className="nav-item" onClick={() => history.push('/perfil')}>
                        <EcoIcon emoji="👤" className="nav-icon" />
                        <span className="nav-label">Perfil</span>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Home;