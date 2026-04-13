import { IonPage, IonContent, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, IonTabs} from '@ionic/react';


import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router';
import { playCircle, radio, library, search } from 'ionicons/icons';


import { useHistory } from 'react-router';
//useState crea y guarda en la variable nombre.
//useEffect hace que se ejecute una sola vez y lo guarde en un array, para que no se esté ejecutando todo el tiempo.
import { useState, useEffect } from 'react';
import './Home.css';

const Home: React.FC = () => {
    const history = useHistory();
    const [nombre, setNombre] = useState('');  //Colocamos el nombre en la variable "nombre" mediante el metodo setNombre

    useEffect(() => {
      const nombreGuardado = localStorage.getItem('nombre');
      if (nombreGuardado) setNombre(nombreGuardado);
    }, [])
    
    return (
        <IonPage>
            <IonContent>
                <header>
                    <div className='header-user'>
                        <div><p>Buenos días,</p>
                        <h2><strong>{nombre}</strong></h2></div>
                        <div onClick={() => history.push('/Perfil')}><div className="avatar">{nombre.charAt(0).toUpperCase()}</div></div>
                        
                        
                    </div>
                    <div className="stats">
                        <div className="stat-card">
                            <h3>0</h3>
                            <p>Racha</p>
                        </div>
                        <div className="stat-card">
                            <h3>0</h3>
                            <p>EcoPuntos</p>
                        </div>
                        <div className="stat-card">
                            <h3>0</h3>
                            <p>Retos</p>
                        </div>
                    </div>
                </header>
                <main>
                    <h3>Rutinas de hoy</h3>

                    <div className="card-progress">
                        <h4>Ahorro de agua</h4>
                        <p>0 de 5 hábitos completados</p>
                        <div className="progress">
                            <div className="bar" style={{ width: '0%' }}></div>
                        </div>
                        <small>0% completado</small>
                    </div>

                    <div className="card-progress">
                        <h4>Energía responsable</h4>
                        <p>0 de 4 hábitos completos</p>
                        <div className="progress">
                            <div className="bar" style={{ width: '0%' }}></div>
                        </div>
                        <small>0% completado</small>
                    </div>

                    <h3>Acceso rápido</h3>

                    <div className="grid">
                        <div className="mini-card">📒<p>Mis Rutinas</p></div>
                        <div className="mini-card">🏆<p>Recompensas</p></div>
                        <div className="mini-card">🌎<p>Simulador</p></div>
                        <div className="mini-card" onClick={() => history.push('/Perfil')}>👤<p>Perfil</p></div>
                    </div>
                </main>
                

                {/*<footer>
                    <IonReactRouter>
                        <IonTabs>
                            <IonRouterOutlet>
                            <Redirect exact path="/" to="/home" />
                            
                            Use the render method to reduce the number of renders your component will have due to a route change.
                            Use the component prop when your component depends on the RouterComponentProps passed in automatically.
                            
                            <Route path="/home" render={() => <HomePage />} exact={true} />
                            <Route path="/radio" render={() => <RadioPage />} exact={true} />
                            <Route path="/library" render={() => <LibraryPage />} exact={true} />
                            <Route path="/search" render={() => <SearchPage />} exact={true} />
                            </IonRouterOutlet>

                            <IonTabBar slot="bottom">
                            <IonTabButton tab="home" href="/home">
                                <IonIcon icon={playCircle} />
                                <IonLabel>Listen now</IonLabel>
                            </IonTabButton>

                            <IonTabButton tab="radio" href="/radio">
                                <IonIcon icon={radio} />
                                <IonLabel>Radio</IonLabel>
                            </IonTabButton>

                            <IonTabButton tab="library" href="/library">
                                <IonIcon icon={library} />
                                <IonLabel>Library</IonLabel>
                            </IonTabButton>

                            <IonTabButton tab="search" href="/search">
                                <IonIcon icon={search} />
                                <IonLabel>Search</IonLabel>
                            </IonTabButton>
                            </IonTabBar>
                        </IonTabs>
                    </IonReactRouter>
                </footer>
                */}

            </IonContent>
        </IonPage>
    );
};

export default Home;