document.getElementById('registration-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const nameEl   = document.getElementById('full-name');
  const emailEl  = document.getElementById('email');
  const mobileEl = document.getElementById('mobile');
  const btn = this.querySelector('.btn-submit');
  const defaultBtnHtml = btn.innerHTML;
  let valid = true;

  if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
    nameEl.classList.add('error');
    document.getElementById('name-error').style.display = 'block';
    valid = false;
  } else {
    nameEl.classList.remove('error');
    document.getElementById('name-error').style.display = 'none';
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(emailEl.value.trim())) {
    emailEl.classList.add('error');
    document.getElementById('email-error').style.display = 'block';
    valid = false;
  } else {
    emailEl.classList.remove('error');
    document.getElementById('email-error').style.display = 'none';
  }

  const mobileRe = /^[6-9]\d{9}$/;
  if (!mobileRe.test(mobileEl.value.trim())) {
    mobileEl.classList.add('error');
    document.getElementById('mobile-error').style.display = 'block';
    valid = false;
  } else {
    mobileEl.classList.remove('error');
    document.getElementById('mobile-error').style.display = 'none';
  }

  if (!valid) return;

  if (!GOOGLE_SHEETS_URL || GOOGLE_SHEETS_URL.includes('PASTE_YOUR')) {
    alert('Configure GOOGLE_SHEETS_URL in js/config.js');
    return;
  }

  if (!RAZORPAY_PAYMENT_LINK || RAZORPAY_PAYMENT_LINK.includes('PASTE_YOUR')) {
    alert('Configure RAZORPAY_PAYMENT_LINK in js/config.js\n\nCreate a ₹299 link in Razorpay Dashboard → Payment Links');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span>Saving registration...</span>';

  const payload = {
    name: nameEl.value.trim(),
    email: emailEl.value.trim(),
    mobile: mobileEl.value.trim()
  };

  try {
    await registerInSheet(payload);
    saveRegistrationLocally(payload);

    btn.innerHTML = '<span>Redirecting to payment...</span>';
    setTimeout(() => redirectToPaymentLink(), 1000);
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = defaultBtnHtml;
    alert(err.message || 'Something went wrong. Please try again.');
  }
});
