package controller.exceptions;

public class NullPointerException extends Exception{
    private final String errorMessage = "Error: to start the program you must read from a valid XML file first";

    public NullPointerException() { }

    @Override
    public String getMessage() {
        return errorMessage;
    }
}
