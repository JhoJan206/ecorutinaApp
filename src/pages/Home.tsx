import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';
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

    useEffect(() => {
      const nombreGuardado = localStorage.getItem('nombre');
      if (nombreGuardado) setNombre(nombreGuardado);
      cargarDatos();
    }, []);

    const cargarDatos = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const statsRes = await fetch(`http://localhost:3000/stats/${userId}`);
        const stats = await statsRes.json();
        const nivelUsuario = stats.nivel || 1;

        setRacha(stats.racha || 0);
        setEcoPuntos(stats.ecoPuntos || 0);
        setNivel(nivelUsuario);

        const [habitosRes, progresoRes] = await Promise.all([
          fetch(`http://localhost:3000/habitos/${nivelUsuario}`),
          fetch(`http://localhost:3000/progreso/${userId}`)
        ]);

        const categoriasData = await habitosRes.json();
        const progresos: Progreso[] = await progresoRes.json();

        const completados = progresos.filter(p => p.completado).map(p => p.habit_id);
        setCompletadosIds(completados);

        const categoriasAgrupadas: CategoriaData[] = categoriasData.map((cat: any) => ({
          nombre: cat.nombre,
          icono: cat.icono,
          habitos: cat.habitos,
          completados: cat.habitos.filter((h: Habito) => completadosIds.includes(h.id)).length
        }));

        setCategorias(categoriasAgrupadas);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    const completarHabito = async (habitoId: number) => {
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
          alert(`+${data.puntosGanados} EcoPuntos!`);
          cargarDatos();
        } else {
          alert(data.mensaje);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    return (
        <IonPage>
            <IonContent>
                <header>
                    <div className='header-user'>
                        <div><p>Buenos días,</p>
                        <h2><strong>{nombre}</strong></h2></div>
                        <div onClick={() => history.push('/Perfil')}><div className="avatar">{nombre.charAt(0).toUpperCase()}</div></div>
                    </div>
                    <div className="stats">
                        <div className="stat-card">
                            <h3>{racha}</h3>
                            <p>Racha</p>
                        </div>
                        <div className="stat-card">
                            <h3>{ecoPuntos}</h3>
                            <p>EcoPuntos</p>
                        </div>
                        <div className="stat-card">
                            <h3>Nivel {nivel}</h3>
                            <p>Nivel</p>
                        </div>
                    </div>
                </header>
                <main>
                    <h3>Rutinas de hoy</h3>

                    {loading ? (
                      <p>Cargando...</p>
                    ) : (
                      categorias.map((cat, idx) => {
                        const porcentaje = cat.habitos.length > 0 
                          ? Math.round((cat.completados / cat.habitos.length) * 100) 
                          : 0;
                        return (
                          <div className="card-progress" key={idx}>
                            <h4>{cat.icono} {cat.nombre}</h4>
                            <p>{cat.completados} de {cat.habitos.length} hábitos completados</p>
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
                                    onClick={() => !estaCompletado && completarHabito(habito.id)}
                                  >
                                    <span className="checkbox">{estaCompletado ? '✓' : '○'}</span>
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

                    <h3>Acceso rápido</h3>

                    <div className="grid">
                        <div className="mini-card">📒<p>Mis Rutinas</p></div>
                        <div className="mini-card">🏆<p>Recompensas</p></div>
                        <div className="mini-card">🌎<p>Simulador</p></div>
                        <div className="mini-card" onClick={() => history.push('/Perfil')}>👤<p>Perfil</p></div>
                    </div>
                </main>
            </IonContent>
        </IonPage>
    );
};

export default Home;