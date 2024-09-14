// Import Firebase modules
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';



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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// Function to handle redirection after Stripe payment
async function handleStripeRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const userId = urlParams.get('client_reference_id');

    if (success === 'true' && userId) {
        try {
            // Update user's subscription status in Firestore
            await db.collection('users').doc(userId).update({
                subscriptionStatus: 'Active'
            });

            // Redirect to index.html with a success message
            window.location.href = 'index.html?payment=success';
        } catch (error) {
            console.error('Error updating subscription status:', error);
            // Redirect to index.html with an error message
            window.location.href = 'index.html?payment=error';
        }
    } else if (success === 'false') {
        // Redirect to index.html with a failure message
        window.location.href = 'index.html?payment=failure';
    } else {
        // Redirect to index.html without any message
        window.location.href = 'index.html';
    }
}

// Call the function when the page loads
window.onload = handleStripeRedirect;

// Export the function so it can be used in other files if needed
export { handleStripeRedirect };