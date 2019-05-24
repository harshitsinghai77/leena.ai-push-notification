import { storage as globalStorage } from 'leena-components';

const keyToken = 'TOKEN_KEY';
const keyCurrentBotID = 'CURRENT_BOT_ID';
const keyCurrentUserID = 'CURRENT_USER_ID';
const keyCurrentUserEmail = 'CURRENT_USER_EMAIL';

/**
 * save the auth token
 * @param token
 */
export function saveToken(token) {
  globalStorage.setItem(keyToken, `JWT ${token}`);
}

/**
 * Reads auth token
 * @return {*}
 */
export function getToken() {
  return globalStorage.getItem(keyToken);
}

/**
 * Delete auth token
 * @return {*}
 */
export function deleteToken() {
  return globalStorage.removeItem(keyToken);
}

/**
 * Save info about current bot
 * @param botID
 */
export function setCurrentBot(botID) {
  if (botID !== getCurrentBot()) {
    globalStorage.setItem(keyCurrentBotID, botID);
  }
}

/**
 * Read info about current bot
 * @return {*}
 */
export function getCurrentBot() {
  return globalStorage.getItem(keyCurrentBotID);
}

/**
 * Clear info about current bot
 * @return {*}
 */
export function clearCurrentBot() {
  return globalStorage.removeItem(keyCurrentBotID);
}
/** ********************************************* */
export function setUserId(botID) {
  if (botID !== getCurrentBot()) {
    globalStorage.setItem(keyCurrentUserID, botID);
  }
}

/**
 * Read info about current bot
 * @return {*}
 */
export function getUserId() {
  return globalStorage.getItem(keyCurrentUserID);
}

/**
 * Clear info about current bot
 * @return {*}
 */
export function clearUserId() {
  return globalStorage.removeItem(keyCurrentUserID);
}
/** ********************************************* */
export function setUserEmail(botID) {
  if (botID !== getCurrentBot()) {
    globalStorage.setItem(keyCurrentUserEmail, botID);
  }
}

/**
 * Read info about current bot
 * @return {*}
 */
export function getUserEmail() {
  return globalStorage.getItem(keyCurrentUserEmail);
}

/**
 * Clear info about current bot
 * @return {*}
 */
export function clearUserEmail() {
  return globalStorage.removeItem(keyCurrentUserEmail);
}
