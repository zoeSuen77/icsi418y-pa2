import { useState } from 'react';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

export default function App() {
  const [view, setView] = useState('login');
  const [initialUsername, setInitialUsername] = useState('');

  function showLogin(username = '') {
    setInitialUsername(username);
    setView('login');
  }

  return <main className="app-shell">
    <aside className="intro-panel" aria-label="Welcome to Campus">
      <a className="brand" href="/" aria-label="Campus home"><span className="brand-mark" aria-hidden="true">c</span>campus<span className="brand-dot">.</span></a>
      <div className="intro-copy"><span className="small-tag">A SPACE TO BEGIN</span><h2>Make yourself<br />at home.</h2><p>Your account is the first step.<br />Let’s get you settled in.</p></div>
      <div className="arch-art" aria-hidden="true"><div className="arch arch-back" /><div className="arch arch-front" /><div className="art-orbit" /><span className="art-star">✳</span></div>
      <p className="intro-footer"><span className="footer-dot" /> A little connection goes a long way.</p>
    </aside>
    <section className="account-panel" aria-label="Account access">
      <nav className="view-switch" aria-label="Choose account form">
        <button aria-current={view === 'login' ? 'page' : undefined} onClick={() => showLogin()}>Log in</button>
        <button aria-current={view === 'signup' ? 'page' : undefined} onClick={() => setView('signup')}>Sign up</button>
      </nav>
      <div className="form-container">
        {view === 'login' ? <Login initialUsername={initialUsername} onSignup={() => setView('signup')} /> : <Signup onLogin={showLogin} />}
      </div>
      <footer className="account-footer"><span>ICSI 418Y</span><span>PA2 · Login & Signup</span></footer>
    </section>
  </main>;
}
