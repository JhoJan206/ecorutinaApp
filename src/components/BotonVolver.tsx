import { IonButton } from '@ionic/react';
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M15 6l-6 6l6 6"/>
            </svg>
        </IonButton>
    );
};

export default BotonVolver;