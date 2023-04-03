const salesModle = require("../../models/sales/salesOrder");

module.exports.requestProductionOrder = async (req, res, then) => {
  console.log("form", req.body);
  await salesModle.addProductionSales(req.body).then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(400).json(respo[1]);
    }
  });
};

module.exports.creatSalesOrder = async (req, res, then) => {
  const data = req.body;
  var itemsDetail = [];
  console.log(data);
  await salesModle.addSalesOrder(data).then((respo) => {
    if (respo[0]) {
      res.status(200).json("Sales Request Added");
    } else {
      res.status(404).json({ error: respo[1] });
    }
  });

  console.log(itemsDetail);
};

module.exports.creatBulkSalesOrder = async (req, res, then) => {
  const data = req.body.form;
  const materials = req.body.cart;
  var itemsDetail = [];
  console.log(data);
  await salesModle.addSalesOrderBulk(data).then(async (respo) => {
    try {
      const responses = await salesModle.cartDetail(materials, respo[1]);
      const responses2 = await salesModle.paymentDetail(data, respo[1]);

      res.status(200).json("Sales Request Added");
    } catch (err) {
      res.status(404).json({ error: respo[1] });
    }

    // if (respo[0]) {
    //   res.status(200).json("Sales Request Added");
    // } else {
    // }
  });

  console.log(itemsDetail);
};

module.exports.showSalesOrder = (req, res, next) => {
  salesModle.showAllOrder().then((respo) => {
    res.status(200).json(respo);
  });
};

module.exports.salesBankStatments = (req, res, next) => {
  console.log(req.body.ID)
  salesModle.showBankStatment(req.body.ID).then((respo) => {
    res.status(200).json(respo);
  });
};


module.exports.showCartByID = async (req, res, next) => {
  try {
    const respo = await salesModle.showCartID(req.body.ID);
    console.log(respo);
    res.status(200).json(respo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.showSalesOrderById = (req, res, next) => {
  const uniqueId = req.body.ID;

  salesModle.fetchCartDetail(uniqueId).then((respo) => {
    res.status(200).json(respo);
  });
};

module.exports.selectSalesOrder = (req, res, next) => {
  console.log(req.body);
  salesModle.showSalesId(req.body.Id).then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(400).json(respo[1]);
    }
  });
};
