import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, MapPin, DollarSign, ExternalLink, ChevronDown, RefreshCw, FileText, X, Copy } from "lucide-react"
import axios from "axios"

const API = "https://jobit-assw.onrender.com"

const LOCATIONS = ["Remote", "India", "United States", "United Kingdom", "Canada"]
const EXPERIENCE_LEVELS = [
  { label: "Fresher / Entry Level", titles: ["Fresher", "Junior Developer", "Associate Engineer"] },
  { label: "Mid Level (1-3 years)", titles: ["Software Engineer", "Developer", "Engineer"] },
  { label: "Senior Level (3+ years)", titles: ["Senior Engineer", "Tech Lead", "Senior Developer"] },
]

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <div>
          <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-32 bg-gray-100 rounded" />
        </div>
        <div className="h-6 w-16 bg-gray-100 rounded-full" />
      </div>
      <div className="h-4 w-24 bg-gray-100 rounded mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-gray-100 rounded-full" />
        <div className="h-6 w-20 bg-gray-100 rounded-full" />
        <div className="h-6 w-14 bg-gray-100 rounded-full" />
      </div>
      <div className="h-9 w-28 bg-gray-200 rounded-lg" />
    </div>
  )
}

function ScoreBadge({ score }) {
  const color = score >= 80 ? "bg-green-100 text-green-700" : score >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>{score}% Match</span>
}

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [scoredJobs, setScoredJobs] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scoring, setScoring] = useState(false)
  const [location, setLocation] = useState("Remote")
  const [expIndex, setExpIndex] = useState(0)
  const [coverLetter, setCoverLetter] = useState(null)
  const [coverLetterJob, setCoverLetterJob] = useState(null)
  const [generatingCL, setGeneratingCL] = useState(false)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem("profile")
    if (!saved) return navigate("/upload")
    setProfile(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (profile) fetchJobs()
  }, [profile, location, expIndex])

  const fetchJobs = async () => {
    setLoading(true)
    setScoredJobs([])
    try {
      const res = await axios.post(`${API}/jobs/search`, {
        skills: profile.skills,
        location,
        job_titles: EXPERIENCE_LEVELS[expIndex].titles,
      })
      setJobs(res.data.jobs)
      setLoading(false)
      scoreAllJobs(res.data.jobs)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const scoreAllJobs = async (jobList) => {
    setScoring(true)
    const scored = await Promise.all(
      jobList.map(async (job) => {
        try {
          const res = await axios.post(`${API}/resume/score`, {
            resume_skills: profile.skills,
            job_title: job.title,
            job_description: job.description,
          })
          return { ...job, score: res.data.result }
        } catch {
          return { ...job, score: null }
        }
      })
    )
    const sorted = scored.sort((a, b) => (b.score?.match_score || 0) - (a.score?.match_score || 0))
    setScoredJobs(sorted)
    setScoring(false)
  }

  const handleCoverLetter = async (job) => {
    setGeneratingCL(true)
    setCoverLetterJob(job)
    setCoverLetter(null)
    try {
      const res = await axios.post(`${API}/resume/coverletter`, {
        profile,
        job_title: job.title,
        company: job.company,
        job_description: job.description,
      })
      setCoverLetter(res.data.cover_letter)
    } catch (err) {
      console.error(err)
    } finally {
      setGeneratingCL(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayJobs = scoredJobs.length > 0 ? scoredJobs : jobs

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Jobit</span>
        </div>
        {profile && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
              {profile.name?.[0]}
            </div>
            <span className="text-gray-700 text-sm font-medium">{profile.name}</span>
          </div>
        )}
        <button onClick={() => navigate("/upload")} className="text-sm text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50 transition">
          Upload New Resume
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {profile && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Your Skills</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-48">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Location</label>
            <div className="relative">
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 text-sm appearance-none focus:outline-none focus:border-indigo-400">
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 min-w-48">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Experience Level</label>
            <div className="relative">
              <select value={expIndex} onChange={(e) => setExpIndex(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 text-sm appearance-none focus:outline-none focus:border-indigo-400">
                {EXPERIENCE_LEVELS.map((l, i) => <option key={i} value={i}>{l.label}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
          <button onClick={fetchJobs} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
            <RefreshCw className="w-4 h-4" /> Search
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {loading ? "Searching jobs..." : `${displayJobs.length} Jobs Found`}
            {scoring && <span className="text-sm text-indigo-500 font-normal ml-2">· Scoring matches...</span>}
          </h2>
        </div>

        <div className="space-y-4">
          {loading ? (
            Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            displayJobs.map((job, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-indigo-200 hover:shadow-sm transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                      {job.score && <ScoreBadge score={job.score.match_score} />}
                    </div>
                    <p className="text-indigo-600 font-medium">{job.company}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">{job.source}</span>
                </div>

                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                  {job.salary && job.salary !== "Not specified" && (
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{job.salary}</span>
                  )}
                </div>

                {job.score && (
                  <div className="mb-4 space-y-2">
                    {job.score.matched_skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-xs text-gray-400 font-medium">Matched:</span>
                        {job.score.matched_skills.map((s, j) => (
                          <span key={j} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-100">{s}</span>
                        ))}
                      </div>
                    )}
                    {job.score.missing_skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-xs text-gray-400 font-medium">Missing:</span>
                        {job.score.missing_skills.map((s, j) => (
                          <span key={j} className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full border border-red-100">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium">
                    Apply Now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleCoverLetter(job)}
                    disabled={generatingCL && coverLetterJob?.url === job.url}
                    className="inline-flex items-center gap-2 border border-indigo-600 text-indigo-600 text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-50 transition font-medium disabled:opacity-50"
                  >
                    {generatingCL && coverLetterJob?.url === job.url ? (
                      <><div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /> Generating...</>
                    ) : (
                      <><FileText className="w-3.5 h-3.5" /> Cover Letter</>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {(coverLetter || (generatingCL && coverLetterJob)) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Cover Letter</h3>
                <p className="text-sm text-gray-500">{coverLetterJob?.title} at {coverLetterJob?.company}</p>
              </div>
              <button onClick={() => { setCoverLetter(null); setCoverLetterJob(null) }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {generatingCL ? (
                <div className="flex items-center justify-center py-12 gap-3 text-indigo-600">
                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  Generating your personalized cover letter...
                </div>
              ) : (
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{coverLetter}</p>
              )}
            </div>
            {coverLetter && (
              <div className="p-6 border-t flex gap-3">
                <button onClick={handleCopy} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                  <Copy className="w-4 h-4" /> {copied ? "Copied!" : "Copy to Clipboard"}
                </button>
                <button onClick={() => { setCoverLetter(null); setCoverLetterJob(null) }} className="text-sm text-gray-500 hover:text-gray-700">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}