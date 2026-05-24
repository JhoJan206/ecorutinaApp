import {IonPage, IonContent, IonInput, IonButton, IonToast, IonIcon} from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from "react";
import { chevronBackOutline } from 'ionicons/icons';
import './styles.css';

const Registro: React.FC = () => {
    const history = useHistory();
    const [usuario, setUsuario] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

    const showToastMessage = (mensaje: string, color: 'success' | 'danger' = 'success') => {
        setToastMessage(mensaje);
        setToastColor(color);
        setShowToast(true);
    };

    const handleRegister = async () => {
        if (!usuario || !correo || !password) {
            showToastMessage('Por favor completa todos los campos');
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    usuario,
                    correo,
                    password
                })
            });
            const data = await res.json();
            if(res.ok){
                showToastMessage('¡Registro exitoso!', 'success');
                localStorage.setItem('userId', data.id);
                localStorage.setItem('nombre', data.usuario);
                localStorage.setItem('correo', correo);
                
                setTimeout(() => {
                    history.push('/evaluacion');
                }, 1500);
            }else{
                showToastMessage(data.mensaje);
            }
        }catch (error){
            console.error("Error", error); 
            showToastMessage('Error de conexión');
        }
    };  
  
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
                    <h2>Únete a EcoRutina</h2>
                    <p>Crea tu cuenta y comienza a cuidar el planeta</p>
                </div>
                
                <div className="form-container">   
                    <div className="card">
                        <div className="input-group">
                            <label>Nombre de usuario</label>
                            <IonInput 
                                className="input" 
                                placeholder="Tu nombre"
                                fill="outline"
                                value={usuario}
                                onIonChange={(e) => setUsuario(e.detail.value!)}
                                onInput={(e) => setUsuario(e.currentTarget.value as string)}
                            />
                        </div>
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

                        <IonButton expand="block" className="btn-primary" onClick={handleRegister}>
                            Crear cuenta
                        </IonButton>

                        <div className="divider">
                            <span>o continúa con</span>
                        </div>
                        
                        <IonButton expand="block" className="btn-secondary">
                            <span className="google-icon">G</span> Google
                        </IonButton>
                        
                        <p className="link">
                            ¿Ya tienes cuenta? 
                            <strong onClick={() => history.push('/login')}> Inicia sesión</strong>
                        </p>
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default Registro;