import Link from "next/link"
export default function Footer() {
    return (
        <div>
       <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-blue-200 dark:border-gray-700 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
        <p className="text-xs text-gray-600 dark:text-gray-400">© 2024 ExamInsights. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
        </div>
    )
}