import {IonPage, IonContent,IonButton} from '@ionic/react';
import { useHistory } from 'react-router';
import './styles.css';

const Portada: React.FC = () => {
    const history = useHistory();

    return (
    <IonPage>
        <IonContent>
            <div className="center">

            <div className="portada-container">
                <h1 className="logo">EcoRutina</h1>
                <p className="subtitle">
                Pequeños hábitos, grandes cambios para el planeta
                </p>

                <IonButton expand="block" shape="round" fill="outline" onClick={() => history.push('/login')}>Iniciar sesión</IonButton>

                <IonButton expand="block" shape="round"  onClick={() => history.push('/registro')}>Registrarse</IonButton>
            </div>

            </div>
        </IonContent>
    </IonPage>
  );
};

export default Portada;