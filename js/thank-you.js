document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('payment-status-note');
  const fallbackEl = document.getElementById('confirm-payment-fallback');
  const registration = getStoredRegistration();
  const paymentId = getPaymentIdFromUrl();

  if (!registration) {
    if (statusEl) {
      statusEl.textContent = 'Payment received! Confirm your email below so we can update your registration.';
    }
    if (fallbackEl) fallbackEl.style.display = 'block';
    return;
  }

  try {
    const result = await updatePaymentStatusInSheet(registration, 'Success', paymentId);

    if (result.success) {
      clearStoredRegistration();
      if (statusEl) {
        statusEl.textContent = 'Payment Status in our records: Success';
      }
    } else {
      throw new Error(result.error || 'Could not update payment status');
    }
  } catch (err) {
    if (statusEl) {
      statusEl.textContent = 'Payment received. Confirm your email below to update your registration status.';
    }
    if (fallbackEl) fallbackEl.style.display = 'block';
  }
});

document.getElementById('confirm-payment-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('confirm-email').value.trim();
  const mobile = document.getElementById('confirm-mobile').value.trim();
  const statusEl = document.getElementById('payment-status-note');
  const btn = this.querySelector('button');

  btn.disabled = true;
  btn.textContent = 'Updating...';

  try {
    const result = await updatePaymentStatusInSheet(
      { email, mobile },
      'Success',
      getPaymentIdFromUrl()
    );

    if (!result.success) {
      throw new Error(result.error || 'Could not find your registration');
    }

    clearStoredRegistration();
    if (statusEl) statusEl.textContent = 'Payment Status in our records: Success';
    this.style.display = 'none';
  } catch (err) {
    alert(err.message || 'Could not update status. Check email and mobile match your registration.');
    btn.disabled = false;
    btn.textContent = 'Confirm Payment Status';
  }
});
