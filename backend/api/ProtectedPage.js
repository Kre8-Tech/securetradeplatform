import React from 'react';
import { getToken } from '../auth';

const ProtectedPage = ({ children }) => {
  const auth = getToken();

  if (!auth) {
    return <p>Please log in to access this page.</p>; // Fallback for unauthenticated users
  }

  return children; // Render the actual page if authenticated
};

export default ProtectedPage;
