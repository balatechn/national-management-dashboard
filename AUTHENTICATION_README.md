# Enhanced Management Dashboard with Role-Based Authentication

A comprehensive dashboard application for National Group India with advanced authentication and role-based permissions for Zoho People & Payroll management.

## 🔐 Authentication System

The application features a robust authentication system with three distinct user roles:

### User Roles & Permissions

#### 1. **Viewer Access** (Role: `viewer`)
- **Username**: `viewer`
- **Password**: `viewer123`
- **Permissions**:
  - ✅ View all dashboard data
  - ✅ Access to reports and KPIs
  - ❌ No interactive features
  - ❌ No drill-down capabilities
  - ❌ No editing permissions
  - ❌ No file upload access

#### 2. **Interactive Access** (Role: `interactive`)
- **Username**: `manager`
- **Password**: `manager123`
- **Permissions**:
  - ✅ All viewer permissions
  - ✅ **Click-through drill down** into department details
  - ✅ Interactive dashboard elements
  - ✅ Department employee details view
  - ✅ Advanced filtering and exploration
  - ❌ No editing capabilities
  - ❌ No file upload permissions

#### 3. **Admin Access** (Role: `admin`)
- **Username**: `admin`
- **Password**: `admin123`
- **Permissions**:
  - ✅ All interactive permissions
  - ✅ **Edit dashboard data** in real-time
  - ✅ **CSV file upload** for bulk data import
  - ✅ Manage configurations
  - ✅ Export and backup capabilities
  - ✅ Full administrative control

## 🚀 Key Features

### 🔑 Secure Login Page
- Beautiful, responsive login interface
- Role-based access control
- Demo credentials for easy testing
- Permission level explanations
- Persistent authentication (localStorage)

### 📊 Enhanced Dashboard
- **Role-aware UI**: Interface adapts based on user permissions
- **Permission indicators**: Visual status of available features
- **Interactive elements**: Click-to-drill-down for authorized users
- **Edit mode**: Live editing capabilities for admin users
- **File upload**: CSV import functionality for admin users

### 🔍 Drill-Down Functionality
Interactive users and admins can click on department cards to view:
- Individual employee details
- Salary information
- Employment status
- Position details
- Departmental analytics

### 📁 CSV Upload System
Admin users can upload CSV files to:
- Update employee data
- Import new records
- Bulk update payroll information
- Manage department allocations

### 🎨 Responsive Design
- Mobile-friendly interface
- Adaptive layouts
- Tailwind CSS styling
- Professional National Group branding

## 🛠️ Technical Implementation

### Authentication Context
```typescript
// Role-based permissions system
export enum UserRole {
  VIEWER = 'viewer',
  INTERACTIVE = 'interactive', 
  ADMIN = 'admin'
}

// Permission mapping
const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  [UserRole.VIEWER]: {
    canView: true,
    canInteract: false,
    canEdit: false,
    canUpload: false,
    canDrillDown: false
  },
  [UserRole.INTERACTIVE]: {
    canView: true,
    canInteract: true,
    canEdit: false,
    canUpload: false,
    canDrillDown: true
  },
  [UserRole.ADMIN]: {
    canView: true,
    canInteract: true,
    canEdit: true,
    canUpload: true,
    canDrillDown: true
  }
};
```

### Component Structure
```
src/
├── components/
│   ├── LoginPage.tsx           # Comprehensive login interface
│   ├── EnhancedDashboard.tsx   # Role-aware dashboard
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── authContext.tsx         # Authentication & permissions
│   └── utils.ts               # Utility functions
└── App.tsx                    # Main application with auth provider
```

## 🎯 Usage Instructions

### For Developers
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access the application at `http://localhost:3000`

### For Users
1. **Login**: Use one of the demo credentials or your assigned credentials
2. **Navigation**: Use the People/Payroll tabs to switch between modules
3. **Drill-down**: (Interactive/Admin) Click on department cards to view details
4. **Editing**: (Admin only) Click "Edit Mode" to modify dashboard data
5. **File Upload**: (Admin only) Use the CSV upload section to import data
6. **Logout**: Click the logout button to securely sign out

## 🔒 Security Features

- **Role-based access control** (RBAC)
- **Permission validation** on every action
- **Secure authentication** flow
- **Session management** with localStorage
- **Input validation** for file uploads
- **XSS protection** through React's built-in sanitization

## 📈 Dashboard Modules

### Zoho People Dashboard
- Employee count and status tracking
- Department distribution analytics
- Leave management insights
- New joiner tracking
- Interactive employee drill-down

### Zoho Payroll Dashboard
- Gross and net pay calculations
- Deduction breakdowns
- Department-wise payroll analysis
- Compliance tracking
- Bank transfer reconciliation

## 🎨 Design System

The application uses a professional design system with:
- **Tailwind CSS** for styling
- **Consistent color palette** matching National Group branding
- **Responsive breakpoints** for all device sizes
- **Accessible components** with proper ARIA labels
- **Loading states** and error handling

## 🔧 Customization

### Adding New Roles
1. Update the `UserRole` enum in `authContext.tsx`
2. Add role permissions to `ROLE_PERMISSIONS`
3. Update the login page role descriptions
4. Add role-specific logic to dashboard components

### Adding New Features
1. Define required permissions in the role system
2. Use `hasPermission()` to check access
3. Update UI components to respect permissions
4. Add feature-specific error messages

## 📱 Mobile Responsiveness

The dashboard is fully responsive with:
- **Mobile-first design** approach
- **Touch-friendly** interactive elements
- **Optimized layouts** for tablets and phones
- **Readable typography** at all screen sizes

---

**Developed for National Group India**  
*Secure, Scalable, and User-Friendly Dashboard Solution*
