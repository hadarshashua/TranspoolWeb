package controller.notifications;

import java.util.ArrayList;
import java.util.List;

public class NotificationManager {

    private List<UserNotification> usersNotification;

    public NotificationManager(){
        usersNotification = new ArrayList<>();
    }

    public List<UserNotification> getUsersNotification() {
        return usersNotification;
    }

    public void addUser(String username){
        UserNotification newUser = new UserNotification(username);
        this.usersNotification.add(newUser);
    }
}
