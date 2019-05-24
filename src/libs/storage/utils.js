/* global window */
import qs from 'querystring';
import { getUserId } from './tokenStorage';

const getCurrentUserId = () => {
  const { userId } = qs.parse(window.location.search);
  return userId || getUserId();
};

function getBuildUserName(user, useAnonymous) {
  if (user && user.displayName) { return user.displayName; }
  if (user && user.firstName) { return `${user.firstName} ${user.lastName}`; }
  if (user && user.email) { return user.email; }
  return useAnonymous ? 'Anonymous' : '-';
}

export const getUserName = (user, useYou = true, useAnonymous = true) => {
  const currentUserId = getCurrentUserId();
  if (useYou && user && user.id === currentUserId) {
    return 'You';
  }
  const buildUserName = getBuildUserName(user, useAnonymous);
  if (buildUserName.indexOf('@') === -1) {
    return buildUserName.split(' ').map(namePart => namePart.charAt(0).toUpperCase() + namePart.slice(1)).slice(0, 2).join(' ');
  }
  return buildUserName;
};

export const getCategoryNamedArray = (category = {}) => {
  const { name, subCategory = [] } = category;
  if (Object.keys(subCategory).length > 0) {
    return [name, ...getCategoryNamedArray(subCategory)];
  }
  if (name) {
    return [name];
  }
  return [];
};

export const getCategoryName = (category = {}) => {
  const { name, subCategory } = category;
  if (name && subCategory && subCategory.name) {
    return `${name} > ${getCategoryName(subCategory)}`;
  }
  if (name) {
    return `${name}`;
  }
  return '';
};


export function getCategoryStructure(category = '') {
  if (typeof category === 'string') {
    const categories = category.split('>').map(item => item.trim());
    return {
      name: categories[0],
      subCategory: {
        name: categories[1],
        subCategory: {
          name: categories[2],
        },
      },
    };
  }
  return {
    name: category[0],
    subCategory: {
      name: category[1],
      subCategory: {
        name: category[2],
      },
    },
  };
}
