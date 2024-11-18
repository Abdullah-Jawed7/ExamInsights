"use client"

import React, { useState } from 'react'
import Layout from '../layout'
import QRCodeHandler from '@/components/myComponents/qr'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { AlertCircle, Plus, Minus } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type SubjectPart = {
  name: string
  obtainedMarks: number
  totalMarks: number
}

type Subject = {
  name: string
  parts: SubjectPart[]
}

type ExamData = {
  studentName: string
  subjects: Subject[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AnalyzerPage() {
  const [activeTab, setActiveTab] = useState<'manual' | 'qr'>('manual')
  const [examData, setExamData] = useState<ExamData>({
    studentName: '',
    subjects: [{ name: '', parts: [
      { name: 'MCQs', obtainedMarks: 0, totalMarks: 0 },
      { name: 'Short Questions', obtainedMarks: 0, totalMarks: 0 },
      { name: 'Long Questions', obtainedMarks: 0, totalMarks: 0 },
    ] }]
  })
  const [error, setError] = useState<string>('')

  const handleQRScan = (data: string) => {
    try {
      const parsedData = JSON.parse(data) as ExamData
      setExamData(parsedData)
    } catch (err) {
      setError('Failed to parse QR code data. The QR code might be invalid.')
    }
  }

  const calculatePercentage = (obtained: number, total: number) => {
    return total > 0 ? (obtained / total) * 100 : 0
  }

  const renderSubjectInputs = () => {
    return examData.subjects.map((subject, subjectIndex) => (
      <Card key={subjectIndex} className="mt-4 p-4 bg-gray-50 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">
            <Input
              type="text"
              value={subject.name}
              onChange={(e) => {
                const newSubjects = [...examData.subjects]
                newSubjects[subjectIndex].name = e.target.value
                setExamData({ ...examData, subjects: newSubjects })
              }}
              placeholder="Subject Name"
              className="w-full p-2 border rounded border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subject.parts.map((part, partIndex) => (
            <div key={partIndex} className="flex space-x-2 mt-2">
              <Input
                type="text"
                value={part.name}
                onChange={(e) => {
                  const newSubjects = [...examData.subjects]
                  newSubjects[subjectIndex].parts[partIndex].name = e.target.value
                  setExamData({ ...examData, subjects: newSubjects })
                }}
                placeholder="Part Name"
                className="w-1/3 p-2 border rounded border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
              />
              <Input
                type="number"
                value={part.obtainedMarks}
                onChange={(e) => {
                  const newSubjects = [...examData.subjects]
                  newSubjects[subjectIndex].parts[partIndex].obtainedMarks = parseInt(e.target.value)
                  setExamData({ ...examData, subjects: newSubjects })
                }}
                placeholder="Obtained Marks"
                className="w-1/3 p-2 border rounded border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
              />
              <Input
                type="number"
                value={part.totalMarks}
                onChange={(e) => {
                  const newSubjects = [...examData.subjects]
                  newSubjects[subjectIndex].parts[partIndex].totalMarks = parseInt(e.target.value)
                  setExamData({ ...examData, subjects: newSubjects })
                }}
                placeholder="Total Marks"
                className="w-1/3 p-2 border rounded border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    ))
  }

  const renderAnalysis = () => {
    return (
      <div className="mt-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Overall Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={examData.subjects.map(subject => ({
                name: subject.name,
                percentage: calculatePercentage(
                  subject.parts.reduce((acc, part) => acc + part.obtainedMarks, 0),
                  subject.parts.reduce((acc, part) => acc + part.totalMarks, 0)
                )
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="percentage" fill="#8884d8" name="Subject Percentage" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {examData.subjects.map((subject, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{subject.name} Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={subject.parts}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="obtainedMarks"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {subject.parts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Part</TableHead>
                        <TableHead>Obtained</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subject.parts.map((part, partIndex) => (
                        <TableRow key={partIndex}>
                          <TableCell>{part.name}</TableCell>
                          <TableCell>{part.obtainedMarks}</TableCell>
                          <TableCell>{part.totalMarks}</TableCell>
                          <TableCell>{calculatePercentage(part.obtainedMarks, part.totalMarks).toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Layout>
      <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-blue-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">Exam Results Analyzer</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Enter or scan your exam results for detailed analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'manual' | 'qr')}>
            <TabsList className="grid w-full grid-cols-2 bg-blue-100 dark:bg-gray-700">
              <TabsTrigger value="manual" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-100">Manual Entry</TabsTrigger>
              <TabsTrigger value="qr" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-100">QR Code</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <div className="space-y-4">
                <Input
                  type="text"
                  value={examData.studentName}
                  onChange={(e) => setExamData({ ...examData, studentName: e.target.value })}
                  placeholder="Student Name"
                  className="w-full p-2 border rounded border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                />
                {renderSubjectInputs()}
                <div className="flex justify-between">
                  <Button onClick={() => setExamData({ ...examData, subjects: [...examData.subjects, { name: '', parts: [
                    { name: 'MCQs', obtainedMarks: 0, totalMarks: 0 },
                    { name: 'Short Questions', obtainedMarks: 0, totalMarks: 0 },
                    { name: 'Long Questions', obtainedMarks: 0, totalMarks: 0 },
                  ] }] })} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add Subject
                  </Button>
                  <Button onClick={() => setExamData({ ...examData, subjects: examData.subjects.slice(0, -1) })} className="bg-red-600 hover:bg-red-700 text-white">
                    <Minus className="mr-2 h-4 w-4" /> Remove Subject
                  </Button>
                </div>
                <QRCodeHandler onScan={handleQRScan} data={JSON.stringify(examData)} generateQRCode={true} />
              </div>
            </TabsContent>
            <TabsContent value="qr">
              <div className="space-y-4">
                <QRCodeHandler onScan={handleQRScan} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {examData.studentName && examData.subjects.length > 0 && renderAnalysis()}
    </Layout>
  )
}