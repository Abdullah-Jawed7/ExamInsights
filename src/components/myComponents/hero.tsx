import Link from "next/link"
import { Button } from "../ui/button"

export default function Hero() {
    return(
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Unlock Your Academic Potential
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400">
                Visualize your exam results, get personalized insights, and improve your performance with ExamInsights.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
              </Link>
              <Link href="/comparison">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950">Compare Results</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
}