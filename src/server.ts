import express from 'express';


const app = express();

app.use(express.json());

app.get('/', (request, response) => {
    return response.json({ message: 'Olá'})
})


const vPort  =  process.env.PORT || 3333;
app.listen(vPort, () => console.log("Backend server live on " + vPort));
