const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://mern-basic-app.onrender.com'
  : 'http://localhost:5001';

export default API_BASE_URL;