package tqs.backend.entity;

import lombok.Getter;
import lombok.Setter;
import tqs.backend.enums.MealType;
import jakarta.persistence.*;

import java.time.LocalDate;

@Setter
@Getter
@Entity
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    @ManyToOne
    private Restaurant restaurant;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private MealType type;

    private boolean checkedIn;

    private boolean cancelled = false;

}
