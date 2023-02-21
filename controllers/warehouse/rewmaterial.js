const rawMaterial = require("../../models/warehouse/rawMaterialModel");

exports.getMaterials = (req, res, next) => {
  rawMaterial.getallMaterials().then((result) => {
    console.log(result);
    res.status(200).json(result);
  });
};

exports.getMaterialsAll = (req, res, next) => {
  rawMaterial.getallMaterials().then((result) => {
    console.log(result);
    res.status(200).json(result);
  });
};


exports.getMaterialsbatch = (req, res, next) => {
  rawMaterial.getallMaterialsB().then((result) => {
    console.log(result);
    result.map((elem) => {
       elem.mat_quantity = "-"
    });
    res.status(200).json(result);
  });
};

exports.addMaterials = (req, res, next) => {
  console.log(req.body);
  rawMaterial
    .addRawMaterials(req.body)
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(result);
    });
};

exports.UpdateMaterials = (req, res, next) => {
  console.log(req.body);
  rawMaterial.updatebyIDRawM(req.body.id, req.body.updated).then((result) => {
    res.status(200).json(result);
  });
};
