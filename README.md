<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1BPWledOcan3YBHuJmWpG4spaElcP8QGv

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Configuration

The application uses a unified configuration system. `constants.ts` provides factory defaults, while runtime changes (via Admin Panel) are stored in Google Cloud Storage and merged automatically.

## Deploy

Just git push main → everything deploys automatically via GitHub Actions.


## Security Hardening (GCP Best Practices)

Based on recent security recommendations from Google Cloud, the following steps should be completed in your Cloud Console to ensure the environment remains secure:

### 1. Secret Management (Zero-Code Storage)
Instead of environment variables in `app.yaml`, move your `GEMINI_API_KEY` to **Secret Manager**:
1. Go to [Secret Manager](https://console.cloud.google.com/security/secret-manager).
2. Create a secret named `GEMINI_API_KEY`.
3. Link this secret to your App Engine/Cloud Run service in the "Variables & Secrets" section of the configuration.

### 2. API Key Restrictions
Never leave an API key unrestricted:
1. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials).
2. Edit your Gemini API key.
3. Under **API restrictions**, select "Restrict key" and choose **Generative Language API**.
4. (Optional) Under **Application restrictions**, add your production domain to prevent unauthorized use from other websites.

### 3. Least Privilege (IAM)
The service account running your app should only have the permissions it needs:
1. Go to [IAM & Admin](https://console.cloud.google.com/iam-admin/iam).
2. Ensure your App Engine service account (usually `[PROJECT-ID]@appspot.gserviceaccount.com`) has the **Storage Object Admin** role for your config/media buckets, but **NOT** the "Editor" or "Owner" role.

### 4. Operational Safeguards
1. **Billing Alerts:** Set a budget alert at $10 or $20 in [Billing > Budgets](https://console.cloud.google.com/billing/budgets). A sudden spike usually indicates a compromised key.
2. **Essential Contacts:** Add your email to [Essential Contacts](https://console.cloud.google.com/iam-admin/essential-contacts) under 'Security' to get notified immediately of incidents.
