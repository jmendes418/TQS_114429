package tqs.backend.service;

import tqs.backend.entity.Reservation;
import tqs.backend.entity.Restaurant;
import tqs.backend.enums.MealType;
import tqs.backend.model.ReservationRequestDTO;
import tqs.backend.model.ReservationResponseDTO;
import tqs.backend.repository.ReservationRepository;
import tqs.backend.repository.RestaurantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private RestaurantRepository restaurantRepository;

    @InjectMocks
    private ReservationService reservationService;

    private Restaurant mockRestaurant;

    @BeforeEach
    void setUp() {
        mockRestaurant = new Restaurant();
        mockRestaurant.setId(2L);
        mockRestaurant.setName("Restaurante Refatorado");
    }

    @Test
    void testCreateReservation_Success() {
        ReservationRequestDTO request = createMockReservationRequest(2L, LocalDate.of(2026, 6, 15), "JANTAR");

        when(restaurantRepository.findById(2L)).thenReturn(Optional.of(mockRestaurant));

        ReservationResponseDTO response = reservationService.createReservation(request);

        assertNotNull(response.getToken());
        assertEquals("Restaurante Refatorado", response.getRestaurantName());
        assertEquals("JANTAR", response.getType());
        assertFalse(response.isCheckedIn());

        verify(restaurantRepository).findById(2L);
        verify(reservationRepository).save(any(Reservation.class));
    }

    @Test
    void testCreateReservation_RestaurantNotFound() {
        ReservationRequestDTO request = createMockReservationRequest(99L, LocalDate.of(2026, 6, 15), "ALMOCO");

        when(restaurantRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () ->
                reservationService.createReservation(request)
        );

        verify(restaurantRepository).findById(99L);
        verify(reservationRepository, never()).save(any());
    }

    @Test
    void testCreateReservation_DuplicateMealTypeSameDay() {
        ReservationRequestDTO request = createMockReservationRequest(2L, LocalDate.of(2026, 6, 15), "JANTAR");

        when(restaurantRepository.findById(2L)).thenReturn(Optional.of(mockRestaurant));

        Reservation existingReservation = createMockReservation("token123", MealType.JANTAR, LocalDate.of(2026, 6, 15), false);

        when(reservationRepository.findByRestaurantIdAndDateAndTypeAndCancelledFalse(
                2L, request.getDate(), MealType.JANTAR
        )).thenReturn(Optional.of(existingReservation));

        assertThrows(ResponseStatusException.class, () -> {
            reservationService.createReservation(request);
        });

        verify(restaurantRepository).findById(2L);
        verify(reservationRepository).findByRestaurantIdAndDateAndTypeAndCancelledFalse(
                2L, request.getDate(), MealType.JANTAR);
        verify(reservationRepository, never()).save(any());
    }

    @Test
    void testGetReservationByToken_Success() {
        Reservation reservation = createMockReservation("token456", MealType.ALMOCO, LocalDate.of(2026, 6, 15), false);

        when(reservationRepository.findByToken("token456")).thenReturn(Optional.of(reservation));

        ReservationResponseDTO response = reservationService.getReservationByToken("token456");

        assertEquals("token456", response.getToken());
        assertEquals("ALMOCO", response.getType());

        verify(reservationRepository).findByToken("token456");
    }

    @Test
    void testGetReservationByToken_NotFound() {
        when(reservationRepository.findByToken("invalid-token")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () ->
                reservationService.getReservationByToken("invalid-token")
        );
    }

    @Test
    void testCancelReservation_Success() {
        Reservation reservation = createMockReservation("token789", MealType.JANTAR, LocalDate.of(2026, 6, 15), false);

        when(reservationRepository.findByToken("token789")).thenReturn(Optional.of(reservation));

        reservationService.cancelReservation("token789");

        assertTrue(reservation.isCancelled());
        verify(reservationRepository).findByToken("token789");
        verify(reservationRepository).save(reservation);
    }

    @Test
    void testCheckInReservation_Success() {
        Reservation reservation = createMockReservation("token123", MealType.ALMOCO, LocalDate.of(2026, 6, 15), false);

        when(reservationRepository.findByToken("token123")).thenReturn(Optional.of(reservation));

        reservationService.checkInReservation("token123");

        assertTrue(reservation.isCheckedIn());
        verify(reservationRepository).findByToken("token123");
        verify(reservationRepository).save(reservation);
    }

    private ReservationRequestDTO createMockReservationRequest(Long restaurantId, LocalDate date, String type) {
        ReservationRequestDTO request = new ReservationRequestDTO();
        request.setRestaurantId(restaurantId);
        request.setDate(date);
        request.setType(type);
        return request;
    }

    private Reservation createMockReservation(String token, MealType type, LocalDate date, boolean cancelled) {
        Reservation reservation = new Reservation();
        reservation.setToken(token);
        reservation.setRestaurant(mockRestaurant);
        reservation.setDate(date);
        reservation.setType(type);
        reservation.setCancelled(cancelled);
        return reservation;
    }
}