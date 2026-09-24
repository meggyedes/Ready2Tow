import { ReactNode, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Menu, Moon, Sun, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { path: '/', label: 'Főoldal', short: '01' },
  { path: '/calculator', label: 'Vontathatom?', short: '02' },
  { path: '/checklist', label: 'Indulhatok?', short: '03' },
  { path: '/kresz', label: 'Szabályok', short: '04' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    const targetId = decodeURIComponent(location.hash.slice(1))
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="wordmark" aria-label="Ready2Tow főoldal" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>READY<span>2</span>TOW</Link>
          <nav className="desktop-nav" aria-label="Fő navigáció">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className={location.pathname === item.path ? 'active' : ''}>
                <span>{item.short}</span>{item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Váltás világos módra' : 'Váltás sötét módra'} title={theme === 'dark' ? 'Világos mód' : 'Sötét mód'}>
              <Sun className="theme-toggle__sun" />
              <Moon className="theme-toggle__moon" />
            </button>
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
        <div className="site-footer__inner">
          <div className="site-footer__top">
            <div className="site-footer__brand">
              <Link to="/" className="wordmark">READY<span>2</span>TOW</Link>
              <small>Digitális vontatási segédlet.</small>
            </div>
            <div className="site-footer__links">
              <Link className="site-footer__project" to="/projekt">A projektről <span>↗</span></Link>
              <a className="site-footer__creator" href="https://danielsoos.eu" target="_blank" rel="noreferrer">danielsoos.eu <span>↗</span></a>
            </div>
          </div>
          <div className="site-footer__bottom">
            <a href="https://instagram.com/adanisoos" target="_blank" rel="noreferrer">© 2026 Soós Dániel</a>
          </div>
        </div>
      </footer>
      <nav className="bottom-nav" aria-label="Mobil navigáció">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className={location.pathname === item.path ? 'active' : ''}>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
