const API_BASE = '/api/users';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
  }
  
  return data;
}

export async function fetchUsers() {
  const response = await fetch(API_BASE);
  return handleResponse(response);
}

export async function fetchUserById(id) {
  const response = await fetch(`${API_BASE}/${id}`);
  return handleResponse(response);
}

export async function createUser(userData) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

export async function updateUser(id, userData) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

export async function deleteUser(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}