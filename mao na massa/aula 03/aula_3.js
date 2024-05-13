import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(95) < 500'],
        http_req_failed: ['rate < 0.01']
    },
    stages: [
        {duration: '10s', target: 10}
    ]
}


export default function() {

    const BASE_URL = 'https://test-api.k6.io'

    const USER = `${Math.random()}@mail.com`
    const PASSWORD = 'user123'

    console.log(USER + PASSWORD)

    const res = http.post(`${BASE_URL}/user/register/`, {
        username: USER,
        first_name: 'Dino',
        last_name: 'Silvassauro',
        email: USER,
        password: PASSWORD
    })

    check(res, {
        'Sucesso ao registrar': (r) => r.status === 201
    })
    sleep(1)
}