export default function Features() {
    return(
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-900 dark:text-blue-100">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <BarChartIcon className="h-12 w-12 mb-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-100">Visual Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">See your performance across subjects at a glance with intuitive charts.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <BrainCircuitIcon className="h-12 w-12 mb-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-100">Smart Insights</h3>
              <p className="text-gray-600 dark:text-gray-400">Get AI-powered recommendations to improve your academic performance.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <TrendingUpIcon className="h-12 w-12 mb-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-100">Progress Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400">Monitor your improvement over time with detailed progress reports.</p>
            </div>
          </div>
        </div>
      </section>
    )
}
function BarChartIcon(props:any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    )
  }

function BrainCircuitIcon(props:any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
        <path d="M16 8V5c0-1.1.9-2 2-2" />
        <path d="M12 13h4" />
        <path d="M12 18h6a2 2 0 0 1 2 2v1" />
        <path d="M12 8h8" />
        <path d="M20.5 8a.5.5 0 1 1-.5.5.5.5 0 0 1 .5-.5" />
        <path d="M16.5 13a.5.5 0 1 1-.5.5.5.5 0 0 1 .5-.5" />
        <path d="M20.5 21a.5.5 0 1 1-.5.5.5.5 0 0 1 .5-.5" />
        <path d="M18.5 3a.5.5 0 1 1-.5.5.5.5 0 0 1 .5-.5" />
      </svg>
    )
  }
  

  
  function TrendingUpIcon(props:any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    )
  }