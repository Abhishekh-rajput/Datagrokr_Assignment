export const signup = user => {
  return fetch(`/signup`,
    {
      method: 'POST',
      headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const signin = user => {
  return fetch(`/signin`,
    {
      method: 'POST',
      headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const saveToken = (token, cb) => {
  if (typeof window !== 'undefined') localStorage.setItem('rd03', JSON.stringify(token));
};

export const signout = history => {
  if (typeof window !== 'undefined') localStorage.removeItem('rd03');   // logout on client side
  history.push('/');
  return fetch(`/signout`, {method: 'POST'})
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const isLoggedIn = () => {
  if (typeof window == 'undefined') return false;
  const token = localStorage.getItem('rd03');
  if (token) return JSON.parse(token);
  else return false;
};

export const forgotPassword = email => {
  return fetch(`/forgot-password/`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email})
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const resetPassword = resetInfo => {
  return fetch(`/reset-password/`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resetInfo)
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const socialLogin = user => {
  return fetch(`/social-login/`,
    {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      // credentials: 'include', // works only in the same origin
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};
