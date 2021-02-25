import { ModalsEvent } from "./modalsEvent/ModalsEvent.js"; 
import { ModalsSupport } from "./modalsSupport/ModalsSupport.js"; 
import { ChartCanvas } from "./ChartCanvas/ChartCanvas.js";
import { MenuEvent } from "./MenuEvent/MenuEvent.js";

let link = "https://projeto-final-ips-2-ano.herokuapp.com/"
// let link = "http://localhost:8080/"

"use strict";
/**
 * Função que será executada quando a página estiver toda carregada, criando a variável global "info" com um objeto Information
 * Aproveitamos ainda para solicitar ao servidor o carregamento de dados de forma assincrona(ajax)
 * @memberof window
 * @params {Event} event - objeto que representará o evento
 */
window.onload = function(event) {
    var app = new App("divApp");
    app.loader();
    app.activateEvents();
    window.app = app;
};

/** 
* @class Guarda toda informação necessaria na execução do exercicio 
* @constructs App
* @param {string} id - id do elemento HTML que contém a informação.
* 
*/
function App(id) {
    this.id = id;
};

/**
 * handlers
 */
App.prototype.loader = function() {
    this.link = "https://projeto-final-ips-2-ano.herokuapp.com/"
    // this.link = "http://localhost:8080/"
    var preloader = document.querySelector('.cs-page-loading');
    preloader.classList.remove('active');
    setTimeout(() => { preloader.remove(); }, 2000);
}

/**
 * handlers
 */
App.prototype.activateEvents = function() {
    modalsEvent();
    menuEvent();
    
    let userId = document.getElementById("section");
    let sectionSupport = document.getElementById("section-suport");
    if(userId != null){ findTypes(renderTypes,userId.dataset.user); }
    if(sectionSupport != null){ activeSupportAction(); }
    
    let myChart = document.getElementById("myChart");
    if(myChart != null){
        switch (myChart.dataset.purpose) {
            case "client":
                getDataChart(renderChart,`${this.link}statistics/client/${myChart.dataset.id}`, "Numero de Contentores");
                break;
            case "worker":
                getDataChart(renderChart,`${this.link}worker/statistics/${myChart.dataset.id}`, "Numero de Contentores Trabalhados");
                break;
            case "box":
                getDataChart(renderChartBox,`${this.link}box/statistics/${myChart.dataset.id}`, "Numero de Elementos");
                break;
            default:
                break;
        }
    }
}

App.prototype.registerBoxEmptied = function() {
    let iForm = document.getElementById("worker-dashboard");
    let form = new FormData(iForm);
    let data = {
        idBox: form.get("idBox"), 
        total: form.get("total"), 
        peso: form.get("peso"), 
        date: form.get("date")
    };
    sendHttpRequest(`${this.link}worker/box`,'POST',showFeedbackWorker,data);
}

App.prototype.createWorker = function(event) {
        let iForm = document.getElementById("createWorker");
        let form = new FormData(iForm);
        let data = {
            name: form.get("name"), 
            lastName: form.get("lastName"), 
            email: form.get("email"), 
            password: form.get("password"),
            company: form.get("company")
        };
        sendHttpRequest(`${this.link}worker`,'POST',createUserChat,data,{name: data.name,lastName: data.lastName});
}

App.prototype.getConversation = function(event) {
    let id = event.currentTarget.dataset.converid;
    sendHttpRequest(`${this.link}support`,'POST',reloadSupport,{id});
}

App.prototype.ticketDone = function(event) {
    let id = event.currentTarget.dataset.converid;
    console.log(id);
    sendHttpRequest(`${this.link}support/delete`,'post',deleteSupport,{id});
}

App.prototype.openSupportChat = function(event) {
    let modalEvent = new ModalsSupport();
    let modal = document.getElementById("modal-chat");
    modal.setAttribute("data-sedId", event.currentTarget.dataset.converid);
    let btnClose = document.getElementById("close-chat");
    
    modalEvent.show(modal);
    showDataChat(event);
    
    btnClose.onclick = () => { modalEvent.hidden(modal); setTimeout(()=> {backToLoad();},100); }
    // modal.onmousedown = (event) => { modalEvent.hiddenOverlay(event,modal); setTimeout(()=> {backToLoad();},100); }
}

App.prototype.listenerEnter = function(event) {
    event.currentTarget.addEventListener('keydown', (event) => {
        if (event.keyCode == 13) {
            this.sendDataToUser(event)
          }
    });
}

App.prototype.sendDataToUser = function(event) {
    let modal = document.getElementById("modal-chat");
    let message = document.getElementById("message-input").value;
    document.getElementById("message-input").value = "";
    document.getElementById("message-input").blur();
    let acum = "";
    let id = modal.dataset.sedid;
    for(let i = 0; i < id.length -1; i++){
        if(id[i] == "_"){
            break;
        } else { acum += id[i] }}
    var receiverID = acum;
    var messageText = message;
    var receiverType = CometChat.RECEIVER_TYPE.USER;
    var textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);

    CometChat.sendMessage(textMessage).then(
    message => { 
        let modal = document.getElementById("modal-chat");
        let contentChat = document.getElementById("content-chat");
        if(modal != undefined){
            addMessageAdmin(contentChat,textMessage.text);
        }
     },
    error => {  });
}

let activeSupportAction = () =>{
    var appID = "2984070d773ac37";
    var region = "eu";
    var appSetting = new CometChat
                        .AppSettingsBuilder()
                        .subscribePresenceForAllUsers()
                        .setRegion(region)
                        .build();
    CometChat.init(appID, appSetting).then(() => {
                var UID = "ad1", apiKey = "3f6781f4d27d9bf7fe4bac0a6ac554b166f8fc24";
                CometChat.login(UID, apiKey).then( user => {
                    // Recibir mensaje en tiempo real
                    var listenerID = "listener 2";
                    CometChat.addMessageListener( listenerID, new CometChat.MessageListener({
                        onTextMessageReceived: textMessage => {
                            console.log("Text message received successfully", textMessage);
                            handleMessage(textMessage);
                            let modal = document.getElementById("modal-chat");
                            let contentChat = document.getElementById("content-chat");
                            if(modal != undefined){
                                if(modal.dataset.sedid != undefined){
                                        if(modal.dataset.sedid == textMessage.conversationId){
                                            addMessageWorker(contentChat,textMessage.text);
                                        }
                                }
                            }
                        }}));
                    // Listar mensajes
                    let conversationRequest = new CometChat
                                                .ConversationsRequestBuilder()
                                                .setLimit(50)
                                                .build();
                        conversationRequest.fetchNext().then(
                        conversationList => {sendHttpRequest(
                                            `${link}support/get`,
                                            'GET',
                                            dispatchSupport,
                                            null,
                                            conversationList)},
                        error => { console.log("Conversations list fetching failed with error:", error)});
                },
                error => {
                    swal("Login failed in the chat:","You can not send message to workers","error");    
                });
        },
        error => {
            swal("Initialization failed in the chat:","You can not send message to workers","error");
        });
}

let createUserChat = function(response, userData){
    if(response.message == "success"){
        var appID = "2984070d773ac37";
        var region = "eu";
        var appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();
        CometChat.init(appID, appSetting).then(
            () => {
            console.log("Initialization completed successfully");
            
            let apiKey = "3f6781f4d27d9bf7fe4bac0a6ac554b166f8fc24";
            var uid = `${response.data.insertId}`;
            var name = userData.name + userData.lastName;

            var user = new CometChat.User(uid);
            user.setName(name);
            CometChat.createUser(user, apiKey).then(
                user => {
                    console.log("user created", user);
                    swal("Parabéns", "Utilizador criado", "success");
                },error => {
                    console.log("error", error);
                    swal("Mais ou menos :(", "Utilizador criado sem opção ao suporte", "warning").then(res => {
                        window.location.href = `${link}/dashboard`;
                    });
                })},
        error => {
            console.log("Initialization failed with error:", error);
            swal("Mais ou menos :(", "Utilizador criado sem opção ao suporte", "warning");
        }
        );
    } else {
        swal("Erro", "Erro ao criar ao Utilizador", "error");
    }
}

let handleMessage = function(message) {
    let listGroup = document.getElementById("list-group-taked-messages");

    let a = document.createElement("a");
    a.setAttribute('href', '#');
    a.setAttribute('data-converId', message.conversationId);
    a.classList.add("list-group-item");
    a.classList.add("list-group-item-action");
    a.classList.add("d-flex");
    a.classList.add("align-items-center");
    a.classList.add("justify-content-between");
    a.classList.add("new-message");

    let p = document.createElement("p");
    p.classList.add("m-0");
    let content = document.createTextNode(`${message.sender.uid} - ${message.sender.name}`);
    p.appendChild(content);
    
    let small = document.createElement("small");
    let contentSmall = document.createTextNode(`${message.text}`);
    small.appendChild(contentSmall);

    let div1 = document.createElement("div");
    div1.appendChild(p);
    div1.appendChild(small);
    
    let button1 = document.createElement("button");
    button1.classList.add("btn");
    button1.classList.add("btn-outline-warning");
    button1.setAttribute('onClick', "javascript: app.openSupportChat(event);");
    button1.setAttribute('data-converId', message.conversationId);
    let contentButton1 = document.createTextNode("Ver");
    button1.appendChild(contentButton1);

    let button2 = document.createElement("button");
    button2.classList.add("btn");
    button2.classList.add("btn-outline-primary");
    button2.classList.add("ml-2");
    button2.setAttribute('onClick', "javascript: app.ticketDone(event);");
    button2.setAttribute('data-converId', message.conversationId);
    let contentButton2 = document.createTextNode("Feito");
    button2.appendChild(contentButton2);

    let div2 = document.createElement("div");
    div2.appendChild(button1);
    div2.appendChild(button2);

    a.appendChild(div1);
    a.appendChild(div2);
    
    Array.from(listGroup.childNodes).forEach(node => {
        if(node.dataset.converid == message.conversationId){
            listGroup.replaceChild(a, node);
        }
    });
}

let backToLoad = () => {
    let contentChat = document.getElementById("content-chat");
    contentChat.innerHTML= "";
    contentChat.classList.add("d-flex");
    contentChat.classList.add("justify-content-center");
    contentChat.classList.add("align-items-center");
    let spinner = document.createElement("div");
    spinner.classList.add("spinner-border");
    spinner.classList.add("text-success");
    spinner.setAttribute('role', 'status');
    let span = document.createElement("span");
    span.classList.add("sr-only");
    span.innerText = "Loading...";
    spinner.appendChild(span);
    contentChat.appendChild(spinner);
    
}

let showDataChat = (event) => {
    event.currentTarget.parentNode.parentNode.classList.remove("new-message");
    let id = event.currentTarget.dataset.converid;
    let acum = "";
    for(let i = 0; i < id.length -1; i++){
        if(id[i] == "_"){
            break;
        } else { acum += id[i] }}
    let messagesRequest = new CometChat.MessagesRequestBuilder()
    .setLimit(50)
    .setUID(acum)
    .build();

    messagesRequest.fetchPrevious().then(
        messages => {
            let contentChat = document.getElementById("content-chat");

            setTimeout(()=>{
                contentChat.classList.remove("d-flex");
                contentChat.classList.remove("justify-content-center");
                contentChat.classList.remove("align-items-center");
                contentChat.innerHTML= "";
            },300);

            messages.forEach(message => {
                setTimeout(()=>{
                if(message.receiverId == acum){
                    addMessageAdmin(contentChat,message.text);
                } else if(message.receiverId == "ad1"){
                    addMessageWorker(contentChat,message.text);
                }
            },300);});
            contentChat.scroll(0, contentChat.scrollHeight);
        },
        error => {
            console.log("Message fetching failed with error:", error);
            swal("Erro","Erro ao obter o historico de messagems","error").then( res => window.location.reload());
        }
    );
}

let addMessageAdmin = (contentChat,message) => {
    let admin = document.createElement("div");
    admin.classList.add("d-flex");
    admin.classList.add("justify-content-end");
    admin.classList.add("align-items-center");
    let padmin = document.createElement("p");
    padmin.classList.add("bg-success");
    padmin.classList.add("text-white");
    padmin.classList.add("px-3");
    padmin.classList.add("py-2");
    padmin.classList.add("rounded");
    padmin.classList.add("d-block");
    padmin.setAttribute('style', 'width: fit-content;');
    let contentAdmin = document.createTextNode(message);
    padmin.appendChild(contentAdmin);
    admin.appendChild(padmin);
    contentChat.appendChild(admin);
}

let addMessageWorker = (contentChat,message) => {
    let worker = document.createElement("div");
    worker.classList.add("d-flex");
    worker.classList.add("justify-content-start");
    worker.classList.add("align-items-center");
    let pworker = document.createElement("p");
    pworker.classList.add("bg-secondary");
    pworker.classList.add("text-dark");
    pworker.classList.add("px-3");
    pworker.classList.add("py-2");
    pworker.classList.add("rounded");
    pworker.classList.add("d-block");
    pworker.setAttribute('style', 'width: fit-content;');
    let contentAdminWorker = document.createTextNode(message);
    pworker.appendChild(contentAdminWorker);
    worker.appendChild(pworker);
    contentChat.appendChild(worker);
}

let reloadSupport = (response) => {
    if(response.message == "success"){
        swal("Parabéns","Ticket Adicionado com Sucesso","success").then(res => window.location.reload());
    } else {
        swal("Erro","Erro ao obter o ticket","error").then( res => window.location.reload());
    }
}

let deleteSupport = (response) => {
    if(response.message == "success"){
        swal("Parabéns","Ticket Feito com Sucesso","success").then(res => window.location.reload());
    } else {
        swal("Erro","Erro ao obter o ticket","error").then( res => window.location.reload());
    }
}

let showFeedbackWorker = response => {
    if(response.message == "success"){
        swal(`${response.message}`, "Box Updated and Registered", `${response.message}`);
    } else {
        swal(`${response.message}`, "Error Updating the Box", `${response.message}`);
    }
}

let dispatchSupport = (response,parameters) => {
    if(response.message == "success"){
        let listGroupUntakedMessages = document.getElementById("list-group-untaked-messages");
        let listGroupTakedMessages = document.getElementById("list-group-taked-messages");
        let send = "", sendTaked = "", aux = parameters;
        if(response.data.length == 0){ response.data.push({id_worker_from_cometchat:0})};
        response.data.forEach(element => {
            parameters.forEach((conversation, index, arr) => {
                if(element.id_worker_from_cometchat == conversation.conversationId){
                    sendTaked += `<a href="#" class="list-group-item list-group-item-action d-flex align-items-center justify-content-between" data-converId="${conversation.conversationId}">
                            <div>
                                <p class="m-0">${conversation.conversationWith.uid} - ${conversation.conversationWith.name}</p>
                                <small>${conversation.lastMessage.text}</small>
                            </div>
                            <div>
                                <button type="button" class="btn btn-outline-warning" onClick="javascript: app.openSupportChat(event)" data-converId="${conversation.conversationId}">Ver</button>
                                <button type="button" class="btn ml-2 btn-outline-primary" onClick="javascript: app.ticketDone(event)" data-converId="${conversation.conversationId}">Feito</button>
                            </div>
                        </a>`;
                        delete aux[index];
                }
            });
        });
        aux.map(conversation => {
            send += `<a href="#" class="list-group-item list-group-item-action d-flex align-items-center justify-content-between" >
                <div>
                    <p class="m-0">${conversation.conversationWith.uid} - ${conversation.conversationWith.name}</p>
                    <small>${conversation.lastMessage.text}</small>
                </div>
                <button type="button" class="btn btn-outline-success" onClick="javascript: app.getConversation(event)" data-converId="${conversation.conversationId}">Obter</button>
            </a>`;
        });
        listGroupUntakedMessages.innerHTML = send;
        listGroupTakedMessages.innerHTML = sendTaked;
    } else {
        swal("Erro", "Erro ao obter data do servidor", "error");
    }
}

let findTypes = (callback, userId) => sendHttpRequest(`${link}box/select/${userId}`,'GET',callback);

let getDataChart = (callback,url,lineDescription) => sendHttpRequest(url,'POST',callback,null,lineDescription);

let renderTypes = (response)=>{
    let typeInput = document.getElementById("type-input"),
    // section = document.getElementById("section"),
    content = "";
    if(response.message == "success"){
        if(response.data.length == 0){
            swal("No Type", "You have no type box!", "warning");
        } else {
            response.data.map(element =>{
                content += "<option>" + element.tipo + "</option>"
            })
            typeInput.innerHTML = content;
        }
    } else {
        swal(response.message, response.message, `${response.message}`);
    }
}


// *******************************************************************************

let sendHttpRequest = (url,method,callback,data = null,parameter = null) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
            let response = JSON.parse(xhr.response);
            callback(response.response,parameter);
        }
    }
    xhr.open(method,url);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data == null ? xhr.send() : xhr.send(JSON.stringify(data))
}

// ****************************************************************************************

let renderChart = (response,lineDescription) => {
    if(response.data.length == 0){
        let chart =  new ChartCanvas(response.data.length + 5,0,1,"myChart",lineDescription);
        chart.renderChartCanvas();
        swal("No data", "You have not data to show!", 'warning');
    } else {
        response.data.map(element => { element.data = element.data.substr(0,10); });
    let chart =  new ChartCanvas(response.data.length + 5,0,1,"myChart",lineDescription);
    chart.renderChartCanvas();
    let months = [
        { id: "01", quantity: 0 , name: "January" }, 
        { id: "02", quantity: 0, name: "February" },
        { id: "03", quantity: 0, name: "March" },
        { id: "04", quantity: 0, name: "April" }, 
        { id: "05", quantity: 0, name: "May" },
        { id: "06", quantity: 0, name: "June" },
        { id: "07", quantity: 0, name: "July" },
        { id: "08", quantity: 0, name: "August" },
        { id: "09", quantity: 0, name: "September" },
        { id: "10", quantity: 0, name: "October" },
        { id: "11", quantity: 0, name: "November" },
        { id: "12", quantity: 0, name: "December" }
    ]; 
    months.forEach(obj => { response.data.forEach(res => {
            let data = res.data.substr(5,2)
            if(obj.id == data){ obj.quantity++; } }) });
    let acum = [], acumResult = [];
    months.forEach(element => {
        if(element.quantity === 0){
            acum.push({quantity : element.quantity, name : element.name})  
        } else {
            acum.push({quantity : element.quantity, name : element.name});
            acumResult = acumResult.concat(acum);
            acum = []; 
        } });
    acumResult.forEach(element => { chart.addData(element.quantity,element.name) });
    }
}

let renderChartBox = (response,lineDescription) => {
    if(response.data.length == 0){
        let chart =  new ChartCanvas(response.data.length + 5,0,5,"myChart",lineDescription);
        chart.renderChartCanvas();
        swal("No data", "You have not data to show!", 'warning');
    } else {
        response.data.map(element => { element.data = element.data.substr(0,10); });
        let quantity = response.data[0].quantity;
        for (let i = 0; i < response.data.length - 1; i++) {
            if(quantity > response.data[i + 1].quantity){
                quantity = quantity;
            } else {
                quantity = response.data[i + 1].quantity;
            }
        }
        let chart =  new ChartCanvas(quantity + 5,0,5,"myChart",lineDescription);
        chart.renderChartCanvas();
        let months = [
            { id: "01", quantity: 0 , name: "January" }, 
            { id: "02", quantity: 0, name: "February" },
            { id: "03", quantity: 0, name: "March" },
            { id: "04", quantity: 0, name: "April" }, 
            { id: "05", quantity: 0, name: "May" },
            { id: "06", quantity: 0, name: "June" },
            { id: "07", quantity: 0, name: "July" },
            { id: "08", quantity: 0, name: "August" },
            { id: "09", quantity: 0, name: "September" },
            { id: "10", quantity: 0, name: "October" },
            { id: "11", quantity: 0, name: "November" },
            { id: "12", quantity: 0, name: "December" }
        ]; 
        months.forEach(obj => { response.data.forEach(res => {
                let data = res.data.substr(5,2)
                if(obj.id == data){ obj.quantity = res.quantity; } }) });
        let acum = [], acumResult = [];
        months.forEach(element => {
            if(element.quantity === 0){
                acum.push({quantity : element.quantity, name : element.name})  
            } else {
                acum.push({quantity : element.quantity, name : element.name});
                acumResult = acumResult.concat(acum);
                acum = []; 
            } });
        acumResult.forEach(element => { chart.addData(element.quantity,element.name) });
    }
}
    
let modalsEvent = () => {
    new ModalsEvent(
        document.getElementById("button-signin"),
        document.getElementById("modal-signin"), 
        document.getElementById("close-signin"));
}

let menuEvent = () => {
    new MenuEvent(
        document.getElementById("button-menu"),
        document.getElementById("button-times-menu"),
        document.getElementById("nav-menu"));
}