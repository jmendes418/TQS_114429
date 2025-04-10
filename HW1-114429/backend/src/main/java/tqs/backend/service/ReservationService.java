package tqs.backend.service;

import tqs.backend.entity.Reservation;
import tqs.backend.entity.Restaurant;
import tqs.backend.enums.MealType;
import tqs.backend.model.ReservationRequestDTO;
import tqs.backend.model.ReservationResponseDTO;
import tqs.backend.repository.ReservationRepository;
import tqs.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public ReservationResponseDTO createReservation(ReservationRequestDTO request) {
        Optional<Restaurant> restaurantOpt = restaurantRepository.findById(request.getRestaurantId());
        if (restaurantOpt.isEmpty()) {
            throw new IllegalArgumentException("Restaurante não encontrado");
        }

        MealType type;
        try {
            type = MealType.valueOf(request.getType());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de refeição inválido");
        }

        Optional<Reservation> existing = reservationRepository
                .findByRestaurantIdAndDateAndTypeAndCancelledFalse(
                        request.getRestaurantId(),
                        request.getDate(),
                        type
                );

        if (existing.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma reserva ativa para esta refeição.");
        }

        String token = UUID.randomUUID().toString();
        Reservation reservation = new Reservation();
        reservation.setToken(token);
        reservation.setRestaurant(restaurantOpt.get());
        reservation.setDate(request.getDate());
        reservation.setCheckedIn(false);
        reservation.setCancelled(false);
        reservation.setType(type);

        reservationRepository.save(reservation);

        return new ReservationResponseDTO(
                token,
                reservation.getRestaurant().getName(),
                reservation.getDate(),
                reservation.isCheckedIn(),
                reservation.getType().name()
        );
    }

    public ReservationResponseDTO getReservationByToken(String token) {
        Reservation reservation = reservationRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));

        return new ReservationResponseDTO(
                reservation.getToken(),
                reservation.getRestaurant().getName(),
                reservation.getDate(),
                reservation.isCheckedIn(),
                reservation.getType().name()
        );
    }

    public void cancelReservation(String token) {
        Reservation reservation = reservationRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));

        if (reservation.isCheckedIn()) {
            throw new IllegalStateException("Reserva já foi usada, não pode ser cancelada.");
        }

        reservation.setCancelled(true);
        reservationRepository.save(reservation);
    }

    public void checkInReservation(String token) {
        Reservation reservation = reservationRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));

        if (reservation.isCancelled()) {
            throw new IllegalStateException("Reserva foi cancelada.");
        }

        if (reservation.isCheckedIn()) {
            throw new IllegalStateException("Reserva já foi usada.");
        }

        reservation.setCheckedIn(true);
        reservationRepository.save(reservation);
    }
}