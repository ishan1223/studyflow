// document.addEventListener('DOMContentLoaded', () => {
//     // --- Configuration ---
//     const API_BASE_URL = 'http://localhost:8000';

//     // --- Element Selections ---
//     const loginForm = document.getElementById('login-form');
//     const signupForm = document.getElementById('signup-form');
//     const switchBtn = document.getElementById('switch-btn');
//     const authTitle = document.getElementById('auth-title');
//     const authSubtitle = document.getElementById('auth-subtitle');
//     const switchText = document.getElementById('switch-text');
//     const loadingSpinner = document.getElementById('loading-spinner');
//     const errorMessageContainer = document.getElementById('error-message');
//     const errorTextSpan = document.getElementById('error-text');
//     const successMessageContainer = document.getElementById('success-message');
//     const successTextSpan = document.getElementById('success-text');

//     let isLoginMode = true;

//     // --- Functions ---
//     window.togglePassword = (fieldId, toggleButton) => {
//         const passwordField = document.getElementById(fieldId);
//         const icon = toggleButton.querySelector('i');
//         if (passwordField.type === 'password') {
//             passwordField.type = 'text';
//             icon.classList.remove('fa-eye');
//             icon.classList.add('fa-eye-slash');
//         } else {
//             passwordField.type = 'password';
//             icon.classList.remove('fa-eye-slash');
//             icon.classList.add('fa-eye');
//         }
//     };

//     window.switchAuthMode = () => {
//         isLoginMode = !isLoginMode;
//         hideMessages();
//         if (isLoginMode) {
//             loginForm.classList.remove('hidden');
//             signupForm.classList.add('hidden');
//             authTitle.textContent = 'Welcome Back';
//             authSubtitle.textContent = 'Sign in to continue your learning journey';
//             switchText.textContent = "Don't have an account?";
//             switchBtn.textContent = 'Sign up';
//         } else {
//             loginForm.classList.add('hidden');
//             signupForm.classList.remove('hidden');
//             authTitle.textContent = 'Create Your Account';
//             authSubtitle.textContent = 'Start your personalized learning adventure today';
//             switchText.textContent = 'Already have an account?';
//             switchBtn.textContent = 'Sign in';
//         }
//     };

//     const showLoading = (isLoading) => loadingSpinner.classList.toggle('hidden', !isLoading);
//     const hideMessages = () => {
//         errorMessageContainer.classList.add('hidden');
//         successMessageContainer.classList.add('hidden');
//     };
//     const showError = (message) => {
//         hideMessages();
//         errorTextSpan.textContent = message;
//         errorMessageContainer.classList.remove('hidden');
//     };
//     const showSuccess = (message) => {
//         hideMessages();
//         successTextSpan.textContent = message;
//         successMessageContainer.classList.remove('hidden');
//     };

//     const handleSignup = async (e) => {
//         e.preventDefault();
//         hideMessages();
//         showLoading(true);
//         const formData = new FormData(signupForm);
//         const userData = Object.fromEntries(formData.entries());
//         try {
//             const response = await fetch(`${API_BASE_URL}/signup`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(userData),
//             });
//             const data = await response.json();
//             if (!response.ok) {
//                 throw new Error(data.detail || 'An unknown error occurred.');
//             }
//             showSuccess(`Account for ${data.username} created! Please log in.`);
//             setTimeout(switchAuthMode, 1500);
//         } catch (error) {
//             showError(error.message);
//         } finally {
//             showLoading(false);
//         }
//     };

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         hideMessages();
//         showLoading(true);
//         const formData = new FormData(loginForm);
//         const urlEncodedData = new URLSearchParams(formData);
//         try {
//             const response = await fetch(`${API_BASE_URL}/token`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//                 body: urlEncodedData,
//             });
//             const data = await response.json();
//             if (!response.ok) {
//                 throw new Error(data.detail || 'Incorrect username or password.');
//             }
            
//             // *** CHANGE HERE: Standardize the token key ***
//             localStorage.setItem('studyflowToken', data.access_token);
//             const username = new FormData(loginForm).get('username');
//             localStorage.setItem('username', username);

//             // Redirect to the main app dashboard
//             window.location.href = 'app.html';

//         } catch (error) {
//             showError(error.message);
//         } finally {
//             showLoading(false);
//         }
//     };

//     // --- Event Listeners ---
//     signupForm.addEventListener('submit', handleSignup);
//     loginForm.addEventListener('submit', handleLogin);
// });

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:8000';

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const switchBtn = document.getElementById('switch-btn');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const switchText = document.getElementById('switch-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessageContainer = document.getElementById('error-message');
    const errorTextSpan = document.getElementById('error-text');
    const successMessageContainer = document.getElementById('success-message');
    const successTextSpan = document.getElementById('success-text');

    let isLoginMode = true;

    // If already logged in, skip auth
    const existingToken = localStorage.getItem('studyflowToken');
    if (existingToken) {
        const onboarding = localStorage.getItem('sf_onboarding');
        window.location.href = onboarding ? 'home.html' : 'onboarding.html';
        return;
    }

    window.togglePassword = (fieldId, toggleButton) => {
        const passwordField = document.getElementById(fieldId);
        const icon = toggleButton.querySelector('i');
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordField.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    };

    window.switchAuthMode = () => {
        isLoginMode = !isLoginMode;
        hideMessages();
        if (isLoginMode) {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
            authTitle.textContent = 'Welcome Back';
            authSubtitle.textContent = 'Sign in to continue your learning journey';
            switchText.textContent = "Don't have an account?";
            switchBtn.textContent = 'Sign up';
        } else {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            authTitle.textContent = 'Create Your Account';
            authSubtitle.textContent = 'Start your personalised learning adventure today';
            switchText.textContent = 'Already have an account?';
            switchBtn.textContent = 'Sign in';
        }
    };

    // Check URL param to auto-switch to signup
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'signup') {
        switchAuthMode();
    }

    const showLoading = (isLoading) => loadingSpinner.classList.toggle('hidden', !isLoading);
    const hideMessages = () => {
        errorMessageContainer.classList.add('hidden');
        successMessageContainer.classList.add('hidden');
    };
    const showError = (message) => {
        hideMessages();
        errorTextSpan.textContent = message;
        errorMessageContainer.classList.remove('hidden');
    };
    const showSuccess = (message) => {
        hideMessages();
        successTextSpan.textContent = message;
        successMessageContainer.classList.remove('hidden');
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        hideMessages();
        showLoading(true);
        const formData = new FormData(signupForm);
        const userData = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'An unknown error occurred.');

            showSuccess(`Account created! Signing you in...`);

            // Auto login after signup
            setTimeout(async () => {
                const loginData = new URLSearchParams();
                loginData.append('username', userData.username);
                loginData.append('password', userData.password);

                const loginRes = await fetch(`${API_BASE_URL}/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: loginData,
                });
                const loginJson = await loginRes.json();
                if (loginRes.ok) {
                    localStorage.setItem('studyflowToken', loginJson.access_token);
                    localStorage.setItem('username', userData.username);
                    // New user — always go to onboarding
                    window.location.href = 'onboarding.html';
                } else {
                    // Auto login failed, ask them to sign in manually
                    switchAuthMode();
                }
            }, 1000);

        } catch (error) {
            showError(error.message);
        } finally {
            showLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        hideMessages();
        showLoading(true);
        const formData = new FormData(loginForm);
        const urlEncodedData = new URLSearchParams(formData);
        try {
            const response = await fetch(`${API_BASE_URL}/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlEncodedData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Incorrect username or password.');

            localStorage.setItem('studyflowToken', data.access_token);
            const username = new FormData(loginForm).get('username');
            localStorage.setItem('username', username);

            // If already onboarded go home, else go to onboarding
            const onboarding = localStorage.getItem('sf_onboarding');
            window.location.href = onboarding ? 'home.html' : 'onboarding.html';

        } catch (error) {
            showError(error.message);
        } finally {
            showLoading(false);
        }
    };

    signupForm.addEventListener('submit', handleSignup);
    loginForm.addEventListener('submit', handleLogin);
});
