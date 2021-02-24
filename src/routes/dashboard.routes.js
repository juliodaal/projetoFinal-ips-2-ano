const { Router } = require("express");
const router = Router();

const dashboardController = require("../controllers/dashboard.controller");

const { isAuthenticated } = require("../helpers/auth");



// Render Dashboard
router.get("/dashboard", isAuthenticated, dashboardController.renderDaskboard);

// Render Create Client
router.get("/client", isAuthenticated, dashboardController.renderCreateClient);

router.post("/client", isAuthenticated, dashboardController.createClient);

// Render Create Worker
router.get("/worker", isAuthenticated, dashboardController.renderCreateWorker);

router.post("/worker", isAuthenticated, dashboardController.createWorker);

// Render Edit Worker
router.get("/worker/edit/:id", isAuthenticated, dashboardController.renderEditWorker);

// Render Dashboard Client By Id
router.get("/dashboard/client/:id", isAuthenticated, dashboardController.renderDaskboardById);

// Render Statistics Client
router.get("/statistics/client/:id", isAuthenticated, dashboardController.renderClientStatistics);

router.post("/statistics/client/:id", isAuthenticated, dashboardController.getClientStatistics);

// Render Statistics Worker
router.get("/worker/statistics/:id", isAuthenticated, dashboardController.renderWorkerStatistics);

router.post("/worker/statistics/:id", isAuthenticated, dashboardController.getWorkerStatistics);

// Edit Client
router.get("/edit/client/:id", isAuthenticated, dashboardController.renderEditClient);

router.post("/edit/client/:id", isAuthenticated, dashboardController.editClient);

// Delete Client
router.get("/delete/client/:id", isAuthenticated, dashboardController.renderDeleteClient);

// Delete Worker
router.get("/worker/delete/:id", isAuthenticated, dashboardController.deleteWorker);

// Render Create Box
router.get("/box/:id", isAuthenticated, dashboardController.renderCreateBox);

router.post("/box/:id", isAuthenticated, dashboardController.createBox);

// Render Box Edit
router.get("/box/edit/:id", isAuthenticated, dashboardController.renderEditBox);

router.post("/box/edit/:id", isAuthenticated, dashboardController.editBox);

// Render Box Delete
router.get("/box/delete/:id", isAuthenticated, dashboardController.deleteBox);

// Render Delete Type Box
router.get("/box/type/delete/:id", isAuthenticated, dashboardController.renderDeleteTypeBox);

router.post("/box/type/delete/:id", isAuthenticated, dashboardController.deleteTypeBox);

// Render Create Box Type
router.get("/box/type/:id", isAuthenticated, dashboardController.renderBoxType);

// Create Box Type
router.post("/box/type/:id", isAuthenticated, dashboardController.createBoxType);

// Find Type Box
router.get("/box/select/:id", isAuthenticated, dashboardController.findTypesBox);

// Box Statistics By Id 
router.get("/box/statistics/:id", isAuthenticated, dashboardController.renderBoxStatistics);

router.post("/box/statistics/:id", isAuthenticated, dashboardController.boxStatistics);

// Worker Box
router.post("/worker/box", isAuthenticated, dashboardController.registerBoxEmptied);

// Box QR Code
router.get("/box/qrcode/:id", dashboardController.renderBoxQrcode);

// App Box QR Code
router.get("/box/app/qrcode/:id", dashboardController.getBoxAppQrcode);

// App Login Worker
router.post("/app/login/:email/:password", dashboardController.appLogin);

// Register Box App Worker
router.post("/app/box/register/:id/:quantity/:weight/:date/:idUser", dashboardController.registerBoxApp);

// Get Status Box App Worker
router.post("/app/box/status/:company", dashboardController.getStatusBox);

// Support
router.get("/support", isAuthenticated, dashboardController.renderSupport);

router.post("/support", isAuthenticated, dashboardController.addTicketSupport);

router.post("/support/delete", isAuthenticated, dashboardController.deleteTicketSupport);

router.get("/support/get", isAuthenticated, dashboardController.getSupportTickets);

router.get("/box/data/:value/:id", isAuthenticated, dashboardController.manageBox);

module.exports = router;