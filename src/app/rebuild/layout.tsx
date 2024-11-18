import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-blue-600 text-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Exam Results Platform
          </Link>
          <div className="space-x-4">
            <Link href="/analyzer">
              <Button variant="ghost">Analyzer</Button>
            </Link>
            <Link href="/comparison">
              <Button variant="ghost">Comparison</Button>
            </Link>
            <Link href="/results">
              <Button variant="ghost">Results</Button>
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-100 dark:bg-gray-800 text-center py-4">
        <p>&copy; 2023 Exam Results Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}