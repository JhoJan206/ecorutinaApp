import { IonButton, IonIcon } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';

interface BotonVolverProps {
    ruta?: string;
}

const BotonVolver: React.FC<BotonVolverProps> = ({ ruta = '/' }) => {
    const history = useHistory();

    return (
        <IonButton 
            className='btn-back' 
            onClick={() => history.push(ruta)} 
            expand="block" 
            shape="round"
        >
            <IonIcon icon={chevronBackOutline} />
        </IonButton>
    );
};

export default BotonVolver;