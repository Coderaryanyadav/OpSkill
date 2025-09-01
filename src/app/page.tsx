import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Search, Briefcase, User, Code, Zap } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: "Find Work",
      description: "Browse thousands of jobs from top companies and find your perfect match."
    },
    {
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      title: "Hire Talent",
      description: "Connect with skilled professionals ready to work on your projects."
    },
    {
      icon: <User className="h-6 w-6 text-primary" />,
      title: "Build Your Profile",
      description: "Showcase your skills and experience to attract the best opportunities."
    },
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "Multiple Categories",
      description: "From development to design, we have opportunities in every field."
    }
  ]

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "10K+", label: "Jobs Posted" },
    { value: "95%", label: "Success Rate" },
    { value: "24/7", label: "Support" }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
          <div className="container relative z-10 mx-auto flex flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">Find the perfect</span>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                freelance talent
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Connect with top professionals and get your projects done on time and on budget.
            </p>
            <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
              <Button size="lg" className="px-8 py-6 text-base font-semibold">
                <Zap className="mr-2 h-5 w-5" />
                Get Started for Free
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-base font-semibold">
                How It Works
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 opacity-10">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why Choose OpSkill?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We provide the best platform for freelancers and clients to connect and collaborate.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-20">
          <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Join thousands of professionals and businesses already using OpSkill to grow their careers and businesses.
            </p>
            <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
              <Button size="lg" className="px-8 py-6 text-base font-semibold">
                Sign Up Free
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-base font-semibold">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
