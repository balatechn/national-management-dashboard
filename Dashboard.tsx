import React, { useState } from "react";
import PayrollDashboard from "./PayrollDashboard";

// Placeholder for Zoho Dashboard section
function ZohoDashboard() {
  return (
    <div className="p-6 bg-white rounded-xl shadow mb-8">
      <h2 className="text-xl font-semibold mb-2">Zoho Dashboard</h2>
      <p className="text-gray-600">Integrate Zoho People/CRM analytics here.</p>
      {/* Add Zoho widgets, charts, or stats here */}
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState("payroll");
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex gap-2 p-4">
        <button
          className={`px-4 py-2 rounded ${tab === "zoho" ? "bg-blue-600 text-white" : "bg-white border"}`}
          onClick={() => setTab("zoho")}
        >
          Zoho Dashboard
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "payroll" ? "bg-blue-600 text-white" : "bg-white border"}`}
          onClick={() => setTab("payroll")}
        >
          Payroll Dashboard
        </button>
      </div>
      {tab === "zoho" ? <ZohoDashboard /> : <PayrollDashboard />}
    </div>
  );
}
