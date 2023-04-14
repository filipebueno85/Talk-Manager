const watchedAtValidate = (req, res, next) => {
  const { watchedAt } = req.body.talk;

  const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  const dateFormat = dateRegex.test(watchedAt);

  if (!dateFormat) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();  
};

module.exports = watchedAtValidate;