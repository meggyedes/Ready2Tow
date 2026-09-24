import { ReactNode, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Check, Menu, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const navItems = [
  { path: '/', label: 'Főoldal', short: '01' },
  { path: '/checklist', label: 'Indulhatok?', short: '02' },
  { path: '/kresz', label: 'Szabályok', short: '03' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setOpen(false)
  }, [location.pathname])

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="wordmark" aria-label="Ready2Tow főoldal">READY<span>2</span>TOW</Link>
          <nav className="desktop-nav" aria-label="Fő navigáció">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className={location.pathname === item.path ? 'active' : ''}>
                <span>{item.short}</span>{item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <div className="language-toggle" aria-label="Nyelvválasztó">
              <button className={language === 'hu' ? 'active' : ''} onClick={() => setLanguage('hu')}>HU</button>
              <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
            </div>
            <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Menü" aria-expanded={open}>
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav className="mobile-menu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <span>{item.short}</span>{item.label}
                  {location.pathname === item.path && <Check size={18} />}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <main>
        {children}
      </main>
      <footer className="site-footer">
        <Link to="/" className="wordmark">READY<span>2</span>TOW</Link>
        <p>Digitális útitárs alkalmi vontatáshoz.</p>
        <div><BookOpen size={16} /><span>Indulás előtt mindig ellenőrizd az aktuális hivatalos előírásokat.</span></div>
      </footer>
      <nav className="bottom-nav" aria-label="Mobil navigáció">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className={location.pathname === item.path ? 'active' : ''}>
            <span>{item.short}</span>{item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
