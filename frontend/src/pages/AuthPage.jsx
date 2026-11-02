import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="wrap pad narrow">
      <h1>{isLogin ? 'Log in' : 'Create your account'}</h1>
      {location.state?.from && <p className="notice">Log in to continue to checkout.</p>}
      <form className="form" onSubmit={submit}>
        {!isLogin && <label>Full name<input value={form.name} onChange={set('name')} autoComplete="name" required /></label>}
        <label>Email<input type="email" value={form.email} onChange={set('email')} autoComplete="email" required /></label>
        <label>Password<input type="password" value={form.password} onChange={set('password')} autoComplete={isLogin ? 'current-password' : 'new-password'} minLength={6} required /></label>
        {error && <p className="notice error" role="alert">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}</button>
      </form>
      <p>
        {isLogin ? <>New here? <Link to="/register" state={location.state}>Create an account</Link></> : <>Already have an account? <Link to="/login" state={location.state}>Log in</Link></>}
      </p>
    </div>
  );
}
