const { default: axios } = require("axios");
const db = require("../../util/db");
const salesAxios = require("../../midelware/salesaxios");
const salesModle = require("../sales/salesOrder");

module.exports = class accountRecivable {
  static async getProductionCost() {
    return db
      .execute(
        "SELECT production_order.*, custome_batch.raw_mat_needed, cost_summery.*, custome_batch.id AS CID FROM production_order, cost_summery, custome_batch WHERE cost_summery.cost_status = 'Approved' AND production_order.custom_batch_id = custome_batch.custom_batch_id AND production_order.custom_batch_id = cost_summery.production_id"
      )
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static async confirmGenerated(salesID) {
    return db
      .execute("UPDATE sales_order_prod SET profitGenerated = 1 WHERE id = ?", [
        salesID,
      ])
      .then((respo) => {
        return [true, "Profit Done"];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static async fetchSalesInfo(data) {
    console.log("datas to use", data);
    return await db
      .execute("SELECT * FROM sales_order_prod WHERE id = ?", [data.salesID])
      .then((respo) => {
        return [true, respo[0][0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async getsalesProfit() {
    return await db
      .execute(
        "SELECT sales_order_prod.*, sales_order_prod.id AS SID, dashboard_profit.* FROM sales_order_prod, dashboard_profit WHERE sales_order_prod.id = dashboard_profit.salesID"
      )
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async ProfitStore(salesInfo, costInfo, dataSubmited, profit) {
    console.log("inputs", dataSubmited);
    console.log("profit", profit);
    console.log("salesI", salesInfo);
    console.log("cost", costInfo);

    return await db
      .execute(
        "INSERT INTO dashboard_profit (salesID, producedId, total_sales, profit, vat) VALUES (?, ?, ?, ?, ?)",
        [
          dataSubmited.salesID,
          costInfo.production_id,
          salesInfo.totalCash,
          profit,
          dataSubmited.VAT,
        ]
      )
      .then((respo) => {
        return [true, "PROFIT GENERATED"];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static async fetchCostSummery(data) {
    console.log("datas to use", data);
    return await db
      .execute("SELECT * FROM cost_summery WHERE cost_id = ?", [data.costId])
      .then((respo) => {
        return [true, respo[0][0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static uniqueId() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  }

  static async getsalesOrder(ID) {
    return await db
      .execute("Select * From sales_order_prod WHERE id = '" + ID + "'")
      .then((respo) => {
        return [true, respo[0][0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async updateComplete(data, salesOrder) {
    var advance = 0.0;
    var newBalance = 0.0;
    var oldbalance = 0.0;
    var newadvance = 0.0;
    console.log(salesOrder);
    // { remaining: '456', ID: '5' }  totalCash advances
    if (salesOrder.status == "Advanced") {
      advance = parseFloat(salesOrder.advances);
      oldbalance =
        parseFloat(salesOrder.totalCash) - parseFloat(salesOrder.advances);
      newBalance = oldbalance - parseFloat(data.remaining);
      newadvance = parseFloat(advance) + parseFloat(data.remaining);
    } else if (salesOrder.status == "Credit") {
      oldbalance =
        parseFloat(salesOrder.totalCash) - parseFloat(salesOrder.advances);
      newBalance = oldbalance - parseFloat(data.remaining);
      newadvance = parseFloat(data.remaining);
    }

    console.log("Advance", advance);
    console.log("newBalance", newBalance);
    console.log("oldbalance", oldbalance);
    console.log("newadvance", newadvance);

    // var newBalance = 0.0;
    // var oldbalance = 0.0;
    // var newadvance = 0.0;

    if (newBalance !== 0) {
      return await db
        .execute(
          "UPDATE sales_order_prod SET advances = '" +
            newadvance +
            "', balance = '" +
            newBalance +
            "' WHERE id = '" +
            data.ID +
            "'"
        )
        .then((respo) => {
          return [true, "COMPLETED"];
        })
        .catch((err) => {
          return [false, err];
        });
    } else {
      return await db
        .execute(
          "UPDATE sales_order_prod SET status = 'Cash' WHERE id = '" +
            data.ID +
            "'"
        )
        .then((respo) => {
          return [true, "Updated"];
        })
        .catch((err) => {
          return [false, err];
        });
    }
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

  static async showsalesProdOrderPro() {
    return await db
      .execute("SELECT * FROM sales_order_prod WHERE profitGenerated = 0")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async showsalesProdOrderID(ID) {
    return await db
      .execute(
        "SELECT sales_order_prod.*, sales_order_prod.id AS SID, dashboard_profit.* FROM sales_order_prod, dashboard_profit WHERE sales_order_prod.id = ? AND dashboard_profit.salesID = ?",
        [ID, ID]
      )
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
        console.log("err", err);
        return [false, err];
      });
  }
};
