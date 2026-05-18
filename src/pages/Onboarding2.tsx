import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import './Onboarding.css';

const Onboarding2: React.FC = () => {
    const history = useHistory();
    const [seleccionada, setSeleccionada] = useState<number | null>(null);

    const opciones = [
        { valor: 1, texto: 'Nunca' },
        { valor: 2, texto: 'Rara vez' },
        { valor: 3, texto: 'A veces' },
        { valor: 4, texto: 'Frecuentemente' }
    ];

    const handleSiguiente = () => {
        if (seleccionada !== null) {
            localStorage.setItem('onboarding_frecuencia', seleccionada.toString());
            history.push('/onboarding3');
        }
    };

    return (
        <IonPage>
            <IonContent className="onboarding-content">
                <div className="onboarding-header">
                    <p className="progress-text">Paso 2 de 5 · Personalización</p>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: '40%' }}></div>
                    </div>
                </div>

                <h1 className="onboarding-title">¿Con qué frecuencia realizas acciones ambientales?</h1>
                <p className="onboarding-subtitle">Por ejemplo: reciclar, ahorrar energía, usar transporte público, etc.</p>

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
                    <IonButton className="btn-atras" onClick={() => history.push('/onboarding1')}>
                        ← Atrás
                    </IonButton>
                    <IonButton
                        className="btn-siguiente"
                        disabled={seleccionada === null}
                        onClick={handleSiguiente}
                    >
                        Siguiente →
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Onboarding2;