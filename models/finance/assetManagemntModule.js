const db = require("../../util/db");

module.exports = class AssetManagment {
  static uniqueId() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
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
        "INSERT INTO asset_mang(asset_name, asset_spec, asset_quantity, asset_desc, asset_exp, asset_status, department, personRequested, materialType)VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          dataID.accs_name,
          dataID.accs_spec || "specification",
          dataID.accs_quantity,
          dataID.accs_description,
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
        "INSERT INTO asset_mang(asset_name, asset_spec, asset_quantity, asset_desc, asset_exp, asset_status, department, personRequested, materialType)VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          dataID.raw_name,
          dataID.raw_spec || "specification",
          dataID.raw_quantity,
          dataID.raw_description,
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
