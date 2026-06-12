document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('cancel-status-note');
  const params = new URLSearchParams(window.location.search);
  const pageStatus = params.get('status');
  const registration = getStoredRegistration();
  const sheetStatus = pageStatus === 'failed' ? 'Failed' : 'Cancelled';

  if (registration) {
    try {
      await updatePaymentStatusInSheet(registration, sheetStatus);
    } catch (err) {
      /* ignore */
    }
  }

  if (statusEl) {
    statusEl.textContent =
      sheetStatus === 'Failed'
        ? 'Payment Status in our records: Failed'
        : 'Payment Status in our records: Cancelled (you can pay again anytime)';
  }
});
