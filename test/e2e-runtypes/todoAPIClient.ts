import { createConsumer } from 'rest-ts-axios';
import axios from 'axios';
import { todoAPI } from './todoAPI';

export function getClient(baseURL: string) {
    return createConsumer(todoAPI, axios.create({
        baseURL: baseURL
    }));
}
