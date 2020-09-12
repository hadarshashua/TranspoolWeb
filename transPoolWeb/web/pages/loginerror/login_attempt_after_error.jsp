<%--
    Document   : index
    Created on : Jan 24, 2012, 6:01:31 AM
    Author     : blecherl
    This is the login JSP for the online chat application
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <%@page import="chat.utils.*" %>
    <%@ page import="chat.constants.Constants" %>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>TransPool</title>
<!--        Link the Bootstrap (from twitter) CSS framework in order to use its classes-->
        <link href="pages/loginerror/loginerror.css" rel="stylesheet" type="text/css">

        <!--        Link jQuery JavaScript library in order to use the $ (jQuery) method-->
<!--        <script src="script/jquery-2.0.3.min.js"></script>-->
<!--        and\or any other scripts you might need to operate the JSP file behind the scene once it arrives to the client-->
    </head>
    <body>
        <div class = "mainDiv">
            <% String usernameFromSession = SessionUtils.getUsername(request);%>
            <% String usernameFromParameter = request.getParameter(Constants.USERNAME) != null ? request.getParameter(Constants.USERNAME) : "";%>
            <% if (usernameFromSession == null) {%>
            <label class = "firstTitle"> Welcome to TransPool system </label><br>
            <label class = "secondTitle"> Please enter user name: </label><br><br><br>
            <form method="POST" action="login">
                <input type="text" name="<%=Constants.USERNAME%>" value="<%=usernameFromParameter%>"/>
                <input type="submit" value="Login"/><br>

                <% Object errorMessage = request.getAttribute(Constants.USER_NAME_ERROR);%>
                <% if (errorMessage != null) {%>
                <span class="error-message" ><%=errorMessage%></span>
                <% } %>
                <% } else {%>
                <h1>Welcome back, <%=usernameFromSession%></h1>
                <a href="../allMapsInfo/allMapsInfo.html">Click here to enter the maps page</a>
                <br/>
                <a href="login?logout=true" id="logout">logout</a>
                <% }%> <br><br>

                <label class="role"> Please select your role: </label>
                <input type="radio" id="Passenger" name="role" value="Passenger">
                <label for="Passenger" class="role">Passenger</label>
                <input type="radio" id="Owner" name="role" value="Owner">
                <label for="Owner" class="role">Owner</label><br>
            </form>

        </div>
    </body>
</html>
