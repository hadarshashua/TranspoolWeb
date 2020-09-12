package chat.utils;

import chat.constants.Constants;
import controller.trips.TripPartInfo;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

public class SessionUtils {

    public static String getUsername (HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Object sessionAttribute = session != null ? session.getAttribute(Constants.USERNAME) : null;
        return sessionAttribute != null ? sessionAttribute.toString() : null;
    }

    public static String getRole (HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Object sessionAttribute = session != null ? session.getAttribute("role") : null;
        return sessionAttribute != null ? sessionAttribute.toString() : null;
    }

    public static void setRole (HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Object role = request.getParameter("role");
        if(role!= null)
        {
            session.setAttribute("role", role);
        }
    }

    public static String getMoney (HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Object sessionAttribute = session != null ? session.getAttribute("payment") : null;
        return sessionAttribute != null ? sessionAttribute.toString() : null;
    }

    public static String getMapName (HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Object sessionAttribute = session != null ? session.getAttribute("mapName") : null;
        return sessionAttribute != null ? sessionAttribute.toString() : null;
    }

    public static void setMapName (HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Object mapName = request.getParameter("mapName");
        if(mapName!= null)
        {
            session.setAttribute("mapName", mapName);
        }
    }

    public static void setOptionsList (HttpServletRequest request, List<List<TripPartInfo>> options) {
        HttpSession session = request.getSession(false);
        session.setAttribute("optionsList", options);
    }

    public static List<List<TripPartInfo>> getOptionsList (HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        List<List<TripPartInfo>> sessionAttribute = session != null ? (List<List<TripPartInfo>>)session.getAttribute("optionsList") : null;
        return sessionAttribute != null ? sessionAttribute : null;
    }

    public static void setOptionList (HttpServletRequest request, List<TripPartInfo> optionList) {
        HttpSession session = request.getSession(false);
        session.setAttribute("optionList", optionList);
    }

    public static List<TripPartInfo> getOptionList (HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        List<TripPartInfo> sessionAttribute = session != null ? (List<TripPartInfo>)session.getAttribute("optionList") : null;
        return sessionAttribute != null ? sessionAttribute : null;
    }

    public static void setTripRequestId (HttpServletRequest request, int id) {
        HttpSession session = request.getSession(false);
        session.setAttribute("tripRequestId", id);
    }

    public static int getTripRequestId (HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Object sessionAttribute = session != null ? session.getAttribute("tripRequestId") : null;
        return sessionAttribute != null ? (int)sessionAttribute : null;
    }


    public static void clearSession (HttpServletRequest request) {
        request.getSession().invalidate();
    }
}