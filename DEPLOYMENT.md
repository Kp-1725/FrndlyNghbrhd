# Deployment Guide for Friendly Neighbourhood

This guide will walk you through deploying the Friendly Neighbourhood application to Render.com.

## Prerequisites

1. A GitHub account
2. A Render.com account

## Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Initialize your local git repository (if not already done):
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Add your GitHub repository as a remote:
   ```
   git remote add origin https://github.com/yourusername/friendly-neighbourhood.git
   ```
4. Push your code to GitHub:
   ```
   git push -u origin main
   ```

## Step 2: Deploy to Render.com

### Option 1: Using render.yaml (Blueprint)

1. Log in to your Render.com account
2. Go to the Dashboard
3. Click on "New" and select "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file and set up your service

### Option 2: Manual Setup

1. Log in to your Render.com account
2. Go to the Dashboard
3. Click on "New" and select "Web Service"
4. Connect your GitHub repository
5. Configure the service with the following settings:
   - **Name**: friendly-neighbourhood (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: production

6. Click "Create Web Service"

## Step 3: Check Your Deployment

1. Once the build completes, Render will provide you with a URL for your application
2. Visit the URL to ensure everything is working correctly

## Troubleshooting

- If you encounter any issues, check the Render logs for more information
- Ensure all required environment variables are properly set
- Verify that your application runs locally with `npm run build && npm start` before deploying

## Future Enhancements for Production

For a production-ready application, consider implementing:

1. A persistent database (PostgreSQL) instead of in-memory storage
2. User authentication
3. Environment-specific configuration
4. HTTPS/SSL (provided automatically by Render)
5. Monitoring and logging