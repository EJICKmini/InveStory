export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-4xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Now in private beta
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          The fastest way to discover tomorrow's unicorns
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          AI-powered startup discovery. Watch pitch videos, get instant scores, invest in what matters.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/investor" className="bg-white text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-zinc-200 transition">
            I'm an investor →
          </a>
          <a href="/founder" className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/15 transition">
            I'm a founder →
          </a>
        </div>
      </div>
    </main>
  )
}

