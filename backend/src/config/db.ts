import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  if (isConnected) return true;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/acromatico_db';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Conectado exitosamente a: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error: any) {
    console.warn(`[Database] Aviso: No se pudo conectar a MongoDB (${error.message}). Modo resiliente activo con persistencia en memoria para desarrollo.`);
    return false;
  }
};

export const getDbStatus = () => ({
  isConnected,
  uri: process.env.MONGODB_URI ? 'Configurado' : 'Default local',
});
