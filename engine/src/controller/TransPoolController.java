package controller;

import controller.map.Map;
import controller.map.MapDescriptor;
import controller.trips.AllTripsInfo;
import generatedClasses.PlannedTrips;
import generatedClasses.TransPool;
import users.User;

import java.util.ArrayList;
import java.util.List;


public class TransPoolController {
    TransPool transPool;
    //private MapDescriptor mapDescriptor;
    //private AllTripsInfo allTripsInfo;
    private List<Map> allMaps = new ArrayList<>();
    private List<User> allUsers = new ArrayList<>();

    public TransPoolController()
    {

    }

//    public TransPoolController(generatedClasses.TransPool transPool)
//    {
//        this.mapDescriptor = new MapDescriptor(transPool.getMapDescriptor());
//        this.allTripsInfo = new AllTripsInfo(transPool.getPlannedTrips(), this.mapDescriptor);
//    }


//    public void setAllTripsInfo() {
//        this.allTripsInfo = new AllTripsInfo();
//    }

//    public void setMapDescriptor(generatedClasses.MapDescriptor mapDescriptor) {
//        this.mapDescriptor = new MapDescriptor(mapDescriptor);
//    }



//    public AllTripsInfo getAllTripsInfo() {
//        return allTripsInfo;
//    }

//    public MapDescriptor getMapDescriptor() {
//        return mapDescriptor;
//    }

    public List<User> getAllUsers() {
        return allUsers;
    }

    public List<Map> getAllMaps() {
        return allMaps;
    }

    public void addNewUser(User user)
    {
        this.allUsers.add(user);
    }

    public void addNewMap(Map map)
    {
        this.allMaps.add(map);
    }


}
