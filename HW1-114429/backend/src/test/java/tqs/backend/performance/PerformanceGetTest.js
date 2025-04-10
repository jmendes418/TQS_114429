import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 50,
    duration: '10s',
};

const BASE_URL = 'http://localhost:8081/api';
const RESTAURANTS_ENDPOINT = '/restaurants';
const MEALS_ENDPOINT = '/meals';

export default function () {
    const vu = __VU;
    const iter = __ITER;

    // Ajustado para suportar 5 restaurantes
    const restaurantId = (vu + iter) % 5 + 1;

    // GET: Lista de restaurantes
    const resRestaurants = http.get(`${BASE_URL}${RESTAURANTS_ENDPOINT}`);
    check(resRestaurants, {
        'GET /restaurants - status 200': (r) => r.status === 200,
    });

    // GET: Refeições de um restaurante
    const resMeals = http.get(`${BASE_URL}${MEALS_ENDPOINT}?restaurantId=${restaurantId}`);
    check(resMeals, {
        'GET /meals - status 200': (r) => r.status === 200,
    });

    sleep(0.2);
}