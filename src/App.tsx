import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';
/* Theme variables */
import './theme/variables.css';

setupIonicReact();

import Portada from './pages/Portada';
import Login from './pages/Login';
import Registro from './pages/Registro';
import EvaluacionInicial from './pages/EvaluacionInicial';
import Home from './pages/Home';
import Perfil from './pages/Perfil';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" component={Portada} />
        <Route path="/login" component={Login} />
        <Route path="/registro" component={Registro} />
        <Route path="/evaluacion" component={EvaluacionInicial} />
        <Route path="/home" component={Home} />
        <Route path="/perfil" component={Perfil} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;