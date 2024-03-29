const storeRequestion = require("../../models/warehouse/storeRequstionModel");
const accsMat = require("../../models/warehouse/accessoryModel");
const rawMat = require("../../models/warehouse/rawMaterialModel");
const finMat = require("../../models/warehouse/finishedModule");
const receivedModule = require("../../models/warehouse/recievedMatModules");

exports.showStoreReq = (req, res, next) => {
  console.log(req.body);
  storeRequestion.showRequstion().then((result) => {
    res.status(200).json(result);
  });
};

exports.responseStoreReq = (req, res, next) => {
  const singBody = req.body;
  var purchaseMaterials = [];
  var declinedMats = [];

  // bodyRec.forEach((singBody) => {
  if (req.body.status == "Accept") {
    storeRequestion.acceptRecived(singBody.id).then((result) => {
      if (typeof result === "string") {
        return result;
      } else {
        if (result.materialtype == "ACCS") {
          accsMat
            .checkExisAccsM(result.accs_name, result.material_type, result)
            .then(async (found) => {
              if (found[0]) {
                const response = await accsMat.subAccsQty(found[1], result);
                if (response == "summery_Updated") {
                  storeRequestion.financeSubAsset(result, "ACCS");
                  storeRequestion.makeAccept(singBody.id);
                  res.status(200).json({
                    message: "items Updated",
                  });
                } else {
                  res.status(200).json({
                    message: "low_stock",
                  });
                }
              } else {
                console.log("Not Found" + result);
                purchaseMaterials.push(result);
                res.status(200).json({
                  message: "no_material",
                  materials: purchaseMaterials,
                });
              }
            });
        } else if (result.materialtype == "RAW") {
          rawMat
            .checkExisRawM(result.raw_name, result.material_type, result)
            .then(async (found) => {
              if (found[0]) {
                const response = await rawMat.subQty(found[1], result);
                if (response === "summery_Updated") {
                  storeRequestion.financeSubAsset(result, "RAW");
                  storeRequestion.makeAccept(singBody.id);
                  res.status(200).json({
                    message: response,
                  });
                } else {
                  res.status(200).json({
                    message: response,
                  });
                }
              } else {
                purchaseMaterials.push(result);
                res.status(200).json({
                  message: "no_material",
                  materials: purchaseMaterials,
                });
              }
            });
        } else if (result.materialtype == "FIN") {
          // console.log(result)
          finMat
            .checkExisFinM(result.fin_name, result.material_type, result)
            .then(async (found) => {
              // console.log(found)
              if (found[0]) {
                const response = await finMat.subQty(found[1], result);
                // console.log(response);
                if (response === "summery_Updated") {
                  // const fromFinanac = await storeRequestion.financeRecevable(
                  //   result
                  // );
                  // console.log("ppppp", fromFinanac);
                  storeRequestion.makeAccept(singBody.id);
                  res.status(200).json({
                    message: response,
                  });
                } else {
                  res.status(202).json({
                    message: response,
                  });
                }
              } else {
                console.log("Not Found" + result);
                purchaseMaterials.push(result);
                res.status(200).json({
                  message: "no_material",
                  materials: purchaseMaterials,
                });
              }
            });
        }
      }
    });
  } else {
    receivedModule.declineRequest(singBody.id).then((result) => {
      res.status(200).json({
        message: "Item requestion declined",
        declinedMat: declinedMats,
      });
    });
  }
};

exports.addrequestion = (req, res, next) => {
  var resultArray = [];
  const reqestedMaterials = req.body.material;
  console.log(reqestedMaterials);

  storeRequestion.addstoreRequestion(reqestedMaterials).then((result) => {
    if (result == false) {
      resultArray.push(result);
    }
  });

  if (resultArray.length == 0) {
    res.status(200).json("STORE REQUEST ADDED");
  } else {
    res.status(400).json("STORE REQUEST ERROR");
  }
};

exports.addaccsrequestion = (req, res, next) => {
  storeRequestion.addstoreRequestionAccs(req.body).then((result) => {
    if (result == false) {
      res.status(400).json("STORE REQUEST ERROR");
    }else
    {
      res.status(200).json("STORE REQUEST ADDED");
    }
  });
};
