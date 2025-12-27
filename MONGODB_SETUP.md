# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended)

MongoDB Atlas is a free cloud database service. No installation required!

### Steps:

1. **Sign up for MongoDB Atlas:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Create a free account (M0 Free Tier)

2. **Create a Cluster:**
   - After signing up, create a new cluster (choose the free M0 tier)
   - Select a cloud provider and region (closest to you)
   - Wait for the cluster to be created (takes a few minutes)

3. **Create Database User:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Whitelist Your IP:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your specific IP
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)

6. **Update .env file:**
   - Open `backend/.env` file
   - Replace the connection string:
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/music_mode_db?retryWrites=true&w=majority
   ```
   - Replace `your-username` and `your-password` with the credentials you created
   - Replace `cluster0.xxxxx` with your actual cluster address

7. **Restart your server:**
   ```bash
   npm start
   ```

## Option 2: Local MongoDB Installation

### Windows Installation:

1. **Download MongoDB:**
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows as your platform
   - Download the MSI installer

2. **Install MongoDB:**
   - Run the installer
   - Choose "Complete" installation
   - Install MongoDB as a Windows Service (recommended)
   - Install MongoDB Compass (optional GUI tool)

3. **Verify Installation:**
   - MongoDB should start automatically as a Windows service
   - You can verify by opening Services (Win + R, type `services.msc`)
   - Look for "MongoDB" service and ensure it's running

4. **Test Connection:**
   - The default connection string is already set: `mongodb://localhost:27017/music_mode_db`
   - Just restart your server:
   ```bash
   npm start
   ```

### Manual Start (if service doesn't start automatically):

If MongoDB service is not running, you can start it manually:

1. Open Command Prompt or PowerShell as Administrator
2. Navigate to MongoDB bin directory (usually `C:\Program Files\MongoDB\Server\7.0\bin`)
3. Run: `mongod --dbpath "C:\data\db"` (create the folder if it doesn't exist)

Or start the service:
```powershell
net start MongoDB
```

## Troubleshooting

- **Connection refused error:** MongoDB is not running. Start the MongoDB service or use MongoDB Atlas.
- **Authentication failed:** Check your username and password in the connection string.
- **Network access denied:** Make sure your IP is whitelisted in MongoDB Atlas.

