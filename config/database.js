import mongoose from "mongoose";
import config from "./config.js";
// Se define para que tenga la flexibilidad y escalabilidad 

const connectDB = async () => {
    try {
        await mongoose.connect(config.uri);
        console.log('Conectado a la base de Datos');
    } catch (error) {
        throw new Error(`Error al conectar: ${error}`);
    }
};

export { connectDB };
