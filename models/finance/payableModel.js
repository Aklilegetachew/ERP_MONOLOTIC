const { axios } = require("axios");
const db = require("../../util/db");
const salesAxios = require("../../midelware/salesaxios");

module.exports = class payableModel {
  static uniqueId() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  }

  static async makeComplete(salesID) {
    return true;

    // return await salesAxios
    //   .post("/makeComplete", { ID: salesID })
    //   .then((respo) => {
    //     return true;
    //   })
    //   .catch((err) => {
    //     return false;
    //   });
  }
  static async updateComplete(ID) {
    return await db
      .execute(
        "UPDATE account_recevable SET recevable_status = 'Cash' WHERE id = '" +
          ID +
          "'"
      )
      .then((respo) => {
        return [true, "COMPLETED"];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static showreason(id) {
    return db
      .execute("SELECT * FROM finacial_reason WHERE GENID= '" + id + "'")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static async stateReason(payableData) {
    const UNIQID = this.uniqueId();
    return await db
      .execute(
        "INSERT INTO finacial_reason(material_type, material_quantity, material_unit, material_desc, material_name, material_spec, GENID) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          payableData.new_materialtype || "FIN",
          payableData.new_quantity,
          payableData.new_materialunit,
          payableData.new_description,
          payableData.new_name,
          payableData.new_spec,
          UNIQID,
        ]
      )
      .then((res) => {
        return [true, UNIQID];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static showAll() {
    return db
      .execute("SELECT * FROM account_payable")
      .then((res) => {
        return [true, res[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async checkPayment(newData) {
    await db
      .execute("SELECT * FROM account_payable WHERE id = '" + newData.id + "'")
      .then((res) => {
        if (res[0].payable_status === "PAYED") {
          return false;
        } else {
          return true;
        }
      })
      .catch((err) => {
        return false;
      });
  }
  static showPayed(newData) {
    return db
      .execute("SELECT * FROM account_payable WHERE id = '" + newData.id + "'")
      .then((res) => {
        return res[0];
      })
      .catch((err) => {
        return err;
      });
  }
  static addingPayable(newData, reasonID) {
    return db
      .execute(
        "INSERT INTO account_payable(payable_name, payable_accountnum, payable_value, payable_person, payable_lastedate, payable_status, payable_reason, reason_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          newData.payable_name || "Production",
          newData.payable_account || "TIN NUM",
          newData.new_value || "Production",
          newData.personId || newData.personID || "",
          newData.payable_lastedate || "NO DEADLINE",
          newData.new_remark || "",
          newData.payable_name == null ? "PRODUCTION" : "PURCHASE",
          reasonID || "",
        ]
      )
      .then((res) => {
        return [true, "payable regestered"];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async makePayment(newData) {
    return await db
      .execute(
        "UPDATE account_payable SET payable_status = 'PAYED' WHERE id ='" +
          newData.id +
          "'"
      )
      .then((res) => {
        return [true, "Payed"];
      })
      .catch((err) => {
        return [false, err];
      });
  }
};
