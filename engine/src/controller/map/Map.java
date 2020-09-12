package controller.map;

import controller.trips.AllTripsInfo;

public class Map {

    private MapDescriptor mapDescriptor;
    private AllTripsInfo allTripsInfo;
    private MapInfo mapInfo;


    public Map(generatedClasses.MapDescriptor mapDescriptor, String creatorName, String mapName)
    {
        this.mapDescriptor = new MapDescriptor(mapDescriptor);
        this.allTripsInfo = new AllTripsInfo(this.mapDescriptor);

        createMapInfo(creatorName, mapName);
    }


    public void setMapDescriptor(generatedClasses.MapDescriptor mapDescriptor) {
        this.mapDescriptor = new MapDescriptor(mapDescriptor);
    }

    public AllTripsInfo getAllTripsInfo() {
        return allTripsInfo;
    }

    public MapDescriptor getMapDescriptor() {
        return mapDescriptor;
    }

    public MapInfo getMapInfo() {
        return mapInfo;
    }

    private void createMapInfo(String creatorName, String mapName)
    {
        int stations, roads, numOfOfferedTrips, numOfTripRequests, numOfMatchedTrips;

        stations = this.mapDescriptor.getAllStations().size();
        roads = this.mapDescriptor.getAllPaths().size();
        numOfOfferedTrips = this.allTripsInfo.getAllOfferdTrips().size();
        numOfTripRequests = this.allTripsInfo.getAllTripRequests().size();
        numOfMatchedTrips = this.allTripsInfo.getAllMatchingTripRequests().size();

        this.mapInfo = new MapInfo(creatorName, mapName, stations, roads, numOfOfferedTrips, numOfTripRequests, numOfMatchedTrips);
    }

}
