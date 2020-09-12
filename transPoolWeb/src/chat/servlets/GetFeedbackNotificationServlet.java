package chat.servlets;

import chat.utils.ServletUtils;
import chat.utils.SessionUtils;
import com.google.gson.Gson;
import controller.notifications.FeedbackNotification;
import controller.notifications.MatchNotification;
import controller.notifications.NotificationManager;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;


@WebServlet("/feedbackNotification")
public class GetFeedbackNotificationServlet extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        //returning JSON objects, not HTML

        response.setContentType("application/json");

        try (PrintWriter out = response.getWriter()) {
            Gson gson = new Gson();

            NotificationManager notificationManager = ServletUtils.getNotificationManager(getServletContext());
            String username = SessionUtils.getUsername(request);

            List<FeedbackNotification> newFeedbackNotificationList = getNewNotifications(notificationManager, username);

            String json = gson.toJson(newFeedbackNotificationList);
            out.println(json);
            out.flush();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        processRequest(request, response);

    }

    private List<FeedbackNotification> getNewNotifications(NotificationManager notificationManager, String username){

        List<FeedbackNotification> res = new ArrayList<>();
        List<FeedbackNotification> feedbackNotificationsList = new ArrayList<>();

        for(int i=0; i<notificationManager.getUsersNotification().size(); i++){
            if(notificationManager.getUsersNotification().get(i).getUsername().equals(username)){
                feedbackNotificationsList = notificationManager.getUsersNotification().get(i).getAllFeedbacksNotifications();
            }
        }

        if(!feedbackNotificationsList.isEmpty()){
            for (int i=0; i<feedbackNotificationsList.size(); i++){
                res.add(feedbackNotificationsList.remove(i));
            }
        }
        return res;
    }
}
