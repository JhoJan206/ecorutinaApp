import { IonPage, IonContent, IonButton, IonToast, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';
import { chevronBackOutline } from 'ionicons/icons';
import EcoIcon from '../components/EcoIcon';
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
                        <IonIcon icon={chevronBackOutline} />
                    </IonButton>

                    <div className="header-content">
                        <h1><EcoIcon emoji="🏆" /> Recompensas</h1>
                        <p className="puntos-total">
                            <EcoIcon emoji="🌱" className="icon" />
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
                                        {recompensa.desbloqueada ? <EcoIcon emoji="🔓" /> : <EcoIcon emoji="🔒" />}
                                        <span className="icono"><EcoIcon emoji={recompensa.icono} /></span>
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
                                        <div className="badge"><EcoIcon emoji="✓" /></div>
                                    )}
                                </div>
                            ))}

                            <div className="logros-section">
                                <h3><EcoIcon emoji="🎯" /> ¿Cómo ganar más puntos?</h3>
                                <ul>
                                    <li><EcoIcon emoji="✅" /> Completa hábitos diarios</li>
                                    <li><EcoIcon emoji="✅" /> Mantén tu racha de hábitos</li>
                                    <li><EcoIcon emoji="✅" /> Cuantos más hábitos completes, más puntos ganas</li>
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