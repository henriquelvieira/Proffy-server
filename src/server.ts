import express from 'express';
import routes from './database/routes';

const app = express();

app.use(express.json());
app.use(routes);

const vPort  =  process.env.PORT || 3333;
app.listen(vPort, () => console.log("Backend server live on " + vPort));
