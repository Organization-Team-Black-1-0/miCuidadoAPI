import mongoose from "mongoose";
import config from "./config.js";
// Se define para que tenga la flexibilidad y escalabilidad 

export const connectDB = async () => {
    try {
        await mongoose.connect(config.uri, config.options);
        console.log("Conectado a la base de Datos");
    } catch (error) {
        console.log(`Error al conectar: ${error}`);
    }
};

connectDB();