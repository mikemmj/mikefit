(() => {
  const form = document.getElementById('auth-form');
  const submit = document.getElementById('auth-submit');
  const toggle = document.getElementById('auth-toggle');
  const message = document.getElementById('auth-message');
  if (!form || !submit || !window.supabase) return;

  const client = window.supabase.createClient(
    'https://ndlizdfcmmywpwrecskx.supabase.co',
    'sb_publishable_ggDoRBP2Ul658l-7rHKBPQ_WRrrOZqn',
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
  );

  let mode = 'signin';
  const setMessage = (text, type = '') => {
    message.textContent = text;
    message.className = `message ${type}`;
  };
  const withTimeout = (promise, ms = 15000) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Authentication is taking too long. Please check your internet connection and try again.')), ms))
  ]);

  toggle.addEventListener('click', () => {
    mode = mode === 'signin' ? 'signup' : 'signin';
    const nameField = document.getElementById('name-field');
    document.getElementById('auth-title').textContent = mode === 'signup' ? 'Create your account' : 'Welcome back 👋';
    document.getElementById('auth-subtitle').textContent = mode === 'signup' ? 'Start with a simple fitness plan.' : 'Sign in to continue your fitness journey.';
    nameField.classList.toggle('hidden', mode !== 'signup');
    document.getElementById('auth-name').required = mode === 'signup';
    submit.textContent = mode === 'signup' ? 'Create account' : 'Sign in';
    toggle.textContent = mode === 'signup' ? 'Already have an account? Sign in' : 'Need an account? Sign up';
    setMessage('');
  }, true);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    submit.disabled = true;
    submit.textContent = mode === 'signup' ? 'Creating account…' : 'Signing in…';
    setMessage('');

    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const name = document.getElementById('auth-name').value.trim();

    try {
      if (!email || !password || (mode === 'signup' && !name)) throw new Error('Please complete all required fields.');
      let result;
      if (mode === 'signup') {
        result = await withTimeout(client.auth.signUp({
          email,
          password,
          options: { data: { name }, emailRedirectTo: window.location.origin + window.location.pathname }
        }));
        if (result.error) throw result.error;
        if (!result.data.session) {
          setMessage('Account created. Check your email (including spam/junk) for the verification link, then come back and sign in.', 'success');
          submit.disabled = false;
          submit.textContent = 'Create account';
          return;
        }
      } else {
        result = await withTimeout(client.auth.signInWithPassword({ email, password }));
        if (result.error) throw result.error;
      }

      const session = result.data.session;
      if (!session?.user) throw new Error('Authentication completed but no user session was returned. Please try again.');

      // Let the main app render from the confirmed session instead of waiting on profile/database queries.
      window.__mikefitAuthUser = session.user;
      document.getElementById('auth-screen').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      if (typeof window.render === 'function') window.render('home');
    } catch (error) {
      const msg = error?.message || 'Authentication failed. Please try again.';
      setMessage(msg, 'error');
      submit.disabled = false;
      submit.textContent = mode === 'signup' ? 'Create account' : 'Sign in';
    }
  }, true);
})();
