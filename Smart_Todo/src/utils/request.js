const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
console.log("API_DOMAIN:", API_DOMAIN);
const request = async (method, path, data) => {
  const response = await fetch(API_DOMAIN + path, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  const result = await response.json();
  return result;
};

// Export các hàm tương ứng với các phương thức HTTP
export const get = (path) => request("GET", path);

export const post = (path, data) => request("POST", path, data);

export const put = (path, data) => request("PUT", path, data);

export const patch = (path, data) => request("PATCH", path, data);

export const del = (path) => request("DELETE", path);
