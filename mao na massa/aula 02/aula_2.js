import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

export const options = {
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(95) < 200']
    },
    stages: [
        {duration: '10s', target: 10},
        {duration: '10s', target: 10},
        {duration: '10s', target: 0}
    ]
}

const data = new SharedArray('Leitura do json', function(){
    return JSON.parse(open('/dados.json')).crocodiles
})

export default function() {

    const crocodilo = data[Math.floor(Math.random()*data.length)].id

    console.log(crocodilo)

    const BASE_URL = `https://test-api.k6.io/public/crocodiles/${crocodilo}`

    const res = http.get(BASE_URL)

    check(res, {
        'Status code 200': (r) => r.status === 200
    })
    sleep(1)
}