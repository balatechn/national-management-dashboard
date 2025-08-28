import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Banknote,
  Users2,
  ScanLine,
  PercentCircle,
  FileSpreadsheet,
  ShieldAlert,
  Settings2,
  CheckCheck,
  Lock,
  Download,
  Filter,
} from "lucide-react";

// Utility: Indian Rupee formatting
const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const months = [
  { key: "2025-08", label: "Aug 2025" },
  { key: "2025-07", label: "Jul 2025" },
  { key: "2025-06", label: "Jun 2025" },
  { key: "2025-05", label: "May 2025" },
  { key: "2025-04", label: "Apr 2025" },
  { key: "2025-03", label: "Mar 2025" },
];

const branches = ["HQ / Richmond", "Shimoga", "Mangalore", "Hassan", "Thirthahalli"];

// Mock source data (replace with live Zoho People/Payroll API later)
const mockData = {
  "2025-08": {
    headcount: 142,
    ctcAvg: 525000,
    totals: { gross: 118_25_0000, deductions: 18_40_000, employerCost: 12_20_000, net: 99_85_0000 },
    disbursement: [
      { branch: "HQ / Richmond", paid: 52, pending: 3, hold: 1, bank: "HDFC" },
      { branch: "Shimoga", paid: 28, pending: 2, hold: 0, bank: "SBI" },
      { branch: "Mangalore", paid: 22, pending: 1, hold: 0, bank: "ICICI" },
      { branch: "Hassan", paid: 16, pending: 2, hold: 0, bank: "Axis" },
      { branch: "Thirthahalli", paid: 14, pending: 1, hold: 0, bank: "SBI" },
    ],
    byDept: [
      { dept: "Sales", net: 34_80_000, count: 48 },
      { dept: "After-Sales", net: 19_60_000, count: 31 },
      { dept: "Marketing", net: 9_40_000, count: 12 },
      { dept: "Finance", net: 11_20_000, count: 10 },
      { dept: "HR", net: 7_80_000, count: 9 },
      { dept: "IT", net: 10_40_000, count: 7 },
    ],
    trend: [
      { m: "Mar", net: 92_10_000, gross: 108_30_000 },
      { m: "Apr", net: 93_90_000, gross: 110_10_000 },
      { m: "May", net: 95_50_000, gross: 111_20_000 },
      { m: "Jun", net: 97_80_000, gross: 114_00_000 },
      { m: "Jul", net: 98_70_000, gross: 115_30_000 },
      { m: "Aug", net: 99_85_000, gross: 118_25_000 },
    ],
    deductionSplit: [
      { name: "PF", value: 6_20_000 },
      { name: "ESI", value: 2_80_000 },
      { name: "PT", value: 75_000 },
      { name: "TDS", value: 7_90_000 },
      { name: "Other", value: 75_000 },
    ],
    payslipProgress: 86,
    validationIssues: 3,
    alerts: [
      { type: "PF", text: "EPF challan due by 15 Sep 2025", severity: "medium" },
      { type: "ESI", text: "ESI payment due by 15 Sep 2025", severity: "low" },
      { type: "TDS", text: "TDS return (24Q) due by 31 Oct 2025", severity: "high" },
    ],
    attendanceSync: { lastSync: "Aug 25, 12:05 PM", anomalies: 5 },
  },
} as any;

const DeductionBadge = ({ label }: { label: string }) => (
  <span className="rounded-full px-3 py-1 text-xs bg-gray-100 text-gray-700">{label}</span>
);

const StatCard = ({ icon: Icon, title, value, desc }: any) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-gray-500">
          <Icon className="h-4 w-4" />
          <CardDescription className="text-xs">{title}</CardDescription>
        </div>
        <CardTitle className="text-2xl mt-1">{value}</CardTitle>
      </CardHeader>
      {desc && (
        <CardContent className="pt-0">
          <div className="text-sm text-gray-500">{desc}</div>
        </CardContent>
      )}
    </Card>
  </motion.div>
);

const TableHeader = () => (
  <div className="grid grid-cols-5 text-xs font-medium text-gray-500 px-4 py-2">
    <div>Branch</div>
    <div className="text-right">Paid</div>
    <div className="text-right">Pending</div>
    <div className="text-right">On Hold</div>
    <div className="text-right">Bank</div>
  </div>
);

const Row = ({ r }: any) => (
  <div className="grid grid-cols-5 items-center px-4 py-2 text-sm border-t">
    <div className="truncate">{r.branch}</div>
    <div className="text-right text-green-600 font-medium">{r.paid}</div>
    <div className="text-right text-amber-600">{r.pending}</div>
    <div className="text-right text-rose-600">{r.hold}</div>
    <div className="text-right">{r.bank}</div>
  </div>
);

export default function PayrollDashboard() {
  const [month, setMonth] = useState(months[0].key);
  const [branchFilter, setBranchFilter] = useState<string | "All">("All");
  const [search, setSearch] = useState("");

  const data = mockData[month];

  const disb = useMemo(() => {
    let rows = data.disbursement;
    if (branchFilter !== "All") rows = rows.filter((r: any) => r.branch === branchFilter);
    if (search.trim()) rows = rows.filter((r: any) => r.branch.toLowerCase().includes(search.toLowerCase()));
    return rows;
  }, [data, branchFilter, search]);

  const totalPaid = disb.reduce((a: number, b: any) => a + b.paid, 0);
  const totalPending = disb.reduce((a: number, b: any) => a + b.pending, 0);
  const totalHold = disb.reduce((a: number, b: any) => a + b.hold, 0);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Zoho Payroll Dashboard</h2>
          <p className="text-sm text-gray-600">Pay cycle: 1–31 monthly · MY Management Group</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 p-2 border rounded-xl">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              className="outline-none text-sm bg-transparent"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
            <div className="w-px h-5 bg-gray-200" />
            <select
              className="outline-none text-sm bg-transparent"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option>All</option>
              {branches.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
          <Button variant="secondary">
            <Download className="mr-2 h-4 w-4"/>Export CSV
          </Button>
          <Button variant="default">
            <FileSpreadsheet className="mr-2 h-4 w-4"/>Export Payslips
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Banknote} 
          title="Total Gross" 
          value={inr.format(data.totals.gross)} 
          desc="Before employee deductions" 
        />
        <StatCard 
          icon={Banknote} 
          title="Net Pay" 
          value={inr.format(data.totals.net)} 
          desc="Post deductions" 
        />
        <StatCard 
          icon={PercentCircle} 
          title="Deductions" 
          value={inr.format(data.totals.deductions)} 
          desc={
            <div className="flex gap-2 flex-wrap">
              <DeductionBadge label="PF"/>
              <DeductionBadge label="ESI"/>
              <DeductionBadge label="PT"/>
              <DeductionBadge label="TDS"/>
            </div>
          } 
        />
        <StatCard 
          icon={Users2} 
          title="Headcount" 
          value={data.headcount} 
          desc={`Avg CTC ${inr.format(data.ctcAvg)}/yr`} 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Net Pay by Department</CardTitle>
            <CardDescription>Distribution across cost centers</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byDept} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dept" />
                <YAxis />
                <Tooltip formatter={(v: number) => inr.format(v)} />
                <Bar dataKey="net" radius={[6,6,0,0]} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deduction Split</CardTitle>
            <CardDescription>PF · ESI · PT · TDS · Other</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.deductionSplit} dataKey="value" nameKey="name" outerRadius={86} label>
                  {data.deductionSplit.map((_: any, i: number) => (
                    <Cell key={i} fill={`hsl(${i * 45}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => inr.format(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Trend (Gross vs Net)</CardTitle>
          <CardDescription>Last 6 months</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="m" />
              <YAxis />
              <Tooltip formatter={(v: number) => inr.format(v)} />
              <Legend />
              <Line type="monotone" dataKey="gross" strokeWidth={2} dot={false} stroke="#3b82f6" />
              <Line type="monotone" dataKey="net" strokeWidth={2} dot={false} stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Disbursement + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Disbursement Status</CardTitle>
                <CardDescription>Bank transfer reconciliation</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  placeholder="Search branch…" 
                  className="h-9 px-3 border rounded-md text-sm" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
                <Button variant="secondary">
                  <ScanLine className="mr-2 h-4 w-4"/>Import UTRs
                </Button>
                <Button variant="default">
                  <CheckCheck className="mr-2 h-4 w-4"/>Auto‑match
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TableHeader />
            {disb.map((r: any, i: number) => <Row key={i} r={r} />)}
            <div className="grid grid-cols-5 px-4 py-3 text-sm border-t bg-gray-50 font-medium">
              <div>Total</div>
              <div className="text-right text-green-700">{totalPaid}</div>
              <div className="text-right text-amber-700">{totalPending}</div>
              <div className="text-right text-rose-700">{totalHold}</div>
              <div />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Payslip Generation</CardTitle>
              <CardDescription>Progress this cycle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>{data.payslipProgress}% complete</span>
                <span>{data.headcount} employees</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${data.payslipProgress}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="default">
                  <FileSpreadsheet className="mr-2 h-4 w-4"/>Generate
                </Button>
                <Button variant="secondary">
                  <Lock className="mr-2 h-4 w-4"/>Lock Payroll
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Compliance Alerts</CardTitle>
              <CardDescription>Keep filings on time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.alerts.map((a: any, i: number) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-xl border">
                  <ShieldAlert className="h-4 w-4 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">{a.type}</div>
                    <div className="text-xs text-gray-600">{a.text}</div>
                    <div className="mt-1">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        a.severity === "high" ? "bg-red-100 text-red-700" : 
                        a.severity === "medium" ? "bg-yellow-100 text-yellow-700" : 
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {a.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button variant="secondary">
                  <Settings2 className="mr-2 h-4 w-4"/>Configure
                </Button>
                <Button variant="default">
                  <Banknote className="mr-2 h-4 w-4"/>Make Payment
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Attendance Sync</CardTitle>
              <CardDescription>Zoho People → Payroll</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                Last sync: <span className="font-medium">{data.attendanceSync.lastSync}</span>
              </div>
              <div className="text-sm">
                Anomalies: <span className="font-medium">{data.attendanceSync.anomalies}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="secondary">Run Validation</Button>
                <Button variant="default">Sync Now</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick Links</CardTitle>
            <CardDescription>Most used actions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary">Bulk Update Bank A/C</Button>
            <Button size="sm" variant="secondary">Upload Investment Declarations</Button>
            <Button size="sm" variant="secondary">CTC Revision Wizard</Button>
            <Button size="sm" variant="secondary">Import On‑Roll Joinees</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Policies</CardTitle>
            <CardDescription>Payroll & compliance</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div>Salary Components · Version 1.3</div>
            <div>PF/ESI Eligibility · Updated Aug 2025</div>
            <div>Overtime & Night Shift · Pilot</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Notes</CardTitle>
            <CardDescription>For this cycle</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>3 pending bank KYC updates at HQ</li>
              <li>Auto‑escalate anomalies {'>'} 3 days</li>
              <li>Freeze variable pay entries by 27th</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
