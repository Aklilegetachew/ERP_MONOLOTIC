const accountRecivable = require("../../models/finance/accountRecivable");

exports.addRecivable = async (req, res, next) => {
  // console.log(req.body.newData);
  const salesInfo = await accountRecivable.selectfromSales(
    req.body.newData.raw_salesId
  );
  const GID = await accountRecivable.addtoReasonrequ(req.body.newData);
  // console.log("GID", GID);
  // console.log("sales", salesInfo);
  accountRecivable
    .addToRecivable(salesInfo, GID, req.body.newData.raw_salesId)
    .then((respo) => {
      if (respo[0]) {
        res.status(200).json({ message: "Financed", response: respo[1] });
      } else {
        res
          .status(400)
          .json({ message: "error on finance recivable", response: respo[1] });
      }
    });
};

exports.showSalesOrder = async (req, res, next) => {
  const result = await accountRecivable.showsalesProdOrder();

  if (result[0]) {
    res.status(200).json(result[1]);
  } else {
    res.status(400).json(result[1]);
  }
};

exports.showSalesOrderById = async (req, res, next) => {
  const result = await accountRecivable.showsalesProdOrderID(req.body.ID);
  console.log(result);
  if (result[0]) {
    res.status(200).json(result[1]);
  } else {
    res.status(400).json(result[1]);
  }
};

exports.showRecivable = (req, res, next) => {
  accountRecivable.showall().then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(400).json({ message: "error Message", detail: respo[1] });
    }
  });
};
