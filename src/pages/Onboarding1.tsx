import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import './Onboarding.css';

interface Opcion {
    id: string;
    titulo: string;
    subtitulo: string;
    icono: string;
    color: string;
}

const Onboarding1: React.FC = () => {
    const history = useHistory();
    const [seleccionada, setSeleccionada] = useState<string | null>(null);

    const opciones: Opcion[] = [
        {
            id: 'deforestacion',
            titulo: 'Reducir la deforestación',
            subtitulo: 'Proteger bosques y ecosistemas',
            icono: '🌳',
            color: 'verde'
        },
        {
            id: 'agua',
            titulo: 'Cuidar el agua',
            subtitulo: 'Hábitos de consumo responsable',
            icono: '💧',
            color: 'azul'
        },
        {
            id: 'residuos',
            titulo: 'Reducir residuos',
            subtitulo: 'Reciclar y reutilizar materiales',
            icono: '♻️',
            color: 'amarillo'
        },
        {
            id: 'carbono',
            titulo: 'Reducir huella de carbono',
            subtitulo: 'Movilidad y energía sostenible',
            icono: '🍃',
            color: 'verde'
        }
    ];

    const handleSiguiente = () => {
        if (seleccionada) {
            localStorage.setItem('onboarding_motivacion', seleccionada);
            history.push('/onboarding2');
        }
    };

    return (
        <IonPage>
            <IonContent className="onboarding-content">
                <div className="onboarding-header">
                    <p className="progress-text">Paso 1 de 5 · Personalización</p>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: '20%' }}></div>
                    </div>
                </div>

                <h1 className="onboarding-title">¿Cuál es tu mayor motivación ambiental?</h1>

                <div className="opciones-container">
                    {opciones.map((opcion) => (
                        <div
                            key={opcion.id}
                            className={`opcion-card ${seleccionada === opcion.id ? 'seleccionada' : ''}`}
                            onClick={() => setSeleccionada(opcion.id)}
                        >
                            <div className={`opcion-icono ${opcion.color}`}>
                                {opcion.icono}
                            </div>
                            <div className="opcion-texto">
                                <p className="opcion-titulo">{opcion.titulo}</p>
                                <p className="opcion-subtitulo">{opcion.subtitulo}</p>
                            </div>
                            <div className="opcion-radio"></div>
                        </div>
                    ))}
                </div>

                <div className="onboarding-footer">
                    <IonButton className="btn-atras" onClick={() => history.push('/registro')}>
                        ← Atrás
                    </IonButton>
                    <IonButton
                        className="btn-siguiente"
                        disabled={!seleccionada}
                        onClick={handleSiguiente}
                    >
                        Siguiente →
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Onboarding1;