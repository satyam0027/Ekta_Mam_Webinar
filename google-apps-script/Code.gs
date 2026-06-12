/**
 * Google Sheets handler for Voice & Anchoring Webinar
 *
 * Sheet row 1: Timestamp | Full Name | Email | Mobile | Payment Status | Payment ID
 * Status values: Pending | Success | Cancelled | Failed
 *
 * SETUP:
 * 1. Paste this file in Apps Script → Save
 * 2. Deploy → Web app → Execute as: Me → Who has access: Anyone → New version
 * 3. Copy /exec URL into js/config.js
 */

function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = (params.action || 'ping').toString().trim();

    if (action === 'register') return registerUser(params);
    if (action === 'updateStatus') return updatePaymentStatus(params);

    return jsonResponse({ success: true, message: 'Webinar API is live.' });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message });
  }
}

function doPost(e) {
  return doGet(e);
}

function registerUser(params) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var name = (params.name || '').toString().trim();
  var email = (params.email || '').toString().trim();
  var mobile = (params.mobile || '').toString().trim();

  if (!name || !email || !mobile) {
    return jsonResponse({ success: false, error: 'Missing required fields' });
  }

  sheet.appendRow([new Date(), name, email, mobile, 'Pending', '']);
  return jsonResponse({ success: true, status: 'Pending' });
}

function updatePaymentStatus(params) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var email = (params.email || '').toString().trim().toLowerCase();
  var mobile = normalizeMobile(params.mobile);
  var paymentId = (params.paymentId || '').toString().trim();
  var status = normalizeStatus(params.status || '');

  if (!email || !status) {
    return jsonResponse({ success: false, error: 'Missing email or status' });
  }

  var data = sheet.getDataRange().getValues();
  var matchIndex = findMatchingRow(data, email, mobile);

  if (matchIndex === -1 && status === 'Success') {
    matchIndex = findLatestPendingByEmail(data, email);
  }

  if (matchIndex === -1) {
    return jsonResponse({ success: false, error: 'Registration not found' });
  }

  var currentStatus = (data[matchIndex][4] || '').toString().trim();

  if (status !== 'Success' && currentStatus === 'Success') {
    return jsonResponse({ success: true, row: matchIndex + 1, status: 'Success' });
  }

  sheet.getRange(matchIndex + 1, 5).setValue(status);
  if (paymentId && status === 'Success') {
    sheet.getRange(matchIndex + 1, 6).setValue(paymentId);
  }

  return jsonResponse({ success: true, row: matchIndex + 1, status: status });
}

function normalizeMobile(value) {
  return (value || '').toString().replace(/\D/g, '').slice(-10);
}

function findMatchingRow(data, email, mobile) {
  for (var i = data.length - 1; i >= 1; i--) {
    var rowEmail = (data[i][2] || '').toString().trim().toLowerCase();
    var rowMobile = normalizeMobile(data[i][3]);

    if (rowEmail === email && (!mobile || rowMobile === mobile)) {
      return i;
    }
  }
  return -1;
}

function findLatestPendingByEmail(data, email) {
  for (var i = data.length - 1; i >= 1; i--) {
    var rowEmail = (data[i][2] || '').toString().trim().toLowerCase();
    var rowStatus = (data[i][4] || '').toString().trim();

    if (rowEmail === email && rowStatus === 'Pending') {
      return i;
    }
  }
  return -1;
}

function normalizeStatus(status) {
  var value = (status || '').toString().trim();
  if (value === 'Paid' || value === 'paid' || value === 'success') return 'Success';
  if (value === 'Cancelled' || value === 'cancelled' || value === 'cancel') return 'Cancelled';
  if (value === 'Failed' || value === 'failed' || value === 'fail') return 'Failed';
  if (value === 'Pending' || value === 'pending') return 'Pending';
  return value;
}

function testSheetWrite() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([new Date(), 'Test User', 'test@example.com', '9876543210', 'Pending', '']);
  Logger.log('Test row added.');
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
