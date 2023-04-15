const summeryClass = require("../../models/warehouse/summeryModel");

exports.showById = (req, res, next) => {
  console.log(req.body);
  summeryClass
    .viewSummery(req.body.id, req.body.materialType)
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    });
};

exports.showByIdMonth = async (req, res, next) => {
  console.log(req.body);
  const result = await summeryClass.viewSummeryMonth(
    req.body.id,
    req.body.materialType,
    req.body.selectedDate,
    req.body.selectedYear
  );
  console.log(result);
  res.status(200).json(result);
};

exports.showBysalesByMonth = async (req, res, next) => {
  console.log(req.body);
  const result = await summeryClass.viewSalesMonth(req.body.selectedDate);
  console.log(result);
  res.status(200).json(result);
};

exports.showByBankByMonth = async (req, res, next) => {
  console.log(req.body);
  const result = await summeryClass.viewBankMonth(req.body.selectedDate);
  console.log(result);
  res.status(200).json(result);
};

exports.showByIdExpense = async (req, res, next) => {
  console.log(req.body);
  const result = await summeryClass.viewExpenseByMonth(
    req.body.id,
    req.body.materialType,
    req.body.selectedDate,
    req.body.selectedYear
  );
  console.log(result);
  res.status(200).json(result);
};

exports.showExpensesMontly = async (req, res, next) => {
  console.log(req.body);
  const result = await summeryClass.viewExpenseCurrentMonth();
  console.log(result);
  res.status(200).json(result);
};

exports.showByIdYear = async (req, res, next) => {
  console.log(req.body);
  const result = await summeryClass.viewSummeryYear(
    req.body.id,
    req.body.materialType,
    req.body.selectedYear
  );

  res.status(200).json(result);
};

exports.showByType = async (req, res, next) => {
  console.log(req.body);
  const result = await summeryClass.viewType(req.body.materialType);

  res.status(200).json(result);
};

exports.deleteStockSummery = async (req, res, next) => {
  console.log(req.body);
  const result = await summeryClass.deleteSummery(req.body.id);

  res.status(200).json(result);
};
