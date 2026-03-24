"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Upload, 
  Camera, 
  Scan,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileImage,
  GraduationCap,
  Award
} from "lucide-react"

interface ExtractedDocument {
  id: string
  type: "certificate" | "marksheet" | "report" | "other"
  title: string
  extractedData: Record<string, string>
  uploadedAt: Date
  status: "processing" | "completed" | "error"
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<ExtractedDocument[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      alert("Please upload an image or PDF file")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    // Simulate OCR processing
    const newDoc: ExtractedDocument = {
      id: Date.now().toString(),
      type: detectDocumentType(file.name),
      title: file.name,
      extractedData: {},
      uploadedAt: new Date(),
      status: "processing",
    }

    setDocuments(prev => [newDoc, ...prev])

    // Simulate OCR completion
    setTimeout(() => {
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      const extractedData = simulateOCRExtraction(newDoc.type)
      
      setDocuments(prev => prev.map(doc => 
        doc.id === newDoc.id 
          ? { ...doc, status: "completed", extractedData }
          : doc
      ))
      
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    }, 2000)
  }

  const detectDocumentType = (filename: string): ExtractedDocument["type"] => {
    const lower = filename.toLowerCase()
    if (lower.includes("certificate") || lower.includes("cert")) return "certificate"
    if (lower.includes("mark") || lower.includes("result") || lower.includes("grade")) return "marksheet"
    if (lower.includes("report")) return "report"
    return "other"
  }

  const simulateOCRExtraction = (type: ExtractedDocument["type"]) => {
    switch (type) {
      case "certificate":
        return {
          "Certificate Type": "Course Completion",
          "Issued By": "ABC Institute of Technology",
          "Course Name": "Data Science Fundamentals",
          "Completion Date": "March 2024",
          "Duration": "6 months",
        }
      case "marksheet":
        return {
          "Examination": "Class 12 Board Exam",
          "Year": "2024",
          "Total Marks": "485/500",
          "Percentage": "97%",
          "Grade": "A+",
        }
      case "report":
        return {
          "Report Type": "Academic Progress Report",
          "Period": "Semester 1",
          "Overall Grade": "A",
          "Remarks": "Excellent performance",
        }
      default:
        return {
          "Document Type": "General Document",
          "Status": "Processed",
        }
    }
  }

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    certificate: Award,
    marksheet: GraduationCap,
    report: FileText,
    other: FileImage,
  }

  const typeColors: Record<string, string> = {
    certificate: "bg-amber-500",
    marksheet: "bg-blue-500",
    report: "bg-green-500",
    other: "bg-gray-500",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Document Scanner</h1>
        <p className="text-muted-foreground">
          Upload academic documents and let AI extract key information automatically
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileInput}
              className="hidden"
            />

            {isUploading ? (
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Scan className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Processing document...</p>
                  <Progress value={uploadProgress} className="mx-auto max-w-xs h-2" />
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress < 50 ? "Uploading..." : uploadProgress < 90 ? "Extracting text..." : "Analyzing..."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Upload a document</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Drag and drop or click to upload certificates, marksheets, or reports
                </p>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, PDF (max 10MB)
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features Info */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Scan, title: "Smart OCR", description: "AI-powered text extraction from images and PDFs" },
          { icon: FileText, title: "Auto-Categorize", description: "Automatically detects document type" },
          { icon: CheckCircle2, title: "Data Extraction", description: "Extracts grades, dates, and key information" },
        ].map((feature) => (
          <Card key={feature.title}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Processed Documents */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Processed Documents</CardTitle>
            <CardDescription>
              Your uploaded documents and extracted information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents.map((doc) => {
              const Icon = typeIcons[doc.type]
              const color = typeColors[doc.type]
              
              return (
                <div
                  key={doc.id}
                  className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{doc.title}</h4>
                          <Badge variant="secondary" className="capitalize text-xs">
                            {doc.type}
                          </Badge>
                          {doc.status === "processing" && (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          )}
                          {doc.status === "completed" && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          {doc.status === "error" && (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Uploaded {doc.uploadedAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeDocument(doc.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {doc.status === "completed" && Object.keys(doc.extractedData).length > 0 && (
                    <div className="mt-4 rounded-lg bg-muted/50 p-3">
                      <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Extracted Information
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {Object.entries(doc.extractedData).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {documents.length === 0 && !isUploading && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No documents yet</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Upload your academic documents to automatically extract and organize your achievements.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
