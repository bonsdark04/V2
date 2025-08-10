import axios from "axios";
import cookie from 'react-cookies'

const BASE_URL = 'http://localhost:3000/api/';

export const endpoints = {
    'categories': '/products/categories',
    'products': '/products',
    'register': '/user/register',
    'login': '/user/login',
    'profile': '/user/profile',
    'pay': '/cart/pay'
}

export const authApis = () => axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${cookie.load('token')}`
    }
})

export default axios.create({
    baseURL: BASE_URL
})