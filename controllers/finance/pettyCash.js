const pettyCashModule = require("../../models/finance/pettyCashModule");

exports.addcash = (req, res, next) => {
  pettyCashModule.addPettyCash(req.body).then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1] );
    } else {
      res.status(400).json({ message: respo[1] });
    }
  });
};

exports.showCash = (req, res, next) => {
    pettyCashModule.showPettyCash().then((respo) => {
      if (respo[0]) {
        res.status(200).json( respo[1] );
      } else {
        res.status(400).json({ message: respo[1] });
      }
    });
  };