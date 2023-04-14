const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const talkerPath = path.resolve(__dirname, './talker.json');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

const readFile = async () => {
  const response = await fs.readFile(talkerPath, 'utf-8')
  return JSON.parse(response);
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) =>{
  const talker = await readFile(talkerPath);
  return res.status(200).json(talker);
})

app.listen(PORT, () => {
  console.log('Online');
});
