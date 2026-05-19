import {IonPage, IonContent, IonButton} from '@ionic/react';
import { useHistory } from 'react-router';
import './styles.css';

const Portada: React.FC = () => {
    const history = useHistory();

    return (
        <IonPage>
            <IonContent className="portada-content">
                <div className="portada-main">
                    <div className="logo-container">
                        <img src="/Logo.png" alt="EcoRutina" className="main-logo" />
                    </div>
                    
                    <p className="tagline">
                        Pequeños hábitos,<br/>grandes cambios para el planeta
                    </p>


                    <div className="portada-buttons">
                        <IonButton 
                            expand="block" 
                            className="btn-portada-outline" 
                            onClick={() => history.push('/login')}
                        >
                            Iniciar sesión
                        </IonButton>

                        <IonButton 
                            expand="block" 
                            className="btn-portada-primary" 
                            onClick={() => history.push('/registro')}
                        >
                            Regístrate gratis
                        </IonButton>
                    </div>

                    <p className="portada-footer">
                        Comienza tu camino hacia un estilo de vida más sostenible
                    </p>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Portada;