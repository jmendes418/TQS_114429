package tqs.cars_containers.data;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.cars_containers.model.Car;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    public Car findByCarId(Long carId);

    public List<Car> findAll();

}
