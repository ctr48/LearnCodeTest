// Initialize Firebase (make sure this matches the configuration in index.html)
const firebaseConfig = {
    apiKey: "AIzaSyCRG4zTvQatqvgz46nTXXao0-qSWr5u3gA",
    authDomain: "learncobol-452ff.firebaseapp.com",
    projectId: "learncobol-452ff",
    storageBucket: "learncobol-452ff.appspot.com",
    messagingSenderId: "785464884209",
    appId: "1:785464884209:web:d4ed745c0d8571ac322250",
    measurementId: "G-7QVF8EY1NT"
};

// Initialize Firebase if it hasn't been initialized yet
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Function to check if user is logged in
function checkAuth() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            // User is not logged in, redirect to the login page
            window.location.href = 'index.html#auth-section';
        }
    });
}

// Call checkAuth when the page loads
window.addEventListener('load', checkAuth);

// Handle show password functionality 
function setupShowPasswordListeners() {
    const showLoginPassword = document.getElementById('showLoginPassword');
    const loginPassword = document.getElementById('loginPassword');
    
    showLoginPassword.addEventListener('change', function() {
        loginPassword.type = this.checked ? 'text' : 'password';
    });

    const showSignupPassword = document.getElementById('showSignupPassword');  
    const signupPassword = document.getElementById('signupPassword');
    const signupConfirmPassword = document.getElementById('signupConfirmPassword');

    showSignupPassword.addEventListener('change', function() {
        signupPassword.type = this.checked ? 'text' : 'password';
        signupConfirmPassword.type = this.checked ? 'text' : 'password';
    });
}

// Call setupShowPasswordListeners when the page loads
window.addEventListener('load', setupShowPasswordListeners);