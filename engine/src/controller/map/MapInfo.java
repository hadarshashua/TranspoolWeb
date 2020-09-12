package controller.map;

public class MapInfo {

    private String creatorName, mapName;
    private int stations, roads, numOfOfferedTrips, numOfTripRequests, numOfMatchedTrips;

    public MapInfo(String creatorName, String mapName, int stations, int roads, int numOfOfferedTrips, int numOfTripRequests, int numOfMatchedTrips)
    {
        this.creatorName = creatorName;
        this.mapName = mapName;
        this.stations = stations;
        this.roads = roads;
        this.numOfOfferedTrips = numOfOfferedTrips;
        this.numOfTripRequests = numOfTripRequests;
        this.numOfMatchedTrips = numOfMatchedTrips;
    }


    public String getCreatorName() {
        return creatorName;
    }

    public String getMapName() {
        return mapName;
    }

    public int getStations() {
        return stations;
    }

    public int getRoads() {
        return roads;
    }

    public int getNumOfOfferedTrips() {
        return numOfOfferedTrips;
    }

    public int getNumOfTripRequests() {
        return numOfTripRequests;
    }

    public int getNumOfMatchedTrips() {
        return numOfMatchedTrips;
    }

    public void addOfferedTrip() {
        this.numOfOfferedTrips++;
    }

    public void addTripRequest() {
        this.numOfTripRequests++;
    }

    public void addMatchedTrip() {
        this.numOfMatchedTrips++;
    }
}
