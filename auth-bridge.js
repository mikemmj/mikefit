(() => {
  const supabaseUrl = "https://ndlizdfcmmywpwrecskx.supabase.co";
  const supabaseKey = "sb_publishable_ggDoRBP2Ul658l-7rHKBPQ_WRrrOZqn";
  const client = window.supabase?.createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  if (!client) return;

  const form = document.getElementById("auth-form");
  const toggle = document.getElementById("auth-toggle");
  const submit = document.getElementById("auth-submit");
  const nameField = document.getElementById("name-field");
  const nameInput = document.getElementById("auth-name");
  const emailInput = document.getElementById("auth-email");
  const passwordInput = document.getElementById("auth-password");
  const title = document.getElementById("auth-title");
  const subtitle = document.getElementById("auth-subtitle");
  const message = document.getElementById("auth-message");
  if (!form || !toggle || !submit) return;

  let signup = false;
  const say = (text, type = "") => {
    message.textContent = text;
    message.className = `message ${type}`;
  };
  const setBusy = (busy) => {
    submit.disabled = busy;
    submit.textContent = busy ? (signup ? "Creating…" : "Signing in…") : (signup ? "Create account" : "Sign in");
  };

  toggle.onclick = () => {
    signup = !signup;
    nameField.classList.toggle("hidden", !signup);
    nameInput.required = signup;
    passwordInput.autocomplete = signup ? "new-password" : "current-password";
    title.textContent = signup ? "Create your account" : "Welcome back 👋";
    subtitle.textContent = signup ? "Start with a simple fitness plan." : "Sign in to continue your fitness journey.";
    toggle.textContent = signup ? "Already have an account? Sign in" : "Need an account? Sign up";
    say("");
    setBusy(false);
  };

  form.onsubmit = async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const name = nameInput.value.trim();
    if (!email || !password || (signup && !name)) {
      say("Please complete all required fields.", "error");
      return;
    }

    setBusy(true);
    say("");
    try {
      if (signup) {
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: window.location.origin + window.location.pathname
          }
        });
        if (error) throw error;
        if (data.session) {
          say("Account created. Opening MikeFit…", "success");
          window.location.reload();
        } else {
          say("Account created. Check your email for the verification link, then sign in.", "success");
          setBusy(false);
        }
      } else {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.session) throw new Error("Sign-in did not create a session. Please try again.");
        say("Signed in. Opening MikeFit…", "success");
        window.location.reload();
      }
    } catch (error) {
      const text = String(error?.message || "Authentication failed");
      say(text, "error");
      setBusy(false);
    }
  };
})();
