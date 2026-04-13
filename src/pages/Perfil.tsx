import { IonPage, IonContent, IonButton, IonInput } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';

import './Perfil.css';

const Perfil: React.FC = () => {
    const history = useHistory();
    const [editando, setEditando] = useState(false);


    //Este es el sitio de la vista, 
    const [datos, setDatos] = useState({
        nombre: '',
        correo: '',
        universidad: 'UDES, Bucaramanga',
        motivacion: 'Cuidar el agua',
        miembro: ''
    });

    //Por medio de esta función logramos agregar nombre, correo y fecha registrada en la base de datos
    useEffect(() => {
        const nombre = localStorage.getItem('nombre');
        const correo = localStorage.getItem('correo');
        const fecha = localStorage.getItem('fechaRegistro');
        if (nombre) setDatos(prev => ({...prev, nombre}));
        if (correo) setDatos(prev => ({...prev, correo}));
        if (fecha) setDatos(prev =>({...prev, miembro: new Date(fecha).toLocaleDateString('es-CO', {month: 'long', year: 'numeric'}) }))
    }, []); 

    const handleChange = (campo: string, valor: string) => {
        setDatos({ ...datos, [campo]: valor });
    };

    const handleGuardar = async() => {
        const correoOriginal = localStorage.getItem('correo'); //Llamamos el correo original

        try{
            const res = await fetch("http://localhost:3000/actualizarUsuario", {
                method: "PUT",//Actualizar
                headers: {"Content-Type": "applicatión/json"},
                body: JSON.stringify({
                    correo: correoOriginal,
                    nuevoNombre: datos.nombre, 
                    nuevoCorreo: datos.correo
                })
            });
            const data = await res.json()

            if(res.ok){
                localStorage.setItem('nombre', datos.nombre);
                localStorage.setItem('correo', datos.correo); 
                alert("Perfil actualizado");
            } else{
                alert(data.mensaje);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <IonPage>
            <IonContent className="perfil-content">

                <div className="perfil-header">
                    <IonButton className='btn-back' onClick={() => history.push('/home')} expand="block" shape="round">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 6l-6 6l6 6" /></svg>
                    </IonButton>

                    <div className="avatar-grande">
                        {datos.nombre.split(' ').map(n => n[0]).join('')}
                    </div>

                    {editando ? (
                        <IonInput className="input-edit" value={datos.nombre} onIonChange={e => handleChange('nombre', e.detail.value!)}/>
                    ) : (
                        <h2>{datos.nombre}</h2>
                    )}

                    <p>Estudiante UDES - Ingeniería de Software</p>
                    <div className="nivel">Eco nivel 0 - Miembro</div>
                </div>

                <main className='perfil-main'>
                    <div className="info-card">
                        <h3>Información personal</h3>

                        <div className="info-item">
                            <span>Correo: </span>
                            {editando ? (
                                <IonInput value={datos.correo} onIonChange={e => handleChange('correo', e.detail.value!)} />
                            ) : (
                                <span>{datos.correo}</span>
                            )}
                        </div>

                        <div className="info-item">
                            <span>Universidad: </span>
                            {editando ? (
                                <IonInput value={datos.universidad} onIonChange={e => handleChange('universidad', e.detail.value!)}/>
                            ) : (
                                <span>{datos.universidad}</span>
                            )}
                        </div>

                        <div className="info-item">
                            <span>Miembro desde: </span>
                            <span>{datos.miembro}</span>
                        </div>

                        <div className="info-item">
                            <span>Motivación: </span>
                            {editando ? (
                                <IonInput value={datos.motivacion} onIonChange={e => handleChange('motivacion', e.detail.value!)} />
                            ) : (
                                <span>{datos.motivacion}</span>
                            )}
                        </div>

                        <div className="btn-container">

                            <IonButton className='btn' onClick={() => {
                                if (editando) handleGuardar();
                                setEditando(!editando); 
                            }}  expand="block"> {editando ? 'Guardar' : 'Editar'}</IonButton>

                        </div>
                        
                    </div>
                    <IonButton className='btn-cerrarSesion' color="danger" expand="block" onClick={() => history.push('/login')}>Cerrar Sesión</IonButton>
                </main>

            </IonContent>
        </IonPage>
    );
};

export default Perfil;