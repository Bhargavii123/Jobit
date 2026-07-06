import { useNavigate } from "react-router-dom"
import { Upload, Search, FileText, TrendingUp, CheckCircle, ArrowRight } from "lucide-react"

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Jobit</span>
        </div>
        <button
          onClick={() => navigate("/upload")}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block bg-indigo-50 text-indigo-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          AI-Powered Job Matching
        </span>
        <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
          Find Jobs That Match<br />
          <span className="text-indigo-600">Your Actual Skills</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload your resume once. Our AI extracts your skills, finds matched jobs, scores your fit, identifies skill gaps, and generates tailored cover letters.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            Upload Resume <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">How It Works</h2>
          <p className="text-gray-500 text-center mb-12">Three steps to your next job</p>
          <div className="grid grid-cols-3 gap-8">
            {[
              { icon: Upload, step: "01", title: "Upload Resume", desc: "Upload your PDF resume. Our AI parses it and extracts your skills, experience, and profile automatically." },
              { icon: Search, step: "02", title: "Get Matched Jobs", desc: "We search across multiple job boards and return roles matched to your specific skills — not generic keywords." },
              { icon: TrendingUp, step: "03", title: "See Your Match Score", desc: "Each job shows your match percentage, which skills you have, and what you're missing — so you apply smarter." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-bold text-indigo-400">{step}</span>
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Everything You Need</h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              { title: "AI Resume Parsing", desc: "Automatically extracts skills, experience, education and job titles from your PDF." },
              { title: "Smart Job Matching", desc: "Jobs are fetched based on your skills using AI-generated search terms — not generic keywords." },
              { title: "Match Score per Job", desc: "See exactly how well you match each job — with matched skills and gaps highlighted." },
              { title: "Skill Gap Analysis", desc: "Know which skills you're missing for each role so you can upskill strategically." },
              { title: "AI Cover Letters", desc: "Generate personalized cover letters for each job in one click using your profile." },
              { title: "Filter by Location", desc: "Search for remote jobs, India-specific roles, or international opportunities." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-4 p-6 rounded-xl border border-gray-100 hover:border-indigo-200 transition">
                <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Find Your Next Job?</h2>
          <p className="text-indigo-200 mb-8 text-lg">Upload your resume and get matched jobs in under 30 seconds.</p>
          <button
            onClick={() => navigate("/upload")}
            className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition"
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
        Built by Bhargavi G · Jobit © 2026
      </footer>
    </div>
  )
}