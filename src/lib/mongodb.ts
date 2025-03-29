import mongoose, { Connection } from "mongoose";

// Bağlantıyı önbelleğe almak için bir değişken
let cachedConnection: Connection | null = null;

// MongoDB'ye bağlanmak için bir yardımcı fonksiyon
export async function connectToMongoDB(): Promise<Connection> {
  // Ortam değişkeninden Mongo URI alınıyor
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable in .env.local"
    );
  }

  // Eğer önbellekte bir bağlantı varsa, onu döndür
  if (cachedConnection) {
    console.log("Using cached MongoDB connection");
    return cachedConnection;
  }

  try {
    // Yeni bir bağlantı oluştur ve önbelleğe al
    const connection = await mongoose.connect(MONGO_URI);
    cachedConnection = connection.connection;

    console.log("New MongoDB connection established");
    return cachedConnection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Hata durumunda işlemi durdur
  }
}
