// const axios = require('axios');
import axios from 'axios';
import { showAlert } from './alert';
export const login = async (email, password) => {
  console.log('action inside the login function');
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status == 'success') {
      showAlert('success', 'you are logged in');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }

    console.log('respose after click', res);
    console.log(email, password);
  } catch (err) {
    console.log(`error: ${err}`);
    showAlert('error', err.response.data.message);
    // console.error(err.response.data);
  }
};
// document.querySelector('.form').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const email = document.querySelector('#email').value;
//   const password = document.querySelector('#password').value;
//   login(email, password);
//   console.log('post action happen');
// });
// above code is still working if comment out but i use parcel-bundle so this function is going to index.js file of public/js folder
// console.log('hello from outside');
export const logout = async () => {
  console.log('logout btn is clicked');
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });
    if (res.data.status == 'success') location.reload(true);
  } catch (error) {
    showAlert('error', 'Error Logging out Try Again');
  }
};
