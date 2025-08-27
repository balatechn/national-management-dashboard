# National Management Dashboard

A modern, elegant business intelligence platform built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **🔐 Role-Based Authentication**: Three-tier access system (Viewer, Interactive, Admin)
- **📊 Multi-Module Dashboard**: People & Payroll, Project Management, CRM, Finance
- **🎨 Elegant Design**: Modern dark theme with glassmorphism effects
- **📱 Responsive**: Works seamlessly on all devices
- **🚀 Real-Time Data**: Live project data integration
- **🔍 Advanced Analytics**: Interactive charts and drill-down capabilities

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0 + TypeScript
- **Styling**: Tailwind CSS 3.3.3
- **Build Tool**: Vite 4.4.5
- **UI Components**: Custom shadcn/ui components
- **Authentication**: Context-based auth with localStorage

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/balatechn/national-management-dashboard.git
cd national-management-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔑 Demo Access

The dashboard includes demo accounts for testing:

- **Viewer Access**: Read-only dashboard
- **Manager Access**: Interactive analytics with drill-down
- **Admin Access**: Full control panel with data management

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── LoginPage.tsx   # Authentication interface
│   ├── EnhancedDashboard.tsx  # Main dashboard
│   └── ProjectTable.tsx       # Project management table
├── lib/                # Utilities and contexts
│   ├── authContext.tsx # Authentication logic
│   └── utils.ts        # Helper functions
├── services/           # API services
│   └── zohoAPI.ts      # External integrations
└── styles/             # Global styles
```

## 📊 Dashboard Modules

### 1. Project Management
- Real-time project tracking
- Completion percentages
- Status indicators
- Team assignments

### 2. People & Payroll
- Employee management
- Department analytics
- Payroll processing
- Performance metrics

### 3. CRM
- Lead pipeline management
- Customer analytics
- Sales tracking
- Conversion metrics

### 4. Finance
- Financial overview
- Budget tracking
- Revenue analytics
- Cost analysis

## 🎨 Design Features

- **Dark Theme**: Modern slate/purple gradient background
- **Glassmorphism**: Subtle transparency and blur effects
- **Animations**: Smooth transitions and hover effects
- **Typography**: Clean, readable fonts with proper hierarchy
- **Color Palette**: Professional amber/gold accent colors

## 🔒 Security

- Role-based access control
- Secure authentication flow
- Permission-based UI rendering
- Data validation and sanitization

## 📈 Performance

- Optimized bundle size with Vite
- Lazy loading for better performance
- Efficient state management
- Responsive image handling

## 🌐 Deployment

### Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

**National Group India**
- Website: [National Group](https://nationalgroup.in)
- Email: info@nationalgroup.in

## 🙏 Acknowledgments

- React Team for the amazing framework
- Tailwind CSS for the utility-first styling
- Vite for the blazing fast build tool
- shadcn/ui for the beautiful components

---

*Built with ❤️ by National Group India*
