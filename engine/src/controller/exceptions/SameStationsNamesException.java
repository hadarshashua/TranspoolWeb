package controller.exceptions;

public class SameStationsNamesException extends  Exception{
    private final String errorMessage = "Error: there are two or more stations with the same name";

    public SameStationsNamesException() { }

    @Override
    public String getMessage() {
        return errorMessage;
    }
}
