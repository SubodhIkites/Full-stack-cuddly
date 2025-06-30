const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  mobile: '9876543210'
};

const testCategory = {
  name: 'Teddy Bears',
  image: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
  description: 'Soft and cuddly teddy bears for all ages',
  slug: 'teddy-bears'
};

const testProduct = {
  name: 'Cute Brown Teddy Bear',
  description: 'A soft and cuddly brown teddy bear perfect for children and collectors',
  price: 29.99,
  images: [
    'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
    'https://images.pexels.com/photos/1648777/pexels-photo-1648777.jpeg'
  ],
  stock: 50,
  specifications: {
    'Material': 'Plush fabric',
    'Size': '12 inches',
    'Age Group': '3+ years',
    'Care Instructions': 'Machine washable'
  }
};

let authToken = '';
let userId = '';
let categoryId = '';
let productId = '';

async function testAPI() {
  try {
    console.log('🧸 Starting Soft Toys Ecommerce API Tests...\n');

    // Test 1: User Registration
    console.log('1. Testing User Registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/users/register`, testUser);
      console.log('✅ User registration successful');
      authToken = registerResponse.data.token;
      userId = registerResponse.data.user.id;
    } catch (error) {
      console.log('❌ User registration failed:', error.response?.data?.message || error.message);
    }

    // Test 2: User Login
    console.log('\n2. Testing User Login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ User login successful');
      authToken = loginResponse.data.token;
    } catch (error) {
      console.log('❌ User login failed:', error.response?.data?.message || error.message);
    }

    const headers = { Authorization: `Bearer ${authToken}` };

    // Test 3: Get User Profile
    console.log('\n3. Testing Get User Profile...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/users/me`, { headers });
      console.log('✅ Get user profile successful');
    } catch (error) {
      console.log('❌ Get user profile failed:', error.response?.data?.message || error.message);
    }

    // Test 4: Create Category (Admin required)
    console.log('\n4. Testing Create Category...');
    try {
      const categoryResponse = await axios.post(`${BASE_URL}/categories`, testCategory, { headers });
      console.log('✅ Category creation successful');
      categoryId = categoryResponse.data.data._id;
    } catch (error) {
      console.log('❌ Category creation failed:', error.response?.data?.message || error.message);
    }

    // Test 5: Get Categories
    console.log('\n5. Testing Get Categories...');
    try {
      const categoriesResponse = await axios.get(`${BASE_URL}/categories`);
      console.log('✅ Get categories successful');
      if (categoriesResponse.data.data.length > 0) {
        categoryId = categoriesResponse.data.data[0]._id;
      }
    } catch (error) {
      console.log('❌ Get categories failed:', error.response?.data?.message || error.message);
    }

    // Test 6: Create Product (Admin required)
    console.log('\n6. Testing Create Product...');
    try {
      const productData = { ...testProduct, category: categoryId };
      const productResponse = await axios.post(`${BASE_URL}/products`, productData, { headers });
      console.log('✅ Product creation successful');
      productId = productResponse.data.data._id;
    } catch (error) {
      console.log('❌ Product creation failed:', error.response?.data?.message || error.message);
    }

    // Test 7: Get Products
    console.log('\n7. Testing Get Products...');
    try {
      const productsResponse = await axios.get(`${BASE_URL}/products`);
      console.log('✅ Get products successful');
      if (productsResponse.data.data.length > 0) {
        productId = productsResponse.data.data[0]._id;
      }
    } catch (error) {
      console.log('❌ Get products failed:', error.response?.data?.message || error.message);
    }

    // Test 8: Add to Cart
    console.log('\n8. Testing Add to Cart...');
    try {
      const cartResponse = await axios.post(`${BASE_URL}/cart/add`, {
        productId: productId,
        quantity: 2
      }, { headers });
      console.log('✅ Add to cart successful');
    } catch (error) {
      console.log('❌ Add to cart failed:', error.response?.data?.message || error.message);
    }

    // Test 9: Get Cart
    console.log('\n9. Testing Get Cart...');
    try {
      const getCartResponse = await axios.get(`${BASE_URL}/cart`, { headers });
      console.log('✅ Get cart successful');
    } catch (error) {
      console.log('❌ Get cart failed:', error.response?.data?.message || error.message);
    }

    // Test 10: Create Address
    console.log('\n10. Testing Create Address...');
    try {
      const addressData = {
        fullName: 'John Doe',
        phoneNumber: '9876543210',
        streetAddress: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        addressType: 'home',
        isDefault: true
      };
      const addressResponse = await axios.post(`${BASE_URL}/addresses`, addressData, { headers });
      console.log('✅ Create address successful');
    } catch (error) {
      console.log('❌ Create address failed:', error.response?.data?.message || error.message);
    }

    // Test 11: Get Addresses
    console.log('\n11. Testing Get Addresses...');
    try {
      const addressesResponse = await axios.get(`${BASE_URL}/addresses`, { headers });
      console.log('✅ Get addresses successful');
    } catch (error) {
      console.log('❌ Get addresses failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 API Testing Complete!');

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Run tests
testAPI();