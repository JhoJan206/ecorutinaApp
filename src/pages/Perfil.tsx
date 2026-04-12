import { IonPage, IonContent, IonButton, IonInput } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import './Perfil.css';

const Perfil: React.FC = () => {
    const history = useHistory();

    const [editando, setEditando] = useState(false);

    const [datos, setDatos] = useState({
        nombre: 'Pepito Pérez',
        correo: 'juan@correo.com',
        universidad: 'UDES, Bucaramanga',
        motivacion: 'Cuidar el agua',
        miembro: 'Marzo 2026'
    });

    const handleChange = (campo: string, valor: string) => {
        setDatos({ ...datos, [campo]: valor });
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
                            <IonButton onClick={() => setEditando(!editando)} expand="block">{editando ? 'Guardar' : 'Editar'}</IonButton>
                        </div>
                    </div>
                </main>

            </IonContent>
        </IonPage>
    );
};

export default Perfil;