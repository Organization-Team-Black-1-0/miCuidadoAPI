import fs from 'fs';
import { validateBloodPressure, validateDate, validateTime } from '../../validations.js';

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

const getBloodPressure = (req, res) => {
    const data = readData();
    res.json(data.blood);
};

const getBloodPressureByUsername = (req, res) => {
    const data = readData();
    const username = req.params.username;
    const blood = data.blood.find((blood) => blood.username === username);
    if (!blood) {
        return res.status(404).json({ error: "Usuario no encontrado." });
    } else{
        res.json(blood);
    };
};

const createBloodPressure = (req, res) => {
    const data = readData();
    const { username, systolic, diastolic, date, time } = req.body;

    if (!systolic || !diastolic || !date || !time) {
        return res.status(400).json({ error: "Faltan campos obligatorios del registro de presion arterial." });
    }

    const systolicValidation = validateBloodPressure(systolic);
    if (!systolicValidation.isValid) {
        console.log(systolicValidation.error);
        return;
    }

    const diastolicValidation = validateBloodPressure(diastolic);
    if (!diastolicValidation.isValid) {
        console.log(diastolicValidation.error);
        return;
    }

    const dateValidation = validateDate(date);
    if (!dateValidation.isValid) {
        console.log(dateValidation.error);
        return;
    }

    const timeValidation = validateTime(time);
    if (!timeValidation.isValid) {
        console.log(timeValidation.error);
        return;
    }

    const newBlood = {
        id_blood: data.blood.length + 1,
        username: username,
        systolic: systolic,
        diastolic: diastolic,
        date: date,
        time: time
    };

    data.blood.push(newBlood);
    writeData(data);
    res.json({ message: "Registro cargado con éxito", blood: newBlood });
};

const updateBloodPressure = (req, res) => {
    const data = readData();
    const username = req.params.username;
    const { systolic, diastolic, date, time } = req.body;

    const blood = data.blood.find((blood) => blood.username === username);
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

    writeData(data);
    res.json({ message: "Datos de presión arterial actualizados con éxito", blood });
};

const deleteBlood = (req, res) => {
    const data = readData();
    const username = req.params.username;

    const index = data.blood.findIndex((blood) => blood.username === username);
    if (index === -1) {
        return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const deletedBlood = data.blood.splice(index, 1)[0];
    writeData(data);
    res.json({ message: "Registro eliminado con éxito", blood: deletedBlood });
};

export {
    getBloodPressure,
    getBloodPressureByUsername,
    createBloodPressure,
    updateBloodPressure,
    deleteBlood
};

