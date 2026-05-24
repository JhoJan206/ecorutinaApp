import { IonPage, IonContent, IonButton, IonInput, IonToast, IonIcon, useIonViewWillEnter } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState, useRef } from 'react';
import { createOutline, checkmarkOutline, chevronBackOutline } from 'ionicons/icons';
import EcoIcon from '../components/EcoIcon';
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

    const nombreRef = useRef(localStorage.getItem('nombre') || '');
    const correoRef = useRef(localStorage.getItem('correo') || '');
    const motivacionRef = useRef(localStorage.getItem('motivacion') || 'Cuidar el planeta');

    useIonViewWillEnter(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetch(`http://localhost:3000/stats/${userId}`)
                .then(res => res.json())
                .then(stats => {
                    setDatos(prev => ({
                        ...prev,
                        nivel: stats.nivel || 1,
                        ecoPuntos: stats.ecoPuntos || 0,
                        racha: stats.racha || 0,
                        motivacion: stats.motivacion || 'Cuidar el planeta'
                    }));
                    localStorage.setItem('motivacion', stats.motivacion || 'Cuidar el planeta');
                })
                .catch(err => {
                    console.error('Error al cargar stats:', err);
                    showToast('Error al cargar datos del perfil', 'error');
                });
        }

        const nombre = localStorage.getItem('nombre');
        const correo = localStorage.getItem('correo');
        const fecha = localStorage.getItem('fechaRegistro');
        const motivacion = localStorage.getItem('motivacion');
        if (nombre) setDatos(prev => ({...prev, nombre}));
        if (correo) setDatos(prev => ({...prev, correo}));
        if (fecha) setDatos(prev =>({...prev, miembro: new Date(fecha).toLocaleDateString('es-CO', {month: 'long', year: 'numeric'}) }))
        if (motivacion) setDatos(prev => ({...prev, motivacion}));
    }); 

    const showToast = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
        setMensajeToast(mensaje);
        setTipoToast(tipo);
        setMostrarToast(true);
    };

    const handleChange = (campo: string, valor: string | null | undefined) => {
        const v = valor ?? '';
        if (campo === 'nombre') nombreRef.current = v;
        else if (campo === 'correo') correoRef.current = v;
        else if (campo === 'motivacion') motivacionRef.current = v;
        setDatos(prev => ({ ...prev, [campo]: v }));
    };

    const handleGuardar = async() => {
        const correoOriginal = localStorage.getItem('correo');
        const nuevoNombre = nombreRef.current;
        const nuevoCorreo = correoRef.current;
        const nuevaMotivacion = motivacionRef.current;

        console.log('▶ Refs:', { nuevoNombre, nuevoCorreo, nuevaMotivacion });

        try{
            const res = await fetch("http://localhost:3000/actualizarUsuario", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    correo: correoOriginal,
                    nuevoNombre,
                    nuevoCorreo,
                    nuevaMotivacion
                })
            });
            const data = await res.json()

            console.log('◀ Respuesta:', { ok: res.ok, status: res.status, data });

            if(res.ok){
                localStorage.setItem('nombre', nuevoNombre);
                localStorage.setItem('correo', nuevoCorreo);
                localStorage.setItem('motivacion', nuevaMotivacion);
                showToast('Perfil actualizado correctamente', 'success');
                setEditando(false);
            } else{
                const nombreFallback = localStorage.getItem('nombre') || datos.nombre;
                const correoFallback = localStorage.getItem('correo') || datos.correo;
                const motivacionFallback = localStorage.getItem('motivacion') || datos.motivacion;
                nombreRef.current = nombreFallback;
                correoRef.current = correoFallback;
                motivacionRef.current = motivacionFallback;
                setDatos(prev => ({
                    ...prev,
                    nombre: nombreFallback,
                    correo: correoFallback,
                    motivacion: motivacionFallback
                }));
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
        if (nivel >= 10) return 'Eco Experto';
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
                        <IonIcon icon={chevronBackOutline} />
                    </IonButton>

                    <div className="avatar-grande">
                        {getInicialesNombre(datos.nombre)}
                    </div>

                    {editando ? (
                        <IonInput className="input-edit" value={datos.nombre} onIonChange={e => handleChange('nombre', e.detail.value)}/>
                    ) : (
                        <h2>{datos.nombre || 'Usuario'}</h2>
                    )}

                    <p className="carrera">Estudiante UDES</p>
                    
                    <div className="nivel-container">
                        <div className="nivel-badge">
                            <span className="nivel-numero">Nivel {datos.nivel}</span>
                            <span className="nivel-nombre">{getNivelTexto(datos.nivel)}</span>
                        </div>
                        <div className="progresso-nivel">
                            <div className="progresso-bar-bg">
                                <div className="progresso-bar-fill" style={{ width: `${Math.min((datos.ecoPuntos / (25 * datos.nivel * (datos.nivel + 1))) * 100, 100)}%` }} />
                            </div>
                            <span className="progresso-texto">{datos.ecoPuntos} / {25 * datos.nivel * (datos.nivel + 1)} pts</span>
                        </div>
                        <div className="stats-mini">
                            <span><EcoIcon emoji="🔥" /> {datos.racha}</span>
                            <span><EcoIcon emoji="🌱" /> {datos.ecoPuntos}</span>
                        </div>
                    </div>
                </div>

                <main className='perfil-main'>
                    <div className="info-card">
                        <h3>Información personal</h3>

                        <div className="info-item">
                            <span>Correo: </span>
                            {editando ? (
                                <IonInput value={datos.correo} onIonChange={e => handleChange('correo', e.detail.value)} />
                            ) : (
                                <span>{datos.correo}</span>
                            )}
                        </div>

                        <div className="info-item">
                            <span>Universidad: </span>
                            <span>{datos.universidad}</span>
                        </div>

                        <div className="info-item">
                            <span>Miembro desde: </span>
                            <span>{datos.miembro}</span>
                        </div>

                        <div className="info-item">
                            <span>Motivación: </span>
                            {editando ? (
                                <IonInput value={datos.motivacion} onIonChange={e => handleChange('motivacion', e.detail.value)} />
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
