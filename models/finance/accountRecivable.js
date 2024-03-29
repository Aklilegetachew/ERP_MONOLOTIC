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

  static async deleteBatchCost(data) {
    return db
      .execute(
        "UPDATE cost_summery SET cost_status = 'OLD' WHERE 	cost_id = ?",
        [data.cost_id]
      )
      .then((respo) => {
        return [true, "DELETED"];
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
  static async deleteOldGenerated(ProfitID) {
    return db
      .execute("DELETE FROM dashboard_profit WHERE id = ?", [ProfitID])
      .then((respo) => {
        return [true, "Profit Update"];
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

  static async ProfitStore(salesInfo, costInfo, dataSubmited, profit, GID) {
    console.log("inputs", dataSubmited);
    console.log("profit", profit);
    console.log("salesI", salesInfo);
    console.log("cost", costInfo);

    return await db
      .execute(
        "INSERT INTO dashboard_profit (salesID, producedId, total_sales, profit, vat) VALUES (?, ?, ?, ?, ?)",
        [
          dataSubmited.salesID,
          GID,
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
    return await db
      .execute("SELECT * FROM cost_summery WHERE cost_id = ?", [data.costId])
      .then((respo) => {
        return [true, respo[0][0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async fetchCostDetail(data) {
    return await db
      .execute("SELECT * FROM production_cost WHERE production_id = ?", [
        data.production_id,
      ])
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async UpdateCostSummery(data, GID, newMass) {
    console.log("updatesCost summery", data);

    var newCostofProduct = parseFloat(data.oneKgCost) * parseFloat(newMass);
    var newOtherCost = parseFloat(newCostofProduct) * 0.15;
    var totalCost = newCostofProduct + newOtherCost;
    try {
      await db.execute(
        "INSERT INTO cost_summery(production_id, total_raw_cost, total_mass, oneKgCost, oneFinCost, other_cost, finished_mass, quantityProduced, cost_status, finishedWVat, batchNum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          GID,
          data.total_raw_cost,
          data.total_mass,
          data.oneKgCost,
          newCostofProduct.toFixed(2),
          newOtherCost.toFixed(2),
          newMass,
          data.quantityProduced,
          data.cost_status,
          totalCost.toFixed(2),
          data.batchNum,
        ]
      );
      return [true, totalCost];
    } catch (err) {
      return [false, err];
    }
  }

  static async UpdateCostDetail(datas, GID) {
    console.log("updatesCost Detail");
    try {
      for (let i = 0; i < datas.length; i++) {
        const data = datas[i];
        await db.execute(
          "INSERT INTO production_cost(production_id, fs_num, raw_name, raw_materialcode, each_value, each_total, totalValue, valueper1kg, totalmass, date_rec, each_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            GID,
            data.fs_num,
            data.raw_name,
            data.raw_materialcode,
            data.each_value,
            data.each_total,
            data.totalValue,
            data.valueper1kg,
            data.totalmass,
            data.date_rec,
            data.each_quantity,
          ]
        );
      }
      return [true, GID];
    } catch (err) {
      console.log(err);
      return [false, err];
    }
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

  static async getnewsalesOrder(ID) {
    return await db
      .execute("Select * From sales_order WHERE id = '" + ID + "'")
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
          "UPDATE sales_order_prod SET advances = ?, balance = ?, status = 'Advanced' WHERE id = ?",
          [newadvance, newBalance, data.ID]
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
          "UPDATE sales_order_prod SET advances = ?, status = 'Cash' WHERE id = ?",
          [newadvance, data.ID]
        )
        .then((respo) => {
          return [true, "Updated"];
        })
        .catch((err) => {
          return [false, err];
        });
    }
  }

  // static async updateBankComplete(data, salesOrder) {
  //   var oldRemaing = parseFloat(salesOrder.cust_remaining);
  //   var oldAdvance = parseFloat(salesOrder.cus_advance);
  //   var NewPaymet = parseFloat(data.newPayment);
  //   var newAdvance = oldAdvance + NewPaymet;

  //   if (NewPaymet > oldRemaing) {
  //     return [false, "Excceding total payment"];
  //   }
  //   var newRemaing = oldRemaing - NewPaymet;

  //   if (newRemaing !== 0) {
  //     return await db
  //       .execute(
  //         "UPDATE sales_order SET cus_advance = ?, cust_remaining = ?, payment = 'Advanced' WHERE id = ?",
  //         [newAdvance, newRemaing, data.ID]
  //       )
  //       .then(async (respo) => {
  //         await db
  //           .execute(
  //             "INSERT INTO bank_status(bank_name, bank_account, remaining_amount, sales_id, remaining, payed_amount) VALUES (?, ?, ?, ?, ?, ?)",
  //             [
  //               data.bankName,
  //               data.bankAccount,
  //               newRemaing,
  //               data.ID,
  //               newRemaing,
  //               NewPaymet,
  //             ]
  //           )
  //           .then((respo) => {
  //             return [true, "Payment Updated"];
  //           })
  //           .catch((err) => {
  //             console.log("response", err);
  //             return [false, err];
  //           });
  //       })
  //       .catch((err) => {
  //         return [false, err];
  //       });
  //   } else {
  //     return await db
  //       .execute(
  //         "UPDATE sales_order SET cus_advance = ?, payment = 'Cash' WHERE id = ?",
  //         [remaining, data.ID]
  //       )
  //       .then(async (respo) => {
  //         await db
  //           .execute(
  //             "INSERT INTO bank_status(bank_name, bank_account, remaining_amount, sales_id, remaining, payed_amount) VALUES(?, ?, ?, ?, ?, ?)",
  //             [
  //               data.bankName,
  //               data.bankAccount,
  //               newRemaing,
  //               data.ID,
  //               newRemaing,
  //               NewPaymet,
  //             ]
  //           )
  //           .then((respo) => {
  //             return [true, "Payment Updated"];
  //           })
  //           .catch((err) => {
  //             return [false, err];
  //           });
  //       })
  //       .catch((err) => {
  //         return [false, err];
  //       });
  //   }
  // }

  static async updateBankComplete(data, salesOrder) {
    const oldRemaining = parseFloat(salesOrder.cust_remaining);
    const oldAdvance = parseFloat(salesOrder.cus_advance);
    const newPayment = parseFloat(data.newPayment);
    const newAdvance = oldAdvance + newPayment;

    if (newPayment > oldRemaining) {
      return [false, "Exceeding total payment"];
    }

    const newRemaining = oldRemaining - newPayment;
    const paymentType = newRemaining !== 0 ? "Advanced" : "Cash";

    try {
      const [salesUpdateResult] = await db.execute(
        "UPDATE sales_order SET cus_advance = ?, cust_remaining = ?, payment = ? WHERE id = ?",
        [newAdvance, newRemaining, paymentType, data.ID]
      );

      const [bankStatusInsertResult] = await db.execute(
        "INSERT INTO bank_status(bank_name, bank_account, remaining_amount, sales_id, remaining, payed_amount) VALUES (?, ?, ?, ?, ?, ?)",
        [
          data.bankName,
          data.bankAccount,
          newRemaining,
          data.ID,
          newRemaining,
          newPayment,
        ]
      );

      return [true, "Payment updated"];
    } catch (error) {
      console.log(error);
      return [false, error.message];
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
