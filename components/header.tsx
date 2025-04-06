"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-primary py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Vehicle Finance text now links to admin page */}
          <Link href="/admin" className="text-2xl font-bold text-black">
            Vehicle Finance
          </Link>

          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/"
                  className={cn("font-semibold text-black hover:underline", pathname === "/" && "underline")}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/finance-options"
                  className={cn(
                    "font-semibold text-black hover:underline",
                    pathname === "/finance-options" && "underline",
                  )}
                >
                  Finance Options
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={cn("font-semibold text-black hover:underline", pathname === "/contact" && "underline")}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>

          <Link href="/contact">
            <Button variant="outline" className="border-white text-black hover:bg-white hover:text-primary">
              <Phone className="mr-2 h-4 w-4" />
              Call Us
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

