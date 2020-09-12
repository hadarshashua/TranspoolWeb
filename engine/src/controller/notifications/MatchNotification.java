package controller.notifications;

public class MatchNotification {

    private String mapName;
    private int tripId, price;

    public MatchNotification(String mapName, int tripId, int price){
        this.mapName = mapName;
        this.tripId = tripId;
        this.price = price;
    }

    public String getMapName() {
        return mapName;
    }

    public int getTripId() {
        return tripId;
    }

    public int getPrice() {
        return price;
    }
}
