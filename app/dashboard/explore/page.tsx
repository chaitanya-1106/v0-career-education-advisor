"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Network, 
  Search, 
  GraduationCap, 
  Briefcase, 
  Code,
  Palette,
  LineChart,
  Stethoscope,
  Scale,
  Building2,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Target
} from "lucide-react"

interface CareerNode {
  id: string
  title: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  avgSalary: string
  skills: string[]
  education: string[]
  relatedCareers: string[]
  resources: { title: string; url: string }[]
}

const careerData: CareerNode[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    category: "Technology",
    icon: Code,
    description: "Design, develop, and maintain software applications and systems. Work with various programming languages and frameworks to solve complex problems.",
    avgSalary: "6-25 LPA",
    skills: ["Programming (Python, Java, JavaScript)", "Data Structures & Algorithms", "System Design", "Git & Version Control", "Problem Solving", "Database Management"],
    education: ["B.Tech/B.E. in Computer Science", "BCA + MCA", "Self-taught with certifications"],
    relatedCareers: ["data-scientist", "devops-engineer", "product-manager"],
    resources: [
      { title: "freeCodeCamp", url: "https://freecodecamp.org" },
      { title: "LeetCode", url: "https://leetcode.com" },
    ],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "Technology",
    icon: LineChart,
    description: "Analyze complex data sets to identify patterns, build predictive models, and provide data-driven insights for business decisions.",
    avgSalary: "8-30 LPA",
    skills: ["Python/R Programming", "Machine Learning", "Statistics", "SQL", "Data Visualization", "Deep Learning"],
    education: ["B.Tech/M.Tech in CS/Statistics", "M.Sc. in Data Science", "Online certifications + projects"],
    relatedCareers: ["software-engineer", "ml-engineer", "business-analyst"],
    resources: [
      { title: "Kaggle", url: "https://kaggle.com" },
      { title: "Coursera ML Course", url: "https://coursera.org" },
    ],
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    category: "Design",
    icon: Palette,
    description: "Create intuitive and engaging user experiences for digital products. Conduct user research, create wireframes, and design interfaces.",
    avgSalary: "5-20 LPA",
    skills: ["UI/UX Design Tools (Figma)", "User Research", "Wireframing", "Prototyping", "Visual Design", "Design Thinking"],
    education: ["B.Des in Interaction Design", "Any degree + UX certifications", "Portfolio-based entry"],
    relatedCareers: ["product-manager", "ui-developer", "graphic-designer"],
    resources: [
      { title: "Google UX Design", url: "https://grow.google/uxdesign" },
      { title: "Dribbble", url: "https://dribbble.com" },
    ],
  },
  {
    id: "product-manager",
    title: "Product Manager",
    category: "Business",
    icon: Target,
    description: "Lead product development from conception to launch. Define product vision, prioritize features, and work with cross-functional teams.",
    avgSalary: "12-40 LPA",
    skills: ["Product Strategy", "Agile/Scrum", "Data Analysis", "Communication", "User Research", "Technical Understanding"],
    education: ["MBA + Tech Background", "Engineering + MBA", "Any degree + PM certifications"],
    relatedCareers: ["software-engineer", "ux-designer", "business-analyst"],
    resources: [
      { title: "Product School", url: "https://productschool.com" },
      { title: "Mind the Product", url: "https://mindtheproduct.com" },
    ],
  },
  {
    id: "doctor",
    title: "Medical Doctor",
    category: "Healthcare",
    icon: Stethoscope,
    description: "Diagnose and treat illnesses, injuries, and other health conditions. Specialize in various medical fields like surgery, pediatrics, or cardiology.",
    avgSalary: "8-50+ LPA",
    skills: ["Medical Knowledge", "Patient Care", "Diagnosis", "Communication", "Decision Making", "Continuous Learning"],
    education: ["MBBS (5.5 years)", "MBBS + MD/MS (Specialization)", "Super-specialization (DM/MCh)"],
    relatedCareers: ["nurse", "pharmacist", "medical-researcher"],
    resources: [
      { title: "NEET Preparation", url: "https://nta.ac.in" },
      { title: "Medscape", url: "https://medscape.com" },
    ],
  },
  {
    id: "lawyer",
    title: "Lawyer",
    category: "Law",
    icon: Scale,
    description: "Provide legal advice, represent clients in court, draft legal documents, and ensure compliance with laws and regulations.",
    avgSalary: "5-30+ LPA",
    skills: ["Legal Research", "Argumentation", "Writing", "Critical Thinking", "Negotiation", "Client Management"],
    education: ["5-year Integrated LLB", "3-year LLB after graduation", "LLM for specialization"],
    relatedCareers: ["judge", "corporate-counsel", "legal-consultant"],
    resources: [
      { title: "CLAT Preparation", url: "https://consortiumofnlus.ac.in" },
      { title: "Bar Council of India", url: "https://barcouncilofindia.org" },
    ],
  },
  {
    id: "civil-engineer",
    title: "Civil Engineer",
    category: "Engineering",
    icon: Building2,
    description: "Design, construct, and maintain infrastructure projects like buildings, roads, bridges, and water systems.",
    avgSalary: "4-20 LPA",
    skills: ["Structural Analysis", "AutoCAD", "Project Management", "Mathematics", "Environmental Awareness", "Problem Solving"],
    education: ["B.Tech in Civil Engineering", "Diploma + B.Tech", "M.Tech for specialization"],
    relatedCareers: ["architect", "construction-manager", "urban-planner"],
    resources: [
      { title: "NPTEL Courses", url: "https://nptel.ac.in" },
      { title: "Civil Engineering Portal", url: "https://civilengineeringportal.com" },
    ],
  },
]

const categories = ["All", "Technology", "Design", "Business", "Healthcare", "Law", "Engineering"]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCareer, setSelectedCareer] = useState<CareerNode | null>(null)

  const filteredCareers = careerData.filter((career) => {
    const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || career.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Knowledge Graph</h1>
        <p className="text-muted-foreground">
          Explore career paths, required skills, and educational requirements
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Career List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search careers or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="shrink-0"
                >
                  {category}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Career List */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {filteredCareers.length} Career{filteredCareers.length !== 1 ? "s" : ""} Found
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="space-y-1 p-2">
                  {filteredCareers.map((career) => {
                    const Icon = career.icon
                    return (
                      <button
                        key={career.id}
                        onClick={() => setSelectedCareer(career)}
                        className={`w-full flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted ${
                          selectedCareer?.id === career.id ? "bg-primary/10 border border-primary/20" : ""
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{career.title}</p>
                          <p className="text-xs text-muted-foreground">{career.category}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Career Details */}
        <div className="lg:col-span-2">
          {selectedCareer ? (
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <selectedCareer.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{selectedCareer.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {selectedCareer.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {selectedCareer.avgSalary}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="skills" className="w-full">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="related">Related</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>

                  <TabsContent value="skills" className="mt-4">
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="education" className="mt-4">
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        Education Paths
                      </h4>
                      <ul className="space-y-2">
                        {selectedCareer.education.map((edu, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            {edu}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="related" className="mt-4">
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Network className="h-4 w-4 text-primary" />
                        Related Careers
                      </h4>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {selectedCareer.relatedCareers.map((relatedId) => {
                          const related = careerData.find(c => c.id === relatedId)
                          if (!related) return null
                          const Icon = related.icon
                          return (
                            <button
                              key={relatedId}
                              onClick={() => setSelectedCareer(related)}
                              className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted"
                            >
                              <Icon className="h-5 w-5 text-primary" />
                              <span className="text-sm font-medium">{related.title}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="resources" className="mt-4">
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Learning Resources
                      </h4>
                      <div className="grid gap-2">
                        {selectedCareer.resources.map((resource) => (
                          <a
                            key={resource.url}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                          >
                            <span className="text-sm font-medium">{resource.title}</span>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex h-full min-h-[400px] items-center justify-center border-dashed">
              <CardContent className="text-center">
                <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Network className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Select a Career</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Choose a career from the list to explore required skills, education paths, and related opportunities.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Visual Knowledge Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Career Connections</CardTitle>
          <CardDescription>
            Visual representation of how different careers and skills connect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden rounded-lg bg-muted/30 p-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {careerData.map((career) => {
                const Icon = career.icon
                const isSelected = selectedCareer?.id === career.id
                const isRelated = selectedCareer?.relatedCareers.includes(career.id)
                
                return (
                  <button
                    key={career.id}
                    onClick={() => setSelectedCareer(career)}
                    className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-all ${
                      isSelected 
                        ? "bg-primary text-primary-foreground scale-110 shadow-lg" 
                        : isRelated 
                          ? "bg-primary/20 border-2 border-primary/40"
                          : "bg-card border border-border hover:border-primary/30"
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      isSelected ? "bg-primary-foreground/20" : "bg-primary/10"
                    }`}>
                      <Icon className={`h-5 w-5 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <span className={`text-xs font-medium text-center max-w-[80px] ${
                      isSelected ? "text-primary-foreground" : ""
                    }`}>
                      {career.title}
                    </span>
                  </button>
                )
              })}
            </div>
            {selectedCareer && (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Click on highlighted nodes to explore related careers
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
