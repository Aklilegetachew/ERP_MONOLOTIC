const db = require("../../util/db");

module.exports = class AssetManagment {
  static uniqueId() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  }

  static addExpenseAll(data) {
    const today = Date().now;
    return db
      .execute(
        "INSERT INTO expenses(date_expense, Item_description, uom, unit_price, total_price, fs_number, purchase_department, remark, catagory, addtional_info, expense_qunatity)VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.date_expense || today,
          data.Item_description || "-",
          data.uom || "-",
          data.unit_price || "0",
          data.total_price || "0",
          data.fs_number || "-",
          data.purchase_department || "Finance",
          data.remark || "-",
          data.catagory || "Others",
          data.addtional_info || "-",
          data.expense_quantity || "1",
        ]
      )
      .then((resp) => {
        return [true, "Expense Added"];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static showExpenseCat(data) {
    return db
      .execute("SELECT * FROM expenses WHERE catagory = ?", [data.Cat])
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static deleteExpenseId(data) {
    return db
      .execute("DELETE FROM expenses WHERE id = ?", [data.ID])
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static addAsset(dataID) {
    db.execute(
      "INSERT INTO asset_mang(asset_name, asset_spec, asset_quantity, asset_value, asset_exp, asset_status)VALUES(?, ?, ?, ?, ?, ?)",
      []
    )
      .then((resp) => {
        return [true, resp];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static showAssetsType(mattype) {
    return db
      .execute("SELECT * FROM asset_mang WHERE materialType ='" + mattype + "'")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((Err) => {
        return [false, Err];
      });
  }

  static showAllAssets() {
    return db
      .execute("SELECT * FROM asset_mang")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((Err) => {
        return [false, Err];
      });
  }

  static async subAssetaccs(dataID) {
    return await db
      .execute(
        "INSERT INTO asset_mang(asset_name, asset_spec, asset_quantity, asset_exp, asset_status, department, personRequested, materialType)VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
        [
          dataID.accs_name,
          dataID.accs_materialcode || "specification",
          dataID.accs_quantity,
          "",
          "Reqestion",
          dataID.accs_requestdept,
          dataID.accs_reqpersonid,
          dataID.materialtype,
        ]
      )
      .then((resp) => {
        return [true, resp];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async subAssetraw(dataID) {
    return await db
      .execute(
        "INSERT INTO asset_mang(asset_name, asset_date, asset_spec, asset_quantity, asset_desc, asset_exp, asset_status, department, personRequested, materialType)VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          dataID.raw_name,
          dataID.raw_date,
          dataID.raw_spec || "specification",
          dataID.raw_quantity,
          dataID.raw_materialcode,
          "",
          "Reqestion",
          dataID.raw_requestdept,
          dataID.raw_reqpersonid,
          dataID.materialtype,
        ]
      )
      .then((resp) => {
        return [true, resp];
      })
      .catch((err) => {
        return [false, err];
      });
  }
};
