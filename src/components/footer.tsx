import Link from "next/link"
import { cn } from "@/lib/utils"

type FooterProps = React.HTMLAttributes<HTMLElement>

export function Footer({ className, ...props }: FooterProps) {
  const currentYear = new Date().getFullYear()
  
  const links = [
    {
      title: "Company",
      items: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Press", href: "/press" },
      ],
    },
    {
      title: "Resources",
      items: [
        { name: "Help Center", href: "/help" },
        { name: "Guides", href: "/guides" },
        { name: "Community", href: "/community" },
        { name: "Events", href: "/events" },
      ],
    },
    {
      title: "Legal",
      items: [
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Licenses", href: "/licenses" },
      ],
    },
  ]

  return (
    <footer className={cn("border-t bg-background/50", className)} {...props}>
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                OpSkill
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Connecting talented freelancers with top companies worldwide. Find your next opportunity or hire the best talent for your project.
            </p>
            <div className="mt-6 flex space-x-4">
              {["twitter", "github", "linkedin", "facebook"].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {links.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {currentYear} OpSkill. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
