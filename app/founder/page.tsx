'use client'
import { useState } from 'react'
import { Upload, TrendingUp, Eye, Heart } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function FounderDashboard() {
  const [form, setForm] = useState({ name: '', description: '', industry: '', video_url: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [score, setScore] = useState<any>(null)
  const supabase = createClientComponentClient()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setDone(true)
    setSubmitting(false)

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
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-2xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold">Founder dashboard</h1>
          <p className="text-zinc-400 mt-1">Submit your pitch and get an AI score within minutes</p>
        </div>

        {/* Analytics strip */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Eye, label: 'Profile views', val: '—' },
            { icon: Heart, label: 'Investor saves', val: '—' },
            { icon: TrendingUp, label: 'AI score', val: score ? score.score_out_of_100 : '—' },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <Icon className="w-4 h-4 text-zinc-500 mb-2" />
              <div className="text-2xl font-bold">{val}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* After submission */}
        {done ? (
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
        ) : (
          /* Submission form */
          <form onSubmit={submit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4" /> Submit your startup
            </h2>
            {[
              { key: 'name', label: 'Startup name', placeholder: 'e.g. SpaceX' },
              { key: 'video_url', label: 'Pitch video URL', placeholder: 'https://...' },
              { key: 'industry', label: 'Industry', placeholder: 'e.g. SaaS, Fintech, HealthTech' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-sm text-zinc-400 mb-1 block">{label}</label>
                <input
                  value={(form as any)[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                />
              </div>
            ))}
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="What problem does your startup solve?"
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-zinc-200 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit pitch →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
