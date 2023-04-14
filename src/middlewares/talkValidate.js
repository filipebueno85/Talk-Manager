const talkValidate = (talkValue, res, value) => {
  if (talkValue === undefined) {
    return res.status(400).json(
      { message: `O campo "${value}" é obrigatório` },
    );
  }
};
module.exports = (req, res, next) => {
  const { talk } = req.body;

  return talkValidate(talk, res, 'talk')
    || talkValidate(talk.watchedAt, res, 'watchedAt')
    || talkValidate(talk.rate, res, 'rate')
    || next();
};
