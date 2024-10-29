/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React, { useState, useMemo } from "react"
import { Bar, BarChart, Pie, PieChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Payment } from '@/types/payment'


interface ChartsProps {
  payments: Payment[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))']

export default function Charts({ payments }: Readonly<ChartsProps>) {

  const [timeRange, setTimeRange] = useState("all")

  const filteredData = useMemo(() => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    switch (timeRange) {
      case "30days":
        return payments.filter(payment => new Date(payment.date) >= thirtyDaysAgo)
      case "90days":
        return payments.filter(payment => new Date(payment.date) >= ninetyDaysAgo)
      default:
        return payments
    }
  }, [timeRange])

  const paymentsByCompany = useMemo(() => {
    return filteredData.reduce((acc, payment) => {
      const companyName = payment.company.name
      acc[companyName] = (acc[companyName] || 0) + payment.amount
      return acc
    }, {} as Record<string, number>)
  }, [filteredData])

  const paymentsByCategory = useMemo(() => {
    return filteredData.reduce((acc, payment) => {
      const categoryName = payment.category.name
      acc[categoryName] = (acc[categoryName] || 0) + payment.amount
      return acc
    }, {} as Record<string, number>)
  }, [filteredData])

  const timelineData = useMemo(() => {
    return filteredData.map(payment => ({
      date: new Date(payment.date).toISOString().split('T')[0],
      amount: payment.amount
    }))
  }, [filteredData])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payment Dashboard</h1>
        <Select onValueChange={setTimeRange} defaultValue={timeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Payments by Company</CardTitle>
            <CardDescription>Total payment amounts for each company</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(paymentsByCompany).map(([name, total]) => ({ name, total }))}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                  labelStyle={{ color: "hsl(var(--text))" }}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, "Total"]}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payments by Category</CardTitle>
            <CardDescription>Distribution of payments across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(paymentsByCategory).map(([name, value]) => ({ name, value }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {Object.entries(paymentsByCategory).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                  labelStyle={{ color: "hsl(var(--text))" }}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, "Total"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Payment Timeline</CardTitle>
            <CardDescription>Payment amounts over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                  labelStyle={{ color: "hsl(var(--text))" }}
                  formatter={(value) => [`$${value}`, "Amount"]}
                />
                <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}