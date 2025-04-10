package tqs.backend.model;

import tqs.backend.entity.Meal;
import tqs.backend.entity.Weather;
import tqs.backend.enums.MealType;

import java.time.LocalDate;

public class MealWithWeatherDTO {
    private String description;
    private LocalDate date;
    private MealType type;
    private Weather forecast;

    public MealWithWeatherDTO(Meal meal, Weather forecast) {
        this.description = meal.getDescription();
        this.date = meal.getDate();
        this.type = meal.getType();
        this.forecast = forecast;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getDate() {
        return date;
    }

    public MealType getType() {
        return type;
    }

    public Weather getForecast() {
        return forecast;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setType(MealType type) {
        this.type = type;
    }

    public void setForecast(Weather forecast) {
        this.forecast = forecast;
    }
}