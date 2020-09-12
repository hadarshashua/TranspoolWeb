var refreshRate = 2000; //milli seconds

var BALANCE_URL = buildUrlWithContextPath("/balance");
var USER_ACTIONS_LIST_URL = buildUrlWithContextPath("userActionslist");
var MAPS_LIST_URL = buildUrlWithContextPath("mapslist");
var MAP_URL= buildUrlWithContextPath("/map");
var LOAD_MONEY = buildUrlWithContextPath("/loadMoney");
var MATCH_NOTIFICATION = buildUrlWithContextPath("MatchNotification");
var FEEDBACK_NOTIFICATION = buildUrlWithContextPath("/feedbackNotification");
var FILE_UPLOAD = buildUrlWithContextPath("upload");

// let's start the jQuery while I wait.
// step 1: onload - capture the submit event on the form.
$(function() { // onload...do
    $("#uploadForm").submit(function() {

        var file1 = this[0].files[0];

        var formData = new FormData();
        formData.append("file", file1);
        formData.append("mapName", this[1].value);

        $.ajax({
            method:'POST',
            data: formData,
            url: FILE_UPLOAD,
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            timeout: 4000,
            error: function(e) {
                console.error("Failed to submit");
                $("#result").text("Failed to get result from server " + e);
            },
            success: function(r) {
                $("#result").text(r);
            }
        });

        // return value of the submit operation
        // by default - we'll always return false so it doesn't redirect the user.
        return false;
    })
})

//activate the timer calls after the page is loaded
$(function() {
    setInterval(ajaxBalance, refreshRate); //The balance is refreshed automatically every second
    setInterval(ajaxUserActionsList, refreshRate); //The actions list is refreshed automatically every second
    setInterval(ajaxMapsList, refreshRate);
    setInterval(ajaxMatchNotifications, refreshRate);
    setInterval(ajaxFeedbackNotifications, refreshRate);
});

function ajaxBalance() {
    $.ajax({
        url: BALANCE_URL,
        success: function(value) {
            updateBalance(value);
        }
    });
}

function showMoneyLoader() {
    document.getElementById("load-money").style.display = "block";
}

function showAccountOperations() {
    document.getElementById("show-operations").style.display = "block";
}

function unShowAccountOperations() {
    document.getElementById("show-operations").style.display = "none";
}

$(function() { // onload...do
    $("#loadMoneyForm").submit(function () {

        var money = $("#money").val();

        $.ajax({
            method: 'GET',
            data: {"loadMoney" :money},
            url: LOAD_MONEY,
            // processData: false,
            // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            timeout: 4000,
            error: function (e) {
                console.error("Failed to submit");
                $("#result-money").text(e);
            },
            success: function (r) {
                $("#result-money").text(r);
                if(r.localeCompare("") === 0){
                    document.getElementById("load-money").style.display ="none";
                }
            }
        });

        // return value of the submit operation
        // by default - we'll always return false so it doesn't redirect the user.
        return false;
    })
})


function updateBalance(value) {
    $("#balance").text(value);
}

function ajaxUserActionsList() {
    $.ajax({
        url: USER_ACTIONS_LIST_URL,
        success: function(userActions) {
            refreshUserActionsList(userActions);
        }
    });
}

function refreshUserActionsList(userActions) {
    var actionsTable = $('.ActionsTable tbody');
    actionsTable.empty();

    userActions.forEach(function (action) {
        var tr = $(document.createElement('tr'));
        var actionType;
        if(action.action === "LOAD"){
            actionType = "Load money";
        }
        else if(action.action === "RECEIVE_PAYMENT"){
            actionType = "Recieved payment";
        }
        else{
            actionType = "Transfer payment";
        }

        var tdCreatorName = $(document.createElement('td')).text(actionType);
        var tdDate = $(document.createElement('td')).text(action.date.day + "." + action.date.month + "." + action.date.year);
        var tdPayment = $(document.createElement('td')).text(action.payment);
        var tdBalanceBefore = $(document.createElement('td')).text(action.balanceBefore);
        var tdBalanceAfter = $(document.createElement('td')).text(action.balanceAfter);

        tdCreatorName.appendTo(tr);
        tdDate.appendTo(tr);
        tdPayment.appendTo(tr);
        tdBalanceBefore.appendTo(tr);
        tdBalanceAfter.appendTo(tr);

        tr.appendTo(actionsTable);
    });
}

function ajaxMapsList() {
    $.ajax({
        url: MAPS_LIST_URL,
        success: function(allMaps) {
                refreshMapsList(allMaps);
        }
    });
}

function refreshMapsList(allMaps) {
    var mapsTable = $('.MapsTable tbody');
    mapsTable.empty();

    allMaps.forEach(function (map) {
        var tr = $(document.createElement('tr'));
        var tdCreatorName = $(document.createElement('td')).text(map.creatorName);
        var tdMapName = $(document.createElement('td')).text(map.mapName);
        var tdStations = $(document.createElement('td')).text(map.stations);
        var tdRoads = $(document.createElement('td')).text(map.roads);
        var tdNumOfOfferedTrips = $(document.createElement('td')).text(map.numOfOfferedTrips);
        var tdNumOfTripRequests = $(document.createElement('td')).text(map.numOfTripRequests + "/" + map.numOfMatchedTrips);

        var tdShowMap = $(document.createElement('td'));

        // var url = new URL("../map/passenger_map.html");
        // url.searchParams.append('name', map.creatorName);

        var form = document.createElement("form");
        form.setAttribute("method", "GET");
        form.setAttribute("action", MAP_URL);
        form.setAttribute("id", "myform");
        var username = document.createElement("input");
        username.setAttribute("value", map.mapName);
        username.setAttribute("type", "hidden");
        username.setAttribute("name", "mapName");
        form.appendChild(username);
        var button = document.createElement("input");
        button.setAttribute("value", "Go to map");
        button.setAttribute("type", "submit");
        button.setAttribute("class", "map-button");
        form.appendChild(button);

        tdShowMap[0].appendChild(form);

        tdCreatorName.appendTo(tr);
        tdMapName.appendTo(tr);
        tdStations.appendTo(tr);
        tdRoads.appendTo(tr);
        tdNumOfOfferedTrips.appendTo(tr);
        tdNumOfTripRequests.appendTo(tr);
        tdShowMap.appendTo(tr);

        tr.appendTo(mapsTable);
    });
}

function ajaxMatchNotifications() {
    $.ajax({
        url: MATCH_NOTIFICATION,
        success: function(newNotifications) {
            refreshMatchNotifications(newNotifications);
        }
    });
}

function refreshMatchNotifications(newNotifications) {

    newNotifications.forEach(function (notification) {

        var mapName = notification.mapName;
        var tripId = notification.tripId;
        var price = notification.price;

        alert("New passenger just joined your trip!\nMap name: " + mapName + "\nYour trip id: " + tripId + "\nYou got " + price + " shekels to your account");
    });
}

function ajaxFeedbackNotifications() {
    $.ajax({
        url: FEEDBACK_NOTIFICATION,
        success: function(newNotifications) {
            refreshFeedbackNotifications(newNotifications);
        }
    });
}

function refreshFeedbackNotifications(newNotifications) {

    newNotifications.forEach(function (notification) {

        var name = notification.name;
        var tripId = notification.tripId;
        var rate = notification.rate;
        var feedback = notification.message;

        if(feedback != null){
            alert("A passenger just gave you a feedback!\nPassenger name: " + name + "\nYour trip id: " + tripId + "\nThe rate: " + rate + "\nThe feedback: "+feedback);
        }
        else {
            alert("A passenger just gave you a feedback!\nPassenger name: " + name + "\nYour trip id: " + tripId + "\nThe rate: " + rate);
        }
    });
}

