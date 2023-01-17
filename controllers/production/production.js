const { json } = require("body-parser");
const { response } = require("express");
const productionModel = require("../../models/Production/productionModel");
const { setTimeout } = require("timers/promises");

exports.deleteOrder = async (req, res, next) => {
  const result = await productionModel.deleteOrderGM(req.body);
  if (result) {
    const result2 = await productionModel.deleteOrder(req.body);
    if (result2) {
      res.status(200).json({ message: "deleted" });
    } else {
      res.status(400).json({ message: "Production order deleted" });
    }
  } else {
    res.status(400).json({ message: "GM Production order deleted" });
  }
};

exports.editBatch = async (req, res, next) => {
  // step 1: Adding new production order with new Status

  productionModel.updateStateProduction(req.body).then(async (result) => {
    if (result) {
      res.status(200).json("Batch Edited");
    } else {
      res.status(400).json("error");
    }
  });

  // step 2:  add production batch formula

  // step 3: production order cost

  // step 4: old production order into Finished status
};

exports.addNewproductionOrder = (req, res, next) => {
  console.log("Incomming data", req.body);
  productionModel.addproductionOrder(req.body).then(async (result) => {
    if (result[0]) {
      const ChangeStatus = await productionModel.GMStatus(req.body);

      const makeBatchCosts = await productionModel.makeBatchCost(result[1]);
      const filteredData = makeBatchCosts.filter((d) => d.mat_quantity !== "-");

      const costCalculated = await productionModel.calculateCost(
        filteredData,
        result[1] || "",
        req.body.FS_NUMBER
      );

      // costCalculated returns [totalperone, totalValue, totalMass]

      const massperFin = await productionModel.fetchFinMass(
        req.body.fin_product,
        req.body.finished_materialcode,
        req.body.final_color,
        req.body.finished_diameter
      );
      const costSummery = await productionModel.saveCostDetail(
        costCalculated,
        massperFin,
        result[1]
      );

      res.status(200).json(costSummery[1]);
    } else {
      res.status(400).json(result[1]);
    }
  });
};

exports.rawMaterialRequest = (req, res, next) => {
  const materials = req.body[0];
  const batchID = req.body[1];
  const FsNumber = req.body[2];
  var status = false;
  console.log(materials);
  res.status(200).json("Good");
  materials.forEach((element) => {
    productionModel
      .addrawMaterialRequest(element, FsNumber, batchID)
      .then((result) => {
        status = result[0];
      });
  });

  if (status) {
    res.status(200).json(result[1]);
  } else {
    res.status(400).json(result[1]);
  }
};

exports.showrawMaterialRequest = (req, res, next) => {
  productionModel.showrawMaterialRequest().then((result) => {
    if (result[0]) {
      res.status(200).json(result[1]);
    } else {
      res.status(400).json(result[1]);
    }
  });
};

exports.resporawMaterialRequest = (req, res, next) => {
  const status = req.status;
  const id = request.id;

  if (status == "ACCEPT") {
  } else {
  }
};

exports.showProductionGM = (req, res, next) => {
  productionModel.showallProductionGM().then((result) => {
    if (result[0]) {
      res.status(200).json(result[1]);
    } else {
      res.status(400).json(result[1]);
    }
  });
};

exports.showProductionGMID = (req, res, next) => {
  productionModel.showallProductionGMID(req.body.id).then((result) => {
    if (result[0]) {
      res.status(200).json(result[1]);
    } else {
      res.status(400).json(result[1]);
    }
  });
};

exports.addProductiionGM = (req, res, next) => {
  productionModel.addproductionOrderGM(req.body).then((result) => {
    if (result[0]) {
      res.status(200).json(result[1]);
    } else {
      res.status(400).json(result[1]);
    }
  });
};

exports.showFinishedProduction = (req, res, next) => {
  productionModel.showFinished().then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(406).json({ err: respo[1] });
    }
  });
};

exports.summeryMaker = (req, res, next) => {
  productionModel.addSummery(req.body).then((result) => {
    res.status(200).json({ message: result });
  });
};

exports.productFinshed = async (req, res, next) => {
  // make sure to add som values by defualt in the front end
  // console.log(req.body)
  var rawWithValue = [];
  productionModel.completeOrder(req.body).then(async (result) => {
    if (result[0] == false) {
      res.status(403).json({ message: "error requesting" });
    } else {
      const respo = await productionModel.sendtoWareHouse(req.body);

      const resu = await productionModel.makeFinished(req.body);
      const BatchNum = await productionModel.UpdateBatchNumber(req.body);
      if (BatchNum) {
        res.status(200).json({ message: "submitted Sucessfully " });
      } else {
        res.status(403).json({ message: "error requesting" });
      }
      // const rawUsed = await productionModel.fetchRawMatused(req.body.salesID);
      // const massperFin = await productionModel.fetchFinMass(
      //   req.body.new_name,
      //   req.body.new_description
      // );
      // materialUsed = JSON.parse(rawUsed[1][0].raw_mat_needed);
      // var totalcostofRawMaterial = 0.0;
      // var rawmaterialTotal = 0.0;
      // var costperOneGram = 0.0;
      // var otherCost = 0.0;
      // var costofoneFin = 0.0;
      // var costofTotalOrder = 0.0;
      // var salesProfit = 0.0;

      // if (rawUsed[0]) {
      //   for (singleBody of materialUsed) {
      //     const respon = await productionModel.rawMaterialsdetail(singleBody);
      //     rawWithValue.push(respon[1]);
      //     totalcostofRawMaterial += respon[1].costPerMaterial;
      //     rawmaterialTotal += parseFloat(respon[1].mat_quantity);
      //     // var costPerMaterial = parseFloat(materialdatas.value) * parseFloat(materialdatas.mat_quantity)
      //     const avedMark = await productionModel.rawMaterialscost(
      //       respon[1],
      //       req.body
      //     );
      //   }

      //   const salesInfo = await productionModel.fetchSalesInfo(
      //     req.body.salesID
      //   );

      //   costperOneGram =
      //     (totalcostofRawMaterial) / rawmaterialTotal;

      //   //// add vat if needed
      //   otherCost = (costperOneGram * parseFloat(massperFin)) * 0.15;
      //   costofoneFin = (costperOneGram * parseFloat(massperFin))+ otherCost;

      //   costofTotalOrder = parseFloat(salesInfo.total_product) * costofoneFin;
      //   salesProfit = parseFloat(salesInfo.totalCash) - costofTotalOrder;

      //   rawWithValue.push({
      //     totalcostofRawMaterials: totalcostofRawMaterial,
      //     rawmaterialTotalQty: rawmaterialTotal,
      //     costperOneGramraw: costperOneGram,
      //     finGoodMass: massperFin,
      //     otherCosts: otherCost,
      //     costofoneFins: costofoneFin,
      //     qtyorderdProduct: salesInfo.total_product,
      //     salesTotal: salesInfo.totalCash,
      //     profit: salesProfit,
      //     salesId: req.body.salesID,
      //     ProductID: req.body.prodID,
      //   });

      //   //////////////////////////////////////// DO THE POFIT from profit* dashboard profit here
      //   const salesProfitFinance = await productionModel.saveProfitInfo(
      //     rawWithValue
      //   );

      //   if (salesProfitFinance[0]) {
      //     res.status(200).json({ Message: "Profit Calculated" });
      //   } else {
      //     res.status(400).json({ Message: salesProfitFinance[1] });
      //   }
      //   console.log("hell", rawWithValue);
      // }

      ///////// for now
    }
  });
};

// step 1 fetch the raw material used

// step 3 calculate the price per batch

// step 2 fetch the raw material value

exports.startProduction = async (req, res, next) => {
  const productionStatus = req.body.status;
  const productionId = req.body.id;
  const personId = req.body.userName;
  // console.log(productionStatus);
  if (productionStatus == "START") {
    // select the order

    const selectedResult = await productionModel.selectOrder(productionId);
    // select and send the raw material to warehouse
    if (selectedResult[0]) {
      if (selectedResult[0]) {
        const respoStatus = await productionModel.statusStarted(productionId);
        const approvedBatch = await productionModel.AprovePMSubmit(
          selectedResult[1][0]
        );
        const AproveBatchCost = await productionModel.AproveBatchCost(
          selectedResult[1][0]
        );
        if (AproveBatchCost) {
          res.status(200).json({ message: "Started !" });
        } else {
          res.status(428).json({ message: "update status error" });
        }
      } else {
        res.status(428).json({ message: "error making raw material request" });
      }
    } else {
      res.status(428).json({ message: "cant found the order to start" });
    }

    // finish the production order
  } else if (productionStatus == "END") {
    productionModel.statusEnd(productionId).then((result) => {
      if (result[0]) {
        res.status(200).json(result[1]);
      } else {
        res.status(200).json(result[1]);
      }
    });
  }

  // make report and summery and status Finished
};

exports.showproductionOrder = async (req, res, next) => {
  const fromReg = [];
  const fromCus = [];
  const cusArray = await productionModel.showProductionOrderCustom();
  console.log("all", cusArray);
  res.status(200).json(cusArray);
};
