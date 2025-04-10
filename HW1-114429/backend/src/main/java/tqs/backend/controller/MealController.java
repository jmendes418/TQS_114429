package tqs.backend.controller;

import tqs.backend.entity.Meal;
import tqs.backend.model.MealWithWeatherDTO;
import tqs.backend.entity.Weather;
import tqs.backend.repository.MealRepository;
import tqs.backend.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/meals")
public class MealController {

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private WeatherService weatherService;

    @GetMapping
    public List<MealWithWeatherDTO> getMealsWithWeather(@RequestParam Long restaurantId) {
        List<Meal> meals = mealRepository.findByRestaurantId(restaurantId);
        List<MealWithWeatherDTO> result = new ArrayList<>();

        for (Meal meal : meals) {
            Weather forecast = weatherService.getForecastForDate(meal.getDate());
            result.add(new MealWithWeatherDTO(meal, forecast));
        }

        return result;
    }
}