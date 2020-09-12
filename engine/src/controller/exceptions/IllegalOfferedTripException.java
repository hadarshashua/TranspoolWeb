package controller.exceptions;

public class IllegalOfferedTripException extends Exception{
    private final String errorMessage = "Error: there is offered trip which contain invalid paths or stations";

    public IllegalOfferedTripException() { }

    @Override
    public String getMessage() {
        return errorMessage;
    }
}
