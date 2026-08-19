import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import database from "./config/db";

const PORT = parseInt(process.env.PORT || '3000');

const startServer = async () => {
  try {
    await database.connect();
    
    app.listen(PORT, '0.0.0.0', () => {
            console.log(` Server running on port ${PORT}`);
            console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(` Database: ${process.env.DB_NAME || 'school_db'}`);
            console.log(` http://localhost:${PORT}`);
        });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();


process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
