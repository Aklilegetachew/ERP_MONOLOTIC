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

exports.selectDiameter = (req, res, next) => {
  console.log("OD", req.body);
  profit.fetchDiameters(req.body.Cat).then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(400).json(respo[1]);
    }
  });
};

exports.monthlyExpense = (req, res, next) => {

  profit.expenseMonthly(req.body).then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1][0]);
    } else {
      res.status(400).json(respo[1]);
    }
  });
};

exports.getLastFive = (req, res, next) => {
  profit.showlastFiveRecords().then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(400).json(respo[1]);
    }
  });
};

exports.Uncollected = (req, res, next) => {
  profit.fetchUncollected().then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(400).json(respo[1]);
    }
  });
};

exports.getProfitDetail = (req, res, next) => {
  profit.fetchProfitAll().then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(400).json(respo[1]);
    }
  });
};

exports.groupsalesProduct = async (req, res, next) => {
  const lables = [
    "PVC",
    "PPR",
    "HDPE",
    "UPVC fittings",
    "PPR Fitting",
    "Condutes",
  ];
  var value = [];
  for (let keylable of lables) {
    await profit.fetchproductsold(keylable).then((respo) => {
      if (respo[0]) {
        if (respo[1] == null) {
          value.push(0);
        } else {
          value.push(respo[1]);
        }
        // res.status(200).json(respo[1]);
      } else {
        console.log("here");
        res.status(400).json(respo[1]);
      }
    });
  }
  console.log("va", value);
  res.status(200).json(value);
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
