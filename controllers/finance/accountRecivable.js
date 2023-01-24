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

exports.generateProfit = async (req, res, next) => {
  let profit = 0.0;

  // fetch sales Info
  const salesInfo = await accountRecivable.fetchSalesInfo(req.body);

  // fetch cost From Batch
  const CostInfo = await accountRecivable.fetchCostSummery(req.body);

  if (req.body.VAT == 0) {
    profit =
      parseFloat(salesInfo[1].totalCash) -
      parseFloat(CostInfo[1].finishedWVat) * parseFloat(salesInfo[1].total_product);
  } else {

    profit =
      parseFloat(salesInfo[1].totalCash) -
      (parseFloat(CostInfo[1].finishedWVat) *
        0.15 *
        parseFloat(salesInfo[1].total_product));
  }
  console.log("salesInfo:", salesInfo);
  console.log("CostInfo:", CostInfo);
  console.log("profit:", profit);

  // save profit to profit table
  const saveToProfit = await accountRecivable.ProfitStore(
    salesInfo[1],
    CostInfo[1],
    req.body,
    profit
  );
  const confirmGenerated = await accountRecivable.confirmGenerated(req.body.salesID)

  if (confirmGenerated[0]) {
    res.status(200).json(confirmGenerated[1]);
  } else {
    res.status(400).json(confirmGenerated[1]);
  }
};

exports.showSalesProfit = async (req, res, next) => {
  const salesOrder = await accountRecivable.getsalesProfit();
  if (salesOrder[0]) {
    res.status(200).json(salesOrder[1]);
  } else {
    res.status(404).json(salesOrder[1]);
  }
 
};

exports.showProductionCost = async (req, res, next) => {
  const salesOrder = await accountRecivable.getProductionCost();
  if (salesOrder[0]) {
    res.status(200).json(salesOrder[1]);
  } else {
    res.status(404).json(salesOrder[1]);
  }
 
};

exports.makeCompelte = async (req, res, next) => {
  console.log(req.body);
  const salesOrder = await accountRecivable.getsalesOrder(req.body.ID);

  const results = await accountRecivable.updateComplete(
    req.body,
    salesOrder[1]
  );
  if (results[0]) {
    res.status(200).json(results[1]);
  } else {
    res.status(404).json(results[1]);
  }
};

exports.showSalesOrder = async (req, res, next) => {
  const result = await accountRecivable.showsalesProdOrder();

  if (result[0]) {
    res.status(200).json(result[1]);
  } else {
    res.status(400).json(result[1]);
  }
};
exports.showSalesOrderPro = async (req, res, next) => {
  const result = await accountRecivable.showsalesProdOrderPro();

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
