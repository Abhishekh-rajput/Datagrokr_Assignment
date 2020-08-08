// get all users
export const getAllUsers = () => {
  return fetch(`/users`, {method: 'GET'})
    .then(response => response.json())
    .catch(err => console.log(err));
};

// get 1 user with 'userId' in url param using token
export const getUser = (userId, token) => {
  return fetch(`/users/${userId}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

// update user
export const updateUser = (userId, token, userData) => {
  return fetch(`/users/${userId}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        // do not use 'Content-Type': 'application/json' for 'FormData'
        Authorization: `Bearer ${token}`      
      },
      body: userData
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

// delete user from database
export const deleteUser = (userId, token) => {
  return fetch(`/users/${userId}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

// update token with updated user info (for showing correct name in menu)
export const updateToken = (user) => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('rd03')) {
      let token = JSON.parse(localStorage.getItem('rd03'));
      token.user.name = user.name;
      token.user.email = user.email;
      localStorage.setItem('rd03', JSON.stringify(token));
    }
  }
};

// add 'following' to logged-in user & add 'follower' to profile user
export const followApi = (loggedInUserToken, profileId) => {
  return fetch(`/users/follow`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loggedInUserToken}`
      },
      body: JSON.stringify({followingId: profileId})
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

// remove 'following' from logged-in user & remove 'follower' from profile user
export const unfollowApi = (loggedInUserToken, profileId) => {
  return fetch(`/users/unfollow`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loggedInUserToken}`
      },
      body: JSON.stringify({unfollowingId: profileId})
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const suggestUsers = (loggedInUserToken) => {
  return fetch(`/users/suggest`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${loggedInUserToken}`
      }
    })
    .then(response => response.json())
    .catch(err => console.log(err));    
}
