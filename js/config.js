// Google Apps Script Web App URL (must end with /exec)
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyJSisZRDn7MvQkHnHjCEd-j5rbvCYR5rjj9itf_P3IB5BVwOZMSKl0lWmRVczaSYkI/exec';

// Razorpay Payment Link — create in Dashboard → Payment Links → Amount ₹299
const RAZORPAY_PAYMENT_LINK = 'https://rzp.io/rzp/bQc4MF5';

// Site paths — must match your live domain (no trailing slash)
const SITE_BASE_URL = 'https://www.ektamishra.com';
const WEBINAR_SLUG = '/voice-mastery-webinar';

// After payment, Razorpay redirects using the URL set in Dashboard → Payment Links (not this file).
// Set that redirect URL to exactly:
const THANK_YOU_PAGE = `${SITE_BASE_URL}${WEBINAR_SLUG}/thank-you.html`;
const CANCEL_PAGE = `${SITE_BASE_URL}${WEBINAR_SLUG}/cancel.html`;

const REGISTRATION_STORAGE_KEY = 'webinar_registration';
