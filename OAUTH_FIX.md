# Zoho OAuth Setup Fix

## Issue
The OAuth URL was using port 3000 but the development server runs on port 3001, causing "Invalid OAuth Scope" errors.

## Quick Fix Applied

### 1. Updated .env file
```
VITE_ZOHO_REDIRECT_URI=http://localhost:3001/auth/callback
```

### 2. Updated zohoAPI.ts default configuration
```typescript
REDIRECT_URI: import.meta.env.VITE_ZOHO_REDIRECT_URI || 'http://localhost:3001/auth/callback'
```

## Next Steps - Update Zoho API Console

### Important: You must update your Zoho API Console settings

1. **Go to:** https://api-console.zoho.com/
2. **Select your app:** "National Management Dashboard"
3. **Update Redirect URI to:** `http://localhost:3001/auth/callback`
4. **Start with basic scopes first:**
   - `ZohoPeople.forms.READ`
   - `ZohoPeople.employee.READ`
   - `ZohoProjects.projects.READ`
   - `ZohoCRM.modules.READ`

## Testing Scopes

The new Scope Helper component in the Setup tab allows you to:
- Test individual scopes one by one
- Identify which scopes are properly configured
- Get direct links to test each scope

## Current Development Server
- **URL:** http://localhost:3001/
- **OAuth Callback:** http://localhost:3001/auth/callback

## Production Deployment
For production (Netlify), update the redirect URI to:
```
https://your-app-name.netlify.app/auth/callback
```
