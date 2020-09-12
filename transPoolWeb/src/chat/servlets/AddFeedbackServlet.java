package chat.servlets;

import chat.utils.ServletUtils;
import chat.utils.SessionUtils;
import com.google.gson.Gson;
import controller.MainController;
import controller.map.Map;
import controller.map.MapDescriptor;
import controller.notifications.NotificationManager;
import controller.time.Schedual;
import controller.trips.TripPartInfo;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/addFeedback")
public class AddFeedbackServlet extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        int id, rate = 0;
        String tripId, message, mapName, username, errorMessage = "";
        List<TripPartInfo> optionList = SessionUtils.getOptionList(request);

        mapName = SessionUtils.getMapName(request);
        username = SessionUtils.getUsername(request);

        tripId = request.getParameter("tripId");
        id = Integer.parseInt(tripId);

        for(int i=0; i<optionList.size(); i++)
        {
            if(optionList.get(i).getTripId() == id)
            {
                message = request.getParameter("feedbackMessage");

                String sRate = request.getParameter("rate");
                if(sRate == null){
                    if(!message.equals("")) {
                        errorMessage = "Must choose rate to give feedback!";
                        response.getOutputStream().println(errorMessage);
                    }
                    else{
                        errorMessage = "Please rate!";
                        response.getOutputStream().println(errorMessage);
                    }
                }
                else if(sRate != null) {
                   rate = Integer.parseInt(sRate);
                }

                if(errorMessage.equals("")) {
                    MainController mainController = ServletUtils.getMainController(getServletContext());
                    NotificationManager notificationManager = ServletUtils.getNotificationManager(getServletContext());
                    mainController.addFeedbackToOwner(rate, message, id, mapName, username, notificationManager);
                    response.getOutputStream().println("Thank you for your feedback!");
                }
            }
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
}
