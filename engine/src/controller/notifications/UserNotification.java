package controller.notifications;

import java.util.ArrayList;
import java.util.List;

public class UserNotification {

    private String username;
    private List<MatchNotification> allMatchNotifications;
    private List<FeedbackNotification> allFeedbacksNotifications;
    private int lastShownFeedbackIndex = -1, lastShownMatchIndex = -1;

    public UserNotification(String username){
        this.username = username;
        this.allMatchNotifications = new ArrayList<>();
        this.allFeedbacksNotifications = new ArrayList<>();
    }

    public String getUsername() {
        return username;
    }

    public List<MatchNotification> getAllMatchNotifications() {
        return allMatchNotifications;
    }

    public List<FeedbackNotification> getAllFeedbacksNotifications() {
        return allFeedbacksNotifications;
    }

    public int getLastShownMatchIndex() {
        return lastShownMatchIndex;
    }

    public int getLastShownFeedbackIndex() {
        return lastShownFeedbackIndex;
    }

    public void setLastShownMatchIndex(int lastShownMatchIndex) {
        this.lastShownMatchIndex = lastShownMatchIndex;
    }

    public void setLastShownFeedbackIndex(int lastShownFeedbackIndex) {
        this.lastShownFeedbackIndex = lastShownFeedbackIndex;
    }

    public void addNewMatchNotification(MatchNotification notification){
        this.allMatchNotifications.add(notification);
    }

    public void addNewFeedbackNotification(FeedbackNotification notification){
        this.allFeedbacksNotifications.add(notification);
    }
}
