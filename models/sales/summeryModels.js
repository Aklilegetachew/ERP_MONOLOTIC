const db = require("../../util/db");

module.exports = class salesSummery {
  static allSummery() {
    return db
      .execute("SELECT * FROM sales_summery")
      .then((respo) => {
        return respo[0];
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
