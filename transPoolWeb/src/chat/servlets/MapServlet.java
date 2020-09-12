package chat.servlets;

import chat.utils.ServletUtils;
import chat.utils.SessionUtils;
import com.google.gson.Gson;
import controller.MainController;
import controller.map.Map;
import controller.map.MapDescriptor;
import controller.map.MapInfo;
import controller.trips.AllTripsInfo;
import users.AccountAction;
import users.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@WebServlet("/map")
public class MapServlet extends HttpServlet {

    private final String PASSENGER_MAP_URL = "pages/map/passenger_map.html";
    private final String OWNER_MAP_URL = "pages/map/owner_map.html";



    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        SessionUtils.setMapName(request);
        response.setContentType("application/html");
        String role = SessionUtils.getRole(request);
        if(role.equals("Passenger")){
            response.sendRedirect(PASSENGER_MAP_URL);
        }
        else{
            response.sendRedirect(OWNER_MAP_URL);
        }

    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {


        processRequest(request, response);

    }
}
