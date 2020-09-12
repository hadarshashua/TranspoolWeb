package chat.servlets;

//taken from: http://www.servletworld.com/servlet-tutorials/servlet3/multipartconfig-file-upload-example.html
// and http://docs.oracle.com/javaee/6/tutorial/doc/glraq.html

import chat.utils.ServletUtils;
import chat.utils.SessionUtils;
import controller.MainController;
import controller.exceptions.*;
import controller.map.MapManager;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import javax.xml.bind.JAXBException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Scanner;

@WebServlet("/upload" )
@MultipartConfig(fileSizeThreshold = 1024 * 1024, maxFileSize = 1024 * 1024 * 5, maxRequestSize = 1024 * 1024 * 5 * 5)

public class FileUploadServlet extends HttpServlet {

    private final String ALL_MAPS_INFO_URL = "pages/allMapsInfo/allMapsInfo.html";


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.sendRedirect("fileupload/form.html");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        Part filePart = request.getPart("file"); // Retrieves <input type="file" name="file">
        String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString(); // MSIE fix.
        InputStream fileContent = filePart.getInputStream();
        String username = SessionUtils.getUsername(request);
        Part name = request.getPart("mapName");
        String nameValue = readFromInputStream(name.getInputStream());

        MapManager mapManager = ServletUtils.getMapManager(getServletContext());
        if (nameValue == null || nameValue.isEmpty()) {
            response.getOutputStream().println("Must enter name for map!");
        }
        else{
            if(mapManager.isMapExists(nameValue)){
                response.getOutputStream().println("Map name " + nameValue + " already exists, please choose different name");
            }
            else
            {
                mapManager.addMap(nameValue);
                try {
                    ServletUtils.getMainController(getServletContext()).loadInfoFromXML(fileContent, username, nameValue);
                    response.getOutputStream().println("File load successfully!");
                } catch (IllegalFileExtensionException | FileNotExistsException | SameStationsLocationException | SameStationsNamesException | IllegalMapSizeException | IllegalStationsLocationException | IllegalOfferedTripException | IllegalPathException | JAXBException | DayStartNotExistsException | DayStartNotValidException e) {
                    e.getMessage();
                    response.getOutputStream().println(e.getMessage());
                }
            }
        }
    }

    private String readFromInputStream(InputStream inputStream) {

        return new Scanner(inputStream).useDelimiter("\\Z").next();

    }
}
