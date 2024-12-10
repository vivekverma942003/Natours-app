import axios from 'axios';
import { showAlert } from './alert';
// export const updateData = async (name, email) => {
//   try {
//     const res = await axios({
//       method: 'PATCH',
//       url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
//       data: {
//         name: name,
//         email: email,
//       },
//     });
//     if (res.data.status == 'success') {
//       showAlert('success', 'Your data is updated');
//       window.setTimeout(() => {
//         location.assign('/me');
//       }, 1500);
//     }
//   } catch (err) {
//     console.log(`error: ${err}`);
//     showAlert('error', err.response.data.message);
//   }
// };
// modifying the above function to work for password and data both
// type is either data or password
export const updateData = async (data, type) => {
  const url =
    type === 'password'
      ? 'http://127.0.0.1:3000/api/v1/users/updatePassword'
      : 'http://127.0.0.1:3000/api/v1/users/updateMe';
  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status == 'success') {
      showAlert('success', `Your ${type} is updated`);
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    console.log(`error: ${err}`);
    showAlert('error', err.response.data.message);
  }
};
