const db = require("../../util/db");

module.exports = class salesStore {
  static async getsalesbyID(id) {
    return await db
      .execute("SELECT * FROM sales_order WHERE id=" + id + "")
      .then((respo) => {
        return respo[0];
      })
      .catch((err) => {
        return false;
      });
  }

  static async rawMaterialRequest(materialRequested) {
    const today = new Date();
    return await db
      .execute(
        "INSERT INTO material_request(mat_requestdate, mat_requestname, mat_requestdept, mat_reqpersonid, mat_quantity, req_materialtype, mat_status, salesID, FsNumber, mat_materialcode, finished_diameter, finished_Color, mat_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          materialRequested.order_date || today,
          materialRequested.final_product,
          "SALES",
          "SALES",
          materialRequested.final_quant || "",
          "FIN",
          "PENDING",
          materialRequested.salesID || " ",
          materialRequested.salesID || " ",
          materialRequested.final_materialCode || "",
          materialRequested.final_diameter,
          materialRequested.final_color,
          materialRequested.final_diameter,
        ]
      )
      .then((result) => {
        return true;
      })
      .catch((err) => {
        console.log("err", err);
        return false;
      });
  }

  static async postOrder(data) {
    return await db
      .execute(
        "INSERT INTO sales_order_prod(sales_date, customer_name, customer_address, customer_tin, product_orderd, product_color, product_desc, product_spec, total_product, mou, totalCash, status, advances, salesId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.order_date,
          data.customer_name,
          data.customer_address,
          data.Tin_number,
          data.final_product,
          data.final_color,
          data.final_materialCode,
          data.final_diameter,
          data.final_quant,
          data.final_measureunit,
          data.cus_total,
          data.payment,
          data.cus_advance || "",
          data.salesID,
        ]
      )
      .then((respo) => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  static async accptSales(id) {
    return await db
      .execute("UPDATE sales_order SET status = 'Accepted' WHERE id=" + id + "")
      .then((respo) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  }

  static MakeSold(itemSold) {
    return db
      .execute("SELECT * FROM sales_store WHERE id = '" + itemSold.iD + "'")
      .then((res) => {
        const currentVal = parseInt(res[0][0]["salesStore_quantity"]);
        const soldVal = parseInt(itemSold.quantity);
        var valueLast = currentVal - soldVal;
        var totalValue = soldVal * itemSold.sold_value;

        console.log(valueLast);

        return db
          .execute(
            "UPDATE sales_store SET salesStore_quantity = '" + valueLast + "'"
          )
          .then((result) => {
            return db
              .execute(
                "INSERT INTO sales_summery(sold_name, sold_qty, sold_description, sold_personid, sold_value, sold_total, store_purchaserName) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                  res[0][0]["salesStore_name"],
                  itemSold.quantity,
                  res[0][0]["salesStore_description"],
                  itemSold.soldPerson,
                  itemSold.sold_value,
                  totalValue,
                  itemSold.Name,
                ]
              )
              .then((res) => {
                return db
                  .execute(
                    "UPDATE sales_store SET salesStore_status = '" +
                      itemSold.status +
                      "' WHERE id ='" +
                      itemSold.id +
                      "'"
                  )
                  .then((respo) => {
                    return respo;
                  });
              });

            // send to finanace noeee
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static async completeSales(ID) {
    return await db
      .execute(
        "UPDATE sales_order SET status = 'COMPLETED' WHERE id='" + ID + "'"
      )
      .then((respo) => {
        return [true, respo];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static makeHold(itemHold) {
    return db
      .execute(
        "UPDATE sales_store SET salesStore_status = '" +
          itemHold.status +
          "' WHERE id ='" +
          itemHold.id +
          "'"
      )
      .then((respo) => {
        return respo;
      });
  }

  static getallSalesStore() {
    return db
      .execute("SELECT * FROM sales_store")
      .then((result) => {
        return result[0];
      })
      .catch((err) => {
        return console.log(err);
      });
  }

  static addSalesStore(newMaterialForm) {
    return db
      .execute(
        "INSERT INTO sales_store(salesStore_name, salesStore_quantity, salesStore_description, salesStore_materialcode, salesStore_spec, salesStore_materialunit, salesStore_value, salesStore_referncenum, salesStore_date, salesStore_remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          newMaterialForm.salesStore_name,
          newMaterialForm.salesStore_quantity,
          newMaterialForm.salesStore_description,
          newMaterialForm.salesStore_materialcode,
          newMaterialForm.salesStore_spec,
          newMaterialForm.salesStore_materialunit,
          newMaterialForm.salesStore_value,
          newMaterialForm.salesStore_referncenum,
          newMaterialForm.salesStore_date,
          newMaterialForm.salesStore_remark,
        ]
      )
      .then(() => {
        return "new finished good added to sales store";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static selectbyIDSales(ID) {
    return db
      .execute("SELECT * FROM sales_store WHERE id='" + ID + "'")
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static updatebyIDSales(ID, updatedData) {
    return db
      .execute(
        "UPDATE sales_store SET salesStore_name ='" +
          updatedData.salesStore_name +
          "', salesStore_quantity = '" +
          updatedData.salesStore_quantity +
          "', salesStore_description = '" +
          updatedData.salesStore_description +
          "', salesStore_materialcode = '" +
          updatedData.salesStore_materialcode +
          "', salesStore_spec ='" +
          updatedData.salesStore_spec +
          "', salesStore_materialunit = '" +
          updatedData.salesStore_materialunit +
          "', salesStore_value = '" +
          updatedData.salesStore_value +
          "', salesStore_referncenum = '" +
          updatedData.salesStore_referncenum +
          "', salesStore_date = '" +
          updatedData.salesStore_date +
          "', salesStore_remark = '" +
          updatedData.salesStore_remark +
          "' WHERE id = " +
          ID +
          ""
      )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static addQty(oldMat, newMat) {
    const updateQuan =
      parseInt(oldMat[0].salesStore_quantity) + parseInt(newMat.fin_quantity);
    console.log(updateQuan);
    return db
      .execute(
        "UPDATE sales_store SET salesStore_quantity ='" +
          updateQuan +
          "' WHERE salesStore_name ='" +
          oldMat[0].salesStore_name +
          "'"
      )
      .then((result) => {
        const today = new Date();
        return db
          .execute(
            "INSERT INTO summery(material_id, material_type, summery_date, stockat_hand, stock_recieved, stock_issued, department_issued, stockat_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
              oldMat[0].id,
              "FIN",
              today,
              oldMat[0].salesStore_quantity,
              newMat.fin_quantity,
              "",
              "",
              updateQuan,
            ]
          )
          .then((res) => {
            return "summery Updated";
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  static subQty(oldMat, newMat) {
    var updateQuan;
    if (oldMat[0].salesStore_quantity >= parseInt(newMat.fin_quantity)) {
      updateQuan =
        parseInt(oldMat[0].salesStore_quantity) - parseInt(newMat.fin_quantity);
      console.log(updateQuan);
      return db
        .execute(
          "UPDATE salesStore_goods SET	salesStore_quantity ='" +
            updateQuan +
            "' WHERE salesStore_name ='" +
            oldMat[0].salesStore_name +
            "'"
        )
        .then((result) => {
          const today = new Date();
          return db
            .execute(
              "INSERT INTO summery(material_id, material_type, summery_date, stockat_hand, stock_recieved, stock_issued, department_issued, stockat_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [
                oldMat[0].id,
                "FIN",
                today,
                oldMat[0].salesStore_quantity,
                "",
                newMat.fin_quantity,
                newMat.fin_requestdept,
                updateQuan,
              ]
            )
            .then((res) => {
              return "summery Updated";
            });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      return "Low in stock";
    }
  }

  static checkExisFinM(newName, material_type) {
    return db
      .execute(
        "SELECT * FROM salesStore_goods WHERE salesStore_name='" + newName + "'"
      )
      .then((result) => {
        return result[0].length !== 0 ? [true, result[0]] : [false, result[0]];
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
