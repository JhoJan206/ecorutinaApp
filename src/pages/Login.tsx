import {IonPage, IonContent, IonInput, IonButton, IonToast, IonIcon} from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from 'react'; 
import { chevronBackOutline } from 'ionicons/icons';
import './styles.css';

const Login: React.FC = () => {
    const history = useHistory();
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState<'success' | 'danger' | 'warning'>('danger');

    const showToastMessage = (mensaje: string, color: 'success' | 'danger' | 'warning' = 'danger') => {
        setToastMessage(mensaje);
        setToastColor(color);
        setShowToast(true);
    };

    const handleLogin = async () => {
        if (!correo || !password) {
            showToastMessage('Por favor completa todos los campos');
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({correo, password}) 
            });
            
            const data = await res.json();
            if(res.ok){
                localStorage.setItem('nombre', data.usuario);
                localStorage.setItem('correo', correo);
                localStorage.setItem('fechaRegistro', data.fechaRegistro);
                localStorage.setItem('userId', data.id);
                
                const evalRes = await fetch(`http://localhost:3000/tieneEvaluacion/${data.id}`);
                const evalData = await evalRes.json();
                
                showToastMessage(`Bienvenido, ${data.usuario}!`, 'success');
                
                setTimeout(() => {
                    if(evalData.tieneEvaluacion){
                        history.push('/home');
                    } else {
                        history.push('/evaluacion');
                    }
                }, 1500);
            }else {
                showToastMessage(data.mensaje);
            }
        }catch (error) {
            console.error("Error", error); 
            showToastMessage('Error de conexión');
        }
    }
    
    return (
        <IonPage>
            <IonContent>
                <IonToast
                    isOpen={showToast}
                    message={toastMessage}
                    duration={2500}
                    color={toastColor}
                    position="top"
                    onDidDismiss={() => setShowToast(false)}
                />

                <div className='header-logs'>
                    <IonButton className='btn-back' onClick={() => history.push('/')} expand="block" shape="round">
                        <IonIcon icon={chevronBackOutline} />
                    </IonButton>
                    <div className="header-logo">
                        <img src="/Logo.png" alt="EcoRutina" className="logo-img" />
                    </div>
                    <h1>Bienvenido de vuelta</h1>  
                    <p>Inicia sesión para continuar tu camino ecológico</p>  
                </div>
                        
                <div className="form-container">
                    <div className="card">
                        <div className="input-group">
                            <label>Correo electrónico</label>
                            <IonInput 
                                className="input" 
                                placeholder="tu@email.com" 
                                fill="outline"
                                type="email"
                                value={correo}
                                onIonChange={(e) => setCorreo(e.detail.value!)}
                                onInput={(e) => setCorreo(e.currentTarget.value as string)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contraseña</label>
                            <IonInput 
                                className="input" 
                                type="password" 
                                placeholder="••••••••"
                                fill="outline"
                                value={password}
                                onIonChange={(e) => setPassword(e.detail.value!)}
                                onInput={(e) => setPassword(e.currentTarget.value as string)}
                            />
                        </div>
                        <p className="forgot-pass" onClick={() => showToastMessage('Proximanete...', 'warning')}>¿Olvidaste tu contraseña?</p>

                        <IonButton expand="block" className="btn-primary" onClick={handleLogin}>
                            Iniciar sesión
                        </IonButton>

                        <div className="divider">
                            <span>o continúa con</span>
                        </div>
                        
                        <IonButton expand="block" className="btn-secondary" onClick={() => showToastMessage('Proximanete...', 'warning')}>
                            <span className="google-icon">G</span> Google
                        </IonButton>
                        
                        <p className="link">
                            ¿No tienes cuenta? 
                            <strong onClick={() => history.push('/registro')}> Regístrate</strong>
                        </p>
                    </div>
                </div>
        
            </IonContent>
        </IonPage>
    );
};

export default Login;