const db = require("../../util/db");

module.exports = class accessory {
  static getallAccessory() {
    return db
      .execute("SELECT * FROM accs_materials")
      .then((result) => {
        return result[0];
      })
      .catch((err) => {
        return console.log(err);
      });
  }

  static showBYCatagory(cat){
    return db
    .execute("SELECT * FROM accs_materials WHERE accs_spec = '"+cat+"'")
    .then((result) => {
      return[true, result[0]] ;
    })
    .catch((err) => {
      return [false, err];
    });
  }

  static addAccessory(newMaterialForm) {
    const totalValue =
      parseFloat(newMaterialForm.accs_value) *
      parseFloat(newMaterialForm.accs_quantity);
    return db
      .execute(
        "INSERT INTO accs_materials(accs_name, accs_quantity, accs_description, accs_materialcode, accs_spec, accs_materialunit, accs_value, accs_referncenum, accs_remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          newMaterialForm.accs_name,
          newMaterialForm.accs_quantity || "0",
          newMaterialForm.accs_description || "-",
          newMaterialForm.accs_materialcode,
          newMaterialForm.accs_spec,
          newMaterialForm.accs_materialunit || "PCS",
          totalValue || "0",
          newMaterialForm.accs_referncenum || "-",    
          newMaterialForm.accs_remark || "No Remark",
        ]

        
      )
      .then(() => {
        return "new accessory material added";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static addAccsQty(oldMat, newMat) {
    const updateQuan =
      parseFloat(oldMat[0].accs_quantity) + parseFloat(newMat.accs_quantity);
    console.log(updateQuan);
    return db
      .execute(
        "UPDATE accs_materials SET accs_quantity ='" +
          updateQuan +
          "' WHERE id ='" +
          oldMat[0].id +
          "'"
      )
      .then((result) => {
        const today = new Date();
        return db
          .execute(
            "INSERT INTO summery(material_id, material_type, summery_date, stockat_hand, stock_recieved, stock_issued, department_issued, stockat_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
              oldMat[0].id,
              "ACCS",
              today,
              oldMat[0].accs_quantity,
              newMat.accs_quantity,
              "",
              newMat.personID,
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

  static async subAccsQty(oldMat, newMat) {
    var updateQuan;
    if (parseFloat(oldMat[0].accs_quantity) >= parseFloat(newMat.accs_quantity)) {
      updateQuan =
        parseFloat(oldMat[0].accs_quantity) - parseFloat(newMat.accs_quantity);

      return await db
        .execute(
          "UPDATE accs_materials SET accs_quantity ='" +
            updateQuan +
            "' WHERE id ='" +
            oldMat[0].id +
            "'"
        )
        .then((result) => {
          const today = new Date();
          return db
            .execute(
           

              "INSERT INTO summery(material_id, material_type, summery_date, stockat_hand, stock_recieved, stock_issued, department_issued, stockat_end, fs_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                oldMat[0].id,
                "ACCS",
                today,
                oldMat[0].accs_quantity,
                "",
                newMat.accs_quantity,
                newMat.accs_requestdept,
                updateQuan,
                newMat.FsNumber,
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

  static checkExisAccsM(newName, material_type, mat) {
    return db
      .execute(
        "SELECT * FROM accs_materials WHERE accs_name='" +
          newName +
          "'AND	accs_materialcode='" +
          mat.accs_materialcode +
          "'"
      )
      .then((result) => {
        return result[0].length !== 0 ? [true, result[0]] : [false, result[0]];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static selectbyIDAccess(ID) {
    return db
      .execute("SELECT * FROM accs_materials WHERE id='" + ID + "'")
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static updatebyIDAccess(ID, updatedData) {
    return db
      .execute(
        "UPDATE accs_materials SET accs_name ='" +
          updatedData.accs_name +
          "', accs_quantity = '" +
          updatedData.accs_quantity +
          "', accs_description = '" +
          updatedData.accs_description +
          "', accs_materialcode = '" +
          updatedData.accs_materialcode +
          "', accs_spec ='" +
          updatedData.accs_spec +
          "', accs_materialunit = '" +
          updatedData.accs_materialunit +
          "', accs_value = '" +
          updatedData.accs_value +
          "', accs_referncenum = '" +
          updatedData.accs_referncenum +
          "', accs_date = '" +
          updatedData.accs_date +
          "', accs_remark = '" +
          updatedData.accs_remark +
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
};
