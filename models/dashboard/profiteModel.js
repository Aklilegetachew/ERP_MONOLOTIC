const db = require("../../util/db");

module.exports = class ProfiteModule {
  static async fetchUserID(data) {
    return await db
      .execute("SELECT * FROM users WHERE user_role = ? OR user_role = ?", [
        data,
        "Super Admin",
      ])
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
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
      .execute(
        "SELECT dashboard_profit.*, sales_order_prod.* FROM dashboard_profit, sales_order_prod WHERE sales_order_prod.id = dashboard_profit.salesID ORDER BY sales_date ASC"
      )
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static expenseMonthly(data) {
    return db
      .execute(
        "SELECT SUM(total_price) AS TOTALEXP FROM expenses WHERE MONTH(date_expense) = MONTH(CURRENT_DATE()) AND YEAR(date_expense) = YEAR(CURRENT_DATE())"
      )
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static fetchUncollected() {
    return db
      .execute(
        "SELECT * FROM sales_order WHERE payment != 'Cash' ORDER BY order_date ASC"
      )
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

  static fetchDiameters(nameselection) {
    return db
      .execute(
        "SELECT DISTINCT(finished_description) FROM finished_goods WHERE finished_name = '" +
          nameselection +
          "'"
      )
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static fetchuniqFin() {
    return db
      .execute(
        "SELECT DISTINCT finished_name AS name, finished_description AS description, finished_materialcode AS materialcode, finished_diameter AS diameter, color AS colors FROM finished_goods"
      )
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static async fetchproductsold(keyWord) {
    console.log(keyWord);
    return await db
      .execute(
        "SELECT SUM(CAST(total_product AS UNSIGNED)) AS 'Weekly_Total' FROM sales_order_prod WHERE WEEK(sales_date) = WEEK(CURDATE()) AND product_orderd = ? ",
        [keyWord]
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
        " SELECT cost_summery.*, production_cost.* FROM cost_summery, production_cost WHERE cost_summery.production_id = ? AND production_cost.production_id = ? ",
        [salesID, salesID]
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
        "SELECT * FROM sales_order WHERE status = 'Accepted' AND payment = 'Advanced' OR payment = 'Credit'"
      )
      .then((respo) => {
        var totalUncollected = 0.0;

        for (let single of respo[0]) {
          totalUncollected += parseFloat(single.cust_remaining);
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
