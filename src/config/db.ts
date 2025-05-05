import mongoose from "mongoose";
import { exit } from 'node:process';

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.URL_DATABASE)
        const url = `${connection.connection.host}: ${connection.connection.port}`;
        console.log(`MongoDB conectado en: ${url}`);
    } catch (error) {
        console.log("Error al conectar DB:", error.message);
        exit(1);
    }
}