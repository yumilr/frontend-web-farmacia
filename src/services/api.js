import axios from 'axios';

const instance = axios.create({
  baseURL: "https://lejxxzvc7g.execute-api.us-east-1.amazonaws.com/dev",
  headers: {
    'Content-Type': 'application/json',
  }
});

export default instance;
