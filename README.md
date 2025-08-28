# MY Management - Zoho People & Payroll Dashboard

A standalone web application that integrates with Zoho People and Zoho Payroll APIs to provide comprehensive HR and payroll analytics for MY Management.

## Features

### Zoho People Dashboard
- **Employee Analytics**: Total employees, active count, new joiners, department-wise distribution
- **Attendance Tracking**: Daily attendance trends, leave management, location-wise stats
- **Performance Monitoring**: Alerts for attendance issues, performance reviews, training completion
- **Quick Actions**: Add employees, manage leaves, generate reports, view org chart

### Zoho Payroll Dashboard
- **Payroll Overview**: Gross pay, net pay, deductions breakdown, headcount analytics
- **Department Analysis**: Net pay distribution across cost centers
- **Disbursement Tracking**: Bank transfer status, UTR reconciliation, branch-wise payments
- **Compliance Alerts**: PF, ESI, TDS filing reminders with severity levels
- **Payslip Management**: Generation progress, payroll locking, attendance sync

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom UI Components
- **Charts**: Recharts for data visualization
- **Animation**: Framer Motion for smooth transitions
- **API Integration**: Axios for HTTP requests
- **Authentication**: Zoho OAuth 2.0

## Prerequisites

Before running this application, you need:

1. **Zoho Developer Account**: Sign up at [Zoho Developer Console](https://accounts.zoho.com/developerconsole)
2. **Zoho People/Payroll Subscription**: Active subscription with API access
3. **Node.js**: Version 18 or higher
4. **npm/yarn**: Package manager

## Quick Start

### 1. Clone and Install

```bash
# Navigate to project directory
cd People

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your Zoho credentials
# VITE_ZOHO_CLIENT_ID=your_client_id
# VITE_ZOHO_CLIENT_SECRET=your_client_secret
# VITE_ZOHO_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 3. Set Up Zoho OAuth App

1. Go to [Zoho Developer Console](https://accounts.zoho.com/developerconsole)
2. Create a new **Server-based Application**
3. Set the following:
   - **Authorized Redirect URI**: `http://localhost:3000/auth/callback`
   - **Scopes**: `ZohoPeople.employee.ALL,ZohoPayroll.employees.ALL`
4. Copy the **Client ID** and **Client Secret** to your `.env` file

### 4. Run the Application

```bash
# Start development server
npm run dev

# The app will open at http://localhost:3000
```

## API Integration Setup

### Zoho People API

To fetch real employee data, you need:

1. **API Access**: Ensure your Zoho People plan includes API access
2. **Permissions**: Admin access to employee records
3. **Rate Limits**: Be aware of API rate limits (typically 100 requests/minute)

### Zoho Payroll API

For payroll data integration:

1. **Payroll Subscription**: Active Zoho Payroll subscription
2. **API Permissions**: Access to employee payslips and payroll data
3. **Organization ID**: Required for multi-org accounts

### Authentication Flow

1. **Authorization**: User clicks "Connect Zoho" → redirected to Zoho OAuth
2. **Code Exchange**: Authorization code exchanged for access token
3. **API Calls**: Authenticated requests to Zoho APIs
4. **Token Refresh**: Automatic refresh of expired tokens

## Deployment

### Build for Production

```bash
# Create production build
npm run build

# The built files will be in the 'dist' directory
```

### Deploy Options

#### 1. Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

#### 2. Netlify
```bash
npm run build
# Drag and drop 'dist' folder to Netlify
```

#### 3. Traditional Hosting
```bash
npm run build
# Upload 'dist' folder contents to your web server
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_ZOHO_CLIENT_ID` | Zoho OAuth Client ID | Yes |
| `VITE_ZOHO_CLIENT_SECRET` | Zoho OAuth Client Secret | Yes |
| `VITE_ZOHO_REDIRECT_URI` | OAuth Redirect URI | Yes |

### Customization

#### 1. Company Branding
- Update `index.html` title and favicon
- Modify header text in `App.tsx`
- Customize color scheme in `tailwind.config.js`

#### 2. Data Sources
- Replace mock data in components with real API calls
- Adjust API endpoints in `src/services/zohoAPI.ts`
- Configure data refresh intervals

#### 3. Dashboard Layout
- Modify card arrangements in dashboard components
- Add/remove KPI metrics
- Customize chart types and configurations

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify Zoho OAuth app configuration
   - Check redirect URI matches exactly
   - Ensure proper scopes are requested

2. **API Rate Limits**
   - Implement request queuing
   - Add caching for frequently accessed data
   - Use batch APIs where available

3. **CORS Issues**
   - Configure Zoho API whitelist if needed
   - Use proxy server for development if required

### Development Tips

1. **Mock Data**: The app includes comprehensive mock data for development
2. **Error Handling**: API errors fall back to mock data automatically
3. **TypeScript**: Full type safety for API responses and component props

## API Reference

### Key Endpoints Used

```typescript
// Employee data
GET /people/api/forms/employee/records

// Attendance data  
GET /people/api/attendance/getAttendanceEntries

// Payroll data
GET /payroll/api/v1/employees/{id}/payslips

// Leave data
GET /people/api/leave/getLeaveEntries
```

## Support

For technical support:
- Check [Zoho People API Documentation](https://www.zoho.com/people/api/)
- Review [Zoho Payroll API Documentation](https://www.zoho.com/payroll/api/)
- Contact MY Management IT team for application-specific issues

## License

This project is proprietary software developed for MY Management internal use.

---

**Note**: This application requires active Zoho People and Payroll subscriptions. Demo mode with mock data is available for testing purposes.
