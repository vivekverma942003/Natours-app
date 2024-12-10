console.log('hello parcek'); // A polyfill is a piece of code, usually JavaScript, used to provide modern functionality on older browsers that do not natively support it
import '@babel/polyfill';
import { login } from './login';
import { logout } from './login';
import { updateData } from './updateSetting';
import { showAlert } from './alert';
// dom element
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataUpdateForm = document.querySelector('.form-user-data');
const userPasswordUpdateForm = document.querySelector('.form-user-password');

// values

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
    console.log('post action happen');
  });
}
console.log(logoutBtn);
if (logoutBtn) {
  console.log('logout btn is clicked this is call fromt index');
  logoutBtn.addEventListener('click', logout);
}
if (userDataUpdateForm) {
  console.log('user update data is happening');
  userDataUpdateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    updateData({ name, email }, 'data');
    console.log('updating is done');
  });
}
if (userPasswordUpdateForm) {
  console.log('user password in updating');
  userPasswordUpdateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.querySelector('#password-current');
    const password = document.querySelector('#password');
    const confirmPassword = document.querySelector('#password-confirm');
    await updateData(
      { currentPassword, password, confirmPassword },
      'password',
    );
    console.log('updating password is done');
  });
}
