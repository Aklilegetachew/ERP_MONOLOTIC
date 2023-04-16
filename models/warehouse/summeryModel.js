const { parse } = require("dotenv");
const db = require("../../util/db");

module.exports = class storeRequestion {
  static viewSummery(id, materialType) {
    return db
      .execute(
        "SELECT * FROM summery WHERE material_id='" +
          id +
          "' AND material_type = '" +
          materialType +
          "'"
      )
      .then((result) => {
        return result[0];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static viewSummeryMonth(id, materialType, selectedDate, selectedYear) {
    console.log("year", selectedYear);
    if (selectedDate.start == undefined && selectedYear == "") {
      console.log("Hello");
      const currentMonth = new Date().getMonth();

      return db
        .execute(
          "SELECT * FROM summery WHERE material_id='" +
            id +
            "' AND material_type = '" +
            materialType +
            "'"
        )
        .then((result) => {
          var monthlyData = [];
          console.log(result[0]);

          // if (result[0].length !== 0) {
          //   result[0].map((eachData) => {
          //     const dbMonth = new Date(eachData["summery_date"]).getMonth();
          //     if (currentMonth == dbMonth) {
          //       monthlyData.push(eachData);
          //     }
          //   });
          // }
          // console.log(monthlyData);
          return result[0];
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (selectedDate.start !== undefined && selectedYear == "") {
      return db
        .execute(
          "SELECT * FROM summery WHERE material_id='" +
            id +
            "' AND material_type = '" +
            materialType +
            "'"
        )
        .then((result) => {
          var monthlyData = [];

          const start = Date.parse(selectedDate.start);
          const end = Date.parse(selectedDate.end);
          console.log("start", start);
          console.log("end", end);
          // true
          if (result[0].length !== 0) {
            result[0].map((eachData) => {
              // const dbDate = new Date(eachData["summery_date"]).getTime();
              const d = Date.parse(eachData["summery_date"]);
              console.log("D", d);
              if (d >= start && d <= end) {
                console.log("eachData", eachData);
                monthlyData.push(eachData);
              }
            });
          }
          return monthlyData;
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (selectedDate.start !== undefined && selectedYear !== "") {
      return db
        .execute(
          "SELECT * FROM summery WHERE material_id='" +
            id +
            "' AND material_type = '" +
            materialType +
            "'"
        )
        .then((result) => {
          var monthlyData = [];

          const start = Date.parse(selectedDate.start);
          const end = Date.parse(selectedDate.end);

          console.log("start", start);
          console.log("end", end);
          // true
          if (result[0].length !== 0) {
            result[0].map((eachData) => {
              const d = Date.parse(eachData["summery_date"]);
              const dbYear = eachData["summery_date"].substring(0, 4);
              if (d >= start && d <= end && dbYear == selectedYear) {
                monthlyData.push(eachData);
              }
            });
          }
          return monthlyData;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  static viewSalesMonth(selectedDate) {
    if (selectedDate.start == null && selectedDate.end == null) {
      console.log("Hello");
      const currentMonth = new Date().getMonth();

      return db
        .execute(
          "SELECT * FROM sales_order WHERE status = 'Accepted' ORDER BY id DESC"
        )
        .then((result) => {
          console.log(result[0]);
          return result[0];
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (selectedDate.start !== null && selectedDate.end !== null) {
      var start = new Date(selectedDate.start);
      var end = new Date(selectedDate.end);
      var startDateStr = start.toISOString().slice(0, 10);
      var endDateStr = end.toISOString().slice(0, 10);
      return db
        .execute(
          "SELECT * FROM sales_order WHERE DATE(order_date) BETWEEN ? AND ? AND status = 'Accepted' ORDER BY id DESC",
          [startDateStr, endDateStr]
        )
        .then((result) => {
          console.log("its here actualy");
          return result[0];
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  static viewBankMonth(selectedDate) {
    if (selectedDate.start == null && selectedDate.end == null) {
      console.log("Hello");
      const currentMonth = new Date().getMonth();

      return db
        .execute(
          "SELECT sales_order.*, bank_status.* FROM sales_order JOIN bank_status ON sales_order.id = bank_status.sales_id WHERE sales_order.status = 'Accepted' ORDER BY sales_order.id DESC"
        )
        .then((result) => {
          console.log(result[0]);
          return result[0];
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (selectedDate.start !== null && selectedDate.end !== null) {
      var start = new Date(selectedDate.start);
      var end = new Date(selectedDate.end);
      var startDateStr = start.toISOString().slice(0, 10);
      var endDateStr = end.toISOString().slice(0, 10);
      return db
        .execute(
          "SELECT sales_order.*, bank_status.* FROM sales_order JOIN bank_status ON sales_order.id = bank_status.sales_id WHERE DATE(sales_order.order_date) BETWEEN ? AND ? AND sales_order.status = 'Accepted' ORDER BY sales_order.id DESC",
          [startDateStr, endDateStr]
        )
        .then((result) => {
          console.log("its here actualy");
          return result[0];
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  static viewExpenseCurrentMonth() {
    return db
      .execute(
        "SELECT * FROM expenses WHERE MONTH(date_expense) = MONTH(CURDATE()) ORDER BY date_expense ASC"
      )
      .then((result) => {
        var monthlyData = [];
        console.log(result[0]);

        return result[0];
      })
      .catch((err) => {
        return err;
      });
  }

  static viewExpenseByMonth(id, materialType, selectedDate, selectedYear) {
    console.log("year", selectedYear);
    if (selectedDate.start == undefined && selectedYear == "") {
      console.log("Hello");
      const currentMonth = new Date().getMonth();

      return db
        .execute("SELECT * FROM expenses ORDER BY date_expense ASC")
        .then((result) => {
          var monthlyData = [];
          console.log(result[0]);

          return result[0];
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (selectedDate.start !== undefined && selectedYear == "") {
      return db
        .execute(
          "SELECT * FROM expenses WHERE date_expense >= DAte(?) AND date_expense <= Date(?) ORDER BY date_expense ASC",
          [selectedDate.start, selectedDate.end]
        )
        .then((result) => {
          return result[0];
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (selectedDate.start !== undefined && selectedYear !== "") {
      return db
        .execute(
          "SELECT * FROM expenses WHERE date_expense >= Date(?) AND date_expense <= Date(?) AND date_expense like ? ORDER BY date_expense ASC",
          [selectedDate.start, selectedDate.end, selectedYear + "%"]
        )
        .then((result) => {
          return result[0];
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  static viewSummeryYear(id, materialType, selectedYear) {
    if (selectedYear == "") {
      const currentYear = new Date().getFullYear();
      console.log(currentYear);
      return db
        .execute(
          "SELECT * FROM summery WHERE material_id='" +
            id +
            "' AND material_type = '" +
            materialType +
            "'"
        )
        .then((result) => {
          var yearData = [];
          if (result[0].length !== 0) {
            result[0].map((eachData) => {
              const dbYear = new Date(eachData["summery_date"]).getFullYear();
              if (currentYear == dbYear) {
                yearData.push(eachData);
              }
            });
          }
          return yearData;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return db
        .execute(
          "SELECT * FROM summery WHERE material_id='" +
            id +
            "' AND material_type = '" +
            materialType +
            "'"
        )
        .then((result) => {
          var yearData = [];

          if (result[0].length !== 0) {
            result[0].map((eachData) => {
              const dbYear = new Date(eachData["summery_date"]).getFullYear();
              if (selectedYear == dbYear) {
                yearData.push(eachData);
              }
            });
          }
          return yearData;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  static viewType(sumType) {
    if (sumType == "RAW") {
      return db
        .execute(
          "SELECT summery.*, raw_materials.raw_name, raw_materials.raw_spec, raw_materials.raw_description FROM summery, raw_materials WHERE summery.material_id = raw_materials.id AND summery.material_type = 'RAW'"
        )
        .then((respo) => {
          return respo[0];
        })
        .catch((e) => {
          return e;
        });
    } else if (sumType == "ACCS") {
      return db
        .execute(
          "SELECT summery.*, accs_materials.accs_name, accs_materials.accs_spec, accs_materials.accs_description FROM summery, accs_materials WHERE summery.material_id = accs_materials.id AND summery.material_type = 'ACCS'"
        )
        .then((respo) => {
          return respo[0];
        })
        .catch((e) => {
          return e;
        });
    } else {
      return db
        .execute(
          "SELECT summery.*, finished_goods.finished_name, finished_goods.finished_spec, finished_goods.finished_description FROM summery, finished_goods WHERE summery.material_id = finished_goods.id AND summery.material_type = 'FIN'"
        )
        .then((respo) => {
          return respo[0];
        })
        .catch((e) => {
          return e;
        });
    }
  }

  static async selectDeletdRow(id) {
    return await db
      .execute("SELECT * FROM summery WHERE id = ?", [id])
      .then((respo) => {
        return respo[0];
      })
      .catch((e) => {
        return e;
      });
  }
  static async selectFinishedGood(id) {
    return await db
      .execute("SELECT * FROM finished_goods WHERE id = ?", [id])
      .then((respo) => {
        return respo[0];
      })
      .catch((e) => {
        return e;
      });
  }

  static async selectRawMaterials(id) {
    return await db
      .execute("SELECT * FROM raw_materials WHERE id = ?", [id])
      .then((respo) => {
        return respo[0];
      })
      .catch((e) => {
        return e;
      });
  }

  static async selectAllBelowList(id, materialID) {
    return await db
      .execute("SELECT * FROM summery WHERE id > ? AND material_id = ?", [
        id,
        materialID,
      ])
      .then((respo) => {
        return respo[0];
      })
      .catch((e) => {
        return e;
      });
  }

  static async updateBalance(materialID, balance) {
    return await db
      .execute("UPDATE finished_goods SET finished_quantity = ? WHERE id = ?", [
        balance,
        materialID,
      ])
      .then((respo) => {
        return respo[0];
      })
      .catch((e) => {
        return e;
      });
  }

  static async ittrtorUpdate(eachData, newStockAtHand, finshedMass) {
    console.log("here", eachData);

    var newStockAtHandMass = 0.0;
    var newStockAtEnd = 0.0;
    if (eachData.stock_recieved == "") {
      newStockAtEnd =
        parseFloat(newStockAtHand) - parseFloat(eachData.stock_issued);
      newStockAtHandMass = parseFloat(newStockAtEnd) * parseFloat(finshedMass);
    } else {
      newStockAtEnd =
        parseFloat(newStockAtHand) + parseFloat(eachData.stock_recieved);
      newStockAtHandMass = parseFloat(newStockAtEnd) * parseFloat(finshedMass);
    }
    return [newStockAtEnd, newStockAtHandMass];
  }

  static async updateBalanceRaw(materialID, balance) {
    return await db
      .execute("UPDATE raw_materials SET raw_quantity = ? WHERE id = ?", [
        balance,
        materialID,
      ])
      .then((respo) => {
        return respo[0];
      })
      .catch((e) => {
        return e;
      });
  }

  static async updateBalanceAccs(materialID, balance) {
    return await db
      .execute("UPDATE accs_materials SET accs_quantity = ? WHERE id = ?", [
        balance,
        materialID,
      ])
      .then((respo) => {
        return respo[0];
      })
      .catch((e) => {
        return e;
      });
  }

  static async deleteSummeryRow(id) {
    return await db
      .execute("DELETE FROM summery WHERE id = ?", [id])
      .then((respo) => {
        return [true, respo];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async updateRows(id, stockat_hand, stockat_end, stockatend_kg) {
    return await db
      .execute(
        "UPDATE summery SET stockat_hand = ?, stockat_end = ?, stockatend_kg = ? WHERE id = ?",
        [stockat_hand, stockat_end, stockatend_kg, id]
      )
      .then((respo) => {
        return respo[0];
      })
      .catch((e) => {
        return e;
      });
  }

  static async deleteSummery(id, materialId, materialType) {
    const summery = await this.selectDeletdRow(id);
    const allSummeryBellow = await this.selectAllBelowList(id, materialId);

    if (materialType == "FIN") {
      const finishedGood = await this.selectFinishedGood(materialId);
      var lastAtHand = parseFloat(summery[0].stockat_end);
      var finshedMass = finishedGood[0].finished_mass;

      console.log("summery", summery);
      console.log("finishedGood", finishedGood);
      console.log("all summery beloow ", allSummeryBellow);

      if (allSummeryBellow.length !== 0) {
        try {
          for (const eachData of allSummeryBellow) {
            //
            const result = await this.ittrtorUpdate(
              eachData,
              lastAtHand,
              finshedMass
            );
            const respon = await this.updateRows(
              eachData.id,
              lastAtHand,
              result[0],
              result[1]
            );
            console.log("respon", respon);
            lastAtHand = result[0];

            console.log("lastAtHand", lastAtHand);
          }
          const response = await this.updateBalance(materialId, lastAtHand);
          const deletResult = await this.deleteSummeryRow(id);
          return [true, "Deleted Succesfully"];
        } catch (err) {
          console.log("err", err);
          return [false, err];
        }
      } else {
        const response = await this.deleteSummeryRow(id);
        if (response[0] == true) {
          const response = await this.updateBalance(materialId, 0);
          return [true, "Deleted Succesfully"];
        } else {
          return [false, response];
        }
      }
    } else if (materialType == "RAW") {
      var lastAtHand = await summery[0].stockat_hand;

      console.log("summery", summery);

      console.log("all summery beloow ", allSummeryBellow);

      if (allSummeryBellow.length !== 0) {
        try {
          for (const eachData of allSummeryBellow) {
            var newStockAtHand = lastAtHand;
            var newStockAtHandMass = 0.0;
            var newStockAtEnd = 0.0;
            if (eachData.stock_recieved == "") {
              newStockAtEnd =
                parseFloat(newStockAtHand) - parseFloat(eachData.stock_issued);
            } else {
              newStockAtEnd =
                parseFloat(newStockAtHand) +
                parseFloat(eachData.stock_recieved);
            }
            const respon = await this.updateRows(
              eachData.id,
              newStockAtHand,
              newStockAtEnd,
              ""
            );
            lastAtHand = newStockAtEnd;
          }
          const response = await this.updateBalanceRaw(materialId, lastAtHand);
          return [true, "Deleted Succesfully"];
        } catch (err) {
          console.log("err", err);
          return [false, err];
        }
      } else {
        const response = await this.deleteSummeryRow(id);
        if (response[0] == true) {
          const response = await this.updateBalanceRaw(materialId, 0);
          return [true, "Deleted Succesfully"];
        } else {
          return [false, response];
        }
      }
    } else if (materialType == "ACCS") {
      var lastAtHand = await summery[0].stockat_hand;

      console.log("summery", summery);

      console.log("all summery beloow ", allSummeryBellow);

      if (allSummeryBellow.length !== 0) {
        try {
          for (const eachData of allSummeryBellow) {
            var newStockAtHand = lastAtHand;
            var newStockAtHandMass = 0.0;
            var newStockAtEnd = 0.0;
            if (eachData.stock_recieved == "") {
              newStockAtEnd =
                parseFloat(newStockAtHand) - parseFloat(eachData.stock_issued);
            } else {
              newStockAtEnd =
                parseFloat(newStockAtHand) +
                parseFloat(eachData.stock_recieved);
            }
            const respon = await this.updateRows(
              eachData.id,
              newStockAtHand,
              newStockAtEnd,
              ""
            );
            lastAtHand = newStockAtEnd;
          }
          const response = await this.updateBalanceAccs(materialId, lastAtHand);
          return [true, "Deleted Succesfully"];
        } catch (err) {
          console.log("err", err);
          return [false, err];
        }
      } else {
        const response = await this.deleteSummeryRow(id);
        if (response[0] == true) {
          const response = await this.updateBalanceAccs(materialId, 0);
          return [true, "Deleted Succesfully"];
        } else {
          return [false, response];
        }
      }
    }
  }
};
