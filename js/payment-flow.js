function buildApiUrl(params) {
  return `${GOOGLE_SHEETS_URL}?${new URLSearchParams(params).toString()}`;
}

async function callSheetApi(params) {
  const response = await fetch(buildApiUrl(params));
  return response.json();
}

function saveRegistrationLocally(payload) {
  const data = JSON.stringify(payload);
  localStorage.setItem(REGISTRATION_STORAGE_KEY, data);
  sessionStorage.setItem(REGISTRATION_STORAGE_KEY, data);
  document.cookie = `${REGISTRATION_STORAGE_KEY}=${encodeURIComponent(data)}; path=/; max-age=7200; SameSite=Lax`;
}

function getStoredRegistration() {
  let data = null;

  try {
    data = localStorage.getItem(REGISTRATION_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (err) { /* continue */ }

  try {
    data = sessionStorage.getItem(REGISTRATION_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (err) { /* continue */ }

  const match = document.cookie.match(new RegExp(`${REGISTRATION_STORAGE_KEY}=([^;]+)`));
  if (match) {
    try {
      return JSON.parse(decodeURIComponent(match[1]));
    } catch (err) { /* continue */ }
  }

  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');
  const mobile = params.get('phone') || params.get('mobile');
  if (email && mobile) {
    return { email, mobile, name: params.get('name') || '' };
  }

  return null;
}

function clearStoredRegistration() {
  localStorage.removeItem(REGISTRATION_STORAGE_KEY);
  sessionStorage.removeItem(REGISTRATION_STORAGE_KEY);
  document.cookie = `${REGISTRATION_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

async function registerInSheet(payload) {
  const result = await callSheetApi({
    action: 'register',
    name: payload.name,
    email: payload.email,
    mobile: payload.mobile
  });

  if (!result.success) {
    throw new Error(result.error || 'Could not save registration');
  }
}

async function updatePaymentStatusInSheet(registration, status, paymentId) {
  if (!registration || !registration.email) {
    return { success: false, error: 'Registration data not found' };
  }

  const params = {
    action: 'updateStatus',
    email: registration.email,
    status: status
  };

  if (registration.mobile) params.mobile = registration.mobile;
  if (paymentId) params.paymentId = paymentId;

  return callSheetApi(params);
}

function getPaymentIdFromUrl() {
  return new URLSearchParams(window.location.search).get('razorpay_payment_id') || '';
}

function redirectToPaymentLink() {
  window.location.href = RAZORPAY_PAYMENT_LINK;
}

function redirectToCancel(reason) {
  const url = new URL(CANCEL_PAGE);
  url.searchParams.set('status', reason === 'failed' ? 'failed' : 'cancelled');
  window.location.href = url.toString();
}
