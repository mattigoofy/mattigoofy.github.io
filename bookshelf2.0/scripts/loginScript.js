const loginContainer = document.querySelector('.login-container');
const signupContainer = document.querySelector('.signup-container');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Switch to Sign Up form
showSignup.addEventListener('click', () => {
    loginContainer.classList.remove('active');
    signupContainer.classList.add('active');
});

// Switch to Log In form
showLogin.addEventListener('click', () => {
    signupContainer.classList.remove('active');
    loginContainer.classList.add('active');
});


// Handle Log In form submission
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    firebase.login(email, password);

    loginForm.reset();
});

// Handle Sign Up form submission
signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = signupForm.querySelector('input[type="email"]').value;
    const password = signupForm.querySelector('input[type="password"]').value;

    firebase.sigin(email, password);

    signupForm.reset();
});
