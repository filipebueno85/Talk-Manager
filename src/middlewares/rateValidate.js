const rateValidate = (req, res, next) => {
  const { rate } = req.body.talk;
  if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return res.status(400)
    .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
};

module.exports = rateValidate;