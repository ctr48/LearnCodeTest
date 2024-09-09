(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    // Initiate the wowjs
    new WOW().init();

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Firebase configuration
    // Replace with your own Firebase config
    const firebaseConfig = {
        apiKey: "AIzaSyCRG4zTvQatqvgz46nTXXao0-qSWr5u3gA",
        authDomain: "learncobol-452ff.firebaseapp.com",
        projectId: "learncobol-452ff",
        storageBucket: "learncobol-452ff.appspot.com",
        messagingSenderId: "785464884209",
        appId: "1:785464884209:web:d4ed745c0d8571ac322250",
        measurementId: "G-7QVF8EY1NT"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Get references to Firebase services
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Helper function to show/hide loading spinner
    function toggleLoading(form, show) {
        const button = form.find('button[type="submit"]');
        const spinner = button.find('.spinner-border');
        if (show) {
            button.prop('disabled', true);
            spinner.removeClass('d-none');
        } else {
            button.prop('disabled', false);
            spinner.addClass('d-none');
        }
    }

    // Helper function to display error messages
    function displayError(elementId, message) {
        const errorElement = $(`#${elementId}`);
        errorElement.text(message).removeClass('d-none');
        setTimeout(() => {
            errorElement.addClass('d-none');
        }, 5000);
    }

    // Login form submission
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        toggleLoading($(this), true);
        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("User logged in:", user.email);
                loadUserData(user.uid);
            })
            .catch((error) => {
                console.error("Login error:", error.message);
                let errorMessage = "Login failed. Please check your email and password and try again.";
                if (error.code === 'auth/user-not-found') {
                    errorMessage = "No account found with this email. Please sign up if you don't have an account.";
                } else if (error.code === 'auth/wrong-password') {
                    errorMessage = "Incorrect password. Please try again.";
                }
                displayError('loginError', errorMessage);
            })
            .finally(() => {
                toggleLoading($(this), false);
            });
    });

    // Signup form submission
    $('#signupForm').submit(function(e) {
        e.preventDefault();
        toggleLoading($(this), true);
        const name = $('#signupName').val();
        const email = $('#signupEmail').val();
        const password = $('#signupPassword').val();

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                console.log("User signed up:", user.email);
                createNewUser(user.uid, name);
            })
            .catch((error) => {
                console.error("Signup error:", error.message);
                let errorMessage = "Signup failed. Please try again.";
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = "An account with this email already exists. Please log in or use a different email.";
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = "Password is too weak. Please use a stronger password.";
                } else if (error.message.includes("CONFIGURATION_NOT_FOUND")) {
                    errorMessage = "We're experiencing technical difficulties. Please try again later or contact support.";
                }
                displayError('signupError', errorMessage);
            })
            .finally(() => {
                toggleLoading($(this), false);
            });
    });

    // Logout button click
    $('#logoutBtn').click(function() {
        auth.signOut().then(() => {
            console.log("User signed out");
            showAuthForms();
        }).catch((error) => {
            console.error("Logout error:", error.message);
        });
    });

    // Load user data
    function loadUserData(userId) {
        db.collection("users").doc(userId).get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                $('#userName').text(userData.name);
                $('#userProgress').text(userData.progress);
                showUserInfo();
            } else {
                console.log("No user data found");
                createNewUser(userId, "New User");
            }
        }).catch((error) => {
            console.error("Error getting user data:", error);
        });
    }

    // Create new user data
    function createNewUser(userId, name) {
        const newUser = {
            name: name,
            progress: 0
        };

        db.collection("users").doc(userId).set(newUser)
            .then(() => {
                console.log("New user created");
                loadUserData(userId);
            })
            .catch((error) => {
                console.error("Error creating new user:", error);
                displayError('signupError', "Failed to create user profile. Please try again.");
            });
    }

    // Show user info and hide auth forms
    function showUserInfo() {
        $('#auth-section').hide();
        $('#userInfo').show();
    }

    // Show auth forms and hide user info
    function showAuthForms() {
        $('#auth-section').show();
        $('#userInfo').hide();
    }

    // Check auth state on page load
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadUserData(user.uid);
        } else {
            showAuthForms();
        }
    });

})(jQuery);