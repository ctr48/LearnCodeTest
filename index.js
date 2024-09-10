// Function to check if the user is logged in
function isUserLoggedIn() {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('userToken');
    
    // Return true if the token exists, false otherwise
    return !!token;
}

// Example usage
if (isUserLoggedIn()) {
    console.log('User is logged in');
    // Perform actions for logged-in users
} else {
    console.log('User is not logged in');
    // Perform actions for guests or redirect to login page
}

// You can export the function if you want to use it in other files
export { isUserLoggedIn };