const salesStore = require("../../models/sales/salesStoreModel");
const axios = require("axios");

exports.confirmRelease = (req, res, then) => {
  const materialRec = req.body;

  salesStore.addSalesStore(materialRec).then((response) => {});
};

exports.makeComplete = (req, res, then) => {
  const salesID = req.body.ID;

  salesStore.completeSales(salesID).then((response) => {
    if (response[0]) {
      res.status(200).json({ message: "Sales Updated" });
    } else {
      console.log(response[1]);
      res.status(400).json({ message: "Sales Updated Err" });
    }
  });
};

exports.deleteSalesOrder = (req, res, then) => {
  const salesID = req.body.ID;

  salesStore.DeleteSales(salesID).then((response) => {
    if (response[0]) {
      res.status(200).json({ message: "Sales Deleted" });
    } else {
      console.log(response[1]);
      res.status(400).json({ message: "Sales Updated Err" });
    }
  });
};

exports.makeSales = (req, res, then) => {
  console.log(req.body);
  const soldItem = req.body.data;
  if (soldItem.status == "SALE") {
    salesStore.MakeSold(soldItem).then((respo) => {
      res.status(200).json({ message: "Item Sold" });
    });
  } else {
    salesStore.makeHold(soldItem);
    res.status(200).json({ message: "Item Hold" });
  }
};

exports.AcceptSales = async (req, res, then) => {
  console.log(req.body);
  const respo = await salesStore.accptSales(req.body.ID);

  const getOrder = await salesStore.getsalesbyID(req.body.ID);

  const gmakeordertosales = await salesStore.postOrder(getOrder[0]);

  const rawmatRequest = await salesStore.rawMaterialRequest(getOrder[0]);

  if (respo == false || gmakeordertosales == false || rawmatRequest == false) {
    res.status(400).json({ message: "something went wrong" });
  } else {
    res.status(200).json({ message: "sales Accepted" });
  }
};

exports.AcceptBulkSales = async (request, response) => {
  const { ID } = request.body;
  console.log(ID);

  try {
    const salesAccepted = await salesStore.accptSales(ID);
    const sales = await salesStore.getsalesbyID(ID);
    const products = await salesStore.getProductList(ID);

    const order = sales[0];
    const ordersCreated = await Promise.all(
      products.map((product) => salesStore.postOrder({ ...order, product }))
    );
    const rawMaterialsRequested = await Promise.all(
      products.map((product) =>
        salesStore.rawMaterialRequest({ ...order, product })
      )
    );

    const isError =
      !salesAccepted ||
      ordersCreated.includes(false) ||
      rawMaterialsRequested.includes(false);
    if (isError) {
      response.status(400).json({ message: "Something went wrong" });
    } else {
      response.status(200).json({ message: "Sales accepted" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
};

exports.requestFinishedGood = async (req, res, then) => {
  console.log(req.body);
  const rawmatRequest = await salesStore.finishedRequest(req.body);

  if (rawmatRequest == false) {
    res.status(400).json({ message: "something went wrong" });
  } else {
    res.status(200).json({ message: "sales Accepted" });
  }
};
