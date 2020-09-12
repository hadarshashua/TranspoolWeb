package controller.exceptions;

public class IllegalStationsLocationException extends Exception{
    private final String errorMessage = "Error: one or more stations are not in map boundries";

    public IllegalStationsLocationException() { }

    @Override
    public String getMessage() {
        return errorMessage;
    }
}
