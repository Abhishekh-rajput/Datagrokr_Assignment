export const getAllPosts = page => {
  return fetch(`/posts/?page=${page}`, {method: 'GET'})
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const getPost = postId => {
  return fetch(`/posts/${postId}`,
    {
      method: 'GET',
    })
    .then(response => response.json())
    .catch(err => console.log(err));
}

export const getUserPosts = (userId, token) => {
  return fetch(`/posts/user/${userId}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const createPost = (userId, token, post) => {
  return fetch(`/posts`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: post
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const deletePost = (postId, token) => {
  return fetch(`/posts/${postId}`,
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

export const updatePost = (postId, token, postData) => {
  return fetch(`/posts/${postId}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        // do not use 'Content-Type': 'application/json' for 'FormData'
        Authorization: `Bearer ${token}`
      },
      body: postData
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const likePost = (token, postId) => {
  return fetch(`/posts/like`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({postId})
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const unlikePost = (token, postId) => {
  return fetch(`/posts/unlike`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({postId})
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const addComment = (token, postId, comment) => {
  return fetch(`/posts/comment`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({postId, comment})
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const delComment = (token, postId, comment) => {
  return fetch(`/posts/uncomment`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({postId, comment})
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};
