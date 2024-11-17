import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/myComponents/header"
import Footer from "@/components/myComponents/footer"
import Hero from "@/components/myComponents/hero"
import Features from "@/components/myComponents/feature"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header/>
      <main className="flex-1">
       <Hero/>
       <Features/>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-900 dark:text-blue-100">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h3 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-100">Enter Your Marks</h3>
                <p className="text-gray-600 dark:text-gray-400">Input your exam results for each subject quickly and easily.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h3 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-100">Generate Insights</h3>
                <p className="text-gray-600 dark:text-gray-400">Our system analyzes your results and creates personalized reports.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h3 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-100">Improve Performance</h3>
                <p className="text-gray-600 dark:text-gray-400">Use our recommendations to focus your studies and boost your grades.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-900 dark:text-blue-100">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-blue-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 mb-4"> ExamInsights helped me identify my weak areas and improve my grades significantly!</p>
                <p className="font-bold text-blue-900 dark:text-blue-100">- Sarah K., High School Student</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-blue-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 mb-4">As a teacher, I find this tool invaluable for tracking my students progress.</p>
                <p className="font-bold text-blue-900 dark:text-blue-100">- Mr. Johnson, Math Teacher</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-blue-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 mb-4">The visual analytics make it easy to understand my performance at a glance.</p>
                <p className="font-bold text-blue-900 dark:text-blue-100">- Alex M., College Student</p>
              </div>
            </div>
          </div>
        </section>
      </main>
     <Footer/>
    </div>
  )
}




// add header/footer to every page
//link buttons
// add picture of graph on landing page
// option select the graph
//more than 2 student compairison
//understand the code