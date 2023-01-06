const accsMaterial = require("../../models/warehouse/accessoryModel");

exports.getAccessory = (req, res, next) => {
  accsMaterial.getallAccessory().then((result) => {
    console.log(result);
    res.status(200).json(result);
  });
};

exports.showByCatagory = (req, res, next) => {
  accsMaterial.showBYCatagory(req.body.Cat).then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      es.status(400).json(respo[1]);
    }
  });
};

exports.addAccessory = (req, res, next) => {
  console.log(req.body);
  accsMaterial.addAccessory(req.body).then((result) => {
    console.log(result);
    res.status(200).json(result);
  });
};

exports.UpdateAccessory = (req, res, next) => {
  console.log(req.body);
  accsMaterial
    .updatebyIDAccess(req.body.id, req.body.updated)
    .then((result) => {
      res.status(200).json(result);
    });
};
