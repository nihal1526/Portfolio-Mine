# Connecting Your Portfolio Form to n8n Webhooks

As an **AI Automation Engineer**, you can demonstrate your n8n workflows in real time by using your own contact form to capture leads!

I have updated `js/app.js` to dispatch form submissions as JSON payloads using the browser's standard `fetch` API. Here is how you can connect and log these leads.

---

## 1. Update `js/app.js` with your n8n Webhook URL

Open [js/app.js](file:///c:/Users/nihal/OneDrive/Desktop/Portfolio/js/app.js) and paste your Webhook URL inside the `N8N_WEBHOOK_URL` constant on **Line 10**:

```javascript
// Paste your n8n webhook URL here to receive real leads!
const N8N_WEBHOOK_URL = "https://your-n8n-instance.com/webhook/your-custom-uuid";
```

*Note: If `N8N_WEBHOOK_URL` is left empty, the form will fall back to a local simulated transmission delay, which works perfectly for testing and showcases the UI success screen immediately.*

---

## 2. Set Up the n8n Workflow

Create a new workflow in your n8n instance with the following structure:

```
[ Webhook Node ] ──> [ Google Sheets Node (or Airtable) ] ──> [ Telegram Node (or Email/Discord) ]
```

### Node A: Webhook (Trigger)
1. Add a **Webhook** node to your workflow.
2. Set the HTTP Method to **`POST`**.
3. Set the Path to something unique (e.g., `portfolio-leads`).
4. Set Response Mode to **`On Received`** (this ensures the website gets a fast `200 OK` response and immediately shows the transmission success card).
5. Copy the **Test URL** or **Production URL** and paste it into `js/app.js`.
6. Click **Listen for Test Event** in n8n and submit the portfolio form to capture the incoming payload structure:
   ```json
   {
     "name": "John Doe",
     "email": "johndoe@example.com",
     "message": "Hello, I want to automate my spreadsheet logs!",
     "timestamp": "2026-06-08T11:49:00.000Z"
   }
   ```

### Node B: Google Sheets (Save Data)
1. Add a **Google Sheets** node.
2. Select **Append Row** as the action.
3. Link your Google Sheets account and select your spreadsheets sheet.
4. Map the inputs:
   - `Name` ──> `{{ $json.name }}`
   - `Email` ──> `{{ $json.email }}`
   - `Message` ──> `{{ $json.message }}`
   - `Date` ──> `{{ $json.timestamp }}`

### Node C: Telegram or Email (Instant Alerts)
1. Add a **Telegram** (or WhatsApp/Email/Discord) node to get notified instantly whenever someone submits a message on your site.
2. Set the Action to **`Send Text Message`**.
3. Format the text notification:
   ```text
   🚀 **New Portfolio Lead Recieved!**
   👤 Name: {{ $json.name }}
   ✉️ Email: {{ $json.email }}
   💬 Message: {{ $json.message }}
   ```
4. Activate the n8n workflow.
