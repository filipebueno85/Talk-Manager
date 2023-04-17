const watchedAtSearchValidate = (req, res, next) => {
  const { date } = req.query;

  const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  const dateFormat = dateRegex.test(date);

  if (date && (!dateFormat)) {
    return res.status(400).json({ message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
  }
  next();  
};

module.exports = watchedAtSearchValidate;