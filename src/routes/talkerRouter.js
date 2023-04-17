const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const talkerDB = require('../db/talkerDB');

const auth = require('../middlewares/auth');
const rateQvalidate = require('../middlewares/rateQvalidate');
const nameValidate = require('../middlewares/nameValidate');
const ageValidate = require('../middlewares/ageValidate');
const talkValidate = require('../middlewares/talkValidate');
const watchedAtValidate = require('../middlewares/watchedAtValidate');
const rateValidate = require('../middlewares/rateValidate');
const watchedAtSearchValidate = require('../middlewares/watchedAtSearchValidate');
const filterQueryTalker = require('../utils/filterQueryTalker');
const rateValidatePatch = require('../middlewares/rateValidatePatch');

const router = express.Router();

const talkerPath = path.resolve(__dirname, '../talker.json');

router.get('/talker/db', async (req, res) => {
  const [result] = await talkerDB.findAll();
  console.log(result);
  const talkers = result.map((talk) => ({
      id: talk.id,
      name: talk.name,
      age: talk.age,
      talk: { rate: talk.talk_rate,
      watchedAt: talk.talk_watched_at },
    }));
  return res.status(200).json(talkers);
});

router.get('/talker/search', auth, rateQvalidate, watchedAtSearchValidate, async (req, res) => {
  const { q, rate, date } = req.query;
  const talker = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
  const queryTalkers = filterQueryTalker(talker, q, rate, date);
  res.status(200).json(queryTalkers);
});

// router.get('/talker/search', 
// auth, 
// rateQvalidate, 
// watchedAtSearchValidate,
// async (req, res) => {
//   const { q } = req.query;
//   // console.log(req.query);
//   const { rate, date } = req.query;
//   const talker = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
//   if (q && rate && date) {
//     const queryTalker = talker.filter((query) => query.talk.rate === Number(rate) && query.talk.watchedAt === date)
//     .filter((query) => query.name.includes(q));
//     return res.status(200).json(queryTalker);
//   }
//   if (q && rate) {
//     const queryTalker = talker.filter((query) => query.talk.rate === (Number(rate)))
//     .filter((query) => query.name.includes(q));
//     return res.status(200).json(queryTalker);
//   }
//   if (q && date) {
//     const queryTalker = talker.filter((query) => query.talk.watchedAt === date)
//     .filter((query) => query.name.includes(q));
//     return res.status(200).json(queryTalker);
//   }

//   if (q) {
//     const queryTalker = talker.filter((query) => query.name.includes(q));
//     return res.status(200).json(queryTalker);
//   }
//   if (rate) {
//     const queryTalkerRate = talker.filter((query) => query.talk.rate === (Number(rate)));
//     return res.status(200).json(queryTalkerRate);
//   }
//   if (date) {
//     const queryTalkerRate = talker.filter((query) => query.talk.watchedAt === date);
//     return res.status(200).json(queryTalkerRate);
//   } 
//   return res.status(200).json(talker);
// });

// router.get('/talker/search', auth, rateValidate, async (req, res) => {
//   const { rate } = req.query;
//   const talker = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
//   if (rate) {
//     const queryTalker = talker.filter((query) => query.Number(rate).includes(q));
//     return res.status(200).json(queryTalker);
//   }
//   return res.status(200).json(talker);
// });

router.get('/talker', async (req, res) => {
  const talker = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
  return res.status(200).json(talker);
});

router.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
  const foundTalker = talker.find((talk) => talk.id === Number(id));
  if (!foundTalker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(foundTalker);
});

router.post('/talker', 
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

router.put('/talker/:id', 
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
    return tlk;
  }); 
  if (!foundTalker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  await fs.writeFile(talkerPath, JSON.stringify(newTalker));
  return res.status(200).json(newTalk);
});

router.delete('/talker/:id', auth, async (req, res) => {
  const { id } = req.params;
  const talker = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
  const deleteTalk = talker.filter((talk) => talk.id !== Number(id));

  await fs.writeFile(talkerPath, JSON.stringify(deleteTalk));
  if (!deleteTalk) res.status(500).send({ message: 'erro!' });
  return res.status(204).json({ message: 'Palestrante deletado com sucesso' });
});

router.patch('/talker/rate/:id', auth, rateValidatePatch, async (req, res) => {
  const talker = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
  const { id } = req.params;
  const { rate } = req.body;

  const newRate = talker.map((tlk) => {
    if (tlk.id === Number(id)) {
      return { ...tlk, talk: { ...tlk.talk, rate } };
    }
    return tlk;
  });
  // console.log(newRate);
  if (!newRate) {
    res.status(500).send({ message: 'erro!' });
  }
  await fs.writeFile(talkerPath, JSON.stringify(newRate));
  return res.status(204).json();
});

module.exports = router;