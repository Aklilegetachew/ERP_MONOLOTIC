const express = require("express");
const rawModule = require("../controllers/warehouse/rewmaterial");
const finishedMat = require("../controllers/warehouse/finishedMaterial");
const accessory = require("../controllers/warehouse/accessory");
const homepage = require("../controllers/warehouse/home");
const received = require("../controllers/warehouse/receivedMaterials");
const purchaseing = require("../controllers/warehouse/purchaseRequest");
const requstion = require("../controllers/warehouse/storeRequestion");
const summery = require("../controllers/warehouse/summery");
const searchController = require("../controllers/warehouse/searchCont");

const router = express.Router();

router.get("/rawmaterials", rawModule.getMaterials);
router.get("/rawmaterialsAll", rawModule.getMaterialsAll);
router.get("/rawmaterialsforBatch", rawModule.getMaterialsbatch);
router.post("/addnewrawmaterials", rawModule.addMaterials);
router.post("/updatenewrawmaterials", rawModule.UpdateMaterials);

router.get("/accessory", accessory.getAccessory);
router.post("/addnewAccessory", accessory.addAccessory);
router.post("/updateAccessory", accessory.UpdateAccessory);
router.post("/showAccCat", accessory.showByCatagory);

router.get("/finishedMaterial", finishedMat.getFinished);
router.post("/finishedMaterialbyCat", finishedMat.getFinishedByCat);
router.post("/addnewFinMaterials", finishedMat.addFinished);
router.post("/updateFinishedMaterials", finishedMat.UpdateFinished);

router.post("/addnewPurchased", received.newPurchased);
router.post("/confirmPurchased", received.acceptPurchased);
router.get("/shownewPurchased", received.shownewPurchased);

router.post("/requestPurchase", purchaseing.addPurchaseReq);
router.get("/showPurchaseRequested", purchaseing.showPurchaseRequest);

router.get("/showStoreRequestion", requstion.showStoreReq);
router.post("/StoreRequestion", requstion.addrequestion);
router.post("/responseStoreRequestion", requstion.responseStoreReq);
router.post("/accsRequestion", requstion.addaccsrequestion);

router.post("/showSummeryByID", summery.showById);
router.post("/showSummeryByMonth", summery.showByIdMonth);
router.post("/showSalesByMonth", summery.showBysalesByMonth);
router.post("/showBankStatmentDate", summery.showByBankByMonth);
router.post("/showExpenseByMonth", summery.showByIdExpense);
router.post("/expensesMonthly", summery.showExpensesMontly);
router.post("/showSummeryByYear", summery.showByIdYear);
router.post("/showAllByType", summery.showByType);
router.post("/deleteStockSummery", summery.deleteStockSummery)

///// for searching purpuse endpoints
router.post("/searchName", searchController.searchName);
router.post("/searchSpec", searchController.searchSpec);

///////////////////////////////////////////////////////////

// sales Module route

const Home = require("../controllers/sales/Home.js");
const customers = require("../controllers/sales/customers");
const requestForm = require("../controllers/sales/requestController");
const storeRelease = require("../controllers/sales/salesStoreController");
const sales_summery = require("../controllers/sales/summeryReport");
const salesOrder = require("../controllers/sales/salesOrderController");

router.post("/makesalesProductionOrder", salesOrder.requestProductionOrder);

router.post("/addCustomers", customers.addCustomers);
router.get("/showCustomers", customers.showCustomers);

router.post("/addFinRequest", requestForm.finishedMaterialRequest);

router.get("/showAcceptedRequestions", requestForm.showStatus);
router.post("/makeSale", storeRelease.makeSales);
router.post("/makeComplete", storeRelease.makeComplete);
router.post("/acceptSalesOrder", storeRelease.AcceptSales);
router.post("/acceptBulkSalesOrder", storeRelease.AcceptBulkSales);
router.post("/finishedgoodRequestion", storeRelease.requestFinishedGood);

router.post("/confirmStoreRelease", storeRelease.confirmRelease);
router.post("/deleteSales", storeRelease.deleteSalesOrder);
router.get("/salesSummery", sales_summery.showAllSummery);
router.post("/showBankStatment", salesOrder.salesBankStatments);
router.post("/salesDelete", salesOrder.DeleteSales); ///// delete Accepted not working

router.post("/creatSalesOrder", salesOrder.creatSalesOrder);
router.post("/creatBulkSalesOrder", salesOrder.creatBulkSalesOrder);
router.post("/showCartbyId", salesOrder.showCartByID);

router.get("/showSalesOrder", salesOrder.showSalesOrder);
router.get("/showSalesOrderpayment", salesOrder.showSalesOrderPA);
router.post("/showSalesOrderById", salesOrder.showSalesOrderById);
router.post("/selectSalesOrder", salesOrder.selectSalesOrder);

/////////////////////////////////////////////////////////////////////////////////////

// production Module

const batchCont = require("../controllers/production/batchController");
const production = require("../controllers/production/production");

router.post("/addbatchformula", batchCont.addBatch);
router.get("/showbatchformula", batchCont.showBatch);
router.post("/selectbatch", batchCont.selectBatch);

router.post("/addProductionOrder", production.addNewproductionOrder);
router.get("/showProductionOrder", production.showproductionOrder);
router.post("/startProduction", production.startProduction);
router.post("/rawmaterialRequest", production.rawMaterialRequest);
router.get("/showrawmaterialRequest", production.showrawMaterialRequest);
router.get("/rawmaterialRequestResponse", production.resporawMaterialRequest);
router.post("/editBatch", production.editBatch);

router.post("/deleteProductionOrderRow", production.deleteOrder);

router.post("/addProductProduced", production.productFinshed);
router.get("/showFinishedProduction", production.showFinishedProduction);
router.post("/makeSummery", production.summeryMaker);
router.post("/addproductFinished", production.addFinshedProduction);

router.post("/addproductionGM", production.addProductiionGM);
router.get("/showOrderGM", production.showProductionGM);
router.post("/ShowGmOrderById", production.showProductionGMID);
router.post("/changerawvalue", production.updateprice);

////////////////////////////////////////////////////////
// finance module

const accountPayable = require("../controllers/finance/accountPayable");
const assetMangment = require("../controllers/finance/assetManagment");
const accountRecivable = require("../controllers/finance/accountRecivable");
const pettyCash = require("../controllers/finance/pettyCash");

router.post("/accountPayable", accountPayable.addaccountPayable);
router.post("/accountPayed", accountPayable.responsPayable);
router.get("/showaccountpayable", accountPayable.showAllPayable);
router.post("/showReasonById", accountPayable.showReasonById);
router.get("/showProductionCost", accountRecivable.showProductionCost);
router.post("/generateProfit", accountRecivable.generateProfit);
router.get("/showsalesProfit", accountRecivable.showSalesProfit);
router.post("/updateProfit", accountRecivable.updateProfit);

// change the cash managment part updating the value

router.post("/accountRecivable", accountRecivable.addRecivable);
router.get("/showaccountRecivable", accountRecivable.showRecivable);
router.post("/completeSalesOrder", accountPayable.makeCompelte);
router.post("/completeRecibableSalesOrder", accountRecivable.makeCompelte);
router.post("/completePayment", accountRecivable.makepaymentCompelte);
router.get("/shoesalesOrderProd", accountRecivable.showSalesOrder);
router.get("/showsalesOrderprofit", accountRecivable.showSalesOrderPro);
router.post("/shoesalesOrderProdById", accountRecivable.showSalesOrderById);
router.post("/deleteCostSummery", accountRecivable.deletebatchCost);
router.post("/deleteSales", accountRecivable.deletebatchCost);

router.post("/subAsset", assetMangment.subAsset);
router.post("/addAsset", assetMangment.addAsset);

router.post("/addPettyCash", pettyCash.addcash);
router.get("/showPettyCash", pettyCash.showCash);

router.get("/showAssetMang", assetMangment.showAll);
router.post("/showAssetByType", assetMangment.showAllType);

router.post("/addExpense", assetMangment.addExpense);
router.post("/showExpense", assetMangment.showExpense);
router.post("/deleteExpense", assetMangment.deleteExpense);

////////////////////////////////////////////////////////////////////////

// Authentication

const auth = require("../controllers/authentication/authentication");

router.post("/signup", auth.signup);
router.post("/login", auth.login);

///////////////////////////////////////////////////////////////////////////////
// Dashboard

const dashboard = require("../controllers/dashboard/profite");

router.get("/getProfit", dashboard.showProfit);
router.get("/getuncollectedMoney", dashboard.getuncollected);
router.get("/salesTotalYearly", dashboard.salesYearly);
router.post("/selectproductionCost", dashboard.selectProductionCost);
router.get("/donutgraph", dashboard.groupsalesProduct);
router.get("/salesOnlyUncollected", dashboard.Uncollected);
router.get("/getprofitDetail", dashboard.getProfitDetail);
router.get("/lastFiveSalesOrders", dashboard.getLastFive);
router.get("/getMonthExpense", dashboard.monthlyExpense);

///////////////////////////////////////////////////////////
router.post("/diameterSelect", dashboard.selectDiameter);
router.get("/finishedGoodSelect", dashboard.selectAllFin)
router.get("/colorSelect", dashboard.getLastFive);
router.get("/nameSelect", dashboard.getLastFive);

////////////////////////////////////////////////////////////////////////////////////

// Generating Report

router.get("/generateExcel", dashboard.getExcelFile);

///////////////////////////////////////////////////////////////////////////////////
// Notification

router.post("/sendNotification", dashboard.NotifyingTG);

router.get("/", Home.home);

module.exports = router;
