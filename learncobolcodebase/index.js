/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

admin.initializeApp();

// Stripe Webhook Handler
exports.stripeWebhook = onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  logger.info("Stripe Webhook request received.");

  try {
    // Verifying the Stripe Webhook signature
    event = stripe.webhooks.constructEvent(
        req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET,
    );
    logger.info("Webhook signature verified.");
  } catch (err) {
    logger.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different Stripe events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    logger.info("Checkout session completed:", session);

    // Retrieve the Firestore document using client_reference_id (user's UID)
    const userRef = admin.firestore()
        .collection("users")
        .doc(session.client_reference_id);

    try {
      // Update the user's subscription status in Firestore
      await userRef.update({
        subscriptionStatus: "Active",
        stripeCustomerId: session.customer,
      });

      logger.info(
          `Updated subscription status for user ${session.client_reference_id}`,
      );
    } catch (error) {
      logger.error("Error updating user document:", error);
      return res.status(500).send("Error updating user document");
    }
  } else {
    logger.info(`Unhandled event type ${event.type}`);
  }

  // Respond to Stripe to acknowledge the receipt of the event
  res.json({received: true});
});
