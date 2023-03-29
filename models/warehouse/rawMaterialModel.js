const db = require("../../util/db");

module.exports = class rawMaterial {
  static getallMaterials() {
    return db
      .execute("SELECT * FROM raw_materials")
      .then((result) => {
        return result[0];
      })
      .catch((err) => {
        return err;
      });
  }
  static getallMaterialsB() {
    return db
      .execute(
        "SELECT raw_name, raw_materialcode, raw_materialunit FROM raw_materials"
      )
      .then((result) => {
        return result[0];
      })
      .catch((err) => {
        return err;
      });
  }

  static addRawMaterials(newMaterialForm) {
    let date = new Date(newMaterialForm.raw_date);
    const today = new Date();
    return db
      .execute(
        "INSERT INTO raw_materials(raw_date, raw_name, raw_quantity, raw_description, raw_materialcode, raw_spec, raw_materialunit, raw_value, raw_referncenum, raw_remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          date || today,
          newMaterialForm.raw_name,
          newMaterialForm.raw_quantity || "0",
          newMaterialForm.raw_description || "-",
          newMaterialForm.raw_materialcode,
          newMaterialForm.raw_spec || "-",
          newMaterialForm.raw_materialunit || "-",
          newMaterialForm.raw_value || "0",
          newMaterialForm.raw_referncenum || "",
          newMaterialForm.raw_remark || "-",
        ]
      )
      .then(() => {
        return "new raw material added";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static selectbyIDRawM(ID) {
    return db
      .execute("SELECT * FROM raw_materials WHERE id='" + ID + "'")
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static checkExisRawM(newName, material_type, mat) {
    console.log(newName);
    console.log(mat);
    return db
      .execute(
        "SELECT * FROM raw_materials WHERE raw_materialcode='" +
          mat.raw_materialcode +
          "'"
      )
      .then((result) => {
        console.log(result[0]);
        return result[0].length !== 0 ? [true, result[0]] : [false, result[0]];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static addQty(oldMat, newMat) {
    const updateQuan =
      parseInt(oldMat[0].raw_quantity) + parseInt(newMat.raw_quantity);
    return db
      .execute(
        "UPDATE raw_materials SET raw_quantity = ?, raw_value = ? WHERE id = ?",
        [updateQuan, newMat.raw_value, oldMat[0].id]
      )
      .then((result) => {
        const today = new Date();
        let date = new Date(newMat.raw_date);
        return db
          .execute(
            "INSERT INTO summery(material_id, material_type, summery_date, stockat_hand, stock_recieved, stock_issued, department_issued, stockat_end, fs_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              oldMat[0].id,
              "RAW",
              date || today,
              oldMat[0].raw_quantity,
              newMat.raw_quantity,
              "",
              newMat.personID,
              updateQuan,
              newMat.raw_referncenum,
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
    var updateQuan;
    if (oldMat[0].raw_quantity >= parseFloat(newMat.raw_quantity)) {
      updateQuan =
        parseFloat(oldMat[0].raw_quantity) - parseFloat(newMat.raw_quantity);

      return db
        .execute(
          "UPDATE raw_materials SET raw_quantity ='" +
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
                "RAW",
                newMat.raw_date || today,
                oldMat[0].raw_quantity,
                "",
                newMat.raw_quantity,
                newMat.raw_requestdept,
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

  static updatebyIDRawM(ID, updatedData) {
    return db
      .execute(
        "UPDATE raw_materials SET raw_name ='" +
          updatedData.raw_name +
          "', raw_quantity = '" +
          updatedData.raw_quantity +
          "', raw_description = '" +
          updatedData.raw_description +
          "', raw_materialcode = '" +
          updatedData.raw_materialcode +
          "', raw_spec ='" +
          updatedData.raw_spec +
          "', raw_materialunit = '" +
          updatedData.raw_materialunit +
          "', raw_value = '" +
          updatedData.raw_value +
          "', raw_referncenum = '" +
          updatedData.raw_referncenum +
          "', raw_date = '" +
          updatedData.raw_date +
          "', raw_remark = '" +
          updatedData.raw_remark +
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

// module.exports = rawMaterial;
