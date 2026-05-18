import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import './Onboarding.css';

const Onboarding3: React.FC = () => {
    const history = useHistory();
    const [seleccionada, setSeleccionada] = useState<number | null>(null);

    const opciones = [
        { valor: 1, texto: 'Poco importante' },
        { valor: 2, texto: 'Algo importante' },
        { valor: 3, texto: 'Importante' },
        { valor: 4, texto: 'Muy importante' },
        { valor: 5, texto: 'Fundamental' }
    ];

    const handleSiguiente = () => {
        if (seleccionada !== null) {
            localStorage.setItem('onboarding_importancia', seleccionada.toString());
            history.push('/onboarding4');
        }
    };

    return (
        <IonPage>
            <IonContent className="onboarding-content">
                <div className="onboarding-header">
                    <p className="progress-text">Paso 3 de 5 · Personalización</p>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: '60%' }}></div>
                    </div>
                </div>

                <h1 className="onboarding-title">¿Qué tan importante es para ti el cuidado del medio ambiente?</h1>

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
                    <IonButton className="btn-atras" onClick={() => history.push('/onboarding2')}>
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

export default Onboarding3;