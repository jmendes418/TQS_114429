package tqs.backend.repository;

import tqs.backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.time.LocalDate;
import tqs.backend.enums.MealType;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByToken(String token);

    Optional<Reservation> findByRestaurantIdAndDateAndTypeAndCancelledFalse(Long restaurantId, LocalDate date, MealType type);
}
