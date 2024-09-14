// Import Firebase modules
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Function to fetch Firebase configuration
async function getFirebaseConfig() {
    try {
        const response = await fetch('/api/firebase-config');
        if (!response.ok) {
            throw new Error('Failed to fetch Firebase configuration');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching Firebase configuration:', error);
        throw error;
    }
}

// Initialize Firebase
async function initializeFirebase() {
    try {
        const firebaseConfig = await getFirebaseConfig();
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        return firebase.firestore();
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        throw error;
    }
}

// Function to handle redirection after Stripe payment
async function handleStripeRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const userId = urlParams.get('client_reference_id');

    if (success === 'true' && userId) {
        try {
            const db = await initializeFirebase();
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