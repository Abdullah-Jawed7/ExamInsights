"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import { AlertCircle, Plus, Download, Printer } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"


export default function ComparisonPage() {
  const [comparisonType, setComparisonType] = useState("students")
  const [subjects, setSubjects] = useState([""])
  const [entityCount, setEntityCount] = useState(2)
  const [entityData, setEntityData] = useState<Record<string, Record<string, string>>>({
    "Entity 1": {},
    "Entity 2": {},
  
  })
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState("")
  const [remarks, setRemarks] = useState("")

  useEffect(() => {
    const newEntityData: Record<string, Record<string, string>> = {}
    for (let i = 1; i <= entityCount; i++) {
      newEntityData[`Entity ${i}`] = entityData[`Entity ${i}`] || {}
      console.log(entityData);
      
    }
    setEntityData(newEntityData)
  }, [entityCount , entityData])

  const addSubject = () => {
    setSubjects([...subjects, ""])
  }

  const updateSubject = (index: number, value: string) => {
    const newSubjects = [...subjects]
    newSubjects[index] = value
    setSubjects(newSubjects)
  }

  const updateMarks = (subject: string, value: string, entity: string) => {
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 100)) {
      setEntityData(prev => ({
        ...prev,
        [entity]: {
          ...prev[entity],
          [subject]: value
        }
      }))
    }
  }

  const generateComparison = () => {
    if (subjects.some(subject => !subject)) {
      setError("Please fill in all subject names.")
      return
    }

    if (subjects.some(subject => Object.values(entityData).some(entity => !entity[subject]))) {
      setError("Please fill in all marks.")
      return
    }

    setError("")
    setShowResults(true)
    generateRemarks()
  }

  const generateRemarks = () => {
    let overallBest = ""
    let overallWorst = ""
    let bestScore = -1
    let worstScore = 101
    const subjectRemarks: Record<string, { best: string[], worst: string[] }> = {}

    subjects.forEach(subject => {
      let bestForSubject:string[] = []
      let worstForSubject:string[] = []
      let highestMark = -1
      let lowestMark = 101

      Object.entries(entityData).forEach(([entity, marks]) => {
        const mark = parseInt(marks[subject] || "0")
        if (mark > highestMark) {
          bestForSubject = [entity]
          highestMark = mark
        } else if (mark === highestMark) {
          bestForSubject.push(entity)
        }

        if (mark < lowestMark) {
          worstForSubject = [entity]
          lowestMark = mark
        } else if (mark === lowestMark) {
          worstForSubject.push(entity)
        }
      })

      subjectRemarks[subject] = { best: bestForSubject, worst: worstForSubject }
    })

    Object.entries(entityData).forEach(([entity, marks]) => {
      const average = Object.values(marks).reduce((sum, mark) => sum + parseInt(mark || "0"), 0) / subjects.length
      if (average > bestScore) {
        overallBest = entity
        bestScore = average
      }
      if (average < worstScore) {
        overallWorst = entity
        worstScore = average
      }
    })

    let remarkText = `Overall, ${overallBest} performed the best with an average score of ${bestScore.toFixed(2)}. `
    remarkText += `${overallWorst} needs the most improvement with an average score of ${worstScore.toFixed(2)}.\n\n`

    subjects.forEach(subject => {
      remarkText += `For ${subject}: `
      remarkText += `${subjectRemarks[subject].best.join(" and ")} performed best. `
      remarkText += `${subjectRemarks[subject].worst.join(" and ")} need(s) to improve.\n`
    })

    setRemarks(remarkText)
  }

  const getComparisonData = () => {
    return subjects.map(subject => {
      const data: Record<string, string | number> = { subject }
      Object.entries(entityData).forEach(([entity, marks]) => {
        data[entity] = parseInt(marks[subject] || "0")
      })
      return data
    })
  }

  const renderInputForm = () => (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Subject</TableHead>
            {Array.from({ length: entityCount }, (_, i) => (
              <TableHead key={i}>{`${comparisonType === "students" ? "Student" : "Term"} ${i + 1} Marks`}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  value={subject}
                  onChange={(e) => updateSubject(index, e.target.value)}
                  placeholder="Enter subject name"
                  className="border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                />
              </TableCell>
              {Array.from({ length: entityCount }, (_, i) => (
                <TableCell key={i}>
                  <Input
                    type="number"
                    value={entityData[`Entity ${i + 1}`][subject] || ""}
                    onChange={(e) => updateMarks(subject, e.target.value, `Entity ${i + 1}`)}
                    placeholder="Enter marks"
                    min="0"
                    max="100"
                    className="border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button 
        type="button" 
        onClick={addSubject} 
        variant="outline" 
        className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Subject
      </Button>
    </div>
  )

  const chartColors = [
    "hsl(215, 100%, 50%)",
    "hsl(280, 100%, 50%)",
    "hsl(35, 100%, 50%)",
    "hsl(145, 100%, 50%)",
    "hsl(190, 100%, 50%)",
    "hsl(320, 100%, 50%)",
  ]

  const downloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4")
    const elements = document.querySelectorAll(".pdf-content")

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement
      const canvas = await html2canvas(element)
      const imgData = canvas.toDataURL("image/png")

      if (i > 0) {
        pdf.addPage()
      }

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 30

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    }

    pdf.save("exam-results-comparison.pdf")
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-blue-200 dark:border-gray-700">
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
                onChange={(e) => setEntityCount(Math.max(2, Math.min(6, parseInt(e.target.value) || 2)))}
                className="border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
              />
            </div>
            {renderInputForm()}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={generateComparison} className="bg-blue-600 hover:bg-blue-700 text-white">
            Generate Comparison
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showResults && (
        <Card className="mt-8 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-blue-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">Comparison Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="pdf-content">
              <Tabs defaultValue="bar">
                <TabsList className="grid w-full grid-cols-2 bg-blue-100 dark:bg-gray-700">
                  <TabsTrigger value="bar" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-100">Bar Chart</TabsTrigger>
                  <TabsTrigger value="line" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-100">Line Chart</TabsTrigger>
                </TabsList>
                <TabsContent value="bar">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getComparisonData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {Array.from({ length: entityCount }, (_, i) => (
                          <Bar key={i} dataKey={`Entity ${i + 1}`} fill={chartColors[i % chartColors.length]} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="line">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getComparisonData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {Array.from({ length: entityCount }, (_, i) => (
                          <Line key={i} type="monotone" dataKey={`Entity ${i + 1}`} stroke={chartColors[i % chartColors.length]} />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="pdf-content mt-6">
              <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">Remarks:</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{remarks}</p>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="mr-2 h-4 w-4" /> Download Report
              </Button>
              <Button onClick={() => window.print()} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Printer className="mr-2 h-4 w-4" /> Print Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}