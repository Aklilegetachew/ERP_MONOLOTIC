const profit = require("../../models/dashboard/profiteModel");

exports.showProfit = (req, res, next) => {
  profit.fetchProfit().then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(400).json(respo[1]);
    }
  });
};

exports.selectProductionCost = (req, res, next) => {
  profit.fetchProductionCost(req.body.salesID).then((respo) => {
    console.log(respo);
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(400).json(respo[1]);
    }
  });
};

exports.getuncollected = async (req, res, next) => {
  const respo = await profit.getuncollecteds();
  console.log(respo);
  if (respo[0]) {
    res.status(200).json({ list: respo[1], Total: respo[2] });
  } else {
    res.status(400).json(respo[1]);
  }
};

exports.salesYearly = async (req, res, next) => {
  const Months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  var answersCollected = [];
  for (let currentMonth of Months) {
    const respo = await profit.getYearlyTotal(currentMonth);

    if (respo[0]) {
      answersCollected.push(respo[1]);
    } else {
      res.status(400).json(respo[1]);
    }
  }
  res.status(200).json(answersCollected);
};
