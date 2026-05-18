import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router';
import './Onboarding.css';

const OnboardingFin: React.FC = () => {
    const history = useHistory();

    const handleComenzar = () => {
        history.push('/home');
    };

    return (
        <IonPage>
            <IonContent className="onboarding-content">
                <div className="felicidades-container">
                    <div className="felicidades-icono">🌱</div>
                    <h1 className="felicidades-titulo">¡Bienvenido a EcoRutina!</h1>
<p className="feligidades-texto">
                        Ya tienes tu plan personalizado listo.
                        <br /><br />
                        Basado en tus respuestas, hemos creado hábitos adaptados a tu nivel. ¿Listo para empezar tu ruta verde?
                    </p>

                    <IonButton className="btn-comenzar" onClick={handleComenzar}>
                        ¡Comenzar mi ruta verde!
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default OnboardingFin;