package tqs.cars_containers.services;

import org.springframework.stereotype.Service;
import tqs.cars_containers.data.CarRepository;
import tqs.cars_containers.model.Car;

import java.util.List;
import java.util.Optional;

@Service
public class CarManagerService {

    final
    CarRepository carRepository;

    public CarManagerService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }


    public Car save(Car oneCar) {
        return carRepository.save(oneCar);
    }

    public List<Car> getAllCars() {

        return carRepository.findAll();
    }

    public Optional<Car> getCarDetails(Long carId) {
        return Optional.of(carRepository.findByCarId(carId) );
    }
}
