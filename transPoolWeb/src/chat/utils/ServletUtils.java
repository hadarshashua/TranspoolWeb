package chat.utils;

import controller.MainController;
import controller.chat.ChatManager;
import controller.map.MapManager;
import controller.notifications.NotificationManager;
import sun.applet.Main;
import users.User;
import users.UserManager;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import static chat.constants.Constants.INT_PARAMETER_ERROR;

public class ServletUtils {

	private static final String MAIN_CONTROLLER_ATTRIBUTE_NAME = "mainController";
	private static final String USER_MANAGER_ATTRIBUTE_NAME = "userManager";
	private static final String NOTIFICATION_MANAGER_ATTRIBUTE_NAME = "notificationManager";
	private static final String MAP_MANAGER_ATTRIBUTE_NAME = "mapManager";
	private static final String USER_ATTRIBUTE_NAME = "user";
	private static final String CHAT_MANAGER_ATTRIBUTE_NAME = "chatManager";

	/*
	Note how the synchronization is done only on the question and\or creation of the relevant managers and once they exists -
	the actual fetch of them is remained un-synchronized for performance POV
	 */
	private static final Object mainControllerLock = new Object();
	private static final Object userManagerLock = new Object();
	private static final Object notificationManagerLock = new Object();
	private static final Object mapManagerLock = new Object();
	private static final Object userLock = new Object();
	private static final Object chatManagerLock = new Object();

	public static UserManager getUserManager(ServletContext servletContext) {

		synchronized (userManagerLock) {
			if (servletContext.getAttribute(USER_MANAGER_ATTRIBUTE_NAME) == null) {
				servletContext.setAttribute(USER_MANAGER_ATTRIBUTE_NAME, new UserManager());
			}
		}
		return (UserManager) servletContext.getAttribute(USER_MANAGER_ATTRIBUTE_NAME);
	}

	public static NotificationManager getNotificationManager(ServletContext servletContext) {

		synchronized (notificationManagerLock) {
			if (servletContext.getAttribute(NOTIFICATION_MANAGER_ATTRIBUTE_NAME) == null) {
				servletContext.setAttribute(NOTIFICATION_MANAGER_ATTRIBUTE_NAME, new NotificationManager());
			}
		}
		return (NotificationManager) servletContext.getAttribute(NOTIFICATION_MANAGER_ATTRIBUTE_NAME);
	}

	public static MapManager getMapManager(ServletContext servletContext) {

		synchronized (mapManagerLock) {
			if (servletContext.getAttribute(MAP_MANAGER_ATTRIBUTE_NAME) == null) {
				servletContext.setAttribute(MAP_MANAGER_ATTRIBUTE_NAME, new MapManager());
			}
		}
		return (MapManager) servletContext.getAttribute(MAP_MANAGER_ATTRIBUTE_NAME);
	}

	public static MainController getMainController(ServletContext servletContext) {

		synchronized (mainControllerLock) {
			if (servletContext.getAttribute(MAIN_CONTROLLER_ATTRIBUTE_NAME) == null) {
				servletContext.setAttribute(MAIN_CONTROLLER_ATTRIBUTE_NAME, new MainController());
			}
		}
		return (MainController) servletContext.getAttribute(MAIN_CONTROLLER_ATTRIBUTE_NAME);
	}

	public static User getUser(ServletContext servletContext) {
		return (User) servletContext.getAttribute(USER_ATTRIBUTE_NAME);
	}

	public static User setUser(ServletContext servletContext, String username, String role) {

		synchronized (userLock) {
			if (servletContext.getAttribute(USER_ATTRIBUTE_NAME) == null) {
				User.Role role1;
				if(role == "Passenger") {
					role1 = User.Role.PASSENGER;
				}
				else{
					role1 = User.Role.OWNER;
				}

				servletContext.setAttribute(USER_ATTRIBUTE_NAME, new User(username, role1));
			}
		}
		return (User) servletContext.getAttribute(USER_ATTRIBUTE_NAME);
	}

	public static ChatManager getChatManager(ServletContext servletContext) {
		synchronized (chatManagerLock) {
			if (servletContext.getAttribute(CHAT_MANAGER_ATTRIBUTE_NAME) == null) {
				servletContext.setAttribute(CHAT_MANAGER_ATTRIBUTE_NAME, new ChatManager());
			}
		}
		return (ChatManager) servletContext.getAttribute(CHAT_MANAGER_ATTRIBUTE_NAME);
	}

	public static int getIntParameter(HttpServletRequest request, String name) {
		String value = request.getParameter(name);
		if (value != null) {
			try {
				return Integer.parseInt(value);
			} catch (NumberFormatException numberFormatException) {
			}
		}
		return INT_PARAMETER_ERROR;
	}
}
