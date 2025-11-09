//used to make a mechanism between the frontend and backend to make the api calls
//it will fall to the localhost:8080 if the VITE_API_URL is not set

// Get API URL from environment variable or use development default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default API_URL;

