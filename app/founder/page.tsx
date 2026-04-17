'use client'
import { useState } from 'react'
import { Upload, TrendingUp, Eye, Heart } from 'lucide-react'

export default function FounderDashboard() {
  const [form, setForm] = useState({ name: '', description: '', industry: '', video_url: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

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
            { icon: TrendingUp, label: 'AI score', val: '—' },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <Icon className="w-4 h-4 text-zinc-500 mb-2" />
              <div className="text-2xl font-bold">{val}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Submission form */}
        {done ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h2 className="text-xl font-bold text-emerald-400">Pitch submitted!</h2>
            <p className="text-zinc-400 mt-1">Your AI score will be ready in ~2 minutes</p>
          </div>
        ) : (
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
            <button type="submit" disabled={submitting} className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-zinc-200 transition disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit pitch →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}