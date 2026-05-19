import { IonPage, IonContent, IonButton, IonInput, IonToast } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';
import { createOutline, checkmarkOutline } from 'ionicons/icons';
import './Perfil.css';

const Perfil: React.FC = () => {
    const history = useHistory();
    const [editando, setEditando] = useState(false);
    const [mostrarToast, setMostrarToast] = useState(false);
    const [mensajeToast, setMensajeToast] = useState('');
    const [tipoToast, setTipoToast] = useState<'success' | 'error'>('success');

    const [datos, setDatos] = useState({
        nombre: '',
        correo: '',
        universidad: 'UDES, Bucaramanga',
        motivacion: 'Cuidar el planeta',
        miembro: '',
        nivel: 1,
        ecoPuntos: 0,
        racha: 0
    });

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetch(`http://localhost:3000/stats/${userId}`)
                .then(res => res.json())
                .then(stats => {
                    setDatos(prev => ({
                        ...prev,
                        nivel: stats.nivel || 1,
                        ecoPuntos: stats.ecoPuntos || 0,
                        racha: stats.racha || 0
                    }));
                })
                .catch(() => {});
        }

        const nombre = localStorage.getItem('nombre');
        const correo = localStorage.getItem('correo');
        const fecha = localStorage.getItem('fechaRegistro');
        if (nombre) setDatos(prev => ({...prev, nombre}));
        if (correo) setDatos(prev => ({...prev, correo}));
        if (fecha) setDatos(prev =>({...prev, miembro: new Date(fecha).toLocaleDateString('es-CO', {month: 'long', year: 'numeric'}) }))
    }, []); 

    const showToast = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
        setMensajeToast(mensaje);
        setTipoToast(tipo);
        setMostrarToast(true);
    };

    const handleChange = (campo: string, valor: string) => {
        setDatos({ ...datos, [campo]: valor });
    };

    const handleGuardar = async() => {
        const correoOriginal = localStorage.getItem('correo');

        try{
            const res = await fetch("http://localhost:3000/actualizarUsuario", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
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
                showToast('Perfil actualizado correctamente', 'success');
                setEditando(false);
            } else{
                showToast(data.mensaje, 'error');
            }
        } catch (error) {
            console.error("Error:", error);
            showToast('Error al actualizar perfil', 'error');
        }
    };

    const handleCerrarSesion = () => {
        localStorage.clear();
        history.push('/login');
    };

    const getNivelTexto = (nivel: number) => {
        if (nivel >= 11) return 'Eco Experto';
        if (nivel >= 5) return 'Eco Intermedio';
        return 'Eco Principiante';
    };

    const getInicialesNombre = (nombre: string) => {
        if (!nombre) return '?';
        return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <IonPage>
            <IonContent className="perfil-content">
                <IonToast
                    isOpen={mostrarToast}
                    message={mensajeToast}
                    duration={2000}
                    color={tipoToast === 'success' ? 'success' : 'danger'}
                    position="top"
                    onDidDismiss={() => setMostrarToast(false)}
                />

                <div className="perfil-header">
                    <IonButton className='btn-back' onClick={() => history.push('/home')} expand="block" shape="round">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6"/></svg>
                    </IonButton>

                    <div className="avatar-grande">
                        {getInicialesNombre(datos.nombre)}
                    </div>

                    {editando ? (
                        <IonInput className="input-edit" value={datos.nombre} onIonChange={e => handleChange('nombre', e.detail.value!)}/>
                    ) : (
                        <h2>{datos.nombre || 'Usuario'}</h2>
                    )}

                    <p className="carrera">Estudiante UDES</p>
                    
                    <div className="nivel-container">
                        <div className="nivel-badge">
                            <span className="nivel-numero">Nivel {datos.nivel}</span>
                            <span className="nivel-nombre">{getNivelTexto(datos.nivel)}</span>
                        </div>
                        <div className="stats-mini">
                            <span>🔥 {datos.racha}</span>
                            <span>🌱 {datos.ecoPuntos}</span>
                        </div>
                    </div>
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
                            }}  expand="block">
                                {editando ? 'Guardar' : 'Editar perfil'}
                            </IonButton>
                        </div>
                        
                    </div>
                    <IonButton className='btn-cerrarSesion' color="danger" expand="block" onClick={handleCerrarSesion}>Cerrar Sesión</IonButton>
                </main>

            </IonContent>
        </IonPage>
    );
};

export default Perfil;