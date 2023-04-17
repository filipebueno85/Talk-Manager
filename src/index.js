const express = require('express');

const talkerRouter = require('./routes/talkerRouter');
const loginRouter = require('./routes/loginRouter');

const app = express();
app.use(express.json());
const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

app.use(talkerRouter);
app.use(loginRouter);
// const readFile = async () => {
//   const response = await fs.readFile(talkerPath, 'utf-8');
//   return JSON.parse(response);
// };

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
