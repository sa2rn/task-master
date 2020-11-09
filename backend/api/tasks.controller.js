exports.list = (req, res, next) => {
  return res.json([])
}

exports.retrieve = (req, res, next) => {
  return res.json({})
}

exports.remove = (req, res, next) => {
  return res.status(203).end()
}

exports.create = (req, res, next) => {
  return res.status(200).json({})
}

exports.update = (req, res, next) => {
  return res.status(200).json({})
}
