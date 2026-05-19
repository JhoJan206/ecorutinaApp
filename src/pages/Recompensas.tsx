import { IonPage, IonContent, IonButton, IonToast } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';
import './Recompensas.css';

interface Recompensa {
  id: number;
  nombre: string;
  descripcion: string;
  puntosRequeridos: number;
  icono: string;
  desbloqueada: boolean;
}

const Recompensas: React.FC = () => {
    const history = useHistory();
    const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
    const [ecoPuntos, setEcoPuntos] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

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
            const [statsRes, recompensasRes] = await Promise.all([
                fetch(`http://localhost:3000/stats/${userId}`),
                fetch('http://localhost:3000/recompensas')
            ]);

            const stats = await statsRes.json();
            setEcoPuntos(stats.ecoPuntos || 0);

            const recompensasData: Recompensa[] = await recompensasRes.json();
            
            const recompensasConEstado = recompensasData.map(r => ({
                ...r,
                desbloqueada: (stats.ecoPuntos || 0) >= r.puntosRequeridos
            }));

            setRecompensas(recompensasConEstado);
        } catch (error) {
            console.error('Error al cargar recompensas:', error);
        } finally {
            setLoading(false);
        }
    };

    const getProgreso = (puntosRequeridos: number) => {
        const progreso = (ecoPuntos / puntosRequeridos) * 100;
        return Math.min(progreso, 100);
    };

    const getRecompensasDesbloqueadas = () => {
        return recompensas.filter(r => r.desbloqueada).length;
    };

    return (
        <IonPage>
            <IonContent className="recompensas-content">
                <IonToast
                    isOpen={showToast}
                    message={toastMessage}
                    duration={2000}
                    position="top"
                    onDidDismiss={() => setShowToast(false)}
                />

                <div className="recompensas-header">
                    <IonButton className='btn-back' onClick={() => history.push('/home')} expand="block" shape="round">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M15 6l-6 6l6 6"/>
                        </svg>
                    </IonButton>

                    <div className="header-content">
                        <h1>🏆 Recompensas</h1>
                        <p className="puntos-total">
                            <span className="icon">🌱</span>
                            <strong>{ecoPuntos}</strong> EcoPuntos
                        </p>
                        <p className="progreso-resumen">
                            {getRecompensasDesbloqueadas()} de {recompensas.length} recompensas desbloqueadas
                        </p>
                    </div>
                </div>

                <main className="recompensas-main">
                    {loading ? (
                        <div className="loading">Cargando...</div>
                    ) : (
                        <>
                            {recompensas.map((recompensa) => (
                                <div 
                                    key={recompensa.id} 
                                    className={`recompensa-card ${recompensa.desbloqueada ? 'desbloqueada' : 'locked'}`}
                                >
                                    <div className="recompensa-icon">
                                        {recompensa.desbloqueada ? '🔓' : '🔒'}
                                        <span className="icono">{recompensa.icono}</span>
                                    </div>
                                    
                                    <div className="recompensa-info">
                                        <h3>{recompensa.nombre}</h3>
                                        <p>{recompensa.descripcion}</p>
                                        
                                        <div className="recompensa-progress">
                                            <div className="progress-bar">
                                                <div 
                                                    className="progress-fill" 
                                                    style={{ width: `${getProgreso(recompensa.puntosRequeridos)}%` }}
                                                ></div>
                                            </div>
                                            <span className="progress-text">
                                                {ecoPuntos} / {recompensa.puntosRequeridos} pts
                                            </span>
                                        </div>
                                    </div>

                                    {recompensa.desbloqueada && (
                                        <div className="badge">✓</div>
                                    )}
                                </div>
                            ))}

                            <div className="logros-section">
                                <h3>🎯 ¿Cómo ganar más puntos?</h3>
                                <ul>
                                    <li>✅ Completa hábitos diarios</li>
                                    <li>✅ Mantén tu racha de hábitos</li>
                                    <li>✅ Cuantos más hábitos completes, más puntos ganas</li>
                                </ul>
                            </div>
                        </>
                    )}
                </main>
            </IonContent>
        </IonPage>
    );
};

export default Recompensas;