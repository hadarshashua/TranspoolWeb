package chat.servlets;

import chat.utils.ServletUtils;
import chat.utils.SessionUtils;
import com.google.gson.Gson;
import controller.MainController;
import controller.notifications.NotificationManager;
import controller.trips.TripPartInfo;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/matchTrip")
public class MatchTripServlet extends HttpServlet {
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String mapName = SessionUtils.getMapName(request);
        String username = SessionUtils.getUsername(request);

        String tripRequestId = request.getParameter("tripId");
        int id = SessionUtils.getTripRequestId(request);

        String option = request.getParameter("option");
        int optionIndex = Integer.parseInt(option) -1;

        MainController mainController = ServletUtils.getMainController(getServletContext());
        List<List<TripPartInfo>> options = SessionUtils.getOptionsList(request);

        List<TripPartInfo> selectedOption = options.get(optionIndex);

//        List<String> ownersNames = new ArrayList<>();
//
//        for(int i=0; i<selectedOption.size(); i++) {
//            ownersNames.add(selectedOption.get(i).getOwner());
//        }

        SessionUtils.setOptionList(request, selectedOption);
        NotificationManager notificationManager = ServletUtils.getNotificationManager(getServletContext());

        for(int i=0; i<selectedOption.size(); i++)
        {
            mainController.makeMatch(id, selectedOption.get(i), mapName, username, notificationManager);
        }
        mainController.finishMatch(id, selectedOption, mapName);
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
