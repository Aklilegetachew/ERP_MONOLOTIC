const summerySales = require("../../models/sales/summeryModels");

exports.showAllSummery = (req, res, next) => {
  summerySales.allSummery().then((respo) => {
    res.status(200).json(respo);
  });
};
