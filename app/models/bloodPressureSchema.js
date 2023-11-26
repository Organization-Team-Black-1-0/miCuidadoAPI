import mongoose from 'mongoose';

const bloodPressureSchema = new mongoose.Schema({
    systolic: {
        type: Number,
        required: true,
    },
    diastolic: {
        type: Number,
        required: true,
    },
    /*date: {
        type: Date,
        required: true,
    },*/
    date: {
        type: Date,
        required: true,
        get: function (value) {
            // Obtener la fecha en formato "dd/mm/aaaa"
            if (value) {
                const options = { day: "2-digit", month: "2-digit", year: "numeric" };
                return value.toLocaleDateString("es-ES", options);
            }
            return value;
        },
        set: function (value) {
            // Convertir la fecha en formato "dd/mm/aaaa" a un objeto Date
            if (typeof value === 'string') {
                const parts = value.split('/');
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[2], 10);
                return new Date(year, month, day);
            }
            return value;
        },
    },
    time: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true
    },
});

bloodPressureSchema.index({
    sistolica: 1,
    diastolica: 1,
    date: 1,
});


bloodPressureSchema.methods.validateBloodPressure = async function(sistolica, diastolica) {
    if (sistolica < 90 || diastolica > 60) {
        return false;
    }

    return true;
};


const Blood = mongoose.model('bloodPressure', bloodPressureSchema);

export default Blood;
