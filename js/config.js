// Google Apps Script Web App URL (must end with /exec)
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyJSisZRDn7MvQkHnHjCEd-j5rbvCYR5rjj9itf_P3IB5BVwOZMSKl0lWmRVczaSYkI/exec';

// Razorpay Payment Link — create in Dashboard → Payment Links → Amount ₹299
const RAZORPAY_PAYMENT_LINK = 'https://rzp.io/rzp/bQc4MF5';

// Also set THANK_YOU_PAGE inside Razorpay Payment Link → Redirect after payment
const SITE_BASE_URL = 'http://127.0.0.1:5500';
const THANK_YOU_PAGE = `http://127.0.0.1:5500/thank-you.html`;
const CANCEL_PAGE = `http://127.0.0.1:5500/cancel.html`;

const REGISTRATION_STORAGE_KEY = 'webinar_registration';
