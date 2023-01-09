const assetManagemnt = require("../../models/finance/assetManagemntModule");

exports.subAsset = (req, res, next) => {
  console.log(req.body);
  if (req.body.type == "ACCS") {
    assetManagemnt.subAssetaccs(req.body.data).then((respo) => {
      if (respo[0]) {
        res.status(200).json({ message: "sub to asset managment" });
      } else {
        res.status(400).json({ message: "added to asset managment" });
      }
    });
  } else {
    assetManagemnt.subAssetraw(req.body.data).then((respo) => {
      if (respo[0]) {
        res.status(200).json({ message: "sub to asset managment" });
      } else {
        res.status(400).json({ message: "added to asset managment" });
      }
    });
  }
};

exports.showAll = (req, res, next) => {
  assetManagemnt.showAllAssets().then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(400).json(respo[1]);
    }
  });
};

exports.addExpense = (req, res, next) => {
  assetManagemnt.addExpenseAll(req.body).then((respo) => {
    if (respo[0]) {
      res.status(200).json({ message: respo[1] });
    } else {
      res.status(400).json({ message: respo[1] });
    }
  });
};

exports.showExpense = (req, res, next) => {
  assetManagemnt.showExpenseCat(req.body).then((respo) => {
    if (respo[0]) {
      res.status(200).json({ message: respo[1] });
    } else {
      res.status(400).json({ message: respo[1] });
    }
  });
};

exports.showAllType = (req, res, next) => {
  assetManagemnt.showAssetsType(req.body.materialType).then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(400).json(respo[1]);
    }
  });
};
exports.addAsset = (req, res, next) => {
  assetManagemnt.addAsset(req.body).then((respo) => {
    if (respo[0]) {
      res.status(200).json({ message: "added to asset managment" });
    } else {
      res.status(400).json({ message: "added to asset managment" });
    }
  });
};
