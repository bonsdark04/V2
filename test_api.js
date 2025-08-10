// File test API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test function
async function testAPI() {
  try {
    console.log('=== Testing API Endpoints ===\n');

    // Test Home API
    console.log('1. Testing Home API...');
    const homeResponse = await axios.get(`${BASE_URL}/home`);
    console.log('Home API Response:', homeResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('Data:', homeResponse.data.data ? 'Has data' : 'No data');
    console.log('');

    // Test Products API
    console.log('2. Testing Products API...');
    const productsResponse = await axios.get(`${BASE_URL}/products`);
    console.log('Products API Response:', productsResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('Products count:', productsResponse.data.data?.products?.length || 0);
    console.log('');

    // Test Search API
    console.log('3. Testing Search API...');
    const searchResponse = await axios.get(`${BASE_URL}/search?keyword=test`);
    console.log('Search API Response:', searchResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('Search results:', searchResponse.data.data?.products?.length || 0);
    console.log('');

    // Test User Register API
    console.log('4. Testing User Register API...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/user/register`, {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      });
      console.log('Register API Response:', registerResponse.data.success ? 'SUCCESS' : 'FAILED');
      console.log('Message:', registerResponse.data.message);
    } catch (error) {
      console.log('Register API Error:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test Cart API (without auth - should work for getting cart)
    console.log('5. Testing Cart API...');
    try {
      const cartResponse = await axios.get(`${BASE_URL}/cart`);
      console.log('Cart API Response:', cartResponse.data.success ? 'SUCCESS' : 'FAILED');
    } catch (error) {
      console.log('Cart API Error:', error.response?.data?.message || error.message);
    }
    console.log('');

    console.log('=== API Testing Complete ===');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
