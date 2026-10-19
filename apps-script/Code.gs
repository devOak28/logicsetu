/**
 * LogicSetu enquiry form -> Google Sheet
 * Paste this whole file into Extensions > Apps Script of your Google Sheet.
 */
const SHEET_NAME = "Enquiries";
const NOTIFY_EMAIL = ""; // optional: put your email to get an alert for every enquiry

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const p = e.parameter || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Timestamp", "Name", "Work Email", "Company", "Interested In", "Requirement"]);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date(), p.name || "", p.email || "", p.company || "", p.interest || "", p.message || ""]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        "New LogicSetu enquiry - " + (p.interest || ""),
        "Name: " + p.name + "\nEmail: " + p.email + "\nCompany: " + (p.company || "-") +
        "\nInterested in: " + p.interest + "\n\nRequirement:\n" + (p.message || "-")
      );
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("LogicSetu form endpoint is running.");
}
