package tqs.backend.controller;

import tqs.backend.model.ReservationRequestDTO;
import tqs.backend.model.ReservationResponseDTO;
import tqs.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequestDTO request) {
        return handleRequest(() -> reservationService.createReservation(request));
    }

    @GetMapping("/{token}")
    public ResponseEntity<ReservationResponseDTO> getReservation(@PathVariable String token) {
        return handleRequest(() -> reservationService.getReservationByToken(token));
    }

    @DeleteMapping("/{token}")
    public ResponseEntity<String> cancelReservation(@PathVariable String token) {
        return handleRequest(() -> {
            reservationService.cancelReservation(token);
            return "Reserva cancelada com sucesso.";
        });
    }

    @PostMapping("/checkin/{token}")
    public ResponseEntity<String> checkInReservation(@PathVariable String token) {
        return handleRequest(() -> {
            reservationService.checkInReservation(token);
            return "Check-in realizado com sucesso.";
        });
    }

    private <T> ResponseEntity<T> handleRequest(RequestHandler<T> handler) {
        try {
            return ResponseEntity.ok(handler.handle());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body((T) ("Erro: " + e.getMessage()));
        }
    }

    @FunctionalInterface
    private interface RequestHandler<T> {
        T handle();
    }
}