var refreshRate = 4000; //milli seconds

const LIBRARY_REF ="http://www.w3.org/2000/svg";

var MAP_BUILD_URL = buildUrlWithContextPath("mapBuild");
var OFFERED_TRIPS_URL = buildUrlWithContextPath("offeredTripsBuild");
var TRIP_REQUESTS_URL = buildUrlWithContextPath("tripRequestsBuild");
var MATCHED_TRIP_URL = buildUrlWithContextPath("matchedTripBuild");
var ADD_TRIP_REQUEST_URL = buildUrlWithContextPath("/addTripRequest");
var FIND_MATCH_URL = buildUrlWithContextPath("findMatch");
var MATCH_URL = buildUrlWithContextPath("matchTrip");
var FEEDBACKS_URL = buildUrlWithContextPath("buildFeedbackDiv");
var ADD_FEEDBACK_URL = buildUrlWithContextPath("addFeedback");

var hoursList = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
var minutesList = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

var openOfferedTripsCounter = 0;
var openMatchedTripsCounter = 0;
var openTripRequestsCounter = 0;

var openOfferedTripId = -1;
var openTripRequestId = -1;
var openMatchedTripId = -1;


$(function() {
    //setInterval(ajaxMap, refresh);
    setInterval(ajaxOfferedTrips, refreshRate);
    setInterval(ajaxTripRequests, refreshRate);
    setInterval(ajaxMatchedTrips, refreshRate);
    //setInterval(ajaxTripOptions, refreshRate);
    //setInterval(ajaxFeedbacks, refreshRate);

});

$(function ajaxMap() {

    $.ajax({
        url: MAP_BUILD_URL,
        success: function(map) {
            buildMap(map);
            createLines(map);
            setStations(map);
        }
    });
});

function refreshMap()
{
    $.ajax({
        url: MAP_BUILD_URL,
        success: function(map) {
            buildMap(map);
            createLines(map);
            setStations(map);
        }
    });
}

function buildMap(map)
{
    var svgDiv = document.getElementById("svgDiv");
    svgDiv.innerHTML = "";

    var allStations = map.allStations;
    var width = map.mapBoundries.width;
    var height = map.mapBoundries.length;

    var svg = document.createElementNS(LIBRARY_REF, "svg");
    svg.setAttribute("width",width*27);
    svg.setAttribute("height",height*27);
    svg.setAttribute("id","map");
    svg.setAttribute("class","map");

    allStations.forEach(function (station) {

        var x = station.x;
        var y = station.y;

        var circle = document.createElementNS(LIBRARY_REF, "circle");
        circle.setAttribute("id", station.name);
        circle.setAttribute("cx", x*27);
        circle.setAttribute("cy", y*27);
        circle.setAttribute("r", 7);
        circle.setAttribute("class", "station");

        var text = document.createElementNS(LIBRARY_REF, "text");
        text.textContent = station.name;
        text.setAttribute("x", x*27-6);
        text.setAttribute("y", y*27-8);
        text.setAttribute("class", "text");


        svg.appendChild(circle);
        svg.appendChild(text)
    });

    svgDiv.appendChild(svg);
}

function createLines(map)
{
    var svg = document.getElementById("map");

    var allPaths = map.allPaths;
    var allStations = map.allStations;


    allPaths.forEach(function (path) {

        var from = path.from;
        var to = path.to;
        var x1, y1, x2, y2;

        allStations.forEach(function (station) {
            if(station.name === from)
            {
                x1 = station.x;
                y1 = station.y;
            }
            if(station.name === to)
            {
                x2 = station.x;
                y2 = station.y;
            }
        });

        var line = document.createElementNS(LIBRARY_REF, "line");
        line.setAttribute("x1", x1*27);
        line.setAttribute("y1", y1*27);
        line.setAttribute("x2", x2*27);
        line.setAttribute("y2", y2*27);
        line.setAttribute("class", "line");
        line.setAttribute("id", from+to);


        svg.appendChild(line);
    });

}


function setStations(map)
{
    var selectFirstStation = $('#firstStation');
    selectFirstStation.empty();

    var selectLastStation = $('#lastStation');
    selectLastStation.empty();

    var allStations = map.allStations;

    allStations.forEach(function (station) {

        var option1 = document.createElement("option");
        option1.setAttribute("value", station.name);
        option1.textContent = station.name;

        var option2 = document.createElement("option");
        option2.setAttribute("value", station.name);
        option2.textContent = station.name;

        selectFirstStation[0].appendChild(option1);
        selectLastStation[0].appendChild(option2);

    });
}

function ajaxOfferedTrips() {

    $.ajax({
        url: OFFERED_TRIPS_URL,
        success: function(offeredTripsList) {
            refreshOfferedTrips(offeredTripsList);
        }
    });
}

function refreshOfferedTrips(offeredTripsList)
{
    if(openOfferedTripsCounter !== 0){
        return;
    }
    var offeredTrips = $('#offeredTripsAccordion');
    offeredTrips.empty();

    offeredTripsList.forEach(function (trip) {
        var button = document.createElement('button');
        button.setAttribute("class", "accordionButton");
        button.textContent = trip.owner;

        button.addEventListener("click", function() {

            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if(content.style.display === "block")
            {
                content.style.display = "none";
                openOfferedTripsCounter--;
            }
            else {
                content.style.display = "block";
                openOfferedTripsCounter++;
            }

            var svg = document.getElementById("map");
            var route = trip.path;
            var allStationsNames = route.split(",");

            for(var i=0; i<allStationsNames.length -1; i++)
            {
                var firstStation = allStationsNames[i];
                var secondStation = allStationsNames[i+1];

                var station1 = document.getElementById(firstStation);
                var station2 = document.getElementById(secondStation);

                var x1 = station1.getAttribute("cx");
                var y1 = station1.getAttribute("cy");
                var x2 = station2.getAttribute("cx");
                var y2 = station2.getAttribute("cy");

                var line = document.getElementById(firstStation+secondStation);
                if(line.getAttribute("class") === "line") {
                    line.setAttribute("class", "boldLine");
                }
                else{
                    line.setAttribute("class", "line");
                }

                svg.appendChild(line);
            }
        })

        var div = document.createElement('div');
        div.setAttribute("class", "panel");

        var p = document.createElement('p');
        var minutes;

        var idLabel = $(document.createElement('h5')).text("Trip id: " + trip.id);
        var ownerLabel = $(document.createElement('h5')).text("Owner name: " +trip.owner);
        var routeLabel = $(document.createElement('h5')).text("Trip route: " +trip.path);
        var priceLabel = $(document.createElement('h5')).text("Total price: "+trip.price);
        if(trip.startTime.minutes === 0 || trip.startTime.minutes === 5){
            minutes = "0"+trip.startTime.minutes;
        }
        else{
            minutes = trip.startTime.minutes;
        }
        var startTimeLabel = $(document.createElement('h5')).text("Start time: "+trip.startTime.hour + ":" + minutes);
        if(trip.hourArrive.minutes === 0 || trip.hourArrive.minutes === 5){
            minutes = "0"+trip.hourArrive.minutes;
        }
        else{
            minutes = trip.hourArrive.minutes;
        }
        var arriveTimeLabel = $(document.createElement('h5')).text("Arrive time: "+trip.hourArrive.hour + ":" + minutes);
        var capacityLabel = $(document.createElement('h5')).text("Capacity: " + trip.capacity);
        var fuelLabel = $(document.createElement('h5')).text("Fuel consumption: " + trip.allTripFuelConsumption);

        idLabel.appendTo(p);
        ownerLabel.appendTo(p);
        routeLabel.appendTo(p);
        priceLabel.appendTo(p);
        startTimeLabel.appendTo(p);
        arriveTimeLabel.appendTo(p);
        capacityLabel.appendTo(p);
        fuelLabel.appendTo(p);

        div.appendChild(p);
        offeredTrips[0].appendChild(button);
        offeredTrips[0].appendChild(div);
    });
}


function AddTripRequest() {
    document.getElementById("addTripRequest").style.display = "block";
    document.getElementById("resultAddTrip").textContent = "";
}

function CancelTripRequest() {
    document.getElementById("addTripRequest").style.display = "none";
}


function ajaxTripRequests() {

    $.ajax({
        url: TRIP_REQUESTS_URL,
        success: function(tripRequestsList) {
            refreshTripRequests(tripRequestsList);
        }
    });
}

function refreshTripRequests(tripRequestsList)
{
    if(openTripRequestsCounter!==0){
        return;
    }
    var tripRequests = $('#tripRequestsAccordion');
    tripRequests.empty();

    tripRequestsList.forEach(function (trip) {
        var button = document.createElement('button');
        button.setAttribute("class", "accordionButton");
        button.textContent = trip.passenger.name;

        button.addEventListener("click", function() {

            //refreshMap();
            if(openTripRequestId !== -1)
            {

            }

            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if(content.style.display === "block")
            {
                content.style.display = "none";
                openTripRequestsCounter--;
            }
            else {
                content.style.display = "block";
                openTripRequestsCounter++;
            }

            var firstStation = document.getElementById(trip.startStation);
            var lastStation = document.getElementById(trip.endStation);

            if(firstStation.getAttribute("class") === "station")
            {
                firstStation.setAttribute("class", "boldStation");
                lastStation.setAttribute("class", "boldStation");
            }
            else {
                firstStation.setAttribute("class", "station");
                lastStation.setAttribute("class", "station");
            }
        })

        var div = document.createElement('div');
        div.setAttribute("class", "panel");

        var p = document.createElement('p');
        var minutes;

        var idLabel = document.createElement('h5');
        idLabel.textContent = "Trip id: " + trip.id
        var passengerLabel = $(document.createElement('h5')).text("Passenger name: " + trip.passenger.name);
        var startStationLabel = $(document.createElement('h5')).text("First station: " + trip.startStation);
        var lastStationLabel = $(document.createElement('h5')).text("Last station: "+ trip.endStation);

        if(trip.schedual.time.minutes === 0 || trip.schedual.time.minutes === 5){
            minutes = "0"+trip.schedual.time.minutes;
        }
        else{
            minutes = trip.schedual.time.minutes;
        }

        var startTimeLabel = $(document.createElement('h5')).text("Start time: "+ trip.schedual.time.hour + ":" + minutes);
        var dayLabel = $(document.createElement('h5')).text("Day: " + trip.schedual.day);

        // var form = document.createElement("form");
        // form.setAttribute("method", "GET");
        // form.setAttribute("action", FIND_MATCH_URL);
        // form.setAttribute("id", "findMatchForm");
        // var tripId = document.createElement("input");
        // tripId.setAttribute("value", trip.id);
        // tripId.setAttribute("type", "hidden");
        // tripId.setAttribute("name", "tripId");
        // tripId.setAttribute("id", "tripId");
        // form.appendChild(tripId);
        var matchButton = document.createElement("input");
        matchButton.setAttribute("value", "Find match");
        matchButton.setAttribute("type", "button");
        matchButton.setAttribute("class", "Button");

        matchButton.addEventListener("click", function() {
            //idLabel.setAttribute("name", "tripId");
            //ShowOptionsTable();
            ShowMaxOptionsDiv(trip.id);
        });

        //form.appendChild(matchButton);



        // var matchButton = document.createElement('button');
        // matchButton.setAttribute("class", "Button");
        // matchButton.textContent = "Find match";


        //idLabel.appendTo(p);
        p.appendChild(idLabel);
        passengerLabel.appendTo(p);
        startStationLabel.appendTo(p);
        lastStationLabel.appendTo(p);
        startTimeLabel.appendTo(p);
        dayLabel.appendTo(p);
        p.appendChild(matchButton);

        div.appendChild(p);
        tripRequests[0].appendChild(button);
        tripRequests[0].appendChild(div);
    });
}

function ajaxMatchedTrips() {

    $.ajax({
        url: MATCHED_TRIP_URL,
        success: function(matchedTripsList) {
            refreshMatchedTrips(matchedTripsList);
        }
    });
}

function refreshMatchedTrips(matchedTripsList)
{
    if(openMatchedTripsCounter!==0){
        return;
    }
    var matchedTrips = $('#matchedTripsAccordion');
    matchedTrips.empty();

    matchedTripsList.forEach(function (trip) {
        var button = document.createElement('button');
        button.setAttribute("class", "accordionButton");
        button.textContent = trip.passenger.name;

        button.addEventListener("click", function() {

            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if(content.style.display === "block")
            {
                content.style.display = "none";
                openMatchedTripsCounter--;
            }
            else {
                content.style.display = "block";
                openMatchedTripsCounter++;
            }

            var firstStation = document.getElementById(trip.startStation);
            var lastStation = document.getElementById(trip.endStation);

            if(firstStation.getAttribute("class") === "station")
            {
                firstStation.setAttribute("class", "boldStation");
                lastStation.setAttribute("class", "boldStation");
            }
            else {
                firstStation.setAttribute("class", "station");
                lastStation.setAttribute("class", "station");
            }

        })

        var div = document.createElement('div');
        div.setAttribute("class", "panel");

        var p = document.createElement('p');
        var minutes;

        var idLabel = $(document.createElement('h5')).text("Trip id: " + trip.id);
        var passengerLabel = $(document.createElement('h5')).text("Passenger name: " + trip.passenger.name);
        var startStationLabel = $(document.createElement('h5')).text("First station: " + trip.startStation);
        var lastStationLabel = $(document.createElement('h5')).text("Last station: "+ trip.endStation);

        if(trip.schedual.time.minutes === 0 || trip.schedual.time.minutes === 5){
            minutes = "0"+trip.schedual.time.minutes;
        }
        else{
            minutes = trip.schedual.time.minutes;
        }

        var startTimeLabel = $(document.createElement('h5')).text("Start time: "+ trip.schedual.time.hour + ":" + minutes);
        var dayLabel = $(document.createElement('h5')).text("Day: " + trip.schedual.day);
        var priceLabel = $(document.createElement('h5')).text("Total price: " + trip.price);
        var fuelLabel = $(document.createElement('h5')).text("Fuel consumption of passenger: " + trip.fuelConsumptionOfPassenger);

        if(trip.arriveTime.minutes === 0 || trip.arriveTime.minutes === 5){
            minutes = "0"+trip.arriveTime.minutes;
        }
        else{
            minutes = trip.arriveTime.minutes;
        }

        var arriveTimeLabel = $(document.createElement('h5')).text("Arrive time: " + trip.arriveTime.hour + ":" + minutes);
        var routeDescriptionlabel = $(document.createElement('h5')).text("Route description: ");

        var tripInfoList = trip.tripInfo;
        tripInfoList.forEach(function (tripInfo) {
            var info = $(document.createElement('h5')).text(" * Get on at station " + tripInfo.firstStation + " get off at station "+ tripInfo.lastStation + " with owner " + tripInfo.owner);
            info.appendTo(routeDescriptionlabel);
        });

        idLabel.appendTo(p);
        passengerLabel.appendTo(p);
        startStationLabel.appendTo(p);
        lastStationLabel.appendTo(p);
        startTimeLabel.appendTo(p);
        dayLabel.appendTo(p);
        priceLabel.appendTo(p);
        fuelLabel.appendTo(p);
        arriveTimeLabel.appendTo(p);
        routeDescriptionlabel.appendTo(p);

        div.appendChild(p);
        matchedTrips[0].appendChild(button);
        matchedTrips[0].appendChild(div);
    });
}


$(function setHourAndMinutes()
{
    var hourSelect = $('#hour');
    var minutesSelect = $('#minutes');
    var i;

    //hoursList.forEach(hour)
    for(i=0; i<hoursList.length; i++)
    {
        var option = document.createElement("option");
        option.setAttribute("value", hoursList[i]);
        option.textContent = hoursList[i];

        hourSelect[0].appendChild(option);
    }

    //minutesList.forEach(minute)
    for(i=0; i<minutesList.length; i++)
    {
        var option = document.createElement("option");
        option.setAttribute("value", minutesList[i]);
        option.textContent = minutesList[i];

        minutesSelect[0].appendChild(option);
    }
});

 function ajaxTripOptions() {

    $.ajax({
        url: FIND_MATCH_URL,
        success: function(optionsList) {
            buildOptionsTable(optionsList);
        }
    });
 }

function buildOptionsTable(optionsList) {

    var optionsTable = $('.options-table tbody');
    optionsTable.empty();

    var noMatch = document.getElementById("noMatch");

    if(optionsList == null || optionsList.length === 0){
        noMatch.textContent = "Sorry.. couldn't find options for you :(";
    }
    else{
        noMatch.textContent = "";

        var countOption = 1;

        optionsList.forEach(function (option) {

            var price = 0;
            var fuelConsumption = 0;

            var tr = $(document.createElement('tr'));
            var tdRouteDescroption = $(document.createElement('td'));

            option.forEach(function (part) {
                price = price + part.price;
                fuelConsumption = fuelConsumption + part.fuelConsumption;

                var info = $(document.createElement('h5')).text(" * Get on at station " + part.firstStation + " get off at station " + part.lastStation + " with owner " + part.owner);
                info.appendTo(tdRouteDescroption);
            });

            var tdOption = $(document.createElement('td')).text(countOption);
            var tdPrice = $(document.createElement('td')).text(price);
            var tdFuelConsumption = $(document.createElement('td')).text(fuelConsumption);
            var tdMatch = $(document.createElement('td'));

            var form = document.createElement("form");
            form.setAttribute("method", "GET");
            form.setAttribute("action", MATCH_URL);
            form.setAttribute("id", "matchForm"+countOption);
            var option = document.createElement("input");
            option.setAttribute("value", countOption);
            option.setAttribute("type", "hidden");
            option.setAttribute("name", "option");
            option.setAttribute("id", "option");
            form.appendChild(option);
            var button = document.createElement("input");
            button.setAttribute("value", "Match this trip");
            button.setAttribute("type", "submit");
            button.setAttribute("class", "table-button");
            form.appendChild(button);

            setTimeout(function(){
                $("#matchForm1").submit(function () {

                    var option = $("#option").val();

                    $.ajax({
                        method: 'GET',
                        data: {"option" :option},
                        url: MATCH_URL,
                        // processData: false,
                        // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                        //timeout: 4000,
                        error: function (e) {
                            console.error("Failed to submit");
                            $("#result-money").text(e);
                        },
                        success: function (r) {
                            $("#result-money").text(r);
                        }
                    });

                    // return value of the submit operation
                    // by default - we'll always return false so it doesn't redirect the user.
                    return false;
                })
            },0)

            setTimeout(function(){
                $("#matchForm2").submit(function () {

                    var option = $("#option").val();

                    $.ajax({
                        method: 'GET',
                        data: {"option" :option},
                        url: MATCH_URL,
                        // processData: false,
                        // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                        //timeout: 4000,
                        error: function (e) {
                            console.error("Failed to submit");
                            $("#result-money").text(e);
                        },
                        success: function (r) {
                            $("#result-money").text(r);
                        }
                    });

                    // return value of the submit operation
                    // by default - we'll always return false so it doesn't redirect the user.
                    return false;
                })
            },0)

            setTimeout(function(){
                $("#matchForm3").submit(function () {

                    var option = $("#option").val();

                    $.ajax({
                        method: 'GET',
                        data: {"option" :option},
                        url: MATCH_URL,
                        // processData: false,
                        // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                        //timeout: 4000,
                        error: function (e) {
                            console.error("Failed to submit");
                            $("#result-money").text(e);
                        },
                        success: function (r) {
                            $("#result-money").text(r);
                        }
                    });

                    // return value of the submit operation
                    // by default - we'll always return false so it doesn't redirect the user.
                    return false;
                })
            },0)

            button.addEventListener("click", function() {

                unshowOptionsTable();
                unshowMaxOptionsDiv();

                var feedbacks = document.getElementById("feedbacksDiv");

                var feedbackButton = document.createElement("input");
                feedbackButton.setAttribute("value", "Add feedbacks");
                feedbackButton.setAttribute("type", "button");
                feedbackButton.setAttribute("class", "Button");

                feedbackButton.addEventListener("click", function() {
                    document.getElementById("feedbacksDivBody").style.display = "block";
                    ajaxFeedbacks();
                })

                feedbacks.appendChild(feedbackButton);
            })

            tdMatch[0].appendChild(form);

            tdOption.appendTo(tr)
            tdPrice.appendTo(tr);
            tdFuelConsumption.appendTo(tr);
            tdRouteDescroption.appendTo(tr);
            tdMatch.appendTo(tr);

            tr.appendTo(optionsTable);

            countOption++;
        });
    }
}

function unshowOptionsTable() {
    document.getElementById("options-div").style.display = "none";
}

function unshowMaxOptionsDiv() {
    document.getElementById("maxOptionsDiv").style.display = "none";
}

function ShowOptionsTable() {
    document.getElementById("options-div").style.display = "block";
}

function CancelMatch() {
    document.getElementById("findMatchDiv").style.display = "none";
    document.getElementById("options-div").style.display = "none";
}

$(function() { // onload...do
    $("#addTripRequestForm").submit(function () {

        var parameters = $(this).serialize();

        $.ajax({
            method: 'GET',
            data: parameters,
            url: ADD_TRIP_REQUEST_URL,
            // processData: false,
            // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            //timeout: 4000,
            error: function (e) {
                console.error("Failed to submit");
                $("#result-error").text(e);
            },
            success: function (r) {
                if(r.localeCompare("Trip request added successfully!") === 0){
                    $("#resultAddTrip").text(r);
                    document.getElementById("addTripRequest").style.display = "none";
                }
                else{
                    $("#resultError").text(r);
                }
            }
        });

        // return value of the submit operation
        // by default - we'll always return false so it doesn't redirect the user.
        return false;
    })
})


$(function() { // onload...do
    $("#matchForm").submit(function () {

        var option = $("#option").val();

        $.ajax({
            method: 'GET',
            data: {"option" :option},
            url: MATCH_URL,
            // processData: false,
            // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            //timeout: 4000,
            error: function (e) {
                console.error("Failed to submit");
                $("#result").text(e);
            },
            success: function (r) {
                $("#result").text(r);
            }
        });

        // return value of the submit operation
        // by default - we'll always return false so it doesn't redirect the user.
        return false;
    })
})

$(function() { // onload...do
    $("#findMatchForm").submit(function () {

        var parameters = $(this).serialize();
        ShowOptionsTable();

        $.ajax({
            method: 'GET',
            data: parameters,
            url: FIND_MATCH_URL,
            // processData: false,
            // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            //timeout: 4000,
            error: function (e) {
                console.error("Failed to submit");
                //$("#maxOptionsResult").text(e);
            },
            success: function (r) {
                //$("#maxOptionsResult").text(r);
                buildOptionsTable(r);
            }
        });

        // return value of the submit operation
        // by default - we'll always return false so it doesn't redirect the user.
        return false;
    })
})

function ShowMaxOptionsDiv(tripId) {
    document.getElementById("maxOptionsDiv").style.display = "block";
    document.getElementById("findMatchDiv").style.display = "block";
    document.getElementById("tripId").value = tripId;
}

function ajaxFeedbacks() {

    $.ajax({
        url: FEEDBACKS_URL,
        success: function(optionList) {
            buildFeedbacksDiv(optionList);
        }
    });
}

function buildFeedbacksDiv(optionList)
{
    var feedbacksDivBody = $('#feedbacksDivBody');
    feedbacksDivBody.empty();

    var count = 0;

    optionList.forEach(function (trip) {
        count++;

        var rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "row1");

        var col1Div = document.createElement("div");
        col1Div.setAttribute("class", "col1");

        var col2Div = document.createElement("div");
        col2Div.setAttribute("class", "col2");

        var form = document.createElement("form");
        form.setAttribute("method", "GET");
        form.setAttribute("action", ADD_FEEDBACK_URL);
        form.setAttribute("id", "feedbackForm"+count);

        var ownerLabel = document.createElement('label')
        ownerLabel.textContent = "Add feedback for " + trip.owner  + " :";
        ownerLabel.setAttribute("class", "feedback-owner");

        var radioButton1 = document.createElement("input");
        radioButton1.setAttribute("type", "radio");
        radioButton1.setAttribute("id", "1");
        radioButton1.setAttribute("name", "rate");
        radioButton1.setAttribute("value", "1");

        var radioButton2 = document.createElement("input");
        radioButton2.setAttribute("type", "radio");
        radioButton2.setAttribute("id", "2");
        radioButton2.setAttribute("name", "rate");
        radioButton2.setAttribute("value", "2");

        var radioButton3 = document.createElement("input");
        radioButton3.setAttribute("type", "radio");
        radioButton3.setAttribute("id", "3");
        radioButton3.setAttribute("name", "rate");
        radioButton3.setAttribute("value", "3");

        var radioButton4 = document.createElement("input");
        radioButton4.setAttribute("type", "radio");
        radioButton4.setAttribute("id", "4");
        radioButton4.setAttribute("name", "rate");
        radioButton4.setAttribute("value", "4");

        var radioButton5 = document.createElement("input");
        radioButton5.setAttribute("type", "radio");
        radioButton5.setAttribute("id", "5");
        radioButton5.setAttribute("name", "rate");
        radioButton5.setAttribute("value", "5");

        var text = document.createElement('label');
        text.textContent = "Feedback message: ";
        text.setAttribute("class", "feedbackMessageLabel");

        var textArea = document.createElement('textarea');
        textArea.setAttribute("id", "feedbackMessage");
        textArea.setAttribute("name", "feedbackMessage");

        var rateText = $(document.createElement('label')).text(" Choose rate: ");
        var label1 = $(document.createElement('label')).text("1");
        var label2 = $(document.createElement('label')).text("2");
        var label3 = $(document.createElement('label')).text("3");
        var label4 = $(document.createElement('label')).text("4");
        var label5 = $(document.createElement('label')).text("5");

        col1Div.appendChild(ownerLabel);
        rateText.appendTo(form);
        form.appendChild(radioButton1);
        label1.appendTo(form);
        form.appendChild(radioButton2);
        label2.appendTo(form);
        form.appendChild(radioButton3);
        label3.appendTo(form);
        form.appendChild(radioButton4);
        label4.appendTo(form);
        form.appendChild(radioButton5);
        label5.appendTo(form);
        form.appendChild(text);
        form.appendChild(textArea);

        var tripId = document.createElement("input");
        tripId.setAttribute("value", trip.tripId);
        tripId.setAttribute("type", "hidden");
        tripId.setAttribute("name", "tripId");
        form.appendChild(tripId);
        var button = document.createElement("input");
        button.setAttribute("value", "Submit");
        button.setAttribute("type", "submit");
        button.setAttribute("class", "submitButton");
        form.appendChild(button);

        var resultLabel = document.createElement("label");
        resultLabel.setAttribute("id", "result"+count);
        form.appendChild(resultLabel);

        setTimeout(function(){
            $("#feedbackForm1").submit(function () {

                var parameters = $(this).serialize();

                $.ajax({
                    method: 'GET',
                    data: parameters,
                    url: ADD_FEEDBACK_URL,
                    // processData: false,
                    // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                    //timeout: 4000,
                    error: function (e) {
                        console.error("Failed to submit");
                        $("#result1").text(e);
                    },
                    success: function (r) {
                        $("#result1").text(r);
                    }
                });

                // return value of the submit operation
                // by default - we'll always return false so it doesn't redirect the user.
                return false;
            })
        },0)

        setTimeout(function(){
            $("#feedbackForm2").submit(function () {

                var parameters = $(this).serialize();

                $.ajax({
                    method: 'GET',
                    data: parameters,
                    url: ADD_FEEDBACK_URL,
                    // processData: false,
                    // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                    //timeout: 4000,
                    error: function (e) {
                        console.error("Failed to submit");
                        $("#result2").text(e);
                    },
                    success: function (r) {
                        $("#result2").text(r);
                    }
                });

                // return value of the submit operation
                // by default - we'll always return false so it doesn't redirect the user.
                return false;
            })
        },0)

        setTimeout(function(){
            $("#feedbackForm3").submit(function () {

                var parameters = $(this).serialize();

                $.ajax({
                    method: 'GET',
                    data: parameters,
                    url: ADD_FEEDBACK_URL,
                    // processData: false,
                    // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                    //timeout: 4000,
                    error: function (e) {
                        console.error("Failed to submit");
                        $("#result3").text(e);
                    },
                    success: function (r) {
                        $("#result3").text(r);
                    }
                });

                // return value of the submit operation
                // by default - we'll always return false so it doesn't redirect the user.
                return false;
            })
        },0)

        col2Div.appendChild(form);
        rowDiv.appendChild(col1Div);
        rowDiv.appendChild(col2Div);
        feedbacksDivBody[0].appendChild(rowDiv);
    });

    var cancelButton = document.createElement("input");
    cancelButton.setAttribute("value", "Cancel");
    cancelButton.setAttribute("type", "button");
    cancelButton.setAttribute("class", "Button");
    feedbacksDivBody[0].appendChild(cancelButton);
    var finishButton = document.createElement("input");
    finishButton.setAttribute("value", "Done");
    finishButton.setAttribute("type", "button");
    finishButton.setAttribute("class", "second-button");
    feedbacksDivBody[0].appendChild(finishButton);

    cancelButton.addEventListener("click", function() {
        closeFeedbacksDiv();
    })
    finishButton.addEventListener("click", function() {
        var feedbacksdiv = document.getElementById("feedbacksDiv");
        feedbacksdiv.innerHTML = "";
        feedbacksDivBody.empty();
    })
}

function closeFeedbacksDiv(){
    document.getElementById("feedbacksDivBody").style.display = "none";
}
