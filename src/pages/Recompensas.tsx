import { IonPage, IonContent, IonButton, IonToast, IonIcon, useIonViewWillEnter } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import { chevronBackOutline } from 'ionicons/icons';
import EcoIcon from '../components/EcoIcon';
import './Recompensas.css';
import { API_URL } from '../api';

interface Recompensa {
  id: number;
  nombre: string;
  descripcion: string;
  puntosRequeridos: number;
  icono: string;
  tipo: string;
  condicion_valor: number | null;
  condicion_extra: string | null;
  desbloqueada: boolean;
}

interface CategoriaCo2 {
  categoria: string;
  icono: string;
  completados: number;
  co2_ahorrado: number;
}

interface Co2Data {
  co2_total: number;
  habitos_totales: number;
  por_categoria: CategoriaCo2[];
}

const Recompensas: React.FC = () => {
    const history = useHistory();
    const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
    const [ecoPuntos, setEcoPuntos] = useState(0);
    const [racha, setRacha] = useState(0);
    const [co2Data, setCo2Data] = useState<Co2Data | null>(null);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useIonViewWillEnter(() => {
        cargarDatos();
    });

    const cargarDatos = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const [statsRes, recompensasRes, co2Res] = await Promise.all([
                fetch(`${API_URL}/stats/${userId}`),
                fetch(`${API_URL}/recompensas`),
                fetch(`${API_URL}/co2/${userId}`)
            ]);

            const stats = await statsRes.json();
            setEcoPuntos(stats.ecoPuntos || 0);
            setRacha(stats.racha || 0);

            const co2: Co2Data = await co2Res.json();
            setCo2Data(co2);

            const recompensasData: Recompensa[] = await recompensasRes.json();

            const recompensasConEstado = recompensasData.map(r => ({
                ...r,
                desbloqueada: checkDesbloqueada(r, stats, co2)
            }));

            setRecompensas(recompensasConEstado);
        } catch (error) {
            console.error('Error al cargar recompensas:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkDesbloqueada = (r: Recompensa, stats: any, co2: Co2Data): boolean => {
        switch (r.tipo) {
            case 'racha':
                return (stats.racha || 0) >= r.puntosRequeridos;
            case 'habitos':
                return (co2.habitos_totales || 0) >= r.puntosRequeridos;
            case 'co2':
                return (co2.co2_total || 0) >= r.puntosRequeridos;
            case 'categoria':
                const cat = co2.por_categoria?.find(c =>
                    r.condicion_extra && c.categoria.toLowerCase().includes(r.condicion_extra.toLowerCase())
                );
                return cat ? (cat.completados || 0) >= r.puntosRequeridos : false;
            default:
                return (stats.ecoPuntos || 0) >= r.puntosRequeridos;
        }
    };

    const getValorActual = (r: Recompensa): number => {
        let valor: number;
        switch (r.tipo) {
            case 'racha': valor = racha; break;
            case 'habitos': valor = co2Data?.habitos_totales || 0; break;
            case 'co2': valor = co2Data?.co2_total || 0; break;
            case 'categoria': {
                const cat = co2Data?.por_categoria?.find(c =>
                    r.condicion_extra && c.categoria.toLowerCase().includes(r.condicion_extra.toLowerCase())
                );
                valor = cat?.completados || 0;
                break;
            }
            default: valor = ecoPuntos;
        }
        return Math.min(valor, r.puntosRequeridos);
    };

    const getTextoProgreso = (r: Recompensa): string => {
        const actual = getValorActual(r);
        const meta = r.puntosRequeridos;
        switch (r.tipo) {
            case 'racha': return `${actual} / ${meta} días`;
            case 'habitos': return `${actual} / ${meta} hábitos`;
            case 'co2': return `${actual.toFixed(1)} / ${meta} kg CO₂`;
            case 'categoria': return `${actual} / ${meta} hábitos`;
            default: return `${actual} / ${meta} pts`;
        }
    };

    const getProgreso = (r: Recompensa): number => {
        const actual = getValorActual(r);
        return Math.min((actual / r.puntosRequeridos) * 100, 100);
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
                        <h1><EcoIcon emoji="🏆" /> Logros</h1>
                        <p className="puntos-total">
                            <EcoIcon emoji="🌱" className="icon" />
                            <strong>{ecoPuntos}</strong> EcoPuntos
                        </p>
                        <p className="progreso-resumen">
                            {getRecompensasDesbloqueadas()} de {recompensas.length} logros desbloqueados
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
                                                    style={{ width: `${getProgreso(recompensa)}%` }}
                                                ></div>
                                            </div>
                                            <span className="progress-text">
                                                {getTextoProgreso(recompensa)}
                                            </span>
                                        </div>
                                    </div>

                                    {recompensa.desbloqueada && (
                                        <div className="badge"><EcoIcon emoji="✓" /></div>
                                    )}
                                </div>
                            ))}

                            <div className="logros-section">
                                <h3><EcoIcon emoji="🎯" /> ¿Cómo obtener logros?</h3>
                                <ul>
                                    <li><EcoIcon emoji="🌱" /> Acumula EcoPuntos completando hábitos</li>
                                    <li><EcoIcon emoji="🔥" /> Mantén tu racha de días seguidos</li>
                                    <li><EcoIcon emoji="🌍" /> Ahorra CO₂ con hábitos sostenibles</li>
                                    <li><EcoIcon emoji="💧" /> Especialízate en categorías (agua, reciclaje...)</li>
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
