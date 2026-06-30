# Railway Deployment Guide (Updated for 2026)

Hosting this Node.js API and Prisma/PostgreSQL database on [Railway.app](https://railway.app/) is one of the easiest and most modern deployment paths available today.

This guide is designed for beginners. 

> **Pro Tip:** In 2026, AI is heavily integrated into modern dev workflows. If you ever hit an error log during deployment that you don't understand, copy and paste the entire log into an AI assistant (like Gemini) and ask: *"Explain this deployment error simply and tell me exactly how to fix it."* AI is fantastic at translating obscure server errors into actionable steps!

---

## Step 1: Push Your Code to GitHub
Railway pulls your code directly from GitHub.
1. Make sure your project is committed to a GitHub repository.
2. Ensure your `package.json` has a valid start script. 
   *(You should add `"start": "node src/app.js"` if you haven't already).*

## Step 2: Set Up Railway
1. Go to [Railway.app](https://railway.app/) and log in with your GitHub account.
2. Click **"New Project"**.
3. Choose **"Deploy from GitHub repo"** and select your Appointment Booking System repository.
4. Click **"Deploy Now"**. 

*At this point, the deploy will likely fail because it doesn't have a database or environment variables yet. That is normal!*

## Step 3: Add a PostgreSQL Database
1. On your Railway Project Dashboard, click the **"New"** button in the top right.
2. Select **"Database"**, then choose **"PostgreSQL"**.
3. Railway will instantly spin up a live, production-ready PostgreSQL database for you.

## Step 4: Get Your Prisma Database String
Now that your database is running, you need to connect your Express app to it.
1. Click on your newly created **PostgreSQL** block in the Railway dashboard.
2. Go to the **"Connect"** tab.
3. Look for the **"Prisma Connection URL"** (it will look something like `postgresql://postgres:randomchars@containers-us-west.railway.app:5432/railway`).
4. Copy this exact string.

## Step 5: Configure Environment Variables
Your app needs the `.env` variables securely provided to the live server.
1. Go back to the dashboard and click on your **Express/Node.js App** block.
2. Click on the **"Variables"** tab.
3. Click **"Raw Editor"** or add them one by one. You need to add everything from your `.env.example` file:
   - `DATABASE_URL` -> *(Paste the Prisma connection URL you copied in Step 4)*
   - `ACCESS_TOKEN_SECRET` -> *(Paste a random secure string)*
   - `REFRESH_TOKEN_SECRET` -> *(Paste a random secure string)*
   - `SMTP_...` -> *(Your email credentials)*

## Step 6: Configure the Build & Start Commands
Since we are using Prisma, the server needs to generate the Prisma client and push the schema to the database every time it deploys.
1. Inside your App block settings on Railway, go to the **"Settings"** tab.
2. Scroll down to the **"Build"** section.
3. Under **"Build Command"**, enter:
   ```bash
   npm install && npx prisma generate
   ```
4. Scroll to the **"Deploy"** section.
5. Under **"Start Command"**, enter:
   ```bash
   npx prisma db push --accept-data-loss && npm start
   ```
   *(Note: For strict production environments later on, you'll use `npx prisma migrate deploy`, but `db push` is perfect and easiest for launching your first versions).*

## Step 7: Redeploy
1. Click the **"Deployments"** tab in your App block.
2. If it hasn't started automatically, click **"Trigger Deploy"** (or simply commit a small change to GitHub to trigger it).
3. Wait for the build to finish. Once it goes green, Railway will provide you with a public URL (e.g., `https://appointment-app-production.up.railway.app`).

## Troubleshooting
If it fails:
1. Click on the failed deployment to view the **Deploy Logs**.
2. Read the error at the very bottom.
3. **Use AI!** Ask Gemini to diagnose the issue based on the logs. Common issues include missing environment variables or a typo in the start command.
