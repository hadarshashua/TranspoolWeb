package controller.exceptions;

public class IllegalPathException extends Exception{
    private final String errorMessage = "Error: one or more paths contain invalid stations";

    public IllegalPathException() { }

    @Override
    public String getMessage() {
        return errorMessage;
    }
}
