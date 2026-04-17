import { ReactNode, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, ClipboardCheck, BookOpen } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const { language, setLanguage, t } = useLanguage()

  const navItems = [
    { path: '/', icon: Home, label: t('layout.nav.home') },
    { path: '/checklist', icon: ClipboardCheck, label: t('layout.nav.checklist') },
    { path: '/kresz', icon: BookOpen, label: t('layout.nav.rules') },
  ]

  // Scroll to top on route change
  useEffect(() => {
    // Use requestAnimationFrame to ensure scroll happens after render
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
    })
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/68 backdrop-blur-md border-b border-white/70 shadow-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 relative">
          <div className="absolute top-3 right-4 md:top-4 md:right-4 flex items-center gap-2 bg-slate-100/85 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-white/80 shadow-sm">
            <span className="text-xs text-slate-600 hidden md:inline">{t('layout.language')}</span>
            <button
              onClick={() => setLanguage('hu')}
              className={`text-xs px-2 py-1 rounded-md transition-colors ${
                language === 'hu' ? 'bg-white text-blue-700 font-semibold shadow-sm' : 'text-slate-600 hover:bg-white/70'
              }`}
              aria-label={t('layout.langHu')}
            >
              HU
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`text-xs px-2 py-1 rounded-md transition-colors ${
                language === 'en' ? 'bg-white text-blue-700 font-semibold shadow-sm' : 'text-slate-600 hover:bg-white/70'
              }`}
              aria-label={t('layout.langEn')}
            >
              EN
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-center text-slate-900">
            🚗 Ready2Tow
          </h1>
          <p className="text-center text-sm md:text-base text-slate-600 mt-1">
            {t('layout.subtitle')}
          </p>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-20 md:pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.15,
              ease: 'easeInOut'
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-3 left-3 right-3 bg-white/58 backdrop-blur-md shadow-md border border-white/70 rounded-2xl z-50">
        <div className="px-2 md:px-3">
          <div className="flex justify-around items-center py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex-1"
                  onClick={(e) => {
                    // Prevent navigation if already on this page
                    if (isActive) {
                      e.preventDefault()
                    }
                  }}
                >
                  <motion.div
                    whileTap={!isActive ? { scale: 0.95 } : {}}
                    className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-blue-500'
                    }`}
                  >
                    <motion.div
                      animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                    </motion.div>
                    <span className={`text-xs mt-1 font-medium ${
                      isActive ? 'font-bold' : ''
                    }`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-full"
                      />
                    )}
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

