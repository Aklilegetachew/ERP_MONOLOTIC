const db = require("../../util/db");

module.exports = class accessory {
  static getallFinished() {
    return db
      .execute("SELECT * FROM finished_goods")
      .then((result) => {
        return result[0];
      })
      .catch((err) => {
        return console.log(err);
      });
  }

  static getallFinishedCat(catagory, Spec) {
    console.log("cat", catagory);
    console.log("spec", Spec);
    if (catagory == "Conduit") {
      return db
        .execute(
          "SELECT * FROM finished_goods WHERE finished_name = '" +
            catagory +
            "'"
        )
        .then((result) => {
          return result[0];
        })
        .catch((err) => {
          return console.log(err);
        });
    } else {
      return db
        .execute(
          "SELECT * FROM finished_goods WHERE finished_name = '" +
            catagory +
            "' AND finished_description = '" +
            Spec +
            "'"
        )
        .then((result) => {
          return result[0];
        })
        .catch((err) => {
          return console.log(err);
        });
    }
  }

  static addFinishedMat(newMaterialForm) {
    let date = new Date(newMaterialForm.fin_date);
    const today = new Date();
    return db
      .execute(
        "INSERT INTO finished_goods(finished_date, finished_name, finished_quantity, finished_description, finished_materialcode, finished_spec, finished_materialunit, finished_value, finished_referncenum, finished_remark, finished_catag, finished_diameter, color, finished_mass) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          date || today,
          newMaterialForm.finished_name,
          newMaterialForm.finished_quantity || "0",
          newMaterialForm.finished_description || "-",
          newMaterialForm.finished_materialcode,
          newMaterialForm.finished_spec || "-",
          newMaterialForm.finished_materialunit || "PCS",
          newMaterialForm.finished_value || "0",
          newMaterialForm.finished_referncenum || "-",
          newMaterialForm.finished_remark || "-",
          newMaterialForm.finished_name,
          newMaterialForm.finished_diameter,
          newMaterialForm.color,
          newMaterialForm.finished_mass,
        ]
      )
      .then(() => {
        return "new finished good added";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static selectbyIDFinished(ID) {
    return db
      .execute("SELECT * FROM finished_goods WHERE id='" + ID + "'")
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static updatebyIDFinished(ID, updatedData) {
    return db
      .execute(
        "UPDATE finished_materials SET finished_name ='" +
          updatedData.finished_name +
          "', finished_quantity = '" +
          updatedData.finished_quantity +
          "', finished_description = '" +
          updatedData.finished_description +
          "', finished_materialcode = '" +
          updatedData.finished_materialcode +
          "', finished_spec ='" +
          updatedData.finished_spec +
          "', finished_materialunit = '" +
          updatedData.finished_materialunit +
          "', finished_value = '" +
          updatedData.finished_value +
          "', finished_referncenum = '" +
          updatedData.finished_referncenum +
          "', finished_date = '" +
          updatedData.finished_date +
          "', finished_remark = '" +
          updatedData.finished_remark +
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
      parseFloat(oldMat[0].finished_quantity) + parseFloat(newMat.fin_quantity);
    const newValue =
      parseFloat(oldMat[0].finished_value) +
      parseFloat(newMat.fin_value) * parseFloat(newMat.fin_quantity);

    return db
      .execute(
        "UPDATE finished_goods SET finished_quantity ='" +
          updateQuan +
          "' WHERE id ='" +
          oldMat[0].id +
          "'"
      )
      .then((result) => {
        const today = new Date();
        const INMassRecived =
          parseFloat(newMat.fin_quantity) * parseFloat(oldMat[0].finished_mass);
        const INAthand =
          parseFloat(updateQuan) * parseFloat(oldMat[0].finished_mass);
        console.log("FS number", newMat.new_referncenum);
        console.log("INAthand", INAthand);
        console.log("INMassRecived", INMassRecived);

        return db
          .execute(
            "INSERT INTO summery(material_id, material_type, summery_date, stockat_hand, stock_recieved, stock_issued, department_issued, stockat_end, recived_kg, 	stockatend_kg, fs_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              oldMat[0].id,
              "FIN",
              newMat.fin_date || today,
              oldMat[0].finished_quantity,
              newMat.fin_quantity,
              "",
              newMat.personID,
              updateQuan,
              INMassRecived,
              INAthand,
              newMat.fin_referncenum,
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

  static async subQty(oldMat, newMat) {
    console.log("Founded", oldMat);
    console.log("New Mat", newMat);
    var updateQuan;
    if (oldMat[0].finished_quantity >= parseInt(newMat.fin_quantity)) {
      updateQuan =
        parseFloat(oldMat[0].finished_quantity) -
        parseFloat(newMat.fin_quantity);

      return await db
        .execute(
          "UPDATE finished_goods SET	finished_quantity ='" +
            updateQuan +
            "' WHERE id ='" +
            oldMat[0].id +
            "'"
        )
        .then((result) => {
          const INMassIssued =
            parseFloat(newMat.fin_quantity) *
            parseFloat(oldMat[0].finished_mass);
          const INAthand =
            parseFloat(updateQuan) * parseFloat(oldMat[0].finished_mass);
          console.log("FS number", newMat.salesID);
          console.log("INAthand", INAthand);
          console.log("INMassIssued", INMassIssued);
          const today = new Date();
          return db
            .execute(
              "INSERT INTO summery(material_id, material_type, summery_date, stockat_hand, stock_recieved, stock_issued, department_issued, stockat_end, issues_kg, stockatend_kg, fs_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                oldMat[0].id,
                "FIN",
                newMat.fin_date || today,
                oldMat[0].finished_quantity,
                "",
                newMat.fin_quantity,
                newMat.personID || newMat.fin_reqpersonid,
                updateQuan,
                INMassIssued,
                INAthand,
                newMat.fin_referncenum ||
                  newMat.FsNumber ||
                  newMat.raw_salesId ||
                  "",
              ]
            )
            .then((res) => {
              return "summery_Updated";
            });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      return "Low in stock";
    }
  }

  static checkExisFinM(newName, material_type, mat) {
    console.log("checker", mat);

    // return db
    //   .execute(
    //     "SELECT * FROM finished_goods WHERE LOWER(finished_name) = LOWER(?) AND finished_diameter = LOWER(?) AND LOWER(finished_materialcode) = LOWER(?) AND LOWER(color) = LOWER(?)",
    //     [
    //       mat.fin_name,
    //       mat.fin_diameter,
    //       mat.fin_materialcode,
    //       mat.fin_color || mat.final_color,
    //     ]
    //   )
    return db
      .execute(
        "SELECT * FROM finished_goods WHERE LOWER(finished_name) = LOWER(?) AND LOWER(finished_diameter) = LOWER(?) AND LOWER(finished_materialcode) = LOWER(?) AND LOWER(color) = LOWER(?) UNION SELECT * FROM finished_goods WHERE SOUNDEX(finished_name) = SOUNDEX(?) AND SOUNDEX(finished_diameter) = SOUNDEX(?) AND SOUNDEX(finished_materialcode) = SOUNDEX(?) AND SOUNDEX(color) = SOUNDEX(?)",
        [
          mat.fin_name,
          mat.fin_diameter,
          mat.fin_materialcode,
          mat.fin_color || mat.final_color,
          mat.fin_name,
          mat.fin_diameter,
          mat.fin_materialcode,
          mat.fin_color || mat.final_color,
        ]
      )
      .then((result) => {
        return result[0].length !== 0 ? [true, result[0]] : [false, result[0]];
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
