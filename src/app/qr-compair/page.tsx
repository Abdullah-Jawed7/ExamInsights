"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { AlertCircle, Plus, Minus, QrCode, Save } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { QrReader } from 'react-qr-reader'

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

export default function ComparisonPage() {
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

  const handleQRScan = (data: string | null) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data) as ExamData
        setEntityData({ ...entityData, [activeEntity]: parsedData })
        setShowQRScanner(false)
      } catch (err) {
        setError('Failed to parse QR code data. The QR code might be invalid.')
      }
    }
  }

  const handleQRError = (err: Error) => {
    setError(`QR code scan error: ${err.message}`)
  }

  const generateComparison = () => {
    setShowResults(true)
  }

  const saveComparison = () => {
    if (comparisonName) {
      setSavedComparisons([...savedComparisons, comparisonName])
      setComparisonName("")
    }
  }

  const calculatePercentage = (obtained: number, total: number) => {
    return total > 0 ? (obtained / total) * 100 : 0
  }

  const renderEntityInputs = () => {
    return Object.keys(entityData).map((entityKey) => (
      <Card key={entityKey} className="mt-4 p-4 bg-gray-50 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">{entityKey}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={entityData[entityKey].studentName}
            onChange={(e) => setEntityData({ ...entityData, [entityKey]: { ...entityData[entityKey], studentName: e.target.value } })}
            placeholder="Student Name"
            className="w-full p-2 border rounded border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400 mb-4"
          />
          {entityData[entityKey].subjects.map((subject, subjectIndex) => (
            <div key={subjectIndex} className="mb-4">
              <Input
                type="text"
                value={subject.name}
                onChange={(e) => {
                  const newSubjects = [...entityData[entityKey].subjects]
                  newSubjects[subjectIndex].name = e.target.value
                  setEntityData({ ...entityData, [entityKey]: { ...entityData[entityKey], subjects: newSubjects } })
                }}
                placeholder="Subject Name"
                className="w-full p-2 border rounded border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400 mb-2"
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
                    className="w-1/3 p-2 border rounded border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
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
                    className="w-1/3 p-2 border rounded border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
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
                    className="w-1/3 p-2 border rounded border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-400"
                  />
                </div>
              ))}
            </div>
          ))}
          <div className="flex justify-between">
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
            }} className="bg-red-600 hover:bg-red-700 text-white">
              <Minus className="mr-2 h-4 w-4" /> Remove Subject
            </Button>
          </div>
          <Button onClick={() => {
            setActiveEntity(entityKey)
            setShowQRScanner(true)
          }} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white">
            <QrCode className="mr-2 h-4 w-4" /> Scan QR Code for {entityKey}
          </Button>
        </CardContent>
      </Card>
    ))
  }

  const renderComparisonResults = () => {
    const entities = Object.keys(entityData)
    const subjects = Array.from(new Set(entities.flatMap(entity => entityData[entity].subjects.map(subject => subject.name))))

    return (
      <div className="mt-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Overall Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={subjects.map(subject => ({
                name: subject,
                ...entities.reduce((acc, entity) => {
                  const subjectData = entityData[entity].subjects.find(s => s.name === subject)
                  if (subjectData) {
                    const totalObtained = subjectData.parts.reduce((sum, part) => sum + part.obtainedMarks, 0)
                    const totalMarks = subjectData.parts.reduce((sum, part) => sum + part.totalMarks, 0)
                    acc[entity] = calculatePercentage(totalObtained, totalMarks)
                  } else {
                    acc[entity] = 0
                  }
                  return acc
                }, {} as Record<string, number>)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {entities.map((entity, index) => (
                  <Bar key={entity} dataKey={entity} fill={COLORS[index % COLORS.length]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {subjects.map((subject, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{subject} Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={entities.map(entity => {
                  const subjectData = entityData[entity].subjects.find(s => s.name === subject)
                  return {
                    name: entity,
                    ...subjectData?.parts.reduce((acc, part) => {
                      acc[part.name] = calculatePercentage(part.obtainedMarks, part.totalMarks)
                      return acc
                    }, {} as Record<string, number>) || {}
                  }
                })}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {['MCQs', 'Short Questions', 'Long Questions'].map((part, index) => (
                    <Bar key={part} dataKey={part} fill={COLORS[index % COLORS.length]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
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
            {renderEntityInputs()}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={generateComparison} className="bg-blue-600 hover:bg-blue-700 text-white">
            Generate Comparison
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" /> Save Comparison
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Comparison</DialogTitle>
                <DialogDescription>
                  Enter a name for this comparison to save it for future reference.
                </DialogDescription>
              </DialogHeader>
              <Input
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                placeholder="Comparison Name"
              />
              <DialogFooter>
                <Button onClick={saveComparison}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showResults && renderComparisonResults()}

      {savedComparisons.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Saved Comparisons</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {savedComparisons.map((name, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{name}</span>
                  <Button variant="outline" size="sm">Load</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {showQRScanner && (
        <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>QR Code Scanner</DialogTitle>
              <DialogDescription>
                Scan a QR code to import exam data for {activeEntity}
              </DialogDescription>
            </DialogHeader>
            <QrReader
              onResult={(result, error) => {
                if (result) {
                  handleQRScan(result.getText())
                }
                if (error) {
                  handleQRError(error)
                }
              }}
              constraints={{ facingMode: 'environment' }}
              className="w-full"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}