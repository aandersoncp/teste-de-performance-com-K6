import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = 'https://test-api.k6.io/public'

export const options = {
    scenarios:{
        listar:{
            executor: 'constant-arrival-rate',
            exec: 'listar',
            duration: '30s',
            rate: 200,
            timeUnit: '1s',
            preAllocatedVus: 150,
            gracefulStop: '10s',
            tags: {test_type: 'Listagem_de_crocodilos'}
        }, 
        buscar:{
            executor: 'per-vu-iterations',
            exec: 'buscar',
            vus: 50,
            iterations: 20,
            maxDuration: '1m',
            gracefulStop: '10s',
            tags: {test_type: 'Busca_de_crocodilos'}
        }
    }
}

export function listar() {
    http.get(__ENV.URL+'crocodiles')
}

export function buscar() {
    if(__VU % 2 === 0){
        http.get(__ENV.URL+'crocodiles/2')
    } else {
        http.get(__ENV.URL+'crocodiles/1')
    }   
}




export default function(token) {

    const params = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }

    const res = http.get(`${BASE_URL}/my/crocodiles/`, params)

    check(res, {
        'Sucesso no acesso': (r) => r.status === 200,
    })
     sleep(1)
}

//k6 run aula_6.js -e URL=https://test-api.k6.io/public