export const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null; // Return null if no token is found

  try {
    const user = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    return { token, user };
  } catch (err) {
    console.error('Invalid token:', err);
    return null; // Return null if the token is invalid
  }
};
