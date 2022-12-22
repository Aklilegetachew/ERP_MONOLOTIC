const db = require("../../util/db");

module.exports = class customers {
  static addNewCustomers(customersData) {
    return db
      .execute(
        "INSERT INTO customers_list(customer_name, customer_phone, delivery_mode, customer_address) VALUES (?, ?, ?, ?)",
        [
          customersData.customer_name,
          customersData.customer_phone,
          customersData.delivery_model,
          customersData.customers_address,
        ]
      )
      .then((result) => {
        return "customer Added ";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static showCustomer() {
    return db
      .execute("SELECT * FROM customers_list")
      .then((result) => {
        return [true, result[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
};
