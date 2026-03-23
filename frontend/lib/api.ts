const API_BASE_URL = "http://127.0.0.1:8000";

export async function apiRequest(endpoint: string, options: any = {}) {
  // Get token from local storage (browser side)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Auto-redirect to login if token is expired (401 Unauthorized)
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  return response.json();
}