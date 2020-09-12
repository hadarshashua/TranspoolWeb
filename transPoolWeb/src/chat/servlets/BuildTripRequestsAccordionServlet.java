package chat.servlets;

import chat.utils.ServletUtils;
import chat.utils.SessionUtils;
import com.google.gson.Gson;
import controller.MainController;
import controller.map.Map;
import controller.trips.Trip;
import controller.trips.TripRequest;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/tripRequestsBuild")

public class BuildTripRequestsAccordionServlet extends HttpServlet {
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        //returning JSON objects, not HTML

        response.setContentType("application/json");

        try (PrintWriter out = response.getWriter()) {
            Gson gson = new Gson();
            List<TripRequest> alltripRequsests = new ArrayList<>();

            String mapName = SessionUtils.getMapName(request);
            String username = SessionUtils.getUsername(request);
            String role = SessionUtils.getRole(request);

            MainController mainController = ServletUtils.getMainController(getServletContext());

            if(role.equals("Passenger")){
                alltripRequsests = mainController.getUserTripRequests(username, mapName);
            }
            else{
                Map map = mainController.findMapByMapname(mapName);
                alltripRequsests = map.getAllTripsInfo().getAllTripRequests();
            }

            String json = gson.toJson(alltripRequsests);
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
}
