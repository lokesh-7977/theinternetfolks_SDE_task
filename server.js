import app from './src/app.js';
import connectDB from './src/config/database.js';
import config from './src/config/index.js';



app.listen(config.PORT, () => {
  console.log(`THE INTERNET FOLKS SERVER LISTENING ON http://localhost:${config.PORT}`);
  connectDB();
});



