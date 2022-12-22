const { default: axios } = require("axios");
const db = require("../../util/db");
const salesAxios = require("../../midelware/salesaxios");
const salesModle = require("../sales/salesOrder");

module.exports = class accountRecivable {
  static uniqueId() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  }

  static async showsalesProdOrder() {
    return await db
      .execute("SELECT * FROM sales_order_prod")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async showsalesProdOrderID(ID) {
    return await db
      .execute("SELECT * FROM sales_order_prod WHERE id = '" + ID + "'")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static showall() {
    return db
      .execute("SELECT * FROM account_recevable")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async addtoReason(materialData) {
    const GID = this.uniqueId();
    return db
      .execute(
        "INSERT INTO finacial_reason(material_type, material_quantity, material_unit, material_desc, material_name, material_spec, GENID)VALUES(?, ?, ?, ?, ?, ?, ?)",
        [
          materialData.req_materialtype,
          materialData.mat_quantity,
          materialData.mat_unit,
          materialData.mat_description,
          materialData.mat_requestname,
          materialData.mat_spec,
          GID,
        ]
      )
      .then((respo) => {
        return GID;
      });
  }

  static async addtoReasonrequ(materialData) {
    console.log("material Data", materialData);
    const GID = this.uniqueId();
    return db
      .execute(
        "INSERT INTO finacial_reason(material_type, material_quantity, material_unit, material_desc, material_name, material_spec, GENID)VALUES(?, ?, ?, ?, ?, ?, ?)",
        [
          materialData.materialtype,
          materialData.fin_quantity,
          materialData.mat_unit || "Kg",
          materialData.fin_description,
          materialData.fin_name,
          materialData.mat_spec || "Spoecification",
          GID,
        ]
      )
      .then((respo) => {
        return GID;
      });
  }
  static async selectfromSales(newData) {
    return await salesModle.showSalesId(newData).then((respo) => {
      if (respo[0]) {
        console.log("sales", respo[1]);
        return respo[1];
      } else {
        console.log(respo[1]);
        return respo[1];
      }
    });
    // return await salesAxios
    //   .post("/selectSalesOrder", { Id: newData })
    //   .then((respo) => {
    //     return respo.data[0];
    //   })
    //   .catch((err) => {
    //     return err;
    //   });
  }

  static async addToRecivable(salesData, GID, salesID) {
    console.log("sales2", salesData);
    console.log("GID2", GID);
    console.log("salesID", salesID);

    return await db
      .execute(
        "INSERT INTO account_recevable(recevable_name, recevable_tin, recevable_amount, recevable_status, recivable_stdate, recevable_endate, reason, reasonID, salesID)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          salesData.customer_name || "gyugu",
          salesData.cust_tinNumber || "9780",
          salesData.paymentTotal || "688",
          salesData.payment_status || "new",
          salesData.order_date || "09-09-2000",
          "2022-12-15T21:00:00.000Z ",
          " FINSHED ",
          GID,
          salesID || "",
        ]
      )
      .then((resp) => {
        console.log("GID", resp);
        return [true, GID];
      })
      .catch((err) => {
        console.log("errrrrrrrrrrrrrrrr", err);
        return [false, err];
      });
  }
};
