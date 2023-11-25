import { validateBloodPressure, validateDate, validateTime } from '../../validations.js';
//import BloodPressure from './models/BloodPressure';

const otherController = (req, res) => {
    const username = req.session.username; // Accede al username almacenado en la sesión
        console.log(username);
        res.json({ message: "Conectó el username del inicio de sesión con bloodPresureController!!!", username: username }); 
};

const getBloodPressureByUsername = async (req, res) => {
    const username = req.params.username;
    try {   
        const blood = await BloodPressure.find({ username });
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
    const { username, systolic, diastolic, date, time } = req.body;

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

    const newBlood = {
        username: username,
        systolic: systolic,
        diastolic: diastolic,
        date: date,
        time: time
    };
    try {
        await newBlood.save();
        res.json({ message: "Registro cargado con éxito", blood: newBlood });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const updateBloodPressure = async (req, res) => {
    const username = req.params.username;
    const { systolic, diastolic, date, time } = req.body;

    try {
        let blood = await BloodPressure.findOne({ username });
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
            blood.systolic = systolic;
        }
        if (diastolic) {
            const diastolicValidation = validateBloodPressure(diastolic);
            if (!diastolicValidation.isValid) {
                return res.status(400).json({ error: diastolicValidation.error });
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
        const blood = await BloodPressure.findOneAndDelete({ username });
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
    getBloodPressureByUsername,
    createBloodPressure,
    updateBloodPressure,
    deleteBlood
};