import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import "../styles/Responses.css";
import { Card, CardContent } from "../ui/card";


const trendData = [
  { date: "Jul 15", responses: 50 },
  { date: "Jul 16", responses: 60 },
  { date: "Jul 17", responses: 75 },
  { date: "Jul 18", responses: 68 },
  { date: "Jul 19", responses: 80 },
  { date: "Jul 20", responses: 95 },
];

const statusData = [
  { name: "Completed", value: 60 },
  { name: "Pending Payment", value: 25 },
  { name: "Abandoned", value: 15 },
];
const STATUS_COLORS = ["#1f77b4", "#d9534f", "#8cc152"];

const formsData = [
  { name: "Product Feedback", value: 120 },
  { name: "Event Registration", value: 80 },
  { name: "Customer Onboarding", value: 50 },
  { name: "Workshop Sign-up", value: 30 },
];

const recentResponses = [
  { id: "#001", form: "Product Feedback Survey", email: "alice@example.com", date: "2024-07-20", status: "Completed", payment: "N/A" },
  { id: "#002", form: "Event Registration Form", email: "bob@example.com", date: "2024-07-19", status: "Pending Payment", payment: "$49.00" },
  { id: "#003", form: "Customer Onboarding Form", email: "charlie@example.com", date: "2024-07-18", status: "Completed", payment: "N/A" },
  { id: "#004", form: "Workshop Sign-up", email: "diana@example.com", date: "2024-07-17", status: "Completed", payment: "$99.00" },
];

function SmallCard({ children, className = "" }) {
  return <div className={`small-card ${className}`}>{children}</div>;
}

export default function Responses() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <header className="dashboard-header">
          <h1>Responses Overview</h1>
          <div className="dashboard-actions">
            <input placeholder="Search responses..." className="search-input" />
            <button className="export-btn">Export</button>
          </div>
        </header>

        <div className="grid-cards">
          <Card className="Card_section">
            <h3 className="card-title">Total Responses Trend</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={[0, 120]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="responses" stroke="#1f77b4" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card >

          <Card className="Card_section">
            <h3 className="card-title">Response Status</h3>
            <div className="pie-container">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={28} outerRadius={48} paddingAngle={4}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card >

          <Card className="Card_section">
            <h3 className="card-title">Responses by Form</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formsData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={120} height={12} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 6, 6]} width={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <SmallCard className="payment-card">
            <div>
              <h3 className="card-title">Payment Summary</h3>
              <div className="payment-amount">$1,845</div>
              <div className="payment-subtitle">Total Payments Collected</div>
            </div>
            <div className="payment-footer">
              <div className="payment-success">92% Payment Success Rate</div>
              <button className="transaction-btn">View All Transactions</button>
            </div>
          </SmallCard>
        </div>

        <div className="recent-responses">
          <h2>Recent Responses</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Response ID</th>
                  <th>Form Name</th>
                  <th>Respondent Email</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentResponses.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.form}</td>
                    <td>{r.email}</td>
                    <td>{r.date}</td>
                    <td><StatusPill status={r.status} /></td>
                    <td>{r.payment}</td>
                    <td>→ View Details</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <div>Showing 1–4 of 24</div>
            <div className="pagination">
              <button>Previous</button>
              <div className="page-number">1</div>
              <button>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  if (status === "Completed") return <span className="status-pill completed">Completed</span>;
  if (status === "Pending Payment") return <span className="status-pill pending">Pending Payment</span>;
  if (status === "Abandoned") return <span className="status-pill abandoned">Abandoned</span>;
  return <span className="status-pill">{status}</span>;
}
