"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Loader2 } from "lucide-react"
import { AssessmentResults } from "@/components/assessment/results"

interface Question {
  id: string
  text: string
  category: "aptitude" | "personality" | "interest"
  options: { value: string; label: string }[]
}

const assessmentQuestions: Question[] = [
  // Aptitude Questions
  {
    id: "apt_1",
    text: "When solving problems, I prefer to:",
    category: "aptitude",
    options: [
      { value: "logical", label: "Use logic and systematic analysis" },
      { value: "creative", label: "Think creatively and explore new angles" },
      { value: "practical", label: "Apply hands-on practical solutions" },
      { value: "collaborative", label: "Discuss with others and build consensus" },
    ],
  },
  {
    id: "apt_2",
    text: "I find it easiest to understand information when it's presented as:",
    category: "aptitude",
    options: [
      { value: "visual", label: "Charts, diagrams, and visual representations" },
      { value: "verbal", label: "Written text and detailed explanations" },
      { value: "numerical", label: "Numbers, statistics, and data" },
      { value: "kinesthetic", label: "Hands-on demonstrations and activities" },
    ],
  },
  {
    id: "apt_3",
    text: "When learning something new, I:",
    category: "aptitude",
    options: [
      { value: "theory_first", label: "Want to understand the theory first" },
      { value: "dive_in", label: "Prefer to dive in and learn by doing" },
      { value: "examples", label: "Look for examples and case studies" },
      { value: "teach", label: "Try to explain it to someone else" },
    ],
  },
  // Personality Questions
  {
    id: "per_1",
    text: "In a group project, I naturally tend to:",
    category: "personality",
    options: [
      { value: "leader", label: "Take charge and organize the team" },
      { value: "creator", label: "Generate ideas and brainstorm solutions" },
      { value: "executor", label: "Focus on getting tasks done efficiently" },
      { value: "harmonizer", label: "Ensure everyone's voice is heard" },
    ],
  },
  {
    id: "per_2",
    text: "I recharge my energy by:",
    category: "personality",
    options: [
      { value: "alone", label: "Spending time alone with my thoughts" },
      { value: "small_group", label: "Being with a few close friends" },
      { value: "social", label: "Being around lots of people" },
      { value: "activities", label: "Engaging in physical activities" },
    ],
  },
  {
    id: "per_3",
    text: "When making important decisions, I rely more on:",
    category: "personality",
    options: [
      { value: "analysis", label: "Careful analysis and facts" },
      { value: "intuition", label: "My gut feeling and intuition" },
      { value: "values", label: "My personal values and ethics" },
      { value: "advice", label: "Advice from people I trust" },
    ],
  },
  {
    id: "per_4",
    text: "I handle stress best by:",
    category: "personality",
    options: [
      { value: "planning", label: "Making a plan and tackling things step by step" },
      { value: "talking", label: "Talking it through with someone" },
      { value: "activity", label: "Physical exercise or activity" },
      { value: "creative", label: "Creative outlets like art or music" },
    ],
  },
  // Interest Questions
  {
    id: "int_1",
    text: "Which type of work environment appeals to you most?",
    category: "interest",
    options: [
      { value: "office", label: "A structured office environment" },
      { value: "field", label: "Working in the field or outdoors" },
      { value: "lab", label: "A laboratory or research setting" },
      { value: "creative", label: "A creative studio or flexible workspace" },
    ],
  },
  {
    id: "int_2",
    text: "Which activity would you enjoy most in your free time?",
    category: "interest",
    options: [
      { value: "build", label: "Building or creating something tangible" },
      { value: "read", label: "Reading and researching topics of interest" },
      { value: "help", label: "Volunteering and helping others" },
      { value: "explore", label: "Exploring new places and experiences" },
    ],
  },
  {
    id: "int_3",
    text: "Which subject area interests you the most?",
    category: "interest",
    options: [
      { value: "science", label: "Science and Technology" },
      { value: "arts", label: "Arts and Humanities" },
      { value: "business", label: "Business and Commerce" },
      { value: "social", label: "Social Sciences and Psychology" },
    ],
  },
  {
    id: "int_4",
    text: "What kind of impact do you want your career to have?",
    category: "interest",
    options: [
      { value: "innovation", label: "Creating innovative solutions" },
      { value: "helping", label: "Directly helping people" },
      { value: "influence", label: "Influencing decisions and strategies" },
      { value: "expression", label: "Expressing creativity and ideas" },
    ],
  },
  {
    id: "int_5",
    text: "Which type of challenge excites you most?",
    category: "interest",
    options: [
      { value: "technical", label: "Technical or scientific problems" },
      { value: "creative", label: "Creative and artistic challenges" },
      { value: "people", label: "Understanding and working with people" },
      { value: "business", label: "Business and strategic challenges" },
    ],
  },
]

export default function AssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isStarted, setIsStarted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<{
    scores: Record<string, number>
    careerMatches: Array<{ career: string; matchScore: number; description: string }>
  } | null>(null)
  const [existingResults, setExistingResults] = useState<boolean>(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkExistingResults()
  }, [])

  const checkExistingResults = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from("assessment_results")
        .select("*")
        .eq("user_id", user.id)
        .single()
      
      if (data) {
        setExistingResults(true)
        setResults({
          scores: data.scores as Record<string, number>,
          careerMatches: data.career_matches as Array<{ career: string; matchScore: number; description: string }>,
        })
      }
    }
  }

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100
  const currentQ = assessmentQuestions[currentQuestion]

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQ.id]: value })
  }

  const nextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = () => {
    const scores: Record<string, number> = {
      analytical: 0,
      creative: 0,
      practical: 0,
      social: 0,
      leadership: 0,
      research: 0,
    }

    // Simple scoring algorithm based on answers
    Object.entries(answers).forEach(([questionId, answer]) => {
      if (answer === "logical" || answer === "numerical" || answer === "analysis" || answer === "technical") {
        scores.analytical += 20
      }
      if (answer === "creative" || answer === "visual" || answer === "expression" || answer === "creative") {
        scores.creative += 20
      }
      if (answer === "practical" || answer === "kinesthetic" || answer === "dive_in" || answer === "build") {
        scores.practical += 20
      }
      if (answer === "collaborative" || answer === "social" || answer === "helping" || answer === "people") {
        scores.social += 20
      }
      if (answer === "leader" || answer === "influence" || answer === "business") {
        scores.leadership += 20
      }
      if (answer === "theory_first" || answer === "lab" || answer === "read" || answer === "science") {
        scores.research += 20
      }
    })

    // Normalize scores
    const maxScore = Math.max(...Object.values(scores))
    Object.keys(scores).forEach((key) => {
      scores[key] = Math.round((scores[key] / maxScore) * 100)
    })

    // Generate career matches based on scores
    const careerMatches = generateCareerMatches(scores)

    return { scores, careerMatches }
  }

  const generateCareerMatches = (scores: Record<string, number>) => {
    const careers = [
      { career: "Software Engineer", traits: ["analytical", "practical"], description: "Build innovative software solutions and applications" },
      { career: "Data Scientist", traits: ["analytical", "research"], description: "Analyze complex data to drive business decisions" },
      { career: "UX Designer", traits: ["creative", "social"], description: "Create intuitive and beautiful user experiences" },
      { career: "Product Manager", traits: ["leadership", "analytical"], description: "Lead product strategy and development" },
      { career: "Research Scientist", traits: ["research", "analytical"], description: "Conduct groundbreaking research in your field" },
      { career: "Entrepreneur", traits: ["leadership", "creative"], description: "Build and grow your own business ventures" },
      { career: "Teacher/Educator", traits: ["social", "research"], description: "Shape minds and inspire future generations" },
      { career: "Healthcare Professional", traits: ["social", "practical"], description: "Make a direct impact on people's health and wellbeing" },
      { career: "Marketing Specialist", traits: ["creative", "social"], description: "Create compelling campaigns and brand strategies" },
      { career: "Civil Engineer", traits: ["practical", "analytical"], description: "Design and build infrastructure that serves communities" },
    ]

    return careers
      .map((career) => {
        const matchScore = career.traits.reduce((sum, trait) => sum + scores[trait], 0) / career.traits.length
        return { ...career, matchScore: Math.round(matchScore) }
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const calculatedResults = calculateResults()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase.from("assessment_results").upsert({
        user_id: user.id,
        assessment_type: "comprehensive",
        scores: calculatedResults.scores,
        career_matches: calculatedResults.careerMatches,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,assessment_type"
      })
    }

    setResults(calculatedResults)
    setIsSubmitting(false)
  }

  const handleRetake = () => {
    setAnswers({})
    setCurrentQuestion(0)
    setResults(null)
    setExistingResults(false)
    setIsStarted(true)
  }

  if (results) {
    return (
      <AssessmentResults 
        scores={results.scores} 
        careerMatches={results.careerMatches}
        onRetake={handleRetake}
      />
    )
  }

  if (!isStarted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Psychometric Assessment</CardTitle>
            <CardDescription className="text-base">
              Discover your strengths, interests, and ideal career paths through our comprehensive assessment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
              <h3 className="font-semibold">What to expect:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                  <span>{assessmentQuestions.length} questions covering aptitude, personality, and interests</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                  <span>Takes approximately 10-15 minutes to complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                  <span>Personalized career recommendations based on your responses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                  <span>Detailed insights into your strengths and traits</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" onClick={() => setIsStarted(true)} className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Start Assessment
              </Button>
              {existingResults && (
                <p className="text-center text-sm text-muted-foreground">
                  You have already completed this assessment. Starting again will update your results.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {assessmentQuestions.length}
          </span>
          <span className="font-medium text-primary">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="mb-2 inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary capitalize">
            {currentQ.category}
          </div>
          <CardTitle className="text-xl leading-relaxed">{currentQ.text}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[currentQ.id] || ""}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQ.options.map((option) => (
              <Label
                key={option.value}
                htmlFor={option.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all hover:bg-muted/50 ${
                  answers[currentQ.id] === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <span className="text-sm">{option.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentQuestion === assessmentQuestions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < assessmentQuestions.length || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Submit Assessment
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={nextQuestion}
            disabled={!answers[currentQ.id]}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
