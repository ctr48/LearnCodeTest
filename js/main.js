// Firebase configuration
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

// Check login state on page load
document.addEventListener('DOMContentLoaded', function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in, show the learning content
      document.getElementById('learning-content').style.display = 'block';
      document.getElementById('userInfo').style.display = 'block';
      document.getElementById('userName').textContent = user.displayName;
      
      // Add logout functionality
      document.getElementById('logoutBtn').addEventListener('click', function() {
        firebase.auth().signOut().then(function() {
          // Sign-out successful, redirect to index.html
          window.location.href = 'index.html';
        }).catch(function(error) {
          console.error('Error signing out:', error);
        });
      });
    } else {
      // User is not signed in, redirect to login page
      window.location.href = 'index.html';
    }
  });
});

// Smooth Scrolling for Topic Links
const topicLinks = document.querySelectorAll('#topic-nav a');

topicLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = event.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});