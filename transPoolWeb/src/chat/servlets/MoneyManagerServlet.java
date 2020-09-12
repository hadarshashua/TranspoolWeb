package chat.servlets;

import chat.constants.Constants;
import chat.utils.ServletUtils;
import chat.utils.SessionUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static chat.constants.Constants.*;

@WebServlet(name = "GetMoneyManagerServlet", urlPatterns = {"/loadMoney"})
public class MoneyManagerServlet extends HttpServlet {

    private final String ALL_MAPS_INFO_URL = "allMapsInfo.html";


    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        boolean isValid = true;
        String moneyFromSession = SessionUtils.getMoney(request);

        if (moneyFromSession == null) {

            String MoneyFromParameter = request.getParameter("loadMoney");
            if (MoneyFromParameter == null || MoneyFromParameter.isEmpty()) {
                //no money in session and no money in parameter -
                //redirect back to the allMapsInfo page
                //this return an HTTP code back to the browser telling it to load

                //response.sendRedirect(ALL_MAPS_INFO_URL);
                response.getOutputStream().println("must enter value!");
            }
            else {
                //normalize the money value
                MoneyFromParameter = MoneyFromParameter.trim();
                String errorMessage = "Invalid input, Please enter a number";

                for (int i = 0; i < MoneyFromParameter.length() && isValid; i++)
                {
                    if (Character.isDigit(MoneyFromParameter.charAt(i)) == false)
                    {
                        response.getOutputStream().println(errorMessage);
                        isValid = false;
                    }
                }

                if(isValid)
                {
                    int payment = Integer.parseInt(MoneyFromParameter);
                    String username = SessionUtils.getUsername(request);
                    if (username == null) {
                        response.sendRedirect(request.getContextPath() + "/index.html");
                    }

                    ServletUtils.getMainController(getServletContext()).updateUserBalance(username, payment);
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
