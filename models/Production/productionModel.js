const db = require("../../util/db");
const axios = require("axios");
const wareAxios = require("../../midelware/warehouseaxios");
const storeRequestion = require("../warehouse/storeRequstionModel");
const receivedModule = require("..//warehouse/recievedMatModules");
const { parse } = require("dotenv");

module.exports = class productionModel {
  composerArray = new Array();
  static uniqueId() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  }

  static addrawMaterialRequest(materials, fs_number, batch) {
    console.log(fs_number);
    console.log(materials.raw_materialcode);

    return db
      .execute(
        "INSERT INTO rawmaterialrequest (batch_id, fsNumber, raw_name, raw_materialcode, quantity, material_unit, req_status, request_date)VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
        [
          batch,
          fs_number,
          materials.new_name,
          materials.new_materialcode,
          materials.new_quantity,
          materials.new_materialunit,
          "NEW",
          "date",
        ]
      )
      .then((respo) => {
        return [true, "New REQUEST ADDED"];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static showrawMaterialRequest() {
    return db
      .execute("SELECT * FROM rawmaterialrequest WHERE req_status = 'NEW'")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static GMStatus(data) {
    return db
      .execute(
        "UPDATE productionordergm SET final_status = 'PM Approved' WHERE id = '" +
          data.GMID +
          "'"
      )
      .then((respo) => {
        return true;
      })
      .catch((err) => {
        return err;
      });
  }

  static async fetchSalesInfo(id) {
    return db
      .execute("SELECT * FROM sales_order_prod WHERE salesId = '" + id + "'")
      .then((respo) => {
        return respo[0][0];
      })
      .catch((err) => {
        return err;
      });
  }

  static async saveProfitInfo(Essentials) {
    const lastAray = Essentials.length - 1;
    console.log(lastAray);
    console.log("Essent", Essentials[lastAray].salesId);
    return await db
      .execute(
        "INSERT INTO dashboard_profit(salesID, producedId, materialcost_per, total_sales, production_cost, profit, production_CostInfo, otherCosts, qtyorderdProduct, finGoodMass, totalcostofRawMaterials)VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          Essentials[lastAray].salesId,
          Essentials[lastAray].ProductID,
          Essentials[lastAray].costperOneGramraw,
          Essentials[lastAray].salesTotal,
          Essentials[lastAray].costofoneFins,
          Essentials[lastAray].profit,
          "",
          Essentials[lastAray].otherCosts,
          Essentials[lastAray].qtyorderdProduct,
          Essentials[lastAray].finGoodMass,
          Essentials[lastAray].totalcostofRawMaterials,
        ]
      )
      .then((respo) => {
        return [true, "YOU DO PROFIT DONE"];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static async fetchFinMass(name, des) {
    return await db
      .execute(
        "SELECT * FROM finished_goods WHERE 	finished_name = '" +
          name +
          "' AND finished_description = '" +
          des +
          "'"
      )
      .then((respo) => {
        return respo[0][0].finished_mass;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }
  static async rawMaterialscost(materialdatas, productDetail) {
    return await db
      .execute(
        "INSERT INTO dashboard_profit_detail(mat_requestname, mat_spec, mat_description, mat_quantity, mat_unit, value, salesId, productId, totalcost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          materialdatas.mat_requestname,
          materialdatas.mat_spec,
          materialdatas.mat_description,
          materialdatas.mat_quantity,
          materialdatas.mat_unit,
          materialdatas.value,
          productDetail.salesID,
          productDetail.prodID,
          materialdatas.costPerMaterial,
        ]
      )
      .then((res) => {
        return productDetail.prodID;
      });
  }

  static async rawMaterialsdetail(datas) {
    return await db
      .execute(
        "SELECT * FROM raw_materials WHERE raw_name = '" +
          datas.mat_requestname +
          "' AND 	raw_description ='" +
          datas.mat_description +
          "'"
      )
      .then((respo) => {
        // console.log(respo[0]);
        datas.value = respo[0][0].raw_value;
        datas.costPerMaterial =
          parseFloat(respo[0][0].raw_value) * parseFloat(datas.mat_quantity);
        return [true, datas];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async fetchRawMatused(dataId) {
    return await db
      .execute(
        "SELECT * FROM custome_batch WHERE custom_batch_id = '" + dataId + "'"
      )
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async makeFinished(data) {
    const leftamaount =
      parseFloat(data.oldQuantity) - parseFloat(data.new_quantity);

    let status;
    if (leftamaount === 0) {
      status = "FINISHED";
    } else {
      status = "STARTED";
    }

    try {
      await db.execute(
        "UPDATE production_order SET fin_quan = ?, status = ? WHERE id = ?",
        [leftamaount, status, data.prodID]
      );
      return [true, status];
    } catch (error) {
      return [false, error];
    }
  }

  static showFinished() {
    return db
      .execute("SELECT * FROM produced")
      .then((res) => {
        return [true, res[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static addSummery(data) {
    return db
      .execute("INSERT INTO summery(ProductionID, finishedID) VALUES (?,?)", [
        data.productionID,
        data.finishedID,
      ])
      .then((result) => {
        return true;
      })
      .catch((err) => {
        return err;
      });
  }

  static completeOrder(data) {
    console.log(data);

    return db
      .execute(
        "INSERT INTO produced(productionID, finished_name, finished_spec, finished_qty, personID, finished_description, finished_materialunit, finished_remark, finished_materialcode, mat_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.prodID,
          data.new_name,
          data.new_spec || "",
          data.new_quantity,
          data.personID,
          data.new_description || data.new_diameter,
          data.new_materialunit || "",
          data.new_remark || "",
          data.new_materialcode || "",
          data.new_color || "",
        ]
      )
      .then((result) => {
        return [true, "saved Produced"];
      })
      .catch((err) => {
        console.log(err);
        return [false, err];
      });
  }

  static async sendtoWareHouse(data) {
    var toArray = [];
    toArray.push(data);

    toArray.forEach((singleBody) => {
      receivedModule
        .addonRecived(singleBody)
        .then((result) => {
          return;
        })
        .catch((err) => {
          return "Database error";
        });
    });
  }
  static async statusEnd(id) {
    return await db
      .execute("SELECT * FROM production_order WHERE id ='" + id + "'")
      .then((result) => {
        if (result[0][0].status === "STARTED") {
          return db
            .execute(
              "UPDATE production_order SET status = 'COMPLETED' WHERE id = '" +
                id +
                "'"
            )
            .then((results) => {
              return [true, "Sucessful"];
            });
        } else {
          return [false, "needs to start first"];
        }
      });
  }

  static statusStarted(id) {
    return db
      .execute(
        "UPDATE production_order SET status = 'STARTED' WHERE id = '" + id + "'"
      )
      .then((result) => {
        return [true, result];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static makeRawMatRequest(selectedOrder, prodId, mat_reqperson) {
    var resultArray = [];
    // console.log(  selectedOrder[0].custom_batch_id);
    if (selectedOrder[0].custom_batch_id !== "0") {
      return db
        .execute(
          "SELECT * FROM custome_batch WHERE custom_batch_id = '" +
            selectedOrder[0].custom_batch_id +
            "'"
        )
        .then((result) => {
          // console.log(result[0]);
          const rawmaterials = JSON.parse(result[0][0].raw_mat_needed);

          rawmaterials.forEach(async (element) => {
            const newelement = {
              ...element,
              mat_requestdept: "PRODUCTION",
              mat_reqpersonid: mat_reqperson,
              req_materialtype: "RAW",
              ProductionId: prodId,
              FsNumber: selectedOrder[0].Fs_number,
            };

            await storeRequestion
              .addstoreRequestion(newelement)
              .then((result) => {
                if (result == false) {
                  resultArray.push(result);
                }
              });
          });
          return true;
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    } else {
      console.log("else");
    }
  }

  static makeBatchCost(selectedOrder) {
    var resultArray = [];

    return db
      .execute(
        "SELECT * FROM custome_batch WHERE custom_batch_id = '" +
          selectedOrder +
          "'"
      )
      .then((result) => {
        const rawmaterials = JSON.parse(result[0][0].raw_mat_needed);

        return rawmaterials;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  // static calculateCost(materialsList, productionId, personId) {
  //   var totalMass = 0.0;
  //   var totalValue = 0.0;
  //   var totalperone = 0.0;
  //   materialsList.forEach(async (element) => {
  //     return db
  //       .execute(
  //         "SELECT * FROM raw_materials WHERE raw_materialcode ='" +
  //           element.mat_materialcode +
  //           "'"
  //       )
  //       .then((res) => {
  //         const materialValue = parseFloat(res[0][0].raw_value);
  //         const eachValue = materialValue * parseFloat(element.mat_quantity);
  //         totalMass += parseFloat(element.mat_quantity);
  //         totalValue += eachValue;
  //         console.log(totalMass);
  //         console.log(totalValue)
  //         db.execute(
  //           "INSERT INTO production_cost(production_id, fs_num, raw_name,	raw_materialcode, each_quantity, each_value, each_total) VALUES(?, ?, ?, ?, ?, ?, ?)",
  //           [
  //             productionId,
  //             "",
  //             element.mat_requestname,
  //             element.mat_materialcode,
  //             element.mat_quantity,
  //             materialValue,
  //             eachValue,
  //           ]
  //         ).then((respo) => {
  //           return;
  //         });
  //       });
  //   });
  //   totalperone = totalValue / totalMass;
  //   return db
  //     .execute(
  //       "UPDATE production_cost SET totalmass = '" +
  //         totalMass +
  //         "', valueper1kg = '" +
  //         totalperone +
  //         "', totalValue = '" +
  //         totalValue +
  //         "' WHERE production_id = '" +
  //         productionId +
  //         "'"
  //     )
  //     .then((res) => {
  //       console.log("YES ITS DONE");
  //       return true;
  //     })
  //     .catch((err) => {
  //       console.log("YES ITS NOT", err);
  //       return err;
  //     });
  // }

  static async calculateCost(materialsList, productionId, personId) {
    let totalMass = 0.0;
    let totalValue = 0.0;
    let totalperone = 0.0;

    for (const element of materialsList) {
      try {
        const [[material]] = await db.execute(
          "SELECT * FROM raw_materials WHERE raw_materialcode = ?",
          [element.mat_materialcode]
        );
        const materialValue = parseFloat(material.raw_value);
        const eachValue = materialValue * parseFloat(element.mat_quantity);
        totalMass += parseFloat(element.mat_quantity);
        totalValue += eachValue;

        await db.execute(
          "INSERT INTO production_cost(production_id, fs_num, raw_name, raw_materialcode, each_quantity, each_value, each_total) VALUES(?, ?, ?, ?, ?, ?, ?)",
          [
            productionId,
            personId,
            element.mat_requestname,
            element.mat_materialcode,
            element.mat_quantity,
            materialValue,
            eachValue,
          ]
        );
      } catch (error) {
        console.error(error);
      }
    }

    totalperone = totalValue / totalMass;
    try {
      await db.execute(
        "UPDATE production_cost SET totalmass = ?, valueper1kg = ?, totalValue = ? WHERE production_id = ?",
        [totalMass, totalperone, totalValue, productionId]
      );
    } catch (error) {
      console.error(error);
    }
  }

  static selectOrder(productionId) {
    return db
      .execute(
        "SELECT * FROM production_order WHERE id ='" + productionId + "'"
      )
      .then((result) => {
        return [true, result[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  // static async addproductionOrder(newData) {
  //   var estimated_product_quantity = 897;
  //   var estimated_waste_quantity = 43;
  //   var unique_batch_id = this.uniqueId();

  //   if (newData.custom_regular === "regular") {
  //     // var diff =
  //     //   (newData.end_dateTime.getTime() - newData.start_dateTime.getTime()) /
  //     //   1000;
  //     var diff = 90;
  //     diff /= 60;
  //     var timeGiven = Math.abs(diff);
  //     await db
  //       .execute(
  //         "SELECT * FROM batch_formula WHERE id = '" + newData.batch_id + "'"
  //       )
  //       .then((result) => {
  //         estimated_product_quantity =
  //           parseInt(result[0][0].prod_quan) *
  //           (newData.batch_mult *
  //             newData.production_line *
  //             newData.shift *
  //             ((timeGiven - newData.downTime) /
  //               parseInt(result[0][0].timeneeded)) *
  //             (newData.effieceny / parseInt(result[0][0].efficency)));
  //         estimated_waste_quantity =
  //           result[0][0].waste_quan *
  //           (newData.batch_mult *
  //             newData.production_line *
  //             newData.shift *
  //             ((timeGiven - newData.downTime) / result[0][0].timeneeded) *
  //             (newData.effieceny / result[0][0].efficency));
  //       });

  //     return db
  //       .execute(
  //         "INSERT INTO production_order(fin_product, fin_spec, fin_quan, batch_id, start_dateTime, end_dateTime, batch_mult, status, est_finQuan, est_westQuan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  //         [
  //           newData.fin_product,
  //           newData.fin_spec,
  //           newData.fin_quan,
  //           newData.batch_id,
  //           newData.start_dateTime,
  //           newData.end_dateTime,
  //           newData.batch_mult,
  //           newData.status,
  //           estimated_product_quantity,
  //           estimated_waste_quantity,
  //         ]
  //       )
  //       .then((resp) => {
  //         return [true, "Production order added"];
  //       })
  //       .catch((err) => {
  //         return [false, err];
  //       });
  //   } else if (newData.custom_regular === "custom") {
  //     db.execute(
  //       "INSERT INTO custome_batch(raw_mat_needed, expected_fin_qty, expected_waste_quan, custom_batch_id) VALUES (?, ?, ?, ?)",
  //       [
  //         newData.raw_needed,
  //         newData.expected_fin_qty,
  //         newData.expected_waste_quan,
  //         unique_batch_id,
  //       ]
  //     ).then((resu) => {
  //       console.log("Making custom Batch");
  //     });
  //     return db
  //       .execute(
  //         "INSERT INTO production_order(fin_product, fin_spec, fin_quan, batch_id, start_dateTime, end_dateTime, batch_mult, status, custom_batch_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  //         [
  //           newData.fin_product,
  //           newData.fin_spec,
  //           newData.fin_quan,
  //           "",
  //           newData.start_dateTime,
  //           newData.end_dateTime,
  //           newData.batch_mult,
  //           newData.status,
  //           unique_batch_id,
  //         ]
  //       )
  //       .then((resp) => {
  //         return [true, "Production order added"];
  //       })
  //       .catch((err) => {
  //         return [false, err];
  //       });
  //   }
  // }

  static async addproductionOrder(newData) {
    const UniqID = this.uniqueId();
    db.execute(
      "INSERT INTO custome_batch(raw_mat_needed, expected_fin_qty, custom_batch_id) VALUES (?, ?, ?)",
      [
        newData.raw_needed,
        newData.expected_fin_qty || "",
        newData.salesID == "" ? UniqID : salesID,
      ]
    ).then((resu) => {
      console.log("Making custom Batch");
    });
    return db
      .execute(
        "INSERT INTO production_order(fin_product, fin_desc, fin_spec, fin_quan, finished_materialcode, finished_diameter, start_dateTime, mesuring_unit, final_color, status, custom_batch_id, Fs_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          newData.fin_product,
          newData.fin_desc || "",
          newData.fin_spec || "",
          newData.fin_quan,
          newData.finished_materialcode,
          newData.finished_diameter,
          newData.start_dateTime,
          newData.final_measureunit,
          newData.final_color,
          newData.status,
          newData.salesID == "" ? UniqID : salesID,
          newData.FS_NUMBER,
        ]
      )
      .then((resp) => {
        return [true, UniqID];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static addproductionOrderGM(newData) {
    return db
      .execute(
        "INSERT INTO productionordergm(final_product, finished_diameter, final_desc, final_quant, final_measureunit, order_reciver, final_color, finished_materialcode, final_status, produced_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          newData.final_product,
          newData.finished_diameter,
          newData.final_desc,
          newData.final_quant,
          newData.final_measureunit,
          newData.order_reciver,
          newData.final_color,
          newData.finished_materialcode,
          "PENDING",
          newData.produced_id || 0,
        ]
      )
      .then((resp) => {
        return [true, "Production order added"];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static fromRegularBatch(elemnts) {
    return db
      .execute(
        "SELECT * FROM batch_formula WHERE id = '" + elemnts.batch_id + "'"
      )
      .then((res) => {
        elemnts.rawmat_list = res[0][0].rawmat_list;
        return elemnts;
      });
  }

  static fromCustomBatch(elemnts) {
    return db
      .execute(
        "SELECT * FROM custome_batch WHERE id = '" +
          elemnts.custom_batch_id +
          "'"
      )
      .then((res) => {
        elemnts.raw_mat_needed = res[0].raw_mat_needed;
        elemnts.expected_fin_qty = res[0].expected_fin_qty;
        elemnts.expected_waste_quan = res[0].expected_waste_quan;
        elemnts.custom_batch_id = res[0].custom_batch_id;
        return elemnts;
      });
  }

  static allProduction() {
    return db
      .execute("SELECT * FROM production_order")
      .then((respo) => {
        return respo[0];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //  static async showProductionOrder(startDate) {

  //   db.execute("")
  // SELECT batch_formula.*, production_order.*, custome_batch.* FROM batch_formula ,production_order, custome_batch WHERE  batch_formula.id =production_order.batch_id || production_order.batch_id = custome_batch.id
  //  const productionCollection = await this.allProduction();
  // const elementsarr = [];
  //    productionCollection.forEach(async (elemnts) => {
  //      if (elemnts.custom_batch_id == 0) {
  //  db.execute("SELECT production_order.*, batch_formula.rawmat_list, batch_formula.id FROM production_order, batch_formula WHERE batch_formula.id =production_order.batch_id").then((res)=>{
  //   return res[0];
  //  })
  //     const resultArr = await this.fromRegularBatch(elemnts);
  //     console.log(resultArr);
  //     elementsarr.push(resultArr);
  //  } else {
  //     const resultArr2 = await this.fromCustomBatch(elemnts);
  //     elementsarr.push(resultArr2);
  //  }
  // });
  // console.log(elementsarr);
  // return [true, elementsarr];
  //  }
  static showProductionOrderReg() {
    return db
      .execute(
        "SELECT production_order.*, batch_formula.rawmat_list, batch_formula.id AS BID FROM production_order, batch_formula WHERE batch_formula.id =production_order.batch_id"
      )
      .then((respo) => {
        return respo[0];
      })
      .catch((err) => {
        return err;
      });
  }

  static showallProductionGM() {
    return db
      .execute("SELECT * FROM productionordergm")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static showallProductionGMID(id) {
    return db
      .execute("SELECT * FROM productionordergm WHERE id= '" + id + "'")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static showProductionOrderCustom() {
    return db
      .execute(
        "SELECT production_order.*, custome_batch.raw_mat_needed, custome_batch.id AS CID FROM production_order, custome_batch WHERE production_order.custom_batch_id = custome_batch.custom_batch_id"
      )
      .then((respo) => {
        return respo[0];
      })
      .catch((err) => {
        return err;
      });
  }

  // }
};
