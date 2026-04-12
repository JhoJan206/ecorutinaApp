import {IonPage, IonContent, IonInput, IonButton} from '@ionic/react';
import { useHistory } from 'react-router';
import {useState} from 'react'; //Guardar y actualizar datos de un componente 
import './styles.css';

const Login: React.FC = () => {
    const history = useHistory();
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({correo, password}) 
            });
            
            const data = await res.json();
            if(res.ok){
                alert(`Bienvenido, ${data.usuario}`);
                history.push('/home');
            }else {
                alert(data.mensaje);
            }
        }catch (error) {
            console.error("Error", error); 
        }
    }


    return (
        <IonPage>
            <IonContent>
                <div className="center">

                        <IonButton onClick={() => history.push('/')} expand="block" shape="round">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 6l-6 6l6 6" /></svg>
                        </IonButton>
                        <h1>¡Bienvenido de vuelta!</h1>  
                        <p>Accede a tus rutinas ecológicas</p>  
                    
                        <div className="form-container">
                            <div className="card">

                                <h3>Correo electrónico</h3>
                                <IonInput className="input" placeholder="Correo electrónico" onIonChange={(e) => setCorreo(e.detail.value!)} />
                                <h3>Contraseña</h3>
                                <IonInput className="input" type="password" placeholder="Contraseña" onIonChange={(e) => setPassword(e.detail.value!)} />
                                <p>¿Olvidaste tu contraseña?</p>

                                <IonButton expand="block" className="btn" onClick={handleLogin}>Iniciar sesion</IonButton>

                                <small>--- o continuar con ---</small>
                                <IonButton expand="block" className="btn">🌎 Google</IonButton>
                                <p className="link" onClick={() => history.push('/registro')}>¿No tienes cuenta? <strong>Regístrate</strong></p>

                            </div>
                        </div>
        
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;