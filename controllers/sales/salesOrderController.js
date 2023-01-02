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
      data.order_information.forEach(async (element) => {
        console.log(element);
        await salesModle.savetoCart(element, respo[1]).then(async (respons) => {
          await salesModle.sendtoWareHouse(element, respons[1]).then((ret) => {
            return;
          });
          ////////////////////////////////////////////////////////////
          // send to finance and production
        });
      });
      res.status(200).json("Sales Request Added");
    } else {
      res.status(404).json({ error: respo[1] });
    }
  });

  console.log(itemsDetail);
};

module.exports.showSalesOrder = (req, res, next) => {
  salesModle.showAllOrder().then((respo) => {
    res.status(200).json(respo);
  });
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
