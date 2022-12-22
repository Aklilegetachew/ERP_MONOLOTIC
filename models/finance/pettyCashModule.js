const db = require("../../util/db");

module.exports = class pettyCash {
  static addPettyCash(data) {
    return db
      .execute(
        "INSERT INTO pettycash(pay_for, cash_amount, pay_reason, accountatnt_name, payed_by, checked_by, recitNum) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          data.pay_for,
          data.cash_amount,
          data.pay_reason,
          data.accountatnt_name,
          data.payed_by,
          data.checked_by,
          data.recitNum,
        ]
      )
      .then((respo) => {
        return [true, "Petty Cash Added"];
      })
      .catch((err) => {
        console.log(err);
        return [false, err];
    
      });
  }

  static showPettyCash() {
    return db
      .execute("SELECT * FROM pettycash")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
};
