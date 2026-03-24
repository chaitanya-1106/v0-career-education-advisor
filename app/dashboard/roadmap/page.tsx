"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Map, 
  Plus, 
  Check, 
  Circle, 
  Target,
  Rocket,
  GraduationCap,
  Briefcase,
  Award,
  Calendar,
  Trash2,
  Loader2
} from "lucide-react"

interface Milestone {
  id: string
  title: string
  description: string | null
  category: string | null
  target_date: string | null
  completed: boolean
  completed_at: string | null
  created_at: string
}

interface CareerMatch {
  career: string
  matchScore: number
  description: string
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  education: GraduationCap,
  skill: Target,
  career: Briefcase,
  achievement: Award,
  general: Rocket,
}

const categoryColors: Record<string, string> = {
  education: "bg-blue-500",
  skill: "bg-green-500",
  career: "bg-purple-500",
  achievement: "bg-amber-500",
  general: "bg-primary",
}

export default function RoadmapPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [topCareer, setTopCareer] = useState<CareerMatch | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    category: "general",
    target_date: "",
  })

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [milestonesRes, assessmentRes] = await Promise.all([
      supabase
        .from("milestones")
        .select("*")
        .eq("user_id", user.id)
        .order("target_date", { ascending: true, nullsFirst: false }),
      supabase
        .from("assessment_results")
        .select("career_matches")
        .eq("user_id", user.id)
        .single()
    ])

    if (milestonesRes.data) {
      setMilestones(milestonesRes.data)
    }

    if (assessmentRes.data?.career_matches) {
      const careers = assessmentRes.data.career_matches as CareerMatch[]
      if (careers.length > 0) {
        setTopCareer(careers[0])
      }
    }

    setIsLoading(false)
  }

  const handleCreateMilestone = async () => {
    if (!newMilestone.title.trim()) return
    
    setIsSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("milestones")
      .insert({
        user_id: user.id,
        title: newMilestone.title,
        description: newMilestone.description || null,
        category: newMilestone.category,
        target_date: newMilestone.target_date || null,
      })
      .select()
      .single()

    if (!error && data) {
      setMilestones([...milestones, data])
      setNewMilestone({ title: "", description: "", category: "general", target_date: "" })
      setIsDialogOpen(false)
    }
    setIsSaving(false)
  }

  const handleToggleComplete = async (milestone: Milestone) => {
    const newCompleted = !milestone.completed
    
    const { error } = await supabase
      .from("milestones")
      .update({ 
        completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null
      })
      .eq("id", milestone.id)

    if (!error) {
      setMilestones(milestones.map(m => 
        m.id === milestone.id 
          ? { ...m, completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
          : m
      ))
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("milestones")
      .delete()
      .eq("id", id)

    if (!error) {
      setMilestones(milestones.filter(m => m.id !== id))
    }
  }

  const completedCount = milestones.filter(m => m.completed).length
  const progressPercentage = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Career Roadmap</h1>
          <p className="text-muted-foreground">
            {topCareer 
              ? `Your path to becoming a ${topCareer.career}` 
              : "Create milestones to track your career journey"}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Milestone</DialogTitle>
            </DialogHeader>
            <FieldGroup className="mt-4">
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  placeholder="e.g., Complete Python course"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  placeholder="Add more details about this milestone"
                  rows={3}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <Select
                  value={newMilestone.category}
                  onValueChange={(value) => setNewMilestone({ ...newMilestone, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="skill">Skill Development</SelectItem>
                    <SelectItem value="career">Career</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="target_date">Target Date</FieldLabel>
                <Input
                  id="target_date"
                  type="date"
                  value={newMilestone.target_date}
                  onChange={(e) => setNewMilestone({ ...newMilestone, target_date: e.target.value })}
                />
              </Field>
            </FieldGroup>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateMilestone} disabled={!newMilestone.title.trim() || isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Milestone
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Map className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Journey Progress</CardTitle>
              <CardDescription>
                {completedCount} of {milestones.length} milestones completed
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Milestones Timeline */}
      {milestones.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Map className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No milestones yet</h3>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
              Start building your career roadmap by adding milestones for education, skills, and career goals.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Milestone
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-4">
            {milestones.map((milestone, index) => {
              const Icon = categoryIcons[milestone.category || "general"] || Rocket
              const colorClass = categoryColors[milestone.category || "general"] || "bg-primary"
              
              return (
                <div key={milestone.id} className="relative flex gap-4 pl-2">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    milestone.completed ? colorClass : "bg-muted border-2 border-border"
                  }`}>
                    {milestone.completed ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <Icon className={`h-5 w-5 ${milestone.completed ? "text-white" : "text-muted-foreground"}`} />
                    )}
                  </div>

                  {/* Content */}
                  <Card className={`flex-1 transition-colors ${milestone.completed ? "bg-muted/50" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`font-semibold ${milestone.completed ? "text-muted-foreground line-through" : ""}`}>
                              {milestone.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {milestone.category || "general"}
                            </Badge>
                          </div>
                          {milestone.description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {milestone.description}
                            </p>
                          )}
                          {milestone.target_date && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              Target: {new Date(milestone.target_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={milestone.completed ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleToggleComplete(milestone)}
                          >
                            {milestone.completed ? (
                              <>
                                <Circle className="mr-1 h-3 w-3" />
                                Undo
                              </>
                            ) : (
                              <>
                                <Check className="mr-1 h-3 w-3" />
                                Complete
                              </>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(milestone.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Suggested Milestones */}
      {topCareer && milestones.length < 5 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Suggested Milestones for {topCareer.career}</CardTitle>
            <CardDescription>Based on your assessment, here are some recommended goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {getSuggestedMilestones(topCareer.career).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto justify-start whitespace-normal text-left"
                  onClick={() => {
                    setNewMilestone({
                      title: suggestion.title,
                      description: suggestion.description,
                      category: suggestion.category,
                      target_date: "",
                    })
                    setIsDialogOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4 shrink-0" />
                  <span className="text-sm">{suggestion.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function getSuggestedMilestones(career: string) {
  const milestonesByCareer: Record<string, Array<{ title: string; description: string; category: string }>> = {
    "Software Engineer": [
      { title: "Learn a programming language", description: "Master Python or JavaScript fundamentals", category: "skill" },
      { title: "Build a portfolio project", description: "Create a web app or mobile app to showcase skills", category: "achievement" },
      { title: "Complete CS fundamentals course", description: "Data structures, algorithms, and system design", category: "education" },
      { title: "Get first internship", description: "Apply for internships at tech companies", category: "career" },
    ],
    "Data Scientist": [
      { title: "Learn Python for data science", description: "Master pandas, numpy, and matplotlib", category: "skill" },
      { title: "Complete statistics course", description: "Understand probability and statistical analysis", category: "education" },
      { title: "Build ML project", description: "Create an end-to-end machine learning project", category: "achievement" },
      { title: "Learn SQL", description: "Master database queries and data manipulation", category: "skill" },
    ],
    "UX Designer": [
      { title: "Learn design tools", description: "Master Figma or Adobe XD", category: "skill" },
      { title: "Complete UX certification", description: "Google UX Design or similar program", category: "education" },
      { title: "Build design portfolio", description: "Create case studies of design projects", category: "achievement" },
      { title: "Learn user research", description: "Conduct interviews and usability testing", category: "skill" },
    ],
    default: [
      { title: "Research career requirements", description: "Understand skills and qualifications needed", category: "general" },
      { title: "Connect with professionals", description: "Network with people in your desired field", category: "career" },
      { title: "Develop relevant skills", description: "Take courses or practice key skills", category: "skill" },
      { title: "Set educational goals", description: "Plan your academic path", category: "education" },
    ],
  }

  return milestonesByCareer[career] || milestonesByCareer.default
}
