/* global window */

const LOGIN_URL = 'notifications/users/login';
const REGISTER_URL = 'tickets/users/register';
const REGISTER_COMPANY_URL = 'tickets/users/company';
const FORGET_PASSWORD_URL = 'tickets/users/forgot-password';
const SAVE_PASSWORD_URL = 'tickets/users/update-password';

export const registerUser = ({ email }) => window.axiosInstance.post(REGISTER_URL, { email });

export const registerCompany = payload => window.axiosInstance.put(REGISTER_COMPANY_URL, payload);

export const savePassword = payload => window.axiosInstance.put(SAVE_PASSWORD_URL, payload);

export const loginUser = ({ email, password }) => window.axiosInstance.post(LOGIN_URL, { email, password });

export const forgetPassword = ({ email }) => window.axiosInstance.post(`${FORGET_PASSWORD_URL}?email=${email}`);

export const resetPassword = payload => window.axiosInstance.put(SAVE_PASSWORD_URL, payload);
