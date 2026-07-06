import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, FileText, X, ArrowRight, Search } from "lucide-react"
import axios from "axios"

const API = "https://fictional-space-giggle-4jq4qpvqp46qf7g56-8000.app.github.dev"

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const navigate = useNavigate()

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f)
      setError("")
    } else {
      setError("Please upload a PDF file")
    }
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }, [])

  const handleUpload = async () => {
    if (!file) return setError("Please select a PDF file first")
    setLoading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await axios.post(`${API}/resume/parse`, formData)
      localStorage.setItem("profile", JSON.stringify(res.data.profile))
      navigate("/jobs")
    } catch (err) {
      setError("Failed to parse resume. Please check your file and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer" onClick={() => navigate("/")}>
          <Search className="w-4 h-4 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 cursor-pointer" onClick={() => navigate("/")}>Jobit</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Upload Your Resume</h1>
          <p className="text-gray-500 text-lg">Our AI will extract your skills and find matched jobs instantly</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => !file && document.getElementById("fileInput").click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition cursor-pointer ${
              dragOver ? "border-indigo-500 bg-indigo-50" :
              file ? "border-green-400 bg-green-50" :
              "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
            }`}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-green-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setFile(null) }} className="ml-4 text-gray-400 hover:text-red-500 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-1">Drop your resume here or click to browse</p>
                <p className="text-gray-400 text-sm">PDF files only · Max 5MB</p>
              </>
            )}
          </div>

          <input id="fileInput" type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                Find My Matched Jobs <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Your data is used only to find relevant jobs and is never stored permanently.
          </p>
        </div>

        {/* What happens next */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { step: "1", text: "AI reads your resume" },
            { step: "2", text: "Skills are extracted" },
            { step: "3", text: "Matched jobs appear" },
          ].map(({ step, text }) => (
            <div key={step} className="bg-white rounded-xl p-4 text-center border border-gray-100">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">{step}</div>
              <p className="text-gray-600 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}