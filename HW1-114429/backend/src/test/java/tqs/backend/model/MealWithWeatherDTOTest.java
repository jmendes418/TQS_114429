package tqs.backend.model;

import tqs.backend.entity.Meal;
import tqs.backend.entity.Weather;
import tqs.backend.enums.MealType;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

public class MealWithWeatherDTOTest {

    @Test
    void testConstructorAndGetters() {
        Meal meal = new Meal();
        meal.setId(2L);
        meal.setDescription("Feijoada");
        meal.setDate(LocalDate.of(2026, 5, 15));
        meal.setType(MealType.JANTAR);

        Weather forecast = new Weather();
        forecast.setMaxTemp(30.0);
        forecast.setMinTemp(18.0);
        forecast.setPrecipitation(5.0);

        MealWithWeatherDTO dto = new MealWithWeatherDTO(meal, forecast);

        assertThat(dto.getDescription()).isEqualTo("Feijoada");
        assertThat(dto.getDate()).isEqualTo(LocalDate.of(2026, 5, 15));
        assertThat(dto.getType()).isEqualTo(MealType.JANTAR);
        assertThat(dto.getForecast()).isEqualTo(forecast);
    }

    @Test
    void testSetters() {
        MealWithWeatherDTO dto = new MealWithWeatherDTO(new Meal(), new Weather());

        dto.setDescription("Pizza");
        dto.setDate(LocalDate.of(2026, 6, 20));
        dto.setType(MealType.ALMOCO);
        Weather forecast = new Weather();
        forecast.setPrecipitation(10.0);
        dto.setForecast(forecast);

        assertThat(dto.getDescription()).isEqualTo("Pizza");
        assertThat(dto.getDate()).isEqualTo(LocalDate.of(2026, 6, 20));
        assertThat(dto.getType()).isEqualTo(MealType.ALMOCO);
        assertThat(dto.getForecast().getPrecipitation()).isEqualTo(10.0);
    }
}