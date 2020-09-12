package chat.servlets;

import chat.utils.ServletUtils;
import chat.utils.SessionUtils;
import com.google.gson.Gson;
import controller.MainController;
import controller.map.Map;
import controller.map.MapDescriptor;
import controller.trips.Trip;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/offeredTripsBuild")
public class BuildOfferedTripsAccordionServlet extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        //returning JSON objects, not HTML

        response.setContentType("application/json");

        try (PrintWriter out = response.getWriter()) {
            Gson gson = new Gson();
            List<Trip> allOfferedTrips = new ArrayList<>();

            String mapName = SessionUtils.getMapName(request);
            String username = SessionUtils.getUsername(request);
            String role = SessionUtils.getRole(request);

            MainController mainController = ServletUtils.getMainController(getServletContext());

            if(role.equals("Passenger")){
                Map map = mainController.findMapByMapname(mapName);
                allOfferedTrips = map.getAllTripsInfo().getAllOfferdTrips();
            }
            else{
                allOfferedTrips = mainController.getUserOfferedTrips(username, mapName);
            }

            String json = gson.toJson(allOfferedTrips);
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
