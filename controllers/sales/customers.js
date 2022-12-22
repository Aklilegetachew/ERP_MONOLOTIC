const customers = require("../../models/sales/customersModel");

exports.addCustomers = (req, res, next) => {
  const newCustomers = req.body;

  customers.addNewCustomers(newCustomers).then((result) => {
    res.status(200).json("customer list updated");
  });
};

exports.showCustomers = (req, res, next) => {
  customers.showCustomer().then((result) => {
    res.status(200).json(result[1]);
  });
};
