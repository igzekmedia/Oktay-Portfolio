# Google Sheet Lead Log (retargeting)

Every booking submission (funnel at `/book` and the on-site form) posts to
`app/api/contact/route.ts`. Besides the email, the route sends each lead to a Google
Sheet so you have a durable list for retargeting (name, email, phone, plus the tattoo
details). The write is non-blocking, so it can never break a booking.

The simplest way in (no Google Cloud project, no service account) is a Google Apps
Script web app bound to the sheet. The route just POSTs JSON to its URL.

## One-time setup

### 1. Create the sheet
1. New Google Sheet, name it something like "Oktay Leads".

### 2. Add the Apps Script
1. In the sheet: Extensions, Apps Script.
2. Delete the placeholder and paste this:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Leads") || ss.getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp","Name","Email","Phone","Purpose","Style",
        "Placement","Size","Idea","Date","Time","Reference count","Source"
      ]);
    }
    var d = JSON.parse(e.postData.contents);
    sheet.appendRow([
      d.timestamp, d.name, d.email, d.phone, d.purpose, d.style,
      d.placement, d.size, d.description, d.appointment_date,
      d.appointment_time, d.reference_count, d.source
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3. Save.

### 3. Deploy as a web app
1. Deploy, New deployment.
2. Type: Web app.
3. Execute as: Me. Who has access: Anyone.
4. Deploy, then authorize the permissions prompt.
5. Copy the Web app URL (ends in `/exec`).

### 4. Add the URL to the site
1. Vercel, oktay-portfolio project, Settings, Environment Variables.
2. Add `SHEETS_WEBHOOK_URL` = the `/exec` URL (Production, Preview, Development).
3. Also add it to local `.env.local` if testing locally.
4. Redeploy.

### 5. Test
Submit a booking. A new row should appear in the sheet within a second or two.

## Notes

- The header row is written automatically on the first submission.
- Reference images are not stored in the sheet (they ride on the email as attachments);
  the sheet logs how many were attached in the "Reference count" column.
- For retargeting, the Name, Email, and Phone columns are what you upload to a Meta
  custom audience.
- Optional hardening: the web app URL is unguessable, but if you want to block random
  posts, add a shared secret. Tell me and I will add a token check to both the script
  and the route.

## Env var reference

| Var | Required | Purpose |
| --- | -------- | ------- |
| `SHEETS_WEBHOOK_URL` | No (feature off if unset) | Apps Script web app URL that appends each lead as a row |
