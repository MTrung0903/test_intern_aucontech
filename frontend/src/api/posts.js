import client from './client.js';

export async function getMyPosts(page = 0, size = 10) {
  const res = await client.get(`/posts`, { params: { page, size } });
  return res.data;
}

export async function getAllPosts(page = 0, size = 10) {
  const res = await client.get(`/posts/get-posts`, { params: { page, size } });
  return res.data;
}

export async function createPost(data) {
  const res = await client.post(`/posts`, data);
  return res.data;
}

export async function getPost(id) {
  const res = await client.get(`/posts/${id}`);
  return res.data;
}
export async function searchPosts(title, page = 0, size = 10) {
  const res = await client.get(`/posts/search`, { 
    params: { title, page, size } 
  });
  return res.data;
}

export async function updatePost(id, data) {
  const res = await client.put(`/posts/${id}`, data);
  return res.data;
}

export async function deletePost(id) {
  const res = await client.delete(`/posts/${id}`);
  return res.data;
}


