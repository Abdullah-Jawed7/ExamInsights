import Link from "next/link"
export default function Header() {
    return (
        <div>
        <header className="px-4 lg:px-6 h-14 flex items-center border-b border-blue-200 dark:border-gray-700 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
        <Link className="flex items-center justify-center" href="#">
          <MortarboardIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="ml-2 text-lg font-bold text-blue-900 dark:text-blue-100">ExamInsights</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" href="#testimonials">
            Testimonials
          </Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" href="/compair">
            Compare Results
          </Link>
        </nav>
      </header>
        </div>
    )
}











function MortarboardIcon(props:any) {
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
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    )
  }