const filterQueryTalker = (talkers, q, rate, date) => {
  let queryTalkers = talkers;
  if (q) {
    queryTalkers = queryTalkers.filter((talker) => talker.name.includes(q));
  }
  if (rate) {
    queryTalkers = queryTalkers.filter((talker) => talker.talk.rate === Number(rate));
  }
  if (date) {
    queryTalkers = queryTalkers.filter((talker) => talker.talk.watchedAt === date);
  }
  return queryTalkers;
};

module.exports = filterQueryTalker;
