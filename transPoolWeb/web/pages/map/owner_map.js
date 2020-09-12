var refreshRate = 2000; //milli seconds

const LIBRARY_REF ="http://www.w3.org/2000/svg";

var MAP_BUILD_URL = buildUrlWithContextPath("mapBuild");
var OFFERED_TRIPS_URL = buildUrlWithContextPath("offeredTripsBuild");
var TRIP_REQUESTS_URL = buildUrlWithContextPath("tripRequestsBuild");
var MATCHED_TRIP_URL = buildUrlWithContextPath("matchedTripBuild");
var ADD_OFFERED_TRIP_URL = buildUrlWithContextPath("/addOfferedTrip");
var FEEDBACKS_URL = buildUrlWithContextPath("feedbacks");
var MATCH_NOTIFICATION = buildUrlWithContextPath("MatchNotification");
var FEEDBACK_NOTIFICATION = buildUrlWithContextPath("/feedbackNotification");

var hoursList = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
var minutesList = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

var openOfferedTripsCounter = 0;
var openMatchedTripsCounter = 0;
var openTripRequestsCounter = 0;
var openFeedback = 0;

$(function() {
    setInterval(ajaxOfferedTrips, refreshRate);
    setInterval(ajaxTripRequests, refreshRate);
    setInterval(ajaxMatchedTrips, refreshRate);
    setInterval(ajaxFeedbacks, refreshRate);
    setInterval(ajaxMatchNotifications, refreshRate);
    setInterval(ajaxFeedbackNotifications, refreshRate);
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
        var passengersInfo = $(document.createElement('h3')).text("Passengers information:");

        idLabel.appendTo(p);
        ownerLabel.appendTo(p);
        routeLabel.appendTo(p);
        priceLabel.appendTo(p);
        startTimeLabel.appendTo(p);
        arriveTimeLabel.appendTo(p);
        capacityLabel.appendTo(p);
        fuelLabel.appendTo(p);
        passengersInfo.appendTo(p);

        var passengers = trip.allPassengersInTrip;

        passengers.forEach(function (passenger) {
            var passengerName = passenger.name;
            var date = passenger.date;
            var stationsDetails = trip.stops;
            var firstStation, lastStation;

            stationsDetails.forEach(function (station) {
                var stationDetails = station.stopDetails;

                stationDetails.forEach(function (stop) {
                    if(stop.passenger.name === passengerName)
                    {
                        var status = stop.status;
                        if(status === "GET_ON"){
                            firstStation = station.stationName;
                        }
                        else{
                            lastStation = station.stationName;
                        }
                    }
                });
            });

            var details = $(document.createElement('h5')).text("* " + passengerName + " joined the trip on date: "+ date.day + "." + date.month + "." + date.year);
            var detailsContinue = $(document.createElement('h5')).text(passengerName + " is getting on at " + firstStation + ", and getting off at " + lastStation);

            details.appendTo(p);
            detailsContinue.appendTo(p);
        });

        div.appendChild(p);
        offeredTrips[0].appendChild(button);
        offeredTrips[0].appendChild(div);
    });
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

        idLabel.appendTo(p);
        passengerLabel.appendTo(p);
        startStationLabel.appendTo(p);
        lastStationLabel.appendTo(p);
        startTimeLabel.appendTo(p);
        dayLabel.appendTo(p);

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


function ajaxFeedbacks() {

    $.ajax({
        url: FEEDBACKS_URL,
        success: function(feedbacks) {
            refreshFeedbacks(feedbacks);
        }
    });
}

function refreshFeedbacks(feedbacks)
{
    if(openFeedback!==0){
        return;
    }
    var feedbacksAccordion = $('#feedbacksAccordion');
    feedbacksAccordion.empty();

    var button = document.createElement('button');
    button.setAttribute("class", "feedbacks-button");
    button.textContent = "Show my feedbacks";

    button.addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if(content.style.display === "block")
        {
            content.style.display = "none";
            openFeedback--;
        }
        else {
            content.style.display = "block";
            openFeedback++;
        }
    })

    var div = document.createElement('div');
    div.setAttribute("class", "panel");

    var p = document.createElement('p');

    feedbacks.forEach(function (feedback) {

        var feedbacksList = feedback.feedbacks;

        feedbacksList.forEach(function (feedbackMsg) {

            var msg = $(document.createElement('h5')).text("* " + feedbackMsg);
            msg.appendTo(p);
        });
    });

    div.appendChild(p);
    feedbacksAccordion[0].appendChild(button);
    feedbacksAccordion[0].appendChild(div);
}

function AddOfferedTrip() {
    document.getElementById("addOfferedTrip").style.display = "block";
    document.getElementById("resultAddTrip").textContent = "";

}

function CancelOfferedTrip() {
    document.getElementById("addOfferedTrip").style.display = "none";
}

$(function() { // onload...do
    $("#addOfferedTripForm").submit(function () {

        var parameters = $(this).serialize();

        $.ajax({
            method: 'GET',
            data: parameters,
            url: ADD_OFFERED_TRIP_URL,
            // processData: false,
            // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            timeout: 4000,
            error: function (e) {
                console.error("Failed to submit");
                $("#resultAddTrip").text(e);
            },
            success: function (r) {
                if(r.localeCompare("Offered trip added successfully!") === 0){
                    $("#resultAddTrip").text(r);
                    document.getElementById("addOfferedTrip").style.display = "none";
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