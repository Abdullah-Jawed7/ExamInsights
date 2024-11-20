"use client"
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import { AlertCircle, Plus, Minus, QrCode, Save, Download } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import dynamic from 'next/dynamic'
import QRCode from 'qrcode'
import { QrReader } from 'react-qr-reader'


function MortarboardIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

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

export default function ExamInsightsPlatform() {
// chatgpt
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('home')
    const [examData, setExamData] = useState<ExamData>({
      studentName: '',
      subjects: [{ name: '', parts: [
        { name: 'MCQs', obtainedMarks: 0, totalMarks: 0 },
        { name: 'Short Questions', obtainedMarks: 0, totalMarks: 0 },
        { name: 'Long Questions', obtainedMarks: 0, totalMarks: 0 },
      ] }]
    })

    useEffect(() => {
      if (examData) {
        QRCode.toDataURL(JSON.stringify(examData))
          .then((url) => setQrCode(url))
          .catch((err) => console.error('Error generating QR code:', err));
      }
    }, [examData]);


 
  const [comparisonType, setComparisonType] = useState("students")
  const [entityCount, setEntityCount] = useState(2)
  const [entityData, setEntityData] = useState<Record<string, ExamData>>({
    "Entity 1": { studentName: "", subjects: [] },
    "Entity 2": { studentName: "", subjects: [] },
  })
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState("")
  const [savedComparisons, setSavedComparisons] = useState<string[]>([])
  const [comparisonName, setComparisonName] = useState("")
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [activeEntity, setActiveEntity] = useState("Entity 1")
  const [showQRCode, setShowQRCode] = useState(false)
  const [selectedChartType, setSelectedChartType] = useState("bar")

  const handleQRScan = (data: any) => {
    if (data) {
      setExamData(data.text)
      try {
        const parsedData = JSON.parse(data) as ExamData
        if (activeTab === 'analyze') {
          setExamData(parsedData)
        } else if (activeTab === 'compare') {
          setEntityData({ ...entityData, [activeEntity]: parsedData })
        }
        setShowQRScanner(false)
        setError("") // Clear any previous errors
      } catch (err) {
        setError('Failed to parse QR code data. The QR code might be invalid.')
      }
    }
  }

 

  const calculatePercentage = (obtained: number, total: number) => {
    return total > 0 ? (obtained / total) * 100 : 0
  }

  const generateRemarks = (percentage: number) => {
    if (percentage >= 90) return "Excellent performance! Keep up the great work!"
    if (percentage >= 80) return "Very good performance. With a little more effort, you can excel even further."
    if (percentage >= 70) return "Good performance. Focus on improving your weaker areas to boost your overall score."
    if (percentage >= 60) return "Fair performance. Dedicate more time to studying and practicing to improve your results."
    return "Needs improvement. Consider seeking additional help or tutoring to boost your performance."
  }

  const generateSuggestions = (subjects: Subject[]) => {
    const weakSubjects = subjects
      .map(subject => ({
        name: subject.name,
        percentage: calculatePercentage(
          subject.parts.reduce((acc, part) => acc + part.obtainedMarks, 0),
          subject.parts.reduce((acc, part) => acc + part.totalMarks, 0)
        )
      }))
      .filter(subject => subject.percentage < 70)
      .sort((a, b) => a.percentage - b.percentage)

    if (weakSubjects.length === 0) {
      return "Great job! You're performing well in all subjects. To further excel, consider exploring advanced topics or participating in academic competitions."
    }

    const suggestions = weakSubjects.map(subject => 
      `Focus on improving your performance in ${subject.name}. Consider dedicating more study time, seeking additional resources, or getting help from a tutor.`
    )

    return suggestions.join(" ")
  }

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream")
      let downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download = "qr-code.png"
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  const renderHeader = () => (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-white dark:bg-gray-800 shadow-md">
      <Link href="/" className="flex items-center justify-center">
      <MortarboardIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <span className="ml-2 text-xl font-bold text-blue-900 dark:text-blue-100">ExamInsights</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" variant="ghost" onClick={() => setActiveTab('home')}>Home</Button>
        <Button className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" variant="ghost" onClick={() => setActiveTab('analyze')}>Analyze</Button>
        <Button className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" variant="ghost" onClick={() => setActiveTab('compare')}>Compare</Button>
      </nav>
    </header>
  )

  const renderHome = () => (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-blue-900 dark:text-blue-100">Welcome to ExamInsights</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Visualize, analyze, and improve your exam performance</p>
      </section>
      <section className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">Visualize</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">See your exam results in clear, interactive charts and graphs.</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100">Analyze</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">Get detailed insights into your performance across subjects and question types.</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-100 dark:from-gray-800 dark:to-gray-700">
          <CardHeader>
            <CardTitle className="text-purple-900 dark:text-purple-100">Improve</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">Receive personalized suggestions to boost your grades in future exams.</p>
          </CardContent>
        </Card>
      </section>
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to get started?</h2>
        <div className="flex justify-center gap-4">
          <Button onClick={() => setActiveTab('analyze')} className="bg-blue-600 hover:bg-blue-700 text-white">Analyze Your Results</Button>
          <Button onClick={() => setActiveTab('compare')} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900">Compare Performance</Button>
        </div>
      </section>
    </div>
  )

  const renderAnalyze = () => (
    <div className="container mx-auto p-4">
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">Exam Results Analyzer</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Enter or scan your exam results for detailed analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual">
            <TabsList className="bg-blue-100 dark:bg-gray-700">
              <TabsTrigger value="manual" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-100">Manual Entry</TabsTrigger>
              <TabsTrigger value="qr" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-100">QR Code Scan</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <div className="space-y-4">
                <Input
                  type="text"
                  value={examData.studentName}
                  onChange={(e) => setExamData({ ...examData, studentName: e.target.value })}
                  placeholder="Student Name"
                  className="border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                />
                {examData.subjects.map((subject, index) => (
                  <Card key={index} className="bg-gray-50 dark:bg-gray-700">
                    <CardHeader>
                      <Input
                        type="text"
                        value={subject.name}
                        onChange={(e) => {
                          const newSubjects = [...examData.subjects]
                          newSubjects[index].name = e.target.value
                          setExamData({ ...examData, subjects: newSubjects })
                        }}
                        placeholder="Subject Name"
                        className="border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                      />
                    </CardHeader>
                    <CardContent>
                      {subject.parts.map((part, partIndex) => (
                        <div key={partIndex} className="flex space-x-2 mt-2">
                          <Input
                            type="text"
                            value={part.name}
                            onChange={(e) => {
                              const newSubjects = [...examData.subjects]
                              newSubjects[index].parts[partIndex].name = e.target.value
                              setExamData({ ...examData, subjects: newSubjects })
                            }}
                            placeholder="Part Name"
                            className="w-1/3 border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                          />
                          <Input
                            type="number"
                            value={part.obtainedMarks}
                            onChange={(e) => {
                              const newSubjects = [...examData.subjects]
                              newSubjects[index].parts[partIndex].obtainedMarks = parseInt(e.target.value)
                              setExamData({ ...examData, subjects: newSubjects })
                            }}
                            placeholder="Obtained Marks"
                            className="w-1/3 border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                          />
                          <Input
                            type="number"
                            value={part.totalMarks}
                            onChange={(e) => {
                              const newSubjects = [...examData.subjects]
                              newSubjects[index].parts[partIndex].totalMarks = parseInt(e.target.value)
                              setExamData({ ...examData, subjects: newSubjects })
                            }}
                            placeholder="Total Marks"
                            className="w-1/3 border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
                <div className="flex justify-between">
                  <Button onClick={() => setExamData({ ...examData, subjects: [...examData.subjects, { name: '', parts: [
                    { name: 'MCQs', obtainedMarks: 0, totalMarks: 0 },
                    { name: 'Short Questions', obtainedMarks: 0, totalMarks: 0 },
                    { name: 'Long Questions', obtainedMarks: 0, totalMarks: 0 },
                  ] }] })} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add Subject
                  </Button>
                  <Button onClick={() => setExamData({ ...examData, subjects: examData.subjects.slice(0, -1) })} variant="destructive">
                    <Minus className="mr-2 h-4 w-4" /> Remove Subject
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="qr">
              <Button onClick={() => setShowQRScanner(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <QrCode className="mr-2 h-4 w-4" /> Scan QR Code
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => setShowResults(true)} className="bg-green-600 hover:bg-green-700 text-white">Generate Analysis</Button>
          <Button onClick={() => setShowQRCode(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
            <QrCode className="mr-2 h-4 w-4" /> Generate QR Code
          </Button>
        </CardFooter>
      </Card>
      {showResults && (
        <Card className="mt-8 bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="chart-type" className="text-blue-900 dark:text-blue-100">Select Chart Type</Label>
              <Select onValueChange={setSelectedChartType} defaultValue={selectedChartType}>
                <SelectTrigger id="chart-type" className="w-full border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="radar">Radar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={500}>
  { (() => {
    if (selectedChartType === 'bar') {
      return (
        <BarChart
          data={examData.subjects.map(subject => ({
            name: subject.name,
            percentage: calculatePercentage(
              subject.parts.reduce((acc, part) => acc + part.obtainedMarks, 0),
              subject.parts.reduce((acc, part) => acc + part.totalMarks, 0)
            ),
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="percentage" fill="#8884d8" />
        </BarChart>
      );
    }

    if (selectedChartType === 'line') {
      return (
        <LineChart
          data={examData.subjects.map(subject => ({
            name: subject.name,
            percentage: calculatePercentage(
              subject.parts.reduce((acc, part) => acc + part.obtainedMarks, 0),
              subject.parts.reduce((acc, part) => acc + part.totalMarks, 0)
            ),
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="percentage" stroke="#8884d8" />
        </LineChart>
      );
    }

    if (selectedChartType === 'pie') {
      return (
        <PieChart>
          <Pie
            data={examData.subjects.map(subject => ({
              name: subject.name,
              value: calculatePercentage(
                subject.parts.reduce((acc, part) => acc + part.obtainedMarks, 0),
                subject.parts.reduce((acc, part) => acc + part.totalMarks, 0)
              ),
            }))}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
          >
            {examData.subjects.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      );
    }

    if (selectedChartType === 'radar') {
      return (
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="80%"
          data={examData.subjects.map(subject => ({
            subject: subject.name,
            percentage: calculatePercentage(
              subject.parts.reduce((acc, part) => acc + part.obtainedMarks, 0),
              subject.parts.reduce((acc, part) => acc + part.totalMarks, 0)
            ),
          }))}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Student"
            dataKey="percentage"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      );
    }

    return <div>no provided data</div>;
  })()}
</ResponsiveContainer>

            {examData.subjects.map((subject, index) => (
              <Card key={index} className="mt-4 bg-gray-50 dark:bg-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">{subject.name} Performance</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            ))}
            <Card className="mt-8 bg-blue-50 dark:bg-blue-900">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100">Overall Remarks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  {generateRemarks(calculatePercentage(
                    examData.subjects.reduce((acc, subject) => acc + subject.parts.reduce((partAcc, part) => partAcc + part.obtainedMarks, 0), 0),
                    examData.subjects.reduce((acc, subject) => acc + subject.parts.reduce((partAcc, part) => partAcc + part.totalMarks, 0), 0)
                  ))}
                </p>
              </CardContent>
            </Card>
            <Card className="mt-4 bg-green-50 dark:bg-green-900">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-green-900 dark:text-green-100">Suggestions for Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  {generateSuggestions(examData.subjects)}
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderCompare = () => (
    <div className="container mx-auto p-4">
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">Exam Results Comparison</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Compare exam results between students or across terms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comparison-type" className="text-blue-900 dark:text-blue-100">Comparison Type</Label>
              <Select onValueChange={setComparisonType} defaultValue={comparisonType}>
                <SelectTrigger id="comparison-type" className="w-full border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400">
                  <SelectValue placeholder="Select comparison type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="terms">Terms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="entity-count" className="text-blue-900 dark:text-blue-100">Number of {comparisonType === "students" ? "Students" : "Terms"}</Label>
              <Input
                id="entity-count"
                type="number"
                min="2"
                max="6"
                value={entityCount}
                onChange={(e) => {
                  const count = Math.max(2, Math.min(6, parseInt(e.target.value) || 2))
                  setEntityCount(count)
                  const newEntityData: Record<string, ExamData> = {}
                  for (let i = 1; i <= count; i++) {
                    newEntityData[`Entity ${i}`] = entityData[`Entity ${i}`] || { studentName: "", subjects: [] }
                  }
                  setEntityData(newEntityData)
                }}
                className="border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
              />
            </div>
            {Object.keys(entityData).map((entityKey) => (
              <Card key={entityKey} className="bg-gray-50 dark:bg-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">{entityKey}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="text"
                    value={entityData[entityKey].studentName}
                    onChange={(e) => setEntityData({ ...entityData, [entityKey]: { ...entityData[entityKey], studentName: e.target.value } })}
                    placeholder="Student Name"
                    className="mb-4 border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                  />
                  {entityData[entityKey].subjects.map((subject, subjectIndex) => (
                    <div key={subjectIndex} className="mt-4">
                      <Input
                        type="text"
                        value={subject.name}
                        onChange={(e) => {
                          const newSubjects = [...entityData[entityKey].subjects]
                          newSubjects[subjectIndex].name = e.target.value
                          setEntityData({ ...entityData, [entityKey]: { ...entityData[entityKey], subjects: newSubjects } })
                        }}
                        placeholder="Subject Name"
                        className="mb-2 border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                      />
                      {subject.parts.map((part, partIndex) => (
                        <div key={partIndex} className="flex space-x-2 mt-2">
                          <Input
                            type="text"
                            value={part.name}
                            onChange={(e) => {
                              const newSubjects = [...entityData[entityKey].subjects]
                              newSubjects[subjectIndex].parts[partIndex].name = e.target.value
                              setEntityData({ ...entityData, [entityKey]: { ...entityData[entityKey], subjects: newSubjects } })
                            }}
                            placeholder="Part Name"
                            className="w-1/3 border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                          />
                          <Input
                            type="number"
                            value={part.obtainedMarks}
                            onChange={(e) => {
                              const newSubjects = [...entityData[entityKey].subjects]
                              newSubjects[subjectIndex].parts[partIndex].obtainedMarks = parseInt(e.target.value)
                              setEntityData({ ...entityData, [entityKey]: { ...entityData[entityKey], subjects: newSubjects } })
                            }}
                            placeholder="Obtained Marks"
                            className="w-1/3 border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                          />
                          <Input
                            type="number"
                            value={part.totalMarks}
                            onChange={(e) => {
                              const newSubjects = [...entityData[entityKey].subjects]
                              newSubjects[subjectIndex].parts[partIndex].totalMarks = parseInt(e.target.value)
                              setEntityData({ ...entityData, [entityKey]: { ...entityData[entityKey], subjects: newSubjects } })
                            }}
                            placeholder="Total Marks"
                            className="w-1/3 border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="flex justify-between mt-4">
                    <Button onClick={() => {
                      const newSubjects = [...entityData[entityKey].subjects, { name: '', parts: [
                        { name: 'MCQs', obtainedMarks: 0, totalMarks: 0 },
                        { name: 'Short Questions', obtainedMarks: 0, totalMarks: 0 },
                        { name: 'Long Questions', obtainedMarks: 0, totalMarks: 0 },
                      ] }]
                      setEntityData({ ...entityData, [entityKey]: { ...entityData[entityKey], subjects: newSubjects } })
                    }} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="mr-2 h-4 w-4" /> Add Subject
                    </Button>
                    <Button onClick={() => {
                      const newSubjects = entityData[entityKey].subjects.slice(0, -1)
                      setEntityData({ ...entityData, [entityKey]: { ...entityData[entityKey], subjects: newSubjects } })
                    }} variant="destructive">
                      <Minus className="mr-2 h-4 w-4" /> Remove Subject
                    </Button>
                  </div>
                  <Button onClick={() => {
                    setActiveEntity(entityKey)
                    setShowQRScanner(true)
                  }} className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                    <QrCode className="mr-2 h-4 w-4" /> Scan QR Code for {entityKey}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => setShowResults(true)} className="bg-green-600 hover:bg-green-700 text-white">Generate Comparison</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900">
                <Save className="mr-2 h-4 w-4" /> Save Comparison
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle className="text-blue-900 dark:text-blue-100">Save Comparison</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Enter a name for this comparison to save it for future reference.
                </DialogDescription>
              </DialogHeader>
              <Input
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                placeholder="Comparison Name"
                className="border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
              />
              <DialogFooter>
                <Button onClick={() => {
                  if (comparisonName) {
                    setSavedComparisons([...savedComparisons, comparisonName])
                    setComparisonName("")
                  }
                }} className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
      {showResults && (
        <Card className="mt-8 bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">Comparison Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="chart-type" className="text-blue-900 dark:text-blue-100">Select Chart Type</Label>
              <Select onValueChange={setSelectedChartType} defaultValue={selectedChartType}>
                <SelectTrigger id="chart-type" className="w-full border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="radar">Radar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={500}>
  {(() => {
    if (selectedChartType === 'bar') {
      return (
        <BarChart
          data={Object.keys(entityData).map(entity => ({
            name: entity,
            ...entityData[entity].subjects.reduce((acc, subject) => {
              acc[subject.name] = calculatePercentage(
                subject.parts.reduce((sum, part) => sum + part.obtainedMarks, 0),
                subject.parts.reduce((sum, part) => sum + part.totalMarks, 0)
              );
              return acc;
            }, {} as Record<string, number>),
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Array.from(
            new Set(
              Object.values(entityData).flatMap(data =>
                data.subjects.map(subject => subject.name)
              )
            )
          ).map((subject, index) => (
            <Bar key={subject} dataKey={subject} fill={COLORS[index % COLORS.length]} />
          ))}
        </BarChart>
      );
    }

    if (selectedChartType === 'line') {
      return (
        <LineChart
          data={Object.keys(entityData).map(entity => ({
            name: entity,
            ...entityData[entity].subjects.reduce((acc, subject) => {
              acc[subject.name] = calculatePercentage(
                subject.parts.reduce((sum, part) => sum + part.obtainedMarks, 0),
                subject.parts.reduce((sum, part) => sum + part.totalMarks, 0)
              );
              return acc;
            }, {} as Record<string, number>),
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Array.from(
            new Set(
              Object.values(entityData).flatMap(data =>
                data.subjects.map(subject => subject.name)
              )
            )
          ).map((subject, index) => (
            <Line key={subject} type="monotone" dataKey={subject} stroke={COLORS[index % COLORS.length]} />
          ))}
        </LineChart>
      );
    }

    if (selectedChartType === 'radar') {
      return (
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="80%"
          data={Array.from(
            new Set(
              Object.values(entityData).flatMap(data =>
                data.subjects.map(subject => subject.name)
              )
            )
          ).map(subject => ({
            subject,
            ...Object.keys(entityData).reduce((acc, entity) => {
              const subjectData = entityData[entity].subjects.find(
                s => s.name === subject
              );
              if (subjectData) {
                acc[entity] = calculatePercentage(
                  subjectData.parts.reduce((sum, part) => sum + part.obtainedMarks, 0),
                  subjectData.parts.reduce((sum, part) => sum + part.totalMarks, 0)
                );
              }
              return acc;
            }, {} as Record<string, number>),
          }))}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          {Object.keys(entityData).map((entity, index) => (
            <Radar
              key={entity}
              name={entity}
              dataKey={entity}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.6}
            />
          ))}
          <Legend />
        </RadarChart>
      );
    }

    return <div>first select chart type</div>; 
  })()}
            </ResponsiveContainer>

          </CardContent>
        </Card>
      )}
      {savedComparisons.length > 0 && (
        <Card className="mt-8 bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100">Saved Comparisons</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {savedComparisons.map((name, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <span className="text-gray-800 dark:text-gray-200">{name}</span>
                  <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900">Load</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
       {renderHeader()}
      <main className="flex-1">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'analyze' && renderAnalyze()}
        {activeTab === 'compare' && renderCompare()}
      </main>
      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {showQRScanner && (
        <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
          <DialogContent className="max-w-4xl bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-blue-900 dark:text-blue-100">QR Code Scanner</DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Scan a QR code to import exam data
              </DialogDescription>
            </DialogHeader>
            <QrReader
              onResult={handleQRScan}
              scanDelay={300}
              constraints={{
                facingMode: 'environment', // Use the back camera by default
                width: { ideal: 1280 },
                height: { ideal: 720 },
              }}
             
            />
          </DialogContent>
        </Dialog>
      )}
      {showQRCode && (
        <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
          <DialogContent className="bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-blue-900 dark:text-blue-100">Generated QR Code</DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Scan this QR code to import the exam data
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center"> {qrCode ? (
              <Image src={qrCode} alt='QR Code'/>  
                    // <img src={qrCode} alt="Generated QR Code" />
      ) : (
        <p>Loading QR Code...</p>)}
              {/* <QRCode
                id="qr-code"
                value={JSON.stringify(examData)}
                size={256}
                level="H"
                includeMargin={true}
              /> */}
            </div>
            <DialogFooter>
              <Button onClick={downloadQRCode} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="mr-2 h-4 w-4" /> Download QR Code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} ExamInsights. All rights reserved.
      </footer>
    </div>
  )
}