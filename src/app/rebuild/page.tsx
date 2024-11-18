import React from 'react'
import Layout from "./layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { BarChart, QrCode, Users } from 'lucide-react'

export default function Home() {
  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Exam Results Platform</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Analyze, compare, and visualize exam results with ease
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2" />
              Analyze Results
            </CardTitle>
            <CardDescription>
              Input exam data manually or scan QR codes for quick analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/analyzer">
              <Button className="w-full">Go to Analyzer</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2" />
              Compare Results
            </CardTitle>
            <CardDescription>
              Compare results between students or across terms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/comparison">
              <Button className="w-full">Go to Comparison</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="mr-2" />
              QR Code Features
            </CardTitle>
            <CardDescription>
              Generate and scan QR codes for easy data input and sharing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/analyzer">
              <Button className="w-full">Try QR Features</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}