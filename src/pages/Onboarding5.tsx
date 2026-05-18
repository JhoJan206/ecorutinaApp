import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import './Onboarding.css';

const Onboarding5: React.FC = () => {
    const history = useHistory();
    const [seleccionada, setSeleccionada] = useState<number | null>(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const opciones = [
        { valor: 0, texto: 'Ninguno' },
        { valor: 1, texto: '1-2 hábitos' },
        { valor: 2, texto: '3-5 hábitos' },
        { valor: 3, texto: 'Más de 5 hábitos' }
    ];

    const guardarYFinalizar = async () => {
        if (seleccionada !== null) {
            setCargando(true);
            setError(null);
            localStorage.setItem('onboarding_habitos', seleccionada.toString());

            const userId = localStorage.getItem('userId');
            const motivacion = localStorage.getItem('onboarding_motivacion');
            const frecuencia = localStorage.getItem('onboarding_frecuencia');
            const importancia = localStorage.getItem('onboarding_importancia');
            const horas = localStorage.getItem('onboarding_horas');

            try {
                const res = await fetch('http://localhost:3000/guardarOnboarding', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        motivacion,
                        nivel_frecuencia: parseInt(frecuencia || '0'),
                        importancia_env: parseInt(importancia || '0'),
                        horas_ambientales: parseInt(horas || '0'),
                        habitos_actuales: seleccionada
                    })
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    localStorage.setItem('nivel', data.nivelCalculado?.toString() || '1');
                    history.push('/onboarding-fin');
                } else {
                    setError(data.mensaje || 'Error al guardar tus respuestas');
                }
            } catch (error) {
                console.error('Error guardando onboarding:', error);
                setError('Error de conexión. Intenta de nuevo.');
            } finally {
                setCargando(false);
            }
        }
    };

    return (
        <IonPage>
            <IonContent className="onboarding-content">
                <div className="onboarding-header">
                    <p className="progress-text">Paso 5 de 5 · Personalización</p>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: '100%' }}></div>
                    </div>
                </div>

                <h1 className="onboarding-title">¿Cuántos hábitos ecológicos tienes actualmente en tu vida diaria?</h1>
                <p className="onboarding-subtitle">Por ejemplo: separar residuos, ahorrar agua, usar bicicleta, etc.</p>

                <div className="scale-container">
                    {opciones.map((opcion) => (
                        <div
                            key={opcion.valor}
                            className={`scale-option ${seleccionada === opcion.valor ? 'seleccionada' : ''}`}
                            onClick={() => setSeleccionada(opcion.valor)}
                        >
                            {opcion.texto}
                        </div>
                    ))}
                </div>

                <div className="onboarding-footer">
                    <IonButton className="btn-atras" onClick={() => history.push('/onboarding4')} disabled={cargando}>
                        ← Atrás
                    </IonButton>
                    <IonButton
                        className="btn-siguiente"
                        disabled={seleccionada === null || cargando}
                        onClick={guardarYFinalizar}
                    >
                        {cargando ? 'Guardando...' : 'Finalizar'}
                    </IonButton>
                </div>
                {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
            </IonContent>
        </IonPage>
    );
};

export default Onboarding5;