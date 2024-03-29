const finishedGood = require("../../models/warehouse/finishedModule");

exports.getFinished = (req, res, next) => {
  finishedGood.getallFinished().then((result) => {
    console.log(result);
    res.status(200).json(result);
  });
};

exports.getFinishedByCat = (req, res, next) => {
  finishedGood.getallFinishedCat(req.body.Cat, req.body.Spec).then((result) => {
    console.log(result,"ressssssssssssssssssss");
    res.status(200).json(result);
  });
};

exports.addFinished = (req, res, next) => {
  console.log(req.body);
  finishedGood.addFinishedMat(req.body).then((result) => {
    console.log(result);
    res.status(200).json(result);
  });
};

exports.UpdateFinished = (req, res, next) => {
  console.log(req.body);
  finishedGood
    .updatebyIDFinished(req.body.id, req.body.updated)
    .then((result) => {
      res.status(200).json(result);
    });
};

exports.UpdateFinishedSummery = (req, res, next) => {
  console.log(req.body);
  finishedGood
    .UpdateFinishedSummery(req.body.matId, req.body.summery)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "error" });
    });
};

exports.DeleteFinishedSummery = (req, res, next) => {
  console.log(req.body);
  
  finishedGood
    .DeleteFinishedSummery(req.body.matId, req.body.summery)
    .then((result) => {
      res.status(200).json({ message: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err });
    });
};


exports.updateFinishgoods = (req, res, next) => {

  finishedGood
    .updateFinishgoodsModule(req.body.id, req.body.data)
    .then((result) => {
      res.status(200).json({ message: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err });
    });
};
