const db = require("../../util/db");

module.exports = class ProfiteModule {
  static showlastFiveRecords() {
    return db
      .execute(
        "SELECT * FROM ( SELECT * FROM sales_order_prod ORDER BY id DESC LIMIT 5) AS sub ORDER BY id ASC"
      )
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static fetchProfitAll() {
    return db
      .execute("SELECT * FROM dashboard_profit")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static fetchUncollected() {
    return db
      .execute("SELECT * FROM sales_order_prod WHERE status != 'Cash'")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static fetchProfit() {
    return db
      .execute("SELECT * FROM dashboard_profit")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static fetchDiameters(nameselection){
    return db
    .execute("SELECT finished_description FROM finished_goods WHERE finished_name = '"+nameselection+"'")
    .then((respo) => {
      return [true, respo[0]];
    })
    .catch((err) => {
      return [false, err];
    });
  }

  static async fetchproductsold(keyWord) {
    return await db
      .execute(
        "SELECT SUM(total_product) AS 'Weekly_Total' FROM sales_order_prod WHERE WEEK(sales_date) = WEEK(CURDATE()) AND product_orderd LIKE '" +
          keyWord +
          "' "
      )
      .then((respo) => {
        console.log(respo[0]);
        return [true, respo[0][0].Weekly_Total];
      })
      .catch((err) => {
        console.log(err);
        return [false, err];
      });
  }

  static async fetchProductionCost(salesID) {
    return await db
      .execute(
        " SELECT * FROM dashboard_profit_detail t1 JOIN dashboard_profit t2 ON t1.salesId = '" +
          salesID +
          "' AND t2.salesID = '" +
          salesID +
          "'"
      )
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async getYearlyTotal(currentMonth) {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const currentYear = today.getFullYear();
    const lastYear = currentYear - 1;

    return await db
      .execute(
        "SELECT SUM(CASE WHEN year(sales_date) = '" +
          currentYear +
          "' AND month(sales_date) = '" +
          currentMonth +
          "' THEN totalCash ELSE 0 END) as current_year_month_total_cost, SUM(CASE WHEN year(sales_date) = '" +
          lastYear +
          "' AND month(sales_date) = '" +
          currentMonth +
          "' THEN totalCash ELSE 0 END) as last_year_month_total_cost, month(sales_date) as month FROM sales_order_prod GROUP BY month(sales_date)"
      )
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async getuncollecteds() {
    return await db
      .execute(
        "SELECT * FROM sales_order_prod WHERE status = 'Advanced' OR status = 'Credit'"
      )
      .then((respo) => {
        var totalUncollected = 0.0;

        for (let single of respo[0]) {
          if (single.status === "Advanced") {
            console.log(single.totalCash);
            totalUncollected +=
              parseFloat(single.totalCash) - parseFloat(single.advances);
          } else if (single.status === "Credit") {
            totalUncollected += parseFloat(single.totalCash);
          }
        }
        // respo[0].forEach((single) => {
        //   if (single.status === "Advanced") {
        //     totalUncollected +=
        //       parseFloat(single.totalCash) - parseFloat(single.advances);
        //   } else if (single.status === "Credit") {
        //     totalUncollected += parseFloat(single.totalCash);
        //   }
        // });
        return [true, respo[0], totalUncollected];
      })
      .catch((err) => {
        return [false, err];
      });
  }
};
