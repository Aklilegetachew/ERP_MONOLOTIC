const requestModule = require("../../models/sales/requestModel");

module.exports.finishedMaterialRequest = (req, res, then) => {
  var enclosingArray = [];
  const requestedMaterials = req.body;
  if (Array.isArray(requestedMaterials)) {
    requestModule.addRequest(requestedMaterials).then((respo) => {
      requestModule.addtoLocalRequest(requestedMaterials).then((result) => {
        res.status(200).json({ message: result });
      });
    });
  } else {
    enclosingArray.push(requestedMaterials);
    requestModule.addRequest(enclosingArray).then((result) => {
      requestModule.addtoLocalRequest(requestedMaterials).then((result) => {
        res.status(200).json({ message: result });
      });
    });
  }
};

module.exports.showStatus = (req, res, then) => {
  requestModule.showrecivedItems().then((respo) => {
    res.status(200).json(respo);
  });
};
