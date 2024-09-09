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

    // Login form submission
    $('#loginForm').submit(function(e) {
        e.preventDefault();
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
                alert("Login failed: " + error.message);
            });
    });

    // Signup form submission
    $('#signupForm').submit(function(e) {
        e.preventDefault();
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
                alert("Signup failed: " + error.message);
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