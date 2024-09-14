const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);

admin.initializeApp();

exports.stripeWebhook = functions.https.onRequest({
  rawBody: true  // Ensures raw body is passed for Stripe signature verification
}, async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody, 
      sig, 
      functions.config().stripe.webhook_secret
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userRef = admin.firestore().collection('users').doc(session.client_reference_id);

    try {
      await userRef.update({
        subscriptionStatus: 'Active',
        stripeCustomerId: session.customer
      });
      console.log(`Updated subscription status for user ${session.client_reference_id}`);
    } catch (error) {
      console.error('Error updating user document:', error);
      return res.status(500).send('Error updating user document');
    }
  }

  res.json({ received: true });
});
