import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // restore session on page load
  useEffect(() => {
    if (!localStorage.getItem('rh_token')) return setReady(true);
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('rh_token'))
      .finally(() => setReady(true));
  }, []);

  const handle = (d) => {
    localStorage.setItem('rh_token', d.token);
    setUser(d.user);
    return d.user;
  };

  const login = async (email, password) =>
    handle(await api('/auth/login', { method: 'POST', body: { email, password }, auth: false }));
  const register = async (name, email, password) =>
    handle(await api('/auth/register', { method: 'POST', body: { name, email, password }, auth: false }));
  const logout = () => {
    localStorage.removeItem('rh_token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, ready, login, register, logout }}>{children}</AuthContext.Provider>;
}
