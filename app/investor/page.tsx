'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
import { Heart, Bookmark, ChevronDown, ChevronUp } from 'lucide-react'

interface Startup {
  id: string
  name: string
  description: string
  industry: string
  video_url: string
  ai_scores?: { score_out_of_100: number; risk_level: string; market_potential: string }[]
}

export default function InvestorDashboard() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [current, setCurrent] = useState(0)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabase
      .from('startups')
      .select('*, ai_scores(*)')
      .order('created_at', { ascending: false })
      .then(({ data }) => data && setStartups(data))
  }, [])

  const startup = startups[current]
  if (!startup) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading feed...</div>

  const score = startup.ai_scores?.[0]

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="relative w-full max-w-sm h-[85vh] bg-[#111] rounded-3xl overflow-hidden border border-white/10">
        {/* Video */}
        <video src={startup.video_url} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />

        {/* AI Score badge */}
        {score && (
          <div className="absolute top-4 right-4 bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-center backdrop-blur">
            <div className="text-2xl font-bold text-emerald-400">{score.score_out_of_100}</div>
            <div className="text-xs text-zinc-400">AI score</div>
          </div>
        )}

        {/* Card info */}
        <div className="absolute bottom-20 left-4 right-16 space-y-1">
          <span className="bg-white/10 text-xs text-zinc-300 px-2 py-0.5 rounded-full">{startup.industry}</span>
          <h2 className="text-xl font-bold text-white">{startup.name}</h2>
          <p className="text-sm text-zinc-300 line-clamp-2">{startup.description}</p>
          {score && (
            <div className="flex gap-2 flex-wrap mt-1">
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Risk: {score.risk_level}</span>
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">{score.market_potential}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="absolute right-3 bottom-20 flex flex-col gap-4 items-center">
          <button className="bg-white/10 p-3 rounded-full backdrop-blur hover:bg-red-500/30 transition">
            <Heart className="w-5 h-5 text-white" />
          </button>
          <button className="bg-white/10 p-3 rounded-full backdrop-blur hover:bg-yellow-500/30 transition">
            <Bookmark className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Nav */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
          <button onClick={() => setCurrent(Math.max(0, current - 1))} className="bg-white/10 p-2 rounded-full">
            <ChevronUp className="w-5 h-5 text-white" />
          </button>
          <span className="text-zinc-500 text-sm self-center">{current + 1} / {startups.length}</span>
          <button onClick={() => setCurrent(Math.min(startups.length - 1, current + 1))} className="bg-white/10 p-2 rounded-full">
            <ChevronDown className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}