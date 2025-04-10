package tqs.backend.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class ReservationRequestDTO {
    private Long restaurantId;
    private LocalDate date;
    private String type;

}
