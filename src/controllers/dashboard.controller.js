const requestHandlers = require("../database/request-handlers");
const dashboardController = {};

dashboardController.renderDaskboard = async (req,res) => {
    let response;
    switch (req.user.tipo_from_tipo_utilizador) {
        case 1:
            response = await requestHandlers.getDataDashboard(req);
            response.data.forEach(element => {
                element.aviso == 1  ? element.aviso = "Yes" : element.aviso = "No";
            });
            res.render("dashboard", { titleDocument: "Dashboard" , box: response.data, currentUser: req.user });
            break;
        case 2:
            res.render("workerDashboard", { titleDocument: "Dashboard", currentUser: req.user });
            break;
        case 3:
            response = await requestHandlers.getDataClientDashboard(req);
            responseWorker = await requestHandlers.getDataWorkerDashboard(req);
            res.render("adminDashboard", { titleDocument: "Dashboard" , box: response.data, worker: responseWorker.data, addBox: true, currentUser: req.user});
            break;
        default:
            res.render("index", { currentUser: req.user });
            break;
    }
}

dashboardController.renderCreateClient = async (req,res) => {
    res.render("createClient", { titleDocument: "Create Client", currentUser: req.user });
}

dashboardController.renderCreateWorker = async (req,res) => {
    res.render("createWorker", { titleDocument: "Create Worker", currentUser: req.user });
}

dashboardController.renderCreateBox = async (req,res) => {
    res.render("createBox", { titleDocument: "Create Box", user: req.params, currentUser: req.user });
}

dashboardController.createBox = async (req,res) => {
    let response = await requestHandlers.createBox(req.body,req.params.id);
    dashboardController.renderDaskboardById({params: {id: req.params.id}},res);
}

dashboardController.renderEditBox = async (req,res) => {
    let response = await requestHandlers.findBox(req.params.id);
    res.render("editBox", { titleDocument: "Edit Box", box: response.data[0], currentUser: req.user});
}

dashboardController.editBox = async (req,res) => {
    let response = await requestHandlers.editBox(req.body,req.params.id);
    res.redirect("/dashboard");
}
dashboardController.deleteBox = async (req,res) => {
    let response = await requestHandlers.deleteBox(req.params.id);
    res.redirect("/dashboard");
}

dashboardController.renderDeleteTypeBox = async (req,res) => {
    res.render("deleteTypeBox", { titleDocument: "Delete Type Box", user: req.params, currentUser: req.user });
}

dashboardController.deleteTypeBox = async (req,res) => {
    let response = await requestHandlers.deleteTypeBox(req.body,req.params.id);
    dashboardController.renderDaskboardById({params: {id: req.params.id}},res);
}

dashboardController.renderBoxType = async (req,res) => {
    res.render("boxType", { titleDocument: "Box Type" , user: req.params, currentUser: req.user});
}

dashboardController.createBoxType = async (req,res) => {
    let response = await requestHandlers.createBoxType(req.body,req.params.id);
    dashboardController.renderDaskboardById({params: {id: req.params.id}},res);
}

dashboardController.findTypesBox = async (req,res) => {
    let response = await requestHandlers.findTypesBox(req.params.id);
    res.json({
        response
    });
}

dashboardController.createClient = async (req,res) => {
    let response = await requestHandlers.createClient(req.body);
    res.redirect("/dashboard");
}

dashboardController.createWorker = async (req,res) => {
    let body = await JSON.parse(Object.keys(req.body)[0]);
    let response = await requestHandlers.createWorker(body);
    res.json({ response });
}

dashboardController.manageBox = async (req,res) => {
    if(req.params.value == "E"){
        let response = await requestHandlers.manageBox(req.params);
        res.json({ response }); 
    } else {
        // Caixa cheia
        let response = await requestHandlers.manageTimeBox(req.params);
        res.json({ response }); 
    }
}

dashboardController.renderDaskboardById = async (req,res) => {
    let response = await requestHandlers.getDataDashboardById(req.params.id);
    response.data.forEach(element => {
        element.aviso == 1  ? element.aviso = "Yes" : element.aviso = "No";
    });
    res.render("dashboard", { titleDocument: "Dashboard" , box: response.data, addBox: true, user: req.params, currentUser: req.user});
}

dashboardController.renderBoxQrcode = async (req,res) => {
    let response = await requestHandlers.getBoxQrcode(req.params.id);
    if(response.message == "success"){
        if(parseInt(response.data[0].aviso) == 1){
            response.data[0].aviso = "Yes"
        } else {
            response.data[0].aviso = "No"
        }
    }
    res.render("dashboardQrCode", { titleDocument: "Box Data" , box: response.data});
}

dashboardController.getBoxAppQrcode = async (req,res) => {
    let response = await requestHandlers.getBoxAppQrcode(req.params.id);
    if(response.message == "success"){
        res.json({response});
    } else {
        res.json({error: "error"});
    }
}

dashboardController.renderSupport = (req,res) => {
    res.render("support", { titleDocument: "Suporte" });
}

dashboardController.addTicketSupport = async (req,res) => {
    let body = await JSON.parse(Object.keys(req.body)[0]);
    let response = await requestHandlers.addTicketSupport(req,body.id);
    res.json({ response });
}

dashboardController.deleteTicketSupport = async (req,res) => {
    let body = await JSON.parse(Object.keys(req.body)[0]);
    let response = await requestHandlers.deleteTicketSupport(req,body.id);
    res.json({ response });
}

dashboardController.getSupportTickets = async (req,res) => {
    let response = await requestHandlers.getSupportTickets(req.user.id);
    res.json({ response });
}

dashboardController.renderBoxStatistics = async (req,res) => {
    res.render("boxStatistics", { titleDocument: "Box Statistics", currentUser: req.user, box: req.params });
}

dashboardController.boxStatistics = async (req,res) => {
    let response = await requestHandlers.boxStatistics(req.params.id);
    res.json({ response });
}

dashboardController.renderClientStatistics = async (req,res) => {
    res.render("clientStatistics", { titleDocument: "Client Statistics", currentUser: req.user, user: req.params});
}

dashboardController.renderWorkerStatistics = async (req,res) => {
    res.render("workerStatistics", { titleDocument: "Worker Statistics", currentUser: req.user, user: req.params});
}

dashboardController.registerBoxEmptied = async (req,res) => {
    let body = await JSON.parse(Object.keys(req.body)[0]);
    let response = await requestHandlers.registerBoxEmptied(body, req.user.id);
    res.json({response});
}

dashboardController.registerBoxApp = async (req,res) => {
    let {id,quantity,weight,date,idUser} = req.params;
    let send = {idBox:id,total:quantity,peso:weight,date};
    let response = await requestHandlers.registerBoxEmptied(send, idUser);
    res.json({response});
}

dashboardController.getStatusBox = async (req,res) => {
    let {company} = req.params;
    let response = await requestHandlers.getStatusBox(company);
    res.json({response});
}

dashboardController.getClientStatistics = async (req,res) => {
    let response = await requestHandlers.getClientStatistics(req.params.id);
    res.json({ response });
}

dashboardController.getWorkerStatistics = async (req,res) => {
    let response = await requestHandlers.getWorkerStatistics(req.params.id);
    res.json({ response });
}

dashboardController.renderEditClient = async (req,res) => {
    let response = await requestHandlers.getClientById(req.params.id);
    res.render("editClient", { titleDocument: "Client Statistics", client: response.data[0], currentUser: req.user });
}

dashboardController.renderEditWorker = async (req,res) => {
    let response = await requestHandlers.getWorkerById(req.params.id);
    res.render("editClient", { titleDocument: "Worker Statistics", client: response.data[0], currentUser: req.user });
}

dashboardController.editClient = async (req,res) => {
    await requestHandlers.editClient(req.body,req.params.id);
    res.redirect("/dashboard");
 }

dashboardController.renderDeleteClient = async (req,res) => {
    await requestHandlers.deleteClient(req.params.id);
    res.redirect("/dashboard");
}

dashboardController.deleteWorker = async (req,res) => {
    await requestHandlers.deleteWorker(req.params.id);
    res.redirect("/dashboard");
}



// app

dashboardController.appLogin = async (req,res) => {
    let response = await requestHandlers.appLogin(req.params);
    if(response.data.length == 0){ response.message = "error" } 
    res.json({response});
}

module.exports = dashboardController;