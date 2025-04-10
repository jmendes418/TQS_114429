package tqs.backend.model;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class ReservationResponseDTOTest {

    @Test
    void testConstructorAndGetters() {
        ReservationResponseDTO response = new ReservationResponseDTO(
                "abc123",
                "Restaurante do Porto",
                LocalDate.of(2023, 12, 25),
                false,
                "JANTAR"
        );

        assertThat(response.getToken()).isEqualTo("abc123");
        assertThat(response.getRestaurantName()).isEqualTo("Restaurante do Porto");
        assertThat(response.getDate()).isEqualTo(LocalDate.of(2023, 12, 25));
        assertThat(response.isCheckedIn()).isFalse();
        assertThat(response.getType()).isEqualTo("JANTAR");
    }

    @Test
    void testSetters() {
        ReservationResponseDTO response = new ReservationResponseDTO(
                "abc123",
                "Restaurante do Porto",
                LocalDate.of(2023, 12, 25),
                false,
                "JANTAR"
        );

        response.setToken("xyz789");
        response.setRestaurantName("Restaurante da Serra");
        response.setDate(LocalDate.of(2024, 1, 1));
        response.setCheckedIn(true);
        response.setType("ALMOCO");

        assertThat(response.getToken()).isEqualTo("xyz789");
        assertThat(response.getRestaurantName()).isEqualTo("Restaurante da Serra");
        assertThat(response.getDate()).isEqualTo(LocalDate.of(2024, 1, 1));
        assertThat(response.isCheckedIn()).isTrue();
        assertThat(response.getType()).isEqualTo("ALMOCO");
    }
}