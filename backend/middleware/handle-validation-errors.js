module.exports = function handleValidationErrors(err, req, res, next) {
  if (err.name === 'SequelizeValidationError' || err.status === 400) {
    const errors = {}

    for (const errItem of err.errors) {
      errors[errItem.path] = errItem.message
    }

    res.status(400).json({ errors })
  } else {
    next(err)
  }
}
