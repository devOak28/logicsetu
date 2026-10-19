# LogicSetu website

```
logicsetu/
├── index.html
├── css/style.css
├── js/config.js      <- paste your Google Script URL here
├── js/main.js
└── apps-script/Code.gs   (not uploaded to hosting; paste into Google Sheet)
```

## Save form entries to Google Sheet (free, ~3 minutes)

1. Create a new Google Sheet (name it e.g. "LogicSetu Enquiries").
2. Open Extensions > Apps Script, delete the default code, paste all of `apps-script/Code.gs`, and save.
   (Optional: set NOTIFY_EMAIL in that file to get an email for each enquiry.)
3. Click Deploy > New deployment > type "Web app".
   - Execute as: **Me**
   - Who has access: **Anyone**
   Click Deploy, authorise when asked, and copy the **Web app URL** (ends with `/exec`).
4. Open `js/config.js` and paste that URL into `FORM_ENDPOINT`.
5. Upload the site to your host (everything except the `apps-script` folder).

Every submission becomes a new row in the "Enquiries" tab.
If you later edit Code.gs, use Deploy > Manage deployments > Edit > New version.
