package controller.exceptions;

public class IllegalFileExtensionException extends Exception {
    private final String errorMessage = "Error: File extension is not XML!";

    public IllegalFileExtensionException() { }

    @Override
    public String getMessage() {
        return errorMessage;
    }
}
