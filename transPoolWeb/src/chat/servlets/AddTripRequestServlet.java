package chat.servlets;

import chat.utils.ServletUtils;
import chat.utils.SessionUtils;
import com.google.gson.Gson;
import controller.MainController;
import controller.time.Schedual;
import controller.trips.TripRequest;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/addTripRequest")
public class AddTripRequestServlet extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String mapName = SessionUtils.getMapName(request);
        String errorMessage ="";
        int day = 0;
        Schedual.StartOrArrive startOrArrive = Schedual.StartOrArrive.START;

        String name = request.getParameter("name");
        if(name.equals(""))
            errorMessage = "Must enter a name!";
        else if(!isNameValid(name))
            errorMessage = "Name is not valid, please enter a name with letters only!";

        String firstStation = request.getParameter("firstStation");
        String lastStation = request.getParameter("lastStation");
        if(firstStation.equals(lastStation) && errorMessage.equals(""))
            errorMessage = "First station and last station must be different!";

        String sDay = request.getParameter("day");
        if(errorMessage.equals(""))
        {
            if(sDay.equals(""))
                errorMessage = "Must enter a day!";
            else if(!isDayValid(sDay))
                errorMessage = "Day is not valid, please enter a day with digits only!";
            else
                day = Integer.parseInt(sDay);
        }

        String sHour = request.getParameter("hour");
        int hour = Integer.parseInt(sHour);
        String sMinutes = request.getParameter("minutes");
        int minutes = Integer.parseInt(sMinutes);

        String option = request.getParameter("timeType");
        if(option == null && errorMessage.equals(""))
            errorMessage = "Must select departure or arrival time!";
        else if(option != null)
        {
            if(option.equals("departure"))
                startOrArrive = Schedual.StartOrArrive.START;
            else
                startOrArrive = Schedual.StartOrArrive.ARRIVE;
        }

        if(errorMessage.equals(""))
        {
            MainController mainController =ServletUtils.getMainController(getServletContext());
            mainController.makeNewTripRequest(name, firstStation, lastStation, hour, minutes, day, startOrArrive, mapName);
            response.getOutputStream().print("Trip request added successfully!");
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

    protected boolean isDayValid(String day)
    {
        for(int i=0; i<day.length(); i++)
        {
            if(!Character.isDigit(day.charAt(i)))
                return false;
        }
        return true;
    }
}
