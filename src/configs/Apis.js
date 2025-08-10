import axios from "axios";
import cookie from 'react-cookies'

const BASE_URL = 'http://localhost:3000/api/';

export const endpoints = {
    // Home
    'home': '/home',
    
    // Products
    'products': '/products',
    'product-detail': '/products',
    'product-categories': '/products/category',
    
    // User authentication
    'register': '/user/register',
    'login': '/user/login',
    'logout': '/user/logout',
    'profile': '/user/profile',
    'forgot-password': '/user/forgot-password',
    'reset-password': '/user/reset-password',
    'otp-password': '/user/otp-password',
    
    // Cart
    'cart': '/cart',
    'add-to-cart': '/cart/add',
    'update-cart': '/cart/update',
    'delete-cart': '/cart/delete',
    
    // Checkout
    'checkout': '/checkout',
    'checkout-success': '/checkout/success',
    
    // Comments
    'comments': '/comments',
    'add-comment': '/comments/add',
    'delete-comment': '/comments/delete',
    
    // Search
    'search': '/search',
    
    // Chat
    'chat': '/chat',
    'chat-rooms': '/rooms-chat',
    'create-chat-room': '/rooms-chat/create',
    
    // Users (friends, requests)
    'users': '/users',
    'friend-requests': '/users/request',
    'accept-friend': '/users/accept',
    'not-friend': '/users/not-friend',
    'friends': '/users/friend'
}

export const authApis = () => axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${cookie.load('tokenUser')}`
    }
})

export default axios.create({
    baseURL: BASE_URL
})
