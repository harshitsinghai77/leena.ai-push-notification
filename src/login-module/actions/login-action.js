/* global window */

const LOGIN_URL = 'api/notifications/users/login';
const FORGET_PASSWORD_URL = 'api/users/forgot-password';
const RESET_PASSWORD_URL = 'api/users/reset-password';

export const loginUser = ({ email, password }) => window.axiosInstance.post(LOGIN_URL, { email: email.trim(), password });

/**
 * API to hit when user clicks on 'forgot password'
 * @param email
 * @returns {AxiosPromise<any>}
 */
export const forgetPassword = ({ email }) => {
  const apiUrl = `${FORGET_PASSWORD_URL}?email=${email}&app=notification`;
  return window.axiosInstance.post(apiUrl);
};

/**
 * API to update password after user has clicked on 'forgot password'
 * @param payload
 * @returns {AxiosPromise<any>}
 */
export const resetPassword = payload => window.axiosInstance.post(RESET_PASSWORD_URL, payload);
