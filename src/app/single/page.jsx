"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function ExamResultsAnalyzer() {
  const [subjects, setSubjects] = useState([{ name: "", marks: "" }])
  const [remarks, setRemarks] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [overallProgress, setOverallProgress] = useState(0)

  const addSubject = () => {
    setSubjects([...subjects, { name: "", marks: "" }])
  }

  const updateSubject = (index, field, value) => {
    const newSubjects = [...subjects]
    newSubjects[index][field] = value
    setSubjects(newSubjects)
  }

  const generateRemarks = () => {
    setIsLoading(true)
    setError("")

    // Validate input
    if (subjects.some(subject => !subject.name || !subject.marks)) {
      setError("Please fill in all subject names and marks.")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      const totalMarks = subjects.reduce((sum, subject) => sum + parseInt(subject.marks || 0), 0)
      const averageMarks = totalMarks / subjects.length
      let remarkText = ""

      if (averageMarks >= 90) {
        remarkText = "Excellent performance! Keep up the great work."
      } else if (averageMarks >= 80) {
        remarkText = "Very good performance. Focus on improving your weaker subjects."
      } else if (averageMarks >= 70) {
        remarkText = "Good performance. Aim to increase your study time for better results."
      } else if (averageMarks >= 60) {
        remarkText = "Fair performance. Consider seeking help in subjects where you scored lower."
      } else {
        remarkText = "There's room for improvement. Develop a structured study plan and seek guidance from your teachers."
      }

      const lowestSubject = subjects.reduce((min, subject) => 
        (parseInt(subject.marks) < parseInt(min.marks) ? subject : min), subjects[0])
      
      remarkText += ` Focus more on ${lowestSubject.name} to improve your overall performance.`

      setRemarks(remarkText)
      setOverallProgress(averageMarks)
      setIsLoading(false)
    }, 1500)
  }

  const mockHistoricalData = [
    { month: "Jan", average: 65 },
    { month: "Feb", average: 68 },
    { month: "Mar", average: 72 },
    { month: "Apr", average: 75 },
    { month: "May", average: 80 },
  ]

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-blue-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">Exam Results Analyzer</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Enter your exam results to get personalized feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            {subjects.map((subject, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor={`subject-${index}`} className="text-blue-900 dark:text-blue-100">Subject</Label>
                  <Input
                    id={`subject-${index}`}
                    value={subject.name}
                    onChange={(e) => updateSubject(index, "name", e.target.value)}
                    placeholder="Enter subject name"
                    className="border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`marks-${index}`} className="text-blue-900 dark:text-blue-100">Marks</Label>
                  <Input
                    id={`marks-${index}`}
                    type="number"
                    value={subject.marks}
                    onChange={(e) => updateSubject(index, "marks", e.target.value)}
                    placeholder="Enter marks"
                    min="0"
                    max="100"
                    className="border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                  />
                </div>
              </div>
            ))}
            <Button type="button" onClick={addSubject} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950">
              Add Subject
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={generateRemarks} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Generate Results"
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4 bg-red-50 border-red-200 dark:bg-red-900/50 dark:border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {remarks && (
        <Card className="mt-8 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-blue-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">Results Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList className="grid w-full grid-cols-2 bg-blue-100 dark:bg-gray-700">
                <TabsTrigger value="chart" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-100">Performance Chart</TabsTrigger>
                <TabsTrigger value="progress" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-100">Overall Progress</TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <div className="h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjects}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="marks" fill="#4F46E5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="progress">
                <div className="space-y-4 mt-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Overall Progress</span>
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">{Math.round(overallProgress)}%</span>
                    </div>
                    <Progress value={overallProgress} className="w-full" indicatorColor="bg-blue-600" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockHistoricalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="average" stroke="#4F46E5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">Personalized Remarks:</h3>
              <p className="text-gray-700 dark:text-gray-300">{remarks}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}