# Zoho OAuth Scopes Configuration Guide

## Current Error: "Invalid OAuth Scope - Scope does not exist"

This error occurs when the OAuth scopes in your application don't match the scopes configured in your Zoho API Console.

## Step 1: Check Your Zoho API Console Configuration

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Select your application
3. Go to the "Scopes" tab
4. Verify these scopes are added:

### Required Scopes for Your Application:

```
ZohoPeople.employee.READ
ZohoPayroll.employees.READ  
ZohoProjects.projects.READ
ZohoCRM.modules.READ
```

## Step 2: If Scopes Are Missing, Add Them:

1. In Zoho API Console, click "Add Scopes"
2. Search for and add each scope:
   - **ZohoPeople.employee.READ** - Read employee data
   - **ZohoPayroll.employees.READ** - Read payroll employee data
   - **ZohoProjects.projects.READ** - Read project data
   - **ZohoCRM.modules.READ** - Read CRM modules data

## Step 3: Alternative Basic Scopes (if above don't work):

Try these more basic scopes:

```
ZohoPeople.forms.READ
ZohoPayroll.organization.READ
ZohoProjects.portals.READ
ZohoCRM.settings.READ
```

## Step 4: Minimal Testing Scopes:

For initial testing, try just one scope at a time:

```
ZohoPeople.forms.READ
```

## Step 5: Update Environment Variables

After configuring scopes in Zoho API Console, ensure your `.env` file has:

```
VITE_ZOHO_CLIENT_ID=your_client_id_here
VITE_ZOHO_CLIENT_SECRET=your_client_secret_here
VITE_ZOHO_REDIRECT_URI=http://localhost:3001/auth/callback
```

## Troubleshooting:

1. **Scope Name Issues**: Zoho scope names can vary by region and plan
2. **Case Sensitivity**: Ensure exact case matching
3. **Service Availability**: Some services might not be available in your Zoho plan
4. **Regional Differences**: Scopes might differ for .com, .in, .eu domains

## Testing Order:

1. Start with basic scopes
2. Test OAuth flow with one scope
3. Gradually add more scopes
4. Verify each addition works

---

**Next Steps**: Check your Zoho API Console scopes and update them to match our application requirements.
