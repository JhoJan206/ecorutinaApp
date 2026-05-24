import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';
import './styles.css';
import { API_URL } from '../api';

const EvaluacionInicial: React.FC = () => {
    const history = useHistory();
    const [preguntaActual, setPreguntaActual] = useState(0);
    const [respuestas, setRespuestas] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if(!userId) {
            history.push('/login');
            return;
        }
        fetch(`${API_URL}/tieneEvaluacion/${userId}`)
            .then(res => res.json())
            .then(data => {
                if(data.tieneEvaluacion) {
                    localStorage.setItem('nivel', data.nivel.toString());
                    history.push('/home');
                }
            })
            .catch(err => console.error('Error al verificar evaluación:', err));
    }, []);

    const preguntas = [
        {
            id: 1,
            titulo: "¿Con qué frecuencia realizas acciones ambientales en tu vida diaria?",
            opciones: [
                { valor: 1, texto: "Nunca" },
                { valor: 2, texto: "Rara vez" },
                { valor: 3, texto: "A veces" },
                { valor: 4, texto: "Frecuentemente" }
            ]
        },
        {
            id: 2,
            titulo: "¿Separas los residuos para reciclaje?",
            opciones: [
                { valor: 1, texto: "No, los mezclo todo" },
                { valor: 2, texto: "Solo separado papel o plástico" },
                { valor: 3, texto: "Separo varios tipos de residuos" },
                { valor: 4, texto: "Separo correctamente todos los residuos" }
            ]
        },
        {
            id: 3,
            titulo: "¿Qué medio de transporte usas principalmente?",
            opciones: [
                { valor: 1, texto: "Solo vehículo propio (coche/moto)" },
                { valor: 2, texto: "Mayormente coche, a veces transporte público" },
                { valor: 3, texto: "Transporte público o bicicleta" },
                { valor: 4, texto: "Caminar, bicicleta o transporte público" }
            ]
        },
        {
            id: 4,
            titulo: "¿Cómo es tu consumo de agua y energía en casa?",
            opciones: [
                { valor: 1, texto: "No me preocupo, consumo normal" },
                { valor: 2, texto: "Intento ahorrar algo de vez en cuando" },
                { valor: 3, texto: "Siempre apago luces y ahorro agua" },
                { valor: 4, texto: "Uso eficiencia energética y agua responsable" }
            ]
        }
    ];

    const pregunta = preguntas[preguntaActual];
    const progreso = ((preguntaActual + 1) / preguntas.length) * 100;

    const handleSeleccionar = (valor: number) => {
        const nuevasRespuestas = [...respuestas, valor];
        setRespuestas(nuevasRespuestas);

        if (preguntaActual < preguntas.length - 1) {
            setPreguntaActual(preguntaActual + 1);
        } else {
            calcularNivel(nuevasRespuestas);
        }
    };

    const calcularNivel = async (respuestasFinales: number[]) => {
        setLoading(true);
        const suma = respuestasFinales.reduce((a, b) => a + b, 0);
        
        let nivelCalculado: number;
        if (suma <= 8) {
            nivelCalculado = 1 + Math.floor((suma - 4) * 3 / 4);
        } else if (suma <= 13) {
            nivelCalculado = 5 + (suma - 9);
        } else {
            nivelCalculado = 10 + Math.floor((suma - 14) * 10 / 2);
        }

        const userId = localStorage.getItem('userId');

        if (userId) {
            try {
                const res = await fetch(`${API_URL}/evaluacion`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usuarioId: parseInt(userId),
                        respuestas: respuestasFinales,
                        nivel: nivelCalculado
                    })
                });
                if (!res.ok) {
                    const data = await res.json();
                    console.error('Error al guardar evaluación:', data.mensaje);
                }
            } catch (error) {
                console.error('Error al guardar evaluación:', error);
            }
        }

        localStorage.setItem('nivel', nivelCalculado.toString());
        setLoading(false);
        history.push('/home');
    };

    return (
        <IonPage>
            <IonContent className="onboarding-content">
                <div className="onboarding-header">
                    <p className="progress-text">Evaluación inicial · Pregunta {preguntaActual + 1} de {preguntas.length}</p>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${progreso}%` }}></div>
                    </div>
                </div>

                <h1 className="onboarding-title">{pregunta.titulo}</h1>

                <div className="scale-container">
                    {pregunta.opciones.map((opcion) => (
                        <div
                            key={opcion.valor}
                            className="scale-option"
                            onClick={() => handleSeleccionar(opcion.valor)}
                        >
                            {opcion.texto}
                        </div>
                    ))}
                </div>

                <div className="onboarding-footer">
                    {preguntaActual > 0 && (
                        <IonButton 
                            className="btn-atras" 
                            onClick={() => setPreguntaActual(preguntaActual - 1)}
                        >
                            ← Atrás
                        </IonButton>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default EvaluacionInicial;