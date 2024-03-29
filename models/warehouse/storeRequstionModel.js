const db = require("../../util/db");
const axios = require("axios");
const finAxios = require("../../midelware/financeaxios");
const assetManagemnt = require("../finance/assetManagemntModule");
const accountRecivable = require("..//finance/accountRecivable");

module.exports = class storeRequestion {
  static showRequstion() {
    return db
      .execute("SELECT * FROM material_request WHERE mat_status = 'PENDING'")
      .then((result) => {
        return result[0];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static async financeRecevable(newData) {
    // console.log("finance", newData);
    const salesInfo = await accountRecivable.selectfromSales(
      newData.raw_salesId
    );
    // console.log("salesInfo", salesInfo);
    const GID = await accountRecivable.addtoReasonrequ(newData);
    // console.log("gid", GID)
    const respo = await accountRecivable.addToRecivable(
      salesInfo[0],
      GID,
      newData.raw_salesId
    );
    return respo;

  }

  static acceptRecived(itemID) {
    return db
      .execute("SELECT * FROM material_request WHERE id = '" + itemID + "'")
      .then((result) => {
        if (result[0][0].mat_status == "ACCEPTED") {
          return "ALREADY CONFIRMED";
        } else {
          return db
            .execute("SELECT * FROM material_request WHERE id='" + itemID + "'")
            .then((result) => {
              var newMatData;
              if (result[0][0].req_materialtype == "ACCS") {
                newMatData = {
                  accs_name: result[0][0].mat_requestname,
                  accs_materialcode: result[0][0].mat_materialcode,
                  accs_requestdept: result[0][0].mat_requestdept,
                  accs_reqpersonid: result[0][0].mat_reqpersonid,
                  accs_quantity: result[0][0].mat_quantity,
                  materialtype: result[0][0].req_materialtype,
                  raw_prodId: result[0][0].prodID,
                  raw_salesId: result[0][0].salesID,
                  FsNumber: result[0][0].FsNumber,
                  accs_date: result[0][0].mat_requestdate,
                };
              } else if (result[0][0].req_materialtype == "RAW") {
                newMatData = {
                  raw_name: result[0][0].mat_requestname,
                  raw_description: result[0][0].mat_description,
                  raw_requestdept: result[0][0].mat_requestdept,
                  raw_reqpersonid: result[0][0].mat_reqpersonid,
                  raw_quantity: result[0][0].mat_quantity,
                  materialtype: result[0][0].req_materialtype,
                  raw_spec: result[0][0].mat_spec,
                  raw_prodId: result[0][0].prodID,
                  raw_salesId: result[0][0].salesID,
                  raw_materialcode: result[0][0].mat_materialcode,
                  FsNumber: result[0][0].FsNumber,
                  raw_date: result[0][0].mat_requestdate,
                };
              } else if (result[0][0].req_materialtype == "FIN") {
                newMatData = {
                  fin_name: result[0][0].mat_requestname,
                  fin_description: result[0][0].mat_description,
                  fin_requestdept: result[0][0].mat_requestdept,
                  fin_reqpersonid: result[0][0].mat_reqpersonid,
                  fin_quantity: result[0][0].mat_quantity,
                  materialtype: result[0][0].req_materialtype,
                  raw_prodId: result[0][0].prodID,
                  raw_salesId: result[0][0].salesID,
                  fin_color: result[0][0].finished_Color,
                  fin_materialcode: result[0][0].mat_materialcode,
                  fin_diameter: result[0][0].finished_diameter,
                  fin_date: result[0][0].mat_requestdate,
                };
              }

              return newMatData;
            });
        }
      });
  }

  static makeAccept(itemID) {
    return db
      .execute(
        "UPDATE material_request SET mat_status = 'ACCEPTED' WHERE id='" +
          itemID +
          "'"
      )
      .then((result) => {
        return "accepted";
      });
  }

  static financeSubAsset(newData, dataType) {
    console.log(newData);

    if (dataType == "ACCS") {
      assetManagemnt.subAssetaccs(newData).then((respo) => {
        if (respo[0]) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      assetManagemnt.subAssetraw(newData).then((respo) => {
        if (respo[0]) {
          return true;
        } else {
          return false;
        }
      });
    }
  }

  static addstoreRequestion(materialRequested) {
    return db
      .execute(
        "INSERT INTO material_request(mat_requestname, mat_requestdept, mat_reqpersonid, mat_description, mat_quantity, req_materialtype, mat_status, salesID, prodID, mat_unit, mat_spec, FsNumber, mat_materialcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          materialRequested.mat_requestname,
          materialRequested.mat_requestdept,
          materialRequested.mat_reqpersonid || "",
          materialRequested.mat_description || "",
          materialRequested.mat_quantity,
          materialRequested.req_materialtype,
          "PENDING",
          materialRequested.SalesId || " ",
          materialRequested.ProductionId || " ",
          materialRequested.mat_unit || "",
          materialRequested.mat_spec || "",
          materialRequested.FsNumber || "",
          materialRequested.mat_materialcode || "",
        ]
      )
      .then((result) => {
        return true;
      })
      .catch((err) => {
        console.log("yhuyuyuuy", err);
        return false;
      });
  }

  static async addstoreRequestionAccs(materialRequested) {
    const date = new Date(materialRequested.requestDate);
    const today = new Date();
    return await db
      .execute(
        "INSERT INTO material_request(mat_requestdate, mat_requestname, mat_requestdept, mat_reqpersonid, mat_quantity, req_materialtype, mat_status, mat_unit, FsNumber, mat_materialcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          date || today,
          materialRequested.material_name,
          "Production",
          materialRequested.request_person || "",
          materialRequested.materialQty,
          "ACCS",
          "PENDING",
          materialRequested.measuring_unit || " ",
          materialRequested.FS_number || " ",
          materialRequested.material_code || "",
        ]
      )
      .then((result) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  }
};
