const profit = require("../../models/dashboard/profiteModel");
const officegen = require("officegen");
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");

exports.NotifyingTG = async (req, res, next) => {
  const token = "6194448484:AAEabUNgpsO2zdjHMvPDxOrtOymYr1Q6kS8";

  // Create a bot that uses 'polling' to fetch new updates
  const bot = new TelegramBot(token, { polling: true });
  const message = req.body.message;
  const toMessage = req.body.To;
  

  if (toMessage == "warehouse") {
    const chatIds = await profit.fetchUserID("Ware House");

    if (chatIds[0]) {
      console.log(chatIds[1]);
      var status = true;
      var errors;
      chatIds[1].map((eachuser) => {
        try {
          bot.sendMessage(eachuser.personId, message);
        } catch (error) {
          errors = error;
        }
      });
      if (status) {
        res.status(200).json("Notification Sent");
      } else {
        res.status(400).json(errors);
      }
    }
  } else if (toMessage == "Production") {
    const chatIds = await profit.fetchUserID("Production");

    if (chatIds[0]) {
      console.log(chatIds[1]);
      var status = true;
      var errors;
      chatIds[1].map((eachuser) => {
        try {
          bot.sendMessage(eachuser.personId, message);
        } catch (error) {
          errors = error;
        }
      });
      if (status) {
        res.status(200).json("Notification Sent");
      } else {
        res.status(400).json(errors);
      }
    }
  } else if (toMessage == "Sales") {
    const chatIds = await profit.fetchUserID("Sales");

    if (chatIds[0]) {
      console.log(chatIds[1]);
      var status = true;
      var errors;
      chatIds[1].map((eachuser) => {
        try {
          bot.sendMessage(eachuser.personId, message);
        } catch (error) {
          errors = error;
        }
      });
      if (status) {
        res.status(200).json("Notification Sent");
      } else {
        res.status(400).json(errors);
      }
    }
  } else if (toMessage == "finance") {
    const chatIds = await profit.fetchUserID("Finance");

    if (chatIds[0]) {
      console.log(chatIds[1]);
      var status = true;
      var errors;
      chatIds[1].map((eachuser) => {
        try {
          bot.sendMessage(eachuser.personId, message);
        } catch (error) {
          errors = error;
        }
      });
      if (status) {
        res.status(200).json("Notification Sent");
      } else {
        res.status(400).json(errors);
      }
    }
  } else {
    res.status(200).json("UKNOWN USER");
  }
};

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


exports.selectAllFin = (req, res, next) => {
  
  profit.fetchuniqFin().then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(400).json(respo[1]);
    }
  });
};

exports.getExcelFile = (req, res, next) => {
  const xlsx = officegen("xlsx");

  // Add data to the Excel file here...

  const data = [
    { column1: "Row 1, Column 1", column2: "Row 1, Column 2" },
    { column1: "Row 2, Column 1", column2: "Row 2, Column 2" },
    { column1: "Row 3, Column 1", column2: "Row 3, Column 2" },
  ];

  xlsx.on("finalize", function (written) {
    console.log(
      "Finished to create a spreadsheet.\nTotal bytes created: " + written
    );
  });

  xlsx.on("error", function (err) {
    console.log(err);
  });

  const sheet = xlsx.makeNewSheet();
  sheet.name = "My Sheet";
  // sheet.name('Example');

  sheet.setCell("A1", "Column 1");
  sheet.setCell("B1", "Column 2");

  for (let i = 0; i < data.length; i++) {
    const row = i + 2;
    sheet.setCell(`A${row}`, data[i].column1);
    sheet.setCell(`B${row}`, data[i].column2);
  }

  // Set the content type and send the file
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=xlsx.xlsx");
  xlsx.generate(res);
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
    "PPR PIPE",
    "HDPE",
    "UPVC FITTINGS",
    "PPR FITTINGS",
    "Conduit",
    "UPVC PIPE",
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
  profit.fetchProductionCost(req.body.ProdID).then((respo) => {
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
