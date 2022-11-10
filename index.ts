import express, {Express} from "express";
import mongoose from "mongoose";
import config from 'config'
import authRouter from './router/auth.routes'

const PORT = config.get('PORT')

const app: Express = express();

app.use(express.json())

app.use('/api/auth', authRouter)

const start = async () => {
  try {
    await mongoose.connect(config.get('dbUrl'))
    app.listen(PORT, () => {
      console.log(`Server is running at https://localhost:${PORT}`);
    });
  } catch (e) {
    
  }
}
start()

