import { ReactNode, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, ClipboardCheck, BookOpen, Compass } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const { language, setLanguage, t } = useLanguage()

  const navItems = [
    { path: '/', icon: Home, label: t('layout.nav.home'), badge: 'HUD' },
    { path: '/checklist', icon: ClipboardCheck, label: t('layout.nav.checklist'), badge: 'CHECK' },
    { path: '/kresz', icon: BookOpen, label: t('layout.nav.rules'), badge: 'KRESZ' },
  ]

  // Scroll to top on route change
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
    })
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-[#08080a] text-white selection:bg-red-600/40 selection:text-white">
      {/* Ambient background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-red-600/[0.06] blur-[140px]" />
        <div className="absolute top-[35%] right-[-5%] w-[400px] h-[400px] rounded-full bg-red-500/[0.04] blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[450px] h-[450px] rounded-full bg-red-700/[0.04] blur-[140px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-40 bg-[#08080a]/85 backdrop-blur-xl border-b border-white/[0.08]"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600/30 to-red-950/40 border border-red-500/50 shadow-glow-red group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-5 h-5 text-red-400 group-hover:rotate-45 transition-transform duration-300" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-[#08080a] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg md:text-xl tracking-tight text-white group-hover:text-red-400 transition-colors">
                  READY<span className="text-red-500">2</span>TOW
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-800/60">
                  BE Cockpit
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                {t('layout.subtitle')}
              </p>
            </div>
          </Link>

          {/* Right Header: System Status & Language Switcher */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#121217] border border-white/10 text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>SYSTEM READY</span>
            </div>

            {/* Language Selector Pill */}
            <div className="flex items-center bg-[#121217] p-1 rounded-xl border border-white/10 shadow-inner">
              <button
                onClick={() => setLanguage('hu')}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all duration-200 ${
                  language === 'hu'
                    ? 'bg-red-600 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                aria-label={t('layout.langHu')}
              >
                HU
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-red-600 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                aria-label={t('layout.langEn')}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-6 pb-28 md:pb-28 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Dock Navigation */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md z-50">
        <div className="bg-[#101015]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/90 p-1.5 ring-1 ring-red-500/20">
          <div className="grid grid-cols-3 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => {
                    if (isActive) {
                      e.preventDefault()
                    }
                  }}
                  className="relative"
                >
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-b from-red-600/25 to-red-950/20 text-white font-semibold border border-red-500/50 shadow-inner'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="relative">
                      <Icon
                        size={20}
                        className={`transition-transform duration-200 ${
                          isActive ? 'text-red-500 stroke-[2.5] scale-110' : 'stroke-2'
                        }`}
                      />
                      {isActive && (
                        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      )}
                    </div>
                    <span className={`text-[11px] mt-1 font-medium tracking-tight ${isActive ? 'text-white font-bold' : ''}`}>
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Layout

