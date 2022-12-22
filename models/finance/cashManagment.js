const db = require("../../util/db");

module.exports = class cashManagment {
  static async addtoPayable(newData) {
    await db
      .execute(
        "UPDATE cash_manag SET asset_value = asset_value + '" +
          newData.payable_value +
          "'"
      )
      .then((res) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  }
};
