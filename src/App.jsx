import { useState } from 'react'

function App() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const analyze = async () => {
    const trimmedUrl = url.trim()
    
    if (!trimmedUrl) {
      setError('Please enter a website URL')
      return
    }

    // Add https if missing
    let finalUrl = trimmedUrl
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      finalUrl = 'https://' + trimmedUrl
    }

    setLoading(true)
    setError('')
    setResult(null)

    // Use environment variable for backend URL
    // For local: VITE_BACKEND_URL=http://localhost:5002
    // For production: Set VITE_BACKEND_URL to your Render backend URL
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5002'

    try {
      const res = await fetch(`${backendUrl}/analyze?url=${encodeURIComponent(finalUrl)}`)
      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running on port 5002.')
    }

    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      analyze()
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-emerald-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getSeverityColor = (severity) => {
    if (severity === 'high') return 'bg-red-500/20 text-red-400'
    return 'bg-yellow-500/20 text-yellow-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            AI Readiness Audit
          </h1>
          <p className="text-slate-400 text-lg">
            Analyze your website's AI discoverability
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="example.com"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button 
              onClick={analyze}
              disabled={loading}
              className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-600 text-slate-900 font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400">Analyzing website...</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Score Card */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 text-center">
              <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">
                AI Readiness Score
              </p>
              <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}
                <span className="text-2xl text-slate-500">/100</span>
              </div>
              <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getScoreBg(result.score)} transition-all duration-1000`}
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
              <p className="text-slate-500 text-sm mt-4">
                This score reflects how well your site is optimized for AI systems.
              </p>
            </div>

            {/* Issues Card */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span>⚠️</span> Issues Found
              </h2>
              {result.issues.length === 0 ? (
                <p className="text-emerald-400">🎉 No issues found! Your site is well optimized.</p>
              ) : (
                <div className="space-y-3">
                  {result.issues.map((issue, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg"
                    >
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                        {issue.severity.toUpperCase()}
                      </span>
                      <span className="text-slate-300">{issue.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details Card */}
            {result.details && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  📊 Site Details
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-slate-500">Title</p>
                    <p className="text-white truncate">{result.details.title}</p>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-slate-500">H1 Headings</p>
                    <p className="text-white">{result.details.h1Count}</p>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-slate-500">Meta Description</p>
                    <p className={result.details.hasMetaDesc ? 'text-emerald-400' : 'text-red-400'}>
                      {result.details.hasMetaDesc ? '✓ Found' : '✗ Missing'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-slate-500">Structured Data</p>
                    <p className={result.details.hasStructuredData ? 'text-emerald-400' : 'text-red-400'}>
                      {result.details.hasStructuredData ? '✓ Found' : '✗ Missing'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Insight Card */}
            {result.aiInsight && (
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span>🤖</span> AI Insight
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  {result.aiInsight}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App