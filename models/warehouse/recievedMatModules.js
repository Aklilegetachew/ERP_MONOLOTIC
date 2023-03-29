const db = require("../../util/db");
const rawMat = require("./rawMaterialModel");
const axios = require("axios");
const finAxios = require("../../midelware/financeaxios");
const payableModel = require("../finance/payableModel");

module.exports = class receivedMat {
  static viewnewPurchased() {
    return db
      .execute("SELECT * FROM new_materials")
      .then((result) => {
        return result[0];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static sendFinanceAsset(newData) {
    finAxios
      .post("/addAsset", {
        newData,
      })
      .then((res) => {
        return true;
      })
      .catch((err) => {
        return err;
      });
  }

  static addonRecived(newItem) {
    let date = new Date(newItem.new_date);

    const today = new Date();
    return db
      .execute(
        "INSERT INTO new_materials(new_name, new_quantity, new_description, new_materialcode, new_spec, new_materialunit, new_value, new_referncenum, new_materialtype, new_date, new_remark, new_status,	new_person, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          newItem.new_name,
          newItem.new_quantity,
          newItem.new_description || newItem.new_diameter || "",
          newItem.new_materialcode,
          newItem.new_spec || "",
          newItem.new_materialunit,
          newItem.new_value || "",
          newItem.new_referncenum || newItem.FSNumber || "",
          newItem.new_materialtype || "FIN",
          date || today,
          newItem.new_remark || "",
          newItem.new_status || "Produced",
          newItem.userName || newItem.personID || "name needed",
          newItem.new_color || "",
        ]
      )
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static async sendFinancePayable(purchaseddata) {
    const responseArray = await payableModel.stateReason(purchaseddata);
    if (responseArray[0]) {
      payableModel
        .addingPayable(purchaseddata, responseArray[1])
        .then((result) => {
          if (result[0]) {
            return result[1];
          } else {
            return result[1];
          }
        });
    } else {
      return responseArray[1];
    }
  }

  static acceptRecived(itemID) {
    return db
      .execute("SELECT * FROM new_materials WHERE id = '" + itemID + "'")
      .then((result) => {
        // console.log(result[0][0].id)
        if (result[0][0].new_status == "ACCEPTED") {
          return "ALREADY CONFIRMED";
        } else {
      
              return db
                .execute(
                  "SELECT * FROM new_materials WHERE id='" + itemID + "'"
                )
                .then((result) => {
                  var newMatData;
                  if (result[0][0].new_materialtype == "ACCS") {
                    newMatData = {
                      accs_name: result[0][0].new_name,
                      accs_quantity: result[0][0].new_quantity,
                      accs_description: result[0][0].new_description,
                      accs_materialcode: result[0][0].new_materialcode,
                      accs_spec: result[0][0].new_spec,
                      accs_materialunit: result[0][0].new_materialunit,
                      accs_value: result[0][0].new_value,
                      accs_referncenum: result[0][0].new_referncenum,
                      accs_date: result[0][0].new_date,
                      accs_remark: result[0][0].new_remark,
                      material_type: result[0][0].new_materialtype,
                      personID: result[0][0].new_person,
                    };
                  } else if (result[0][0].new_materialtype == "RAW") {
                    newMatData = {
                      raw_name: result[0][0].new_name,
                      raw_quantity: result[0][0].new_quantity,
                      raw_description: result[0][0].new_description,
                      raw_materialcode: result[0][0].new_materialcode,
                      raw_spec: result[0][0].new_spec,
                      raw_materialunit: result[0][0].new_materialunit,
                      raw_value: result[0][0].new_value,
                      raw_referncenum: result[0][0].new_referncenum,
                      raw_date: result[0][0].new_date,
                      raw_remark: result[0][0].new_remark,
                      material_type: result[0][0].new_materialtype,
                      personID: result[0][0].new_person,
                    };
                  } else if (result[0][0].new_materialtype == "FIN") {
                    newMatData = {
                      fin_name: result[0][0].new_name,
                      fin_quantity: result[0][0].new_quantity,
                      fin_description: result[0][0].new_description,
                      fin_diameter: result[0][0].new_description,
                      fin_materialcode: result[0][0].new_materialcode,
                      fin_spec: result[0][0].new_spec,
                      fin_materialunit: result[0][0].new_materialunit,
                      fin_value: result[0][0].new_value,
                      fin_referncenum: result[0][0].new_referncenum,
                      fin_date: result[0][0].new_date,
                      fin_remark: result[0][0].new_remark,
                      material_type: result[0][0].new_materialtype,
                      personID: result[0][0].new_person,
                      final_color: result[0][0].color,
                    };
                  }

                  return newMatData;
                });
        
        }
      });
  }

  static declineRecived(itemId) {
    return db
      .execute(
        "UPDATE new_materials SET new_status = 'DECLINED' WHERE id='" +
          itemId +
          "'"
      )
      .then((res) => {
        return "Selected item declined";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static async declineRequest(itemId) {
    return await db
      .execute(
        "UPDATE material_request SET mat_status = 'DECLINED' WHERE id='" +
          itemId +
          "'"
      )
      .then((res) => {
        return "Selected item declined";
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
