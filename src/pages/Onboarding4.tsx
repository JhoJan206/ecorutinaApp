import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import './Onboarding.css';

const Onboarding4: React.FC = () => {
    const history = useHistory();
    const [seleccionada, setSeleccionada] = useState<number | null>(null);

    const opciones = [
        { valor: 0, texto: '0 horas' },
        { valor: 1, texto: '1-2 horas' },
        { valor: 2, texto: '3-5 horas' },
        { valor: 3, texto: 'Más de 5 horas' }
    ];

    const handleSiguiente = () => {
        if (seleccionada !== null) {
            localStorage.setItem('onboarding_horas', seleccionada.toString());
            history.push('/onboarding5');
        }
    };

    return (
        <IonPage>
            <IonContent className="onboarding-content">
                <div className="onboarding-header">
                    <p className="progress-text">Paso 4 de 5 · Personalización</p>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: '80%' }}></div>
                    </div>
                </div>

                <h1 className="onboarding-title">¿Cuántas horas a la semana dedicas a actividades relacionadas con el medio ambiente?</h1>
                <p className="onboarding-subtitle">Por ejemplo: educación ambiental, voluntariado, huertas, etc.</p>

                <div className="horas-options">
                    {opciones.map((opcion) => (
                        <div
                            key={opcion.valor}
                            className={`hora-option ${seleccionada === opcion.valor ? 'seleccionada' : ''}`}
                            onClick={() => setSeleccionada(opcion.valor)}
                        >
                            {opcion.texto}
                        </div>
                    ))}
                </div>

                <div className="onboarding-footer">
                    <IonButton className="btn-atras" onClick={() => history.push('/onboarding3')}>
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

export default Onboarding4;