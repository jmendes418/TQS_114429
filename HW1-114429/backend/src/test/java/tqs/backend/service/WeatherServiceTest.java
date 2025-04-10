package tqs.backend.service;

import tqs.backend.entity.Weather;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@org.junit.jupiter.api.extension.ExtendWith(MockitoExtension.class)
class WeatherServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private WeatherService weatherService;

    @Test
    void testGetForecastForDate_ReturnsExpectedForecast() {
        LocalDate date = LocalDate.of(2026, 5, 20);

        Map<String, Object> response = createMockWeatherResponse();

        when(restTemplate.getForObject(org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.eq(Map.class)))
                .thenReturn(response);

        Weather forecast = weatherService.getForecastForDate(date);

        assertThat(forecast.getDate()).isEqualTo(date);
        assertThat(forecast.getMaxTemp()).isEqualTo(25.0);
        assertThat(forecast.getMinTemp()).isEqualTo(15.0);
        assertThat(forecast.getPrecipitation()).isEqualTo(2.0);
    }

    private Map<String, Object> createMockWeatherResponse() {
        Map<String, Object> daily = new HashMap<>();
        daily.put("time", List.of("2026-05-19", "2026-05-20"));
        daily.put("temperature_2m_max", List.of(20.0, 25.0));
        daily.put("temperature_2m_min", List.of(12.0, 15.0));
        daily.put("precipitation_sum", List.of(0.5, 2.0));

        Map<String, Object> response = new HashMap<>();
        response.put("daily", daily);

        return response;
    }
}