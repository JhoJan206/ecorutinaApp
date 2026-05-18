import {IonPage, IonContent, IonInput, IonButton} from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from "react"; //Colocado por Juan, es para que se genere un input de lo que se escriba en el registro 
import './styles.css';

//onIonChange es un controlador de eventos, cuando el usuario ingrese sus datos, este se activa cuando se confirma el input
// (e) es el evento, setUsuario guarda el valor, e.detail.value es el texto del input.  
const Registro: React.FC = () => {
    const history = useHistory();
    const [usuario, setUsuario] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!usuario || !correo || !password) {
            alert("Por favor completa todos los campos");
            return;
        }

        try {
            //Mandar los inputs al backend para subirlo al mysql mediante el metodo post en formato json
            const res = await fetch("http://localhost:3000/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    usuario,
                    correo,
                    password
                })
            })
            //Convierte la respuesta (lo de arriba) en objeto JS
            const data = await res.json();
            if(res.ok){
                alert("Registro exitoso");
                localStorage.setItem('userId', data.id);
                localStorage.setItem('nombre', data.usuario);
                localStorage.setItem('correo', correo);
                history.push('/evaluacion');
            }else{
                alert(data.mensaje);
            }
        }catch (error){
            console.error("Error", error); 
        }
    };  
  
    return (
    <IonPage>
        <IonContent>
                <div className='header-logs'>
                    <IonButton className='btn-back' onClick={() => history.push('/')} expand="block" shape="round">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 6l-6 6l6 6" /></svg>
                    </IonButton>
                    <h2>Regístrate</h2>
                    <p>Crea tu cuenta EcoRutina</p>
                    
                </div>
                
                <div className="form-container">   
                    <div className="card">
                        <h3>Nombre de usuario</h3>
                        
                        <IonInput 
                            className="input" 
                            placeholder="Nombre de usuario" 
                            value={usuario}
                            onIonChange={(e) => setUsuario(e.detail.value!)}
                            onInput={(e) => setUsuario(e.currentTarget.value as string)}
                        />
                        <h3>Correo electrónico</h3>
                        <IonInput 
                            className="input" 
                            placeholder="Correo electrónico" 
                            value={correo}
                            onIonChange={(e) => setCorreo(e.detail.value!)}
                            onInput={(e) => setCorreo(e.currentTarget.value as string)}
                        />
                        <h3>Contraseña</h3>
                        <IonInput 
                            className="input" 
                            type="text" 
                            placeholder="Contraseña" 
                            value={password}
                            onIonChange={(e) => setPassword(e.detail.value!)}
                            onInput={(e) => setPassword(e.currentTarget.value as string)}
                        />

                        <IonButton expand="block" className="btn" onClick={handleRegister}>Registrarse</IonButton>

                        <small>--- o continuar con ---</small>
                        <IonButton expand="block" className="btn">Google</IonButton>
                        <p className="link" onClick={() => history.push('/login')}>¿Ya tienes cuenta? <strong>Inicia sesión</strong></p>
                    </div>
                </div>

        </IonContent>
    </IonPage>
  );
};

export default Registro;