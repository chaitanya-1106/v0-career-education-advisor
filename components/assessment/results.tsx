"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Lightbulb, 
  Wrench, 
  Users, 
  Crown, 
  Microscope,
  ArrowRight,
  RotateCcw,
  MessageSquare,
  Map
} from "lucide-react"

interface AssessmentResultsProps {
  scores: Record<string, number>
  careerMatches: Array<{ career: string; matchScore: number; description: string }>
  onRetake: () => void
}

const traitInfo: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  analytical: { label: "Analytical", icon: Brain, color: "bg-blue-500" },
  creative: { label: "Creative", icon: Lightbulb, color: "bg-amber-500" },
  practical: { label: "Practical", icon: Wrench, color: "bg-green-500" },
  social: { label: "Social", icon: Users, color: "bg-pink-500" },
  leadership: { label: "Leadership", icon: Crown, color: "bg-purple-500" },
  research: { label: "Research", icon: Microscope, color: "bg-cyan-500" },
}

export function AssessmentResults({ scores, careerMatches, onRetake }: AssessmentResultsProps) {
  const sortedTraits = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
  
  const topTraits = sortedTraits.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Your Assessment Results</h1>
        <p className="mt-2 text-muted-foreground">
          Based on your responses, here&apos;s what we discovered about you.
        </p>
      </div>

      {/* Top Traits Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Top Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {topTraits.map(([trait, score]) => {
              const info = traitInfo[trait]
              const Icon = info.icon
              return (
                <Badge 
                  key={trait} 
                  variant="secondary" 
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {info.label}
                  <span className="ml-1 text-xs text-muted-foreground">({score}%)</span>
                </Badge>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Trait Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trait Analysis</CardTitle>
          <CardDescription>Detailed breakdown of your personality and aptitude traits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedTraits.map(([trait, score]) => {
            const info = traitInfo[trait]
            const Icon = info.icon
            return (
              <div key={trait} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-6 w-6 items-center justify-center rounded ${info.color}`}>
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="font-medium">{info.label}</span>
                  </div>
                  <span className="text-muted-foreground">{score}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Career Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommended Career Paths</CardTitle>
          <CardDescription>Based on your unique profile, these careers could be a great fit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {careerMatches.map((match, index) => (
            <div
              key={match.career}
              className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm ${
                index === 0 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{match.career}</h3>
                  {index === 0 && (
                    <Badge className="text-xs">Top Match</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{match.description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">{match.matchScore}%</div>
                <div className="text-xs text-muted-foreground">Match</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Button asChild>
          <Link href="/dashboard/chat">
            <MessageSquare className="mr-2 h-4 w-4" />
            Discuss with AI
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/roadmap">
            <Map className="mr-2 h-4 w-4" />
            View Roadmap
          </Link>
        </Button>
        <Button variant="ghost" onClick={onRetake}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Retake Assessment
        </Button>
      </div>

      {/* Next Steps */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <h3 className="mb-3 font-semibold">What&apos;s Next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-4 w-4 text-primary" />
              <span>Chat with our AI advisor to explore these career paths in depth</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-4 w-4 text-primary" />
              <span>View the knowledge graph to understand skill requirements and education paths</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-4 w-4 text-primary" />
              <span>Create a personalized roadmap with milestones to track your progress</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
