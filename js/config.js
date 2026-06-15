// Google Apps Script Web App URL (must end with /exec)
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyJSisZRDn7MvQkHnHjCEd-j5rbvCYR5rjj9itf_P3IB5BVwOZMSKl0lWmRVczaSYkI/exec';

// Razorpay Payment Link — create in Dashboard → Payment Links → Amount ₹299
const RAZORPAY_PAYMENT_LINK = 'https://rzp.io/rzp/bQc4MF5';

// Site paths — update SITE_BASE_URL to your live domain
const SITE_BASE_URL = 'https://ekta-mam-webinar.vercel.app';
const WEBINAR_SLUG = '/voice-mastery-webinar';

// Set THANK_YOU_PAGE in Razorpay Payment Link → Redirect after payment
const THANK_YOU_PAGE = `${SITE_BASE_URL}${WEBINAR_SLUG}/thank-you.html`;
const CANCEL_PAGE = `${SITE_BASE_URL}${WEBINAR_SLUG}/cancel.html`;

const REGISTRATION_STORAGE_KEY = 'webinar_registration';
