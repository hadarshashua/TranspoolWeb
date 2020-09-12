package chat.servlets;

import chat.utils.ServletUtils;
import chat.utils.SessionUtils;
import com.google.gson.Gson;
import controller.MainController;
import controller.map.Map;
import controller.map.MapDescriptor;
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

@WebServlet("/findMatch")

public class FindMatchServlet extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        //returning JSON objects, not HTML

        response.setContentType("application/json");

        try (PrintWriter out = response.getWriter()) {
            Gson gson = new Gson();

            List<List<TripPartInfo>> options = new ArrayList<>();
            String mapName = SessionUtils.getMapName(request);
            String tripId = request.getParameter("tripId");
            String errorMessage = "";
            int maxOptions = 0;

            if(tripId != null) {
                SessionUtils.setTripRequestId(request, Integer.parseInt(tripId));
            }

            String sMaxOptions = request.getParameter("maxOptions");
            if(sMaxOptions.equals("")){
                errorMessage = "Please enter max options";
                //response.getOutputStream().println(errorMessage);
            }
            else if(!isDigitsOnly(sMaxOptions)){
                errorMessage = "Max options is not valid, please enter digits only";
                //response.getOutputStream().println(errorMessage);
            }
            else{
                maxOptions = Integer.parseInt(sMaxOptions);
            }
            int id = SessionUtils.getTripRequestId(request);

            if(errorMessage.equals("")){
                MainController mainController = ServletUtils.getMainController(getServletContext());
                options = mainController.findPossibleTrips(id, maxOptions, mapName);
                SessionUtils.setOptionsList(request, options);
                String json = gson.toJson(options);
                out.println(json);
                out.flush();
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

    protected boolean isDigitsOnly(String text)
    {
        for(int i=0; i<text.length(); i++)
        {
            if(!Character.isDigit(text.charAt(i)))
                return false;
        }
        return true;
    }
}
