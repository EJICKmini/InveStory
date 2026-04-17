// Add this state at the top with your other useState calls
const [score, setScore] = useState<any>(null)

// Replace the setDone(true) line in your submit function with this:
setDone(true)
// Poll Supabase for the score every 5 seconds
const interval = setInterval(async () => {
  const { data } = await supabase
    .from('startups')
    .select('id, ai_scores(*)')
    .eq('name', form.name)
    .single()
  if (data?.ai_scores?.length > 0) {
    setScore(data.ai_scores[0])
    clearInterval(interval)
  }
}, 5000)

// Replace the done ? (...) block with this:
done ? (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
    {score ? (
      <>
        <div className="text-center">
          <div className="text-6xl font-bold text-emerald-400">{score.score_out_of_100}</div>
          <div className="text-zinc-400 text-sm mt-1">AI score out of 100</div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-zinc-500 text-xs mb-1">Market potential</div>
            <div className="text-white font-medium">{score.market_potential}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-zinc-500 text-xs mb-1">Risk level</div>
            <div className="text-white font-medium">{score.risk_level}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-zinc-500 text-xs mb-1">Market size</div>
            <div className="text-white font-medium">{score.market_size_estimate}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-zinc-500 text-xs mb-1">Category</div>
            <div className="text-white font-medium">{score.startup_category}</div>
          </div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
          <div className="text-xs text-zinc-500 mb-1">Why it might win</div>
          <div className="text-sm text-white">{score.why_it_might_win}</div>
        </div>
        {score.red_flags && score.red_flags !== 'None identified' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <div className="text-xs text-zinc-500 mb-1">Red flags</div>
            <div className="text-sm text-white">{score.red_flags}</div>
          </div>
        )}
      </>
    ) : (
      <div className="text-center py-6">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-zinc-400">Analyzing your pitch...</p>
        <p className="text-zinc-600 text-sm mt-1">Usually takes 30–60 seconds</p>
      </div>
    )}
  </div>
) : ( ... your form ... )
