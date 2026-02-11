/**
 * 📝 LÓGICA DEL TEST DISC
 * Test de personalidad DISC con 24 preguntas
 */

// Proteger la página - Solo usuarios autenticados
if (!Auth.isAuthenticated()) {
    window.location.href = CONFIG.routes.login;
}

// Variables globales
let currentQuestion = 0;
let answers = {};
let personalData = {};

// Preguntas del test DISC (24 preguntas, 4 por cada dimensión)
const questions = [
    // Preguntas de Dominancia (D)
    { id: 1, text: "¿Cómo te describes en situaciones de trabajo bajo presión?", type: "D", options: [
        { text: "Tomo el control y dirijo las acciones", value: 4 },
        { text: "Me mantengo enfocado en los resultados", value: 3 },
        { text: "Busco apoyo del equipo", value: 2 },
        { text: "Prefiero seguir procedimientos establecidos", value: 1 }
    ]},
    { id: 2, text: "Cuando enfrentas un desafío, ¿qué haces primero?", type: "D", options: [
        { text: "Actúo rápidamente para resolverlo", value: 4 },
        { text: "Analizo las opciones disponibles", value: 2 },
        { text: "Consulto con otros antes de decidir", value: 1 },
        { text: "Espero a tener toda la información", value: 1 }
    ]},
    { id: 3, text: "¿Cómo manejas los conflictos?", type: "D", options: [
        { text: "Los enfrento directamente", value: 4 },
        { text: "Busco una solución rápida", value: 3 },
        { text: "Intento mediar y calmar la situación", value: 2 },
        { text: "Prefiero evitarlos si es posible", value: 1 }
    ]},
    { id: 4, text: "En un proyecto grupal, ¿qué rol prefieres?", type: "D", options: [
        { text: "Líder que toma decisiones", value: 4 },
        { text: "Coordinador de tareas", value: 3 },
        { text: "Colaborador de apoyo", value: 2 },
        { text: "Analista de detalles", value: 1 }
    ]},

    // Preguntas de Influencia (I)
    { id: 5, text: "¿Cómo prefieres comunicarte con otros?", type: "I", options: [
        { text: "De manera entusiasta y expresiva", value: 4 },
        { text: "Con persuasión y carisma", value: 3 },
        { text: "De forma tranquila y amigable", value: 2 },
        { text: "Con datos y hechos concretos", value: 1 }
    ]},
    { id: 6, text: "En una reunión social, ¿cómo te comportas?", type: "I", options: [
        { text: "Soy el centro de atención", value: 4 },
        { text: "Interactúo con muchas personas", value: 3 },
        { text: "Converso con algunos conocidos", value: 2 },
        { text: "Prefiero observar y escuchar", value: 1 }
    ]},
    { id: 7, text: "¿Qué te motiva más en el trabajo?", type: "I", options: [
        { text: "Reconocimiento y visibilidad", value: 4 },
        { text: "Trabajo en equipo dinámico", value: 3 },
        { text: "Ambiente estable y armonioso", value: 2 },
        { text: "Precisión y calidad del trabajo", value: 1 }
    ]},
    { id: 8, text: "¿Cómo convences a otros de tu idea?", type: "I", options: [
        { text: "Con entusiasmo y energía", value: 4 },
        { text: "Con ejemplos y historias", value: 3 },
        { text: "Con paciencia y empatía", value: 2 },
        { text: "Con datos y lógica", value: 1 }
    ]},

    // Preguntas de Estabilidad (S)
    { id: 9, text: "¿Cómo manejas los cambios repentinos?", type: "S", options: [
        { text: "Me adapto fácilmente", value: 1 },
        { text: "Los acepto con cautela", value: 2 },
        { text: "Necesito tiempo para ajustarme", value: 3 },
        { text: "Prefiero la estabilidad y rutina", value: 4 }
    ]},
    { id: 10, text: "¿Qué valoras más en un equipo?", type: "S", options: [
        { text: "Lograr metas ambiciosas", value: 1 },
        { text: "Tener un ambiente dinámico", value: 2 },
        { text: "Colaboración y apoyo mutuo", value: 4 },
        { text: "Organización y estructura", value: 3 }
    ]},
    { id: 11, text: "¿Cómo describes tu ritmo de trabajo?", type: "S", options: [
        { text: "Rápido y enérgico", value: 1 },
        { text: "Variable según la situación", value: 2 },
        { text: "Constante y equilibrado", value: 4 },
        { text: "Metódico y cuidadoso", value: 3 }
    ]},
    { id: 12, text: "¿Qué es más importante para ti?", type: "S", options: [
        { text: "Resultados y logros", value: 1 },
        { text: "Relaciones y reconocimiento", value: 2 },
        { text: "Armonía y bienestar del equipo", value: 4 },
        { text: "Calidad y precisión", value: 3 }
    ]},

    // Preguntas de Cumplimiento (C)
    { id: 13, text: "¿Cómo abordas una tarea nueva?", type: "C", options: [
        { text: "La empiezo inmediatamente", value: 1 },
        { text: "Busco inspiración y creatividad", value: 2 },
        { text: "Pido orientación al equipo", value: 3 },
        { text: "Investigo y planifico detalladamente", value: 4 }
    ]},
    { id: 14, text: "¿Qué te preocupa más al entregar un trabajo?", type: "C", options: [
        { text: "Cumplir el plazo", value: 1 },
        { text: "Que sea bien recibido", value: 2 },
        { text: "Que cumpla las expectativas", value: 3 },
        { text: "Que no tenga errores", value: 4 }
    ]},
    { id: 15, text: "¿Cómo tomas decisiones importantes?", type: "C", options: [
        { text: "Con rapidez y confianza", value: 1 },
        { text: "Siguiendo mi intuición", value: 2 },
        { text: "Consultando con otros", value: 3 },
        { text: "Analizando todos los datos", value: 4 }
    ]},
    { id: 16, text: "¿Qué describes como tu mayor fortaleza?", type: "C", options: [
        { text: "Determinación y liderazgo", value: 1 },
        { text: "Comunicación y entusiasmo", value: 2 },
        { text: "Paciencia y lealtad", value: 3 },
        { text: "Precisión y análisis", value: 4 }
    ]},

    // Preguntas adicionales mixtas
    { id: 17, text: "En una crisis, ¿cuál es tu primera reacción?", type: "D", options: [
        { text: "Tomar el control", value: 4 },
        { text: "Motivar al equipo", value: 3 },
        { text: "Mantener la calma", value: 2 },
        { text: "Analizar la situación", value: 1 }
    ]},
    { id: 18, text: "¿Cómo prefieres recibir instrucciones?", type: "C", options: [
        { text: "Solo los objetivos finales", value: 1 },
        { text: "Ideas generales", value: 2 },
        { text: "Explicación clara y apoyo", value: 3 },
        { text: "Instrucciones detalladas", value: 4 }
    ]},
    { id: 19, text: "¿Qué ambiente laboral prefieres?", type: "I", options: [
        { text: "Competitivo y desafiante", value: 1 },
        { text: "Creativo y social", value: 4 },
        { text: "Cooperativo y estable", value: 3 },
        { text: "Estructurado y organizado", value: 2 }
    ]},
    { id: 20, text: "¿Cómo manejas los plazos ajustados?", type: "S", options: [
        { text: "Me motivan a trabajar mejor", value: 1 },
        { text: "Los acepto con entusiasmo", value: 2 },
        { text: "Me generan algo de estrés", value: 3 },
        { text: "Prefiero tener más tiempo", value: 4 }
    ]},
    { id: 21, text: "¿Qué tipo de proyectos prefieres?", type: "D", options: [
        { text: "Desafiantes con resultados rápidos", value: 4 },
        { text: "Creativos e innovadores", value: 3 },
        { text: "Colaborativos de largo plazo", value: 2 },
        { text: "Estructurados y bien definidos", value: 1 }
    ]},
    { id: 22, text: "¿Cómo describirías tu estilo de trabajo?", type: "C", options: [
        { text: "Directo y eficiente", value: 1 },
        { text: "Flexible y creativo", value: 2 },
        { text: "Metódico y confiable", value: 3 },
        { text: "Detallado y preciso", value: 4 }
    ]},
    { id: 23, text: "¿Qué es lo que más disfrutas?", type: "I", options: [
        { text: "Superar metas", value: 1 },
        { text: "Conocer gente nueva", value: 4 },
        { text: "Ayudar a otros", value: 3 },
        { text: "Resolver problemas complejos", value: 2 }
    ]},
    { id: 24, text: "¿Cómo reaccionas ante críticas?", type: "S", options: [
        { text: "Las uso para mejorar", value: 1 },
        { text: "Las discuto abiertamente", value: 2 },
        { text: "Me afectan emocionalmente", value: 4 },
        { text: "Las analizo objetivamente", value: 3 }
    ]}
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    setupPersonalDataForm();
});

/**
 * Configurar formulario de datos personales
 */
function setupPersonalDataForm() {
    const session = Auth.getSession();
    
    // Pre-llenar el email si está disponible
    if (session && session.userEmail) {
        document.getElementById('emailConfirm').value = session.userEmail;
    }
    
    document.getElementById('dataForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        personalData = {
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            email: document.getElementById('emailConfirm').value.trim()
        };
        
        // Ocultar formulario y mostrar test
        document.getElementById('personalDataForm').classList.add('hidden');
        document.getElementById('testQuestions').classList.remove('hidden');
        
        // Cargar primera pregunta
        loadQuestion();
    });
}

/**
 * Cargar pregunta actual
 */
function loadQuestion() {
    const question = questions[currentQuestion];
    const container = document.getElementById('questionContainer');
    
    // Renderizar pregunta
    container.innerHTML = `
        <div class="question-block">
            <div class="question-text">
                ${currentQuestion + 1}. ${question.text}
            </div>
            <div class="options-container">
                ${question.options.map((option, index) => `
                    <div class="option-item ${answers[question.id] === index ? 'selected' : ''}" 
                         onclick="selectOption(${question.id}, ${index})">
                        <div class="option-radio"></div>
                        <div class="option-text">${option.text}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Actualizar progreso
    updateProgress();
    
    // Actualizar botones de navegación
    updateNavigation();
}

/**
 * Seleccionar opción
 */
function selectOption(questionId, optionIndex) {
    answers[questionId] = optionIndex;
    loadQuestion();
}

/**
 * Siguiente pregunta
 */
function nextQuestion() {
    // Validar que se haya respondido
    const currentQuestionId = questions[currentQuestion].id;
    if (answers[currentQuestionId] === undefined) {
        Helpers.showAlert('Por favor selecciona una opción antes de continuar', 'warning');
        return;
    }
    
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    }
}

/**
 * Pregunta anterior
 */
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

/**
 * Actualizar barra de progreso
 */
function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = 
        `Pregunta ${currentQuestion + 1} de ${questions.length}`;
}

/**
 * Actualizar navegación
 */
function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Botón anterior
    prevBtn.disabled = currentQuestion === 0;
    
    // Último pregunta: mostrar botón enviar
    if (currentQuestion === questions.length - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
}

/**
 * Enviar test
 */
async function submitTest() {
    // Validar que todas las preguntas estén respondidas
    const unanswered = questions.filter(q => answers[q.id] === undefined);
    if (unanswered.length > 0) {
        Helpers.showAlert('Por favor responde todas las preguntas antes de enviar', 'warning');
        return;
    }
    
    if (!Helpers.confirm('¿Estás seguro de enviar el test? No podrás modificar tus respuestas después.')) {
        return;
    }
    
    Helpers.showLoading(true);
    const session = Auth.getSession();
    
    try {
        // Calcular puntajes DISC
        const scores = calculateDISCScores();
        
        // Preparar datos para enviar
        const testData = {
            accion: 'saveTest',
            adminEmail: session.adminEmail || '',
            adminUsuario: session.userAdmin || '',
            fecha: new Date().toISOString(),
            nombre: personalData.nombre,
            apellido: personalData.apellido,
            email: personalData.email,
            respuestas: JSON.stringify(answers),
            puntajes: JSON.stringify(scores),
            perfilDominante: scores.perfil
        };
        
        const response = await Helpers.fetchAPI(CONFIG.api.testDISC, testData);
        
        if (response.success) {
            Helpers.showAlert('¡Test enviado exitosamente!', 'success');
            
            // Redirigir al userboard después de 2 segundos
            setTimeout(() => {
                window.location.href = CONFIG.routes.userboard;
            }, 2000);
        } else {
            Helpers.showAlert('Error al enviar el test: ' + response.message, 'error');
        }
    } catch (error) {
        console.error('Error al enviar test:', error);
        Helpers.showAlert('Error de conexión al enviar el test', 'error');
    } finally {
        Helpers.showLoading(false);
    }
}

/**
 * Calcular puntajes DISC
 */
function calculateDISCScores() {
    const scores = { D: 0, I: 0, S: 0, C: 0 };
    
    questions.forEach(question => {
        const answerIndex = answers[question.id];
        if (answerIndex !== undefined) {
            const selectedOption = question.options[answerIndex];
            const type = question.type;
            scores[type] += selectedOption.value;
        }
    });
    
    // Determinar perfil dominante
    const maxScore = Math.max(scores.D, scores.I, scores.S, scores.C);
    let perfil = '';
    
    if (scores.D === maxScore) perfil += 'D';
    if (scores.I === maxScore) perfil += 'I';
    if (scores.S === maxScore) perfil += 'S';
    if (scores.C === maxScore) perfil += 'C';
    
    return {
        D: scores.D,
        I: scores.I,
        S: scores.S,
        C: scores.C,
        perfil: perfil
    };
}
