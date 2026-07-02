import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { Card,CardContent } from "../ui/card";

import "../styles/Dashboard.css";

const Dashboard = () => {
  const responsesData = [
    { name: "Customer", form1: 450, form2: 500 },
    { name: "Event", form1: 320, form2: 350 },
    { name: "Product", form1: 220, form2: 280 },
    { name: "Contact", form1: 150, form2: 180 },
    { name: "Job", form1: 100, form2: 120 },
  ];

  const responseTrend = [
    { day: "Mon", responses: 120 },
    { day: "Tue", responses: 180 },
    { day: "Wed", responses: 150 },
    { day: "Thu", responses: 250 },
    { day: "Fri", responses: 300 },
    { day: "Sat", responses: 280 },
    { day: "Sun", responses: 350 },
  ];

  const completionData = [
    { name: "Completed", value: 75 },
    { name: "Abandoned", value: 25 },
  ];

  const COLORS = ["#2563eb", "#9ca3af"];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <h1>Dashboard</h1>
        <span className="status">● Online. All data synced.</span>
      </header>

      {/* Metrics */}
      <section className="metrics">
        <Card className="metric-card blue">
          <CardContent>
            <p>Total Responses</p>
            <h2>1,234</h2>
            <small>from 12 active forms</small>
          </CardContent>
        </Card>
        <Card className="metric-card purple">
          <CardContent>
            <p>Payments Collected</p>
            <h2>₹12</h2>
            <small>across 3 forms</small>
          </CardContent>
        </Card>
        <Card className="metric-card green">
          <CardContent>
            <p>Average Rating</p>
            <h2>4.7/5</h2>
            <small>based on 56 reviews</small>
          </CardContent>
        </Card>
      </section>

      {/* Charts */}
      <section className="analytics">
        <Card>
          <CardContent>
            <h3>Responses by Form</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={responsesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="form1" fill="#2563eb" />
                <Bar dataKey="form2" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3>Response Trend Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={responseTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="responses" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Pie */}
      <Card>
        <CardContent>
          <h3>Form Completion Rate</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {completionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
