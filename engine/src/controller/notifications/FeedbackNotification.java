package controller.notifications;

public class FeedbackNotification {

    private String name, message;
    private int tripId, rate;

    public FeedbackNotification(String name, int tripId, int rate, String message){
        this.name = name;
        this.tripId = tripId;
        this.rate = rate;
        if(!message.equals("")){
            this.message = message;
        }
    }

    public String getName() {
        return name;
    }

    public int getTripId() {
        return tripId;
    }

    public int getRate() {
        return rate;
    }

    public String getMessage() {
        return message;
    }
}
