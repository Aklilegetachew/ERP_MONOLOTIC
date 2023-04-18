const db = require("../../util/db");
const axios = require("axios");
const wareAxios = require("../../midelware/warehouseaxios");
const storeRequestion = require("../warehouse/storeRequstionModel");

module.exports = class salesOrder {
  static uniqueId() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  }

  static addProductionSales(data) {
    const advances = "";
    return db
      .execute(
        "INSERT INTO sales_order_prod(customer_name, customer_address, customer_tin, product_orderd, product_color, product_desc, product_spec, total_product, mou, totalCash, status, advances, salesId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.customer_name,
          data.customer_address,
          data.Tin_number,
          data.final_product,
          data.final_color,
          data.final_desc,
          data.final_spec,
          data.final_quant,
          data.final_measureunit,
          data.cus_total,
          data.payment,
          data.cus_advance || "",
          data.salesID,
        ]
      )
      .then((respo) => {
        return [true, "Production order added"];

        return db
          .execute(
            "INSERT INTO productionordergm(final_product, final_spec, final_desc, final_quant, final_measureunit, order_reciver, final_color, final_status, salesID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              data.final_product,
              data.final_spec,
              data.final_desc,
              data.final_quant,
              data.final_measureunit,
              data.order_reciver || "FROM sales",
              data.final_color,
              "PENDING",
              data.salesID || 0,
            ]
          )
          .then((resp) => {
            return [true, "Production order added"];
          });
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static showSalesId(id) {
    return db
      .execute("SELECT * FROM sales_order WHERE id = '" + id + "'")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static addSalesOrder(data) {
    const date = new Date(data.sales_date);
    const today = new Date();
    var IDgenerator = this.uniqueId();
    return db
      .execute(
        "INSERT INTO sales_order(order_date, salesID, customer_name, customer_address, Tin_number, cus_total, final_product, final_color, final_materialCode, final_diameter, final_quant, final_measureunit, cus_advance, payment, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          date || today,
          data.salesID,
          data.customer_name,
          data.customer_address,
          data.Tin_number,
          data.cus_total || "",
          data.final_product,
          data.final_color || "",
          data.final_materialCode || "",
          data.final_diameter || "",
          data.final_quant,
          data.final_measureunit,
          data.cus_advance || "0",
          data.payment,
          "NEW",
        ]
      )
      .then((resu) => {
        return [true, IDgenerator];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static addSalesOrderBulk(data) {
    const date = new Date(data.sales_date);
    const today = new Date();
    var IDgenerator = this.uniqueId();

    return db
      .execute(
        "INSERT INTO sales_order (order_date, salesID, customer_name, customer_address, Tin_number, cus_total, cus_advance, payment, status, cust_remaining) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          date || today,
          data.salesID,
          data.customer_name,
          data.customer_address,
          data.Tin_number,
          data.cus_total || "",
          data.cus_advance || "0",
          data.payment,
          "NEW",
          data.Remaining,
        ]
      )
      .then(async (resu) => {
        const [result] = await db.execute(
          "SELECT id FROM sales_order ORDER BY id DESC LIMIT 1;"
        );

        console.log("Inserted row with ID:", result[0]);
        return [true, result[0]["id"]];
      })
      .catch((err) => {
        console.log(err);
        return [false, err];
      });
  }

  static async sendtoWareHouse(data, ID) {
    data.mat_requestdate = "";
    data.mat_requestdept = "SALES";
    data.req_materialtype = "FIN";
    console.log("first", data);
    var resultArray = [];
    return await db
      .execute("SELECT id FROM sales_order WHERE unique_id ='" + ID + "'")
      .then(async (respo) => {
        // console.log(respo[0][0].id);
        data.SalesId = respo[0][0].id;
        // console.log("wareHouse", data);

        return await db
          .execute(
            "INSERT INTO material_request(mat_requestname, mat_requestdept, mat_reqpersonid, mat_description, mat_quantity, req_materialtype, mat_status, salesID, prodID, mat_unit, mat_spec) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              data.mat_requestname,
              data.mat_requestdept,
              data.mat_reqpersonid || "234",
              data.mat_description,
              data.mat_quantity,
              data.req_materialtype,
              "PENDING",
              data.SalesId || " ",
              data.ProductionId || " ",
              data.mat_unit || "",
              data.mat_spec || "",
            ]
          )
          .then((result) => {
            return true;
          })
          .catch((err) => {
            console.log("yhuyuyuuy", err);
            return false;
          });
      });

    // storeRequestion.addstoreRequestion(data).then((result) => {
    //   if (result == false) {
    //     resultArray.push(result);
    //   }
    // // });
    // return true;
  }

  static savetoCart(data, requestId) {
    console.log(data);
    console.log(requestId);
    return db
      .execute(
        "INSERT INTO cart_detaile (item_name, item_spec, item_description, item_quantity, material_id) VALUES (?, ?, ?, ?, ?)",
        [
          data.mat_requestname,
          data.mat_spec,
          data.mat_description,
          data.mat_quantity,
          requestId,
        ]
      )
      .then((respo) => {
        return [true, requestId];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static showAllOrder() {
    return db
      .execute("SELECT * FROM sales_order ORDER BY id DESC")
      .then((resp) => {
        return resp[0];
      })
      .catch((err) => {
        return err;
      });
  }

  static showAllOrderPA() {
    return db
      .execute(
        "SELECT * FROM sales_order WHERE status = 'Accepted' ORDER BY id DESC"
      )
      .then((resp) => {
        return resp[0];
      })
      .catch((err) => {
        return err;
      });
  }

  static async showSalesOrderPROD(id, Date) {
    try {
      const resp = await db.execute(
        "SELECT * FROM sales_order_prod WHERE status = 'Accepted' ORDER BY id DESC"
      );
      return resp[0];
    } catch (err) {
      return err;
    }
  }
  static showBankStatment(ID) {
    return db
      .execute("SELECT * FROM bank_status WHERE sales_id = ?", [ID])
      .then((resp) => {
        return resp[0];
      })
      .catch((err) => {
        return err;
      });
  }

  static async deleteBankStatment(ID) {
    /////////////////////////////////sales Delete
    try {
      const resp = await db.execute(" DELETE FROM bank_status sales_id = ?", [
        ID,
      ]);
      return resp[0];
    } catch (err) {
      return err;
    }
  }

  static async deleteProductList(ID) {
    try {
      const resp = await db.execute(
        " DELETE FROM cart_detaile WHERE material_id = ?",
        [ID]
      );
      return resp[0];
    } catch (err) {
      return err;
    }
  }
  static async DeleteSales(ID) {
    try {
      const resp = await db.execute("DELETE FROM sales_order WHERE id = ?", [
        ID,
      ]);
      return resp[0];
    } catch (err) {
      return err;
    }
  }

  static async DeleteSalesProd(ID, date) {
    try {
      const resp = await db.execute(
        "DELETE FROM sales_order_prod WHERE salesId = ? AND DATE(sales_date) = DATE(?)",
        [ID, date]
      );
      return resp[0];
    } catch (err) {
      return err;
    }
  }

  static async DeleteSalesProfit(ID) {
    try {
      const resp = await db.execute(
        "DELETE FROM dashboard_profit WHERE salesID = ? ",
        [ID]
      );
      return resp[0];
    } catch (err) {
      return err;
    }
  }

  static async showCartID(ID) {
    return await db
      .execute("SELECT * FROM cart_detaile WHERE material_id = ?", [ID])
      .then((resp) => {
        return resp[0];
      })
      .catch((err) => {
        return err;
      });
  }

  static async paymentDetail(data, salesId) {
    return db
      .execute(
        "INSERT INTO bank_status(bank_name, bank_account, payed_amount, remaining_amount, sales_id, remaining) VALUES (?, ?, ?, ?, ?, ?)",
        [
          data.bank_name || "",
          data.account_num || "-",
          data.cus_advance || 0,
          data.Remaining || data.cus_total,
          salesId,
          data.Remaining,
        ]
      )
      .then((respo) => {
        return [true, requestId];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async cartDetail(data, salesId) {
    try {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        await db.execute(
          "INSERT INTO cart_detaile (item_name, item_description, item_quantity, material_id, measuring_unit, item_diameter, item_color, total_price, unit_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            item.fin_product,
            item.final_materialCode,
            item.final_quant,
            salesId,
            item.final_measureunit,
            item.final_diameter,
            item.final_color,
            item.total_price,
            item.unit_price,
          ]
        );
      }

      return [true, "cart detail"];
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  static fetchCartDetail(id) {
    return db
      .execute("SELECT * FROM cart_detaile WHERE material_id = '" + id + "'")
      .then((respo) => {
        return respo[0];
      })
      .catch((err) => {
        return err;
      });
  }
};
