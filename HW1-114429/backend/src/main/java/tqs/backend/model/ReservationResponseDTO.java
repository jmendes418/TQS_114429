package tqs.backend.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class ReservationResponseDTO {
    private String token;
    private String restaurantName;
    private LocalDate date;
    private boolean checkedIn;
    private String type;

    public ReservationResponseDTO(String token, String restaurantName, LocalDate date, boolean checkedIn, String type) {
        this.token = token;
        this.restaurantName = restaurantName;
        this.date = date;
        this.checkedIn = checkedIn;
        this.type = type;
    }

}
