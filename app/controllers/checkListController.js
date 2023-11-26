import check from '../models/checkListSchema.js';


const questions = [
    '¿El cabello lo tiene limpio y peinado?',
    '¿Se observa los ojos sin lagañas y sin secreción?',
    '¿La nariz esta limpia y sin mucosidad?',
    '¿La boca está higienizada?',
    '¿Los oídos están limpios e higienizados?',
    '¿Detrás de los oídos y el cuello están limpios?',
    '¿El cuerpo está limpio?',
    '¿La piel está brillante y humectada?',
    '¿Las uñas estan limpias y cortas?',
    '¿La ropa está limpia?',
    '¿Las sábanas están limpias?'
];

const otherController = (req, res) => {
    const username = req.session.username; // Accede al username almacenado en la sesión    
    console.log(username);
    res.json({ message: "Conectó el username del inicio de sesión con checkListController!!!", username: username }); 
};

const createChecklist = async (req, res) => {
    const { answers } = req.body;
    if (answers.length !== questions.length) {
        return res.status(400).json({ error: 'Número incorrecto de respuestas.' });
    }
    const checklistQuestions = questions.map((question, index) => ({ question, answer: answers[index] }));
    const user = req.session.username; 
    const checklist = new check({ 
        user: user,
        questions: checklistQuestions 
    });
    
    const savedChecklist = await checklist.save();
    res.json(savedChecklist);
}

const getChecklist = async (req, res) => {
    const userId = req.params.userId;
    const checklist = await check.findOne({ userId });
    if (!checklist) {
        return res.status(404).json({ error: "Checklist no encontrado." });
    }
    res.json(checklist);
}

export { 
    otherController,
    createChecklist, 
    getChecklist 
};