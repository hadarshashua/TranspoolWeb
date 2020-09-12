package chat.servlets;

import chat.utils.ServletUtils;
import chat.utils.SessionUtils;
import controller.MainController;
import controller.time.Schedual;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/addOfferedTrip")
public class AddOfferedTripServlet extends HttpServlet {
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String mapName = SessionUtils.getMapName(request);
        String errorMessage ="";
        int day = 0, ppk = 0, capacity = 0;
        Schedual.StartOrArrive startOrArrive = Schedual.StartOrArrive.START;

        String name = request.getParameter("name");
        if(name.equals(""))
            errorMessage = "Must enter a name!";
        else if(!isNameValid(name))
            errorMessage = "Name is not valid, please enter a name with letters only!";

        String route = request.getParameter("route");
        if(errorMessage.equals(""))
            errorMessage = isRouteValid(route, mapName);

        String sDay = request.getParameter("day");
        if(errorMessage.equals(""))
        {
            if(sDay.equals(""))
                errorMessage = "Must enter a day!";
            else if(!isDigitsOnly(sDay))
                errorMessage = "Day is not valid, please enter a day with digits only!";
            else
                day = Integer.parseInt(sDay);
        }

        String sHour = request.getParameter("hour");
        int hour = Integer.parseInt(sHour);
        String sMinutes = request.getParameter("minutes");
        int minutes = Integer.parseInt(sMinutes);

        String recurrences = request.getParameter("recurrences");

        String sPpk = request.getParameter("ppk");
        if(errorMessage.equals(""))
        {
            if(sPpk.equals(""))
                errorMessage = "Must enter ppk!";
            else if(!isDigitsOnly(sPpk))
                errorMessage = "Ppk is not valid, please enter ppk with digits only!";
            else
                ppk = Integer.parseInt(sPpk);
        }

        String sCapacity = request.getParameter("capacity");
        if(errorMessage.equals(""))
        {
            if(sCapacity.equals(""))
                errorMessage = "Must enter capacity!";
            else if(!isDigitsOnly(sCapacity))
                errorMessage = "Capacity is not valid, please enter capacity with digits only!";
            else
                capacity = Integer.parseInt(sCapacity);
        }

        if(errorMessage.equals(""))
        {
            MainController mainController = ServletUtils.getMainController(getServletContext());
            mainController.makeNewOfferedTrip(name, route, capacity, ppk, hour, minutes, day, recurrences, mapName);
            response.getOutputStream().print("Offered trip added successfully!");
        }
        else
            response.getOutputStream().println(errorMessage);
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

    protected boolean isNameValid(String name)
    {
        for(int i=0; i<name.length(); i++)
        {
            if(!((name.charAt(i) >='a' && name.charAt(i) <= 'z') || (name.charAt(i) >='A' && name.charAt(i) <= 'Z')))
                return false;
        }
        return true;
    }

    protected String isRouteValid(String route, String mapName)
    {
        String res = "";
        MainController mainController = ServletUtils.getMainController(getServletContext());

        if(route.equals(""))
        {
            res = "Error: enter route!";
        }
        else if(!mainController.areStationsExists(route, mapName))
        {
            res = "Error: station not exists";
        }
        else if(!mainController.arePathsExist(route, mapName))
        {
            res = "Error: path not exists";
        }
        return res;
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

