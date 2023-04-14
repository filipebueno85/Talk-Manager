const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const generateToken = require('./utils/generateToken');
const emailValidate = require('./middlewares/emailValidate');
const passwordValidate = require('./middlewares/passwordValidate');
const auth = require('./middlewares/auth');
const nameValidate = require('./middlewares/nameValidate');
const ageValidate = require('./middlewares/ageValidate');
const talkValidate = require('./middlewares/talkValidate');
const watchedAtValidate = require('./middlewares/watchedAtValidate');
const rateValidate = require('./middlewares/rateValidate');

const talkerPath = path.resolve(__dirname, './talker.json');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// const readFile = async () => {
//   const response = await fs.readFile(talkerPath, 'utf-8');
//   return JSON.parse(response);
// };

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const talker = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
  return res.status(200).json(talker);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
  const foundTalker = talker.find((talk) => talk.id === Number(id));
  if (!foundTalker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(foundTalker);
});

app.post('/talker', 
auth, 
nameValidate, 
ageValidate, 
talkValidate, 
watchedAtValidate, 
rateValidate,
async (req, res) => {
  const talker = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
  const { name, age, talk } = req.body;
  const idTalker = talker[talker.length - 1].id + 1;
  const newTalker = {
    id: idTalker,
    name,
    age,
    talk,
  };
  if (!newTalker) {
    return res.status(400).json({ message: 'dados incorretos' });
  }
  talker.push(newTalker);
  await fs.writeFile(talkerPath, JSON.stringify(talker));
  return res.status(201).json(newTalker);
});

app.put('/talker/:id', 
auth, 
nameValidate, 
ageValidate, 
talkValidate, 
watchedAtValidate, 
rateValidate,
async (req, res) => {
  const talker = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const foundTalker = talker.find((tlk) => tlk.id === Number(id));
  const newTalk = { id: Number(id), name, age, talk };
  const newTalker = talker.map((tlk) => {
    if (tlk.id === Number(id)) {
      return newTalk;
    }
    return talk;
  }); 
  if (!foundTalker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  await fs.writeFile(talkerPath, JSON.stringify(newTalker));
  return res.status(200).json(newTalk);
});

app.delete('/talker/:id', auth, async (req, res) => {
  const { id } = req.params;
  const talker = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
  const deleteTalk = talker.filter((talk) => talk.id !== Number(id));

  await fs.writeFile(talkerPath, JSON.stringify(deleteTalk));
  if (!deleteTalk) res.status(500).send({ message: 'erro!' });
  return res.status(204).json({ message: 'Palestrante deletado com sucesso' });
});

app.post('/login', emailValidate, passwordValidate, (req, res) => {
  const { email, password } = req.body;
  const loginArray = [email, password];

  if (loginArray.includes(undefined)) {
    return res.status(401).json({ message: 'Campos ausentes!' });
  }

  const token = generateToken();
  return res.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
