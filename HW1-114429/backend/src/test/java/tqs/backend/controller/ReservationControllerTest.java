package tqs.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import tqs.backend.enums.MealType;
import tqs.backend.model.ReservationRequestDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
public class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateReservation_Success() throws Exception {
        ReservationRequestDTO request = new ReservationRequestDTO();
        request.setRestaurantId(1L);
        request.setDate(LocalDate.now().plusDays(1));
        request.setType(MealType.ALMOCO.name());

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.restaurantName").exists())
                .andExpect(jsonPath("$.type").value("ALMOCO"));
    }

    @Test
    void testCreateReservation_InvalidRestaurant() throws Exception {
        ReservationRequestDTO request = new ReservationRequestDTO();
        request.setRestaurantId(9999L);
        request.setDate(LocalDate.now().plusDays(1));
        request.setType(MealType.ALMOCO.name());

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCheckIn_InvalidToken() throws Exception {
        mockMvc.perform(post("/api/reservations/checkin/fake-token"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetReservation_InvalidToken() throws Exception {
        mockMvc.perform(get("/api/reservations/invalid-token"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCancelReservation_Success() throws Exception {
        ReservationRequestDTO request = new ReservationRequestDTO();
        request.setRestaurantId(1L);
        request.setDate(LocalDate.now().plusDays(2));
        request.setType(MealType.JANTAR.name());

        String response = mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(response).get("token").asText();

        mockMvc.perform(delete("/api/reservations/" + token))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("cancelada com sucesso")));
    }

    @Test
    void testCheckInReservation_Success() throws Exception {
        ReservationRequestDTO request = new ReservationRequestDTO();
        request.setRestaurantId(1L);
        request.setDate(LocalDate.now().plusDays(3));
        request.setType(MealType.ALMOCO.name());

        String response = mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(response).get("token").asText();

        mockMvc.perform(post("/api/reservations/checkin/" + token))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Check-in realizado com sucesso")));
    }

    @Test
    void testCreateReservation_DuplicateMealTypeSameDay() throws Exception {
        ReservationRequestDTO request = new ReservationRequestDTO();
        request.setRestaurantId(1L);
        request.setDate(LocalDate.now().plusDays(4));
        request.setType(MealType.JANTAR.name());

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void testCreateReservation_InvalidMealType() throws Exception {
        String payload = """
        {
            "restaurantId": 1,
            "date": "%s",
            "type": "BRUNCH"
        }
        """.formatted(LocalDate.now().plusDays(6));

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetReservation_ValidToken() throws Exception {
        ReservationRequestDTO request = new ReservationRequestDTO();
        request.setRestaurantId(1L);
        request.setDate(LocalDate.now().plusDays(5));
        request.setType(MealType.ALMOCO.name());

        String response = mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(response).get("token").asText();

        mockMvc.perform(get("/api/reservations/" + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(token))
                .andExpect(jsonPath("$.type").value("ALMOCO"));
    }

    @Test
    void testCancelReservation_InvalidToken() throws Exception {
        mockMvc.perform(delete("/api/reservations/invalid-token"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testHandleDataIntegrityViolationException() throws Exception {
        ReservationRequestDTO request = new ReservationRequestDTO();
        request.setRestaurantId(1L);
        request.setDate(LocalDate.now().plusDays(10));
        request.setType("ALMOCO");

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(content().string(containsString("Já existe uma reserva ativa")));
    }

}