import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-61bb2.firebaseio.com/'
});

export default instance;