const payableModel = require("../../models/finance/payableModel");
const cashManagment = require("../../models/finance/cashManagment");

exports.showAllPayable = (req, res, next) => {
  payableModel.showAll().then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(404).json(respo[1]);
    }
  });
};
exports.makeCompelte = async (req, res, next) => {
  const result = await payableModel.makeComplete(req.body.salesID);
  if (result) {
    const results = await payableModel.updateComplete(req.body.ID);
    if (results[0]) {
      res.status(200).json(results[1]);
    } else {
      res.status(404).json(results[1]);
    }
  } else {
    res.status(404).json({ message: "Sales Status Error" });
  }
};
exports.showReasonById = async (req, res, next) => {
  payableModel.showreason(req.body.id).then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(400).json(respo[1]);
    }
  });
};

exports.addaccountPayable = async (req, res, next) => {
  console.log(req.body.purchaseddata);
  const responseArray = await payableModel.stateReason(req.body.purchaseddata);
  if (responseArray[0]) {
    payableModel
      .addingPayable(req.body.purchaseddata, responseArray[1])
      .then((result) => {
        if (result[0]) {
          res.status(200).json({ message: result[1] });
        } else {
          res.status(400).json({ message: result[1] });
        }
      });
  } else {
    res
      .status(400)
      .json({ message: "error in stating reason", Error: responseArray[1] });
  }
};

exports.responsPayable = (req, res, next) => {
  const result = payableModel.checkPayment(req.body);

  if (result) {
    payableModel.makePayment(req.body).then((result) => {
      if (result[0]) {
        payableModel
          .showPayed(req.body)
          .then((resu) => {
            cashManagment.addtoPayable(resu);
            res.status(200).json({ message: "Payed", data: resu });
          })
          .catch((err) => {
            res.status(400).json({ message: err });
          });
      } else {
        res.status(400).json({ message: result[1] });
      }
    });
  } else {
    res.status(200).json({ message: "Already Payed", data: false });
  }
};
