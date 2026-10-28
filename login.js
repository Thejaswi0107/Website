const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('loginEmail');
const passwordInput = document.getElementById('loginPassword');
const rememberMe = document.getElementById('rememberMe');
const authStatus = document.getElementById('authStatus');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

function showStatus(message, type = 'info') {
  if (!authStatus) return;

  authStatus.textContent = message;
  authStatus.classList.add('visible');
  authStatus.classList.remove('error', 'success');

  if (type === 'error') {
    authStatus.classList.add('error');
  }

  if (type === 'success') {
    authStatus.classList.add('success');
  }
}

function clearStatus() {
  if (!authStatus) return;
  authStatus.textContent = '';
  authStatus.classList.remove('visible', 'error', 'success');
}

function setFieldError(input, message) {
  if (!input) return;
  const errorEl = document.getElementById(`${input.id}Error`);
  input.classList.toggle('is-invalid', Boolean(message));
  input.setCustomValidity(message || '');

  if (errorEl) {
    errorEl.textContent = message || '';
  }
}

function isValidEmailAddress(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidMobileNumber(value) {
  const normalized = value.replace(/\s+/g, '');
  return /^\+?[0-9]{10,15}$/.test(normalized);
}

function isValidIdentifier(value) {
  const trimmed = value.trim();
  return trimmed.length > 0 && (isValidEmailAddress(trimmed) || isValidMobileNumber(trimmed));
}

function validateIdentifier() {
  const value = emailInput.value;
  if (!isValidIdentifier(value)) {
    setFieldError(emailInput, 'Please enter a valid email address or mobile number.');
    return false;
  }

  setFieldError(emailInput, '');
  return true;
}

function validatePassword() {
  const value = passwordInput.value;
  if (value.length < 8) {
    setFieldError(passwordInput, 'Password must be at least 8 characters long.');
    return false;
  }

  setFieldError(passwordInput, '');
  return true;
}

function handleRememberMe() {
  if (!rememberMe) return;
  const rememberedEmail = rememberMe.checked ? emailInput.value.trim() : '';
  if (rememberedEmail) {
    localStorage.setItem('homeNestRememberedEmail', rememberedEmail);
    return;
  }

  localStorage.removeItem('homeNestRememberedEmail');
}

function initializeRememberedUser() {
  const remembered = localStorage.getItem('homeNestRememberedEmail');
  if (!remembered || !emailInput) return;

  emailInput.value = remembered;
  if (rememberMe) {
    rememberMe.checked = true;
  }
}

function togglePasswordVisibility(event) {
  const button = event.currentTarget;
  const inputId = button.dataset.togglePassword;
  const input = document.getElementById(inputId);
  if (!input) return;

  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  button.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  button.innerHTML = isHidden
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6.5a11.8 11.8 0 0 1 10.2 5.5A11.8 11.8 0 0 1 12 17.5 11.8 11.8 0 0 1 1.8 12 11.8 11.8 0 0 1 12 6.5Zm0 2.2A4.3 4.3 0 1 0 12 17.2a4.3 4.3 0 0 0 0-8.5Zm0 2.1A2.2 2.2 0 1 1 12 16.9a2.2 2.2 0 0 1 0-4.1Z"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c5.4 0 9.9 3.9 11.3 7-1.4 3.1-5.9 7-11.3 7S2.1 15.1.7 12C2.1 8.9 6.6 5 12 5Zm0 2.1A4.9 4.9 0 1 0 12 16.9 4.9 4.9 0 0 0 12 7.1Zm0 2.1A2.8 2.8 0 1 1 12 14.7a2.8 2.8 0 0 1 0-5.5Z"/></svg>';
}

function handleForgotPassword() {
  showStatus(
    'Password recovery is not configured yet. Connect your backend reset endpoint or add a dedicated password reset page to continue.',
    'error'
  );
}

function handleSocialLogin(event) {
  const provider = event.currentTarget.dataset.provider;
  showStatus(
    `${provider} login is not configured yet. Connect your social authentication provider to enable this sign-in option.`,
    'error'
  );
}

function setDemoSession(isLoggedIn) {
  localStorage.setItem('homeNestIsLoggedIn', String(isLoggedIn));
}

async function submitLogin(event) {
  event.preventDefault();
  clearStatus();

  const isIdentifierValid = validateIdentifier();
  const isPasswordValid = validatePassword();

  if (!isIdentifierValid || !isPasswordValid) {
    showStatus('Please correct the highlighted fields before continuing.', 'error');
    return;
  }

  const payload = {
    identifier: emailInput.value.trim(),
    password: passwordInput.value,
    rememberMe: rememberMe ? rememberMe.checked : false
  };

  handleRememberMe();

  const backendUrl = '/api/login';
  const backendAvailable = false;

  if (!backendAvailable) {
    setDemoSession(true);
    showStatus(
      `Demo mode: this front-end is ready for backend auth. Connect your real API at ${backendUrl} to authenticate users and replace this message.`,
      'success'
    );
    window.setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 800);
    return;
  }

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.message || 'Authentication failed.');
    }

    showStatus('Login request sent successfully. Connect your backend to complete real authentication.', 'success');
  } catch (error) {
    showStatus(error.message || 'Unable to authenticate at the moment. Please try again later.', 'error');
  }
}

function initMobileNav() {
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    navToggle.classList.toggle('is-open');
  });
}

function setupPasswordToggle() {
  document.querySelectorAll('[data-toggle-password]').forEach((button) => {
    button.addEventListener('click', togglePasswordVisibility);
  });
}

function setupEvents() {
  if (window.location.pathname.endsWith('login.html') && localStorage.getItem('homeNestIsLoggedIn') === 'true') {
    window.location.href = 'dashboard.html';
    return;
  }

  emailInput?.addEventListener('input', validateIdentifier);
  emailInput?.addEventListener('blur', validateIdentifier);
  passwordInput?.addEventListener('input', validatePassword);
  passwordInput?.addEventListener('blur', validatePassword);
  forgotPasswordLink?.addEventListener('click', handleForgotPassword);
  document.querySelectorAll('.social-btn').forEach((button) => {
    button.addEventListener('click', handleSocialLogin);
  });
  loginForm?.addEventListener('submit', submitLogin);

  if (rememberMe) {
    rememberMe.addEventListener('change', () => {
      if (!rememberMe.checked) {
        localStorage.removeItem('homeNestRememberedEmail');
      }
    });
  }

  initMobileNav();
  setupPasswordToggle();
  initializeRememberedUser();
}

setupEvents();

setupEvents();
