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
router.post("/showSummeryByYear", summery.showByIdYear);
router.post("/showAllByType", summery.showByType);

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

router.post("/confirmStoreRelease", storeRelease.confirmRelease);

router.get("/salesSummery", sales_summery.showAllSummery);

router.post("/creatSalesOrder", salesOrder.creatSalesOrder);
router.get("/showSalesOrder", salesOrder.showSalesOrder);
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


router.post("/addProductProduced", production.productFinshed);
router.get("/showFinishedProduction", production.showFinishedProduction);
router.post("/makeSummery", production.summeryMaker);

router.post("/addproductionGM", production.addProductiionGM);
router.get("/showOrderGM", production.showProductionGM);
router.post("/ShowGmOrderById", production.showProductionGMID);

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
router.get("/showProductionCost", accountRecivable.showProdutionCost);

// change the cash managment part updating the value

router.post("/accountRecivable", accountRecivable.addRecivable);
router.get("/showaccountRecivable", accountRecivable.showRecivable);
router.post("/completeSalesOrder", accountPayable.makeCompelte);
router.post("/completeRecibableSalesOrder", accountRecivable.makeCompelte);
router.get("/shoesalesOrderProd", accountRecivable.showSalesOrder);
router.post("/shoesalesOrderProdById", accountRecivable.showSalesOrderById);

router.post("/subAsset", assetMangment.subAsset);
router.post("/addAsset", assetMangment.addAsset);

router.post("/addPettyCash", pettyCash.addcash);
router.get("/showPettyCash", pettyCash.showCash);

router.get("/showAssetMang", assetMangment.showAll);
router.post("/showAssetByType", assetMangment.showAllType);

router.post("/addExpense", assetMangment.addExpense)
router.post("/showExpense", assetMangment.showExpense)


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

///////////////////////////////////////////////////////////
router.post("/diameterSelect", dashboard.selectDiameter);
router.get("/colorSelect", dashboard.getLastFive);
router.get("/nameSelect", dashboard.getLastFive);

router.get("/", Home.home);

module.exports = router;
