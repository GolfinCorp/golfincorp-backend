const ObjectId = require("mongoose").Types.ObjectId;

const idValidator = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ error: "Id must be a valid MongoId" });
  }
  next();
};

module.exports = { idValidator };
