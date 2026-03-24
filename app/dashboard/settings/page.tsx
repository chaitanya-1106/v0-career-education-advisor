"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  GraduationCap, 
  Target,
  Save,
  Loader2,
  CheckCircle2,
  X
} from "lucide-react"

interface Profile {
  id: string
  full_name: string | null
  age: number | null
  education_level: string | null
  current_grade: string | null
  interests: string[] | null
  skills: string[] | null
}

const educationLevels = [
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "Undergraduate (Year 1)",
  "Undergraduate (Year 2)",
  "Undergraduate (Year 3)",
  "Undergraduate (Year 4)",
  "Postgraduate",
  "Working Professional",
]

const suggestedInterests = [
  "Technology", "Science", "Arts", "Sports", "Music", "Writing", 
  "Business", "Healthcare", "Law", "Design", "Gaming", "Cooking"
]

const suggestedSkills = [
  "Programming", "Public Speaking", "Writing", "Drawing", "Problem Solving",
  "Mathematics", "Leadership", "Communication", "Research", "Analytics"
]

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [newInterest, setNewInterest] = useState("")
  const [newSkill, setNewSkill] = useState("")

  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (data) {
        setProfile(data)
      }
    }
    setIsLoading(false)
  }

  const handleSave = async () => {
    if (!profile) return
    
    setIsSaving(true)
    setSaveSuccess(false)

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        age: profile.age,
        education_level: profile.education_level,
        current_grade: profile.current_grade,
        interests: profile.interests,
        skills: profile.skills,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)

    setIsSaving(false)
    if (!error) {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  const addInterest = (interest: string) => {
    if (!profile || !interest.trim()) return
    const interests = profile.interests || []
    if (!interests.includes(interest)) {
      setProfile({ ...profile, interests: [...interests, interest] })
    }
    setNewInterest("")
  }

  const removeInterest = (interest: string) => {
    if (!profile) return
    setProfile({
      ...profile,
      interests: (profile.interests || []).filter(i => i !== interest)
    })
  }

  const addSkill = (skill: string) => {
    if (!profile || !skill.trim()) return
    const skills = profile.skills || []
    if (!skills.includes(skill)) {
      setProfile({ ...profile, skills: [...skills, skill] })
    }
    setNewSkill("")
  }

  const removeSkill = (skill: string) => {
    if (!profile) return
    setProfile({
      ...profile,
      skills: (profile.skills || []).filter(s => s !== skill)
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Update your profile to get personalized career recommendations
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>Basic details about yourself</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
              <Input
                id="full_name"
                value={profile?.full_name || ""}
                onChange={(e) => setProfile(profile ? { ...profile, full_name: e.target.value } : null)}
                placeholder="Your full name"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="age">Age</FieldLabel>
                <Input
                  id="age"
                  type="number"
                  min={13}
                  max={100}
                  value={profile?.age || ""}
                  onChange={(e) => setProfile(profile ? { ...profile, age: parseInt(e.target.value) || null } : null)}
                  placeholder="Your age"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="education_level">Education Level</FieldLabel>
                <Select
                  value={profile?.education_level || ""}
                  onValueChange={(value) => setProfile(profile ? { ...profile, education_level: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Interests</CardTitle>
              <CardDescription>What areas are you passionate about?</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Interests */}
          {profile?.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="flex items-center gap-1 pr-1">
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Add New Interest */}
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest..."
              onKeyDown={(e) => e.key === "Enter" && addInterest(newInterest)}
            />
            <Button variant="outline" onClick={() => addInterest(newInterest)}>
              Add
            </Button>
          </div>

          {/* Suggested Interests */}
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedInterests
                .filter(i => !profile?.interests?.includes(i))
                .slice(0, 6)
                .map((interest) => (
                  <Button
                    key={interest}
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => addInterest(interest)}
                  >
                    + {interest}
                  </Button>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Skills</CardTitle>
              <CardDescription>What skills do you have or are developing?</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Skills */}
          {profile?.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1 pr-1">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Add New Skill */}
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyDown={(e) => e.key === "Enter" && addSkill(newSkill)}
            />
            <Button variant="outline" onClick={() => addSkill(newSkill)}>
              Add
            </Button>
          </div>

          {/* Suggested Skills */}
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills
                .filter(s => !profile?.skills?.includes(s))
                .slice(0, 6)
                .map((skill) => (
                  <Button
                    key={skill}
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => addSkill(skill)}
                  >
                    + {skill}
                  </Button>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Keeping your profile updated helps our AI provide 
            more accurate and personalized career recommendations. The more we know about your interests 
            and skills, the better guidance we can offer.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
