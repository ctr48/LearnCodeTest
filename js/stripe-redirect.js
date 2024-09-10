// Function to handle redirection after Stripe payment
function handleStripeRedirect() {
  // This function should be called after the Stripe payment is completed successfully
  window.location.href = 'index.html';
}

// If you're using Stripe Elements or Checkout, you can add this function to the success callback
// For example, with Stripe Checkout:
/*
stripe.redirectToCheckout({
  sessionId: 'YOUR_CHECKOUT_SESSION_ID'
}).then(function (result) {
  if (result.error) {
    // Handle any errors from Checkout
    console.error(result.error.message);
  } else {
    // Payment was successful, handle redirection
    handleStripeRedirect();
  }
});
*/

// Export the function so it can be used in other files if needed
export { handleStripeRedirect };