import { validateBloodPressure, validateDate, validateTime } from '../../validations.js';
import Blood from '../models/bloodPressureSchema.js';


const otherController = (req, res) => {
    const username = req.session.username; // Accede al username almacenado en la sesión    
    console.log(username);
    res.json({ message: "Conectó el username del inicio de sesión con bloodPresureController!!!", username: username }); 
};

const getBloodPressure = async (req, res) => {
    try {
        const blood = await Blood.find(); // Usa el modelo de usuario para buscar blood Pressure
        res.status(200).json(blood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBloodPressureByUsername = async (req, res) => {
    
    const username = req.params.user;
    try {   
        const blood = await Blood.find({ username });
        if (blood.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        } else{
            res.json(blood);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const createBloodPressure = async (req, res) => {
    const { systolic, diastolic, date, time } = req.body;

    if (!systolic || !diastolic || !date || !time) {
        return res.status(400).json({ error: "Faltan campos obligatorios del registro de presion arterial." });
    }

    const systolicValidation = validateBloodPressure(systolic);
    if (!systolicValidation.isValid) {
        return res.status(400).json({ error: systolicValidation.error });
    }

    const diastolicValidation = validateBloodPressure(diastolic);
    if (!diastolicValidation.isValid) {
        return res.status(400).json({ error: diastolicValidation.error });
    }

    const dateValidation = validateDate(date);
    if (!dateValidation.isValid) {
        return res.status(400).json({ error: dateValidation.error });
    }

    const timeValidation = validateTime(time);
    if (!timeValidation.isValid) {
        return res.status(400).json({ error: timeValidation.error });
    }

    const user = req.session.username; 

    const newBlood = new Blood({
        user: user,
        systolic: systolic,
        diastolic: diastolic,
        date: date,
        time: time
    });
    try {
        await newBlood.save();
        res.json({ message: "Registro cargado con éxito", blood: newBlood });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
        console.log(error);
    }
};

const updateBloodPressure = async (req, res) => {
    const username = req.params.username;
    const { systolic, diastolic, date, time } = req.body;

    try {
        let blood = await Blood.findOne({ username });
        if (!blood) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }
        if (!systolic && !diastolic && !date && !time) {
            return res.status(400).json({ error: "Se debe proporcionar al menos un campo para actualizar." });
        }
        if (systolic) {
            const systolicValidation = validateBloodPressure(systolic);
            if (!systolicValidation.isValid) {
                return res.status(400).json({ error: systolicValidation.error });
            }
            Blood.systolic = systolic;
        }
        if (diastolic) {
            const dyastolicValidation = validateBloodPressure(diastolic);
            if (!dyastolicValidation.isValid) {
                return res.status(400).json({ error: dyastolicValidation.error });
            }
            blood.diastolic = diastolic;
        }
        if (date) {
            const dateValidation = validateDate(date);
            if (!dateValidation.isValid) {
                return res.status(400).json({ error: dateValidation.error });
            }
            blood.date = date;
        }
        if (time) {
            const timeValidation = validateTime(time);
            if (!timeValidation.isValid) {
                return res.status(400).json({ error: timeValidation.error });
            }
            blood.time = time;
        }
        await blood.save();
        res.json({ message: "Datos de presión arterial actualizados con éxito", blood });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const deleteBlood = async (req, res) => {
    const username = req.params.username;
    try {
        const blood = await Blood.findOneAndDelete({ username });
        if (!blood) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }
        res.json({ message: "Registro eliminado con éxito", blood });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

export {
    otherController,
    getBloodPressure,
    getBloodPressureByUsername,
    createBloodPressure,
    updateBloodPressure,
    deleteBlood
};
