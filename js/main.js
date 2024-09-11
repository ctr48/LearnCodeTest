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

// Function to mark an answer as correct
function markAsCorrectFunction(questionId) {
  const correctAnswers = JSON.parse(localStorage.getItem('correctAnswers')) || {};
  correctAnswers[questionId] = true;
  localStorage.setItem('correctAnswers', JSON.stringify(correctAnswers));
  
  // Update UI to reflect the correct answer
  const button = document.querySelector(`button[data-question-id="${questionId}"]`);
  if (button) {
    button.textContent = 'Marked as Correct';
    button.disabled = true;
  }
  
  // Update challenge text color
  const challengeText = document.getElementById('challengeText');
  if (challengeText) {
    challengeText.classList.remove('incorrect');
    challengeText.classList.add('correct');
  }
}

// Function to check if a question is marked as correct
function isQuestionCorrect(questionId) {
  const correctAnswers = JSON.parse(localStorage.getItem('correctAnswers')) || {};
  return correctAnswers[questionId] || false;
}

// Function to load correct answers from local storage
function loadCorrectAnswers() {
  const correctAnswers = JSON.parse(localStorage.getItem('correctAnswers')) || {};
  
  // Update UI for all correct answers
  Object.keys(correctAnswers).forEach(questionId => {
    const button = document.querySelector(`button[data-question-id="${questionId}"]`);
    if (button) {
      button.textContent = 'Marked as Correct';
      button.disabled = true;
    }
  });
}

// Function to update challenge UI based on local storage
function updateChallengeUI(challenge) {
  const markAsCorrectButton = document.getElementById('markAsCorrectButton');
  const challengeText = document.getElementById('challengeText');
  
  if (isQuestionCorrect(challenge.id)) {
    challenge.isCorrect = true;
    markAsCorrectButton.textContent = 'Marked as Correct';
    markAsCorrectButton.disabled = true;
    challengeText.classList.add('correct');
    challengeText.classList.remove('incorrect');
  } else {
    challenge.isCorrect = false;
    markAsCorrectButton.textContent = 'Mark as Correct';
    markAsCorrectButton.disabled = false;
    challengeText.classList.add('incorrect');
    challengeText.classList.remove('correct');
  }
}

// Check login state on page load
document.addEventListener('DOMContentLoaded', function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      const userInfo = document.getElementById('userInfo');
      const learningContent = document.getElementById('learning-content');
      
      if (userInfo) {
        userInfo.style.display = 'block';
        document.getElementById('userName').textContent = user.displayName;
      }
      
      if (learningContent) {
        learningContent.style.display = 'block';
      }
      
      // Load correct answers from local storage
      loadCorrectAnswers();
      
      // Add click event listeners to "Mark as Correct" buttons
      const markCorrectButtons = document.querySelectorAll('.mark-correct-btn');
      markCorrectButtons.forEach(button => {
        button.addEventListener('click', function() {
          const questionId = this.getAttribute('data-question-id');
          markAsCorrectFunction(questionId);
        });
      });
      
      // Add logout functionality
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
          firebase.auth().signOut().then(function() {
            // Sign-out successful, redirect to index.html
            window.location.href = 'index.html';
          }).catch(function(error) {
            console.error('Error signing out:', error);
          });
        });
      }
      
      // Add click event handler for Manage Account button
      const manageAccountBtn = document.getElementById('manageAccountBtn');
      if (manageAccountBtn) {
        manageAccountBtn.addEventListener('click', function() {
          alert('Please check your email for account information.');
        });
      }
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

// Export functions for use in course.html
window.markAsCorrectFunction = markAsCorrectFunction;
window.isQuestionCorrect = isQuestionCorrect;
window.updateChallengeUI = updateChallengeUI;