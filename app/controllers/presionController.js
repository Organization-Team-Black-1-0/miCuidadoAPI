import Presion from '../models/presionSchema.js';

async function recordPresion(req, res) {
    const { sistolica, diastolica } = req.body;

    if (sistolica < 90 || sistolica > 120 || diastolica < 60 || diastolica > 80) {
        res.json({ message: 'La presión arterial está fuera del rango normal. Consulte a un especialista o espere 15 minutos y vuelva a tomar la presión.' });
    } else {
        const newPresion = new Presion({ sistolica, diastolica });
        const savedPresion = await newPresion.save();
        res.json(savedPresion);
    }
}

export default {
    recordPresion,
};