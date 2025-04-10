package tqs.backend.entity;

import lombok.Getter;
import lombok.Setter;
import tqs.backend.enums.MealType;
import jakarta.persistence.*;

import java.time.LocalDate;

@Setter
@Getter
@Entity
public class Meal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private String description;

    @Enumerated(EnumType.STRING)
    private MealType type;

    @ManyToOne
    private Restaurant restaurant;

}
