package tqs.cars_containers.boundary;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus( value= HttpStatus.NOT_FOUND)
public class ResourceNotFoundException  extends Exception {

    public ResourceNotFoundException(String message){
        super(message);
    }
}
