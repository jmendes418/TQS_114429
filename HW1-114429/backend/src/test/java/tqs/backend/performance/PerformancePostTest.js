import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 30,
    duration: '15s',
};

const BASE_URL = 'http://localhost:8081/api';
const RESTAURANT_IDS = [1, 2, 3, 4, 5];
const BASE_DATE = '2026-05-01';
const HEADERS = { 'Content-Type': 'application/json' };

export default function () {
    const restaurantId = RESTAURANT_IDS[__VU % RESTAURANT_IDS.length];
    const type = __ITER % 2 === 0 ? 'ALMOCO' : 'JANTAR';

    const date = new Date(BASE_DATE);
    date.setDate(date.getDate() + __VU + __ITER);
    const formattedDate = date.toISOString().split('T')[0];

    const payload = JSON.stringify({
        restaurantId: restaurantId,
        date: formattedDate,
        type: type,
    });

    const res = http.post(`${BASE_URL}/reservations`, payload, { headers: HEADERS });

    check(res, {
        'status (2xx/4xx)': (r) => r.status >= 200 && r.status < 500,
    });
}