package controller.trips;

import controller.time.Time;

import java.util.ArrayList;
import java.util.List;

public class MatchedTrip extends TripRequest
{
    private int price, fuelConsumptionOfPassenger;
    private List<String> ownersNames = new ArrayList<>();
    private List<Integer> allTripsIds = new ArrayList<>();
    private List<TripPartInfo> tripInfo = new ArrayList<>();
    private Time arriveTime;

    public MatchedTrip() { }

    public MatchedTrip(TripRequest tripRequest, List<Integer> allTripsIds, int fuelConsumptionOfPassenger, List<String> ownersNames, int price, Time arriveTime, List<TripPartInfo> tripInfo )
    {
        super(tripRequest);
        this.allTripsIds.addAll(allTripsIds);
        this.fuelConsumptionOfPassenger =fuelConsumptionOfPassenger;
        this.ownersNames.addAll(ownersNames);
        this.price = price;
        this.arriveTime = new Time(arriveTime);
        this.tripInfo.addAll(tripInfo);
    }

    public List<Integer> getAllTripsIds() {
        return allTripsIds;
    }

    public List<String> getOwnersNames() {
        return ownersNames;
    }

    public int getFuelConsumptionOfPassenger() {
        return fuelConsumptionOfPassenger;
    }

    public int getPrice() {
        return price;
    }


    public Time getArriveTime() {
        return arriveTime;
    }
}
